# Roteiro de Entrevista — Fase 1 (Projeto Novo)

## Princípio de tradução (leia antes de tudo)

Este roteiro é escrito com nomenclatura técnica porque é você, o agente,
quem precisa saber para qual arquivo cada resposta vai. **A pessoa do outro
lado nunca precisa ouvir essa nomenclatura.** Ela pode nunca ter escrito uma
linha de código na vida.

Regra prática: se uma pergunta sua tem uma palavra que só faz sentido pra
quem estudou engenharia de software (invariante, não-objetivo, guardrail,
cobertura de testes, autenticação), você já errou a pergunta. Traduza pra
uma situação concreta do dia a dia da pessoa antes de perguntar. Cada bloco
abaixo tem uma seção "Diga assim" com a versão em linguagem simples — use
essa versão, não o título técnico do bloco.

Pergunte um bloco de cada vez, como uma conversa — não como formulário.
Adapte a ordem se a pessoa já trouxer respostas espontâneas ("quero um app
de tarefas que..."); nesse caso, extraia o que já foi dito e confirme antes
de seguir, em vez de perguntar de novo o que já foi respondido. Se a pessoa
usar um termo técnico errado ou impreciso, não corrija publicamente — apenas
confirme o que você entendeu em palavras simples e siga.

## Modos de condução

`state.modo` (perguntado antes do Bloco 1, ver `SKILL.md`) muda o
COMPORTAMENTO deste roteiro, nunca o conteúdo final gravado nas specs — o
resultado em `specs/` tem a mesma estrutura independentemente do modo.

- **Autopilot** — para os blocos que admitem um palpite razoável a partir
  de padrões comuns do domínio (Blocos 2, 3, 7 e 8: persona, objetivos,
  stack, contratos), proponha uma resposta plausível e peça confirmação
  binária rápida ("vou assumir que é uso diário, de qualquer lugar — tá
  bom ou quer mudar?") em vez de fazer a pergunta aberta. Os Blocos 1, 5, 6
  e 11 (nome do projeto, regras de domínio, dados sensíveis, o que a IA
  nunca pode fazer sozinha) continuam SEMPRE abertos e nunca são inferidos
  — são bloqueantes por natureza. Toda linha de spec preenchida por
  inferência (não por resposta direta da pessoa) recebe o marcador
  `[INFERIDO]` no início da linha, ex.: `- Persona alvo: [INFERIDO] pessoa
  adulta, uso pessoal, baixa frequência`. Ao final da Fase 1, liste todas
  as linhas `[INFERIDO]` num resumo único para revisão em lote, antes da
  pergunta de fechamento de escopo — isso substitui a confirmação
  pergunta-por-pergunta por uma revisão só, sem burocratizar. Esse marcador
  é só uma tag textual: não é um sistema de rastreabilidade completo, não
  gera arquivo de log separado nem histórico de mudança.
- **Mentor** — o comportamento padrão deste roteiro: cada bloco é
  perguntado por completo, e a seção "Diga assim" de cada bloco é sempre
  acompanhada de uma frase curta de porquê aquilo importa antes de
  perguntar (ex.: "isso importa porque define se vamos precisar de sistema
  de login desde o início").
- **Dev** — perguntas diretas, sem tradução para linguagem leiga e sem
  explicar por que a pergunta importa. Pode agrupar múltiplos blocos numa
  única pergunta compacta quando a pessoa demonstrar domínio técnico (ex.:
  perguntar Blocos 7 e 9 juntos como "stack, persistência e modelagem de
  dados?").

## Bloco 1 — Visão e problema → `PRD.md`
**Diga assim:** "Me conta a ideia. Que problema isso resolve? Pra quem?"
- Qual problema esse projeto resolve, em uma frase? Para quem?
- Por que esse problema importa agora? O que acontece se ninguém resolver?
- Como isso é resolvido hoje (à mão, numa planilha, com outro app)? O que
  incomoda nisso?

## Bloco 2 — Persona e contexto de uso → `PRD.md`
**Diga assim:** "Quem vai usar isso de verdade? Só você, sua equipe, ou
clientes de fora?"
- Quem usa isso de fato?
- Com que frequência (todo dia, de vez em quando)?
- A pessoa que vai usar entende de tecnologia, ou precisa ser simples pra
  qualquer um?

## Bloco 3 — Objetivos e critérios de sucesso → `PRD.md`
**Diga assim:** "Como você vai saber que deu certo? O que precisa acontecer
pra você dizer 'pronto, funcionou'?"
- Busque algo que dá pra checar de verdade, não só "tem que ser bom" — se a
  resposta for vaga, pergunte "e como a gente sabe que isso aconteceu?" até
  chegar em algo concreto (ex.: "alguém consegue fazer um pedido em menos
  de um minuto").
- Existe um prazo importante pra isso ficar pronto?

## Bloco 4 — O que fica de fora → `PRD.md`
**Diga assim:** "E o que esse projeto NÃO vai fazer, pelo menos por
enquanto? Às vezes é mais fácil dizer o que não entra do que o que entra."
- Essa pergunta costuma ser a mais difícil e a mais valiosa — insista se a
  resposta vier vaga. É o que evita que o projeto vá crescendo sem limite e
  nunca fique pronto.

## Bloco 5 — Coisas que nunca podem acontecer → `RULES.md`
**Diga assim:** "Tem alguma coisa que NUNCA pode acontecer no seu app? Tipo
'um pedido pago nunca pode sumir' ou 'duas pessoas nunca podem ter o mesmo
cadastro'."
- Colete cada uma dessas regras como uma frase clara e específica — evite
  frases genéricas como "tem que funcionar bem".
- Se existir uma exceção conhecida pra alguma regra, pergunte e registre
  junto — não deixe pra "resolver depois".
- Internamente, cada regra vira uma linha numerada (R1, R2...) em
  `RULES.md` — isso é trabalho seu, não precisa aparecer na conversa.

## Bloco 6 — Dados sensíveis e privacidade (se aplicável) → `RULES.md` / `SECURITY.md`
**Diga assim:** "Esse app vai guardar informação pessoal de alguém — nome,
CPF, endereço, dados de saúde, cartão de crédito? Precisa que só a própria
pessoa veja o que é dela, ou todo mundo vê tudo?"
- Se a resposta for "não sei" ou "acho que não", ajude com exemplos
  concretos até ter certeza — pessoas leigas frequentemente não percebem
  que um campo de "telefone" já é dado sensível.
- Se realmente não houver nada sensível, registre isso explicitamente em
  `RULES.md` em vez de simplesmente pular a seção — uma ausência
  documentada é diferente de uma pergunta que nunca foi feita.

## Bloco 7 — Como vai ser construído por dentro → `ARCHITECTURE.md` / `TECH_STACK.md` / `DEPLOY.md`
**Diga assim:** não pergunte tecnologia diretamente pra quem não é técnico
— na maioria das vezes a pessoa não tem essa resposta e não deveria
precisar ter. Em vez disso, pergunte sobre o contexto de uso ("isso vai
rodar no celular, no computador, ou nos dois? precisa funcionar sem
internet?") e proponha você mesmo a arquitetura e a stack como
especialista, explicando a escolha em uma frase simples ("vou usar X porque
isso permite Y"). Só pergunte tecnologia diretamente se a pessoa for
tecnicamente capaz de responder ou já tiver uma restrição externa (ex.: "o
cliente exige que rode na AWS").
- Existe alguma decisão já tomada fora desta conversa (por exigência de
  cliente, parceiro, ou sistema já existente)?
- Existe orçamento ou restrição de custo relevante?

**Sub-bloco de deploy — sempre pergunte, mesmo em projetos pequenos:**
- "Isso vai ficar só na sua máquina, ou alguém de fora vai acessar (site,
  app publicado, sistema que outras pessoas usam)?"
- Se houver publicação: "Existe uma data ou evento importante pra isso
  estar no ar?" e "Quem vai ser responsável por cuidar disso depois de
  publicado — você, alguém técnico, ou ainda ninguém definido?"
- Se o projeto vai ser publicado, `DEPLOY.md` é preenchido a partir dessas
  respostas (ambientes, provedor, responsável). Detalhes operacionais finos
  (passos exatos de deploy, variáveis de ambiente específicas) podem ficar
  como rascunho aqui e ser refinados depois por um sub-agente
  `deploy-<projeto>`, quando o(a) gestor(a) delegar essa área na Fase 2/3.
  Se o projeto nunca sai da máquina de quem cria, marque `DEPLOY.md` como
  não aplicável e siga adiante sem insistir.

Proponha a arquitetura (camadas Apresentação / Aplicação / Domínio /
Infraestrutura, mais os design patterns que se aplicam — ver
`04-padroes-engenharia.md`) e valide com a pessoa em linguagem de resultado,
não de implementação.

**Assim que a linguagem/stack for decidida:** copie
`references/06-cultura-dev.md` para `specs/CULTURA_DEV.md` dentro do
projeto, e acrescente ao final (nunca edite as seções copiadas) uma seção
com os 8 princípios reescritos com sintaxe real da linguagem escolhida —
siga o formato indicado na seção 9 do próprio arquivo. É esse
`specs/CULTURA_DEV.md`, específico do projeto, que será entregue aos
agents e usado como critério de auditoria — não o template genérico da
skill.

## Bloco 8 — Inspirações visuais e estilo → `DESIGN.md`
Pule este bloco só se o projeto genuinamente não tiver interface visual
(ex.: um serviço de backend puro, um script sem tela). Para qualquer coisa
que alguém vai olhar ou tocar, este bloco é obrigatório.

**Diga assim:** "Você tem algum app ou site que acha bonito, ou que já se
parece com o que você imagina? Pode mandar print, foto de tela, ou só
descrever com suas palavras."
- **Aceite anexos de imagem diretamente na conversa.** Quando a pessoa
  enviar prints/capturas de tela de inspiração, analise-os você mesmo —
  identifique paleta de cores predominante, densidade visual (limpo/denso),
  estilo de tipografia (sério/descontraído), padrões de layout notáveis
  (cards, listas, abas) — e descreva o que viu em palavras simples pra
  confirmar entendimento antes de registrar.
- Se a pessoa não tiver nenhuma referência, ofereça 2-3 direções visuais
  contrastantes em palavras simples (ex.: "minimalista e clean", "colorido
  e divertido", "sério e corporativo") e deixe ela escolher ou combinar.
- Pergunte também: existe uma marca já definida (cores, logo, nome) que
  precisa ser respeitada?

**Nota sobre anexos por harness:** em conversas de chat (Claude.ai), a
pessoa anexa a imagem diretamente e você a vê nativamente. Em harnesses com
sistema de arquivos (Claude Code e similares), oriente a pessoa a salvar os
prints em `specs/inspiracoes/` e leia os arquivos de imagem de lá. Em
qualquer um dos dois casos, o registro permanente é textual: sintetize o
que foi absorvido das imagens em `DESIGN.md`.

Este bloco alimenta diretamente o Gate de aprovação de UI/UX — antes da
implementação começar, você vai gerar um mockup visual de verdade (não um
documento pra ler) a partir do que foi capturado aqui. Ver
`references/08-gate-ui-ux.md`.

## Bloco 9 — O que o sistema precisa guardar e organizar (se aplicável) → `API_SPEC.md` / `DATABASE_SCHEMA.md`
**Diga assim:** "Quais são as 'coisas' principais que esse app vai
guardar? Tipo, num app de tarefas seria 'tarefa' e 'pessoa'; num app de
vendas seria 'produto', 'pedido', 'cliente'."
- Para cada "coisa" (entidade): o que a pessoa consegue fazer com ela
  (criar, ver, editar, apagar)? O que acontece se der errado (ex.: tentar
  apagar algo que já foi usado em outro lugar)?
- Como essas "coisas" se conectam entre si?
Pule este bloco inteiro se o projeto não guardar informação estruturada
(ex.: um script utilitário simples que só processa um arquivo e termina).

## Bloco 10 — O que precisa ser testado com rigor → `TESTS_SPEC.md`
**Diga assim:** "Se alguma parte desse app quebrar, qual seria a pior?
Tipo, o que NÃO pode dar errado de jeito nenhum?"
- Isso vira a prioridade de testes automáticos — as partes mais críticas
  ganham teste desde o primeiro dia; o resto pode esperar.
- Pergunte também o oposto: existe alguma parte que, se der errado, não é
  tão grave assim? Isso ajuda a não gastar esforço testando o que não
  precisa.

## Bloco 11 — Como os agentes de IA devem se comportar → `AGENTS.md`
**Diga assim:** "Tem alguma coisa que você quer que a IA NUNCA faça sozinha
sem te perguntar primeiro? Tipo apagar dados, publicar algo pro público,
gastar dinheiro?"
- Essa é provavelmente a pergunta mais importante deste bloco — pessoas
  leigas geralmente não pensam nisso até serem perguntadas diretamente.
  Insista com exemplos concretos até ter uma lista clara.
- Pergunte também o tom desejado nas atualizações que a IA vai dar (formal,
  casual, direto ao ponto).

Este bloco define os guardrails de prompt e de processo que vão valer tanto
para você quanto, principalmente, para o(a) gestor(a) e os sub-agentes que
ele(a) criar depois. Nomenclatura técnica ("guardrail") é uso interno seu —
não precisa aparecer na conversa.

## Bloco 12 — Por onde começar → `TASKS.md`
A partir de tudo levantado, proponha você mesmo uma primeira lista de
tarefas de alto nível em linguagem de resultado ("criar a tela de login",
não "implementar endpoint de autenticação") e valide com a pessoa. Agrupe
as tarefas em blocos de entrega perceptível pela pessoa (não uma tarefa
isolada por vez) e estime cada bloco em ordem de grandeza — P (pequeno), M
(médio), G (grande) ou ? (incerto, ver `references/02-templates-specs.md`
para a régua completa). Se algo for genuinamente incerto (ex.: depende de
uma API de terceiro ainda não avaliada), marque `?` e diga isso com todas
as letras — estimativa forçada é pior do que admitir incerteza. Isso fecha
a Fase 1.
