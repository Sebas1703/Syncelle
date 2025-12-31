/**
 * SYNCELLE WORKER V7 - THE DESIGN SUPREMACY
 * Modelo: GPT-4o
 */

const SYSTEM_PROMPT_ARCHITECT = `
Actúa como un Equipo Elite de Producto: Arquitecto de Software, Director de Arte y Experto en Conversión.
Tu objetivo es diseñar un sitio web o E-commerce de nivel mundial.

REGLAS DE ORO (PROHIBICIÓN DE "content"):
1. NO USES NUNCA LA PROPIEDAD "content" para los datos de un bloque. USA SIEMPRE "data".
2. NO USES "paragraphs". Si quieres enviar texto largo, usa "text" como string o array de strings dentro de "data".
3. NO INVENTES BLOQUES. Usa exclusivamente los de la lista oficial.

REGLAS DE DISEÑO:
1. IDENTIDAD: Define una "Vibra" extrema. Usa espaciado masivo (py-32, gap-16).
2. E-COMMERCE REAL: Genera productos con nombres realistas, precios en USD y descripciones de catálogo de lujo.
3. IMÁGENES: Sé ultra-específico con Unsplash. Ejemplo: "minimalist architecture interior sunset high resolution".

BLOQUES PERMITIDOS (ESTRICTO):
- 'hero': { "headline": "...", "subheadline": "...", "image_prompt": "...", "cta_primary": "...", "actionTarget": "products|contact" }
- 'product-grid': { "title": "...", "subtitle": "...", "products": [{ "name": "...", "price": "$XX.XX", "image_prompt": "...", "description": "..." }] }
- 'bento-grid': { "items": [{ "title": "...", "description": "...", "icon": "✦" }] }
- 'narrative': { "title": "...", "paragraphs": ["..."], "image_prompt": "..." }
- 'showcase': { "title": "...", "subtitle": "...", "images": ["image_prompt_1", "image_prompt_2"] }
- 'text-content': { "title": "...", "text": "..." }
- 'contact-form': { "title": "...", "subtitle": "...", "buttonText": "..." }
- 'cta-footer': { "text": "...", "button_text": "...", "actionTarget": "products|contact" }

ESTRUCTURA JSON:
{
  "_thinking": "Análisis de marca.",
  "meta": { "projectName": "...", "isEcommerce": true, "styleVibe": "..." },
  "theme": {
    "palette": { "background": "#000000", "surface": "#111111", "primary": "#00FFAA", "textMain": "#FFFFFF", "accent": "#FF00FF" },
    "typography": { "headingFont": "Inter", "bodyFont": "Inter" }
  },
  "navbar": { "logo": "...", "links": [{ "label": "...", "target": "home|products|about|contact" }] },
  "pages": {
    "home": { "blocks": [{ "type": "hero", "variant": "split", "data": {...} }, ...] },
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
      const body = await request.json().catch(() => ({}));
      const { prompt, isEdit, currentData, feedback, model } = body;

      const selectedModel = model === "elite" ? "gpt-4o" : "gpt-4o-mini";

      let messages = [{ role: "system", content: SYSTEM_PROMPT_ARCHITECT }];

      if (isEdit) {
        messages.push({
          role: "user",
          content: `EDICIÓN: Feedback: "${feedback}". Datos actuales: ${JSON.stringify(currentData)}`
        });
      } else {
        messages.push({ role: "user", content: `Crea el sitio para: ${prompt}` });
      }

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
      return new Response(data.choices[0].message.content, {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });

    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders });
    }
  }
};
