# Teste técnico de frontend — Painel de Notas Fiscais

Leia este documento inteiro antes de começar. O e-mail do convite traz três informações que não estão aqui: o
**degrau mínimo** da sua vaga, o **tempo** da Parte A e se a sua vaga inclui a **Parte B**.

## Contexto

A Paineira Sistemas (empresa fictícia) vende um sistema de emissão de notas fiscais para pequenas e médias
empresas. O time de frontend está montando o **Painel de Notas Fiscais**, a tela onde o cliente acompanha as notas
que emitiu. Uma nota fiscal eletrônica (NF-e) registra uma venda: tem emitente, destinatário (identificado pelo
CNPJ), itens e valor total. Depois de emitida, ela fica em processamento até a Secretaria da Fazenda autorizar ou
rejeitar. Uma nota autorizada pode ser cancelada com uma justificativa, e o cancelamento também passa por
processamento antes de valer. Todos os dados do teste são inventados.

O teste tem três partes:

| Parte | O que é | Onde |
|---|---|---|
| A | Construir a tela de notas, em degraus | `main` da sua cópia |
| B | Revisar o pull request de um colega (40 min) | branch `feature/painel-faturamento` |
| C | Entrevista ao vivo sobre a sua entrega | vídeo, agendada depois da entrega |

## Regras gerais

- **Sua cópia é privada e mantém o histórico.** Duplique este repositório na sua conta:
  1. Crie um repositório **privado e vazio** na sua conta do GitHub (sem README, `.gitignore` nem licença).
  2. Espelhe este repositório nele e apague o clone temporário:
     ```bash
     git clone --bare https://github.com/joaoveeiga/teste-frontend.git
     cd teste-frontend.git
     git push --mirror https://github.com/<seu-usuario>/<seu-repo>.git
     cd .. && rm -rf teste-frontend.git
     ```
  3. Clone o seu repositório privado e trabalhe no `main`.
- **Stack:** Next.js com App Router e TypeScript, a partir do esqueleto em `web/`. O BFF são as rotas e server
  actions do próprio Next.
- **A API:** o contrato está em `openapi.yaml` e a API sobe com o `docker-compose.yml` do kit (veja o `README.md`).
- **A chave da API fica só no servidor.** O navegador nunca chama a API direto: ele fala com o seu Next, e o Next
  fala com a API. Isso é requisito, não detalhe de implementação.
- **A API se comporta como um serviço de verdade:** pode demorar, pode falhar de forma intermitente e limita a
  quantidade de requisições. A tela continua utilizável nesses casos.
- **IA é permitida.** Use a ferramenta que quiser e declare no README da entrega qual usou e para quê. Na Parte C
  você pode ter de explicar qualquer linha do código, inclusive as que a IA escreveu.
- **Tempo:** a Parte A cabe em até 4 h ou até 6 h, conforme o convite. Não passe disso; registre no README o que
  ficou de fora.
- **A tela de faturamento (`/faturamento`) não faz parte da Parte A.** Ela é o assunto do PR da Parte B.

## Parte A — tela de notas

Construa a tela de notas em `/notas`. A Parte A é dividida em degraus, e cada degrau inclui os anteriores.

- **Entregue o seu degrau mínimo completo.** Um degrau pela metade não conta como entregue.
- **Ir além do mínimo conta a favor.** Só suba de degrau com o mínimo pronto.
- Cada degrau tem três frentes: **Tela** (o que o usuário vê), **BFF** (as rotas do seu Next que falam com a API) e
  **Docker** (como o app roda).

| Degrau | Foco |
|---|---|
| D1 | Lista, filtros, detalhe e o app falando com a API pelo BFF |
| D2 | Link direto, cancelamento e testes de componente |
| D3 | Status ao vivo, erros e concorrência |
| D4 | Robustez e imagem de produção |
| D5 | Formulário dinâmico, rastreio e decisão registrada |

### D1

**Tela**

- Lista de notas com número e série, data de emissão, destinatário (razão social e CNPJ), valor total e status.
- Filtros por status, período de emissão e destinatário. O filtro de período é por dia civil no horário de
  Brasília. A busca por destinatário precisa funcionar com o novo CNPJ alfanumérico.
- Paginação.
- Estados de carregando, lista vazia e erro, com uma forma de tentar de novo.
- Valores em reais (`R$ 1.234,50`) e datas no formato brasileiro.
- Detalhe da nota: emitente, destinatário, itens, observação e, se houver, os dados do cancelamento.

**BFF**

- Rotas do seu Next repassam as chamadas para a API. A chave fica só no servidor.

**Docker**

- A API sobe com o `docker-compose.yml` do kit, e o app roda contra ela.

### D2

**Tela**

- Filtros e página ficam na URL: abrir o link numa aba nova mostra a mesma lista.
- Cancelar uma nota autorizada, com confirmação e justificativa. Cancelar uma nota precisa ser seguro para
  repetir.
