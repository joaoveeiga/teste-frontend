# Teste técnico de frontend — Painel de Notas Fiscais

Este repositório é o ponto de partida do teste técnico de frontend. Ele traz o contrato de uma API fictícia de notas
fiscais, o compose que sobe essa API e o esqueleto de um app Next.js.

**O que fazer está no [`ENUNCIADO.md`](ENUNCIADO.md).** Leia o enunciado inteiro antes de começar.

## O que tem aqui

| Caminho | O que é |
|---|---|
| `ENUNCIADO.md` | As três partes do teste, a entrega e o que avaliamos |
| `openapi.yaml` | Contrato da API |
| `docker-compose.yml` | Sobe a API |
| `.env.example` | Variáveis do compose |
| `web/` | Esqueleto do app (Next.js com App Router, TypeScript, Vitest e Testing Library) |

O branch `feature/painel-faturamento` é o pull request da Parte B.

## Criar a sua cópia

Crie um repositório **privado e vazio** na sua conta do GitHub (sem README, `.gitignore` nem licença) e espelhe este
nele. O espelho traz o histórico e o branch da Parte B:

```bash
git clone --bare https://github.com/joaoveeiga/teste-frontend.git
cd teste-frontend.git
git push --mirror https://github.com/<seu-usuario>/<seu-repo>.git
cd .. && rm -rf teste-frontend.git
git clone https://github.com/<seu-usuario>/<seu-repo>.git
```

Trabalhe no `main` da sua cópia e convide a conta `joaoveeiga` como colaboradora (veja a entrega no
[`ENUNCIADO.md`](ENUNCIADO.md#entrega)).

## Pré-requisitos

- Node.js 22
- Docker com Compose v2 (`docker compose version`)
- Git e uma conta no GitHub

## Subir a API

```bash
cp .env.example .env    # troque o valor de MOCK_API_KEY se quiser
```

A API tem dois modos.

**Desenvolvimento** — para rodar o app fora do Docker, com `npm run dev`. Publica a API em `http://127.0.0.1:4010`:

```bash
docker compose --profile dev up -d
curl http://127.0.0.1:4010/health
curl -H "X-Api-Key: <valor de MOCK_API_KEY>" "http://127.0.0.1:4010/v1/notas?pageSize=1"
```

**Avaliação** — como a avaliação roda o seu app. A API fica só na rede interna do compose, sem porta publicada: só
serviços nessa rede alcançam, pelo endereço `http://mock-api:4010`. Use este modo quando o seu app também rodar no
compose (o serviço `web`, comentado no `docker-compose.yml`, é o ponto de partida):

```bash
docker compose up -d
```

Para parar, nos dois modos:

```bash
docker compose --profile dev down
```

## Rodar o app

Com a API no modo de desenvolvimento:

```bash
cd web
cp .env.example .env.local   # MOCK_API_KEY igual ao do .env da raiz
npm ci
npm run dev                  # http://localhost:3000
```

Os scripts do app (`lint`, `typecheck`, `test`, `build`) estão em [`web/README.md`](web/README.md).

## Entrega

Na entrega, troque este README pelo seu. O que ele precisa ter está no [`ENUNCIADO.md`](ENUNCIADO.md#entrega).
