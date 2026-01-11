# Monster High API & Scraper

Este proyecto es una herramienta de extracción de datos (web scraper) diseñada para obtener información detallada sobre los personajes de _Monster High_ desde su Wiki en Fandom, integrando IA para generar cuentos personalizados.

Más que una herramienta funcional, este repositorio es un **material educativo vivo** que muestra la evolución de una aplicación: desde un script monolítico hasta una **Arquitectura Hexagonal** robusta, testable y mantenible.

---

## 🚀 Funcionalidades

- **Scraping de Personajes**: Extracción automatizada desde Fandom Wiki.
- **Extracción de Detalles**: Obtención de infobox, imágenes y secciones biográficas.
- **Procesamiento con IA**: Generación de cuentos adaptados para una niña de 6 años mediante Groq (Llama 3).
- **Persistencia de Datos**: Guardado incremental en archivos JSON estructurados.

---

## 🛠️ Tecnologías y Estándares

- **TypeScript**: Tipado estático para un desarrollo seguro.
- **Node.js (v16+)**: Uso de estándares modernos como `node:timers/promises`.
- **Axios & Cheerio**: Para la comunicación HTTP y parseo de HTML.
- **Groq SDK**: Integración con LLMs de última generación.
- **Jest**: Framework de testing enfocado en la fiabilidad del negocio.

---

## 🏗️ Arquitectura: El Corazón del Proyecto

El proyecto utiliza **Arquitectura Hexagonal** (Puertos y Adaptadores) para asegurar que la lógica de negocio esté aislada de las decisiones tecnológicas externas.

### 1. Capa de Dominio (`src/domain`)

Define los **Puertos** (Interfaces) y las entidades del negocio. Es el código más puro:

- `Character.ts`: Entidad rica con comportamiento propio.
- **Puertos**: `CharacterScraper` (obtención de datos), `CharacterAI` (historias mágicas) y `CharacterRepository` (almacenamiento). Sin dependencias externas.

### 2. Capa de Aplicación (`src/application`)

Contiene los **Casos de Uso** que orquestan el negocio:

- `ScrapeAndProcessCharactersUseCase.ts`: Coordina el flujo de scraping, enriquecimiento con IA y persistencia, utilizando únicamente las interfaces del dominio (Inversión de Dependencias).

### 3. Capa de Infraestructura (`src/infrastructure`)

Contiene los **Adaptadores** o implementaciones concretas:

- **Scraper**: `infrastructure/scraper/WikiScraper.ts` (Axios/Cheerio).
- **AI**: `infrastructure/ai/AIService.ts` (Groq SDK).
- **Storage**: `infrastructure/storage/JsonRepository.ts` (FileSystem).
  Aquí es donde reside el detalle tecnológico que puede cambiar sin afectar al resto.

---

## 🚀 Bootstrap y Orquestación

El punto de entrada (`src/index.ts`) actúa como el **Composition Root**:

1. Instancia las implementaciones concretas de Infraestructura.
2. Las inyecta en el Caso de Uso de la Aplicación.
3. Ejecuta el proceso.

---

## 🧪 Calidad y Testing (TDD)

Aplicamos **Extreme Programming (XP)** y **Test-Driven Development (TDD)** para garantizar que cada cambio sea seguro.

- **No Mocks Policy**: Preferimos el uso de **Fakes** (implementaciones ligeras pero reales de infraestructura) sobre mocks técnicos. Esto hace que los tests sean más legibles y menos frágiles.
- **Ejecución**: `npm test`

---

## 🎓 El Viaje de Refactorización: Evolución Educativa

Este proyecto ha pasado por varias etapas clave de diseño, cada una con un aprendizaje específico:

### 1. Del Monolito a la Modularidad

Comenzamos con un script único en JavaScript. El primer gran paso fue separar responsabilidades en archivos y migrar a TypeScript para ganar seguridad.

### 2. De Servicios a Arquitectura Hexagonal

Aunque modular, el código seguía "acoplado" (los servicios sabían demasiado entre sí). Introdujimos **Inversión de Dependencias** e interfaces de dominio. Ahora, si queremos cambiar el scraper por una API oficial, solo cambiamos el adaptador de infraestructura; el caso de uso no se entera.

### 3. Filosofía del "No Utils" (KISS & YAGNI)

Eliminamos la carpeta `src/utils` (el típico "cajón de sastre"). Siguiendo el principio **YAGNI** (You Aren't Gonna Need It), descubrimos que muchas utilidades personalizadas (como `sleep.ts`) podían reemplazarse por estándares nativos (`node:timers/promises`), simplificando el sistema (**KISS**).

---

## ⚙️ Configuración y Uso

### Instalación

```bash
npm install
```

### Configuración `.env`

```env
GROQ_API_KEY=tu_clave_aqui
```

### Ejecución

```bash
npm start
```

---

## 🤖 Reglas del Proyecto (Agentes IA)

Para colaborar con asistentes de IA siguiendo estos estándares, consulta las reglas en `.agent/rules/`. Este proyecto define guías estrictas de TDD, XP y estándares de codificación que deben ser respetados por cualquier agente configurado en el IDE.

---

_Este proyecto es para fines educativos. Los datos pertenecen a la comunidad de Fandom._
