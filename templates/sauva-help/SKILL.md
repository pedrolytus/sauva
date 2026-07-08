---
name: sauva-help
description: >
  Lista todos os comandos do sauva — instalação, atualização, status,
  desinstalação e os comandos disponíveis dentro da conversa. Use quando o
  usuário perguntar "quais comandos o sauva tem", "como desinstalo o
  sauva", "ajuda do sauva", "sauva help", ou pedir uma lista de comandos.
---

# Comandos do sauva

Apresente esta lista formatada pra pessoa, sem adicionar comando que não
está aqui — se algo perguntado não existir, diga isso claramente em vez de
inventar uma sintaxe plausível.

## CLI (terminal, fora da conversa)

Use sempre a tag `@latest` explícita — `npx @lytus/sauva` sem versão pode
resolver de forma ambígua pelo cache do npx em algumas instalações Windows.

| Comando | O que faz |
|---|---|
| `npx @lytus/sauva@latest install` | Instala neste projeto (local). Detecta harnesses de IA instalados e pergunta quais usar. |
| `npx @lytus/sauva@latest install --global` | Instala uma vez, disponível em qualquer projeto depois. |
| `npx @lytus/sauva@latest install --harness=claude-code,codex` | Instala só nos harnesses listados, sem perguntar. |
| `npx @lytus/sauva@latest install -y` | Aceita os harnesses detectados automaticamente, sem perguntar. |
| `npx @lytus/sauva@latest update [--global]` | Atualiza os agentes pra versão mais recente, preservando customizações. |
| `npx @lytus/sauva@latest status` | Mostra fase, modo de condução e harnesses do projeto atual. |
| `npx @lytus/sauva@latest uninstall [--global] [--harness=...]` | Remove os arquivos de skill instalados. Nunca apaga `.sauva/state.json` nem `CLAUDE.md`/`AGENTS.md` automaticamente. |
| `npx @lytus/sauva@latest` (sem argumento) ou `--help` | Mostra a ajuda do CLI. |

Se instalado globalmente com `npm install -g @lytus/sauva`, os comandos
acima também funcionam sem o `npx` na frente (ex.: `sauva install`) — mas
no Windows isso depende do PATH ter a pasta global do npm; se `sauva`
sozinho não for reconhecido, volte a usar `npx @lytus/sauva@latest`.

## Dentro da conversa com o harness de IA

| Comando | O que faz |
|---|---|
| `/sauva` | Aciona a skill principal diretamente — equivalente a dizer "continuar o desenvolvimento" ou "novo projeto". |
| `/sauva-help` | Mostra esta lista de comandos. |
| `/gestor-<nome-do-projeto>` | Criado automaticamente na Fase 3 (handoff), depois que o escopo fecha — conduz a implementação. O nome exato depende do projeto. |

## Gatilhos por linguagem natural (não exigem `/`)

O sauva foi pensado pra ser conduzido por conversa, não por comandos
decorados. Essas frases (ou variações próximas) acionam a skill principal
automaticamente, sem precisar digitar `/sauva`:
- "Quero começar um projeto novo"
- "Continuar o desenvolvimento"
- "Revisão geral" / "auditoria do projeto" / "o produto está conforme a spec?"

## Se `/sauva` não aparecer no menu de comandos

Isso quase sempre acontece logo depois de uma instalação nova. O harness de
IA só passa a vigiar um diretório de skills recém-criado (`.claude/skills/`
ou equivalente) na inicialização da sessão — **reinicie a sessão do harness
(saia e abra de novo)** depois de instalar. Se persistir depois de
reiniciar, confirme que você está na mesma pasta onde rodou o `install`.
