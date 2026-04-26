# ADR-001: Adopción de Estructura Monorepo con npm Workspaces

**Estado**: Aceptado  
**Fecha**: 2026-01-18

---

## Contexto

Monster High dejó de ser solo un backend de scraping y pasó a necesitar varias aplicaciones dentro del mismo repositorio, al menos:

- un backend en TypeScript
- un frontend web en React

La estructura plana original hacía más difícil separar responsabilidades, escalar el proyecto y ejecutar workflows independientes por aplicación.

Los criterios de decisión fueron:

- separar claramente backend y frontend
- permitir scripts independientes por aplicación
- mantener una configuración simple
- evitar tooling adicional sin necesidad real

---

## Decisión

Se adopta una estructura monorepo con `npm workspaces`.

La organización base del repositorio queda orientada a:

```text
monster-high/
├── apps/
│   ├── backend/
│   └── web/
├── data/
├── docs/
├── .github/
└── package.json
```

Principios de la decisión:

1. `npm workspaces` es el gestor de workspaces del proyecto.
2. Cada aplicación vive en `apps/` con su propio `package.json`.
3. La raíz del repo orquesta scripts comunes delegando en los workspaces.
4. No se introduce tooling adicional de monorepo mientras npm cubra las necesidades actuales.

---

## Alternativas consideradas

### Opción A: Mantener estructura plana

Rechazada porque mezcla concerns de backend y frontend y complica la evolución del repositorio.

### Opción B: Repositorios separados

Rechazada porque aumenta la fricción operativa, rompe el desarrollo coordinado y añade coste de sincronización entre proyectos.

### Opción C: Herramientas de monorepo más complejas como Turbo o pnpm

Rechazada por YAGNI. En el tamaño actual del proyecto, `npm workspaces` cubre el caso con menor complejidad operativa.

---

## Consecuencias

### Positivas

1. Backend y frontend quedan separados de forma explícita.
2. Cada workspace puede compilarse, testearse y evolucionar con cierta independencia.
3. La raíz del repositorio puede ofrecer comandos comunes para validación y desarrollo.
4. La estructura es suficiente para crecer sin introducir complejidad prematura.

### Negativas

1. Aparece cierta curva de aprendizaje para entender workspaces y ejecución desde la raíz.
2. El hoisting de dependencias puede hacer menos obvio dónde vive una dependencia durante depuración.
3. Si en el futuro aparecen más paquetes compartidos o pipelines complejos, esta decisión puede necesitar revisión.

---

## Revisión futura

Esta decisión debería revisarse si ocurre alguna de estas condiciones:

- aparecen varios paquetes compartidos con versionado propio
- el pipeline de build/test del monorepo gana complejidad significativa
- npm workspaces deja de ser suficiente para el tamaño real del repositorio

---

## Referencias

- [npm workspaces docs](https://docs.npmjs.com/cli/v10/using-npm/workspaces)
- [Monorepo tools](https://monorepo.tools/)
- Agent guidance: `.github/copilot-instructions.md` y `.github/instructions/`