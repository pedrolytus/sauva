# sauva

**Um parceiro de arquitetura e uma equipe de agentes de IA que levam um projeto de software da ideia até a entrega — com especificações versionadas como fonte da verdade, não vibe coding.**

Instala em segundos, sem configuração manual:

```bash
npx @lytus/sauva install
```

Isso cria a skill `sauva` no seu harness de IA (Claude Code, Antigravity, ou qualquer ambiente compatível com o padrão Agent Skills), e um arquivo de estado que torna qualquer projeto retomável, em qualquer sessão nova, sem precisar reexplicar onde vocês pararam.

## Por que existe

Agentes de IA aceleram o desenvolvimento de software — mas sem processo, eles só aceleram o caos: código funcional que ninguém revisou, requisito que ninguém escreveu, decisão que existiu só numa conversa e sumiu. O `sauva` existe pra resolver exatamente isso, sem exigir que quem tem a ideia saiba programar.

O fluxo funciona em três papéis:

1. **`sauva`** — entrevista a pessoa em linguagem simples (sem jargão técnico), captura a ideia, as regras de negócio, o estilo visual (aceita prints de inspiração), e grava tudo como especificação versionada em `specs/`.
2. **Gestor do projeto** — criado automaticamente quando o escopo fecha. Decompõe o backlog, decide o que implementar direto e o que delegar, e **fiscaliza** cada entrega com verificação objetiva antes de aceitar — nunca aceita um "está pronto" sem prova.
3. **Sub-agentes especializados** — criados pelo gestor conforme a necessidade de cada área (backend, testes, deploy), cada um só com o contexto que precisa.

A pessoa dona do projeto mantém dois gates formais que nenhum agente pula: aprovação de UI/UX (com mockup visual real, não documento pra ler) e teste de uso real a cada incremento entregue.

## Uso

**Local** — instala só neste projeto (recomendado pra começar):
```bash
npx @lytus/sauva install
```

**Global** — instala uma vez, fica disponível em qualquer projeto que você abrir depois, sem precisar rodar o instalador de novo em cada pasta:
```bash
npx @lytus/sauva install --global
```
No modo global, o estado de cada projeto continua sendo criado individualmente — a skill cria o `.sauva/state.json` sozinha na primeira vez que você iniciar um projeto naquela pasta.

**Outros comandos:**
```bash
npx @lytus/sauva status              # em que fase o projeto atual está
npx @lytus/sauva update [--global]   # atualiza os agentes (preserva customizações)
```

Prefere digitar sem `npx` toda vez? Instale a CLI globalmente uma única vez:
```bash
npm install -g @lytus/sauva
sauva install --global
```

Depois de instalado, abra a pasta no seu harness de IA e diga:

> "Quero começar um projeto novo"

ou, se já existe um projeto em andamento:

> "Continuar o desenvolvimento"

## O que é instalado

```
.sauva/state.json           # estado do projeto — não editar manualmente
.claude/skills/sauva/        # skill para Claude Code
.agents/skills/sauva/        # skill universal (outros harnesses)
CLAUDE.md, AGENTS.md         # pontos de entrada lidos pelo harness
specs/                        # criado na primeira conversa
```

## Requisitos

- Node.js 18 ou superior
- Um harness de IA com suporte a Agent Skills (Claude Code, Antigravity, ou compatível)

## Licença

MIT — veja [LICENSE](./LICENSE).

---

Um projeto de [Pedro](https://github.com/pedrolytus) — LYTUS Inteligência de Negócios.
