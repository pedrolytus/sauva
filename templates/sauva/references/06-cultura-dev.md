# Cultura de Desenvolvimento — Padrão LYTUS

Este arquivo é entregue pelo gestor a TODOS os agents especializados no
momento em que são criados, como parte do contexto inicial. Ele define o
DNA de qualidade de código esperado de qualquer entrega neste ecossistema,
**independentemente da linguagem ou framework do projeto** — os exemplos
abaixo são pseudocódigo deliberadamente, porque o princípio vale igual em
Python, TypeScript, Go, Java, Rust, ou qualquer outra linguagem.

Agents: leia este arquivo antes de escrever qualquer linha de código. Não é
sugestão — é o contrato de qualidade que o `sauva` vai usar como critério
de auditoria na Fase de Revisão Geral.

**Assim que `TECH_STACK.md` definir a linguagem real do projeto, o(a)
gestor(a) deve acrescentar (nunca substituir) uma seção ao final deste
arquivo com exemplos concretos na linguagem escolhida — ver seção 9.**

---

## 1. Alta Coesão

Cada módulo, classe ou função deve ter **uma única responsabilidade bem
definida**. Se você precisar usar "e" para descrever o que uma unidade de
código faz, ela provavelmente está fazendo coisas demais.

```
# Errado — baixa coesão: valida E salva E notifica, tudo junto
função processarPedido(pedido):
    se pedido.itens estiver vazio: erro "Pedido vazio"
    salvarNoBanco(pedido)
    enviarEmailNotificacao(pedido.cliente)

# Correto — cada função tem uma responsabilidade
função validarPedido(pedido): ...
função salvarPedido(pedido): ...
função notificarCliente(pedido): ...
```

**Critério de auditoria:** cada unidade tem nome que descreve exatamente o
que faz, sem conjunções ("e").

---

## 2. Baixo Acoplamento

Módulos devem depender de **abstrações** (interfaces, contratos), não de
implementações concretas. Uma mudança num módulo não deve forçar mudanças
em vários outros.

```
# Errado — acoplado à implementação concreta
classe ServicoPedido:
    construtor():
        this.repositorio = RepositorioMySQLPedido()  # fixo, não trocável

# Correto — depende de uma abstração, recebida de fora
classe ServicoPedido:
    construtor(repositorio: RepositorioDePedido):  # injetado, trocável
        this.repositorio = repositorio
```

**Critério de auditoria:** dependências externas (banco, API, fila) entram
por injeção (construtor ou parâmetro), nunca são criadas dentro da classe
que as usa.

---

## 3. Encapsulamento

Estado interno é privado. Comportamento é exposto por métodos com intenção
clara. Nunca exponha estado para ser modificado diretamente de fora sem
passar por validação.

```
# Errado — estado exposto, qualquer um modifica sem validação
classe Conta:
    saldo = 0   # público, sem controle

# Correto — estado protegido, alteração só via método validado
classe Conta:
    privado saldo

    construtor(saldoInicial):
        this.saldo = saldoInicial

    método depositar(valor):
        se valor <= 0: erro "Valor deve ser positivo"
        this.saldo += valor

    método consultarSaldo():
        retorna this.saldo
```

**Critério de auditoria:** nenhum campo interno é modificado diretamente de
fora da classe — toda alteração de estado passa por um método que pode
validar. Use a convenção de visibilidade privada da linguagem do projeto
(`private`, `_prefixo`, símbolo de módulo não exportado, etc.).

---

## 4. Modularidade

O código é organizado em módulos independentes que podem ser desenvolvidos,
testados e substituídos separadamente. A estrutura de pastas reflete a
arquitetura de camadas definida em `specs/ARCHITECTURE.md`.

```
src/
  dominio/          # regras de negócio puras — zero dependência externa
  aplicacao/        # casos de uso, orquestra o domínio
  infraestrutura/   # banco, APIs externas, filas
  apresentacao/     # interface com o mundo externo (API, CLI, UI)
```

Dependências só fluem para dentro (apresentação → aplicação → domínio).
Domínio nunca importa de infraestrutura. Se você está importando de uma
camada "de fora para dentro", pare e revise.

**Critério de auditoria:** nenhum import de `infraestrutura/` dentro de
`dominio/`; nenhum import de `apresentacao/` dentro de `aplicacao/`.

---

## 5. Padrões estruturais — os cinco padrões de referência do projeto

Estes padrões estão detalhados em `references/04-padroes-engenharia.md`.
Aqui está a versão de uso rápido para agents, agnóstica de linguagem:

| Situação | Padrão | Sinal de que você precisa dele |
|---|---|---|
| Recurso único e compartilhado (config, logger, conexão) | **Singleton** | Você está passando o mesmo objeto por 3+ camadas |
| Decisão condicional escolhendo qual tipo instanciar | **Factory Method** | Adicionar um tipo novo exigiria editar a condicional |
| Comportamento que muda conforme o contexto | **Strategy** | Você tem uma cadeia de condicionais trocando de comportamento |
| Um evento precisa disparar múltiplas reações desacopladas | **Observer** | Você está chamando 3+ funções manualmente depois de um evento |
| Consulta a dados misturada com regra de negócio | **Repository** | Você tem acesso a banco dentro de uma classe de domínio |

**Critério de auditoria:** nenhum dos sinais acima presente no código
entregue sem que o padrão correspondente tenha sido aplicado.

---

## 6. Nomenclatura e Legibilidade

- Nomes revelam intenção: `calcularDescontoFidelidade()`, não `calcDF()`.
- Sem abreviações não óbvias. O código é lido muito mais vezes do que
  escrito.
- Constantes nomeadas, nunca números soltos no meio do código:
  `TAXA_JUROS_MENSAL = 0.015`, não `valor * 0.015` espalhado por aí.
- Comentários explicam o **porquê**, não o **o quê** (o código já diz o quê).

---

## 7. Regras de Specs — append-only (vale para agents também)

Você NÃO tem permissão de alterar, substituir ou deletar conteúdo existente
em nenhum arquivo de `specs/`. Só pode acrescentar ao final ou criar
arquivos novos. Se identificar divergência entre spec e implementação,
registre em `specs/LOG_EXECUCAO.md` com o prefixo `[DIVERGÊNCIA SPEC]` e
devolva ao gestor para decisão — não resolva sozinho alterando a spec ou
ignorando a divergência.

---

## 8. Entrega com evidência

Nunca declare "está pronto" sem evidência. O que conta como evidência:
- Saída do executor de testes do projeto, com todos os testes passando.
- Ausência de erros do verificador de estilo/tipos do projeto, se houver.
- Para cada regra de `RULES.md` coberta pela tarefa: o ID da regra citado
  e o nome do teste que a valida.

Formato esperado ao devolver ao gestor:

```
TAREFA: <id da tarefa em TASKS.md>
STATUS: concluída
EVIDÊNCIA:
  - testes: 42 passaram, 0 falharam
  - verificador de estilo: 0 erros
  - RULES.md: R3 validada por teste_desconto_fidelidade_nao_acumula
ARQUIVOS MODIFICADOS: <lista de arquivos>
```

---

## 9. Seção adicionada pelo gestor (append-only)

Espaço reservado. Quando `TECH_STACK.md` definir a linguagem do projeto, o
gestor deve acrescentar aqui — nunca editar as seções acima — uma
subseção com os mesmos 8 princípios reescritos com sintaxe real da
linguagem escolhida, para consulta rápida dos agents. Formato sugerido:

```markdown
### Exemplos na linguagem deste projeto — <linguagem>

(reescrever os 8 princípios acima com sintaxe real de <linguagem>)
```
