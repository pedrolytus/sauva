# Segurança — Checklist por Nível

O público do sauva não sabe pedir segurança por conta própria — não é
trabalho da pessoa saber que precisa de hash de senha ou de rate limiting,
é trabalho seu garantir isso sem que ela precise perguntar. Ao mesmo
tempo, o sauva também promete design de ponta, velocidade e ausência de
atrito — segurança máxima em todo projeto, sempre, violaria essa outra
promessa. A saída é separar segurança em dois níveis com custo de UX
completamente diferente, em vez de um dial único.

## Nível Essencial — sempre aplicado, em todo projeto, sem exceção

Isso é decisão de implementação, invisível pro usuário final. Não compete
com design nem com velocidade — é só fazer certo em vez de fazer errado,
ao mesmo custo. Nunca pergunte à pessoa se ela "quer" isso: aplique
sempre, e registre como regras numeradas em `RULES.md` (seção Segurança)
assim que a stack for decidida (Bloco 7 da entrevista).

- Nunca commitar segredo em texto puro (API key, senha, token) — sempre
  variável de ambiente ou secret manager do provedor de hosting.
- Validar e sanitizar toda entrada externa (formulário, parâmetro de URL,
  upload de arquivo, payload de API) antes de usar.
- Nunca concatenar SQL — usar query parametrizada ou ORM.
- Senha de usuário: hash com algoritmo moderno (bcrypt, argon2, scrypt) —
  nunca texto puro, nunca hash fraco isolado (md5/sha1 sem salt).
- HTTPS sempre que houver comunicação de rede — nunca HTTP puro em
  produção.
- Dependências: rodar auditoria de vulnerabilidade conhecida (`npm audit`
  ou equivalente da stack) antes de cada deploy — ver Checklist de
  go/no-go em `DEPLOY.md`.
- Mensagem de erro pro usuário final nunca expõe stack trace, query SQL,
  caminho de arquivo ou detalhe interno — log detalhado fica no servidor,
  não na tela.
- CORS: nunca `*` em produção se a API expuser dado que não é
  público.
- Upload de arquivo (se houver): validar tipo e tamanho no servidor, nunca
  confiar só na validação do navegador.

## Nível Reforçado — só quando a entrevista confirma risco real

Ative quando o Bloco 6 da entrevista confirmar pelo menos um destes
sinais: dado sensível de terceiros (CPF, saúde, cartão, endereço),
exposição pública com usuários externos reais (não só a própria pessoa ou
um grupo fechado de confiança), ou dinheiro envolvido (pagamento,
transação financeira). Esse nível tem custo real de atrito — por isso só
entra quando o risco justifica, nunca por padrão.

- Autenticação multi-fator (MFA), ao menos para ações sensíveis (login,
  alteração de dados de pagamento, exclusão de conta).
- Rate limiting em endpoints de autenticação e em qualquer ação crítica
  (evita força bruta e abuso).
- Logging/auditoria de acesso a dado sensível: quem acessou o quê, quando
  — sem logar o próprio dado sensível em texto puro no log.
- Política explícita de retenção e expurgo de dados — por quanto tempo o
  dado fica guardado, e como é apagado quando não for mais necessário.
- Modelo de ameaças formal (mesmo que simplificado — quem pode atacar,
  por onde, o que perde se conseguir) registrado em `SECURITY.md`.
- Least privilege explícito: cada serviço/integração só tem acesso ao que
  precisa, nunca acesso amplo "por conveniência".
- Se envolver dado pessoal de terceiros no Brasil: registre a base legal
  de tratamento (LGPD) e como a pessoa titular do dado pode pedir exclusão
  — não precisa ser um parecer jurídico, mas precisa existir por escrito.

Quando este nível se aplica, crie `specs/SECURITY.md` (template em
`references/02-templates-specs.md`) e considere criar um sub-agente
`security-<projeto>` (ver `references/03-handoff-gestor.md`, "Quando criar
um sub-agente") — a área concentra julgamento denso o suficiente pra
justificar foco isolado, diferente do Nível Essencial, que qualquer
sub-agente aplica sozinho como rotina.

## Sinal de "hora de subir pra segurança de produção real"

Quando a pessoa confirmar que o sistema vai (ou já foi) lançado pra
usuários externos reais, com dinheiro ou dado sensível em escala — não
mais protótipo, validação ou uso restrito — trate isso como um gatilho de
manutenção **preventiva** (SWEBOK, ver `04-padroes-engenharia.md`), não
como mais uma tarefa qualquer do backlog:

- Recomende auditoria de segurança externa/pentest profissional antes do
  lançamento público — o sauva e os agentes que ele cria não substituem
  essa revisão independente em escala de produção real.
- Revise o Nível Reforçado já aplicado e confirme que nada ficou como
  placeholder ("a definir depois") do momento em que era só protótipo.
- Registre essa transição explicitamente em `PRD.md` (riscos) e
  `LOG_EXECUCAO.md` — é uma mudança de contexto do projeto, não um detalhe
  técnico silencioso.

## Como isso não sacrifica design nem velocidade

- O Nível Essencial nunca aparece pra pessoa como pergunta ou como tela —
  é aplicado por você e pelos sub-agentes como rotina, do mesmo jeito que
  TDD é rotina. Não tem "economia" possível aqui: pular Essencial não
  ganha velocidade real, só transfere o custo pra depois, na forma de
  incidente.
- O Nível Reforçado é o único que introduz atrito de verdade pro usuário
  final (MFA, etc.) — e é exatamente por isso que só é ativado quando o
  risco real confirma que vale a pena pagar esse atrito. Nunca aplique por
  padrão "pra garantir".
