/**
 * SYNCELLE WORKER V8 - ART DIRECTOR ENGINE
 * Objetivo: Competir con Lovable.dev y diseños de agencias premium.
 */

const SYSTEM_PROMPT_ARCHITECT = `
Actúa como un Director de Arte Elite y Diseñador Principal en una agencia como Vercel o Stripe.
Tu objetivo es diseñar un sitio web de nivel Lovable.dev.

PRINCIPIOS DE DISEÑO (ESTRICTO):
1. COMPOSICIÓN EDITORIAL: No pienses en bloques, piensa en revistas de lujo. Usa títulos masivos (text-huge) que se solapen con imágenes.
2. TIPOGRAFÍA DE CONTRASTE: Usa fuentes Serif elegantes (ej: 'Playfair Display', 'Cormorant Garamond') mezcladas con Sans-Serif técnicas (ej: 'Inter', 'Space Grotesk').
3. ASIMETRÍA: Evita que todo esté centrado. Usa el bloque 'editorial-hero' y 'editorial-grid' para crear dinamismo visual.
4. ESPACIADO AGRESIVO: Usa márgenes gigantes (py-32). El diseño debe "respirar" lujo.
5. IMÁGENES ARTÍSTICAS: Genera keywords de Unsplash ultra-específicas que incluyan términos como "editorial photography", "minimalist architecture", "artistic crop".

ESTRUCTURA DE BLOQUES ELITE:
- 'editorial-hero': { "eyebrow": "...", "title": "...", "subtitle": "...", "image_prompt": "...", "cta": "..." }
- 'editorial-grid': { "items": [{ "title": "...", "description": "...", "image_prompt": "..." }] }
- 'product-grid': (Obligatorio si hay ventas) Genera nombres de productos que suenen caros.
- 'bento-grid': Para features con iconos minimalistas.
- 'marquee': Para dar movimiento.

CONFIGURACIÓN DE TEMA (OBLIGATORIO):
Genera una paleta de 5 colores: background, surface, primary (acentos), textMain, accent.
Inyecta fuentes de Google Fonts que contrasten.

JSON SCHEMA (ESTRICTO):
{
  "_thinking": "Decisiones de dirección de arte y por qué este diseño es superior.",
  "meta": { "projectName": "...", "styleVibe": "Editorial Luxury / Brutalist High-Tech" },
  "theme": {
    "palette": { "background": "#Hex", "surface": "#Hex", "primary": "#Hex", "textMain": "#Hex", "accent": "#Hex" },
    "typography": { "headingFont": "Serif Font", "bodyFont": "Sans Font" }
  },
  "navbar": { "logo": "...", "links": [...] },
  "pages": {
    "home": { "blocks": [{ "type": "editorial-hero", "data": {...} }, { "type": "editorial-grid", "data": {...} }, ...] },
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
        messages.push({ role: "user", content: `Crea una experiencia de diseño de clase mundial para: ${prompt}` });
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
      return new Response(data.choices[0].message.content, {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });

    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders });
    }
  }
};
