# Context files to reference:

---

## ⚠️ INSTRUCCIONES DE INTERPRETACIÓN (LEER PRIMERO)

### Principios Obligatorios

1. **Lee LITERALMENTE**: Si dice "(Always)", se aplica SIEMPRE a todo el código
2. **NO inventes**: Si algo no está escrito, NO asumas que existe o aplica
3. **NO deduzcas**: Aplica SOLO lo explícitamente definido en documentos
4. **Jerarquía clara**:
   - "(Always)" → Aplica a BACKEND + FRONTEND + TODO
   - "(when editing X)" → Aplica SOLO cuando trabajas en carpeta X
5. **Ante duda**: Consulta TECH-LEAD-QUESTIONS.md, NO asumas

### Estructura de Este Archivo

```
Core XP Methodology (Always)           ← TODO el proyecto (backend + frontend)
├─ Backend Development (apps/backend/*) ← Solo cuando editas backend
└─ Frontend Development (apps/web/*)    ← Solo cuando editas frontend
```

### Verificación Antes de Actuar

Antes de implementar CUALQUIER cosa, pregúntate:

- ¿Está esto ESCRITO en algún documento referenciado?
- ¿Entiendo LITERALMENTE lo que dice sin asumir?
- ¿He leído COMPLETAMENTE el documento antes de aplicarlo?

Si respondes NO a alguna, **DETENTE y consulta al Tech Lead**.

---

## Core XP Methodology (Always)

- [xp-methodology](docs/development-rules/xp-methodology.md)
- [coding-standards](docs/development-rules/coding-standards.md)
- [testing-standards](docs/development-rules/testing-standards.md)
- [tdd](docs/development-rules/tdd.md)

## Backend Development (when editing apps/backend/\*)

[backend skills](.github/skills/backend-hexagonal/SKILL.md)

- Hexagonal Architecture: Domain → Application → Infrastructure
- Domain MUST have zero external dependencies
- Ports (interfaces) in domain, adapters in infrastructure
- Use cases orchestrate, don't implement business logic

## Frontend Development (when editing apps/web/\*)

### Fuente de Verdad

[TECHNICAL-SPEC](apps/web/TECHNICAL-SPEC.md)

- Stack: React 19 + Vite + React Router + SWR
- Requisitos funcionales: RF-001 a RF-005
- Decisiones técnicas aprobadas: DT-001 a DT-008
- Estructura de proyecto definida
- Tema visual Monster High (colores, tipografía, espaciado)

### Guías de Trabajo Obligatorias

[TDD-WORKFLOW](apps/web/docs/TDD-WORKFLOW.md) (SEGUIR DISCIPLINADAMENTE)

- Checklist por cada test: 🤔 REASON → 🔴 RED → 🟢 GREEN → 🔵 REFACTOR → 🔄 RE-EVALUATE
- Transformaciones TPP aplicables a React (ordenadas simple → complejo)
- Antipatrones a evitar (7 ejemplos concretos)
- Plantillas de tests (componentes, hooks, servicios)
- Timing: ~15-20 min por test, reportar al completar componente

[REACT-OPTIMIZATION-DECISION-TREE](apps/web/docs/REACT-OPTIMIZATION-DECISION-TREE.md)

- 5 preguntas clave ANTES de optimizar (waterfalls, bundle, re-renders, listas, bloqueos)
- Métricas exactas para cada optimización (cuándo medir, cuándo aplicar)
- NUNCA optimizar sin medir primero (YAGNI estricto)
- Casos específicos Monster High: NO virtualizar (~30-50 personajes)

[MY-COMMIT-STRATEGY](apps/web/docs/MY-COMMIT-STRATEGY.md)

- Timing exacto: commit después de RED, GREEN, REFACTOR (si significativo)
- Formato obligatorio: test(<fase>): <descripción negocio>
- Estadísticas esperadas: ~15 commits por componente, 193-245 commits totales
- Integración con [PROGRESS](apps\web\PROGRESS.md): commit al completar componente

### Seguimiento y Comunicación

[PROGRESS](apps\web\PROGRESS.md) (ACTUALIZAR AL COMPLETAR COMPONENTE)

- 86 test cases listados con estado TDD por fase
- Métricas actuales: tests passing, coverage, bundle size
- Decisiones técnicas tomadas durante implementación
- Consultas pendientes al Tech Lead

[TECH-LEAD-QUESTIONS](apps/web/TECH-LEAD-QUESTIONS.md)

- Formato obligatorio: Contexto + Análisis (opciones A/B/C) + Pregunta + Recomendación
- Consultar cuando: arquitectura, requisitos ambiguos, trade-offs, tecnologías
- NO consultar: nombres variables, refactors menores, orden tests, linting
- Estados: PENDIENTE, RESUELTO, BLOQUEADO, DESCARTADO

### React Best Practices

[React Best Practices Skills](.github/skills/react-best-practices/SKILL.md)

- 45 rules across 8 categories (Waterfalls, Bundle, Server, Client, Re-render, Rendering, JS, Advanced)
- Apply performance optimizations ONLY when measured (YAGNI principle)
- SWR for data fetching (NO TanStack Query - ver TECHNICAL-SPEC.md)
- Accessibility-first approach

# Rules:

- Always use spanish to respond me
- Always write test first (Red-Green-Refactor)
- Always commit each step in the Red-Green-Refactor cycle. The commit message should be the test case description prepended with the TDD cycle step. For example: `test(red): <test case description>` for Red stage; `test(green): <test case description>` for Green stage. Optionally if a refactor is considered, also commit the changes done for the refactor applied related with the current TDD cycle.
- Use TPP transformations for simplest implementation
- No mocks without approval
- YAGNI principle strictly
- Refactor after each green test
- Performance optimization ONLY when measured as necessary (backend and frontend)
- Follow TDD cycle starting with the failing test when I begin implementation.
- If you add TODO notes in the test files to track the pending test cases ensure you update the status once it is validated
