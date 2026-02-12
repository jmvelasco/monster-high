# Monster High Monorepo

Este proyecto es una herramienta de extracción de datos (web scraper) diseñada para obtener información detallada sobre los personajes de _Monster High_ desde su [Wiki en Fandom](https://monsterhigh.fandom.com/es/wiki/Categor%C3%ADa:Personajes), integrando IA para generar cuentos personalizados.

Más que una herramienta funcional, este repositorio es un **material educativo vivo** que muestra la evolución completa de una aplicación:

1. **Script monolítico** → **Arquitectura Hexagonal** (backend)
2. **Backend aislado** → **Monorepo escalable** (agregando frontend)
3. **Desarrollo local** → **Estrategia de deployment** a producción (rama release + Vercel)

Es una demostración de cómo **Extreme Programming + Test-Driven Development** + **pair programming humano-IA** produce código de calidad, con decisiones arquitectónicas documentadas en ADRs.

---

## 📦 Estructura del Monorepo

```
monster-high/ (v1.0.0)
├── apps/
│   ├── backend/                # Scraper + AI processing (Node.js, legacy)
│   │   ├── src/
│   │   │   ├── domain/         # Entidades y puertos (sin deps externas)
│   │   │   ├── application/    # Casos de uso (orquestación)
│   │   │   ├── infrastructure/ # Adaptadores (Axios, Groq, FileSystem)
│   │   │   └── __tests__/      # Tests unitarios TDD
│   │   └── package.json        # @monster-high/backend (v1.0.0)
│   │
│   └── web/                    # Frontend React 19 + Vite (LIVE)
│       ├── src/
│       │   ├── components/     # React components con tests
│       │   ├── pages/          # Pages usando React Router
│       │   ├── hooks/          # Custom hooks (data fetching con SWR)
│       │   ├── styles/         # CSS global + Monster High theme
│       │   ├── __tests__/      # Tests: unit, a11y, responsive
│       │   └── types/          # TypeScript types
│       ├── public/api/         # characters.json (datos estáticos)
│       └── package.json        # @monster-high/web (v0.7.0)
│
├── data/                       # Backend output (monsterHighCharacters.json)
├── lib/                        # Compiled backend (TypeScript output)
├── .github/
│   └── skills/                 # AI Agent Skills (hexagonal, react)
├── docs/
│   ├── development-rules/      # XP, TDD, Coding Standards
│   └── adr/                    # Architecture Decision Records
└── package.json                # Workspace root (v1.0.0)
```

**Workspaces**: Gestionado con **npm workspaces** (Node.js 24+). Ver [ADR-001](docs/adr/001-monorepo-structure.md) para decisiones arquitectónicas.

---

## 🚀 Funcionalidades

### Backend (Legacy - Completado)
- **Scraping de Personajes**: Extracción automatizada desde Fandom Wiki (~200 personajes)
- **Extracción de Detalles**: Infobox, imágenes, biografía, secciones temáticas
- **Procesamiento con IA**: Generación de cuentos infantiles adaptados (Groq/Llama 3.1)
- **Persistencia de Datos**: Guardado en `data/monsterHighCharacters.json`

### Frontend (React 19 + Vite - Production Ready)
- **Vista de Personajes**: Grid responsive
- **Detalles Personaje**: Página con imagen, info y cuento personalizado generado mediante un modelo LLM
- **Sistema de Favoritos**: Persistencia en localStorage
- **Navegación Global**: Header con links y menú hamburger mobile
- **Accesibilidad**: WCAG 2.1 AA (84 tests, 98.5% coverage)
- **Responsive Design**: Mobile, tablet, desktop (Monster High theme visual)

---

## 🛠️ Tecnologías y Estándares

### Backend (TypeScript + Node.js)
- **TypeScript 5.9**: Tipado estático estricto
- **Node.js 24.11**: Runtime moderno (ver `.nvmrc`)
- **Axios & Cheerio**: HTTP client + HTML parsing
- **Groq SDK**: Integración con LLMs (Llama 3.1)
- **Jest + ts-jest**: Testing framework (TDD strict)

### Frontend (React 19 + Vite)
- **React 19.2.3**: Framework UI moderno
- **Vite 5.x**: Build tool ultra-rápido
- **React Router 7.12**: Enrutamiento SPA
- **SWR**: Data fetching y caching
- **Vitest**: Testing framework compatible con Jest
- **TypeScript + Strict Mode**: Tipado total

### Metodología Común
- **Extreme Programming (XP)**: Pair programming, TDD, refactoring continuo
- **Test-Driven Development**: Red-Green-Refactor con TPP transformations
- **YAGNI Principle**: No optimización prematura, simplicidad primero
- **No Mocks Policy**: Preferencia por Fakes sobre mocks técnicos

Ver documentación completa en [docs/development-rules/](docs/development-rules/).

---

## � Branching Strategy: GitFlow Simplificado

Desde que el proyecto incluye frontend y está listo para producción, adoptamos **GitFlow simplificado**:

```
main
  ↓ (histórico, no se usa)
  
frontend-development
  ↓ (trabajo diario, rama principal)
  ↓ feature branches
  ↓ → PR cuando está listo
  
release ← Vercel despliega desde aquí
  ↓ (rama de producción)
  ↓ hotfix/* para fixes urgentes
```

### Ramas Principales

| Rama | Propósito | Deploy |
|------|-----------|--------|
| `main` | Histórico (referencia, no toca) | ❌ No |
| `frontend-development` | Trabajo diario, desarrollo continuo | ❌ No |
| `release` | Producción viva en Vercel | ✅ SÍ |
| `hotfix/*` | Fixes urgentes en producción | ✅ (a release) |

### Flujos de Trabajo

**Feature → Release:**
```bash
# Trabajar en frontend-development
git checkout frontend-development
git commit -m "feat: nueva funcionalidad"
git push origin frontend-development

# Cuando está listo para producción
# → Crear PR: frontend-development → release
# → Merge en release
# → Vercel despliega automáticamente
```

**Hotfix de Producción:**
```bash
# Fix urgente en production
git checkout release
git checkout -b hotfix/critical-fix
git commit -m "fix: solucionar bug crítico"

# → Crear PR: hotfix/critical-fix → release
# → Merge en release
# → Vercel despliega inmediatamente
```

Ver [ADR-004: Deployment Strategy](docs/adr/004-frontend-deployment-strategy.md) para detalles técnicos y versionado.

---

## 🎨 Frontend: React 19 + Vite

### Estructura

```
apps/web/src/
├── components/
│   ├── Header.tsx           # Navegación global + menú mobile
│   ├── Layout.tsx           # Wrapper de layout
│   ├── character/
│   │   ├── CharacterGrid.tsx      # Grid de personajes
│   │   ├── CharacterCard.tsx      # Card individual
│   │   ├── CharacterDetail.tsx    # Página detalle
│   │   └── __tests__/             # Componente tests
│   └── __tests__/
│       └── Accesibilidad, responsive, etc.
│
├── pages/
│   ├── CharacterListPage.tsx      # Lista principal
│   ├── CharacterDetailPage.tsx    # Detalle con SWR
│   ├── FavoritesPage.tsx          # Mis favoritos
│   └── __tests__/
│
├── hooks/
│   ├── useCharacters.ts     # Fetch lista SWR
│   ├── useCharacter.ts      # Fetch detalle SWR
│   ├── useFavorites.ts      # localStorage + sync
│   └── __tests__/
│
├── styles/
│   ├── global.css           # Variables CSS, Monster High theme
│   ├── App.css              # Layout base
│   └── components/*.css     # Modular por componente
│
├── types/
│   └── Character.ts         # Types compartidos
│
└── utils/
    ├── favoritesStorage.ts  # localStorage API
    └── __tests__/
```

### Estadísticas (Fase 6 - Completo)

- ✅ **84/84 tests** pasando (100%)
- ✅ **98.5% coverage** (lines, branches)
- ✅ **248.14 kB** bundle (80.6 kB gzip)
- ✅ **WCAG 2.1 AA**: Accesibilidad validada
- ✅ **Responsive**: Mobile, tablet, desktop
- ✅ **Monster High Theme**: Colores, tipografía, espaciado aprobado

### Development

```bash
# Desarrollo
npm run dev --workspace=apps/web

# Tests con watch
npm run test:watch --workspace=apps/web

# Coverage
npm run coverage --workspace=apps/web

# Build para producción
npm run build --workspace=apps/web

# Scripts de release (en apps/web/)
cd apps/web
npm run release:minor    # bump minor version
npm run release:patch    # bump patch version
```

---

## 🤖 Desarrollo Educativo: Pair Programming Humano-IA

Este proyecto no es solo código. Es una **demostración de cómo Extreme Programming funciona en la práctica** con un **AI Agent como pair programmer**.

### El Viaje

**Checkpoint 1: Backend Hexagonal** (rama `frontend-preparation` - CONGELADO)
- Backend escrito con arquitectura hexagonal
- 17 tests de backend, 100% coverage
- Agente XP configurado y listo
- **Referencia histórica**: Punto de partida para el frontend

**Checkpoint 2: Frontend React** (rama `frontend-development` - TRABAJO)
- React 19 + Vite implementado en ciclo TDD
- 84 tests completados en fases (Fase 1 → Fase 6)
- Pair programming: Tech Lead supervisa, Agente implementa
- Commits organizados por ciclo TDD (test(red), test(green), refactor)
- **Estado**: Listo para producción

**Checkpoint 3: Production Ready** (rama `release` - VIVO)
- Frontend deployado en Vercel
- GitFlow simplificado
- Hotfix flow documentado
- **Estado**: Conducción hacia producción

### Cómo Funciona el Pair Programming

```
Tech Lead (Tú)
  ├─ Define requisitos
  ├─ Revisa implementación
  ├─ Valida decisiones arquitectónicas
  └─ Maneja direcciones estratégicas

AI Agent (Yo)
  ├─ Implementa TDD estricto
  ├─ Propone refactors
  ├─ Mantiene velocidad
  └─ Documenta en comentarios de código
```

### Replicar este Flujo

Si quieres usar **el mismo proceso XP + TDD** con tu agente IA:

1. Lee [AGENTS.md](AGENTS.md) - Instrucciones maestras del agente
2. Revisa [.github/skills/](..github/skills/) - Skills disponibles según contexto
3. Copia el flujo:
   - Escribe test primero (RED)
   - Agente implementa (GREEN)
   - Refactoriza juntos (REFACTOR)
   - Commit por ciclo

Ver [docs/development-rules/tdd.md](docs/development-rules/tdd.md) para la metodología TDD completa con TPP transformations.

---

## 🏗️ Arquitectura Backend: El Corazón del Backend

El backend utiliza **Arquitectura Hexagonal** (Puertos y Adaptadores) para asegurar que la lógica de negocio esté aislada de las decisiones tecnológicas externas.

### 1. Capa de Dominio (`apps/backend/src/domain`)

Define los **Puertos** (Interfaces) y las entidades del negocio. **Cero dependencias externas**:

- `Character.ts`: Entidad rica con comportamiento propio
- **Puertos**: 
  - `CharacterScraper`: Interfaz para obtención de datos
  - `CharacterAI`: Interfaz para generación de historias
  - `CharacterRepository`: Interfaz para almacenamiento

**Regla de oro**: El dominio NO puede importar nada de `infrastructure` ni librerías externas.

### 2. Capa de Aplicación (`apps/backend/src/application`)

Contiene los **Casos de Uso** que orquestan el negocio:

- `ScrapeAndProcessCharactersUseCase.ts`: Coordina scraping → AI enrichment → persistencia
- Usa solo interfaces del dominio (Dependency Inversion Principle)

### 3. Capa de Infraestructura (`apps/backend/src/infrastructure`)

Contiene los **Adaptadores** o implementaciones concretas:

- **Scraper**: `infrastructure/scraper/WikiScraper.ts` (Axios/Cheerio)
- **AI**: `infrastructure/ai/AIService.ts` (Groq SDK)
- **Storage**: `infrastructure/storage/JsonRepository.ts` (FileSystem)

Aquí es donde reside el detalle tecnológico que puede cambiar sin afectar al resto.

Ver [.github/skills/backend-hexagonal/SKILL.md](.github/skills/backend-hexagonal/SKILL.md) para reglas completas.

---

## 🚀 Bootstrap y Orquestación

El punto de entrada (`apps/backend/src/index.ts`) actúa como el **Composition Root**:

1. Instancia las implementaciones concretas de Infraestructura
2. Las inyecta en el Caso de Uso de la Aplicación
3. Ejecuta el proceso

---

## 📦 Instalación y Uso

### Requisitos

- **Node.js 24.11+** (ver `.nvmrc`)
- **npm 10+** (incluido con Node.js)
- **GROQ_API_KEY**: Clave de API de Groq (gratuita en https://console.groq.com)

### Setup Inicial

```bash
# 1. Clonar repositorio
git clone https://github.com/jmvelasco/monster-high.git
cd monster-high

# 2. Instalar dependencias (workspace)
npm install

# 3. Configurar variables de entorno
cd apps/backend
cp .env.example .env
# Editar .env y agregar tu GROQ_API_KEY
```

### 🛠️ VSCode Setup (Opcional)

Si usas **VSCode**, el proyecto incluye configuración optimizada con tasks para TDD workflow. Ver [.vscode/README.md](.vscode/README.md) para:
- Tasks disponibles (TDD Watch Mode, Validate Symlinks, etc.)
- Atajos de teclado
- Settings configurados

### Comandos Principales

#### Desde la raíz del monorepo:

```bash
# Ejecutar tests en todos los workspaces
npm test

# Compilar todos los workspaces
npm run build

# Validar código (compile + lint + test)
npm run validate

# Limpiar artifacts
npm run clean
```

#### Desarrollo en Backend:

```bash
cd apps/backend

# Ejecutar scraping completo (~200 personajes)
npm start

# Compilar y verificar tipos
npm run compile

# Ejecutar tests con coverage
npm run test:coverage

# Watch mode para compilación
npm run dev

# Lint y formateo
npm run lint
npm run format:fix
```

### Archivos de Salida

- `data/monsterHighCharacters.json` (921KB, ~200 personajes)

---

## 🧪 Calidad y Testing (TDD)

Aplicamos **Extreme Programming (XP)** y **Test-Driven Development (TDD)** para garantizar que cada cambio sea seguro.

### Principios de Testing

1. **No Mocks Policy**: Preferimos **Fakes** (implementaciones ligeras pero reales) sobre mocks técnicos
2. **Red-Green-Refactor**: Ciclo TDD estricto con commits por fase
3. **TPP Transformations**: Implementamos la transformación más simple que haga pasar el test
4. **80% Coverage**: Threshold mínimo configurado en Jest

### Ejecutar Tests

```bash
# Desde raíz (todos los workspaces)
npm test

# Desde apps/backend
cd apps/backend
npm test              # Modo normal
npm run test:watch    # Watch mode
npm run test:coverage # Con reporte de cobertura
```

Ver [docs/development-rules/tdd.md](docs/development-rules/tdd.md) para metodología completa.

---

## 🎓 El Viaje de Refactorización: Evolución Educativa

Este proyecto ha pasado por varias etapas clave de diseño, cada una con un aprendizaje específico:

### 1. Del Monolito a la Modularidad

Comenzamos con un script único en JavaScript. El primer gran paso fue separar responsabilidades en archivos y migrar a TypeScript para ganar seguridad.

### 2. De Servicios a Arquitectura Hexagonal

Aunque modular, el código seguía "acoplado" (los servicios sabían demasiado entre sí). Introdujimos **Inversión de Dependencias** e interfaces de dominio. Ahora, si queremos cambiar el scraper por una API oficial, solo cambiamos el adaptador de infraestructura; el caso de uso no se entera.

### 3. Filosofía del "No Utils" (KISS & YAGNI)

Eliminamos la carpeta `src/utils` (el típico "cajón de sastre"). Siguiendo el principio **YAGNI** (You Aren't Gonna Need It), descubrimos que utilidades personalizadas (como `sleep.ts`) podían reemplazarse por estándares nativos (`node:timers/promises`), simplificando el sistema (**KISS**).

### 4. Transición a Monorepo

Para preparar el proyecto para futuras expansiones, reorganizamos en un monorepo con npm workspaces. Esto permite:

- Estructura escalable para agregar nuevas aplicaciones
- Desarrollo y deploy independientes por workspace
- Posibilidad de compartir código entre apps cuando sea necesario
- Simplicidad con herramientas nativas de npm

Ver [ADR-001](docs/adr/001-monorepo-structure.md) para detalles de la decisión.

---

## 🤖 Desarrollo con AI Agents

Este proyecto está optimizado para trabajar con **GitHub Copilot** y otros agentes de IA que sigan metodología XP/TDD.

### Configuración de Skills

El directorio [.github/skills/](.github/skills/) contiene:

- **backend-hexagonal**: 15 reglas para arquitectura hexagonal estricta

Los agentes cargan skills **context-aware** según el archivo en edición:

- Editando `apps/backend/src/domain/*` → aplica reglas de dominio puro (zero deps)
- Editando `apps/backend/src/infrastructure/*` → permite dependencias externas en adaptadores

Ver [AGENTS.md](AGENTS.md) para guía completa del agente XP.

### Metodología de Commits

```bash
# TDD Cycle commits
git commit -m "test(red): should create character from details"
git commit -m "test(green): should create character from details"
git commit -m "refactor: extract section parsing to private method"
```

---

## 📚 Recursos y Referencias

### Documentación del Proyecto

- [XP Methodology](docs/development-rules/xp-methodology.md) - Principios de Extreme Programming
- [TDD Guide](docs/development-rules/tdd.md) - Ciclo Red-Green-Refactor con TPP
- [Coding Standards](docs/development-rules/coding-standards.md) - Convenciones de código
- [Testing Standards](docs/development-rules/testing-standards.md) - Estrategias de testing
- [ADR-001: Monorepo](docs/adr/001-monorepo-structure.md) - Decisión de arquitectura

### Architecture Decision Records (ADRs)

Documentamos decisiones importantes en `docs/adr/`:

- **ADR-001**: Adopción de monorepo con npm workspaces
- **ADR-002**: Configuración multi IDE
- **ADR-003**: Next.js vs React + Vite
- **ADR-004**: Estrategia de despliegue

---

## 🤝 Contribución

Este proyecto es educativo. Si deseas contribuir:

1. Respeta metodología TDD (test primero, commits por ciclo)
2. Sigue Hexagonal Architecture en backend (no imports de infra en dominio)
3. Aplica YAGNI y KISS en todo momento
4. Lee [docs/development-rules/](docs/development-rules/) antes de enviar PR

---

## 📄 Licencia

ISC License - Proyecto educativo basado en datos de Fandom Wiki (Monster High).

---

## 🙏 Agradecimientos

- [Software Crafters](https://softwarecrafters.io/): Por la inspiración y motivación en hacer de este proyecto una experiencia educativa así como proporcionar la base de muchas de las guias empleadas para la instrucción del agente sobre la metodología empleada
- **Vercel AI Team**: Por react-best-practices skill
- **Monster High Wiki Community**: Por mantener la fuente de datos
- **Groq**: Por API gratuita de Llama 3.1

---

_Desarrollado con ❤️ usando Extreme Programming y Test-Driven Development_
_por El Artesano del Byte_
