# 📝 Estrategia de Commits - TDD Disciplinado

> **Mi referencia**: Cuándo y cómo hacer commits siguiendo TDD estricto.

**Desarrollador**: Agente XP  
**Referencias**: `AGENTS.md`, `docs/development-rules/tdd.md`

---

## Principio Fundamental

> **Commit cada paso del ciclo TDD**: RED, GREEN, REFACTOR

Según `AGENTS.md` y `.github/copilot-instructions.md`:

> Always commit each step in the Red-Green-Refactor cycle. The commit message should be the test case description prepended with the TDD cycle step. For example: `test(red): <test case description>` for Red stage; `test(green): <test case description>` for Green stage. Optionally if a refactor is considered, also commit the changes done for the refactor applied related with the current TDD cycle.

---

## Timing: Cuándo Hacer Commits

### 🔴 RED - Commit Obligatorio

**Cuándo**: Después de escribir test que falla por razón correcta.

**Qué incluir**:
- Archivo de test con nuevo test case
- Código mínimo para compilar (función vacía, componente que retorna null)

**Ejemplo**:
```bash
# Archivos modificados:
# - apps/web/src/components/character/__tests__/CharacterCard.test.tsx (nuevo test)
# - apps/web/src/components/character/CharacterCard.tsx (código mínimo para compilar)

git add apps/web/src/components/character/__tests__/CharacterCard.test.tsx
git add apps/web/src/components/character/CharacterCard.tsx
git commit -m "test(red): muestra nombre del personaje"
```

**Verificación antes de commit**:
- ✅ Test compila
- ✅ Test falla por razón correcta (no por error de sintaxis)
- ✅ Todos los tests anteriores siguen pasando

---

### 🟢 GREEN - Commit Obligatorio

**Cuándo**: Después de implementar solución mínima que hace pasar el test.

**Qué incluir**:
- Código de producción modificado
- NO incluir nuevos tests
- NO incluir refactors

**Ejemplo**:
```bash
# Archivos modificados:
# - apps/web/src/components/character/CharacterCard.tsx (implementación mínima)

git add apps/web/src/components/character/CharacterCard.tsx
git commit -m "test(green): muestra nombre del personaje"
```

**Verificación antes de commit**:
- ✅ Test actual pasa
- ✅ Todos los tests anteriores siguen pasando
- ✅ No hay código muerto (comentado)
- ✅ No hay console.logs olvidados

---

### 🔵 REFACTOR - Commit Opcional

**Cuándo**: Después de mejorar diseño manteniendo tests verdes.

**Qué incluir**:
- Código refactorizado (producción y/o tests)
- Puede incluir múltiples archivos si refactor afecta varios

**Criterios para commit**:
- ✅ **Commit SI**: Refactor significativo (rename, extract function, cambio de estructura)
- ⏭️ **Skip SI**: Cambio menor (formato, spacing, renombre de variable local)

**Ejemplo - Commit de refactor**:
```bash
# Refactor significativo: extraer lógica a helper
git add apps/web/src/components/character/CharacterCard.tsx
git add apps/web/src/utils/imageUtils.ts
git commit -m "test(refactor): extract image source logic to imageUtils"
```

**Ejemplo - NO commit (cambio menor)**:
```typescript
// Cambio menor: solo formato
const name = character.name  →  const characterName = character.name
// ⏭️ No hacer commit, continuar con siguiente test
```

**Verificación antes de commit**:
- ✅ Todos los tests siguen pasando
- ✅ No cambió comportamiento (solo diseño)
- ✅ Refactor aporta valor (legibilidad, reutilización, etc.)

---

## Patrones de Commits

### Patrón 1: Sin Refactor (lo más común)

```
test(red): muestra nombre del personaje
test(green): muestra nombre del personaje
test(red): muestra imagen del personaje con alt text
test(green): muestra imagen del personaje con alt text
test(red): muestra placeholder cuando no hay imagen
test(green): muestra placeholder cuando no hay imagen
```

