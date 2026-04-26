# Monster High Web

Aplicacion frontend de Monster High construida con React, TypeScript y Vite.

Esta app consume un catalogo estatico desde `public/api/characters.json` y ofrece tres flujos principales:

- listado de personajes
- detalle por personaje
- favoritos persistidos en `localStorage`

## Stack

- React 19
- React Router 7
- Vite 7
- SWR
- TypeScript
- Vitest + Testing Library
- ESLint + Prettier

## Rutas

- `/` y `/characters`: listado de personajes
- `/character/:slug`: detalle de personaje
- `/favorites`: vista de favoritos

## Estructura principal

```text
apps/web/
├── public/
│   └── api/
├── src/
│   ├── components/
│   ├── hooks/
│   ├── pages/
│   ├── styles/
│   ├── types/
│   └── utils/
├── vite.config.ts
├── vitest.config.ts
└── package.json
```

## Datos

- `useCharacters` carga la lista desde `/api/characters.json`.
- `useCharacter` resuelve un personaje concreto a partir del slug.
- `useFavorites` gestiona favoritos con almacenamiento local del navegador.

La app no consume directamente el backend de scraping en tiempo real.

## Desarrollo

Desde la raiz del monorepo:

```bash
npm run dev:web
```

Desde `apps/web`:

```bash
npm run dev
```

## Scripts disponibles

```bash
npm run dev
npm run build
npm run preview

npm test
npm run test:watch
npm run test:ui
npm run coverage

npm run compile
npm run lint
npm run format
npm run format:fix
```

## Testing

- El entorno de test usa `happy-dom`.
- La configuracion de Vitest vive en `vitest.config.ts`.
- El umbral de cobertura configurado es del 80% para lineas, funciones, ramas y statements.

## Notas

- `coverage/` y `dist/` pueden existir como artefactos locales de trabajo.
