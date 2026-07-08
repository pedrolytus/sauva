# sauva

**Um parceiro de arquitetura e uma equipe de agentes de IA que levam um projeto de software da ideia até a entrega — com especificações versionadas como fonte da verdade, não vibe coding.**

Instala em segundos, sem configuração manual:

```bash
npx @lytus/sauva@latest install
```

O instalador detecta quais harnesses de IA (Claude Code, Codex, Antigravity) já estão na sua máquina e pergunta em quais você quer instalar — Enter aceita os detectados automaticamente. Isso cria a skill `sauva` no(s) harness(es) escolhido(s), e um arquivo de estado que torna qualquer projeto retomável, em qualquer sessão nova, sem precisar reexplicar onde vocês pararam.

## Modos de condução

Logo no início, o `sauva` pergunta como você quer ser conduzido:

- **Autopilot** — decide a maior parte sozinho e só chama você pra revisar o resultado. Pra quem quer ir rápido e confia no critério do agente.
- **Mentor** (padrão) — explica cada decisão importante antes de seguir, como um tutorial. Pra quem quer aprender a tomar decisão de arquitetura no processo.
- **Dev** — direto ao ponto, sem explicações básicas, pra quem já manja de engenharia de software e quer que o `sauva` escreva código, não dê aula.

O modo pode ser trocado a qualquer momento ("muda pro modo dev daqui pra frente"). Em qualquer modo, os dois gates de aprovação humana (UI/UX e uso real a cada incremento) nunca são pulados.

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
npx @lytus/sauva@latest install
```

**Global** — instala uma vez, fica disponível em qualquer projeto que você abrir depois, sem precisar rodar o instalador de novo em cada pasta:
```bash
npx @lytus/sauva@latest install --global
```
No modo global, o estado de cada projeto continua sendo criado individualmente — a skill cria o `.sauva/state.json` sozinha na primeira vez que você iniciar um projeto naquela pasta.

**Outros comandos:**
```bash
npx @lytus/sauva@latest status              # em que fase o projeto atual está
npx @lytus/sauva@latest update [--global]   # atualiza os agentes (preserva customizações)
npx @lytus/sauva@latest uninstall [--global] # remove os arquivos de skill instalados
```

Sempre use a tag `@latest` explícita — `npx @lytus/sauva` sem versão pode resolver de forma ambígua pelo cache do npx em algumas instalações Windows (veja [Solução de problemas](./COMANDOS.md#solução-de-problemas)).

Lista completa de comandos (CLI e os que rodam dentro da conversa, como `/sauva` e `/sauva-help`): veja [COMANDOS.md](./COMANDOS.md).

Prefere digitar sem `npx` toda vez? Instale a CLI globalmente uma única vez:
```bash
npm install -g @lytus/sauva
sauva install --global
```
No Windows, se depois disso o comando `sauva` não for reconhecido, a pasta
global de binários do npm provavelmente não está no PATH do sistema —
enquanto não resolver isso, use `npx @lytus/sauva@latest` no lugar de `sauva`.

Depois de instalado, abra a pasta no seu harness de IA e diga:

> "Quero começar um projeto novo"

ou, se já existe um projeto em andamento:

> "Continuar o desenvolvimento"

Também dá pra acionar direto com `/sauva`, ou ver todos os comandos disponíveis com `/sauva-help`. Se `/sauva` não aparecer logo após instalar, reinicie a sessão do harness — ele só passa a vigiar um diretório de skills novo na inicialização (detalhes em [COMANDOS.md](./COMANDOS.md#solução-de-problemas)).

## O que é instalado

Só nos harnesses selecionados na hora do `install` (nunca todos por padrão):

```
.sauva/state.json       # estado do projeto — não editar manualmente
.claude/skills/sauva/    # skill para Claude Code, se selecionado
.agents/skills/sauva/    # skill para Codex e/ou Antigravity, se selecionado(s)
CLAUDE.md e/ou AGENTS.md # pontos de entrada, conforme harness(es) escolhido(s)
specs/                   # criado na primeira conversa
```

Automação/CI: use `--harness=claude-code,codex` para instalar sem prompt, ou `-y`/`--yes` para aceitar os harnesses detectados automaticamente.

## Requisitos

- Node.js 18 ou superior
- Um harness de IA com suporte a Agent Skills (Claude Code, Codex, Antigravity, ou compatível)

## Licença

MIT — veja [LICENSE](./LICENSE).

---

Um projeto de [Pedro](https://github.com/pedrolytus) — LYTUS Inteligência de Negócios.
