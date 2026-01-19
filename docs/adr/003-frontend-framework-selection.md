# ADR-003: Selección de Framework para Frontend (React)

**Estado**: ✅ Aprobado  
**Fecha Inicio**: 2026-01-19  
**Fecha Decisión**: 2026-01-19  
**Decisión Final**: React 19 + Vite + React Router + SWR  
**Contexto**: Implementación de interfaz web para visualización de personajes Monster High

---

## Contexto y Problema

El proyecto Monster High necesita una interfaz de usuario para mostrar el listado y detalle de personajes scrapeados desde la wiki, almacenados en `data/monsterHighCharacters.json`. El frontend debe:


#### RF-001: Listado de Personajes (Página Principal)
- Mostrar todos los personajes de `data/monsterHighCharacters.json` en cuadrícula responsive
- Cada card muestra: imagen pequeña (arriba) + nombre del personaje (abajo)
- Al hacer clic en un personaje, navegar a página de detalle

#### RF-002: Detalle de Personaje
- **Layout Desktop (2 columnas)**:
  - Columna izquierda: Imagen grande del personaje
  - Columna derecha superior: Ficha técnica con campos de `technicalInfo` (edad, sexo, ocupación, mascota, familiares, mejores amigos)
  - Columna ds de Diseño**: KISS > Composite pattern (simplicidad sobre abstracción)
- **Principio YAGNI**: No optimizar hasta medir necesidad
- **Testing**: Vitest + React Testing Library (coverage mínimo 80%)
- **Type Safety**: TypeScript 5.9.3
- **Monorepo**: Integración con `apps/backend` en npm workspaces
- **Coding Standards**: Funciones <15 líneas, nombres autodocumentados
- **React Best Practices**: 45 reglas disponibles, aplicar solo cuando se mida
- **Tipografía Custom**: Gruenewald VA (woff2) para `globalStory`
- Página dedicada para ver todos los favoritos
- Listado de favoritos: imagen más grande que en listado principal, sin nombre debajo
- Distinción visual clara respecto al listado principal

#### RF-004: Navegación Global
- Header permanente en todas las páginas con navegación a:
  - **Listado Completo** (home)
  - **Favoritos** (página dedicada)

#### RF-005: Responsive & Accesibilidad
- Mobile-first approach
- Breakpoints para tablet y desktop
- Semantic HTML y ARIA labels
- Soporte para teclado y lectores de pantallaholders
- Ser responsive y accesible (WCAG AA)

### Requisitos No Funcionales

* **Metodología**: TDD estricto (Red-Green-Refactor por cada caso).
* **Principio YAGNI**: No optimizar ni abstraer lógicas asíncronas hasta medir necesidad real de performance o feedback visual.
* **Testing**: Vitest + React Testing Library (asegurando soporte para `Suspense` y `Transitions`).
* **Type Safety**: TypeScript 5.9.3 (Uso estricto de tipos en `Actions` y el hook `use`).
* **Monorepo**: Integración con `apps/backend` en npm workspaces.
* **Coding Standards**: 
    * Funciones < 15 líneas.
    * Nombres autodocumentados.
    * **Refs simplificadas**: Pasar `ref` como prop estándar; prohibido el uso de `forwardRef` por redundancia.
* **Gestión de Estado Asíncrono (React 19)**:
    * **Actions sobre useEffect**: Priorizar el uso de `action` y `useFormStatus` para mutaciones de datos, evitando estados manuales de carga/error.
    * **Transiciones**: Envolver actualizaciones de estado de baja prioridad en `startTransition` solo si se detectan bloqueos en el hilo principal (bajo medición).
    * **Optimistic UI**: Implementar `useOptimistic` únicamente en flujos donde la latencia de red impacte la UX (aplicando YAGNI).
* **Arquitectura de Datos**:
    * **Consumo declarativo**: Uso del API `use` para promesas y contextos, integrado con `Suspense` para simplificar la jerarquía de componentes.
* **React Best Practices**: 45 reglas disponibles; las nuevas APIs de React 19 se evaluarán bajo métricas de reducción de líneas de código (LOC) y legibilidad.
* **Comentarios**: Añadir comentarios solo cuando el código no sea lo suficientemente auto-explicativo (especialmente en lógicas condicionales con el hook `use`).

---

## Decisión Final: React 19 + Vite ✅

**Fecha de Decisión**: 2026-01-19  
**Decisor**: José Manuel Velasco (Technical Lead)

