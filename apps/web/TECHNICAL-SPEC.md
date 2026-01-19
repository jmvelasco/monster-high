# Especificación Técnica - Frontend Monster High

> **Fuente de Verdad**: Este documento es la referencia técnica principal para el desarrollo del frontend. Extraído de ADR-003 pero mantenido de forma independiente.

**Última actualización**: 2026-01-19  
**Estado**: En desarrollo  
**Desarrollador**: Agente XP  
**Tech Lead**: José Manuel Velasco

---

## Stack Tecnológico

### Core Dependencies

```json
{
  "react": "^19.2.3",
  "react-dom": "^19.2.3",
  "vite": "^7.3.1",
  "react-router-dom": "^7.12.0",
  "swr": "^2.3.8"
}
```

### DevDependencies

```json
{
  "typescript": "^5.9.3",
  "vitest": "^4.0.17",
  "@testing-library/react": "^16.3.2",
  "@testing-library/jest-dom": "^6.9.1",
  "@testing-library/user-event": "^14.6.1",
  "happy-dom": "^20.3.3",
  "eslint": "^9.39.2",
  "prettier": "^3.8.0"
}
```

### Styling

- **Strategy**: CSS Modules
- **Reason**: Simplicidad (YAGNI), scoped styles automáticos, sin dependencias extra

---

## Requisitos Funcionales

### RF-001: Listado de Personajes

**Descripción**: Página principal con cuadrícula responsive de personajes.

**Criterios de Aceptación**:
- ✅ Mostrar todos los personajes de `data/monsterHighCharacters.json`
- ✅ Card con imagen pequeña arriba + nombre debajo
- ✅ Click en card navega a `/character/:slug`
- ✅ Grid responsive: 2 cols mobile (<768px), 3 cols tablet (768-1024px), 4 cols desktop (>1024px)
- ✅ Placeholder Monster High para imágenes faltantes
- ✅ Lazy loading de imágenes (`loading="lazy"`)

**Componentes**:
- `CharacterListPage.tsx` (página)
- `CharacterGrid.tsx` (grid)
- `CharacterCard.tsx` (card individual con `variant="list"`)
- `useCharacters.ts` (hook SWR)

---

### RF-002: Detalle de Personaje

**Descripción**: Página de detalle con layout 2 columnas (desktop) / 1 columna (mobile).

**Criterios de Aceptación**:
- ✅ Layout responsive:
  - Desktop (>1024px): 2 columnas (imagen izq. + info der.)
  - Tablet/Mobile (<1024px): 1 columna (imagen arriba + info abajo)
- ✅ Columna izquierda: Imagen grande del personaje
- ✅ Columna derecha superior: Ficha técnica (`technicalInfo`)
  - Campos: edad, sexo, ocupación, mascota, familiares, mejoresAmigos
  - Manejo de campos opcionales (undefined o "")
- ✅ Columna derecha inferior: Historia (`globalStory`)
  - Tipografía Gruenewald VA aplicada **exclusivamente** aquí
  - Placeholder visual si `globalStory` es undefined o ""
- ✅ Botón "Volver" a listado principal
- ✅ Página 404 si slug no existe
- ✅ Manejo de imágenes rotas (placeholder)

**Componentes**:
- `CharacterDetailPage.tsx` (página)
- `CharacterDetail.tsx` (componente único: imagen + ficha técnica + historia)
- `useCharacter.ts` (hook para personaje individual por slug)

**Nota de diseño**: Se aplica principio KISS consolidando imagen, technicalInfo y globalStory en un solo componente cohesivo. La aplicación de la fuente Gruenewald VA se maneja vía CSS en la sección de historia.

---

### RF-003: Sistema de Favoritos

**Descripción**: Agregar/quitar favoritos con persistencia en localStorage.

**Criterios de Aceptación**:
- ✅ CTA en detalle de personaje para agregar/quitar favorito
  - Icono ♥ relleno si es favorito
  - Icono ♡ vacío si no lo es
