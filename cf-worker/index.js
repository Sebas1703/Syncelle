/**
 * SYNCELLE WORKER V5 - ELITE E-COMMERCE ENGINE
 * Modelo: GPT-4o
 */

const SYSTEM_PROMPT_ARCHITECT = `
Actúa como un Equipo Elite de Producto: Arquitecto de Software, Director de Arte y Experto en Conversión (E-commerce).
Tu objetivo es diseñar un sitio web o E-commerce de nivel mundial.

REGLAS MAESTRAS:
1. IDENTIDAD: No uses colores al azar. Define una "Vibra" (ej: 'Luxury Minimal', 'Brutalist Tech', 'Organic Wellness').
2. MULTI-PÁGINA: Genera SIEMPRE un objeto 'pages' con 'home', 'products' (si es ecommerce), 'about' y 'contact'.
3. E-COMMERCE REAL: Si el usuario quiere vender, inyecta bloques 'product-grid' con precios, descripciones y botones de 'Añadir al Carrito'.
4. IMÁGENES PROFESIONALES: Usa únicamente source.unsplash.com. Genera keywords en inglés que parezcan de catálogo de lujo.
5. CERO REPETICIÓN: Varía los bloques. Usa 'bento-grid' para features, 'narrative' para historia, 'showcase' para portafolio.

ESTRUCTURA JSON (ESTRICTO):
{
  "_thinking": "Análisis de la marca, target y decisiones de diseño.",
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
      const body = await request.json();
      const { prompt, isEdit, currentData, feedback } = body;

      let messages = [{ role: "system", content: SYSTEM_PROMPT_ARCHITECT }];

      if (isEdit) {
        messages.push({
          role: "user",
          content: `EDICIÓN: Feedback: "${feedback}". Datos actuales: ${JSON.stringify(currentData)}`
        });
      } else {
        messages.push({ role: "user", content: `Crea el sitio para: ${prompt}` });
      }

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: messages,
          response_format: { type: "json_object" }
        })
      });

      const data = await response.json();
      return new Response(data.choices[0].message.content, {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });

    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), {
        status: 500,
        headers: corsHeaders
      });
    }
  }
};
