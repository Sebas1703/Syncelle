
const RATE_LIMIT_MAX = 15;
const RATE_LIMIT_WINDOW_MS = 60_000;
const REQUEST_TIMEOUT_MS = 60_000; 
const MAX_PROMPT_LENGTH = 16_000;

const EXPLICIT_ALLOWED_ORIGINS = new Set([
  "http://127.0.0.1:8080",
  "http://localhost:8080",
  "http://localhost:8888",
  "http://localhost:5500",
  "http://localhost:3000",
  "https://syncelle.com",
  "https://www.syncelle.com",
  "https://syncelle.netlify.app"
]);

/* 
  === SYSTEM PROMPT: THE MASTER ARCHITECT (V4.0) ===
  Enfoque: Proyectos Multi-página, Identidad Visual Única, Sin Pollinations.
*/
const SYSTEM_PROMPT_ARCHITECT = `
Actúa como Arquitecto de Producto, Director Creativo y Senior Web Engineer de nivel mundial.
Tu tarea es generar un PROYECTO WEB completo, profesional y de alta gama.

REGLAS DE ORO:
1. NO USAR POLLINATIONS. Usa únicamente URLs de Unsplash con keywords: https://images.unsplash.com/photo-[ID]?auto=format&fit=crop&w=1200&q=80. 
   O mejor aún, genera URLs de búsqueda de Unsplash estables: https://source.unsplash.com/featured/1600x900?keyword1,keyword2
2. PROYECTO MULTI-PÁGINA: Debes generar contenido para al menos 3 páginas: "inicio", "servicios" (o similar según negocio) y "contacto".
3. NAVBAR OBLIGATORIO: Define una estructura de navegación coherente entre las páginas generadas.
4. CALIDAD AWWWARDS: Tipografía excelente, paletas de colores con intención, espaciado generoso.
5. CERO LOREM IPSUM: Todo el contenido debe ser real y persuasivo para el negocio solicitado.

ESTRUCTURA DE SALIDA (JSON ESTRICTO):
{
  "_thinking": "Tu razonamiento estratégico sobre el diseño, la marca y la estructura.",
  "meta": {
    "projectName": "Nombre del Negocio",
    "description": "Descripción SEO profesional",
    "version": "4.0"
  },
  "theme": {
    "mode": "dark | light",
    "palette": {
      "background": "#Hex",
      "surface": "#Hex",
      "primary": "#Hex",
      "secondary": "#Hex",
      "textMain": "#Hex",
      "textMuted": "#Hex"
    },
    "typography": {
      "headingFont": "Google Font Name",
      "bodyFont": "Google Font Name"
    }
  },
  "navbar": {
    "logo": "Nombre o Texto",
    "links": [
      { "label": "Inicio", "target": "home" },
      { "label": "Servicios", "target": "services" },
      { "label": "Contacto", "target": "contact" }
    ],
    "cta": { "text": "Botón Navbar", "target": "contact" }
  },
  "pages": {
    "home": {
      "blocks": [
        { "type": "hero", "variant": "split | centered", "data": { "headline": "...", "subheadline": "...", "cta_primary": "...", "image_url": "https://source.unsplash.com/featured/1600x900?keyword1,keyword2" } },
        { "type": "bento-grid", "data": { "items": [...] } },
        { "type": "marquee", "data": { "items": [...] } }
      ]
    },
    "services": {
      "blocks": [
        { "type": "hero", "variant": "centered", "data": { "headline": "Nuestros Servicios", "subheadline": "...", "image_url": "..." } },
        { "type": "showcase", "variant": "grid", "data": { "items": [...] } }
      ]
    },
    "contact": {
      "blocks": [
        { "type": "narrative", "variant": "center", "data": { "title": "Contáctanos", "paragraphs": ["..."], "image_url": "..." } },
        { "type": "cta-footer", "data": { "text": "Hablemos hoy", "button_text": "Enviar Mensaje" } }
      ]
    }
  },
  "footer": {
    "variant": "split | simple",
    "text": "© 2025 Nombre del Negocio. Hecho con Syncelle."
  }
}

INSTRUCCIONES FINALES:
- Solo JSON. Sin markdown.
- Las imágenes DEBEN ser de source.unsplash.com con keywords en inglés relevantes al negocio.
- Adapta los bloques según el tipo de página.
- El Hero de la Home debe ser impactante.
`;

