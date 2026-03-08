# 🎯 Árbol de Decisiones - Optimización React

> **Modelo mental simplificado**: 5 preguntas clave para decidir cuándo optimizar. Aplicar **YAGNI** siempre.

**Desarrollador**: Agente XP  
**Referencia**: `.github/skills/react-best-practices/SKILL.md` (45 reglas)  
**Principio**: **MEDIR PRIMERO, OPTIMIZAR DESPUÉS**

---

## ⚠️ Regla de Oro

**NUNCA optimizar sin medir primero**. Aplicar solo cuando:
1. Problema de performance **medido** (Profiler, Lighthouse, bundle analyzer)
2. Optimización no sacrifica legibilidad
3. Tests permanecen verdes después de optimizar

---

## 🌳 Árbol de Decisiones (5 Preguntas Clave)

### 1️⃣ ¿Veo waterfalls en DevTools Network?

**Síntomas**:
- Peticiones en cascada (una espera a otra innecesariamente)
- FCP (First Contentful Paint) > 2s
- Muchos requests secuenciales

**Medir**:
```bash
# Chrome DevTools > Network tab
# Lighthouse > Performance audit
```

**Decisión**:
```
❓ ¿Veo waterfall pattern?
  ├─ NO → Ir a pregunta #2
  └─ SÍ → ¿Puedo paralelizar?
      ├─ SÍ → Aplicar Promise.all()
      └─ NO → ¿Puedo prefetch?
          ├─ SÍ → Usar <link rel="prefetch">
          └─ NO → Aceptar o consultar Tech Lead
```

**Soluciones aplicables**:

| Problema | Solución | Cuándo Aplicar |
|----------|----------|----------------|
| Múltiples `await` secuenciales | `Promise.all()` | Operaciones independientes |
| Fetch de datos bloqueante | SWR con suspense | Datos no críticos |
| Recursos de terceros bloquean render | `defer` script tag | Analytics, ads |

**Ejemplo**:
```typescript
// ❌ Waterfall (secuencial innecesario)
const characters = await fetchCharacters()
const favorites = await fetchFavorites()

// ✅ Paralelo
const [characters, favorites] = await Promise.all([
  fetchCharacters(),
  fetchFavorites()
])
```

**Métrica de éxito**: FCP < 1.5s

---

### 2️⃣ ¿Mi bundle inicial es >150KB (gzip)?

**Síntomas**:
- Bundle size grande
- TTI (Time to Interactive) > 3s
- Carga inicial lenta

**Medir**:
```bash
# Build production
npm run build

# Analizar bundle
npx vite-bundle-visualizer
```

**Decisión**:
```
❓ ¿Bundle inicial >150KB (gzip)?
  ├─ NO → Ir a pregunta #3
  └─ SÍ → ¿Hay código no usado en home?
      ├─ SÍ → Aplicar code splitting
      └─ NO → ¿Hay dependencias pesadas?
          ├─ SÍ → Lazy load o buscar alternativa
          └─ NO → Aceptable (consultar Tech Lead si >200KB)
```

**Soluciones aplicables**:

| Problema | Solución | Cuándo Aplicar |
|----------|----------|----------------|
| Componentes pesados no usados en home | `React.lazy()` + `Suspense` | Componente >50KB |
| Barrel imports (`index.ts`) | Import directo | Siempre |
| Librerías pesadas (moment.js, lodash) | Alternativas ligeras (date-fns, native) | Si posible |
| Imágenes grandes | `loading="lazy"` | Todas las imágenes |

**Ejemplo**:
```typescript
// ❌ Barrel import (importa TODO el módulo)
import { CharacterCard } from '@/components'

// ✅ Import directo
import { CharacterCard } from '@/components/character/CharacterCard'

// ✅ Code splitting (si componente >50KB)
const CharacterDetail = React.lazy(() => import('./CharacterDetail'))

function App() {
  return (
    <Suspense fallback={<Skeleton />}>
      <CharacterDetail />
    </Suspense>
  )
}
```

**Métrica de éxito**: Bundle < 150KB (gzip), TTI < 3s

---

### 3️⃣ ¿Veo re-renders innecesarios en React Profiler?

**Síntomas**:
- Componente re-renderiza sin cambios en props/state
- UI se siente lenta al interactuar
- Profiler muestra renders >50ms

**Medir**:
```bash
# React DevTools > Profiler tab
# Grabar interacción (click, scroll, etc.)
# Buscar flamegraph con renders innecesarios
```

**Decisión**:
```
❓ ¿Veo re-renders innecesarios?
  ├─ NO → Ir a pregunta #4
  └─ SÍ → ¿Render tarda >50ms?
      ├─ NO → Ignorar (micro-optimización innecesaria)
      └─ SÍ → ¿Causa del re-render?
          ├─ Props nuevas cada vez → React.memo() + useCallback()
          ├─ Context cambia mucho → Split context o Jotai/Zustand
          ├─ useState callback → Usar functional setState
          └─ Trabajo caro en render → useMemo() para cálculos
```

