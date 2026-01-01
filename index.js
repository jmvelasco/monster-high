const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs").promises;
const { generarResumenGlobal } = require('./ia-adaptor');

// Función auxiliar para esperar entre peticiones
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function extraerPersonajes() {
  const urlPrincipal =
    "https://monsterhigh.fandom.com/es/wiki/Categoría:Personajes";
  const baseDomain = "https://monsterhigh.fandom.com";

  try {
    const { data } = await axios.get(urlPrincipal);
    const $ = cheerio.load(data);
    const personajes = [];

    $(".category-page__member-link").each((index, element) => {
      const nombre = $(element).text().trim();
      const path = $(element).attr("href");

      // Evitamos duplicados o elementos vacíos si los hubiera
      if (nombre && path) {
        personajes.push({
          nombre: nombre,
          url: `${baseDomain}${path}`,
        });
      }
    });

    // console.log(JSON.stringify(personajes, null, 2));
    return personajes;
  } catch (error) {
    console.error("Error al extraer los datos:", error.message);
  }
}

async function extraerFichaPersonaje(url) {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const detalles = {};

    // 1. Extraer imagen de perfil
    detalles.imagen = $(".pi-image-thumbnail").attr("src");

    // 2. Extraer datos de la Infobox (Ficha técnica)
    // Buscamos cada item que tenga un label y un value
    $(".pi-item.pi-data").each((i, el) => {
      const label = $(el)
        .find(".pi-data-label")
        .text()
        .trim()
        .replace(/:/g, "");
      const value = $(el).find(".pi-data-value").text().trim();

      if (label && value) {
        // Normalizamos el nombre de la propiedad (ej: "Comida favorita" -> "comida_favorita")
        const key = label.toLowerCase().replace(/\s+/g, "_");
        detalles[key] = value;
      }
    });

    return detalles;
  } catch (error) {
    console.error(`Error en URL ${url}:`, error.message);
    return null;
  }
}

async function extraerDetallesPersonaje(url) {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const resultado = {
      nombre: $(".mw-page-title-main").text().trim(),
      url: url,
      info_basica: {},
      secciones: {},
    };

    // 1. Infobox (Ficha Técnica)
    $(".pi-item.pi-data").each((i, el) => {
      const label = $(el)
        .find(".pi-data-label")
        .text()
        .trim()
        .replace(/:/g, "");
      const value = $(el).find(".pi-data-value").text().trim();
      if (label) {
        const key = label.toLowerCase().replace(/\s+/g, "_");
        resultado.info_basica[key] = value;
      }
    });

    // 2. Extracción Dinámica basada en los H2
    // Buscamos todos los H2 que tienen un ID (las secciones reales)
    $("h2").each((i, elH2) => {
      const spanId = $(elH2).find("span.mw-headline").attr("id");
      if (!spanId || ["Gallery", "Galería", "Referencias"].includes(spanId))
        return;

      const nombreH2 = spanId.toLowerCase().replace(/\s+/g, "_");
      resultado.secciones[nombreH2] = {};

      let cursor = $(elH2).next();

      // Recorremos los hermanos del H2 hasta el siguiente H2
      while (cursor.length > 0 && cursor[0].name !== "h2") {
        // CASO A: Encontramos un H3 (Subsección)
        if (cursor[0].name === "h3") {
          const nombreH3 = cursor
            .text()
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "_");
          const parrafos = [];

          let posibleP = cursor.next();
          // Recogemos párrafos hasta el siguiente encabezado (H3 o H2)
          while (
            posibleP.length > 0 &&
            !["h2", "h3"].includes(posibleP[0].name)
          ) {
            if (posibleP[0].name === "p") {
              const texto = posibleP
                .text()
                .trim()
                .replace(/\[\d+\]/g, "");
              if (texto) parrafos.push(texto);
            }
            posibleP = posibleP.next();
          }

          if (parrafos.length > 0) {
            resultado.secciones[nombreH2][nombreH3] = parrafos;
          }
        }

        // CASO B: Párrafos que cuelgan directamente del H2 (sin H3)
        else if (cursor[0].name === "p") {
          const textoDirecto = cursor
            .text()
            .trim()
            .replace(/\[\d+\]/g, "");
          if (textoDirecto) {
            // Si no hay subsección, lo metemos en una clave genérica "general" o similar
            if (!resultado.secciones[nombreH2]._general) {
              resultado.secciones[nombreH2]._general = [];
            }
            resultado.secciones[nombreH2]._general.push(textoDirecto);
          }
        }

        cursor = cursor.next();
      }

      // Limpieza: si la sección quedó vacía, la eliminamos
      if (Object.keys(resultado.secciones[nombreH2]).length === 0) {
        delete resultado.secciones[nombreH2];
      }
    });

    return resultado;
  } catch (error) {
    console.error(`Error en URL ${url}:`, error.message);
    return null;
  }
}