**Total**: 6 commits para 3 test cases

---

### Patrón 2: Con Refactor Significativo

```
test(red): muestra nombre del personaje
test(green): muestra nombre del personaje
test(red): muestra imagen del personaje con alt text
test(green): muestra imagen del personaje con alt text
test(refactor): extract image source logic to variable
test(red): muestra placeholder cuando no hay imagen
test(green): muestra placeholder cuando no hay imagen
test(refactor): extract placeholder logic to imageUtils helper
```

**Total**: 8 commits para 3 test cases (2 refactors significativos)

---

### Patrón 3: Refactor de Tests (menos común)

```
test(red): hook retorna loading state inicialmente
test(green): hook retorna loading state inicialmente
test(red): hook fetches personajes desde API
test(green): hook fetches personajes desde API
test(refactor): extract common test setup to beforeEach
```

**Razón del refactor de tests**: Detecté duplicación en Arrange phase de múltiples tests.

---

## Mensajes de Commit

### Formato Obligatorio

```
<tipo>(<fase>): <descripción>

<tipo>    = "test" (siempre en TDD)
<fase>    = "red" | "green" | "refactor"
<descripción> = lenguaje de negocio, no implementación técnica
```

### ✅ Ejemplos Buenos

```bash
test(red): muestra nombre del personaje
test(green): muestra nombre del personaje
test(refactor): extract character prop interface

test(red): navega a detalle on click
test(green): navega a detalle on click
test(refactor): replace inline handler with useCallback

test(red): guarda slug en localStorage
test(green): guarda slug en localStorage
test(refactor): extract localStorage key to constant
```

### ❌ Ejemplos Malos

```bash
# ❌ MAL: No incluye fase TDD
test: add character name

# ❌ MAL: Lenguaje técnico, no de negocio
test(red): render div with character.name prop

# ❌ MAL: Demasiado genérico
test(green): implement feature

# ❌ MAL: Múltiples responsabilidades
test(green): muestra nombre del personaje y navega on click

# ❌ MAL: Incluye detalles de implementación irrelevantes
test(refactor): rename const x to characterName and add typescript type annotation
```

---

## Commits Especiales

### Commit Inicial (Setup)

**Cuándo**: Después de completar Fase 0 (setup del workspace).

**Formato**:
```bash
chore: initialize frontend workspace

- Create Vite project with React 19 + TypeScript
- Configure Vitest + React Testing Library
- Configure ESLint + Prettier (inherit from root)
- Copy monsterHighCharacters.json to public/api/
- Copy Gruenewald VA font (woff2) to public/fonts/
- Generate TypeScript types from JSON
- Setup routing with React Router
- Configure SWR global config
```

**Tipo**: `chore` (no es test, es configuración)

---

### Commit de Configuración (Fase 0)

**Ejemplos**:
```bash
chore: configure vitest with happy-dom
chore: add SWR config with revalidateOnFocus disabled
chore: generate TypeScript types from characters JSON
chore: setup CSS modules with Monster High theme variables
```

---

### Commit de Documentación (este tipo de archivos)

**Ejemplos**:
```bash
docs: create TECHNICAL-SPEC.md as source of truth
docs: create TDD-WORKFLOW.md guide
docs: update PROGRESS.md after completing CharacterCard
```

**Tipo**: `docs` (no afecta código de producción)

---

## Comandos Git Configurados

### Alias Útiles (opcional, configurar en .gitconfig)

```bash
# Ver log de commits TDD
git log --oneline --grep="test("

# Ver solo commits RED
git log --oneline --grep="test(red)"

# Ver solo commits GREEN
git log --oneline --grep="test(green)"

# Ver solo commits REFACTOR
git log --online --grep="test(refactor)"

# Contar commits de último componente
git log --oneline --grep="CharacterCard" | wc -l
```

---

## Workflow Visual