**Soluciones aplicables**:

| Problema | Solución | Cuándo Aplicar |
|----------|----------|----------------|
| Componente re-renderiza con mismas props | `React.memo()` | Render medido >50ms |
| Callbacks crean nueva referencia | `useCallback()` | Solo con `React.memo()` |
| Cálculos caros en render | `useMemo()` | Operaciones medidas >10ms |
| Context cambia frecuentemente | Split context | Provider renderiza >50ms |

**Ejemplo**:
```typescript
// ❌ Re-render innecesario (callback nuevo cada vez)
function CharacterList() {
  const handleClick = (id: string) => navigate(`/character/${id}`)
  return characters.map(c => <CharacterCard onClick={handleClick} />)
}

// ✅ Memoizado (solo si medido >50ms)
const MemoizedCard = React.memo(CharacterCard)

function CharacterList() {
  const handleClick = useCallback(
    (id: string) => navigate(`/character/${id}`),
    [navigate]
  )
  return characters.map(c => <MemoizedCard onClick={handleClick} />)
}
```

**Métrica de éxito**: Render < 50ms (medido en Profiler)

---

### 4️⃣ ¿Renderizo listas largas (>100 items)?

**Síntomas**:
- Scroll se siente pesado
- Render inicial de lista tarda >500ms
- Muchos nodos DOM (>1000)

**Medir**:
```bash
# React DevTools > Profiler
# Medir render de componente que mapea lista
# Chrome DevTools > Performance > DOM nodes count
```

**Decisión**:
```
❓ ¿Lista tiene >100 items Y render >500ms?
  ├─ NO → Ir a pregunta #5
  └─ SÍ → ¿Todos los items visibles simultáneamente?
      ├─ NO → Aplicar virtualización (react-window)
      └─ SÍ → ¿Cada item es complejo (>10 elementos)?
          ├─ SÍ → React.memo() en item + key estable
          └─ NO → Aceptable
```

**Soluciones aplicables**:

| Problema | Solución | Cuándo Aplicar |
|----------|----------|----------------|
| Lista larga (>100 items) | `react-window` o `react-virtualized` | Render medido >500ms |
| Items sin key estable | Usar ID único (no index) | Siempre |
| Item complejo re-renderiza | `React.memo()` en item | Render item >20ms |

**Ejemplo**:
```typescript
// ❌ Lista larga sin virtualización (100+ items)
function CharacterGrid({ characters }) {
  return characters.map(c => <CharacterCard key={c.name} {...c} />)
}

// ✅ Virtualizada (solo si >100 items Y >500ms medido)
import { FixedSizeGrid } from 'react-window'

function CharacterGrid({ characters }) {
  return (
    <FixedSizeGrid
      height={600}
      width={800}
      columnCount={4}
      rowCount={Math.ceil(characters.length / 4)}
      columnWidth={200}
      rowHeight={250}
    >
      {({ columnIndex, rowIndex, style }) => (
        <div style={style}>
          <CharacterCard {...characters[rowIndex * 4 + columnIndex]} />
        </div>
      )}
    </FixedSizeGrid>
  )
}
```

**Métrica de éxito**: Render lista < 500ms, scroll fluido (60fps)

**Nota para Monster High**: Estimamos ~30-50 personajes → **NO aplicar virtualización** (YAGNI)

---

### 5️⃣ ¿Tengo bloqueos del hilo principal (UI congelada)?

**Síntomas**:
- UI no responde durante actualizaciones
- Click/input tarda >100ms en responder
- Animaciones se ven entrecortadas

**Medir**:
```bash
# Chrome DevTools > Performance
# Grabar interacción
# Buscar Long Tasks (tareas >50ms)
```

**Decisión**:
```
❓ ¿Veo Long Tasks >50ms en Performance tab?
  ├─ NO → Todo bien, no optimizar
  └─ SÍ → ¿Es actualización de estado de baja prioridad?
      ├─ SÍ → startTransition()
      └─ NO → ¿Es actualización optimista?
          ├─ SÍ → useOptimistic() (React 19)
          └─ NO → Consultar Tech Lead (puede requerir web worker)
```

**Soluciones aplicables**:

| Problema | Solución | Cuándo Aplicar |
|----------|----------|----------------|
| Actualización de filtros/búsqueda bloquea | `startTransition()` | Long Task >50ms |
| Actualización optimista (favoritos) | `useOptimistic()` (React 19) | Latencia impacta UX |
| Trabajo pesado (parsing, cálculos) | Web Worker | Tarea síncrona >100ms |

