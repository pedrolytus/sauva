# Estado do Projeto — `.sauva/state.json`

Este arquivo é a peça que torna qualquer projeto **retomável em qualquer
sessão nova, sem custo de recontextualização**. Ele é criado automaticamente
pelo instalador (`npx @lytus/sauva install`) e mantido por você a partir daí.

## Por que isso existe

Sem estado mecânico, cada nova sessão depende de alguém explicar "onde
paramos" — o que não escala para uma pessoa leiga, que não sabe nomear fases
técnicas, e desperdiça tokens relendo tudo pra se situar. Com estado
mecânico, a primeira ação de qualquer skill é ler um arquivo pequeno e saber
exatamente onde retomar.

## Regra de leitura

Toda vez que esta skill (ou o `gestor-<projeto>`, ou qualquer sub-agente) for
acionada, a leitura de `.sauva/state.json` é o **primeiro ato**, antes de
qualquer pergunta à pessoa ou qualquer leitura de `specs/`. Nunca pergunte
"me conta onde vocês pararam" — leia o arquivo.

## Regra de escrita

Sempre que uma fase avança, uma spec é criada/atualizada, uma aprovação é
concedida, ou um bloqueio surge, atualize o arquivo antes de encerrar a
resposta. Escrita é sempre substituição do arquivo inteiro (não é uma spec
de projeto — não se aplica a regra de append-only aqui), já que é um único
objeto de estado pequeno, não um histórico.

## Schema

```json
{
  "versao_schema": "1.0",
  "nome_projeto": "string ou null (definido ao final do Bloco 1 da entrevista)",
  "fase": "nao_iniciado | entrevista_em_andamento | escopo_fechado | desenvolvimento | pausado",
  "ultimo_passo": "string curta identificando o ponto exato (ex: 'bloco_5_regras_dominio')",
  "specs_status": {
    "PRD.md": "ausente | em_andamento | completo",
    "RULES.md": "ausente | em_andamento | completo",
    "ARCHITECTURE.md": "ausente | em_andamento | completo",
    "TASKS.md": "ausente | em_andamento | completo"
  },
  "aprovacoes_pendentes": [
    {
      "gate": "PRD | UI_UX | UAT_incremento | DEPLOY",
      "descricao": "string curta do que precisa aprovação",
      "criado_em": "ISO 8601"
    }
  ],
  "gestor_criado": false,
  "harness_alvo": "claude-code | antigravity | codex | multiplo",
  "atualizado_em": "ISO 8601"
}
```

## Exemplo — projeto recém-iniciado, no meio da entrevista

```json
{
  "versao_schema": "1.0",
  "nome_projeto": "app-lista-compras",
  "fase": "entrevista_em_andamento",
  "ultimo_passo": "bloco_4_nao_objetivos",
  "specs_status": {
    "PRD.md": "em_andamento",
    "RULES.md": "ausente",
    "ARCHITECTURE.md": "ausente",
    "TASKS.md": "ausente"
  },
  "aprovacoes_pendentes": [],
  "gestor_criado": false,
  "harness_alvo": "claude-code",
  "atualizado_em": "2026-07-01T14:32:00Z"
}
```

Nessa sessão seguinte, ao ler esse arquivo, a skill sabe imediatamente:
retomar a entrevista no Bloco 4 (não-objetivos), sem repetir os Blocos 1–3.

## Exemplo — escopo fechado, aguardando aprovação de UI/UX

```json
{
  "versao_schema": "1.0",
  "nome_projeto": "app-lista-compras",
  "fase": "escopo_fechado",
  "ultimo_passo": "wireframe_gerado",
  "specs_status": {
    "PRD.md": "completo",
    "RULES.md": "completo",
    "ARCHITECTURE.md": "completo",
    "TASKS.md": "completo"
  },
  "aprovacoes_pendentes": [
    {
      "gate": "UI_UX",
      "descricao": "Aprovar wireframe da tela principal antes de acionar o gestor",
      "criado_em": "2026-07-01T15:10:00Z"
    }
  ],
  "gestor_criado": false,
  "harness_alvo": "claude-code",
  "atualizado_em": "2026-07-01T15:10:00Z"
}
```

Nessa sessão, a skill sabe que não deve prosseguir para a Fase 3 até essa
aprovação constar como resolvida (removida da lista) — mesmo que a pessoa
simplesmente diga "continua", a skill deve primeiro confirmar essa aprovação
pendente antes de acionar a `skill-creator`.

## Limites deste arquivo

`.sauva/state.json` guarda **ponteiros e status**, nunca conteúdo de
decisão. O conteúdo em si sempre vive nas specs (`PRD.md`, `RULES.md` etc.).
Isso mantém o arquivo pequeno e barato de ler a cada acionamento — ler um
JSON de poucas linhas custa uma fração do que custaria reler `specs/`
inteira toda vez.