```
🤔 REASON
  ↓ (planificar, no commit)
  
🔴 RED
  ↓ Escribir test que falla
  ↓ Código mínimo para compilar
  ├─ git add test + code
  └─ git commit -m "test(red): <descripción>"
  
🟢 GREEN
  ↓ Implementar solución mínima
  ├─ git add code
  └─ git commit -m "test(green): <descripción>"
  
🔵 REFACTOR
  ↓ ¿Refactor significativo?
  ├─ SÍ
  │  ↓ Mejorar diseño
  │  ├─ git add files
  │  └─ git commit -m "test(refactor): <descripción>"
  └─ NO
     ↓ Continuar sin commit
  
🔄 RE-EVALUATE
  ↓ Actualizar PROGRESS.md (no commit aún)
  ↓ ¿Componente completado?
  ├─ SÍ
  │  ├─ git add PROGRESS.md
  │  ├─ git commit -m "docs: mark CharacterCard as completed"
  │  └─ Reportar al Tech Lead
  └─ NO
     └─ Volver a 🤔 REASON con siguiente test
```

---

## Errores Comunes a Evitar

### ❌ Error 1: Commits Agrupados

```bash
# ❌ MAL: Agrupar RED + GREEN en un commit
git commit -m "test: muestra nombre del personaje"

# ✅ BIEN: Commits separados
git commit -m "test(red): muestra nombre del personaje"
git commit -m "test(green): muestra nombre del personaje"
```

**Razón**: Pierdes visibilidad del ciclo TDD en el historial.

---

### ❌ Error 2: Commit de Múltiples Tests

```bash
# ❌ MAL: Implementar 3 tests y hacer 1 commit
git commit -m "test: CharacterCard renders correctly"

# ✅ BIEN: 1 commit por fase de cada test
# 6 commits para 3 tests (sin refactor)
```

**Razón**: Dificulta revert si un test estaba mal planteado.

---

### ❌ Error 3: Commit sin Verificar Tests

```bash
# ❌ MAL: Commit sin ejecutar npm run test
git commit -m "test(green): muestra nombre del personaje"
# (pero el test sigue fallando)

# ✅ BIEN: Siempre verificar antes
npm run test  # ✅ All tests passing
git commit -m "test(green): muestra nombre del personaje"
```

---

### ❌ Error 4: Mensajes Genéricos

```bash
# ❌ MAL
test(red): add test
test(green): fix test
test(refactor): refactor code

# ✅ BIEN
test(red): muestra placeholder cuando no hay imagen
test(green): muestra placeholder cuando no hay imagen
test(refactor): extract default image path to constant
```

---

## Estadísticas Esperadas

### Por Test Case (promedio)

- **Sin refactor**: 2 commits (RED + GREEN)
- **Con refactor**: 3 commits (RED + GREEN + REFACTOR)

### Por Componente (~6 test cases)

- **Mínimo**: 12 commits (6 tests × 2)
- **Promedio**: 15 commits (algunos refactors)
- **Máximo**: 18 commits (refactor en cada test)

### Por Fase del Proyecto

| Fase | Componentes | Tests Est. | Commits Est. |
|------|-------------|------------|--------------|
| Fase 0 | 0 | 0 | 5-10 (setup) |
| Fase 1 | 4 | 19 | 40-50 |
| Fase 2 | 5 | 21 | 45-55 |
| Fase 3 | 4 | 22 | 45-55 |
| Fase 4 | 2 | 10 | 20-25 |
| Fase 5 | 0 | 14 | 28-35 |
| Fase 6 | 3 | 0 | 10-15 |
| **TOTAL** | **18** | **86** | **193-245** |

---

## Integración con PROGRESS.md

### Después de Cada Test

```markdown
<!-- PROGRESS.md -->
- [x] 🤔 → 🔴 → 🟢 → 🔵 | Muestra nombre del personaje ✅
  Commits: test(red), test(green)
  
- [ ] 🤔 → 🔴 → 🟢 → 🔵 | Muestra imagen del personaje ← ACTUAL
```