**Ejemplo**:
```typescript
// ❌ Actualización de filtro bloquea UI
function CharacterList() {
  const [filter, setFilter] = useState('')
  const filtered = characters.filter(c => c.name.includes(filter))
  
  return (
    <input onChange={e => setFilter(e.target.value)} />
    // UI bloqueada mientras filtra
  )
}

// ✅ Transición (solo si medido >50ms)
import { useTransition } from 'react'

function CharacterList() {
  const [filter, setFilter] = useState('')
  const [isPending, startTransition] = useTransition()
  
  const handleChange = (e) => {
    startTransition(() => {
      setFilter(e.target.value)
    })
  }
  
  return (
    <>
      <input onChange={handleChange} />
      {isPending && <Spinner />}
    </>
  )
}
```

**Métrica de éxito**: Long Tasks < 50ms, UI responde <100ms

---

## 📊 Resumen: Cuándo Aplicar Cada Optimización

| Optimización | Trigger (Métrica) | Esfuerzo | Impacto |
|--------------|-------------------|----------|---------|
| `Promise.all()` | Waterfall visible en Network | Bajo | Alto |
| Code splitting | Bundle >150KB | Medio | Alto |
| `React.memo()` | Re-render >50ms | Bajo | Medio |
| `useCallback()` | Solo con `memo()` | Bajo | Bajo |
| `useMemo()` | Cálculo >10ms | Bajo | Medio |
| Virtualización | Lista >100 items + >500ms | Alto | Alto |
| `startTransition()` | Long Task >50ms | Bajo | Medio |
| `loading="lazy"` | Muchas imágenes | Muy bajo | Medio |
| Import directo | Siempre | Muy bajo | Medio |

---

## 🚨 Optimizaciones Prohibidas sin Medir

**NUNCA aplicar sin evidencia medida**:

1. ❌ `React.memo()` en todos los componentes "por si acaso"
2. ❌ `useCallback()` en todas las funciones
3. ❌ `useMemo()` en todos los cálculos
4. ❌ Virtualización en listas pequeñas (<100 items)
5. ❌ `startTransition()` en todas las actualizaciones
6. ❌ Code splitting de cada componente
7. ❌ Web Workers sin Long Tasks medidos

**Razón**: Complejidad sin beneficio = YAGNI violation

---

## 🎓 Flujo de Trabajo Práctico

1. **Implementar feature con TDD** (sin optimizaciones)
2. **Ejecutar Lighthouse audit** en build de producción
3. **Si Performance >90**: ✅ No optimizar
4. **Si Performance <90**: 
   - Medir con DevTools (Network, Profiler, Performance)
   - Identificar cuello de botella
   - Aplicar árbol de decisiones (preguntas 1-5)
   - Optimizar UNA cosa a la vez
   - Re-medir: ¿Mejoró? ✅ Commit | ❌ Revertir
5. **Documentar decisión** en PROGRESS.md

---

## 📚 Referencias Rápidas

### Herramientas de Medición

```bash
# Lighthouse audit
npm run build
npx serve dist
# Chrome DevTools > Lighthouse

# Bundle analyzer
npx vite-bundle-visualizer

# React Profiler
# Chrome > React DevTools > Profiler tab
```

### Métricas Target (Monster High)

| Métrica | Target | Crítico |
|---------|--------|---------|
| **Lighthouse Performance** | >90 | <80 |
| **FCP** | <1.5s | >2s |
| **TTI** | <3s | >5s |
| **Bundle (gzip)** | <150KB | >200KB |
| **Long Tasks** | <50ms | >100ms |
| **Re-renders** | <50ms | >100ms |

### Comandos Útiles

```bash
# Build + analizar
npm run build && npx vite-bundle-visualizer

# Test con coverage
npm run test -- --coverage

# Lighthouse CI (local)
npm install -g @lhci/cli
lhci autorun
```

---

## 🎯 Casos Específicos de Monster High

### ¿Aplicar optimizaciones en nuestro proyecto?

**Estimaciones**:
- Personajes totales: ~30-50
- Bundle estimado: ~100KB (React 19 + SWR + Router)
- Imágenes: URLs externas (wiki)

**Decisiones anticipadas**:

| Feature | ¿Optimizar? | Razón |
|---------|-------------|-------|
| Listado de personajes | ❌ NO virtualizar | <50 items → YAGNI |
| Favoritos localStorage | ❌ NO `useOptimistic` | Operación instantánea |
| CharacterCard | ❌ NO `React.memo` inicial | Medir primero |
| Imágenes | ✅ `loading="lazy"` | Best practice sin overhead |
| Imports | ✅ Directos | Siempre |
| Code splitting | ⏳ Medir después de build | Si bundle >150KB |

**Estrategia**: 
1. Implementar todas las features sin optimizaciones
2. Build de producción
3. Lighthouse audit
4. Aplicar árbol de decisiones solo si Performance <90

---

**Última actualización**: 2026-01-19 | **Estado**: Lista para consultar durante implementación
