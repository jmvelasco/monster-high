# 🔄 TDD Workflow - Mi Guía de Referencia

> **Uso personal**: Esta es mi guía paso a paso que seguiré disciplinadamente en cada test case.

**Desarrollador**: Agente XP  
**Referencias**: `docs/development-rules/tdd.md`, `docs/development-rules/coding-standards.md`

---

## Checklist por Test Case

Voy a seguir este checklist **sin excepciones** en cada test:

### 🤔 REASON (Análisis del Navegador)

- [ ] **1. Leer requisito funcional** (consultar TECHNICAL-SPEC.md)
- [ ] **2. Escribir lista de ejemplos** (simple → complejo)
- [ ] **3. Identificar el caso más simple** de la lista
- [ ] **4. Nombrar el test con lenguaje de negocio** (no implementación técnica)
- [ ] **5. Pensar el assert esperado** (qué quiero verificar)

**Tiempo estimado**: 2-5 minutos por test

**Ejemplo práctico (CharacterCard)**:

```typescript
// Lista de ejemplos (ordenados simple → complejo):
// 1. ✅ Muestra nombre del personaje
// 2. ⏳ Muestra imagen del personaje con alt text
// 3. ⏳ Muestra placeholder cuando no hay imagen
// 4. ⏳ Navega a detalle on click

// Test más simple: #1
describe('CharacterCard', () => {
  it('muestra nombre del personaje', () => {
    // Ir a fase RED
  })
})
```

---

### 🔴 RED (Escribir Test que Falla)

- [ ] **1. Arrange**: Preparar datos de prueba (props mínimas)
- [ ] **2. Act**: Renderizar componente / ejecutar función
- [ ] **3. Assert**: Verificar comportamiento esperado
- [ ] **4. Ejecutar test**: Verificar que **no compila** o **falla**
- [ ] **5. Escribir código mínimo para compilar** (función vacía, componente que retorna null)
- [ ] **6. Ejecutar test nuevamente**: Debe **fallar por razón correcta**
- [ ] **7. Commit**: `test(red): <descripción del test>`

**Tiempo estimado**: 3-7 minutos

**Ejemplo práctico**:

```typescript
// CharacterCard.test.tsx
import { render, screen } from '@testing-library/react'
import { CharacterCard } from '../CharacterCard'

describe('CharacterCard', () => {
  it('muestra nombre del personaje', () => {
    // Arrange
    const character = {
      name: 'Draculaura',
      url: 'https://example.com',
      technicalInfo: {},
      sections: {}
    }

    // Act
    render(<CharacterCard character={character} variant="list" />)

    // Assert
    expect(screen.getByText('Draculaura')).toBeInTheDocument()
  })
})

// Ejecutar: npm run test
// ❌ Error: Module not found - CharacterCard
```

```typescript
// CharacterCard.tsx (código mínimo para compilar)
export function CharacterCard() {
  return null
}

// Ejecutar: npm run test
// ❌ Falla: Unable to find element with text "Draculaura"
// ✅ Falla por razón correcta
```

**Commit**:
```bash
git add apps/web/src/components/character/__tests__/CharacterCard.test.tsx
git add apps/web/src/components/character/CharacterCard.tsx
git commit -m "test(red): muestra nombre del personaje"
```

---

### 🟢 GREEN (Implementación Mínima)

- [ ] **1. Consultar TPP**: Elegir transformación más simple
- [ ] **2. Implementar solución mínima** (hard-coded si es necesario)
- [ ] **3. Ejecutar test**: Debe **pasar** ✅
- [ ] **4. Verificar que NO rompí tests anteriores** (si existen)
- [ ] **5. Commit**: `test(green): <descripción del test>`

**Tiempo estimado**: 5-10 minutos

**Transformaciones TPP Aplicables a React** (ordenadas simple → complejo):

| # | Transformación | Ejemplo React |
|---|----------------|---------------|
| 1 | `{} → nil` | `return null` → `return <div />` |
| 2 | `nil → constant` | `null` → `"Draculaura"` |
| 3 | `constant → variable` | `"Draculaura"` → `{character.name}` |
| 4 | `unconditional → if` | `{character.name}` → `{character.name || 'Unknown'}` |
| 5 | `scalar → array` | `character` → `characters.map(...)` |
| 6 | `array → container` | `[item]` → `Set/Map` |
| 7 | `statement → statements` | `return x` → `const y = ...; return x` |
| 8 | `if → while` | `if (cond)` → `while (cond)` |
| 9 | `expression → function` | `x + 1` → `increment(x)` |
| 10 | `variable → assignment` | `const x = 1` → `x = newValue` |

