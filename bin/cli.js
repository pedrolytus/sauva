#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const os = require("os");
const crypto = require("crypto");
const prompts = require("prompts");

const TEMPLATES_DIR = path.join(__dirname, "..", "templates");
const CWD = process.cwd();
const HOME = os.homedir();

// ---------- modo (local vs global) e flags ----------

const args = process.argv.slice(3);
const isGlobal = args.includes("--global") || args.includes("-g");
const yesFlag = args.includes("--yes") || args.includes("-y");
const harnessArg = args.find((a) => a.startsWith("--harness="));
const explicitHarnessIds = harnessArg
  ? harnessArg
      .slice("--harness=".length)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  : null;

// Raiz de trabalho: pasta atual (local) ou home do usuário (global)
const WORK_ROOT = isGlobal ? HOME : CWD;

// ---------- utilitários de arquivo ----------

function hashFile(filePath) {
  const data = fs.readFileSync(filePath);
  return crypto.createHash("sha256").update(data).digest("hex");
}

function listFilesRecursive(dir, base = dir) {
  let results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(listFilesRecursive(full, base));
    } else {
      results.push(path.relative(base, full));
    }
  }
  return results;
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

// ---------- manifesto (para update seguro) ----------

function manifestPath() {
  return path.join(WORK_ROOT, ".sauva", "manifest.json");
}