- ✅ Persistencia en localStorage (key: `monster-high-favorites`)
- ✅ Estructura: Array de slugs únicamente → `["draculaura", "clawdeen-wolf"]`
- ✅ Página dedicada `/favorites` con listado de favoritos
- ✅ `CharacterCard` con `variant="favorite"`:
  - Imagen más grande (2x respecto a listado)
  - Sin nombre debajo
  - Distinción visual clara
- ✅ Graceful degradation si localStorage no disponible (in-memory storage)
- ✅ Validación de slugs únicos (no duplicar favoritos)

**Componentes**:
- `FavoritesPage.tsx` (página)
- `useFavorites.ts` (hook con localStorage)
- `favoritesStorage.ts` (servicio CRUD)
- Reutilización de `CharacterCard` con variant

---

### RF-004: Navegación Global

**Descripción**: Header permanente en todas las páginas.

**Criterios de Aceptación**:
- ✅ Visible en todas las páginas
- ✅ Links a:
  - Listado completo (home `/`)
  - Favoritos (`/favorites`)
- ✅ Active link destacado visualmente
- ✅ Responsive: hamburger menu en mobile (<768px)
- ✅ Accesible: navegación por teclado (Tab, Enter)
- ✅ ARIA labels apropiados

**Componentes**:
- `Header.tsx` (navegación)
- `Layout.tsx` (wrapper con Header)

---

### RF-005: Responsive & Accesibilidad

**Descripción**: Mobile-first approach con WCAG AA compliance.

**Criterios de Aceptación**:
- ✅ Breakpoints:
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px
- ✅ Semantic HTML (nav, main, article, section)
- ✅ ARIA labels donde sea necesario
- ✅ Contraste de colores WCAG AA
- ✅ Navegación por teclado funcional
- ✅ Focus visible en elementos interactivos

---

## Requisitos No Funcionales

### RNF-001: Metodología TDD

- **Ciclo obligatorio**: 🤔 REASON → 🔴 RED → 🟢 GREEN → 🔵 REFACTOR → 🔄 RE-EVALUATE
- **TODO List**: Lista de casos simple→complejo ANTES de codificar
- **Un test a la vez**: Nunca tener más de un test fallando
- **Commits por fase**: RED, GREEN, REFACTOR individuales
- **Refactor obligatorio**: Después de cada GREEN aplicar coding-standards

### RNF-002: YAGNI Principle

- **No optimizar prematuramente**: Aplicar React Best Practices SOLO cuando se mida necesidad
- **Simplicidad primero**: KISS > Composite pattern
- **Medir antes de optimizar**: Profiler, Lighthouse, bundle analyzer

### RNF-003: Testing Standards

- **Framework**: Vitest + React Testing Library + happy-dom
- **Coverage mínimo**: 80% (lines, functions, branches, statements)
- **Patrón AAA**: Arrange / Act / Assert con separación visual
- **FIRST**: Fast, Isolated, Repeatable, Self-validating, Timely
- **NO mocks sin aprobación**: Consultar Tech Lead antes de mockear

### RNF-004: Type Safety

- **TypeScript strict mode**: Activado
- **Tipos generados**: Quicktype desde JSON + refinamiento manual
- **No any**: Prohibido uso de `any` sin justificación documentada

### RNF-005: Coding Standards

- **Funciones <15 líneas**: Métrica para detectar SRP violation
- **Nombres autodocumentados**: Sin comentarios salvo extrema necesidad
- **CQS estricto**: Commands mutan sin retornar, Queries retornan sin mutar
- **Sin mutación de colecciones**: Usar operaciones inmutables
- **Guard clauses**: Salir pronto de funciones

### RNF-006: React 19 Specifics

- **NO usar `forwardRef`**: Pasar `ref` como prop estándar
- **Actions sobre useEffect**: Priorizar `action` y `useFormStatus` para mutaciones
- **Transiciones**: `startTransition` solo si se miden bloqueos del hilo principal
- **Optimistic UI**: `useOptimistic` solo si latencia impacta UX medida
- **`use` hook**: Para promesas y contextos, integrado con `Suspense`

### RNF-007: Performance Targets

**Aplicar optimizaciones SOLO si métricas fallan**:

- **Lighthouse Performance**: > 90
- **Bundle size (gzip)**: < 150 KB (initial)
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s