- Testes com React Testing Library do fluxo principal: filtrar, abrir o detalhe e cancelar.

**BFF**

- O BFF entrega à tela um contrato próprio de lista (filtros e paginação), em vez de repassar o formato da API como
  está.

**Docker**

- Um comando sobe a API e o app juntos pelo compose, sem o perfil `dev`.

### D3

**Tela**

- Notas em processamento (emissão ou cancelamento) atualizam o status na tela sem recarregar a página. A consulta
  para sozinha quando o status se resolve e respeita o intervalo que a API sugere.
- Os erros de cancelamento previstos no contrato viram mensagens que o usuário entende.
- Trocar de filtro com uma busca em andamento nunca mostra o resultado da busca anterior.

**BFF**

- Todo erro que sai do BFF segue um formato único, venha de onde vier. Descreva esse formato no README.

**Docker**

- Dockerfile multi-stage para o app.

### D4

**Tela**

- Uma nota com dados fora do contrato não derruba a lista: as outras aparecem e a tela indica o que ficou de fora.
- Quando a API limita as requisições (`429`), o app espera o tempo de `Retry-After` antes de tentar de novo, e o
  usuário entende o que está acontecendo. A espera pode ficar na tela ou no BFF; o que não pode é tentar de novo
  antes do tempo nem deixar o usuário sem explicação.
- Testes automatizados desses dois casos.
- README com as decisões técnicas e o porquê de cada uma.

**BFF**

- Valida as respostas da API contra o contrato, isola o item inválido e respeita o `429`: espera o `Retry-After` ele
  mesmo ou repassa o tempo para a tela esperar.

**Docker**

- Imagem com o build `standalone` do Next, rodando com usuário não-root e com healthcheck.
- A mesma imagem do app precisa rodar em ambientes diferentes trocando só variáveis de ambiente.

### D5

**Tela**

- Tela de novo destinatário (numa rota sua, por exemplo `/destinatarios/novo`) com o formulário montado a partir de
  `GET /v1/destinatarios/schema`: campos, rótulos, ordem, máscaras e validações vêm do schema. Os erros por campo
  que o servidor devolver aparecem no campo certo.
- Testes automatizados das regras de filtro, busca e cancelamento dos degraus anteriores.
- Um ADR curto (contexto, decisão, consequências) sobre uma decisão técnica sua, em `docs/adr/`.

**BFF**

- Toda chamada à API tem timeout.
- Um correlation id acompanha cada operação do navegador até a API e aparece nos logs do servidor e nas mensagens de
  erro.

**Docker**

- O README justifica o tamanho final da imagem e explica como o Dockerfile aproveita o cache de build.

## Parte B — revisão de código

O convite diz se a sua vaga inclui esta parte. Se não incluir, pule esta seção.

### O que fazer

Na sua cópia existe o branch **`feature/painel-faturamento`**. Ele traz um pull request que um colega do time deixou
pronto para revisão: o **painel de faturamento** (`/faturamento`).

1. Abra um pull request de `feature/painel-faturamento` para `main` **na sua cópia** (aba *Pull requests* → *New
   pull request*). Não mude o título nem a descrição.
2. Revise o PR como você revisaria no dia a dia e **comente inline**, na linha ou no trecho do ponto. Um comentário
   por assunto.
3. Em cada comentário, diga:
   - **o que** está errado ou arriscado;
   - **o que acontece** se isso for para produção (quem é afetado e em que situação);
   - **como você resolveria** (uma frase, um trecho de código ou um link de referência).
4. Marque cada comentário como **Bloqueia o merge** (precisa ser corrigido antes de entrar) ou **Sugestão** (melhora
   o código, mas não impede o merge).
5. No fim, deixe um **comentário geral** com o seu veredito (aprovar, aprovar com ressalvas ou pedir mudanças) e um
   resumo do que mais importa.

Comentar o que está bom também vale. **Não faça merge do PR nem commits no branch dele.** A avaliação é só sobre os
comentários.

### Se não der para usar o pull request

O jeito preferido é o de cima: comentários inline no pull request da sua cópia, no GitHub. Se você não conseguir
usar o pull request, entregue a revisão no arquivo **`docs/revisao-parte-b.md`**, no `main` da sua cópia (fora da
pasta `web/`):

- No topo, o **horário de início** e o **horário de fim** da revisão, com data e fuso. Os 40 minutos contam a partir do
  horário de início.
- **Um bloco por comentário**, com `arquivo:linha`, **Bloqueia o merge** ou **Sugestão**, e o texto do comentário (o
  que, o que acontece e como resolver, como no passo 3).
- No fim, o comentário geral com o veredito.

```markdown
Início: 01/12/2026 14:05 (horário de Brasília)
Fim: 01/12/2026 14:45 (horário de Brasília)

### `web/src/caminho/arquivo.tsx:42` — Sugestão

O que está errado ou arriscado, o que acontece em produção e como você resolveria.
```

