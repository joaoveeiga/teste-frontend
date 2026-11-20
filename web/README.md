# Painel de Notas Fiscais (app)

Next.js (App Router), React 19 e TypeScript. O ponto de partida é este esqueleto: o layout com a navegação e as
páginas vazias. O que construir está no `ENUNCIADO.md`, na raiz do repositório.

```bash
cp .env.example .env.local   # URL e chave da API, lidas só pelo servidor
npm ci
npm run dev                  # http://localhost:3000
```

| Script | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` / `npm start` | Build de produção e servidor |
| `npm run lint` | ESLint (`eslint-config-next`) |
| `npm run typecheck` | Gera os tipos de rota do Next e roda o `tsc` |
| `npm test` | Vitest + React Testing Library (jsdom). Exemplo em `src/components/MainNav.test.tsx` |