### Razones de la Decisión

#### ✅ Alineación con Principios XP/TDD

1. **Simplicidad (YAGNI)**: El proyecto no requiere SSR, API routes ni server-side logic en esta fase. Vite ofrece exactamente lo necesario sin overhead.
2. **TDD Fluido**: Testing strategy uniforme sin necesidad de mockear módulos de framework. Todo es cliente, tests más simples conceptualmente.
3. **Refactor Seguro**: Stack simple con menos abstracciones = menos superficie de ruptura durante refactorings.
4. **Developer Velocity**: HMR instantáneo (~50ms) y builds rápidos (~5s) optimizan el ciclo Red-Green-Refactor.

#### ✅ Requisitos del Proyecto

- **Datos estáticos locales**: `monsterHighCharacters.json` no requiere SSR (no hay SEO crítico ni datos dinámicos)
- **Favoritos con localStorage**: Feature puramente cliente, no necesita server-side
- **Tipografía custom**: Vite maneja assets estáticos (woff2) de forma nativa
- **Deploy simple**: SPA estático puede servirse desde cualquier CDN (Netlify, Vercel, Cloudflare Pages, GitHub Pages)

#### ✅ KISS > Composite Pattern

Se prioriza **simplicidad** sobre abstracción compleja. Si el patrón Composite aporta valor medido durante implementación, se aplicará; de lo contrario, se mantendrá diseño simple.

### Contras Aceptados

- ⚠️ **Performance inicial ligeramente peor**: Mitigable con lazy loading y code splitting (aplicar cuando se mida necesidad)
- ⚠️ **Sin optimizaciones automáticas de Next.js**: Se aplicarán React Best Practices solo cuando métricas lo justifiquen
- ⚠️ **Futuro escalado a SSR requeriría migración**: Evaluable cuando/si se necesite (YAGNI)

### Cuándo Reconsiderar

Esta decisión puede revisarse si:
- Métricas de Lighthouse/Performance muestren FCP > 2s
- Se requiera SEO agresivo (indexación por buscadores)
- Se implemente backend API con autenticación
- Se necesite i18n server-side o streaming de contenido
---

## Plan de Implementación: React + Vite

### Stack Tecnológico Final

```json
{
  "core": {
    "react": "^19.2.3",
    "react-dom": "^19.2.3",
    "vite": "^7.3.1"
  },
  "routing": {
    "react-router-dom": "^7.12.0"
  },
  "dataFetching": {
    "swr": "^2.3.8"
  },
  "styling": {
    "approach": "CSS Modules"
  },
  "fonts": {
    "gruenewald-va": "woff2 (local desde fonts/gruenewald-va/)"
  },
  "devDependencies": {
    "typescript": "^5.9.3",
    "vitest": "^4.0.17",
    "@testing-library/react": "^16.3.2",
    "@testing-library/jest-dom": "^6.9.1",
    "@testing-library/user-event": "^14.6.1",
    "happy-dom": "^20.3.3",
    "eslint": "^9.39.2",
    "prettier": "^3.8.0"
  }
}
```

---

### Estructura de Proyecto Propuesta

```
apps/web/
├── public/
│   ├── api/
│   │   └── characters.json              # Copia de monsterHighCharacters.json
│   ├── fonts/                           # Gruenewald VA woff2
│   │   └── gruenewald-va.woff2
│   └── images/
│       └── placeholder-character.png    # Placeholder temática Monster High
├── src/
│   ├── main.tsx                         # Entry point
│   ├── App.tsx                          # Router setup
│   ├── pages/                           # Page components (routing)
│   │   ├── CharacterListPage.tsx        # RF-001: Listado principal
│   │   ├── CharacterDetailPage.tsx      # RF-002: Detalle de personaje
│   │   └── FavoritesPage.tsx            # RF-003: Listado de favoritos
│   ├── components/                      # Componentes reutilizables
│   │   ├── layout/
│   │   │   ├── Header.tsx               # RF-004: Navegación global
│   │   │   └── Layout.tsx               # Wrapper con Header
│   │   ├── character/
│   │   │   ├── CharacterCard.tsx        # Card con variant="list"|"favorite"
│   │   │   ├── CharacterGrid.tsx        # Grid de cards
│   │   │   ├── CharacterDetail.tsx      # Vista detallada
│   │   │   ├── TechnicalInfo.tsx        # Ficha técnica
│   │   │   └── GlobalStory.tsx          # Historia con tipografía custom
│   │   └── common/
│   │       ├── Button.tsx
│   │       ├── Skeleton.tsx
│   │       └── ErrorBoundary.tsx
│   ├── hooks/
│   │   ├── useCharacters.ts             # SWR hook para fetch de /api/characters.json
│   │   ├── useCharacter.ts              # Hook para personaje individual por slug
│   │   └── useFavorites.ts              # Hook para gestión de favoritos (localStorage)
│   ├── services/
│   │   ├── charactersApi.ts             # Fetcher para SWR
│   │   └── favoritesStorage.ts          # CRUD de localStorage (guardar solo slugs)
│   ├── types/
│   │   └── character.ts                 # TypeScript interfaces (generados con quicktype + refinados)
│   ├── styles/
│   │   ├── global.css                   # Reset + fonts + variables CSS
│   │   └── fonts.css                    # @font-face para Gruenewald VA
│   └── __tests__/                       # Tests globales o de integración
├── vitest.config.ts
├── tsconfig.json
├── vite.config.ts
└── package.json
```