async function ejecutarScrapingCompleto() {
  try {
    const listaPersonajes = await extraerPersonajes();
    console.log(
      `🚀 Se han encontrado ${listaPersonajes.length} personajes. Iniciando extracción detallada...`
    );

    const resultadosFinales = [];

    for (const [index, personaje] of listaPersonajes.entries()) {
      try {
        console.log(
          `[${index + 1}/${listaPersonajes.length}] Extrayendo: ${
            personaje.nombre
          }...`
        );

        // Obtenemos los detalles usando la función de extracción universal
        const dataPersonaje = await extraerDetallesPersonaje(personaje.url);

        if (dataPersonaje) {
          // Construimos el objeto final manteniendo la jerarquía
          resultadosFinales.push({
            nombre: dataPersonaje.nombre,
            url: dataPersonaje.url,
            imagen: dataPersonaje.imagen,
            info_tecnica: dataPersonaje.info_basica,
            // Guardamos todas las secciones detectadas (personaje, relaciones, habilidades, etc.)
            secciones: dataPersonaje.secciones,
          });
        }
      } catch (err) {
        console.error(
          `❌ Error procesando a ${personaje.nombre}:`,
          err.message
        );
      }

      // Respetar el límite del servidor (500ms es prudente)
      await sleep(500);
    }

    // Guardar en un archivo JSON estructurado
    const nombreArchivo = "personajes_monster_high.json";
    await fs.writeFile(
      nombreArchivo,
      JSON.stringify(resultadosFinales, null, 2),
      "utf-8"
    );

    console.log(
      `✅ ¡Proceso finalizado! Se ha generado el archivo: ${nombreArchivo}`
    );
    return resultadosFinales;
  } catch (error) {
    console.error("🔴 Error crítico en el flujo principal:", error.message);
  }
}

async function ejecutarScrapingCompletoConProcesamientoIA() {
  try {
    const listaPersonajes = await extraerPersonajes();
    const resultadosFinales = [];
    const ARCHIVO_SALIDA = "monster_high.json";

    console.log(
      `🚀 Iniciando procesamiento de ${listaPersonajes.length} personajes...`
    );

    for (const [index, personaje] of listaPersonajes.entries()) {
      console.log(
        `\n[${index + 1}/${listaPersonajes.length}] Procesando a: ${
          personaje.nombre
        }`
      );

      const data = await extraerDetallesPersonaje(personaje.url);
      if (!data) {
        console.log(
          `⚠️ No se pudo obtener datos de ${personaje.nombre}, saltando...`
        );
        continue;
      }

      const seccionesAdaptadas = {};

      // Recorremos las secciones (H2) y subsecciones (H3)
      for (const [idH2, subsecciones] of Object.entries(data.secciones)) {
        seccionesAdaptadas[idH2] = {};

        for (const [idH3, parrafos] of Object.entries(subsecciones)) {
          console.log(`   ✨ Resumiendo subsección: ${idH3}...`);

          await new Promise((r) => setTimeout(r, 2000));

          try {
            const resumen = await resumirParaNinos(data.nombre, idH3, parrafos);
            seccionesAdaptadas[idH2][idH3] = {
              resumen_infantil: resumen,
              original: parrafos,
            };
          } catch (err) {
            console.log(
              "Error al resumir con IA, guardando texto original únicamente.",
              err.message
            );
          }
        }
      }

      // Agregamos el personaje procesado a la lista
      resultadosFinales.push({
        nombre: data.nombre,
        url: data.url,
        imagen: data.imagen,
        info_tecnica: data.info_basica,
        secciones: seccionesAdaptadas,
      });

      // Guardado incremental tras cada personaje procesado
      await fs.writeFile(
        ARCHIVO_SALIDA,
        JSON.stringify(resultadosFinales, null, 2),
        "utf-8"
      );
      console.log(`💾 Progreso guardado para ${personaje.nombre}`);
    }

    console.log(`\n✅ ¡Proceso completado con éxito! Revisa ${ARCHIVO_SALIDA}`);
  } catch (error) {
    console.error("🔴 Error crítico en el flujo principal:", error);
  }
}

// ejecutarScrapingCompleto();
// ejecutarScrapingCompletoConProcesamientoIA();


async function ejecutarScrapingCompletoConResumenIA() {
  try {
    const listaPersonajes = await extraerPersonajes();
    const resultadosFinales = [];
    const ARCHIVO_SALIDA = "personajes_infantil.json";

    console.log(
      `🚀 Iniciando scraping y resumen global para ${listaPersonajes.length} personajes...`
    );

    for (const [index, personaje] of listaPersonajes.entries()) {
      console.log(
        `\n[${index + 1}/${listaPersonajes.length}] Procesando: ${
          personaje.nombre
        }`
      );

      const data = await extraerDetallesPersonaje(personaje.url);
      if (!data) continue;

      console.log(`   ✨ Generando resumen único para Cloe...`);

      // Llamamos a la IA UNA SOLA VEZ con todas las secciones acumuladas
      const resumenUnico = await generarResumenGlobal(
        data.nombre,
        data.secciones
      );

      // Creamos la estructura que pediste
      const personajeProcesado = {
        nombre: data.nombre,
        url: data.url,
        imagen: data.imagen,
        info_tecnica: data.info_basica,
        resumen_global: resumenUnico, // Nuevo campo con el resumen enlazado
        secciones: data.secciones, // Mantenemos los originales intactos
      };

      resultadosFinales.push(personajeProcesado);

      // Guardado incremental
      await fs.writeFile(
        ARCHIVO_SALIDA,
        JSON.stringify(resultadosFinales, null, 2),
        "utf-8"
      );

      console.log(`✅ ${data.nombre} completado.`);

      // Pausa de cortesía para Groq (aunque sea rápido, mejor no saturar)
      await new Promise((r) => setTimeout(r, 3000));
    }

    console.log(`\n🎉 ¡Archivo ${ARCHIVO_SALIDA} generado con éxito!`);
  } catch (error) {
    console.error("🔴 Error crítico en el orquestador:", error);
  }
}

ejecutarScrapingCompletoConResumenIA();
