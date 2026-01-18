# ADR-001: Adopción de Estructura Monorepo con npm Workspaces

**Estado**: Aceptado  
**Fecha**: 2026-01-18  
**Contexto**: Preparación para desarrollo de frontend React + Backend TypeScript

---

## Contexto y Problema

El proyecto Monster High comenzó como un scraper backend con arquitectura hexagonal. La necesidad de desarrollar una interfaz de usuario (React + Vite) para visualizar los personajes scrapeados requiere una reorganización estructural del proyecto.

### Requisitos:
- Separar backend de futura aplicación frontend
- Mantener dominio compartido entre backend y frontend (type-safety)
- Permitir desarrollo y deploy independientes
- Minimizar complejidad de configuración (YAGNI)
- Mantener XP/TDD workflow sin fricción

---

## Decisión

Adoptamos una **estructura monorepo** con **npm workspaces** para gestionar múltiples paquetes:

```
monster-high/
├── apps/
│   ├── backend/          # Scraper + AI processing (existente)
│   └── web/              # React UI (futuro)
├── packages/
│   └── domain/           # Tipos compartidos (futuro, si necesario)
├── data/                 # JSON output (compartido)
├── .github/skills/       # Agent skills (backend + frontend)
└── docs/                 # Documentación + ADRs
```

### Características de la decisión:

1. **npm workspaces** como gestor (no Turbo, no pnpm, no Lerna)
2. **apps/backend** como workspace independiente con su propio package.json
3. Scripts delegados desde raíz a workspaces (`npm run test --workspaces`)
4. Path adjustments mínimos para mantener funcionamiento tras reorganización

---

## Alternativas Consideradas

### Opción A: Mantener estructura plana (rechazada)
- ❌ Dificulta separación de concerns frontend/backend
- ❌ Compilaciones mezcladas (backend TypeScript + frontend React)
- ❌ Imposible compartir tipos sin publicar a npm

### Opción B: Repositorios separados (rechazada)
- ❌ Rompe type-safety entre frontend y backend
- ❌ Requiere publicación de paquete `@monster-high/types` a registry
- ❌ Dificulta desarrollo sincronizado (dos repos, dos PRs)

### Opción C: Turbo Monorepo (rechazada - YAGNI)
- ❌ Overhead de configuración para proyecto de 2 apps
- ❌ Cache y pipelines innecesarios en fase inicial
- ✅ Se puede migrar más adelante si crece complejidad

### Opción D: pnpm workspaces (rechazada - YAGNI)
- ❌ Requiere instalar pnpm (dependencia extra)
- ❌ Node.js 24.11.1 ya incluye npm 10+ con workspaces estables
- ✅ No aporta valor en proyecto de <5 paquetes

---

## Consecuencias

### Positivas ✅

1. **Escalabilidad futura**: Preparado para agregar frontend, packages compartidos, etc.
2. **Independencia**: Cada workspace se compila/testea/despliega por separado
3. **Simplicidad**: npm workspaces es built-in, cero configuración adicional
4. **XP Workflow**: Tests y TDD continúan sin cambios en cada workspace
5. **Mantenibilidad**: Separación clara de responsabilidades por directorio

### Negativas ⚠️

1. **Path adjustments**: Algunos imports necesitaron ajuste (`../../../data`)
2. **Learning curve**: Desarrolladores deben entender workspace structure
3. **Hoisting**: Dependencias se hoistean a raíz (puede causar confusión en debugging)

### Riesgos 🔥

- **Versioning de paquetes compartidos**: Si crece, necesitaremos strategy de versionado
- **Migraciones futuras**: Migrar a Turbo/pnpm requeriría refactor (bajo impacto si se hace temprano)

---

## Implementación

### Cambios Realizados (Fase 2)

1. **Creación de estructura**:
   ```bash
   mkdir -p apps/backend
   mv src apps/backend/
   ```

2. **Configuración de workspaces** (package.json raíz):
   ```json
   {
     "private": true,
     "workspaces": ["apps/*", "packages/*"],
     "scripts": {
       "dev": "npm run dev --workspace=apps/backend",
       "test": "npm run test --workspaces"
     }
   }
   ```

3. **Renombrado de paquete backend**:
   ```json
   {
     "name": "@monster-high/backend",
     "scripts": {
       "start:test": "TEST_MODE=true ts-node src/index.ts"
     }
   }
   ```

4. **Adaptación de configuración**:
   - `config.ts`: Modo test con `maxCharacters: 2` y `outputFile: 'test-characters.json'`
   - `WikiScraper.ts`: Limitar scraping con `slice(0, maxCharacters)`
   - Tests: Ajustados para respetar `maxCharacters` en assertions

5. **Validación**:
   - ✅ Compilación: `npm run compile` sin errores
   - ✅ Tests: 17/17 pasando
   - ✅ Ejecución: Backend funciona correctamente tras reorganización
   - ✅ Path adjustments: Configuración actualizada para estructura de monorepo

---

## Próximos Pasos

1. ✅ **Completado**: Reorganización backend en monorepo
2. ✅ **Completado**: Actualizar README con nueva estructura
3. ⏳ **Pendiente**: Crear `apps/web` con React + Vite
4. ⏳ **Pendiente**: Evaluar necesidad de `packages/domain` para tipos compartidos
5. ⏳ **Pendiente**: Configurar CI/CD para builds independientes (GitHub Actions)

---

## Referencias

- [npm workspaces docs](https://docs.npmjs.com/cli/v10/using-npm/workspaces)
- [Monorepo best practices](https://monorepo.tools/)
- XP Methodology: `docs/development-rules/xp-methodology.md`
- YAGNI Principle: No optimización prematura, agregar complejidad solo cuando sea necesario

---

**Decisión tomada por**: José Manuel Velasco (con asistencia de GitHub Copilot XP Agent)  
**Revisado por**: -  
**Aprobado**: Implementación en Fase 2 validada exitosamente