---

### Fases de Implementación (TDD Workflow)

#### **Fase 1: Setup & Configuración** ⚙️

**Objetivo**: Preparar entorno de desarrollo y testing.

**Tareas**:
1. Crear proyecto con `npm create vite@latest apps/web -- --template react-ts`
2. Configurar npm workspace en `package.json` raíz
3. Instalar dependencias:
   ```bash
   npm install react-router-dom swr
   npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event happy-dom
   ```
4. Configurar Vitest (`vitest.config.ts`)
5. Configurar TypeScript (`tsconfig.json` - strict mode)
6. Configurar ESLint + Prettier (heredar de raíz)
7. Copiar `data/monsterHighCharacters.json` a `public/api/characters.json`
8. Copiar fuente Gruenewald VA (woff2) a `public/fonts/`
9. Crear `src/styles/fonts.css` con `@font-face` para Gruenewald VA
10. Crear `src/styles/global.css` con CSS reset y variables CSS
11. Generar tipos TypeScript con quicktype y refinar manualmente
12. Configurar rutas básicas en `App.tsx` con React Router
13. Configurar SWR con config: `revalidateOnFocus: false`, `dedupingInterval: 60000ms`
14. Crear placeholder temática Monster High (o solicitar al TL)

**Validación**: 
- ✅ `npm run dev` arranca en http://localhost:5173
- ✅ `npm run test` ejecuta tests sin errores
- ✅ Tipografía Gruenewald carga correctamente
- ✅ Fetch a `/api/characters.json` retorna datos
- ✅ TypeScript strict mode sin errores

---

#### **Fase 2: Feature 1 - Listado de Personajes** 📋

**Objetivo**: Mostrar cuadrícula de personajes desde JSON.

**TDD Workflow** (Red-Green-Refactor por cada caso):

##### Test Cases (ordenados simple → complejo)
```typescript
// src/components/character/__tests__/CharacterGrid.test.tsx
// TODO: Character Grid Test Cases
// [ ] 1. Muestra mensaje vacío cuando no hay personajes
// [ ] 2. Muestra un personaje con nombre
// [ ] 3. Muestra un personaje con nombre e imagen
// [ ] 4. Muestra placeholder cuando personaje no tiene imagen
// [ ] 5. Muestra múltiples personajes (3+) en grid
// [ ] 6. Click en card navega a ruta correcta (/character/:slug)
// [ ] 7. Grid es responsive (2/3/4 columnas según viewport)
```

**Componentes a implementar**:
1. `CharacterCard.tsx` - Card individual con prop `variant="list" | "favorite"` (KISS, no Composite)
2. `CharacterGrid.tsx` - Grid responsive usando CSS Modules
3. `CharacterListPage.tsx` - Página principal que orquesta el listado
4. `useCharacters.ts` - Hook personalizado con SWR para fetch de `/api/characters.json`
5. `slugUtils.ts` - Helper para generar slugs (`name` → `draculaura`)

**Criterios de aceptación**:
- ✅ Grid muestra todos los personajes del JSON
- ✅ Imágenes con lazy loading (atributo `loading="lazy"`)
- ✅ Placeholder Monster High para imágenes faltantes (`image === undefined` o `""`)
- ✅ Click en card navega a `/character/:slug` (ej: `/character/draculaura`)
- ✅ Grid responsive: 2 cols mobile (<768px), 3 cols tablet (768-1024px), 4 cols desktop (>1024px)
- ✅ Coverage de tests > 80%

