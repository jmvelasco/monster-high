# Monster High Monorepo

Este repositorio agrupa dos aplicaciones relacionadas con Monster High:

- Un backend en TypeScript que extrae personajes desde Fandom, genera historias y persiste un catalogo en JSON.
- Un frontend en React + Vite que consume un catalogo estatico y ofrece listado, detalle y favoritos.

Sigue siendo un proyecto educativo y practico centrado en XP, TDD y colaboracion con agentes de IA, pero este README describe el estado actual del codigo, no flujos historicos que ya no aparecen en el repositorio.

---

## Estado actual del proyecto

- El monorepo se gestiona con npm workspaces.
- El backend vive en `apps/backend`.
- El frontend vive en `apps/web`.
- El archivo de datos generado por el backend se guarda en `data/monsterHighCharacters.json`.
- El frontend consume actualmente un JSON estatico servido desde `apps/web/public/api/characters.json`.

---

## Estructura del repositorio

```text
monster-high/
├── apps/
│   ├── backend/
│   │   ├── src/
│   │   │   ├── application/
│   │   │   ├── domain/
│   │   │   ├── infrastructure/
│   │   │   ├── config/
│   │   │   ├── __tests__/
│   │   │   └── index.ts
│   │   ├── .env.example
│   │   └── package.json
│   └── web/
│       ├── public/
│       │   └── api/
│       ├── src/
│       │   ├── components/
│       │   ├── hooks/
│       │   ├── pages/
│       │   ├── styles/
│       │   ├── types/
│       │   └── utils/
│       └── package.json
├── data/
├── docs/
│   └── adr/
├── .vscode/
├── package.json
└── README.md
```

Notas:

- La compilacion del backend esta configurada dentro de `apps/backend`.

---

## Funcionalidades

### Backend

- Obtiene el listado de personajes desde la wiki.
- Extrae detalles individuales de cada personaje.
- Genera una historia para cada personaje mediante Groq.
- Persiste incrementalmente el catalogo generado en JSON.
- Permite ejecutar el pipeline completo o limitarlo a un personaje concreto.

### Frontend

- Muestra una galeria de personajes.
- Ofrece una pagina de detalle por personaje.
- Permite marcar personajes como favoritos en `localStorage`.
- Usa SWR para cargar datos desde `/api/characters.json`.

---

## Tecnologias

### Base del monorepo

- Node.js 24.11.1
- npm workspaces
- TypeScript 5.9

### Backend

- Node.js + TypeScript
- Axios y Cheerio para scraping
- Groq SDK para generacion de historias
- Jest + ts-jest para testing
- ESLint + Prettier

### Frontend

- React 19
- React Router 7
- Vite 7
- SWR
- Vitest
- ESLint + Prettier

---

## Workflow Git actual

Las ramas principales actuales del repositorio son:

- `main`
- `development`

---

## Arquitectura backend

El backend sigue una separacion tipo hexagonal:

### Dominio

En `apps/backend/src/domain` viven las entidades y puertos del negocio. Aqui estan, entre otros:

- `Character`
- `CharacterRepository`
- `CharacterScraper`
- `CharacterStoryGenerator`
- `CharacterStories`
- `Logger`

La regla sigue siendo la misma: el dominio no debe depender de infraestructura ni de librerias externas.

### Aplicacion

En `apps/backend/src/application` viven los casos de uso:

- `GenerateCharacterCatalogUseCase`
- `PublishCharactersUseCase`

Estos casos de uso orquestan el flujo y dependen de puertos del dominio.

### Infraestructura

En `apps/backend/src/infrastructure` viven los adaptadores concretos:

- `scraper/WikiScraper`
- `ai/GroqStoryGenerator`
- `storage/JsonRepository`
- `stories/CharacterStoriesAdapter`
- `logger/Logger`

### Composition root

El punto de entrada es `apps/backend/src/index.ts`. Actualmente instancia `WikiScraper`, `GroqStoryGenerator`, `JsonRepository` y `Logger`, y ejecuta `GenerateCharacterCatalogUseCase`.

---

## Frontend

El frontend es una SPA en React con rutas para:

- `/` y `/characters`: listado de personajes
- `/character/:slug`: detalle de personaje
- `/favorites`: favoritos guardados en local

La aplicacion no consume en tiempo real el backend del scraper. A dia de hoy lee datos estaticos desde `public/api/characters.json`.

---

## Instalacion

### Requisitos

- Node.js 24.11.1 o compatible con `.nvmrc`
- npm
- `GROQ_API_KEY` para ejecutar la generacion de historias del backend

### Como conseguir una API key de Groq

Groq documenta la creacion de claves desde su Quickstart oficial y enlaza directamente a:

- `https://console.groq.com/keys`

Pasos recomendados:

1. Crea una cuenta o inicia sesion en Groq Console.
2. Abre `https://console.groq.com/keys`.
3. Genera una nueva API key desde el panel de claves.
4. Copia la clave en el momento de crearla.
5. Guardala en `apps/backend/.env` como `GROQ_API_KEY=...`.

### Setup

```bash
git clone https://github.com/jmvelasco/monster-high.git
cd monster-high
npm install

cd apps/backend
cp .env.example .env
```

Despues de copiar el archivo de entorno, configura `GROQ_API_KEY` en `apps/backend/.env`.

---

## Comandos principales

### Desde la raiz

```bash
npm run dev
npm run dev:backend
npm run dev:web

npm run build
npm run compile
npm test
npm run lint
npm run format
npm run format:fix
npm run clean
npm run validate
```

### Backend

```bash
cd apps/backend

npm start
npm start -- --character "Draculaura"

npm run dev
npm run compile
npm run compile:watch

npm test
npm run test:watch
npm run test:coverage

npm run lint
npm run lint:fix
npm run format
npm run format:fix
```

### Frontend

```bash
cd apps/web

npm run dev
npm run build
npm run preview

npm test
npm run test:watch
npm run coverage

npm run lint
npm run format
npm run format:fix
```

---

## Calidad y testing

- Backend: Jest con umbral global de cobertura del 80%.
- Frontend: Vitest con umbrales de cobertura del 80% para lineas, funciones, ramas y statements.
- El workflow del repo sigue las guias de XP, TDD y refactorizacion incremental descritas en `.github/copilot-instructions.md` y `.github/instructions/`.

Si trabajas en VS Code, puedes revisar `.vscode/README.md` para ver las tasks disponibles del workspace.

---

## Documentacion

Los ADR disponibles actualmente en `docs/adr/` son:

- `001-monorepo-structure.md`
- `002-multi-ide-configuration.md`
- `003-frontend-framework-selection.md`

---

## Trabajo con agentes de IA

El repositorio incluye instrucciones y skills para guiar a los agentes al trabajar sobre el codigo:

- `.github/copilot-instructions.md`
- `.github/instructions/`
- `.agents/skills/backend-hexagonal/`
- `.agents/skills/react-best-practices/`
- `scripts/setup-antigravity-local.sh`

`.github/` actua como fuente de verdad versionada para la guia de agentes. Si necesitas preparar una copia local para Antigravity en otra maquina, puedes materializarla con `scripts/setup-antigravity-local.sh`.

Estas guias refuerzan reglas de arquitectura, TDD, calidad y estilo de implementacion.

---

## Licencia

ISC License.

Los datos proceden de la comunidad de Monster High en Fandom y el proyecto se mantiene con fines educativos y tecnicos.