**Ejemplo práctico**:

```typescript
// CharacterCard.tsx

interface CharacterCardProps {
  character: {
    name: string
    // ... otros campos
  }
  variant: 'list' | 'favorite'
}

export function CharacterCard({ character }: CharacterCardProps) {
  // TPP #3: constant → variable
  return <div>{character.name}</div>
}

// Ejecutar: npm run test
// ✅ Test passing
```

**Commit**:
```bash
git add apps/web/src/components/character/CharacterCard.tsx
git commit -m "test(green): muestra nombre del personaje"
```

---

### 🔵 REFACTOR (Mejorar Diseño)

- [ ] **1. Revisar coding-standards.md**: ¿Cumple todas las reglas?
- [ ] **2. Detectar duplicación**: ¿Veo el mismo código 3 veces?
- [ ] **3. Nombres autodocumentados**: ¿Son claros?
- [ ] **4. Funciones <15 líneas**: ¿Es demasiado larga?
- [ ] **5. Aplicar mejoras manteniendo tests verdes**
- [ ] **6. Ejecutar tests después de cada cambio**
- [ ] **7. Commit** (opcional): `test(refactor): <descripción mejora>`

**Tiempo estimado**: 2-5 minutos (puede ser 0 si código ya está bien)

**Checklist de Coding Standards**:

```
✅ Funciones <15 líneas
✅ Nombres autodocumentados (sin comentarios innecesarios)
✅ SRP: Cada función hace UNA cosa
✅ Guard clauses (salir pronto)
✅ Sin booleanos en parámetros
✅ CQS: Commands vs Queries
✅ Sin mutación de colecciones
✅ Constantes cerca del uso
✅ Law of Demeter (evitar cadenas largas)
✅ No singletons
```

**Ejemplo práctico**:

```typescript
// CharacterCard.tsx (después de varios tests)

export function CharacterCard({ character, variant }: CharacterCardProps) {
  const imageSrc = character.image || '/images/placeholder-character.png'
  const cardClass = variant === 'favorite' ? styles.cardFavorite : styles.cardList
  
  return (
    <div className={cardClass}>
      <img src={imageSrc} alt={character.name} loading="lazy" />
      {variant === 'list' && <p>{character.name}</p>}
    </div>
  )
}

// ✅ <15 líneas
// ✅ Nombres claros (imageSrc, cardClass)
// ✅ Sin duplicación
// ✅ Guard clause implícito con conditional rendering
```

**Commit** (si refactor significativo):
```bash
git add apps/web/src/components/character/CharacterCard.tsx
git commit -m "test(refactor): extract image source logic to variable"
```

---

### 🔄 RE-EVALUATE (Siguiente Caso)

- [ ] **1. Revisar lista de casos pendientes** (en PROGRESS.md)
- [ ] **2. ¿El siguiente caso sigue siendo el más simple?**
- [ ] **3. ¿Necesito reordenar la lista?**
- [ ] **4. ¿Descubrí caso edge que no había pensado?** → Agregarlo a lista
- [ ] **5. ¿Necesito consultar al Tech Lead?** → Documentar en TECH-LEAD-QUESTIONS.md
- [ ] **6. Actualizar PROGRESS.md**: Marcar test completado (🤔→🔴→🟢→🔵)
- [ ] **7. Volver a fase REASON con siguiente caso**

**Tiempo estimado**: 1-2 minutos

**Ejemplo práctico**:

```markdown
<!-- PROGRESS.md - CharacterCard.tsx -->

- [x] 🤔 → 🔴 → 🟢 → 🔵 | Muestra nombre del personaje ✅ COMPLETADO
- [ ] 🤔 → 🔴 → 🟢 → 🔵 | Muestra imagen del personaje con alt text ← SIGUIENTE
- [ ] 🤔 → 🔴 → 🟢 → 🔵 | Muestra placeholder cuando no hay imagen
- [ ] 🤔 → 🔴 → 🟢 → 🔵 | Navega a detalle on click

// Análisis: Siguiente caso sigue siendo el más simple ✅
// No necesito reordenar ✅
// No hay casos edge nuevos ✅
// Continuar con siguiente test...
```

---

## Antipatrones que Debo Evitar

### ❌ NUNCA Hacer:

1. **Escribir código de producción sin test primero**
   ```typescript
   // ❌ MAL
   export function CharacterCard() {
     return <div>...</div>  // Código sin test
   }
   ```