---

#### **Fase 3: Feature 2 - Detalle de Personaje** 🔍

**Objetivo**: Página de detalle con layout 2 columnas.

##### Test Cases
```typescript
// src/pages/__tests__/CharacterDetailPage.test.tsx
// TODO: Character Detail Test Cases
// [ ] 1. Muestra loading state mientras carga
// [ ] 2. Muestra imagen grande del personaje
// [ ] 3. Muestra ficha técnica (technicalInfo)
// [ ] 4. Muestra historia (globalStory) con fuente Gruenewald
// [ ] 5. Muestra placeholder si no hay globalStory
// [ ] 6. Layout 2 columnas en desktop
// [ ] 7. Layout 1 columna en mobile
// [ ] 8. Muestra 404 si personaje no existe
// [ ] 9. Botón "Volver" funciona correctamente
```

**Componentes a implementar**:
1. `CharacterDetail.tsx` - Vista completa del personaje con layout responsive (2 columnas desktop, 1 columna mobile)
2. `TechnicalInfo.tsx` - Ficha técnica con todos los campos de `technicalInfo` (edad, sexo, ocupación, mascota, familiares, mejoresAmigos)
3. `GlobalStory.tsx` - Renderiza historia con fuente Gruenewald VA aplicada
4. `CharacterDetailPage.tsx` - Página completa que obtiene params de React Router
5. `useCharacter.ts` - Hook personalizado para obtener personaje individual por slug

**Criterios de aceptación**:
- ✅ Layout responsive con breakpoints: <768px (mobile 1 col), 768-1024px (tablet 1 col), >1024px (desktop 2 cols)
- ✅ Tipografía Gruenewald aplica **exclusivamente** en componente `globalStory`
- ✅ Todos los campos de `technicalInfo` se muestran con manejo de opcionales
- ✅ Placeholder visual si `globalStory` es `undefined` o `""`
- ✅ Imágenes externas (URLs de wiki) cargadas directamente sin proxy
- ✅ Página 404 si slug no corresponde a ningún personaje del JSON
- ✅ Manejo de casos edge (datos faltantes, imágenes rotas, campos opcionales)
- ✅ Coverage de tests > 80%

---

#### **Fase 4: Feature 3 - Sistema de Favoritos** ⭐

**Objetivo**: Agregar/quitar favoritos con localStorage.

##### Test Cases
```typescript
// src/hooks/__tests__/useFavorites.test.tsx
// TODO: Favorites Hook Test Cases
// [ ] 1. Inicializa con array vacío si no hay favoritos
// [ ] 2. Lee favoritos existentes de localStorage
// [ ] 3. Agrega personaje a favoritos
// [ ] 4. Elimina personaje de favoritos
// [ ] 5. Verifica si personaje está en favoritos
// [ ] 6. Persiste cambios en localStorage
// [ ] 7. Maneja localStorage no disponible (graceful degradation)
```

**Componentes/Servicios a implementar**:
1. `useFavorites.ts` - Hook personalizado para gestión de favoritos con localStorage
2. `favoritesStorage.ts` - Servicio CRUD de localStorage (guarda array de slugs, no objetos completos)
3. Botón CTA en `CharacterDetailPage.tsx` para agregar/quitar favorito
4. `FavoritesPage.tsx` - Página de favoritos que reutiliza `CharacterCard` con `variant="favorite"`

**Decisiones de implementación**:
- localStorage key: `monster-high-favorites`
- Estructura de datos: Array de slugs únicamente → `["draculaura", "clawdeen-wolf"]`
- Re-fetch datos completos desde `/api/characters.json` al renderizar página de favoritos
- Graceful degradation: Si localStorage no disponible, usar in-memory storage (no persiste)

**Criterios de aceptación**:
- ✅ Favoritos persisten entre sesiones del navegador (localStorage)
- ✅ CTA muestra estado correcto: ♥ relleno si es favorito, ♡ vacío si no lo es
- ✅ Página de favoritos (`/favorites`) muestra solo personajes marcados
- ✅ `CharacterCard` con `variant="favorite"`: imagen más grande (2x), sin nombre debajo
- ✅ Maneja localStorage no disponible con graceful degradation (sin crashear)
- ✅ No duplicar personajes en lista de favoritos (validación de slugs únicos)
- ✅ Coverage de tests > 80%

