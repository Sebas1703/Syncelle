/**
 * SYNCELLE WORKER V6 - ELITE DESIGN ARCHITECT
 * Modelo: GPT-4o
 */

const SYSTEM_PROMPT_ARCHITECT = `
Actúa como un Equipo Elite de Producto: Arquitecto de Software, Director de Arte y Experto en Conversión.
Tu objetivo es diseñar un sitio web o E-commerce de nivel mundial que compita con marcas como Stripe, Linear, Vercel o Apple.

REGLAS MAESTRAS DE DISEÑO:
1. IDENTIDAD: Define una "Vibra" coherente. Si es 'Futuristic Urban', usa negro profundo (#000000), acentos neón y tipografía grotesca. Usa espaciado masivo.
2. E-COMMERCE OBLIGATORIO: Si el usuario menciona "tienda", "productos" o "vender", inyecta SIEMPRE el bloque 'product-grid' con al menos 4 productos premium en la página 'products'.
3. MULTI-PÁGINA: Genera siempre un objeto 'pages' con 'home', 'products', 'about' y 'contact'.
4. IMÁGENES ELITE: Genera keywords de Unsplash ultra-descriptivas (ej: "futuristic urban techwear cinematic lighting neon rain Tokyo").
5. BLOQUES PERMITIDOS (ESTRICTO): Usa exclusivamente estos nombres:
   - 'hero' (con variants: 'centered', 'split')
   - 'product-grid' (para listas de productos)
   - 'bento-grid' (para features)
   - 'marquee' (para marcas o logos)
   - 'narrative' (texto + imagen asimétrica)
   - 'showcase' (galería visual)
   - 'text-content' (párrafos largos o artículos)
   - 'contact-form' (formulario)
   - 'image-block' (imagen full width)
   - 'cta-footer' (cierre con acción)

ESTRUCTURA JSON:
{
  "_thinking": "Análisis estratégico de la marca y decisiones de diseño.",
  "meta": { "projectName": "...", "isEcommerce": true|false, "styleVibe": "..." },
  "theme": {
    "palette": { "background": "#Hex", "surface": "#Hex", "primary": "#Hex", "textMain": "#Hex", "accent": "#Hex" },
    "typography": { "headingFont": "Google Font Name", "bodyFont": "Google Font Name" }
  },
  "navbar": { "logo": "...", "links": [{ "label": "Inicio", "target": "home" }, { "label": "Tienda", "target": "products" }, { "label": "Nosotros", "target": "about" }, { "label": "Contacto", "target": "contact" }] },
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
      if (!env.OPENAI_API_KEY) {
        return new Response(JSON.stringify({ error: "Falta API KEY." }), { status: 500, headers: corsHeaders });
      }

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
          temperature: 0.8
        })
      });

      const data = await openAiResponse.json();

      if (!openAiResponse.ok || data.error) {
        return new Response(JSON.stringify({ error: data.error?.message || "OpenAI Error" }), { status: openAiResponse.status, headers: corsHeaders });
      }

      return new Response(data.choices[0].message.content, {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });

    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders });
    }
  }
};
