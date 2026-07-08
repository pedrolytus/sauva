# Política de Roteamento de Modelo

Esta política é baseada na documentação atual de Subagents do Claude Code.
Trate como informação técnica que pode evoluir com versões do harness; se
algo aqui parecer desatualizado ao instalar, confira a documentação oficial
do harness antes de seguir ao pé da letra.

## Por que isso existe

O objetivo é simples: não gastar o modelo mais caro com a tarefa mais barata,
e não economizar modelo numa decisão que exige julgamento real. A escolha
nunca é pelo nome da tarefa — é pela natureza do julgamento exigido.

## Descobrir os modelos disponíveis (pergunte antes de preencher qualquer coisa)

Não assuma nomes fixos de modelo (`haiku`/`sonnet`/`opus` ou qualquer
outra família) — o sauva hoje instala em Claude Code, Codex e Antigravity,
cada um com um catálogo de modelos e um plano/assinatura diferente por
pessoa. Antes de gravar `specs/MODEL_ROUTING.md` (Fase 3), pergunte, em
linguagem simples:

> "Pra eu economizar seu orçamento sem perder qualidade nas decisões
> importantes, preciso saber: quais modelos de IA você tem disponíveis no
> seu plano/assinatura desse assistente? Se não souber os nomes exatos, me
> diga qual é o seu plano, ou veja no seu harness a lista de modelos que
> ele oferece pra troca — eu não vou assumir um conjunto padrão."

Com a resposta, mapeie os modelos relatados em três **papéis** — não três
nomes fixos, três posições relativas entre o que a pessoa realmente tem:

- **Mais simples** — o modelo mais leve/rápido/barato disponível. Usado em
  tarefas mecânicas e bem especificadas.
- **Custo-benefício** — o modelo de meio-termo. Usado em implementação
  padrão sobre contrato já fechado — a maior parte do trabalho do dia a dia.
- **Melhor (mais capaz)** — o modelo mais forte disponível. Reservado pra
  julgamento real: arquitetura, segurança, ambiguidade de requisito.

Casos de borda:
- **Só 1 modelo disponível** — registre isso explicitamente em
  `MODEL_ROUTING.md`: não existe roteamento real possível, todo o trabalho
  roda nesse único modelo. Não force três papéis onde só há uma opção.
- **2 modelos disponíveis** — os três papéis colapsam em dois; decida caso
  a caso qual papel cada tarefa realmente precisa (ex.: "custo-benefício"
  e "mais simples" podem apontar pro mesmo modelo se a diferença de custo
  entre os dois for pequena). Deixe essa decisão registrada, não implícita.
- **A pessoa não souber informar** — ofereça uma forma prática de checar
  (ex.: "no Claude Code, `/model` mostra as opções da sua sessão"; adapte
  a orientação ao harness em uso) antes de aceitar uma resposta aproximada.

Isso não é uma pergunta única e definitiva pro resto da vida do projeto —
se a pessoa mencionar um modelo novo mais tarde, ou pedir pra saber por
que você não está usando algo que ela sabe que existe, trate como sinal
pra atualizar (por apêndice, nunca reescrevendo) a seção "Modelos
disponíveis" de `MODEL_ROUTING.md`.

## A mecânica, por harness

### Claude Code — mecanismo nativo
O Claude Code tem dois conceitos distintos, e é importante não confundi-los:
- **Agent Skill** (`.claude/skills/<nome>/SKILL.md`) — conhecimento e
  comportamento reutilizável, sem controle de modelo próprio.
- **Subagent** (`.claude/agents/<nome>.md`) — unidade de execução isolada,
  com prompt de sistema próprio, ferramentas restritas e um campo `model`
  que aceita os aliases `sonnet`, `opus`, `haiku`, um ID de modelo completo,
  ou `inherit` (usa o modelo da conversa principal — comportamento padrão se
  o campo for omitido).

Quando o gestor cria um sub-agente especializado neste harness, ele deve
preferir criar um **Subagent** (não apenas uma skill), justamente para
poder fixar o modelo no frontmatter:

```markdown
---
name: backend-<slug-do-projeto>
description: >
  Implementa endpoints e lógica de domínio de <nome do projeto> seguindo
  specs/API_SPEC.md e specs/ARCHITECTURE.md. Use PROATIVAMENTE para
  qualquer tarefa de backend deste projeto.
tools: Read, Write, Edit, Bash, Grep, Glob
model: <modelo concreto mapeado ao papel "custo-benefício" em specs/MODEL_ROUTING.md>
---

Você implementa a camada de backend de <nome do projeto>. Leia
specs/ARCHITECTURE.md, specs/API_SPEC.md, specs/RULES.md e
specs/TESTS_SPEC.md antes de qualquer tarefa. Siga TDD (Red-Green-Refactor).
Nunca altere testes sem aprovação humana. Devolva ao gestor um resumo claro
do que foi feito e quais testes passaram — não alegue sucesso sem evidência.
```