---

#### **Fase 5: Feature 4 - Navegación Global** 🧭

**Objetivo**: Header permanente con navegación.

##### Test Cases
```typescript
// src/components/layout/__tests__/Header.test.tsx
// TODO: Header Test Cases
// [ ] 1. Muestra logo/título de Monster High
// [ ] 2. Muestra link a "Todos los Personajes"
// [ ] 3. Muestra link a "Favoritos"
// [ ] 4. Resalta ruta activa
// [ ] 5. Es responsive (hamburger menu en mobile)
// [ ] 6. Navegación funciona correctamente
```

**Componentes a implementar**:
1. `Header.tsx` - Navegación principal
2. `Layout.tsx` - Wrapper con Header

**Criterios de aceptación**:
- ✅ Header visible en todas las páginas
- ✅ Active link destacado visualmente
- ✅ Responsive (hamburger en mobile)
- ✅ Accesible (keyboard navigation)
- ✅ Coverage > 80%

---

#### **Fase 6: Polish & Optimización** ✨

**Objetivo**: Refinamiento UI/UX y performance.

**Tareas**:

1. **Styling Final**:
   - Aplicar colores temáticos Monster High (rosa `#FF69B4`, negro `#000000`, morado `#9370DB`)
   - Añadir transiciones suaves en hover/focus (0.2s ease)
   - Implementar loading states con skeletons (componente `Skeleton.tsx`)
   - Implementar error states: Mensajes cuando fallen fetches o no haya datos
   - Error boundary global para capturar errores inesperados (`ErrorBoundary.tsx`)

2. **Accesibilidad**:
   - Validar contraste de colores (WCAG AA)
   - Añadir ARIA labels donde sea necesario
   - Asegurar navegación por teclado (Tab, Enter, Esc)
   - Focus visible en todos los elementos interactivos

3. **Performance** (aplicar SOLO si métricas lo demuestran necesario):
   - Code splitting por ruta con `React.lazy()` (si bundle > 150 KB)
   - Image optimization con `loading="lazy"` (ya aplicado en Fase 2)
   - Bundle analysis con `rollup-plugin-visualizer` (medir antes de optimizar)
   - Memoización de componentes con `React.memo()` (solo si hay re-renders medidos)

4. **Testing Final**:
   - Verificar coverage > 80% (unitarios + integración)
   - **NO E2E inicialmente** (YAGNI - agregar solo si se justifica)
   - Smoke tests manuales: navegación, favoritos, responsive

**Criterios de aceptación**:
- ✅ Lighthouse Performance > 90
- ✅ Bundle size (gzip) < 150 KB
- ✅ First Contentful Paint < 1.5s
- ✅ Accesibilidad WCAG AA cumplida
- ✅ Todas las páginas funcionan sin errores
- ✅ Coverage de tests > 80%

---

## Decisiones Técnicas Aprobadas

Las siguientes decisiones técnicas han sido **aprobadas por el Technical Lead** (2026-01-19):

#### 1. **Styling Strategy** ✅
- **Decisión**: CSS Modules
- **Razón**: Simplicidad (YAGNI), no añade dependencias extra, scoped styles automáticos
- **Variables CSS**: Definir en `global.css` para tema (colores Monster High, spacing)

#### 2. **Component Pattern** ✅
- **Decisión**: `CharacterCard` único con prop `variant="list" | "favorite"` (KISS)
- **Razón**: Principio KISS > Composite pattern. Solo aplicar abstracción si crece complejidad
- **Estructura de props**: Flat (simple y directo)

#### 3. **Data Source** ✅
- **Decisión**: Copiar JSON a `public/api/characters.json` y servir vía Vite dev server
- **Razón**: Simula API real, facilita migración futura a backend API REST
- **SWR Config**: 
  ```typescript
  { 
    revalidateOnFocus: false,     // No refetch al cambiar tab
    revalidateOnReconnect: true,  // Sí refetch al reconectar
    dedupingInterval: 60000       // 1 min de deduplicación
  }
  ```

#### 4. **Routing Strategy** ✅
- **Decisión**: Rutas por slug generado: `/character/draculaura`
- **Razón**: SEO-friendly, evita problemas con espacios/caracteres especiales
- **Scroll Restoration**: Automático (React Router default)
- **Helper**: Función `generateSlug(name: string): string` para normalizar nombres

