# Comandos do sauva

Referência completa: o que roda no terminal e o que roda dentro da
conversa com o harness de IA.

## CLI (terminal)

| Comando | O que faz |
|---|---|
| `npx @lytus/sauva install` | Instala neste projeto (local). Detecta harnesses de IA instalados na máquina e pergunta interativamente quais você quer usar (Enter aceita os detectados). |
| `npx @lytus/sauva install --global` | Instala uma vez, disponível em qualquer projeto que você abrir depois. O `.sauva/state.json` de cada projeto continua sendo criado individualmente. |
| `npx @lytus/sauva install --harness=claude-code,codex` | Instala só nos harnesses listados, sem prompt interativo. IDs válidos: `claude-code`, `codex`, `antigravity`. |
| `npx @lytus/sauva install -y` / `--yes` | Aceita os harnesses detectados automaticamente, sem perguntar. Usado automaticamente em ambientes não-interativos (scripts, CI). |
| `npx @lytus/sauva update [--global]` | Atualiza os agentes para a versão mais recente. Arquivos que você personalizou (hash diferente do template original) nunca são sobrescritos. Reaproveita a seleção de harness feita no último `install`, sem perguntar de novo. |
| `npx @lytus/sauva status` | Mostra projeto, fase, modo de condução (Autopilot/Mentor/Dev), último passo, harnesses instalados e aprovações pendentes. |
| `npx @lytus/sauva uninstall [--global]` | Remove os diretórios de skill instalados (`sauva` e `sauva-help`) dos harnesses selecionados. **Nunca apaga** `.sauva/state.json` (progresso do projeto) nem `CLAUDE.md`/`AGENTS.md` (podem ter conteúdo seu além do sauva) — esses ficam pra remoção manual, se você quiser. |
| `npx @lytus/sauva uninstall --harness=codex` | Desinstala só do harness listado, sem perguntar. |
| `npx @lytus/sauva` (sem argumento), `--help`, `-h` | Mostra a ajuda do CLI. |

Se você instalou a CLI globalmente com `npm install -g @lytus/sauva`, todos
os comandos acima funcionam sem o `npx` na frente: `sauva install`, `sauva
status`, etc.

## Dentro da conversa com o harness de IA

Depois de instalado, o sauva vive dentro da sua conversa com o assistente
— não é preciso decorar sintaxe de comando pra maior parte do uso.

| Comando | O que faz |
|---|---|
| `/sauva` | Aciona a skill principal diretamente. Equivalente a dizer "quero começar um projeto novo" ou "continuar o desenvolvimento" — a skill lê `.sauva/state.json` e decide sozinha em que fase retomar. |
| `/sauva-help` | Mostra a lista de comandos (esta mesma referência, resumida). |
| `/gestor-<nome-do-projeto>` | Não vem pré-instalado — é criado automaticamente pelo próprio `sauva` na Fase 3 (handoff), depois que o escopo do projeto fecha. Conduz a implementação a partir daí. O nome exato do comando depende do nome do seu projeto. |

### Gatilhos por linguagem natural (não exigem `/`)

O jeito recomendado de usar o sauva é por conversa, não por comando
decorado. Estas frases (ou variações próximas) acionam a skill principal
automaticamente:

- "Quero começar um projeto novo"
- "Continuar o desenvolvimento"
- "Revisão geral", "auditoria do projeto", "o produto está conforme a spec?"

## Solução de problemas

### `/sauva` não aparece no menu de comandos

Causa mais comum: o harness de IA só passa a vigiar um diretório de skills
recém-criado (`.claude/skills/`, `.agents/skills/` etc.) na **inicialização
da sessão**. Se você rodou `npx @lytus/sauva install` com a sessão do
assistente já aberta, ele não vai enxergar o diretório novo até você
reiniciar.

**Solução:** saia da sessão do harness (Claude Code, Codex, Antigravity) e
abra de novo na mesma pasta.

Se persistir depois de reiniciar, confira:
1. Você está na mesma pasta onde rodou o `install`? (`npx @lytus/sauva
   status` deve reconhecer o projeto.)
2. O diretório `.claude/skills/sauva/SKILL.md` (ou `.agents/skills/sauva/SKILL.md`,
   dependendo do harness) existe de fato?
3. O harness tem alguma configuração de `skillOverrides` ou permissão que
   esteja escondendo skills de terceiros? Confira as configurações do
   harness.

### `npx @lytus/sauva update` diz que não há instalação

Rode primeiro `npx @lytus/sauva install` (local) ou `--global`, conforme o
escopo que você quer atualizar — `update` não instala do zero.