const rateLimiter = new Map();

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin") || "";
    
    if (!isAllowedOrigin(origin, env.PRIMARY_ORIGIN)) {
      return new Response(JSON.stringify({ error: "Origin not allowed" }), { status: 403, headers: { "content-type": "application/json" } });
    }

    const corsHeaders = createCorsHeaders(origin);
    if (request.method === "OPTIONS") return handleOptions(request, corsHeaders);

    if (request.method !== "POST" || url.pathname !== "/generate") {
      return new Response("Not found", { status: 404, headers: corsHeaders });
    }

    const rateError = enforceRateLimit(request, corsHeaders);
    if (rateError) return rateError;

    try {
      const payload = await request.json();
      const { prompt, brand, isEdit, currentData, feedback } = payload;

      if (!prompt && !isEdit) {
        return jsonResponse({ error: "Prompt is required" }, 400, corsHeaders);
      }

      let messages = [
        { role: "system", content: SYSTEM_PROMPT_ARCHITECT }
      ];

      if (isEdit) {
        messages.push({
          role: "user",
          content: `PROYECTO ACTUAL: ${JSON.stringify(currentData)}\n\nFEEDBACK DEL USUARIO: "${feedback}"\n\nTu tarea es aplicar los cambios solicitados manteniendo la estructura profesional. Devuelve el JSON completo actualizado.`
        });
      } else {
        messages.push({
          role: "user",
          content: `PROYECTO: ${brand || "Marca Nueva"}\nCONCEPTO DEL USUARIO: "${prompt}"\n\nGenera el proyecto multi-página profesional.`
        });
      }

      const openAiResponse = await fetch(`${env.OPENAI_BASE_URL || "https://api.openai.com/v1"}/chat/completions`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: env.OPENAI_MODEL || "gpt-4o", // CAMBIADO A GPT-4O
          messages: messages,
          temperature: 0.7,
          response_format: { type: "json_object" } // Asegura salida JSON
        }),
      });

      if (!openAiResponse.ok) {
        const errText = await openAiResponse.text();
        return new Response(errText, { status: openAiResponse.status, headers: corsHeaders });
      }

      const aiData = await openAiResponse.json();
      const content = aiData.choices[0].message.content;

      return jsonResponse(JSON.parse(content), 200, corsHeaders);

    } catch (error) {
      console.error("Worker Error:", error);
      return jsonResponse({ error: error.message }, 500, corsHeaders);
    }
  },
};

// --- HELPERS ---

function isAllowedOrigin(origin, primaryOrigin) {
  if (!origin) return true;
  try {
    const parsed = new URL(origin);
    if (EXPLICIT_ALLOWED_ORIGINS.has(origin)) return true;
    if (parsed.hostname.endsWith(".vercel.app")) return true;
    if (parsed.hostname.includes("localhost") || parsed.hostname === "127.0.0.1") return true;
    if (primaryOrigin && origin === primaryOrigin) return true;
  } catch (e) { return false; }
  return false;
}

function createCorsHeaders(origin) {
  return {
    "access-control-allow-origin": origin,
    "access-control-allow-methods": "POST, OPTIONS",
    "access-control-allow-headers": "content-type, authorization",
    "access-control-max-age": "86400",
  };
}

function withCorsHeaders(headers, corsHeaders) {
  const merged = new Headers(corsHeaders);
  for (const [k, v] of Object.entries(headers)) merged.set(k, v);
  return merged;
}

function jsonResponse(body, status, corsHeaders) {
  return new Response(JSON.stringify(body), {
    status,
    headers: withCorsHeaders({ "content-type": "application/json" }, corsHeaders),
  });
}

function handleOptions(request, corsHeaders) {
  return new Response(null, { status: 204, headers: corsHeaders });
}

function enforceRateLimit(request, corsHeaders) {
  const ip = request.headers.get("cf-connecting-ip") || "unknown";
  const now = Date.now();
  const entry = rateLimiter.get(ip);

  if (!entry || now - entry.windowStart >= RATE_LIMIT_WINDOW_MS) {
    rateLimiter.set(ip, { count: 1, windowStart: now });
    sweepRateLimiter(now);
    return null;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return jsonResponse({ error: "Rate limit exceeded." }, 429, corsHeaders);
  }

  entry.count += 1;
  return null;
}

function sweepRateLimiter(now) {
  for (const [ip, entry] of rateLimiter) {
    if (now - entry.windowStart >= RATE_LIMIT_WINDOW_MS) rateLimiter.delete(ip);
  }
}