---

## Decisiones Técnicas Aprobadas

### DT-001: Routing Strategy

- **Rutas por slug**: `/character/draculaura` (SEO-friendly)
- **Helper**: `generateSlug(name: string): string` para normalizar nombres
- **Scroll Restoration**: Automático (React Router default)

### DT-002: Data Source

- **JSON copiado**: `data/monsterHighCharacters.json` → `public/api/characters.json`
- **Fetch vía Vite dev server**: Simula API REST real
- **SWR Config**:
  ```typescript
  {
    revalidateOnFocus: false,    // No refetch al cambiar tab
    dedupingInterval: 60000      // 1 min de deduplicación
  }
  ```

### DT-003: Favorites Storage

- **localStorage key**: `monster-high-favorites`
- **Estructura**: Array de slugs → `["draculaura", "clawdeen-wolf"]`
- **Reason**: Menor uso de storage, re-fetch datos completos desde JSON
- **Graceful degradation**: In-memory storage si localStorage no disponible

### DT-004: Component Pattern

- **CharacterCard único**: Con prop `variant="list" | "favorite"` (KISS)
- **Reason**: Principio KISS > Composite pattern
- **Props flat**: Estructura simple y directa

### DT-005: Image Handling

- **URLs externas**: Usar directamente desde campo `image` del JSON
- **Placeholder**: Imagen temática Monster High para `image === undefined` o `""`
- **Loading**: Atributo `loading="lazy"` en todas las imágenes
- **Error handling**: `onError` handler con placeholder

### DT-006: Typography

- **Fuente custom**: Gruenewald VA (woff2)
- **Aplicación**: **Exclusivamente** en sección de historia (`globalStory`) dentro de `CharacterDetail.tsx`
- **Implementación**: Clase CSS `.global-story` con `font-family: var(--font-story)`
- **@font-face**: En `src/styles/fonts.css`
- **font-display**: `swap` para evitar FOIT

### DT-007: Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 767px) { /* 2 columnas grid */ }

/* Tablet */
@media (min-width: 768px) and (max-width: 1023px) { /* 3 columnas grid */ }

