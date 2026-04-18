# Plan: Persistencia en Base de Datos para Characters

## Objetivo

Reemplazar `JsonRepository` con PostgreSQL como **fuente de verdad** para la persistencia de `Character` en el pipeline del backend.

El archivo JSON (`data/monsterHighCharacters.json`) sigue existiendo temporalmente — el frontend todavía lo lee desde `public/api/`. Ese acoplamiento desaparece en una fase futura cuando una API REST reemplace al JSON estático.

## Contexto del Roadmap

Este plan es la **Fase 1** de tres:

| Fase | Alcance | Estado |
|---|---|---|
| **1. Persistencia en BD** | El pipeline escribe en PostgreSQL. El JSON se mantiene tal cual para el frontend. | **Este plan** |
| 2. API REST | El backend expone endpoints. El frontend consume la API en vez del JSON estático. | Futuro |
| 3. Hexagonal en frontend | Separación dominio/infra en React. Tiene sentido cuando exista una dependencia externa real (HTTP). | Futuro |

---

## Estado Actual

| Aspecto | Detalle |
|---|---|
| Port de dominio | `CharacterRepository` con un único método: `saveAll(characters: Character[]): Promise<void>` |
| Adapter actual | `JsonRepository` escribe todos los personajes en un archivo JSON en disco |
| Caso de uso | `GenerateCharacterCatalogUseCase` recibe un `CharacterRepository` por inyección de constructor |
| Composition root | `index.ts` cablea `JsonRepository` directamente |
| Docker | No existe — no hay Dockerfile ni docker-compose.yml |
| Forma de los datos | `name`, `url`, `technicalInfo` (clave-valor), `sections` (JSON anidado), `image?`, `globalStory?` |

## Decisiones de Diseño

### PostgreSQL reemplaza a JSON — no es una alternativa

La versión anterior de este plan trataba JSON y Postgres como adapters intercambiables seleccionados por `STORAGE_TYPE`. Eso estaba mal:

- El archivo JSON cumple dos propósitos: persistencia **y** publicación (el frontend lo lee).
- La base de datos solo cumple uno: persistencia.
- No son intercambiables — tienen responsabilidades distintas.

En este plan:
- El caso de uso escribe en **PostgreSQL** vía `PostgresCharacterRepository`.
- `JsonRepository` **no se toca** como concepto. Se adapta al nuevo port pero mantiene su rol. Será reutilizado o reemplazado en la Fase 2 cuando la API REST elimine la necesidad del JSON estático.
- El composition root (`index.ts`) cablea `PostgresCharacterRepository` directamente. Sin toggle `STORAGE_TYPE`.

### Rediseño del port: `save` reemplaza a `saveAll`

El port actual define `saveAll(characters: Character[]): Promise<void>`. Esto estaba modelado según la limitación del JSON — reescribes el archivo entero cada vez.

Con una base de datos, persistir un registro a la vez es la operación natural. El port cambia a:

```typescript
export interface CharacterRepository {
  save(character: Character): Promise<void>;
}
```

Esto también simplifica el caso de uso — en vez de acumular un array y llamar a `saveAll` tras cada personaje, llama a `save` una vez por personaje enriquecido.

**Impacto en `JsonRepository`:** debe adaptarse a la nueva firma del port. `save` añade/sobreescribe un único personaje en el archivo JSON. Es un cambio de comportamiento en `JsonRepository`, pero está motivado por corregir el contrato de dominio, no por el trabajo de base de datos.

### Sin `findAll` / `findByName` todavía

Añadir métodos de lectura ahora violaría YAGNI — ningún consumidor los necesita hasta que exista la API REST (Fase 2).

### `sections` excluido del esquema de base de datos

`sections` es prosa cruda scrapeada de la wiki. Su único consumidor es el generador de historias por IA — una vez que `globalStory` se produce, `sections` ha cumplido su propósito. La base de datos almacena solo datos publicables.

`technicalInfo` se mantiene en el esquema porque el frontend lo muestra directamente (edad, mascota, amigos, etc.).

