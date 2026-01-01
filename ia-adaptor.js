require('dotenv').config();
const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * Genera un resumen único y coherente basado en todas las secciones del personaje.
 */
async function generarResumenGlobal(nombrePersonaje, todasLasSecciones) {
  // Construimos un mega-texto etiquetando las secciones para que la IA entienda el contexto
  let textoParaIA = "";
  
  for (const [seccionPadre, subsecciones] of Object.entries(todasLasSecciones)) {
    for (const [titulo, parrafos] of Object.entries(subsecciones)) {
      textoParaIA += `\n--- INFORMACIÓN SOBRE ${seccionPadre.toUpperCase()} (${titulo.toUpperCase()}): ---\n`;
      textoParaIA += parrafos.join(" ");
    }
  }

  if (!textoParaIA.trim()) return "¡Un secreto mágico por descubrir!";

  const prompt = `
    Actúa como una cuentacuentos infantil experta. 
    Tu misión es contarle a una niña de 6 años llamada Cloe quién es el personaje ${nombrePersonaje} de Monster High.
    
    INSTRUCCIONES:
    1. Usa toda la información proporcionada para crear un único relato coherente.
    2. Usa un lenguaje muy sencillo y dulce. Saluda a Cloe de forma cariñosa.
    3. No dividas la respuesta por secciones, haz una historia fluida.
    4. Enfócate en su apariencia, su personalidad, su familia y sus amigos.
    5. Máximo 5 o 6 frases en total.
    6. Evita palabras técnicas o asustadizas.
    
    DATOS DEL PERSONAJE:
    "${textoParaIA}"
    
    RESPUESTA DIRECTA PARA CLOE:`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.1-8b-instant",
      temperature: 0.6, // Bajamos un poco la temperatura para que sea más estable
      max_tokens: 400,
    });

    return chatCompletion.choices[0]?.message?.content?.trim() || "¡Un secreto mágico!";
  } catch (error) {
    if (error.status === 429) {
        console.log("⏳ [GROQ] Límite alcanzado, esperando 15s...");
        await new Promise(r => setTimeout(r, 15000));
        return generarResumenGlobal(nombrePersonaje, todasLasSecciones);
    }
    console.error(`❌ Error en Resumen Global:`, error.message);
    return "¡Este personaje tiene una historia mágica que Cloe descubrirá muy pronto!";
  }
}

module.exports = { generarResumenGlobal };