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

El proyecto cuenta con un script principal `index.js` que orquesta todo el proceso.

Para ejecutar el scraper completo junto con la generación de resúmenes:

```bash
node index.js
```

### Comportamiento del Script
El script `ejecutarScrapingCompletoConResumenIA` realizará los siguientes pasos:
1. Obtendrá la lista de personajes.
2. Iterará sobre cada uno para extraer sus detalles.
3. Enviará la información a la IA para generar un resumen narrativo.
4. Guardará el progreso incrementalmente en un archivo `personajes_infantil.json` (o similar, según configuración).

## 👨‍💻 Desarrollo, TypeScript y Tests

El proyecto ha sido migrado para soportar **TypeScript**, lo que permite un desarrollo más seguro y escalable.

### Ejecución de archivos TypeScript
No es necesario compilar manualmente para desarrollo. Puedes usar `ts-node` para ejecutar scripts `.ts` directamente:

```bash
# Ejecutar un script de prueba
npx ts-node test-setup.ts
```

### Compilación
Si deseas generar los archivos JavaScript para producción:

```bash
npx tsc
```
Los archivos compilados se generarán en la carpeta `dist/`.

### Testing con Jest
El proyecto utiliza **Jest** para pruebas unitarias. La configuración soporta tanto archivos Javascript como TypeScript.

Para ejecutar la batería de tests:

```bash
npm test
```

### Notas de Configuración
- **tsconfig.json**: Configurado en modo `strict` para asegurar la calidad del código, con compatibilidad para módulos `commonjs` y `es2020`.
- **jest.config.js**: Configurado con `ts-jest` para procesar archivos TypeScript automáticamente.


## 📂 Estructura del Proyecto

- `index.js`: Lógica principal del scraper. Contiene funciones para extraer listados, detalles y orquestar el flujo de trabajo.
- `ia-adaptor.js`: Módulo encargado de la comunicación con la API de Groq. Contiene el prompt de sistema para adaptar el texto a un público infantil.
- `monster_high.json` / `personajes_infantil.json`: Archivos de salida generados con la data scrapeada.

## 📄 Formato de Salida

El JSON resultante tendrá una estructura similar a esta para cada personaje:

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
    "biografía": { ... },
    "relaciones": { ... }
  }
}
```

## ⚠️ Nota Legal

Este proyecto es con fines educativos y de aprendizaje. El contenido extraído pertenece a sus respectivos autores y a la comunidad de Fandom.