### Quem escreveu

O autor é um **desenvolvedor júnior** do time, no segundo mês de casa, e vai ler cada comentário seu. **O tom conta
na avaliação:** explique o porquê, sugira o caminho e trate o código, não a pessoa.

### Tempo

**40 minutos**, contados a partir do momento em que você abre o PR (ou do horário de início, se entregar pelo
arquivo). Comentários feitos depois desse prazo não entram na avaliação. Faça a revisão quando quiser, dentro do prazo de entrega, numa sessão só.

Não dá para cobrir tudo com a mesma profundidade em 40 minutos. Priorize: o que pode causar dano em produção vem
antes de estilo.

### O que você pode usar

- Qualquer material de consulta, inclusive IA. Se usar IA, revise o que ela disser: você responde pelos comentários
  que publicar, inclusive pelos errados.
- Você pode fazer checkout do branch e rodar o app contra a API do kit (o `openapi.yaml` descreve as rotas de
  faturamento). Não é obrigatório: dá para revisar só lendo o código.

### Contexto do time

- O painel é usado pelo time financeiro. Em produção, o app fica atrás do login da empresa e passa por uma CDN.
- O PR segue as mesmas regras do resto do app descritas neste enunciado (BFF, testes, acessibilidade).
- O autor entrou no time há poucos meses e pediu atenção especial ao que não pode ir para produção do jeito que está.

## Parte C — entrevista ao vivo

Depois da entrega, marcamos uma conversa por vídeo de cerca de uma hora. Você mostra a sua entrega rodando, percorre
o código com a gente, explica as decisões e faz uma mudança pequena ao vivo, no seu ambiente. Chegue com o projeto
rodando e o editor aberto.

## Entrega

1. Trabalhe no `main` da sua cópia privada. Faça commits ao longo do trabalho, com mensagens que contem o que mudou
   e por quê. **Avaliamos o branch `main` da sua cópia** (ou o branch que o e-mail do convite indicar): se trabalhar
   em outro branch, faça o merge no `main` antes de responder ao e-mail.
2. Troque o `README.md` da raiz pelo seu. Ele precisa ter:
   - **como rodar**, do zero, com os comandos exatos;
   - **o degrau que você entregou**;
   - **as decisões técnicas** e o porquê de cada uma;
   - **o que ficou de fora** e por quê;
   - **uso de IA:** qual ferramenta e para quê.
3. Mantenha este `ENUNCIADO.md`, o `openapi.yaml` e o branch `feature/painel-faturamento` no repositório.
4. Não suba segredos: o `.env` e o `.env.local` ficam fora do Git (o `.gitignore` já cuida disso).
5. Convide a conta **`joaoveeiga`** como colaboradora (*Settings* → *Collaborators* → *Add people*).
6. Responda ao e-mail do convite com o link da sua cópia, dentro do prazo que ele indica.

## O que avaliamos

- **Funciona e está completo** no degrau mínimo, rodando a partir das instruções do seu README.
- **Comportamento correto** nos requisitos de cada degrau, inclusive quando a API demora, falha ou limita as
  requisições.
- **Código e testes** que outra pessoa do time consegue ler, manter e confiar.
- **Segurança:** a chave da API nunca chega ao navegador.
- **Comunicação:** README que outro dev usa sem precisar perguntar, decisões explicadas e commits claros.
- **Revisão de código** (Parte B): o que você encontra, como prioriza e como escreve para o autor.
- **Domínio da própria entrega** (Parte C): explicar o que fez e mudar o código com segurança.

## Perguntas frequentes

**Posso usar outra biblioteca?**
Sim: estado, requisições, componentes, validação, formulários, testes. Next.js com App Router é obrigatório. Explique
no README as escolhas que pesam.

**Posso mudar o esqueleto?**
Sim. Reorganize pastas, troque estilos e configurações, adicione rotas. O ponto de partida existe para poupar tempo,
não para limitar.

**Posso mudar o `docker-compose.yml`?**
Pode acrescentar o seu app e outros serviços. Não mude o serviço `mock-api` nem as redes: a avaliação sobe a API do
mesmo jeito.

**Preciso fazer a tela de faturamento?**
Não. Ela é o PR da Parte B.

**Preciso caprichar no visual?**
Não há layout para seguir. Uma interface limpa, legível e acessível basta. Gaste o tempo nos requisitos.

**Preciso publicar o app em algum lugar?**
Não. A avaliação roda a sua cópia a partir do README.

**Achei o enunciado ambíguo. E agora?**
Pode perguntar respondendo ao e-mail do convite. Se preferir não esperar, decida, registre a decisão no README e
siga.

**Não deu tempo de terminar o degrau mínimo. Entrego assim mesmo?**
Entregue. Diga no README o que ficou de fora e como você terminaria.
