# Padrões de Design — Checklist por Nível

O público do sauva não sabe pedir design de qualidade por conta própria —
ninguém leigo vai dizer "quero contraste WCAG AA" ou "quero estado de
carregamento no botão". É trabalho seu garantir isso sem que a pessoa
precise perguntar, do mesmo jeito que segurança (ver
`references/09-seguranca.md`). E, pelo mesmo motivo que segurança tem dois
níveis, design também tem: a maior parte do que separa "amador" de
"profissional" não custa tempo extra — é só fazer certo em vez de fazer
errado, ao mesmo custo. O que custa tempo real (identidade visual
distintiva, micro-interação, onboarding elaborado) só vale a pena quando o
projeto realmente pede apelo de mercado.

## Nível Essencial — sempre aplicado, em toda tela, sem exceção

Invisível como "decisão de design" — a pessoa nunca vê isso como opção,
só sente a diferença. Aplique sempre, mesmo em ferramenta interna ou
protótipo, e nunca pergunte se a pessoa "quer" isso.

- **Espaçamento consistente**: uma escala só (ex.: múltiplos de 4px ou
  8px) — nunca valor arbitrário tipo `13px` ao lado de `22px` sem relação.
- **Hierarquia tipográfica clara**: no máximo 3-4 tamanhos de texto na
  tela, com contraste de peso real entre título e corpo — nunca tudo do
  mesmo tamanho e peso competindo por atenção.
- **Contraste de cor adequado**: mínimo WCAG AA (4.5:1 pra texto normal,
  3:1 pra texto grande) entre texto e fundo — texto cinza claro sobre
  branco "porque ficou bonito" não passa nesse critério.
- **Todo elemento interativo tem estado visível**: botão, link e campo
  mostram hover, foco e disabled de forma clara — nunca um elemento que
  parece "morto" sem repostar à interação.
- **Toda ação que demora tem estado de carregamento**: nunca tela travada
  ou parada sem indicação de que algo está acontecendo.
- **Toda lista/coleção tem estado vazio tratado**: mensagem contextual
  ("Você ainda não tem nenhum item — que tal criar o primeiro?"), nunca
  tela em branco confusa sem explicação.
- **Todo erro tem mensagem clara em linguagem humana**: nunca stack
  trace, código de erro cru ("Error 500") ou mensagem técnica exposta pro
  usuário final — isso também é regra de segurança (Nível Essencial,
  `09-seguranca.md`), então já é obrigatório de qualquer forma.
- **Responsivo**: o layout não quebra em tela pequena, mesmo quando o
  produto é pensado primeiro pra desktop — nunca elemento cortado ou
  sobreposto.
- **Navegação por teclado funciona** nos elementos principais: Tab
  alcança botão/campo em ordem lógica, Enter ativa o que está em foco.
- **HTML/markup semântico**: `<button>` pra botão (não `<div onclick>`),
  `<label>` associado a campo de formulário, hierarquia de heading
  coerente — isso é o que faz o produto funcionar também com leitor de
  tela, sem esforço extra de design.

## Nível Encantador — quando o produto é voltado a usuário externo real

Ative quando o Bloco 8 da entrevista confirmar que o produto vai ser
usado por gente de fora (cliente, público em geral), não só pela própria
pessoa ou por uma equipe interna pequena — é aí que identidade visual e
polish realmente convertem em resultado. Esse nível tem custo real de
tempo, por isso só entra quando o contexto justifica.

- **Micro-interações**: transição suave entre estados, feedback visual
  claro de ação bem-sucedida (não só "salvo", um retorno visual sutil),
  animação de entrada em elemento novo — sem exagerar a ponto de atrasar
  a interação.
- **Identidade visual distintiva**: paleta e tipografia que remetem à
  marca/produto, não um template genérico qualquer — o que foi capturado
  nas inspirações do Bloco 8 vira decisão de verdade, não sugestão vaga.
- **Onboarding pensado**: a primeira tela que a pessoa vê não é uma lista
  vazia sem contexto — orienta o próximo passo.
- **Copywriting de UI com intenção**: texto de botão e mensagem escritos
  pensando no tom do produto ("Enviado! Você vai receber a confirmação
  por e-mail" em vez de "Success"), mensagem de erro empática em vez de
  fria.
- **Modo escuro**, se fizer sentido pro público e a stack suportar sem
  custo desproporcional.
- **Ícones/ilustrações coerentes** com a identidade visual — não
  clip-art genérico misturado sem critério.

## Como decidir o nível (Bloco 8 da entrevista)

Pergunta prática: "Esse app/site vai ser usado só por você (ou por um
grupo pequeno e fechado, tipo sua equipe interna), ou algum dia gente de
fora — cliente, público em geral — vai usar?" Uso interno/pessoal → só
Essencial, e é suficiente; não force Encantador "pra impressionar" sem
alguém de fora pra impressionar. Uso externo real → Essencial + Encantador.

Isso não é definitivo: se um projeto que começou como ferramenta interna
depois vira produto voltado a cliente externo, trate como manutenção
perfectiva (SWEBOK, ver `04-padroes-engenharia.md`) e retome o sauva pra
elevar o nível — não decida isso sozinho no meio da implementação.

## Como isso não sacrifica velocidade

O Nível Essencial custa o mesmo tempo que fazer errado — não existe
"versão rápida" que pule contraste adequado ou estado de carregamento,
porque isso não é trabalho extra, é só fazer a mesma tela direito da
primeira vez. O Nível Encantador é o único que de fato consome mais
tempo, e por isso só é ativado quando há gente de fora pra sentir a
diferença — nunca por padrão, nunca "pra garantir".