/* Desktop */
@media (min-width: 1024px) { /* 4 columnas grid */ }
```

### DT-008: Testing Strategy

- **Unitarios + Integración**: Coverage mínimo 80%
- **NO E2E inicialmente**: YAGNI - agregar solo si se justifica
- **Mock de SWR**: Usar datos reales en tests (pequeño dataset mock)
- **Suspense en tests**: Asegurar soporte para React 19 features

---

## Estructura de Proyecto

```
apps/web/
├── public/
│   ├── api/
│   │   └── characters.json              # Copia de monsterHighCharacters.json
│   ├── fonts/
│   │   └── gruenewald-va.woff2          # Fuente custom
│   └── images/
│       └── placeholder-character.png    # Placeholder temática
├── src/
│   ├── main.tsx                         # Entry point
│   ├── App.tsx                          # Router setup
│   ├── pages/                           # Page components
│   │   ├── CharacterListPage.tsx        # RF-001
│   │   ├── CharacterDetailPage.tsx      # RF-002
│   │   └── FavoritesPage.tsx            # RF-003
│   ├── components/                      # Componentes reutilizables
│   │   ├── layout/
│   │   │   ├── Header.tsx               # RF-004
│   │   │   └── Layout.tsx
│   │   ├── character/
│   │   │   ├── CharacterCard.tsx        # variant="list"|"favorite"
│   │   │   ├── CharacterGrid.tsx
│   │   │   └── CharacterDetail.tsx      # Imagen + ficha + historia
│   │   └── common/
│   │       ├── Button.tsx
│   │       ├── Skeleton.tsx
│   │       └── ErrorBoundary.tsx
│   ├── hooks/
│   │   ├── useCharacters.ts             # SWR hook
│   │   ├── useCharacter.ts              # Hook individual por slug
│   │   └── useFavorites.ts              # Hook localStorage
│   ├── services/
│   │   ├── charactersApi.ts             # Fetcher para SWR
│   │   └── favoritesStorage.ts          # CRUD localStorage
│   ├── types/
│   │   └── character.ts                 # Interfaces TypeScript
│   ├── styles/
│   │   ├── global.css                   # Reset + variables CSS
│   │   └── fonts.css                    # @font-face Gruenewald VA
│   ├── utils/
│   │   └── slugUtils.ts                 # generateSlug helper
│   └── __tests__/                       # Tests globales/integración
├── docs/
│   ├── TDD-WORKFLOW.md                  # Mi guía de referencia
│   ├── REACT-OPTIMIZATION-DECISION-TREE.md
│   └── MY-COMMIT-STRATEGY.md
├── PROGRESS.md                          # Mi tablero de seguimiento
├── TECH-LEAD-QUESTIONS.md               # Registro de consultas
├── TECHNICAL-SPEC.md                    # Este archivo (fuente de verdad)
├── vitest.config.ts
├── vite.config.ts
├── tsconfig.json
├── eslint.config.js
└── package.json
```

---

## Tema Visual Monster High

### Paleta de Colores

```css
:root {
  /* Colores principales */
  --mh-pink: #FF69B4;           /* Rosa característico */
  --mh-black: #000000;          /* Negro */
  --mh-purple: #9370DB;         /* Morado */
  
  /* Colores secundarios */
  --mh-gray: #333333;           /* Texto */
  --mh-light-gray: #F5F5F5;     /* Fondos */
  
  /* Estados */
  --mh-hover: #FF1493;          /* Hover rosa más intenso */
  --mh-focus: #BA55D3;          /* Focus morado más intenso */
}
```

### Tipografía

```css
:root {
  --font-story: 'Gruenewald VA', serif;
  --font-ui: system-ui, -apple-system, 'Segoe UI', sans-serif;
  
  /* Tamaños */
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */
}
```

### Espaciado

```css
:root {
  --spacing-1: 0.25rem;  /* 4px */
  --spacing-2: 0.5rem;   /* 8px */
  --spacing-3: 0.75rem;  /* 12px */
  --spacing-4: 1rem;     /* 16px */
  --spacing-6: 1.5rem;   /* 24px */
  --spacing-8: 2rem;     /* 32px */
  --spacing-12: 3rem;    /* 48px */
  --spacing-16: 4rem;    /* 64px */
}
```

### Transiciones

```css
:root {
  --transition-fast: 0.15s ease;
  --transition-base: 0.2s ease;
  --transition-slow: 0.3s ease;
}
```

---

## Fuente de Datos

### Estructura del JSON

**Ubicación**: `data/monsterHighCharacters.json`

```typescript
// Subsecciones dentro de cada sección principal
interface CharacterSection {
  general?: string[]
  apariencia?: string[]
  personalidad?: string[]
  amigos?: string[]
  familia?: string[]
  mascota?: string[]
  romance?: string[]
  // Permitir cualquier otra subsección
  [key: string]: string[] | undefined
}

// Secciones principales del personaje
interface CharacterSections {
  // Secciones principales conocidas y usadas en el frontend
  personaje?: CharacterSection
  monstruoClasico?: CharacterSection
  relaciones?: CharacterSection
  habilidades?: CharacterSection
  
  // Permitir cualquier otra sección (datos scraped pueden variar)
  [sectionName: string]: CharacterSection | undefined
}

