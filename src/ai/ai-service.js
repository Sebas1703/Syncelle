/**
 * AI Service Module
 * Handles communication with Cloudflare Worker for scalable, streaming AI generation.
 * Security: The System Prompt is stored in the Worker, not here.
 */

class AIService {
  constructor() {
    // Volvemos a tu Worker para evitar Timeouts de Netlify (10s limit)
    this.API_BASE = "https://cf-worker-proxy.tiansebasp17-03.workers.dev/generate";
    this.SCHEMA_VERSION = 1;
  }

  /**
   * Generate structured content for a business idea
   * @param {string} businessIdea - User's business description
   * @returns {Promise<Object>} - Structured content object
   */
  async generateContent(businessIdea) {
    if (!businessIdea?.trim()) {
      throw new Error("La idea de negocio es requerida");
    }

    // Payload limpio: Solo enviamos la idea. El Worker pone el Prompt Maestro.
    const payload = {
      prompt: businessIdea.trim(), // El worker espera 'prompt' o 'businessIdea' según su lógica
      brand: "Syncelle Client", // Metadatos opcionales
      sections: [], // Dejamos que el Worker decida
      version: 2 // SOLICITUD DE NUEVO FORMATO DE DISEÑO (V2)
    };

    console.log("Iniciando generación con Streaming vía Cloudflare...");

    try {
      const response = await fetch(this.API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error ${response.status}: ${errorText}`);
      }

      // Manejo de Streaming para evitar Timeouts en conexiones lentas/largas
      if (response.body && typeof response.body.getReader === "function") {
        return await this._handleStreamingResponse(response.body);
      } else {
        // Fallback para respuestas no-streaming
        const data = await response.json();
        return this._parseAndValidateContent(JSON.stringify(data));
      }

    } catch (error) {
      console.error("AIService Error:", error);
      throw new Error(`Fallo en la generación: ${error.message}`);
    }
  }

  /**
   * Process the Server-Sent Events (SSE) stream from Cloudflare
   * @private
   */
  async _handleStreamingResponse(body) {
    const reader = body.getReader();
    const decoder = new TextDecoder();
    let accumulatedText = "";
    let buffer = ""; // Buffer para manejar chunks partidos
    let done = false;

    const liveContainer = document.getElementById("loading");

    while (!done) {
      const { value, done: streamDone } = await reader.read();
      done = streamDone;
      
      if (value) {
        // Añadimos lo nuevo al buffer existente
        buffer += decoder.decode(value, { stream: true });
        
        // Procesamos línea por línea
        const lines = buffer.split('\n');
        
        // IMPORTANTE: La última línea puede estar incompleta, la guardamos en buffer para el siguiente ciclo
        buffer = lines.pop() || ""; 

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine || trimmedLine === 'data: [DONE]') continue;
          
          if (trimmedLine.startsWith('data: ')) {
            try {
              const jsonStr = trimmedLine.slice(6);
              const data = JSON.parse(jsonStr);
              const contentFragment = data.choices?.[0]?.delta?.content || "";
              
              if (contentFragment) {
                accumulatedText += contentFragment;
                if (liveContainer) {
                   liveContainer.textContent = `Diseñando... ${accumulatedText.length} bytes`;
                }
              }
            } catch (e) {
              // Si falla aquí, es probable que sea un JSON raro de OpenAI, pero ya no por corte de string
              console.warn('Error parseando evento SSE:', e);
            }
          }
        }
      }
    }
    
    // Procesar remanente si queda algo (raro en SSE bien formado pero posible)
    if (buffer.trim().startsWith('data: ')) {
        try {
            const jsonStr = buffer.trim().slice(6);
            const data = JSON.parse(jsonStr);
            accumulatedText += data.choices?.[0]?.delta?.content || "";
        } catch (e) {}
    }

    console.log("Stream completado. JSON Final:", accumulatedText);
    return this._parseAndValidateContent(accumulatedText);
  }

  /**
   * Helper to extract clean JSON from potentially messy stream output
   * @private
   */
  _extractJsonFromStream(text) {
    // Si el texto viene con formato "data: ", intentamos limpiarlo
    // Pero GPT a veces manda el JSON directo troceado.
    // Estrategia: Buscar el primer '{' y el último '}'
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');

    if (firstBrace !== -1 && lastBrace !== -1) {
      return text.substring(firstBrace, lastBrace + 1);
    }
    return text; // Intentamos parsear tal cual si no encontramos estructura
  }

  /**
   * Validate the AI response schema
   * @private
   */
  _parseAndValidateContent(jsonString) {
    let parsed;
    try {
      // Limpieza agresiva de Markdown (```json ... ```)
      let cleanString = jsonString.trim();
      
      // Si empieza con ```json, quitarlo
      if (cleanString.startsWith('```json')) {
        cleanString = cleanString.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanString.startsWith('```')) {
         cleanString = cleanString.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }

      parsed = JSON.parse(cleanString);
    } catch (error) {
      console.error("JSON Parse Error. Recibido:", jsonString.substring(0, 100) + "...");
      throw new Error("La IA generó una respuesta incompleta. Por favor intenta de nuevo.");
    }

    // Validación básica de integridad
    // V2 usa 'meta.version' == 2.0; V1 usa 'titulo' en raiz
    if (parsed.meta && (parsed.meta.version === "2.0" || parsed.meta.version === 2)) {
       return parsed; // Es un JSON V2 válido
    }

    if (!parsed.titulo || !Array.isArray(parsed.menuItems)) {
      throw new Error("La estructura generada no es compatible (faltan campos clave).");
    }

    // Asegurar versión del esquema
    parsed.schemaVersion = parsed.schemaVersion || this.SCHEMA_VERSION;

    return parsed;
  }
}

// Export for use in other modules
window.AIService = AIService;