function loadManifest() {
  const p = manifestPath();
  if (!fs.existsSync(p)) return {};
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function saveManifest(manifest) {
  ensureDir(path.join(WORK_ROOT, ".sauva"));
  fs.writeFileSync(manifestPath(), JSON.stringify(manifest, null, 2));
}

// ---------- harnesses suportados: detecção e destinos de instalação ----------

function detectHarnesses() {
  return [
    {
      id: "claude-code",
      label: "Claude Code",
      // ~/.claude/settings.json é específico de Claude Code (Claude Desktop usa outro local)
      detected: fs.existsSync(path.join(HOME, ".claude", "settings.json")),
      entryFile: "CLAUDE.md",
      localSkillDir: ".claude/skills",
      globalSkillDir: path.join(HOME, ".claude", "skills")
    },
    {
      id: "codex",
      label: "Codex CLI",
      detected: fs.existsSync(path.join(HOME, ".codex", "config.toml")),
      entryFile: "AGENTS.md",
      localSkillDir: ".agents/skills",
      globalSkillDir: null // sem convenção global de skills confirmada pra Codex
    },
    {
      id: "antigravity",
      label: "Antigravity",
      // sinal fraco: ~/.gemini/ é compartilhado com Gemini CLI, não é exclusivo do Antigravity
      detected: fs.existsSync(path.join(HOME, ".gemini")),
      entryFile: "AGENTS.md",
      localSkillDir: ".agents/skills",
      globalSkillDir: path.join(HOME, ".gemini", "config", "skills")
    }
  ];
}

function readPreviousSelection(manifest) {
  if (isGlobal) {
    return Array.isArray(manifest.__harnesses_alvo) ? manifest.__harnesses_alvo : null;
  }
  const p = statePath();
  if (!fs.existsSync(p)) return null;
  try {
    const state = JSON.parse(fs.readFileSync(p, "utf8"));
    return Array.isArray(state.harnesses_alvo) && state.harnesses_alvo.length
      ? state.harnesses_alvo
      : null;
  } catch (e) {
    return null;
  }
}

async function promptHarnessSelection(harnesses) {
  console.log("");
  const response = await prompts(
    {
      type: "multiselect",
      name: "selected",
      message: "Quais harnesses de IA você quer instalar o sauva?",
      hint: "Espaço marca, 'a' marca/desmarca todos, Enter confirma",
      choices: harnesses.map((h) => ({
        title: h.label + (h.detected ? " (detectado)" : ""),
        value: h.id,
        selected: h.detected
      }))
    },
    {
      onCancel: () => {
        console.log("\nInstalação cancelada.");
        process.exit(1);
      }
    }
  );
  return harnesses.filter((h) => (response.selected || []).includes(h.id));
}

async function resolveHarnessSelection(detected, previousSelection) {
  if (explicitHarnessIds) {
    const chosen = detected.filter((h) => explicitHarnessIds.includes(h.id));
    if (chosen.length === 0) {
      console.log(
        `Aviso: nenhum harness reconhecido em --harness=${explicitHarnessIds.join(",")} ` +
          `(opções válidas: ${detected.map((h) => h.id).join(", ")}).`
      );
    }
    return chosen;
  }
  if (previousSelection) {
    return detected.filter((h) => previousSelection.includes(h.id));
  }
  if (yesFlag || !process.stdin.isTTY) {
    const autoDetected = detected.filter((h) => h.detected);
    // não-interativo e nada detectado: preserva o comportamento legado (instala em tudo)
    return autoDetected.length ? autoDetected : detected;
  }
  return promptHarnessSelection(detected);
}

function getInstallTargets(selectedHarnesses) {
  const targets = new Map();
  for (const h of selectedHarnesses) {
    if (isGlobal) {
      if (!h.globalSkillDir) {
        console.log(
          `  ! ${h.label}: sem convenção global de skills confirmada. Instale localmente ` +
            `neste harness (sem --global) em cada projeto.`
        );
        continue;
      }
      if (!targets.has(h.globalSkillDir)) {
        targets.set(h.globalSkillDir, { name: h.globalSkillDir, root: h.globalSkillDir });
      }
    } else {
      const root = path.join(CWD, h.localSkillDir);
      if (!targets.has(root)) {
        targets.set(root, { name: h.localSkillDir, root });
      }
    }
  }
  return Array.from(targets.values());
}

// ---------- estado inicial (só existe em modo local, é por projeto) ----------

function statePath() {
  return path.join(CWD, ".sauva", "state.json");
}

function writeInitialState(harnessesAlvo) {
  const p = statePath();
  if (fs.existsSync(p)) return false;
  ensureDir(path.join(CWD, ".sauva"));
  const state = {
    versao_schema: "1.1",
    nome_projeto: null,
    fase: "nao_iniciado",
    ultimo_passo: null,
    modo: null,
    specs_status: {
      "PRD.md": "ausente",
      "RULES.md": "ausente",
      "ARCHITECTURE.md": "ausente",
      "TASKS.md": "ausente"
    },
    aprovacoes_pendentes: [],
    gestor_criado: false,
    harnesses_alvo: harnessesAlvo || [],
    atualizado_em: new Date().toISOString()
  };
  fs.writeFileSync(p, JSON.stringify(state, null, 2));
  return true;
}

function persistSelectionInExistingState(harnessesAlvo) {
  const p = statePath();
  if (!fs.existsSync(p)) return;
  const state = JSON.parse(fs.readFileSync(p, "utf8"));
  state.harnesses_alvo = harnessesAlvo;
  state.atualizado_em = new Date().toISOString();
  fs.writeFileSync(p, JSON.stringify(state, null, 2));
}

// ---------- instalação de uma skill em um destino, com manifesto ----------

function installSkillInto(skillName, destRoot, manifest) {
  const srcDir = path.join(TEMPLATES_DIR, skillName);
  const destDir = path.join(destRoot, skillName);
  const files = listFilesRecursive(srcDir);
  let written = 0;
  let skipped = 0;

  for (const rel of files) {
    const srcFile = path.join(srcDir, rel);
    const destFile = path.join(destDir, rel);
    const manifestKey = path.relative(WORK_ROOT, destFile).split(path.sep).join("/");

    if (fs.existsSync(destFile)) {
      const currentHash = hashFile(destFile);
      const knownHash = manifest[manifestKey];
      if (knownHash && currentHash !== knownHash) {
        // pessoa customizou este arquivo — nunca sobrescrever
        skipped++;
        continue;
      }
    }

    ensureDir(path.dirname(destFile));
    fs.copyFileSync(srcFile, destFile);
    manifest[manifestKey] = hashFile(destFile);
    written++;
  }

  return { written, skipped };
}

// ---------- comandos ----------

async function cmdInstall() {
  console.log(`sauva — instalando (${isGlobal ? "global, disponível em qualquer projeto" : "local, nesta pasta"})...\n`);

  const manifest = loadManifest();
  const detected = detectHarnesses();
  const previousSelection = readPreviousSelection(manifest);
  const selectedHarnesses = await resolveHarnessSelection(detected, previousSelection);

  if (selectedHarnesses.length === 0) {
    console.log("Nenhum harness selecionado — instalação cancelada.");
    return;
  }

  const targets = getInstallTargets(selectedHarnesses);
  for (const target of targets) {
    const { written, skipped } = installSkillInto("sauva", target.root, manifest);
    console.log(`  ${target.name}/sauva/  → ${written} arquivo(s) instalado(s)` +
      (skipped ? `, ${skipped} preservado(s) por customização` : ""));
  }

  const selectedIds = selectedHarnesses.map((h) => h.id);
  if (isGlobal) {
    manifest.__harnesses_alvo = selectedIds;
  }
  saveManifest(manifest);

  if (isGlobal) {
    console.log("\nInstalado globalmente. A skill `sauva` fica disponível em QUALQUER");
    console.log("projeto que você abrir no seu assistente de IA — não precisa rodar o");
    console.log("instalador de novo em cada pasta. O estado de cada projeto (.sauva/state.json)");
    console.log("continua sendo criado individualmente, dentro da pasta de cada projeto,");
    console.log("na primeira vez que você disser \"Quero começar um projeto novo\" nela.\n");
    console.log("Nota: escopo global confirmado para Claude Code (~/.claude/skills/) e");
    console.log("Antigravity (~/.gemini/config/skills/). Codex CLI ainda não tem uma");
    console.log("convenção global de skills documentada — para ele, instale localmente");
    console.log("(sem --global) em cada projeto.\n");
    return;
  }

  // entry points (só em modo local, é conteúdo específico de projeto)
  const entryContent = fs.readFileSync(path.join(TEMPLATES_DIR, "_entry", "entry.md"), "utf8");
  const entryFiles = new Set(selectedHarnesses.map((h) => h.entryFile));
  for (const entryName of entryFiles) {
    const p = path.join(CWD, entryName);
    if (!fs.existsSync(p)) {
      fs.writeFileSync(p, entryContent);
      console.log(`  + ${entryName}`);
    } else {
      console.log(`  = ${entryName} já existe, preservado`);
    }
  }

  const createdState = writeInitialState(selectedIds);
  if (createdState) {
    console.log("  + .sauva/state.json");
  } else {
    console.log("  = .sauva/state.json já existe, preservado");
    persistSelectionInExistingState(selectedIds);
  }

  console.log("\nPronto. Abra este projeto no seu assistente de IA e diga:");
  console.log('  "Quero começar um projeto novo"\n');
}

async function cmdUpdate() {
  if (!fs.existsSync(manifestPath())) {
    console.log(`Nenhuma instalação ${isGlobal ? "global" : "local"} do sauva encontrada.`);
    console.log(`Rode primeiro: npx @lytus/sauva install${isGlobal ? " --global" : ""}`);
    return;
  }
  console.log(`sauva — atualizando (${isGlobal ? "global" : "local"}) para a versão mais recente...\n`);
  console.log("Arquivos que você personalizou não serão sobrescritos.\n");
  await cmdInstall();
}

function cmdStatus() {
  const p = statePath();
  if (!fs.existsSync(p)) {
    console.log("Nenhum projeto sauva encontrado neste diretório.");
    console.log("(status é sempre por projeto, mesmo com a skill instalada globalmente —");
    console.log("rode este comando de dentro da pasta do projeto que quer consultar.)");
    return;
  }
  const state = JSON.parse(fs.readFileSync(p, "utf8"));

  const faseLabel = {
    nao_iniciado: "Ainda não iniciado",
    entrevista_em_andamento: "Entrevista em andamento",
    escopo_fechado: "Escopo fechado, aguardando início do desenvolvimento",
    desenvolvimento: "Em desenvolvimento",
    pausado: "Pausado"
  }[state.fase] || state.fase;

  const modoLabel = {
    autopilot: "Autopilot",
    mentor: "Mentor",
    dev: "Dev"
  }[state.modo] || "Ainda não escolhido";

  console.log(`Projeto:        ${state.nome_projeto || "(ainda sem nome)"}`);
  console.log(`Fase:           ${faseLabel}`);
  console.log(`Modo:           ${modoLabel}`);
  console.log(`Último passo:   ${state.ultimo_passo || "-"}`);
  console.log(`Harnesses:      ${(state.harnesses_alvo && state.harnesses_alvo.length) ? state.harnesses_alvo.join(", ") : "-"}`);
  console.log(`Gestor criado:  ${state.gestor_criado ? "sim" : "não"}`);
  if (state.aprovacoes_pendentes && state.aprovacoes_pendentes.length) {
    console.log(`\nAprovações pendentes:`);
    for (const a of state.aprovacoes_pendentes) {
      console.log(`  - [${a.gate}] ${a.descricao}`);
    }
  }
  console.log(`\nAtualizado em:  ${state.atualizado_em}`);
}

function cmdHelp() {
  console.log(`sauva — uso:

  npx @lytus/sauva install             instala neste projeto (local)
  npx @lytus/sauva install --global    instala uma vez, disponível em qualquer projeto
  npx @lytus/sauva update [--global]   atualiza preservando customizações
  npx @lytus/sauva status              mostra em que fase o projeto atual está

Seleção de harness (Claude Code, Codex, Antigravity):
  --harness=claude-code,codex   instala só nos harnesses listados, sem perguntar
  -y, --yes                    aceita os harnesses detectados automaticamente

Sem essas flags, o instalador detecta o que está instalado na sua máquina e
pergunta interativamente quais harnesses você quer usar (Enter aceita os
detectados). Em ambientes não-interativos (scripts, CI), o comportamento de
-y é usado automaticamente. Rodar "update" reaproveita a seleção feita no
último "install", sem perguntar de novo.

Dica: com "npm install -g @lytus/sauva" feito uma vez, você pode digitar
apenas "sauva install" (sem "npx") de qualquer lugar depois disso.
`);
}

// ---------- entrada ----------

async function main() {
  const cmd = process.argv[2];
  switch (cmd) {
    case "install":
      await cmdInstall();
      break;
    case "update":
      await cmdUpdate();
      break;
    case "status":
      cmdStatus();
      break;
    default:
      cmdHelp();
  }
}

main();
