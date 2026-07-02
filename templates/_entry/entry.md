# sauva

Este projeto usa o **sauva**: um parceiro de arquitetura e uma equipe de
agentes de IA que conduzem o desenvolvimento de software da ideia até a
entrega, com especificações versionadas como fonte da verdade.

## Como começar

Diga ao seu assistente de IA algo como:

> "Quero começar um projeto novo"

ou, se você já tem um projeto em andamento aqui:

> "Continuar o desenvolvimento"

A skill `sauva` (instalada em `.claude/skills/sauva/` ou
`.agents/skills/sauva/`) vai assumir a partir daí. Ela lê o estado do
projeto automaticamente — não é preciso explicar onde vocês pararam.

## Estrutura criada por este instalador

```
.sauva/state.json          # estado do projeto — não edite manualmente
.claude/skills/sauva/    # skill para Claude Code
.agents/skills/sauva/    # skill universal (outros harnesses)
specs/                       # criado pela sauva na primeira conversa
```

## Comandos úteis

```
npx @lytus/sauva status    # mostra em que fase o projeto está
npx @lytus/sauva update    # atualiza os agentes para a versão mais recente
```

Saiba mais: https://github.com/pedrolytus/sauva