interface Character {
  name: string              // "Abbey Bominable"
  url: string               // "https://monsterhigh.fandom.com/wiki/Abbey_Bominable"
  technicalInfo: {
    edad?: string           // "16" (opcional)
    sexo?: string           // "Femenino" (opcional)
    ocupacion?: string      // "Estudiante" (opcional)
    mascota?: string        // "Shiver" (opcional)
    familiares?: string     // "Hijas del Yeti" (opcional)
    mejoresAmigos?: string  // "Frankie Stein, Draculaura" (opcional)
  }
  sections: CharacterSections
  image?: string            // URL externa de la imagen
  globalStory?: string      // Historia generada para GlobalStory.tsx
}
```

**Nota sobre `sections`**: 
- **Type safety selectivo**: Las secciones principales (`personaje`, `monstruoClasico`, `relaciones`, `habilidades`) tienen autocomplete completo
- **Flexibilidad**: El JSON scraped contiene 30+ secciones diferentes, muchas específicas de scraping (`comics`, `videojuego`, `webarella`)
- **YAGNI aplicado**: Solo tipamos estrictamente lo que usamos en el frontend
- **Mantenibilidad**: Si el JSON evoluciona, no requiere actualizar 30+ interfaces

**Nota sobre `globalStory`**: 
- **Ya generado en backend**: Este campo viene completo del scraper, no requiere procesamiento en frontend
- **Contenido**: Historia narrativa del personaje generada durante el scraping de la wiki
- **Renderizado**: Se muestra en sección dedicada dentro de `CharacterDetail.tsx` con tipografía Gruenewald VA (aplicada via CSS)
- **Fallback**: Si `globalStory === undefined` o `=== ""`, mostrar placeholder visual

---

## Métricas de Calidad

### Coverage Targets

| Métrica | Mínimo | Ideal |
|---------|--------|-------|
| Lines | 80% | >90% |
| Functions | 80% | >90% |
| Branches | 80% | >85% |
| Statements | 80% | >90% |

### Performance Targets

| Métrica | Target | Crítico |
|---------|--------|---------|
| Lighthouse Performance | >90 | <80 |
| FCP (First Contentful Paint) | <1.5s | >2s |
| TTI (Time to Interactive) | <3s | >5s |
| Bundle Size (gzip) | <150KB | >200KB |

### Code Quality

- ✅ Sin errores ESLint
- ✅ Sin warnings TypeScript (strict mode)
- ✅ Funciones <15 líneas (métrica, no dogma)
- ✅ Nombres autodocumentados
- ✅ Sin duplicación (DRY después de 3ra ocurrencia)

---

## Referencias Cruzadas

### Documentos Relacionados

- **ADR-003**: [Frontend Framework Selection](../../docs/adr/003-frontend-framework-selection.md) (origen histórico)
- **TDD Workflow**: [apps/web/docs/TDD-WORKFLOW.md](docs/TDD-WORKFLOW.md) (mi guía de trabajo)
- **React Optimization**: [apps/web/docs/REACT-OPTIMIZATION-DECISION-TREE.md](docs/REACT-OPTIMIZATION-DECISION-TREE.md) (árbol de decisiones)
- **Commit Strategy**: [apps/web/docs/MY-COMMIT-STRATEGY.md](docs/MY-COMMIT-STRATEGY.md) (estrategia de commits)
- **Progress Tracking**: [apps/web/PROGRESS.md](PROGRESS.md) (estado del desarrollo)

### Skills Aplicables

- **XP Methodology**: `docs/development-rules/xp-methodology.md`
- **TDD Guidelines**: `docs/development-rules/tdd.md`
- **Coding Standards**: `docs/development-rules/coding-standards.md`
- **Testing Standards**: `docs/development-rules/testing-standards.md`
- **React Best Practices**: `.github/skills/react-best-practices/SKILL.md`

---

## Notas de Implementación

### Orden de Desarrollo (Fases)

1. **Fase 0**: Setup inicial (configs, assets, tipos)
2. **Fase 1**: RF-001 Listado de personajes
3. **Fase 2**: RF-002 Detalle de personaje
4. **Fase 3**: RF-003 Sistema de favoritos
5. **Fase 4**: RF-004 Navegación global
6. **Fase 5**: RF-005 Responsive & Accesibilidad
7. **Fase 6**: Polish & Optimización

### Consideraciones React 19

- **`use` hook**: Disponible para promesas y contextos
- **Actions**: Preferir sobre `useEffect` para mutaciones
- **NO `forwardRef`**: Pasar `ref` como prop normal
- **Suspense**: Integrado nativamente con SWR

### Graceful Degradation

- **localStorage no disponible**: Fallback a in-memory storage
- **Imágenes rotas**: Placeholder automático con `onError`
- **JSON fetch falla**: Error boundary con mensaje amigable
- **JavaScript deshabilitado**: Contenido básico visible (progressive enhancement)

---

**Fin de la Especificación Técnica**
