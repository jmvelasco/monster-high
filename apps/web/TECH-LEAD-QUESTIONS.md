# 💬 Consultas al Tech Lead - Registro

> **Formato obligatorio**: Antes de preguntar al Tech Lead, documento aquí contexto, alternativas, y recomendación.

**Desarrollador**: Agente XP  
**Tech Lead**: José Manuel Velasco  
**Referencia**: `AGENTS.md` (sección "When to Consult the Technical Lead")

---

## Formato de Consulta

Según `AGENTS.md`, cada consulta debe incluir:

1. **Contexto**: ¿Qué estoy intentando hacer?
2. **Mi análisis**: Opciones que he considerado
3. **Pregunta específica**: ¿Qué necesito que decidas?
4. **Recomendación** (opcional): ¿Qué me parece mejor y por qué?

---

## Consultas Pendientes

**Estado**: ✅ Sin consultas pendientes actualmente

---

## Consultas Resueltas

**Ninguna consulta resuelta aún** - Pendiente de comenzar implementación.

---

## Plantilla de Nueva Consulta

```markdown
### [PENDIENTE] <Título breve de la consulta>

**Fecha**: YYYY-MM-DD  
**Componente/Módulo**: <CharacterCard | useCharacters | etc.>  
**Fase**: <0-Setup | 1-Listado | 2-Detalle | 3-Favoritos | 4-Header | 5-Responsive | 6-Polish>

#### Contexto
<Descripción de lo que estoy implementando y por qué surge la duda>

#### Mi Análisis
**Opción A**: <descripción>
- ✅ Pros: ...
- ❌ Contras: ...

**Opción B**: <descripción>
- ✅ Pros: ...
- ❌ Contras: ...

**Opción C** (si aplica): <descripción>
- ✅ Pros: ...
- ❌ Contras: ...

#### Pregunta Específica
<¿Qué necesito que decidas/valides?>

#### Mi Recomendación
**Opción X** me parece mejor porque <razones técnicas y de negocio>.

---
```

---

## Ejemplos de Consultas (Referencia)

### Ejemplo 1: Decisión Arquitectónica

```markdown
### [RESUELTO] ¿Dónde colocar lógica de concatenación de globalStory?

**Fecha**: 2026-01-20  
**Componente/Módulo**: GlobalStory.tsx  
**Fase**: 2-Detalle

#### Contexto
Estoy implementando el componente GlobalStory que debe mostrar la historia del personaje. Según TECHNICAL-SPEC.md, `globalStory` se genera concatenando:
- sections.personaje.general
- sections.personaje.apariencia  
- sections.personaje.personalidad

El JSON no tiene un campo `globalStory` directo, necesito construirlo.

#### Mi Análisis
**Opción A**: Lógica en componente GlobalStory
- ✅ Pros: Cohesión (lógica cerca del uso)
- ❌ Contras: Componente hace 2 cosas (concatenar + renderizar)

**Opción B**: Custom hook `useGlobalStory(character)`
- ✅ Pros: Separación de responsabilidades, testable independiente
- ❌ Contras: Un hook más (posible over-engineering para caso simple)

**Opción C**: Helper puro `buildGlobalStory(sections)`
- ✅ Pros: Función pura, muy testable, reutilizable
- ✅ Pros: Sigue principio de funciones <15 líneas
- ❌ Contras: Un archivo más

#### Pregunta Específica
¿Prefieres Opción A (lógica en componente), Opción B (hook), u Opción C (helper puro)?

#### Mi Recomendación
**Opción C** (helper puro) porque:
- Es función pura (fácil de testear sin React)
- Sigue KISS (más simple que un hook)
- Cumple SRP (componente solo renderiza, helper solo concatena)
- Si no se reutiliza, puedo refactorizar después (YAGNI)

---

**Respuesta del Tech Lead**: <Aprobada Opción C>
**Fecha Resolución**: 2026-01-20
```

---

### Ejemplo 2: Clarificación de Requisitos

```markdown
### [RESUELTO] ¿Cómo manejar personajes sin imagen en FavoritesPage?

**Fecha**: 2026-01-22  
**Componente/Módulo**: FavoritesPage.tsx  
**Fase**: 3-Favoritos

#### Contexto
Implementando página de favoritos. Según RF-003, los cards deben mostrar "imagen más grande que en listado, sin nombre debajo". Algunos personajes no tienen campo `image` en el JSON.

#### Mi Análisis
**Opción A**: Ocultar favoritos sin imagen
- ✅ Pros: UI más limpia
- ❌ Contras: Inconsistente (sí aparecen en listado principal)

**Opción B**: Mostrar placeholder como en listado principal
- ✅ Pros: Consistente con RF-001
- ✅ Pros: Usuario no pierde favoritos
- ❌ Contras: Placeholder 2x más grande puede verse mal

**Opción C**: Mostrar con placeholder + badge "Sin imagen"
- ✅ Pros: Usuario entiende por qué no hay imagen
- ❌ Contras: Más complejo (badge es feature nueva)

#### Pregunta Específica
¿Cuál es el comportamiento esperado para favoritos sin imagen?

#### Mi Recomendación
**Opción B** (placeholder como en listado) porque:
- Consistencia con DT-005 (placeholder para imágenes faltantes)
- KISS (reutilizar lógica existente de CharacterCard)
- No requiere features nuevas

---

**Respuesta del Tech Lead**: <Aprobada Opción B>
**Fecha Resolución**: 2026-01-22
```

