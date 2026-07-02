# Templates de Specs

Modelos para os arquivos dentro de `specs/`. Crie apenas os arquivos
relevantes ao projeto — um script pessoal não precisa de
`DATABASE_SCHEMA.md`; um sistema com API e múltiplos usuários provavelmente
precisa de quase todos.

Estrutura no repositório:

```
projeto/
  specs/
    PRD.md
    RULES.md
    ARCHITECTURE.md
    TECH_STACK.md
    DESIGN.md
    CULTURA_DEV.md         # copiado do template + exemplos na linguagem real, ver Bloco 7 da entrevista
    inspiracoes/          # prints/imagens de referência, se o harness tiver arquivos
    API_SPEC.md
    DATABASE_SCHEMA.md
    TESTS_SPEC.md
    SECURITY.md
    DEPLOY.md              # pule se o projeto nunca for publicado/implantado fora da máquina de quem cria
    AGENTS.md
    TASKS.md
    GLOSSARY.md
    MODEL_ROUTING.md      # criado na Fase 3, ver references/05-roteamento-modelos.md
    LOG_EXECUCAO.md        # criado e mantido pelo(a) gestor(a) a partir da Fase 3
  src/
  tests/
```

---

## PRD.md

```markdown
# PRD: <nome do projeto>

## Visão
<o problema que estamos resolvendo, em uma frase>

## Persona alvo
<quem usa, em que contexto, com que frequência>

## Jobs to be done
- <tarefa principal que a pessoa quer cumprir>
- <tarefa secundária>

## Objetivos do produto
- <objetivo 1, mensurável>
- <objetivo 2, mensurável>

## Critérios de sucesso
- <métrica observável após o lançamento>

## Não objetivos
- <o que esse projeto NÃO vai fazer, para evitar escopo aberto>

## Riscos conhecidos
- <hipóteses que ainda não foram validadas>
```

---

## RULES.md

```markdown
# Regras invariantes

## Domínio
R1. <regra numerada, verificável>
R2. <regra numerada, verificável>

## Segurança
S1. <regra numerada, verificável>

## Performance
P1. <regra numerada, verificável>

## Compliance
C1. <regra numerada, verificável>
```

Cada regra precisa ser citável por identificador (ex.: "valida R3") e
testável objetivamente — nada de regra vaga tipo "deve ser seguro".

---

## ARCHITECTURE.md

```markdown
# Arquitetura do sistema

## Topologia
<visão de alto nível: clientes, serviços, bancos, filas>

## Camadas
- Apresentação: <responsabilidade>
- Aplicação:     <responsabilidade>
- Domínio:       <responsabilidade>
- Infraestrutura: <responsabilidade>

## Componentes principais
- <componente A>: <papel, dependências>

## Padrões adotados
- <Repository, Strategy, Observer, Singleton, Factory Method — conforme
  aplicável; ver references/04-padroes-engenharia.md>

## Decisões arquiteturais (ADRs)
- ADR-001: <decisão>
  Contexto: <por que foi necessário decidir>
  Opções: <quais alternativas existiam>
  Escolha: <o que ficou>
  Consequências: <o que ganhamos e o que perdemos>

## Trade-offs aceitos
- <ponto fraco assumido conscientemente>
```

---

## TECH_STACK.md

```markdown
# Stack tecnológica

| Camada          | Tecnologia | Justificativa |
|-----------------|-----------|----------------|
| Linguagem        |           |                |
| Framework        |           |                |
| Persistência     |           |                |
| Infraestrutura   |           |                |
| Testes           |           |                |
```

---

## DESIGN.md (pule se o projeto não tiver interface visual)

```markdown
# Direção visual e de design

## Referências de inspiração
- <descrição da inspiração 1 — se veio de print anexado, descreva o que foi
  identificado: paleta, densidade, estilo, layout>
- <descrição da inspiração 2>

## Paleta de cores
- Primária: <cor ou "a definir">
- Secundária: <cor ou "a definir">
- Tom geral: <ex.: vibrante / neutro / escuro>

## Estilo e tom
- <ex.: minimalista, denso, divertido, corporativo, editorial>

## Tipografia
- <ex.: sans-serif moderna, serifada clássica, ou "a definir pelo agent de UI">

## Identidade de marca existente (se houver)
- <cores, logo, nome já definidos que precisam ser respeitados>

## Padrões de layout observados nas referências
- <ex.: navegação por abas, cards, listas densas, muito espaço em branco>

## Anexos
- Prints/imagens de referência salvos em `specs/inspiracoes/` (se o
  harness tiver sistema de arquivos), ou descritos apenas em texto acima
  (se a análise ocorreu direto na conversa).
```

---

## API_SPEC.md

```markdown
# API: <nome do serviço>

## Convenções
- Auth:           <Bearer Token, OAuth2, API Key, nenhuma>
- Formato:        JSON
- Versionamento:  /v1
- Erros padrão:   <estrutura comum de payload de erro>

## Endpoints

### POST /recurso
<descrição>
- Request:  { campo: tipo }
- Response 201: { campo: tipo }
- Errors: 400 <caso>, 401 <caso>
```