#### 5. **Favorites Storage** ✅
- **Decisión**: Guardar solo slugs en localStorage
- **localStorage key**: `monster-high-favorites`
- **Estructura**: `["draculaura", "clawdeen-wolf", ...]`
- **Razón**: Menor uso de storage, re-fetch datos completos desde JSON al mostrar

#### 6. **TypeScript Configuration** ✅
- **Decisión**: Generar tipos con `quicktype` y refinar manualmente
- **Razón**: Velocidad inicial + precisión manual para tipos opcionales
- **Strict Mode**: Activado (`tsconfig.json`)

#### 7. **Testing Strategy** ✅
- **Decisión**: Unitarios + Integración (coverage mínimo 80%)
- **NO E2E inicialmente**: YAGNI - agregar solo si se justifica
- **Mock de SWR**: Usar datos reales en tests (pequeño dataset mock)
- **Framework**: Vitest + React Testing Library + happy-dom

#### 8. **Responsive Breakpoints** ✅
- **Mobile**: `< 768px` (2 columnas grid)
- **Tablet**: `768px - 1024px` (3 columnas grid)
- **Desktop**: `> 1024px` (4 columnas grid)

#### 9. **Image Handling** ✅
- **URLs externas**: Usar directamente desde campo `image` del JSON
- **Placeholder**: Imagen temática Monster High para `image === undefined` o `""`
- **Loading**: Atributo `loading="lazy"` en todas las imágenes

#### 10. **Performance Targets** ✅
- **Lighthouse Performance**: > 90
- **Bundle size (gzip)**: < 150 KB
- **First Contentful Paint**: < 1.5s
- **Medición**: Aplicar optimizaciones SOLO si métricas fallan

#### 11. **Features del MVP** ✅
- **Incluidos**: RF-001 a RF-004 (Listado, Detalle, Favoritos, Header)
- **Excluidos**: Búsqueda, filtros, ordenamiento, paginación (YAGNI - agregar después si se necesita)

---

## Referencias

- **Plan de Implementación**: Ver sección "Plan de Implementación: React + Vite" (Fases 1-6) en este documento
- **Especificación Técnica**: `docs/technical-spec/frontend-implementation.md` (pendiente de crear)
- **ADR-001**: [Estructura de Monorepo](001-monorepo-structure.md)
- **ADR-002**: [Configuración Multi-IDE](002-multi-ide-configuration.md)
- **Requisitos Funcionales**: RF-001 a RF-005 documentados en sección "Contexto y Problema"
- **Decisiones Técnicas**: 11 decisiones aprobadas documentadas arriba

---

## Estado Final

**Decisión**: ✅ **Aprobada**  
**Fecha de Aprobación**: 2026-01-19  
**Decisor**: José Manuel Velasco (Technical Lead)  
**Stack Seleccionado**: React 19.2.3 + Vite 7.3.1 + React Router 7.12.0 + SWR 2.3.8  
**Implementación**: Pendiente (iniciar con Fase 1: Setup & Configuración)

---

## Historial de Revisiones

### v3.0 - 2026-01-19 (Decisión Final)
- **Eliminada** sección de comparativas detalladas y spikes
- **Actualizadas** todas las versiones a las más recientes estables:
  - React 18.3.1 → **19.2.3**
  - Vite 6.0.0 → **7.3.1**
  - React Router 6.28.0 → **7.12.0**
  - SWR 2.2.5 → **2.3.8**
  - Vitest 2.1.8 → **4.0.17**
  - @testing-library/react 16.1.0 → **16.3.2**
  - @testing-library/jest-dom 6.6.3 → **6.9.1**
  - @testing-library/user-event 14.5.2 → **14.6.1**
  - happy-dom 16.7.0 → **20.3.3**
  - ESLint 9.39.1 → **9.39.2**
  - Prettier 3.7.4 → **3.8.0**
- Documento enfocado en la decisión final y plan de implementación
- Decisiones técnicas aprobadas (11 decisiones)

### v2.0 - 2026-01-19 (Análisis Comparativo)
- Comparativa completa Next.js 15 vs React 18 + Vite
- 10 dimensiones técnicas evaluadas
- Propuesta de spikes de validación

### v1.0 - 2026-01-19 (Versión Inicial)
- Documento inicial con requisitos funcionales y no funcionales
- Identificación de opciones (Next.js vs React + Vite)

---