---

### Ejemplo 3: Trade-offs Técnicos

```markdown
### [RESUELTO] ¿Aplicar code splitting en CharacterDetailPage?

**Fecha**: 2026-01-25  
**Componente/Módulo**: App.tsx (rutas)  
**Fase**: 6-Polish

#### Contexto
Build de producción generado. Bundle inicial: 165KB (gzip). Lighthouse Performance: 87 (target >90).

Analicé con vite-bundle-visualizer:
- CharacterDetailPage + dependencies: ~80KB
- CharacterListPage: ~50KB
- Resto (React, SWR, Router): ~35KB

#### Mi Análisis
**Opción A**: Code splitting de CharacterDetailPage
- ✅ Pros: Bundle inicial baja a ~85KB
- ✅ Pros: Lighthouse Performance sube a ~92
- ❌ Contras: Añade complejidad (Suspense, lazy loading)
- ❌ Contras: Latencia al navegar a detalle (fetch del chunk)

**Opción B**: NO optimizar, dejar bundle completo
- ✅ Pros: KISS (sin complejidad adicional)
- ✅ Pros: Navegación instantánea (todo cargado)
- ❌ Contras: Performance 87 (bajo target 90)
- ❌ Contras: FCP: 1.7s (sobre target 1.5s)

#### Pregunta Específica
¿Priorizamos Performance Score (Opción A) o Simplicidad + UX navegación (Opción B)?

#### Mi Recomendación
**Opción A** (code splitting) porque:
- Falla métrica objetiva (Performance <90, FCP >1.5s)
- React.lazy + Suspense es patrón estándar (no over-engineering)
- Latencia de chunk mitigable con prefetch en hover del link
- Tests permanecen verdes (ya tengo Suspense support)

Implementaría:
```typescript
const CharacterDetailPage = lazy(() => import('./pages/CharacterDetailPage'))
```

---

**Respuesta del Tech Lead**: <Aprobada Opción A>
**Fecha Resolución**: 2026-01-25
```

---

## Cuándo NO Consultar (Decidir Autónomamente)

Según `AGENTS.md`, **NO debo consultar** en estos casos (decidir yo mismo):

1. **Nombres de variables/funciones**: Aplicar coding-standards directamente
2. **Refactorings menores**: Extract function, rename, simplify
3. **Elección de TPP transformation**: Seguir la más simple del TPP
4. **Orden de tests**: Ordenar de simple a complejo autónomamente
5. **Decisiones cubiertas en TECHNICAL-SPEC.md**: Ya están aprobadas
6. **Linting/formatting**: Aplicar ESLint/Prettier sin consultar

**Regla**: Si tengo duda, primero reviso:
1. TECHNICAL-SPEC.md (¿ya está decidido?)
2. coding-standards.md (¿hay regla aplicable?)
3. tdd.md (¿hay guideline?)
4. Si después sigo con duda → Consultar con formato completo

---

## Estado de Consultas

| Estado | Descripción |
|--------|-------------|
| **[PENDIENTE]** | Consulta abierta, esperando respuesta del Tech Lead |
| **[RESUELTO]** | Consulta respondida y decisión aplicada |
| **[BLOQUEADO]** | Consulta crítica que bloquea avance (prioridad alta) |
| **[DESCARTADO]** | Consulta resuelta autónomamente después de más análisis |

---

## Reportar Consulta al Tech Lead

**Proceso**:

1. Documentar consulta en este archivo con formato completo
2. Actualizar PROGRESS.md:
   ```markdown
   ## Consultas Pendientes al Tech Lead
   
   - [PENDIENTE] ¿Dónde colocar lógica de concatenación de globalStory?
   ```
3. Notificar al Tech Lead: 
   ```
   🔴 Consulta bloqueante: <título>
   Ver detalles en TECH-LEAD-QUESTIONS.md
   ```
4. Si no bloquea: Continuar con otros tests mientras espero respuesta
5. Si bloquea: Pausar componente actual, trabajar en otro

---

**Última actualización**: 2026-01-19 | **Consultas totales**: 0