La entidad de dominio `Character` **no se modifica** — `sections` sigue siendo un campo de la clase. El adapter de Postgres simplemente no lo persiste. Esto evita cambios prematuros en el modelo; la cuestión de si dividir el modelo de dominio (`Character` vs `PublishedCharacter`) se pospone a la Fase 2 (ver [Notas de Fase 2](#notas-de-fase-2-no-accionables)).

### Elección de base de datos: PostgreSQL

- `technicalInfo` mapea naturalmente a una columna `JSONB`.
- Ecosistema de drivers bien soportado en Node.js.

### Librería cliente: pg (node-postgres)

- Ligera, sin overhead de ORM.
- Alineado con YAGNI — un ORM añadiría abstracción que no necesitamos ahora.
- El paquete `pg` tiene tipos TypeScript disponibles vía `@types/pg`.

### Diseño del esquema

Una única tabla `characters`:

```sql
CREATE TABLE IF NOT EXISTS characters (
  name           TEXT PRIMARY KEY,
  url            TEXT NOT NULL,
  technical_info JSONB NOT NULL DEFAULT '{}',
  image          TEXT,
  global_story   TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

- `name` como PK porque el dominio lo usa como identificador único (los nombres de personajes son únicos en la wiki de Monster High).
- `technical_info` almacenado como JSONB para preservar la estructura del dominio sin normalización forzada.
- **Sin columna `sections`** — la prosa cruda scrapeada es dato intermedio, no publicable.
- `created_at` / `updated_at` para observabilidad operacional básica.

### Estrategia de testing: `pg-mem` en vez de Docker

Los tests de `PostgresCharacterRepository` usan **`pg-mem`** — un emulador in-memory de PostgreSQL para Node.js. Soporta el subconjunto de SQL que necesitamos (INSERT, UPSERT, SELECT, JSONB) sin requerir Docker.

| Aspecto | `pg-mem` | Docker real |
|---|---|---|
| Cubre corrección SQL | Sí (subconjunto amplio) | Sí (completo) |
| Requiere contenedor corriendo | No | Sí |
| Velocidad | Rápida (~ms) | Lenta (~segundos) |
| Determinista | Sí | Sí |
| Complejidad en CI | Ninguna | Necesita setup de servicio |

Los smoke tests con Docker siguen siendo una opción para CI pero **no forman parte del ciclo TDD**.

---

## Infraestructura: Setup de Docker

### Archivos a crear

| Archivo | Propósito |
|---|---|
| `docker-compose.yml` (raíz del proyecto) | Contenedor PostgreSQL para **runtime** (no requerido para tests) |
| `.env.example` | Documentar todas las variables de entorno requeridas |

### docker-compose.yml

```yaml
services:
  postgres:
    image: postgres:17-alpine
    container_name: monster-high-db
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: monster
      POSTGRES_PASSWORD: highschool
      POSTGRES_DB: monster_high
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

### Variables de entorno (añadidas a config)

```
DATABASE_URL=postgresql://monster:highschool@localhost:5432/monster_high
```

---

## Ciclos de Implementación (TDD)

Cada ciclo sigue REASON → RED → GREEN → REFACTOR → RE-EVALUATE.

---

### Ciclo 0: Docker y setup del proyecto

**REASON:** Necesitamos las dependencias `pg` y `pg-mem` disponibles y un archivo Docker Compose para runtime antes de escribir código del adapter.

**Pasos:**
1. Crear `docker-compose.yml` en la raíz del proyecto.
2. Añadir `.env.example` documentando `DATABASE_URL`.
3. Instalar `pg`, `@types/pg` y `pg-mem` en `apps/backend`.
4. Añadir `database.url` a `config.ts`.

**Sin ciclo TDD aquí** — es scaffolding de infraestructura sin código de comportamiento.

---

### Ciclo 1: Cambiar port de `saveAll` a `save`

**REASON:** El port está modelado según la limitación del JSON (reescribir archivo entero). Con una base de datos, el contrato natural es persistir un personaje a la vez. Esto debe ocurrir antes de construir el adapter de Postgres para que implemente el contrato correcto desde el inicio.

**RED:** Actualizar los tests existentes de `JsonRepository` — cambiar llamadas de `saveAll([character])` a `save(character)`. Los tests fallan porque `save` no existe en el port ni en la implementación.

**GREEN:** Cambiar la interfaz `CharacterRepository` de `saveAll(characters: Character[]): Promise<void>` a `save(character: Character): Promise<void>`. Actualizar `JsonRepository` para implementar `save` — leer el archivo actual (si existe), añadir o reemplazar el personaje por nombre, y escribir el archivo de vuelta. Actualizar el caso de uso para llamar a `save(enriched)` en vez de acumular un array.

**REFACTOR:** Eliminar la acumulación del array `publishedCharacters` del caso de uso si se convierte en código muerto.

**RE-EVALUATE:** Todos los tests existentes pasan con el nuevo port. El comportamiento del pipeline no cambia — los personajes siguen persistiéndose uno a uno (ya lo hacían, solo que menos eficientemente).

---

### Ciclo 2: `PostgresCharacterRepository.save` — insert básico

**REASON:** Este es el entregable principal — persistir un único personaje en PostgreSQL.

**RED:** Escribir un test usando `pg-mem` para `PostgresCharacterRepository.save()`. El test crea un repositorio (respaldado por el PG in-memory), llama a `save` con un personaje de test, y luego consulta la BD in-memory para verificar que la fila existe. Falla porque la clase no existe.

**GREEN:** Crear `PostgresCharacterRepository` implementando `CharacterRepository`. En `save`, usar `INSERT ... ON CONFLICT (name) DO UPDATE` (upsert). Incluir `CREATE TABLE IF NOT EXISTS` para auto-creación del esquema. Inyectar el pool proporcionado por `pg-mem` en tests vía inyección de constructor.

**REFACTOR:** Extraer constantes SQL si mejora la claridad.

**RE-EVALUATE:** `save` inserta una fila correctamente en la BD in-memory.

---

### Ciclo 3: `save` preserva todos los campos persistidos

**REASON:** El Ciclo 2 puede usar datos de test mínimos. Este ciclo asegura que `technicalInfo` (JSONB), `image` y `globalStory` se almacenan correctamente. `sections` NO debe persistirse.

**RED:** Escribir un test que guarde un `Character` con todos los campos poblados (incluyendo `technicalInfo` anidado, `sections`, `image`, `globalStory`). Verificar vía consulta a BD que `technical_info` JSONB, `image` y `global_story` son correctos, y que no existe columna `sections`.

**GREEN:** Corregir el mapeo si es necesario — asegurar serialización JSONB y que todos los campos nullable están manejados.

**REFACTOR:** Extraer un helper de mapeo character-to-row si la lógica del insert se vuelve densa.

**RE-EVALUATE:** Los datos publicables completos del `Character` sobreviven la escritura. `sections` queda excluido.

---

### Ciclo 4: `save` hace upsert en conflicto

**REASON:** El pipeline puede reprocesar personajes. Un personaje que ya está en la BD debe actualizarse, no causar errores.

**RED:** Escribir un test que llame a `save` dos veces con el mismo nombre de personaje pero datos diferentes (ej. `globalStory` cambiado). Verificar que la BD contiene una fila con los datos actualizados y que `updated_at` cambió.

**GREEN:** Asegurar que la cláusula `ON CONFLICT (name) DO UPDATE SET ...` actualiza todas las columnas relevantes incluyendo `updated_at`.

**REFACTOR:** Limpiar el SQL del upsert para legibilidad.

**RE-EVALUATE:** Escrituras idempotentes confirmadas.

---

### Ciclo 5: Ciclo de vida de conexión — disconnect

**REASON:** El `pg.Pool` debe cerrarse después de que el pipeline termine para evitar procesos Node.js colgados.

**RED:** Escribir un test que cree un `PostgresCharacterRepository`, llame a `disconnect()`, y verifique que el pool ha terminado. Falla porque el método no existe.

**GREEN:** Añadir `disconnect(): Promise<void>` al adapter de Postgres (no al port — esto es específico de infraestructura).

**REFACTOR:** Evaluar si la creación del pool pertenece al constructor o debe inyectarse. Mantenerlo simple.

**RE-EVALUATE:** El pool es limpiable. Sin conexiones fugadas.

---

### Ciclo 6: Composition root — cablear adapter de PostgreSQL

**REASON:** El caso de uso debe usar el adapter de Postgres en el pipeline real.

**RED:** Escribir un test para el módulo de config que verifique que `config.database.url` lee de la variable de entorno `DATABASE_URL`.

**GREEN:** Añadir `database.url` a `config.ts`. Actualizar `index.ts` para crear `PostgresCharacterRepository` y cablearlo en el caso de uso. Llamar a `disconnect()` después de que el pipeline complete.

**REFACTOR:** Si el cableado en `index.ts` crece, extraer una función factory.

**RE-EVALUATE:** Ejecutar el pipeline escribe en PostgreSQL. El archivo JSON ya no se escribe desde el pipeline. El JSON existente en `data/` y `public/api/` permanece intacto para el frontend.

---

## Resumen de Cambios en Archivos

| Archivo | Acción | Descripción |
|---|---|---|
| `docker-compose.yml` | **Crear** | Definición del servicio PostgreSQL |
| `.env.example` | **Crear** | Documentar `DATABASE_URL` y variables existentes |
| `apps/backend/package.json` | **Editar** | Añadir `pg`, `@types/pg`, `pg-mem` |
| `apps/backend/src/config/config.ts` | **Editar** | Añadir `database.url` |
| `apps/backend/src/domain/CharacterRepository.ts` | **Editar** | Cambiar `saveAll` a `save` |
| `apps/backend/src/infrastructure/storage/JsonRepository.ts` | **Editar** | Implementar `save` (reemplaza `saveAll`) |
| `apps/backend/src/infrastructure/storage/PostgresCharacterRepository.ts` | **Crear** | Nuevo adapter implementando `CharacterRepository` con pg |
| `apps/backend/src/application/GenerateCharacterCatalogUseCase.ts` | **Editar** | Llamar `save` en vez de `saveAll` |
| `apps/backend/src/index.ts` | **Editar** | Cablear `PostgresCharacterRepository`, llamar `disconnect()` |
| `apps/backend/src/__tests__/infrastructure/storage/JsonRepository.test.ts` | **Editar** | Adaptar tests a firma `save` |
| `apps/backend/src/__tests__/infrastructure/storage/PostgresCharacterRepository.test.ts` | **Crear** | Tests usando `pg-mem` |

## Riesgos y Mitigaciones

| Riesgo | Mitigación |
|---|---|
| `pg-mem` no cubre un quirk específico de Postgres | Añadir smoke test opcional con Docker en CI. |
| Colisiones de nombre de personaje en PK | Los nombres se scrapean de la wiki donde son únicos. El upsert maneja duplicados de forma segura. |
| Fuga de pool de conexiones | Llamada explícita a `disconnect()` en composition root + configuración de timeout de pool idle. |
| El frontend pierde fuente de datos cuando el pipeline deja de escribir JSON | Los archivos JSON existentes permanecen en disco. El frontend no se ve afectado hasta que la Fase 2 reemplace JSON estático con API. |
| `JsonRepository.save` es más complejo que `saveAll` (read-modify-write) | Aceptable — es un adapter transicional. La Fase 2 puede eliminarlo por completo. |

## Fuera de Alcance

- `findAll` / `findByName` en el port — necesarios en Fase 2 (API REST), no ahora.
- Toggle `STORAGE_TYPE` — Postgres reemplaza a JSON; no son alternativas.
- Herramienta de migraciones de BD — no necesaria hasta que el esquema evolucione más allá de una tabla.
- Tuning de connection pooling — los defaults son suficientes para esta carga.
- Adopción de ORM — complejidad innecesaria para una tabla.
- Cambios en frontend — el frontend sigue leyendo JSON estático hasta la Fase 2.
- Rediseño del modelo de dominio (`Character` vs `PublishedCharacter`) — ver notas de Fase 2 abajo.

---

## Notas de Fase 2 (No Accionables)

Estas son consideraciones de diseño que surgieron durante la planificación de la Fase 1. **No son parte de esta implementación** — existen para informar el siguiente plan.

### Modelo de dominio: `sections` y el camino de lectura

En la Fase 1, la entidad `Character` mantiene `sections` como campo. El adapter de Postgres simplemente lo omite al escribir. Esto funciona porque la Fase 1 es solo escritura.

En la Fase 2, la API REST **leerá** personajes de la base de datos. En ese momento, las instancias de `Character` reconstruidas desde filas de BD no tendrán `sections`. Esto plantea una pregunta:

- **Opción A: Hacer `sections` opcional en `Character`.** Cambio mínimo. Riesgo: la entidad se vuelve ambigua — no puedes distinguir desde el tipo si sections nunca se scrapeó o simplemente no se cargó.
- **Opción B: Dividir en dos representaciones.** Un `ScrapedCharacter` (datos completos, usado durante el pipeline) y un `PublishedCharacter` (lo que la BD almacena y la API devuelve). Contratos de tipo más limpios, pero más tipos que mantener.
- **Opción C: Tratar `sections` como propiedad transitoria.** Mantenerlo en `Character` pero documentar que no se persiste y puede estar vacío tras reconstrucción desde BD. Pragmático, menos disruptivo.

**No se necesita decisión ahora.** Cuando la Fase 2 comience, el camino de lectura forzará el problema y la respuesta correcta será concreta, no especulativa.

### API REST: operaciones de lectura en el port

La Fase 2 extenderá `CharacterRepository` con métodos de lectura:

```typescript
export interface CharacterRepository {
  save(character: Character): Promise<void>;
  findAll(): Promise<Character[]>;
  findByName(name: string): Promise<Character | null>;
}
```

Tanto `PostgresCharacterRepository` como (si sigue vivo) `JsonRepository` los implementarían. Los tests de `findAll` / `findByName` diferidos de la Fase 1 se escribirán entonces.

### Guardado en dos pasos: scraping y después historia

El pipeline actual descarta un personaje completamente si la generación de historia falla. Una alternativa es persistir los datos scrapeados primero (`save` después del scraping, antes de la IA), y luego actualizar el registro con la historia. Esto cambia la semántica de fallo del pipeline — los datos parciales pasan a ser aceptables.

Esta es una **decisión de producto**, no técnica. Si se desea persistencia parcial, el caso de uso cambia para llamar a `save` dos veces (una después del scrape, otra después de la historia). El port y el adapter no cambian — `save` ya hace upsert.

### Ciclo de vida de `JsonRepository`

Una vez que la API REST exista y el frontend ya no lea JSON estático, `JsonRepository` no tiene consumidor. Puede ser:
- Eliminado por completo.
- Reconvertido como `CatalogExporter` detrás de un port diferente (si la exportación JSON sigue siendo útil para otros consumidores).
- Mantenido como fallback (no recomendado — añade coste de mantenimiento sin valor).