2. **Tener más de un test fallando**
   ```bash
   # ❌ MAL
   ❌ Test 1: muestra nombre
   ❌ Test 2: muestra imagen
   # Solo 1 test rojo a la vez
   ```

3. **Implementar más de lo necesario (YAGNI)**
   ```typescript
   // ❌ MAL
   export function CharacterCard({ character, variant, onHover, onFocus, theme }) {
     // Solo necesitaba character y variant, resto es YAGNI
   }
   ```

4. **Saltar fase REFACTOR**
   ```bash
   # ❌ MAL
   test(red): muestra nombre
   test(green): muestra nombre
   test(red): muestra imagen  # ← Sin refactor intermedio
   ```

5. **Usar variables genéricas**
   ```typescript
   // ❌ MAL
   const data = character.technicalInfo
   const x = character.name
   
   // ✅ BIEN
   const technicalInfo = character.technicalInfo
   const characterName = character.name
   ```

6. **Optimizar prematuramente**
   ```typescript
   // ❌ MAL (sin medir necesidad)
   const MemoizedCard = React.memo(CharacterCard)
   
   // ✅ BIEN (aplicar solo si mido re-renders >50ms)
   export function CharacterCard() { ... }
   ```

7. **Mockear sin aprobación**
   ```typescript
   // ❌ MAL (consultar Tech Lead primero)
   jest.mock('../hooks/useCharacters')
   ```

---

## Plantillas de Tests

### Plantilla: Componente React

```typescript
import { render, screen } from '@testing-library/react'
import { ComponentName } from '../ComponentName'

describe('ComponentName', () => {
  it('descripción del comportamiento esperado', () => {
    // Arrange
    const props = {
      // ... datos de prueba mínimos
    }

    // Act
    render(<ComponentName {...props} />)

    // Assert
    expect(screen.getByText('expected text')).toBeInTheDocument()
  })
})
```

### Plantilla: Custom Hook

```typescript
import { renderHook, waitFor } from '@testing-library/react'
import { useCustomHook } from '../useCustomHook'

describe('useCustomHook', () => {
  it('descripción del comportamiento esperado', () => {
    // Arrange
    const params = { ... }

    // Act
    const { result } = renderHook(() => useCustomHook(params))

    // Assert
    expect(result.current.data).toBeDefined()
  })
})
```

### Plantilla: Servicio/Utilidad

```typescript
import { serviceFunctionName } from '../serviceName'

describe('serviceFunctionName', () => {
  it('descripción del comportamiento esperado', () => {
    // Arrange
    const input = 'test input'

    // Act
    const result = serviceFunctionName(input)

    // Assert
    expect(result).toBe('expected output')
  })
})
```

---

## Timing Estimado por Test

| Fase | Tiempo Estimado | Acumulado |
|------|----------------|-----------|
| 🤔 REASON | 2-5 min | 2-5 min |
| 🔴 RED | 3-7 min | 5-12 min |
| 🟢 GREEN | 5-10 min | 10-22 min |
| 🔵 REFACTOR | 2-5 min | 12-27 min |
| 🔄 RE-EVALUATE | 1-2 min | 13-29 min |

**Promedio por test**: ~15-20 minutos  
**Tests por componente**: ~3-7 tests  
**Tiempo por componente**: ~1-2 horas

---

## Cuándo Reportar al Tech Lead

**Reportar cada vez que completo un componente** (~3-7 tests):

1. Actualizar PROGRESS.md con:
   - Tests completados (marcar checkboxes)
   - Coverage actual
   - Commits realizados
   - Decisiones técnicas tomadas (si hubo)
   
2. Mensaje al Tech Lead:
   ```
   ✅ Componente CharacterCard completado
   - Tests: 6/6 passing
   - Coverage: 95% (lines)
   - Commits: 12 (6 red, 6 green)
   - Sin bloqueos
   
   Siguiente: CharacterGrid (7 tests estimados)
   ```

---

## Recursos Rápidos

### Comandos Frecuentes

```bash
# Ejecutar tests (watch mode)
npm run test

# Ejecutar tests con coverage
npm run test -- --coverage

# Ejecutar solo un archivo de test
npm run test CharacterCard.test.tsx

# Ejecutar solo un test específico
npm run test -- -t "muestra nombre del personaje"
```

### Referencias Rápidas

- **TECHNICAL-SPEC.md**: Requisitos funcionales y decisiones técnicas
- **PROGRESS.md**: Estado actual del desarrollo
- **coding-standards.md**: Reglas de calidad de código
- **testing-standards.md**: Patrón FIRST, AAA, etc.

---

**Última actualización**: 2026-01-19 | **Estado**: Lista para usar