---

## DATABASE_SCHEMA.md

```markdown
# Esquema de dados

## Entidade: <Nome>
| Campo | Tipo | Restrições |
|-------|------|------------|
|       |      |            |

## Relacionamentos
- <Entidade A> 1:N <Entidade B>
```

---

## TESTS_SPEC.md

```markdown
# Estratégia de testes

## Níveis
- Unitários:   cobertura >= <meta>% por módulo
- Integração:  caminhos críticos entre camadas
- End-to-end:  jornadas principais

## Casos críticos
- CT-001: <descrição> (valida <regra de RULES.md>)

## O que NÃO testar
- <bibliotecas de terceiros, UI cosmética, etc.>

## Dados de teste
- fixtures em tests/fixtures/
```

---

## SECURITY.md (apenas se aplicável)

```markdown
# Segurança

## Modelo de ameaças
<o que estamos protegendo, de quem>

## Autenticação e autorização
<mecanismo>

## Dados sensíveis
<o que é coletado, como é protegido, retenção>
```

---

## DEPLOY.md (pule se o projeto não for publicado/implantado, ex.: script de uso único)

```markdown
# Deploy: <nome do projeto>

## Ambientes
| Ambiente  | Propósito                              | URL/acesso |
|-----------|------------------------------------------|------------|
| dev       | desenvolvimento local                   |            |
| staging   | teste antes de publicar (se aplicável)  |            |
| produção  | uso real                                |            |

## Provedor / hosting
<onde o sistema roda: Vercel, servidor próprio, loja de app, etc. — e por quê>

## Variáveis de ambiente e segredos
| Nome | Ambiente | Onde é definida | Sensível? |
|------|----------|------------------|-----------|
|      |          |                  |           |

Nunca commitar segredo em texto puro — ver RULES.md/SECURITY.md.

## Passos de publicação
1. <passo 1, em ordem de execução real>
2. <passo 2>

## Como verificar que o deploy funcionou
<checagem pós-deploy — smoke test mínimo>

## Plano de rollback
<como reverter se algo der errado — passos concretos, não "reverte o commit">

## Checklist de go/no-go (consumido pelo Gate de Deploy do gestor)
[ ] Todos os testes da suíte completa passam
[ ] Variáveis de ambiente de produção conferidas
[ ] Plano de rollback testado ou pelo menos revisado
[ ] Pessoa dona do projeto avisada da janela de publicação
```

A execução do deploy em si pode ser delegada pelo(a) gestor(a) a um
sub-agente especializado (`deploy-<projeto>`), mas este arquivo é a spec
que esse sub-agente consome — não pule a escrita dele achando que "o
sub-agente resolve na hora"; ver `references/03-handoff-gestor.md`, seção
do Gate de go/no-go de deploy.

---

## AGENTS.md

```markdown
# Como os agentes devem atuar neste projeto

## Persona
<tom, nível de formalidade, idioma>

## Ferramentas permitidas
- <lista>

## Ferramentas proibidas
- <lista>

## Regras de output
- <formato esperado de diffs, explicações, commits>

## Restrições obrigatórias
- nunca commitar sem rodar os testes
- nunca alterar RULES.md sem aprovação humana
- nunca executar ação irreversível (deploy, exclusão de dados, alteração de
  schema em produção) sem aprovação humana explícita
```

---

## TASKS.md

```markdown
# Backlog

## Legenda de estimativa
Estimativa de ordem de grandeza (T-shirt size), não prazo comprometido —
serve pra decidir se vale seguir, não pra cobrar prazo depois.
- P (pequeno): horas até 1-2 dias
- M (médio): alguns dias
- G (grande): 1-2 semanas ou mais
- ? (incerto): não dá pra estimar sem investigar mais — trate como risco

## Bloco: <nome do bloco de funcionalidade>
Estimativa do bloco: <P/M/G/?>
[ ] T1. <tarefa de alto nível>
[ ] T2. <tarefa de alto nível>

## Bloco: <próximo bloco>
Estimativa do bloco: <P/M/G/?>
[ ] T3. <tarefa de alto nível>
```

Agrupe tarefas em blocos de entrega perceptível pela pessoa (alinhado ao
que depois vira um incremento do Gate de UAT), não uma tarefa por vez —
estimar tarefa individual isolada tende a ser ruído. Na Fase 1, este
arquivo recebe só tarefas de alto nível, já organizadas em blocos e
estimadas. O(a) `gestor-<projeto>` (Fase 3) é quem fatia isso em histórias
e critérios de aceitação durante o desenvolvimento.

---

## GLOSSARY.md (opcional, recomendado quando o domínio tem termos próprios)

```markdown
# Glossário

**Termo**: definição precisa, para evitar ambiguidade entre humano e agente.
```
