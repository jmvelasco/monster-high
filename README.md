# Monster High Monorepo

Este proyecto es una herramienta de extracción de datos (web scraper) diseñada para obtener información detallada sobre los personajes de _Monster High_ desde su Wiki en Fandom, integrando IA para generar cuentos personalizados. Incluye un backend TypeScript con arquitectura hexagonal y está preparado para una futura interfaz web React.

Más que una herramienta funcional, este repositorio es un **material educativo vivo** que muestra la evolución de una aplicación: desde un script monolítico hasta una **Arquitectura Hexagonal** robusta en un **monorepo escalable**.

---

## 📦 Estructura del Monorepo

```
monster-high/
├── apps/
│   └── backend/              # Scraper + AI processing (TypeScript)
│       ├── src/
│       │   ├── domain/       # Entidades y puertos (sin deps externas)
│       │   ├── application/  # Casos de uso (orquestación)
│       │   ├── infrastructure/ # Adaptadores (Axios, Groq, FileSystem)
│       │   └── __tests__/    # Tests unitarios TDD
│       └── package.json      # @monster-high/backend
├── data/                     # JSON output
├── .github/
│   └── skills/               # AI Agent Skills
├── docs/
│   ├── development-rules/    # XP, TDD, Coding Standards
│   └── adr/                  # Architecture Decision Records
└── package.json              # Workspace root
```

**Workspaces**: Gestionado con **npm workspaces** (Node.js 24+). Ver [ADR-001](docs/adr/001-monorepo-structure.md) para decisiones arquitectónicas.

---

## 🚀 Funcionalidades

- **Scraping de Personajes**: Extracción automatizada desde Fandom Wiki
- **Extracción de Detalles**: Obtención de infobox, imágenes y secciones biográficas
- **Procesamiento con IA**: Generación de cuentos adaptados para niños mediante Groq (Llama 3.1)
- **Persistencia de Datos**: Guardado incremental en `data/monsterHighCharacters.json`

---

## 🛠️ Tecnologías y Estándares

### Backend
- **TypeScript 5.9**: Tipado estático estricto
- **Node.js 24.11**: Runtime moderno (ver `.nvmrc`)
- **Axios & Cheerio**: HTTP client + HTML parsing
- **Groq SDK**: Integración con LLMs (Llama 3.1)
- **Jest + ts-jest**: Testing framework (TDD strict)

### Metodología
- **Extreme Programming (XP)**: Pair programming, TDD, refactoring continuo
- **Test-Driven Development**: Red-Green-Refactor con TPP transformations
- **YAGNI Principle**: No optimización prematura, simplicidad primero
- **No Mocks Policy**: Preferencia por Fakes sobre mocks técnicos

Ver documentación completa en [docs/development-rules/](docs/development-rules/).

---

## 🏗️ Arquitectura: El Corazón del Proyecto

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
git clone https://github.com/tu-usuario/monster-high.git
cd monster-high

# 2. Instalar dependencias (workspace)
npm install

# 3. Configurar variables de entorno
cd apps/backend
cp .env.example .env
# Editar .env y agregar tu GROQ_API_KEY
```

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

Eliminamos la carpeta `src/utils` (el típico "cajón de sastre"). Siguiendo el principio **YAGNI** (You Aren't Gonna Need It), descubrimos que muchas utilidades personalizadas (como `sleep.ts`) podían reemplazarse por estándares nativos (`node:timers/promises`), simplificando el sistema (**KISS**).

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
- *(próximos)*: React Router vs TanStack Router, State Management, etc.

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

- **Vercel AI Team**: Por react-best-practices skill
- **Monster High Wiki Community**: Por mantener la fuente de datos
- **Groq**: Por API gratuita de Llama 3.1

---

_Desarrollado con ❤️ usando Extreme Programming y Test-Driven Development_
