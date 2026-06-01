# Plan: Footer con autoría y motivación (feat/footer-author-info → gh-600)

## TL;DR
Añadir un componente `Footer` estático al layout compartido del frontend, mostrando la dedicatoria
a Cloe y la práctica deliberada como motivación. El componente vivirá en
`shared/infrastructure/ui/Footer/`, siguiendo el mismo patrón que `Header`. Se ejecuta bajo ciclo
TDD estricto con rama independiente y PR a `gh-600`.

---

## FASE 0 — Infraestructura Git + Baseline

**Paso 1 (git):** Verificar rama actual con `git branch --show-current` y confirmar que `gh-600`
existe localmente o en remoto con `git fetch origin`.

**Paso 2 (git):** Crear rama de feature a partir de `gh-600`:
`git checkout gh-600 && git pull origin gh-600 && git checkout -b feat/footer-author-info`

**Paso 3 (validate — HALT si falla):** Ejecutar `npm run validate` desde la raíz para establecer
la salud del repositorio antes de cualquier cambio. Si falla, reportar y detener.

---

## FASE 1 — TDD: RED (Contrato de tests)

**Paso 4 (test — RED):** Crear `apps/web/src/shared/tests/unit/Footer.test.tsx`.
Definir los siguientes casos de prueba (el componente aún no existe → RED):
  - "renderiza el landmark semántico footer" — `screen.getByRole('contentinfo')` existe
  - "muestra la dedicatoria a Cloe" — texto visible que mencione "Cloe"
  - "muestra la motivación de práctica deliberada" — texto que mencione "práctica deliberada"
  - "muestra el año en el copyright" — texto que incluya el año actual (2026)
  - "tiene aria-label descriptivo en el footer" — accesibilidad del landmark

**Paso 5 (validate parcial — confirmar RED):** Ejecutar `npm run test --workspace=apps/web` para
confirmar que los nuevos tests fallan (RED). Si ya pasan sin implementación, el contrato no cubre
comportamiento nuevo — revisar.

---

## FASE 2 — TDD: GREEN (Implementación mínima)

**Paso 6 (implementar Footer.tsx):** Crear
`apps/web/src/shared/infrastructure/ui/Footer/Footer.tsx`.
Estructura mínima: elemento `<footer>` con `aria-label="Información del proyecto"`, un contenedor
`.footerContent`, y dos secciones:
  - `.dedication` — texto con "Hecho con 💜 para Cloe" + subtexto sobre práctica deliberada
  - `.copyright` — "© 2026 · Práctica deliberada"
Importar el CSS Module desde `./Footer.module.css`.

**Paso 7 (implementar Footer.module.css):** Crear
`apps/web/src/shared/infrastructure/ui/Footer/Footer.module.css`.
Patrones a replicar del Header:
  - `.footer`: `background-color: var(--mh-black)`, padding con `--spacing-3`/`--spacing-4`
  - `.footerContent`: `max-width: 1200px; margin: 0 auto; display: flex; flex-direction: column;
    align-items: center; gap: var(--spacing-2); text-align: center`
  - `.dedication`: `font-family: var(--font-story)` (Learning Curve), `color: var(--mh-pink)`,
    `font-size: var(--text-xl)`
  - `.copyright`: `color: var(--mh-gray)`, `font-size: var(--text-sm)`
  - `@media (min-width: 768px)`: padding extendido, gap mayor

**Paso 8 (modificar Layout.tsx):** Importar `Footer` en
`apps/web/src/shared/infrastructure/ui/Layout/Layout.tsx` y añadir `<Footer />` después del cierre
de `</main>` y antes del cierre del `</div>`. No se requieren cambios en `Layout.module.css` — el
patrón flex column con `flex: 1` en `.main` ya implementa sticky footer.

**Paso 9 (validate parcial — confirmar GREEN):** Ejecutar `npm run test --workspace=apps/web` para
confirmar que todos los tests (incluyendo los nuevos) pasan. Si hay fallos, corregir sin alterar el
contrato de tests.

---

## FASE 3 — REFACTOR + Validación Completa

**Paso 10 (re-evaluar):** Revisar que el Footer sea coherente visualmente con el Header:
  - Mismo `max-width: 1200px` y colores del design system
  - Ningún import de librerías de infraestructura (`axios`, `groq-sdk`, etc.) en el componente
  - No se han roto tests existentes de `CharacterCard`, `CharacterGrid`, `Header`, `Layout`, etc.

**Paso 11 (validate completa — HALT si falla):** Ejecutar `npm run validate` desde la raíz
(backend + frontend + linting). Si falla, reportar el log completo, detener y retornar a Reasoning.

---

## FASE 4 — Commit + PR

**Paso 12 (git commit):** Commit atómico con mensaje convencional:
`feat(web): add Footer component with Cloe dedication and deliberate practice motivation`

**Paso 13 (git push):** Publicar la rama:
`git push origin feat/footer-author-info`

**Paso 14 (PR):** Abrir Pull Request desde `feat/footer-author-info` → `gh-600` usando
`gh pr create`:
  - `--base gh-600`
  - `--title "feat(web): add Footer with author info and deliberate practice motivation"`
  - `--body` describiendo el cambio: componente Footer estático en shared/infrastructure/ui, con
    dedicatoria a Cloe y contexto de práctica deliberada, bajo ciclo TDD.

---

## Archivos relevantes

**A modificar:**
  - `apps/web/src/shared/infrastructure/ui/Layout/Layout.tsx` — añadir `<Footer />` tras `</main>`
  - `apps/web/src/shared/infrastructure/ui/Layout/Layout.module.css` — sin cambios necesarios

**Referencia estructural:**
  - `apps/web/src/shared/infrastructure/ui/Header/Header.tsx`
  - `apps/web/src/shared/infrastructure/ui/Header/Header.module.css`
  - `apps/web/src/styles/global.css` — variables CSS (--mh-black, --mh-pink, --font-story, etc.)

**Nuevos archivos a crear (en orden cronológico):**
  1. `apps/web/src/shared/tests/unit/Footer.test.tsx` — suite TDD (se crea ANTES del componente)
  2. `apps/web/src/shared/infrastructure/ui/Footer/Footer.tsx`
  3. `apps/web/src/shared/infrastructure/ui/Footer/Footer.module.css`

---

## Verificación

1. `npm run test --workspace=apps/web` tras Paso 5 → al menos 5 tests en RED (Footer no existe)
2. `npm run test --workspace=apps/web` tras Paso 9 → todos los tests en GREEN
3. `npm run validate` (root) tras Paso 11 → 0 errores, 0 fallos
4. `git log --oneline -5` → confirmar commit atómico con mensaje convencional en inglés
5. `gh pr view` → confirmar PR abierto con base `gh-600`
6. Inspección visual en `vite dev` (opcional): footer visible en todas las rutas

---

## Decisiones y alcance

- **Incluido:** Componente Footer estático, 5 tests TDD, integración en Layout, rama y PR.
- **Excluido:** Links externos, formularios de contacto, i18n, animaciones, cambios al Header o rutas.
- **Diseño:** Fondo `--mh-black` (simetría con Header); fuente Learning Curve (`--font-story`) para
  la dedicatoria — calidez personal sin romper el design system.
- **Sin cambios al backend:** El Footer es 100% frontend estático — ningún port, use case ni
  adapter necesario.
- **Invariante de capa:** Footer no importa nada de `domain/`, `application/`, ni SDKs externos —
  es presentación pura bajo `shared/infrastructure/ui/`.
