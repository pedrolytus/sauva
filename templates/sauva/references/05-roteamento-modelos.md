# Política de Roteamento de Modelo

Esta política é baseada na documentação atual de Subagents do Claude Code.
Trate como informação técnica que pode evoluir com versões do harness; se
algo aqui parecer desatualizado ao instalar, confira a documentação oficial
do harness antes de seguir ao pé da letra.

## Por que isso existe

O objetivo é simples: não gastar o modelo mais caro com a tarefa mais barata,
e não economizar modelo numa decisão que exige julgamento real. A escolha
nunca é pelo nome da tarefa — é pela natureza do julgamento exigido.

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
model: sonnet
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

| Natureza da tarefa | Exemplos | Modelo recomendado |
|---|---|---|
| Mecânica, bem especificada, verificação rápida | lint, formatação, triagem inicial, checar se uma condição de `/goal`-like foi atingida | leve (`haiku`) |
| Implementação padrão sobre contrato já fechado | endpoint já especificado em API_SPEC.md, teste já escrito esperando o código, CRUD comum | intermediário (`sonnet`) |
| Julgamento real: arquitetura, modelagem de domínio, segurança, ambiguidade de requisito | decisão de ADR, revisão de regra de negócio crítica, resolução de spec incompleta | mais capaz (`opus`) |
| O próprio gestor decompondo/validando | rotina | herda o modelo da sessão (`inherit`) |
| O próprio gestor validando uma entrega de alto risco | aprovar migração de schema, aprovar mudança em regra de segurança | considere subir para o modelo mais capaz só para essa validação |

Esta tabela não é definitiva — adapte aos modelos disponíveis no momento em
que o projeto for instalado. O que não muda é o princípio: comece pelo
modelo mais barato capaz de cumprir o tipo de julgamento exigido.

## Escalar em vez de insistir

Quando a verificação do gestor (ver `03-handoff-gestor.md`, seção
"Fiscalização") reprovar o resultado de um sub-agente pela segunda vez na
mesma tarefa, a hipótese mais provável não é "o agente cometeu um erro
aleatório" — é "o modelo alocado não tem capacidade suficiente para esse
julgamento específico". Nesse caso, antes de uma terceira tentativa no
mesmo nível, suba um degrau de modelo. É o mesmo padrão de um harness de
failover clássico (catálogo de modelos em ordem, verificador externo, troca
quando reprova), só que aqui a troca é por capacidade, não por
disponibilidade.

## Template de specs/MODEL_ROUTING.md

O `sauva`, na Fase 3, grava uma cópia adaptada deste arquivo como spec do
próprio projeto, para que o gestor (e qualquer pessoa lendo depois) saiba
exatamente qual foi a política adotada:

```markdown
# Roteamento de Modelo — <nome do projeto>

## Harness alvo
<Claude Code / Antigravity / Codex / múltiplos>

## Heurística adotada
(copiar e adaptar a tabela da seção "A heurística de escolha" acima,
ajustando exemplos ao domínio real do projeto)

## Teto de tentativas antes de escalar
<recomendado: 2 reenvios no mesmo modelo, depois escalar>

## Onde fica o log de execução
specs/LOG_EXECUCAO.md — uma linha por tarefa concluída: tarefa, modelo
usado, tentativas, resultado.
```
