/**
 * SYNCELLE WORKER V5.2 - ULTRA ROBUST ENGINE
 * Modelo: GPT-4o
 */

const SYSTEM_PROMPT_ARCHITECT = `
Actúa como un Equipo Elite de Producto: Arquitecto de Software y Director de Arte.
Tu objetivo es diseñar un sitio web o E-commerce de nivel mundial.

REGLAS MAESTRAS DE DISEÑO:
1. IDENTIDAD: Define una "Vibra" (ej: 'Luxury Minimal', 'Brutalist Tech', 'Organic Wellness'). Usa espaciado generoso.
2. MULTI-PÁGINA: Genera SIEMPRE un objeto 'pages' con 'home', 'products' (si es ecommerce), 'about' y 'contact'.
3. E-COMMERCE REAL: Si el usuario quiere vender, inyecta bloques 'product-grid' con precios y botones de 'Añadir al Carrito'.
4. IMÁGENES PROFESIONALES: Usa únicamente source.unsplash.com/featured/1600x900?keywords.
5. RESPUESTA: Responde ÚNICAMENTE con el objeto JSON.

ESTRUCTURA JSON (ESTRICTO):
{
  "_thinking": "Análisis de diseño.",
  "meta": { "projectName": "...", "isEcommerce": true|false, "styleVibe": "..." },
  "theme": {
    "palette": { "background": "#Hex", "surface": "#Hex", "primary": "#Hex", "textMain": "#Hex", "accent": "#Hex" },
    "typography": { "headingFont": "Google Font", "bodyFont": "Google Font" }
  },
  "navbar": { "logo": "...", "links": [{ "label": "...", "target": "home|products|about|contact" }] },
  "pages": {
    "home": { "blocks": [...] },
    "products": { "blocks": [...] },
    "about": { "blocks": [...] },
    "contact": { "blocks": [...] }
  },
  "footer": { "text": "© 2025 ..." }
}
`;

export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

    try {
      // 1. Validar API Key
      if (!env.OPENAI_API_KEY) {
        return new Response(JSON.stringify({ error: "Falta la OPENAI_API_KEY en los secretos del Worker." }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      // 2. Parsear Body
      const body = await request.json().catch(() => ({}));
      const { prompt, isEdit, currentData, feedback, model } = body;

      // Seleccionar modelo (por defecto mini para ahorrar)
      const selectedModel = model === "elite" ? "gpt-4o" : "gpt-4o-mini";

      if (!prompt && !isEdit) {
        return new Response(JSON.stringify({ error: "No se proporcionó un prompt válido." }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      let messages = [{ role: "system", content: SYSTEM_PROMPT_ARCHITECT }];

      if (isEdit) {
        messages.push({
          role: "user",
          content: `EDICIÓN: Feedback: "${feedback}". Datos actuales: ${JSON.stringify(currentData)}`
        });
      } else {
        messages.push({ role: "user", content: `Crea el sitio para: ${prompt}` });
      }

      // 3. Llamada a OpenAI
      const openAiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: messages,
          response_format: { type: "json_object" },
          temperature: 0.7
        })
      });

      const data = await openAiResponse.json();

      // 4. Manejar Errores de OpenAI (como falta de fondos o cuota)
      if (!openAiResponse.ok || data.error) {
        return new Response(JSON.stringify({ 
          error: data.error?.message || "Error desconocido en la API de OpenAI" 
        }), {
          status: openAiResponse.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      // 5. Respuesta Exitosa
      const content = data.choices[0].message.content;
      return new Response(content, {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });

    } catch (e) {
      return new Response(JSON.stringify({ error: `Worker Crash: ${e.message}` }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
  }
};
