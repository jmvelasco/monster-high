# Monster High API & Scraper

Este proyecto es una herramienta de extracción de datos (web scraper) diseñada para obtener información detallada sobre los personajes de *Monster High* desde su Wiki en Fandom. Además, integra inteligencia artificial (vía Groq/Llama 3) para generar resúmenes personalizados e infantiles de cada personaje.

## 🚀 Funcionalidades

- **Scraping de Personajes**: Extrae automáticamente la lista completa de personajes desde la Wiki de Monster High.
- **Extracción de Detalles**: Obtiene información técnica (infobox), imágenes y secciones detalladas (biografía, relaciones, personalidad, etc.) de cada personaje.
- **Procesamiento con IA**: Utiliza la API de Groq (modelo `llama-3.1-8b-instant`) para generar cuentos/resúmenes adaptados para una niña de 6 años (personalizado para "Cloe").
- **Persistencia de Datos**: Guarda toda la información procesada en archivos JSON estructurados localmente.

## 🛠️ Tecnologías

- **Node.js**: Entorno de ejecución principal.
- **Axios**: Cliente HTTP para realizar las peticiones a la Wiki.
- **Cheerio**: Librería para parsear el HTML y extraer la información necesaria.
- **Groq SDK**: Cliente para conectar con modelos de lenguaje LLM (Llama 3).
- **Dotenv**: Gestión de variables de entorno.
- **TypeScript**: Superset de JavaScript que añade tipos estáticos para un código más robusto.
- **Jest**: Framework de testing para pruebas unitarias.

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:
- [Node.js](https://nodejs.org/) (v14 o superior recomendado)
- Una API Key de [Groq](https://groq.com/) para las funcionalidades de IA.

## 🔧 Instalación

1. Clona este repositorio o descarga el código.
2. Abre una terminal en la carpeta del proyecto.
3. Instala las dependencias:

```bash
npm install
```

## ⚙️ Configuración

Necesitas configurar tus credenciales para el servicio de IA.
1. Crea un archivo `.env` en la raíz del proyecto (puedes basarte en el ejemplo si existe).
2. Agrega tu clave de API de Groq:

```env
GROQ_API_KEY=tu_clave_api_aqui
```

## 🏃‍♂️ Uso

El proyecto utiliza **TypeScript** y se puede ejecutar directamente usando `ts-node` o mediante scripts de `npm`.

### Ejecutar el Scraper
Para ejecutar el pipeline completo (scraping + IA + guardado):

```bash
npm start
```

### Comportamiento del Pipeline
El orquestador en `src/index.ts` realiza los siguientes pasos de forma automatizada:
1. **Escaneo**: Obtiene la lista completa de personajes.
2. **Extracción**: Itera sobre cada personaje para obtener sus detalles técnicos y secciones.
3. **Magia con IA**: Envía la información al `AIService` para generar un cuento personalizado para Cloe.
4. **Guardado Incremental**: Los resultados se guardan en tiempo real en `data/monster_high_features.json` usando el `JsonRepository`.

## 📂 Estructura del Proyecto (Arquitectura Modular)

El código ha sido refactorizado siguiendo principios **SOLID** y **DIP** (Inversión de Dependencias):

- `src/index.ts`: Punto de entrada y orquestador del pipeline.
- `src/config/`: Configuración centralizada de URLs, API Keys y parámetros de IA.
- `src/domain/`: Definición de interfaces y modelos de datos (Contratos).
- `src/services/`: Capa de servicios desacoplados.
  - `scraper/WikiScraper.ts`: Lógica de extracción HTML.
  - `ai/AIService.ts`: Adaptador para la API de Groq (Llama 3).
  - `storage/JsonRepository.ts`: Persistencia de datos en sistema de archivos.
- `src/utils/`: Utilidades generales (ej. sleep para rate limiting).

## 🧪 Testing y Calidad (TDD)

Este proyecto sigue una metodología de **Extreme Programming (XP)** y **Test-Driven Development (TDD)**. 

### Ejecutar Pruebas
Todos los servicios core están cubiertos por tests unitarios que garantizan su correcto funcionamiento sin depender de servicios externos (No Mocks policy, usando Fakes).

```bash
npm test
```

### Cobertura
Se mantiene una cobertura superior al 85% en la lógica de negocio. Los tests validan:
- Correcta extracción de datos HTML (WikiScraper).
- Manejo de errores y reintentos por rate limit (AIService).
- Gestión de archivos y directorios (JsonRepository).

## 📄 Formato de Salida

Los datos se guardan en `data/monster_high_features.json` con el siguiente formato:

```json
{
  "nombre": "Draculaura",
  "url": "...",
  "imagen": "...",
  "info_tecnica": {
    "edad": "1600",
    "padres": "El Conde Drácula"
  },
  "resumen_global": "¡Hola Cloe! Draculaura es una vampiresa muy dulce...",
  "secciones": {
    "personalidad": {
      "carácter": ["Es muy dulce y amigable."]
    }
  }
}
```

## ⚠️ Nota Legal

Este proyecto es con fines educativos y de aprendizaje. El contenido extraído pertenece a sus respectivos autores y a la comunidad de Fandom.

---

## 🎓 El Viaje de Refactorización: De Monolito a Modular (Caso de Estudio)

Este repositorio no solo es una herramienta funcional, sino también un ejemplo práctico de cómo aplicar ingeniería de software para transformar código "Legacy" en una arquitectura moderna y mantenible.

### 🏛️ 1. El Punto de Partida: El Monolito
Originalmente, el proyecto era un archivo único en JavaScript. Aunque funcionaba, presentaba tres grandes retos:
*   **Acoplamiento Fuerte**: La lógica de red estaba mezclada con el parseo HTML y la lógica de negocio.
*   **Imposible de Testear**: Para probar cualquier cambio, era necesario realizar peticiones reales a Internet.
*   **Fragilidad**: Modificar el scraper podía romper accidentalmente la forma en que se guardaban los datos.

### 🏗️ 2. La Transformación: Principios Aplicados

Para resolver estos problemas, aplicamos los siguientes pilares de diseño:

#### **SOLID & Clean Code**
*   **S (Responsabilidad Única)**: Cada clase tiene una misión clara (Scraper, AI, Storage).
*   **D (Inversión de Dependencias)**: Los servicios ya no crean sus herramientas (como Axios), sino que las "reciben" por el constructor. Esto nos permitió inyectar "Fakes" durante los tests para simular la red sin internet real.

#### **TDD (Test-Driven Development) & XP**
Seguimos una metodología de **Extreme Programming**:
1.  **RED**: Escribimos el test que define el comportamiento deseado (y falla).
2.  **GREEN**: Escribimos el código mínimo para que el test pase.
3.  **REFACTOR**: Limpiamos y optimizamos el código con la seguridad de que el test nos protege.

#### **No Mocks Policy**
En lugar de usar mocks técnicos complejos que se acoplan a la implementación, usamos **Objects Fakes** reales. Por ejemplo, un `FakeHttpClient` que se comporta como uno de verdad pero devuelve HTML estático. Esto hace que nuestros tests sean más robustos y documenten mejor el negocio.

### 🔄 3. Comparativa Educativa

| Característica | Antes (Legacy JS) | Ahora (Modular TS) |
| :--- | :--- | :--- |
| **Confianza** | Manual ("Ojalá no se rompa") | Alta (Tests automáticos cubren ~90% de la lógica) |
| **Legibilidad** | Un solo archivo denso | Estructura de carpetas por responsabilidades |
| **Evolución** | Arriesgada | Segura mediante contratos definidos (Interfaces) |

Este proceso demuestra que **invertir en arquitectura no es perder tiempo, sino ganar velocidad y calidad** a largo plazo.
