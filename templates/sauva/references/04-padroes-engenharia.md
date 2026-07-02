# Padrões de Engenharia — Checklist Rápido de Decisão

Referência de consulta rápida durante decisões técnicas. Não é para ler de
uma vez — é para abrir na seção relevante quando uma decisão específica
precisa ser tomada.

## Quando escolher um design pattern

| Sintoma no código / no requisito | Padrão | Por quê |
|---|---|---|
| Recurso que precisa de instância única e compartilhada (conexão de banco, config, logger, cache) | **Singleton** | Evita estados divergentes e recursos duplicados |
| Código cheio de `if/elif` decidindo qual classe instanciar | **Factory Method** | Adicionar tipo novo vira extensão, não modificação |
| Método com condicionais crescentes trocando de comportamento | **Strategy** | Cada comportamento vira classe intercambiável |
| Um evento precisa disparar várias reações desacopladas | **Observer** | Emissor não conhece quem reage; fácil adicionar reação nova |
| Lógica de negócio misturada com queries/SQL direto | **Repository** | Separa domínio de persistência; troca de banco não toca regra de negócio |

Use POO (encapsulamento, herança, polimorfismo) como alicerce antes de
qualquer padrão — um padrão aplicado sobre código sem POO básica não resolve
o problema de manutenção, só o disfarça.

## Arquitetura em camadas

Apresentação (interface) → Aplicação (orquestração de casos de uso) →
Domínio (regras de negócio puras, sem dependência externa) → Infraestrutura
(banco, APIs externas, filas). Repository vive na fronteira
Domínio/Infraestrutura. Strategy e Observer vivem no Domínio. Factory Method
geralmente vive na Aplicação. Singleton vive na Infraestrutura.

Para projetos pequenos (script, CLI utilitário, protótipo descartável), não
force as quatro camadas — a profundidade do processo deve ser proporcional
ao tamanho do projeto.

## Ciclo TDD

1. **Red** — escreva o teste que falha. Confirme que ele falha antes de
   implementar (prova que o teste mede algo real).
2. **Green** — implemente o mínimo necessário para passar. Nada de
   generalização precoce.
3. **Refactor** — limpe o código com os testes verdes como rede de segurança.

Regra inegociável: **nunca altere um teste para fazê-lo passar sem aprovação
humana explícita**. O teste é o contrato; alterá-lo sem aprovação é
falsificar a auditoria.

## Pirâmide de testes

Unitário (base, maioria) → Integração → Contrato → End-to-end → Regressão
(todo bug corrigido vira teste de regressão permanente). Referência de
mercado: ~70% unitário, 25% integração, 5% e2e.

## Disciplina de Git

- Commit antes de qualquer mudança grande pedida a um agente — é o ponto de
  restauração.
- Branch por experimento/funcionalidade (`feat/`, `fix/`, `refactor/`,
  `chore/`); merge só depois de validado.
- Specs são versionadas junto com o código, no mesmo commit que as motivou.

## Harness vs. Guardrail

- **Harness** = tudo que ajuda o agente a executar com confiabilidade
  (contexto, memória, retries, verificação, troca de modelo em falha).
- **Guardrail** = uma peça do harness que limita/restringe. Quatro tipos, do
  mais fraco ao mais forte:
  1. **Prompt** ("nunca faça X") — depende da obediência do modelo. Frágil.
  2. **Código** (`if comando perigoso: bloqueia`) — robusto, não depende do
     modelo.
  3. **Política** (regra de negócio centralizada, ex.: teto de valor sem
     aprovação) — robusto.
  4. **Runtime** (o próprio ambiente intercepta e pede confirmação) — robusto.
- Segurança que importa de verdade nunca deve depender só de guardrail de
  prompt. Tire a decisão do modelo sempre que a ação for sensível.

## Disciplina de verificação / looping

Se um agente (gestor ou sub-agente) for repetir um ciclo sem supervisão
constante:
- A meta precisa ser verificável por um **check externo e determinístico**
  (teste, build, contagem) — nunca o próprio agente avaliando o próprio
  trabalho (autocorreção sem feedback externo não melhora e às vezes piora).
- Defina estados terminais nomeados: sucesso, sem-progresso, esgotado. Erro
  ou budget estourado **nunca** é sucesso.
- Sempre tenha teto de iterações/orçamento e aprovação humana para qualquer
  ação irreversível dentro do ciclo.
- Pergunta de triagem antes de montar um loop: o resultado de uma volta muda
  a próxima ação? Se não, não é loop — é uma tarefa de um passo só.

## Categorias de manutenção (SWEBOK/IEEE) — para classificar pedidos de mudança

- **Corretiva** — algo quebrou em produção. Urgente, exige diagnóstico
  rápido e teste de regressão.
- **Preventiva** — refatorar antes do problema aparecer. Estratégica,
  raramente priorizada, mas a mais barata a longo prazo.
- **Adaptativa** — o ambiente mudou (dependência, API externa, legislação).
  Sistemas bem arquitetados adaptam rápido porque isolam dependências
  externas (Repository ajuda aqui).
- **Additiva** — funcionalidade nova pós-entrega. Exige o mesmo rigor de
  levantamento de requisitos que um projeto novo, escopado à funcionalidade.
- **Perfectiva** — melhoria de qualidade percebida sem mudar comportamento
  (performance, UX, mensagens de erro).
