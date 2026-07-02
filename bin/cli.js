#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const os = require("os");
const crypto = require("crypto");

const TEMPLATES_DIR = path.join(__dirname, "..", "templates");
const CWD = process.cwd();
const HOME = os.homedir();

// ---------- modo (local vs global) ----------

const args = process.argv.slice(3);
const isGlobal = args.includes("--global") || args.includes("-g");

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

// ---------- estado inicial (só existe em modo local, é por projeto) ----------

function statePath() {
  return path.join(CWD, ".sauva", "state.json");
}

function writeInitialState() {
  const p = statePath();
  if (fs.existsSync(p)) return false;
  ensureDir(path.join(CWD, ".sauva"));
  const state = {
    versao_schema: "1.0",
    nome_projeto: null,
    fase: "nao_iniciado",
    ultimo_passo: null,
    specs_status: {
      "PRD.md": "ausente",
      "RULES.md": "ausente",
      "ARCHITECTURE.md": "ausente",
      "TASKS.md": "ausente"
    },
    aprovacoes_pendentes: [],
    gestor_criado: false,
    harness_alvo: null,
    atualizado_em: new Date().toISOString()
  };
  fs.writeFileSync(p, JSON.stringify(state, null, 2));
  return true;
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

function cmdInstall() {
  console.log(`sauva — instalando (${isGlobal ? "global, disponível em qualquer projeto" : "local, nesta pasta"})...\n`);

  const manifest = loadManifest();

  const targets = isGlobal
    ? [
        { name: "~/.claude/skills", root: path.join(HOME, ".claude", "skills") },
        { name: "~/.agents/skills", root: path.join(HOME, ".agents", "skills") }
      ]
    : [
        { name: ".claude/skills", root: path.join(CWD, ".claude", "skills") },
        { name: ".agents/skills", root: path.join(CWD, ".agents", "skills") }
      ];

  for (const target of targets) {
    const { written, skipped } = installSkillInto("sauva", target.root, manifest);
    console.log(`  ${target.name}/sauva/  → ${written} arquivo(s) instalado(s)` +
      (skipped ? `, ${skipped} preservado(s) por customização` : ""));
  }

  saveManifest(manifest);

  if (isGlobal) {
    console.log("\nInstalado globalmente. A skill `sauva` fica disponível em QUALQUER");
    console.log("projeto que você abrir no seu assistente de IA — não precisa rodar o");
    console.log("instalador de novo em cada pasta. O estado de cada projeto (.sauva/state.json)");
    console.log("continua sendo criado individualmente, dentro da pasta de cada projeto,");
    console.log("na primeira vez que você disser \"Quero começar um projeto novo\" nela.\n");
    console.log("Nota: o escopo global foi confirmado para Claude Code (~/.claude/skills/).");
    console.log("Para outros harnesses, confirme na documentação deles se ~/.agents/skills/");
    console.log("é de fato lido globalmente — o padrão pode variar entre ferramentas.\n");
    return;
  }

  // entry points (só em modo local, é conteúdo específico de projeto)
  const entryContent = fs.readFileSync(path.join(TEMPLATES_DIR, "_entry", "entry.md"), "utf8");
  for (const entryName of ["CLAUDE.md", "AGENTS.md"]) {
    const p = path.join(CWD, entryName);
    if (!fs.existsSync(p)) {
      fs.writeFileSync(p, entryContent);
      console.log(`  + ${entryName}`);
    } else {
      console.log(`  = ${entryName} já existe, preservado`);
    }
  }

  const createdState = writeInitialState();
  console.log(createdState ? "  + .sauva/state.json" : "  = .sauva/state.json já existe, preservado");

  console.log("\nPronto. Abra este projeto no seu assistente de IA e diga:");
  console.log('  "Quero começar um projeto novo"\n');
}

function cmdUpdate() {
  if (!fs.existsSync(manifestPath())) {
    console.log(`Nenhuma instalação ${isGlobal ? "global" : "local"} do sauva encontrada.`);
    console.log(`Rode primeiro: npx @lytus/sauva install${isGlobal ? " --global" : ""}`);
    return;
  }
  console.log(`sauva — atualizando (${isGlobal ? "global" : "local"}) para a versão mais recente...\n`);
  console.log("Arquivos que você personalizou não serão sobrescritos.\n");
  cmdInstall();
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

  console.log(`Projeto:        ${state.nome_projeto || "(ainda sem nome)"}`);
  console.log(`Fase:           ${faseLabel}`);
  console.log(`Último passo:   ${state.ultimo_passo || "-"}`);
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

Dica: com "npm install -g @lytus/sauva" feito uma vez, você pode digitar
apenas "sauva install" (sem "npx") de qualquer lugar depois disso.
`);
}

// ---------- entrada ----------

const cmd = process.argv[2];

switch (cmd) {
  case "install":
    cmdInstall();
    break;
  case "update":
    cmdUpdate();
    break;
  case "status":
    cmdStatus();
    break;
  default:
    cmdHelp();
}
