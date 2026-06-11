# [ARCHIVED] Plan: Feature - Búsqueda reactiva con debounce en CharacterListPage

## TL;DR
Implementar filtrado as-you-type por nombre en `CharacterListPage`. La búsqueda se ejecuta de forma
reactiva conforme el usuario escribe, controlada con debounce de 300 ms para rendimiento. Incluye
botón de reset para limpiar el campo con un clic y un estado vacío diferenciado ("No se encontraron
personajes") cuando el criterio no coincide con ningún elemento. Se implementan 10 archivos nuevos y
3 modificaciones bajo ciclo TDD estricto, avanzando de adentro hacia afuera: hook compartido → caso
de uso → hook de store → componente SearchInput → extensión de CharacterGrid → integración en
CharacterListPage. Cierra con commit atómico, push y Pull Request por entrada estándar conforme a la
directiva de Closed-Loop PR Compliance.

---

## FASE 0 — Infraestructura Git + Baseline

**Paso 1 (git — verificar base):** Ejecutar `git branch --show-current` para confirmar la rama
activa. Ejecutar `git fetch origin` y confirmar que la rama `gh-600` existe en el remoto. Si
`gh-600` no existe, detener y reportar al desarrollador antes de continuar.

**Paso 2 (git — crear rama de feature):** Ejecutar secuencialmente:
`git checkout gh-600 && git pull origin gh-600 && git checkout -b feat/reactive-search-character-list`.
Confirmar con `git branch --show-current` que la rama activa es
`feat/reactive-search-character-list`.

**Paso 3 (validate — HALT si falla):** Ejecutar `npm run validate` desde la raíz del repositorio
para establecer la salud del estado actual antes de cualquier mutación. Si el comando falla,
reportar el log completo, detener la ejecución y no avanzar al Paso 4.

---

## FASE 1 — TDD: `useDebounce` (shared/infrastructure/hooks/)

**Paso 4 (test — RED):** Crear `apps/web/src/shared/tests/unit/useDebounce.test.ts`.
Definir los siguientes casos de prueba (el hook aún no existe → RED):
  - "devuelve el valor inicial sin modificación en el primer render"
  - "no actualiza el valor antes de que expire el delay" — `vi.useFakeTimers`,
    `vi.advanceTimersByTime(delay - 1)` → valor sin cambiar
  - "actualiza el valor exactamente cuando expira el delay" — `vi.advanceTimersByTime(delay)` →
    valor actualizado
  - "cancela el timer anterior si el valor cambia antes de expirar" — dos cambios de valor dentro
    del delay → solo el último actualiza, cleanup del efecto invocado

**Paso 5 (validate parcial — confirmar RED):** Ejecutar `npm run test --workspace=apps/web`.
Confirmar que los 4 tests del Paso 4 fallan. Si alguno pasa sin implementación, el contrato no
cubre comportamiento nuevo — revisar y corregir antes de continuar.

**Paso 6 (implementar — GREEN):** Crear
`apps/web/src/shared/infrastructure/hooks/useDebounce.ts`.
Firma: `useDebounce<T>(value: T, delay: number): T`.
Lógica mínima: `useState` inicializado con `value`, `useEffect` que lanza un `setTimeout` con el
`delay` y lo limpia con `clearTimeout` en el callback de cleanup.

**Paso 7 (validate parcial — confirmar GREEN):** Ejecutar `npm run test --workspace=apps/web`.
Confirmar que los 4 tests del Paso 4 pasan. Si alguno sigue en rojo, corregir la implementación
sin modificar los tests.

**Paso 8 (refactor):** Revisar que el tipo genérico `<T>` esté correctamente propagado, que el
`clearTimeout` sea explícito y que no existan side effects innecesarios.

**Paso 9 (re-evaluar — HALT si falla):** Ejecutar `npm run validate` desde la raíz. Confirmar que
el hook no introduce imports de librerías externas ni viola la capa `shared/infrastructure/`.
Confirmar que todos los tests previos al Paso 4 siguen en verde. Si hay regresiones, detener y
reportar.

---

## FASE 2 — TDD: `FilterCharactersByNameUseCase` (characters/application/)

**Paso 10 (test — RED):** Crear
`apps/web/src/characters/application/__tests__/FilterCharactersByNameUseCase.test.ts`.
Definir los siguientes casos de prueba (el use case aún no existe → RED):
  - "devuelve todos los personajes cuando el query es cadena vacía"
  - "devuelve todos los personajes cuando el query contiene solo espacios en blanco"
  - "filtra por substring parcial del nombre" — query `"dracu"` encuentra `"Draculaura"`
  - "la comparación es case-insensitive" — query `"DRACULAURA"` encuentra `"Draculaura"`
  - "devuelve array vacío cuando ningún personaje coincide con el criterio"
  - "aplica trim al query antes de comparar" — query `"  Draculaura  "` encuentra `"Draculaura"`

**Paso 11 (validate parcial — confirmar RED):** Ejecutar `npm run test --workspace=apps/web`.
Confirmar que los 6 tests del Paso 10 fallan.

**Paso 12 (implementar — GREEN):** Crear
`apps/web/src/characters/application/FilterCharactersByNameUseCase.ts`.
Clase con método `execute(characters: Character[], query: string): Character[]`. Lógica mínima:
si `query.trim() === ''` retornar todos; si no, filtrar por
`character.name.toLowerCase().includes(query.trim().toLowerCase())`.

**Paso 13 (validate parcial — confirmar GREEN):** Ejecutar `npm run test --workspace=apps/web`.
Confirmar que los 6 tests del Paso 10 pasan.

**Paso 14 (refactor):** Revisar que el método sea puro (sin efectos de lado), que no importe ningún
puerto ni SDK externo, y que la lógica de normalización sea consistente.

**Paso 15 (re-evaluar — HALT si falla):** Ejecutar `npm run validate` desde la raíz. Confirmar que
el use case no introduce dependencias hacia la capa de infraestructura. Confirmar que todos los
tests de las fases anteriores siguen en verde. Si hay regresiones, detener y reportar.

---

## FASE 3 — TDD: `Character.search.ts` (characters/infrastructure/store/)

**Paso 16 (test — RED):** Crear
`apps/web/src/characters/tests/unit/Character.search.test.tsx`.
Misma arquitectura de wrapper que `Character.queries.test.tsx` (QueryClient +
CharacterUseCasesProvider). Definir los siguientes casos de prueba:
  - "expone searchTerm con valor inicial vacío"
  - "filteredCharacters() devuelve todos los personajes cuando searchTerm es vacío"
  - "filteredCharacters() devuelve solo personajes coincidentes después de que expira el debounce"
    — `vi.useFakeTimers`, `act(() => vi.advanceTimersByTime(300))`
  - "resetSearch() establece searchTerm a cadena vacía"
  - "expone isLoading del query subyacente como true durante la carga inicial"

**Paso 17 (validate parcial — confirmar RED):** Ejecutar `npm run test --workspace=apps/web`.
Confirmar que los 5 tests del Paso 16 fallan.

**Paso 18 (implementar — GREEN):** Crear
`apps/web/src/characters/infrastructure/store/Character.search.ts`.
Composición: `useCharactersQuery` + `useDebounce(searchTerm, 300)` +
`FilterCharactersByNameUseCase`. Estado: `useState<string>('')` para `searchTerm`. El use case se
instancia una única vez a nivel de módulo (instancia estática fuera del cuerpo del hook).
`filteredCharacters` es una función que invoca `useCase.execute(query.characters(), debouncedQuery)`
en cada llamada. Retornar: `{ searchTerm, setSearchTerm, resetSearch, filteredCharacters, isLoading,
errorMessage }`.

**Paso 19 (validate parcial — confirmar GREEN):** Ejecutar `npm run test --workspace=apps/web`.
Confirmar que los 5 tests del Paso 16 pasan.

**Paso 20 (refactor):** Revisar que el hook no tiene lógica de presentación, que la instancia del
use case no se recrea en cada render y que `resetSearch` es un callback estable.

**Paso 21 (re-evaluar — HALT si falla):** Ejecutar `npm run validate` desde la raíz. Confirmar que
el hook importa únicamente artefactos de las capas permitidas (application y shared). Confirmar que
todos los tests de las fases anteriores siguen en verde. Si hay regresiones, detener y reportar.

---

## FASE 4 — TDD: `SearchInput` (characters/infrastructure/ui/SearchInput/)

**Paso 22 (test — RED):** Crear
`apps/web/src/characters/tests/unit/SearchInput.test.tsx`.
Definir los siguientes casos de prueba (el componente aún no existe → RED):
  - "renderiza un campo de texto con placeholder 'Buscar personaje...'"
  - "el input tiene un label accesible" — `getByRole('searchbox', { name: /buscar/i })` o
    `getByLabelText(/buscar/i)`
  - "el botón de reset NO está visible cuando value es cadena vacía"
  - "el botón de reset SÍ está visible cuando value tiene contenido"
  - "al hacer clic en el botón de reset se invoca la prop onReset"
  - "al escribir en el input se invoca onChange con el nuevo valor"
  - "el botón de reset tiene aria-label 'Limpiar búsqueda'"

**Paso 23 (validate parcial — confirmar RED):** Ejecutar `npm run test --workspace=apps/web`.
Confirmar que los 7 tests del Paso 22 fallan.

**Paso 24 (implementar — GREEN):** Crear
`apps/web/src/characters/infrastructure/ui/SearchInput/SearchInput.tsx`.
Props: `{ value: string; onChange: (value: string) => void; onReset: () => void }`.
Renderiza un `<label>` con texto visualmente oculto y un `<input type="search">` asociado.
Renderiza el botón de reset condicionalmente (`value !== ''`) con `aria-label="Limpiar búsqueda"`.

**Paso 25 (implementar — GREEN):** Crear
`apps/web/src/characters/infrastructure/ui/SearchInput/SearchInput.module.css`.
Estilos: contenedor flex con gap, input con bordes del design system y foco estilizado con
`--mh-pink`, botón de reset con cursor pointer y accesibilidad de foco visible.

**Paso 26 (validate parcial — confirmar GREEN):** Ejecutar `npm run test --workspace=apps/web`.
Confirmar que los 7 tests del Paso 22 pasan.

**Paso 27 (refactor):** Revisar que el componente sea puramente presentacional (sin estado propio),
que la accesibilidad del input sea correcta y que no existan imports de lógica de negocio.

**Paso 28 (re-evaluar — HALT si falla):** Ejecutar `npm run validate` desde la raíz. Confirmar que
el componente no importa nada de `domain/` ni SDKs externos. Confirmar que todos los tests de las
fases anteriores siguen en verde. Si hay regresiones, detener y reportar.

---

## FASE 5 — TDD: extensión de prop `emptyMessage` en `CharacterGrid`

**Paso 29 (test — RED):** Añadir un nuevo caso de prueba al final de
`apps/web/src/characters/tests/unit/CharacterGrid.test.tsx` (sin modificar los existentes):
  - "cuando emptyMessage se provee explícitamente y characters está vacío, renderiza ese mensaje" —
    prop `emptyMessage="No se encontraron personajes"`, confirmar texto visible en pantalla

**Paso 30 (validate parcial — confirmar RED):** Ejecutar `npm run test --workspace=apps/web`.
Confirmar que el nuevo test del Paso 29 falla.

**Paso 31 (implementar — GREEN):** Modificar
`apps/web/src/characters/infrastructure/ui/CharacterGrid/CharacterGrid.tsx`.
Añadir prop opcional `emptyMessage?: string` con valor por defecto `"No hay personajes disponibles"`.
Reemplazar el string hardcodeado en el JSX del estado vacío por la prop `emptyMessage`.

**Paso 32 (validate parcial — confirmar GREEN):** Ejecutar `npm run test --workspace=apps/web`.
Confirmar que el test del Paso 29 pasa Y que el test existente "muestra mensaje vacío cuando no hay
personajes" sigue pasando con el valor por defecto.

**Paso 33 (refactor):** Revisar que el default sea idiomático en TypeScript (parámetro default en
la desestructuración de props) y que no existan otros strings hardcodeados pendientes.

**Paso 34 (re-evaluar — HALT si falla):** Ejecutar `npm run validate` desde la raíz. Confirmar que
ningún test existente de `CharacterGrid` regresiona. Si hay regresiones, detener y reportar.

---

## FASE 6 — TDD: integración en `CharacterListPage`

**Paso 35 (test — RED):** Crear
`apps/web/src/characters/tests/unit/CharacterListPage.search.test.tsx`.
Misma arquitectura de wrapper que `CharacterListPage.a11y.test.tsx` (QueryClient +
CharacterUseCasesProvider + MemoryRouter). Definir los siguientes casos de prueba:
  - "renderiza el campo de búsqueda en la página principal"
  - "al escribir en el campo y avanzar el debounce, la grid muestra solo los personajes
    coincidentes" — `vi.useFakeTimers`, `userEvent.type`, `act(() =>
    vi.advanceTimersByTime(300))`, confirmar cards visibles vs. ausentes
  - "al hacer clic en el botón de reset, la grid vuelve a mostrar todos los personajes"
  - "cuando la búsqueda no coincide con ningún personaje, muestra 'No se encontraron personajes'"

**Paso 36 (validate parcial — confirmar RED):** Ejecutar `npm run test --workspace=apps/web`.
Confirmar que los 4 tests del Paso 35 fallan.

**Paso 37 (implementar — GREEN):** Modificar
`apps/web/src/characters/infrastructure/ui/CharacterListPage.tsx`.
Reemplazar la importación y uso de `useCharactersQuery` por `useCharacterSearch`. Renderizar
`<SearchInput value={searchTerm} onChange={setSearchTerm} onReset={resetSearch} />` encima del
grid. Pasar `filteredCharacters()` a `CharacterGrid`. Pasar
`emptyMessage="No se encontraron personajes"` a `CharacterGrid` cuando `searchTerm !== ''`.

**Paso 38 (validate parcial — confirmar GREEN):** Ejecutar `npm run test --workspace=apps/web`.
Confirmar que los 4 tests del Paso 35 pasan Y que los tests existentes de
`CharacterListPage.a11y.test.tsx` siguen en verde.

**Paso 39 (refactor):** Revisar que `CharacterListPage` no contenga lógica de filtrado directa
(debe delegarla al hook), que los bindings del `SearchInput` sean correctos y que el estado vacío
contextual se active solo cuando hay un query activo.

**Paso 40 (re-evaluar + validate final — HALT si falla):** Ejecutar `npm run validate` desde la
raíz (backend + frontend + linting + type-check). Si el comando falla, reportar el log completo,
tratar como Goal Alignment Failure, detener la ejecución y retornar a la fase de Reasoning para
corregir la desviación antes de continuar.

---

## FASE 7 — Git + Closed-Loop Pull Request Compliance

**Paso 41 (git commit):** Ejecutar `git add -A` y confirmar con `git status` que únicamente los
10 archivos nuevos y los 3 archivos modificados descritos en este plan están en el staging area.
Ejecutar el commit atómico con mensaje convencional en inglés:
`git commit -m "feat(web): add reactive as-you-type search with debounce to CharacterListPage"`.

**Paso 42 (git push):** Publicar la rama en el remoto:
`git push origin feat/reactive-search-character-list`.
Confirmar que el push se completa sin errores antes de continuar.

**Paso 43 (template inspection):** Leer el contenido completo de
`.github/pull_request_template.md` mediante herramientas de lectura de archivos para adoptar su
esquema Markdown exacto en memoria antes de redactar el cuerpo del PR. No avanzar al Paso 44 sin
haber leído el archivo.

**Paso 44 (memory population):** Adoptar el esquema del template e invocar cada sección con el
contenido generado en esta sesión. Verificar cada checkbox de compliance cambiando `- [ ]` a
`- [X]` exclusivamente cuando la evidencia de la sesión lo justifique:
  - Ubicación del Plan: marcar `[X]` — `plan.md` generado en la raíz del repositorio.
  - Fase 1 Reasoning: marcar `[X]` — impacto evaluado por capas, sin violaciones detectadas.
  - Fase 2 Planning: marcar `[X]` — plan redactado con ciclos TDD y sin bloques de código.
  - Fase 3 Action & Evaluation: marcar `[X]` — doble validación ejecutada (baseline + post-mutación).
  - Aislamiento del Dominio: marcar `[X]` — ningún import de infraestructura en `domain/`.
  - Inversión de control: marcar `[X]` — ningún nuevo puerto requerido; no aplica mutación de puertos.
  - Validación estática: marcar `[X]` — `npm run validate` devolvió código de salida 0.

**Paso 45 (ephemeral stream execution):** Construir el cuerpo del PR como una cadena Markdown en
memoria (sin escribirlo en disco). Ejecutar la creación del PR utilizando entrada estándar para
evitar contaminación de archivos temporales:
`gh pr create --base gh-600 --title "feat(web): reactive as-you-type search with debounce in CharacterListPage" -F -`.
El cuerpo completo del PR se pasa mediante pipe a `stdin` con el flag `-F -`. Confirmar con
`gh pr view` que el PR se creó correctamente apuntando a la base `gh-600`.

---

## Archivos nuevos (crear, en orden cronológico de aparición en el plan)

  1. `apps/web/src/shared/tests/unit/useDebounce.test.ts`
  2. `apps/web/src/shared/infrastructure/hooks/useDebounce.ts`
  3. `apps/web/src/characters/application/__tests__/FilterCharactersByNameUseCase.test.ts`
  4. `apps/web/src/characters/application/FilterCharactersByNameUseCase.ts`
  5. `apps/web/src/characters/tests/unit/Character.search.test.tsx`
  6. `apps/web/src/characters/infrastructure/store/Character.search.ts`
  7. `apps/web/src/characters/tests/unit/SearchInput.test.tsx`
  8. `apps/web/src/characters/infrastructure/ui/SearchInput/SearchInput.tsx`
  9. `apps/web/src/characters/infrastructure/ui/SearchInput/SearchInput.module.css`
  10. `apps/web/src/characters/tests/unit/CharacterListPage.search.test.tsx`

## Archivos modificados

  - `apps/web/src/characters/tests/unit/CharacterGrid.test.tsx` — añadir test `emptyMessage`
  - `apps/web/src/characters/infrastructure/ui/CharacterGrid/CharacterGrid.tsx` — prop `emptyMessage?`
  - `apps/web/src/characters/infrastructure/ui/CharacterListPage.tsx` — integrar `useCharacterSearch`
    y `SearchInput`

---

## Decisiones de diseño

- `useDebounce` reside en `shared/infrastructure/hooks/` porque usa APIs de React (`useState`,
  `useEffect`) y no puede ser dominio puro.
- `FilterCharactersByNameUseCase` reside en `characters/application/` porque es lógica de
  orquestación de presentación (función pura sobre entidades del dominio, sin acceso a puertos).
- Delay de debounce: 300 ms — valor estándar de UX para búsqueda as-you-type que equilibra
  reactividad y rendimiento.
- El mensaje `emptyMessage` lo controla `CharacterListPage`, no el hook — separa la lógica de
  estado de la decisión de presentación.
- `SearchInput` es un componente presentacional puro, sin estado propio — maximiza la
  reusabilidad y la testeabilidad aislada.
- La instancia de `FilterCharactersByNameUseCase` se declara a nivel de módulo en
  `Character.search.ts` para evitar recreaciones por render.
