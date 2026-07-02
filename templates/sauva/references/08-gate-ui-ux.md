# Gate de UI/UX — Aprovação Visual

Este gate existe porque pedir pra uma pessoa leiga "aprovar" um documento de
design em markdown não funciona — ela não visualiza nada a partir de texto
técnico. Este gate exige que ela **veja** algo antes de aprovar.

Acontece na Fase 3, depois que `DESIGN.md` está completo e antes de acionar
a `skill-creator` para criar o `gestor-<projeto>`. Bloqueia o handoff até
aprovação explícita.

## O que gerar

Um mockup estático das 2-4 telas/momentos mais centrais do produto (as que
aparecem nos objetivos principais do `PRD.md`), refletindo o que foi
capturado em `DESIGN.md`: paleta, densidade, tom, tipografia. Não precisa
ser funcional — é pra ver a cara do produto, não testar interações.

**Não gere código de produção aqui.** Isso é um rascunho visual descartável,
não vira `src/`. O(a) gestor(a), na Fase de desenvolvimento, implementa a
interface de verdade a partir da spec aprovada, não reaproveitando este
arquivo.

## Como gerar, por ambiente

**Se você tiver uma ferramenta de visualização inline disponível** (ex.:
gerar e mostrar HTML/SVG diretamente na conversa): use-a. É a opção mais
direta — a pessoa vê o resultado sem sair do chat nem abrir nada.

**Se você não tiver essa ferramenta, mas tiver acesso a arquivo:** escreva
um HTML autocontido (CSS embutido, sem dependência externa) em
`specs/mockup/index.html`, com as 2-4 telas lado a lado ou navegáveis por
âncora simples. Diga explicitamente à pessoa: "Abra o arquivo
`specs/mockup/index.html` no seu navegador pra ver."

**Se nenhuma das duas opções existir:** descreva em palavras simples,
tela por tela, o que a pessoa veria — como último recurso, nunca como
primeira escolha.

## Conteúdo mínimo do mockup

- Tela/momento principal (o que resolve o objetivo central do `PRD.md`).
- Um segundo momento relevante, se o produto tiver mais de um fluxo
  central.
- Paleta de cores aplicada de verdade (não descrita — usada).
- Textos de exemplo realistas no domínio do projeto (não "Lorem Ipsum",
  não "Título aqui") — se o projeto é uma lista de compras, mostre itens de
  compra reais tipo "Leite", "Pão", não texto genérico.

## Protocolo de aprovação

1. Apresente o mockup e pergunte diretamente: **"É isso? Faz sentido com o
   que você imaginou, ou tem algo que você mudaria?"**
2. Registre em `.sauva/state.json`, em `aprovacoes_pendentes`, um item com
   `gate: "UI_UX"` assim que o mockup for gerado — antes mesmo da resposta
   da pessoa. Isso marca que o projeto está formalmente aguardando essa
   aprovação, mesmo que a sessão seja interrompida aqui.
3. Se a pessoa pedir ajustes: ajuste e gere de novo. Não avance com
   ressalvas do tipo "depois a gente ajusta" — o gate existe exatamente pra
   evitar isso.
4. Quando a pessoa confirmar explicitamente ("sim", "gostei", "pode
   seguir"), remova o item correspondente de `aprovacoes_pendentes` e só
   então prossiga para o restante da Fase 3 (criação do gestor).
5. Nunca interprete silêncio ou uma resposta ambígua ("tá bom eu acho")
   como aprovação — peça confirmação direta se não tiver certeza.

## Por que isso não é opcional

Sem esse gate, o primeiro contato real da pessoa com a cara do produto
aconteceria só depois que o(a) gestor(a) já tivesse implementado várias
telas — e qualquer divergência de gosto vira retrabalho caro, medido em
tarefas inteiras refeitas, não em um ajuste de cinco minutos num mockup.