Skills continuam existindo neste harness para conhecimento mais amplo e
reutilizável entre sessões (ex.: convenções de código do projeto); Subagents
são para execução isolada e roteada por modelo. Os dois podem coexistir.

### Antigravity, Codex e outros harnesses
Esses harnesses, até onde a documentação consultada confirma, não expõem o
mesmo controle granular de modelo por agente individual dentro de um
workflow. Nesse caso, o gestor:
1. Cria o sub-agente como skill especializada (mesmo formato de Agent Skill
   usado no restante do ecossistema), igual ao desenho original.
2. Inclui, no topo do `SKILL.md` do sub-agente, uma nota explícita de
   modelo recomendado (ex.: "Recomendação: rodar com o modelo mais leve
   disponível neste harness — esta tarefa é mecânica e bem especificada").
3. Avisa a pessoa quando uma tarefa de alto risco/arquitetural está prestes
   a rodar, para que ela escolha manualmente o modelo mais capaz disponível
   na sessão, se o harness permitir essa escolha por sessão.

A política (este arquivo) é portátil. A mecânica de aplicação não é —
aplique o que o harness do momento permitir.

## A heurística de escolha

| Natureza da tarefa | Exemplos | Papel do modelo |
|---|---|---|
| Mecânica, bem especificada, verificação rápida | lint, formatação, triagem inicial, checar se uma condição de `/goal`-like foi atingida | **mais simples** |
| Implementação padrão sobre contrato já fechado | endpoint já especificado em API_SPEC.md, teste já escrito esperando o código, CRUD comum | **custo-benefício** |
| Julgamento real: arquitetura, modelagem de domínio, segurança, ambiguidade de requisito | decisão de ADR, revisão de regra de negócio crítica, resolução de spec incompleta | **melhor (mais capaz)** |
| O próprio gestor decompondo/validando rotina | — | herda o modelo da sessão (`inherit`), quando o harness suportar |
| O próprio gestor validando uma entrega de alto risco | aprovar migração de schema, aprovar mudança em regra de segurança | considere subir pro papel **melhor** só para essa validação |

Os nomes concretos por trás de cada papel vêm da seção "Descobrir os
modelos disponíveis" acima — nunca são fixos, dependem do harness e do
plano da pessoa. O que não muda é o princípio: comece pelo papel mais
barato capaz de cumprir o tipo de julgamento exigido, e ao explicar a
escolha pra pessoa (modo Mentor, ver `03-handoff-gestor.md`), use os três
papéis como referência ("usei o custo-benefício aqui porque é
implementação padrão; reservei o melhor pra decisão de arquitetura").

## Escalar em vez de insistir

Quando a verificação do gestor (ver `03-handoff-gestor.md`, seção
"Fiscalização") reprovar o resultado de um sub-agente pela segunda vez na
mesma tarefa, a hipótese mais provável não é "o agente cometeu um erro
aleatório" — é "o papel de modelo alocado não tem capacidade suficiente
para esse julgamento específico". Nesse caso, antes de uma terceira
tentativa no mesmo papel, suba um papel (de mais simples pra
custo-benefício, ou de custo-benefício pra melhor). É o mesmo padrão de um
harness de failover clássico (catálogo em ordem, verificador externo,
troca quando reprova), só que aqui a troca é por capacidade, não por
disponibilidade.

## Template de specs/MODEL_ROUTING.md

O `sauva`, na Fase 3, grava uma cópia adaptada deste arquivo como spec do
próprio projeto, para que o gestor (e qualquer pessoa lendo depois) saiba
exatamente qual foi a política adotada:

```markdown
# Roteamento de Modelo — <nome do projeto>

## Harness alvo
<Claude Code / Antigravity / Codex / múltiplos>

## Modelos disponíveis (confirmado com a pessoa em <data>)
| Papel | Modelo concreto | Observação |
|---|---|---|
| Mais simples | <nome> | |
| Custo-benefício | <nome> | |
| Melhor (mais capaz) | <nome> | |

Se só havia 1 ou 2 modelos disponíveis no momento da confirmação, registre
isso explicitamente aqui em vez de forçar três papéis distintos (ver
"Descobrir os modelos disponíveis" acima).

## Heurística adotada
(copiar e adaptar a tabela de papéis da seção "A heurística de escolha"
acima, ajustando exemplos ao domínio real do projeto)

## Teto de tentativas antes de escalar
<recomendado: 2 reenvios no mesmo papel, depois sobe um papel>

## Onde fica o log de execução
specs/LOG_EXECUCAO.md — uma linha por tarefa concluída: tarefa, modelo
usado, tentativas, resultado.
```