**No hacer commit de PROGRESS.md** después de cada test (demasiado ruido).

---

### Después de Cada Componente

```markdown
<!-- PROGRESS.md -->
#### Componente: CharacterCard.tsx

**Estado del Ciclo TDD**: ✅ Completado

**Test Cases**:
- [x] 🤔 → 🔴 → 🟢 → 🔵 | Muestra nombre del personaje
- [x] 🤔 → 🔴 → 🟢 → 🔵 | Muestra imagen del personaje con alt text
- [x] 🤔 → 🔴 → 🟢 → 🔵 | Muestra placeholder cuando no hay imagen
- [x] 🤔 → 🔴 → 🟢 → 🔵 | Aplica variant="list" correctamente
- [x] 🤔 → 🔴 → 🟢 → 🔵 | Aplica variant="favorite" correctamente
- [x] 🤔 → 🔴 → 🟢 → 🔵 | Navega a detalle on click

**Coverage**: 95% (lines) | **Commits**: 14 (6 red, 6 green, 2 refactor)
```

**Hacer commit de PROGRESS.md**:
```bash
git add apps/web/PROGRESS.md
git commit -m "docs: mark CharacterCard as completed (6/6 tests, 95% coverage)"
```

---

## Buenas Prácticas

### ✅ DO

1. **Commit pequeño y atómico**: Cada commit debe ser revertible sin romper otros tests
2. **Mensaje descriptivo**: Lenguaje de negocio, no implementación técnica
3. **Verificar tests antes de commit**: `npm run test` debe estar verde
4. **Refactor solo si aporta valor**: No refactorizar por refactorizar
5. **Documentar decisiones en PROGRESS.md**: Después de completar componente

### ❌ DON'T

1. **No agrupar RED + GREEN**: Commits separados obligatorio
2. **No commit sin tests verdes**: Siempre verificar antes
3. **No mensajes genéricos**: "fix", "update", "refactor" sin contexto
4. **No commit de código comentado**: Borrar antes de commit
5. **No commit de console.logs**: Limpiar antes de commit

---

## Ejemplo Real Completo

### CharacterCard - Primer Test Case

```bash
# 🤔 REASON (no commit, solo planificación)
# Identifico caso más simple: "Muestra nombre del personaje"

# 🔴 RED
# Escribo test → falla (module not found)
# Creo CharacterCard.tsx vacío → test falla (texto no encontrado)
git add apps/web/src/components/character/__tests__/CharacterCard.test.tsx
git add apps/web/src/components/character/CharacterCard.tsx
git commit -m "test(red): muestra nombre del personaje"

# 🟢 GREEN
# Implemento: return <div>{character.name}</div>
# Test pasa ✅
git add apps/web/src/components/character/CharacterCard.tsx
git commit -m "test(green): muestra nombre del personaje"

# 🔵 REFACTOR
# Código ya está bien (solo 3 líneas), no refactorizo
# Continuo con siguiente test

# 🔄 RE-EVALUATE
# Marco test en PROGRESS.md (no commit aún)
# Siguiente: "Muestra imagen del personaje con alt text"
```

**Total**: 2 commits para primer test case

---

## Resumen Ejecutivo

| Aspecto | Decisión |
|---------|----------|
| **Frecuencia commits** | RED, GREEN, REFACTOR (si significativo) |
| **Formato mensaje** | `test(<fase>): <descripción negocio>` |
| **Verificación pre-commit** | Tests verdes obligatorio |
| **Commits por test** | 2-3 (promedio 2.5) |
| **Commits por componente** | 12-18 (promedio 15) |
| **Commits setup (Fase 0)** | 5-10 |
| **Commits documentación** | Al completar componente |

---

**Última actualización**: 2026-01-19 | **Estado**: Lista para aplicar
