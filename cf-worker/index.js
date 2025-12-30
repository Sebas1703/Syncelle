

const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 60_000;
const REQUEST_TIMEOUT_MS = 28_000;
const MAX_PROMPT_LENGTH = 16_000;
const MAX_BRAND_LENGTH = 200;
const MAX_SECTIONS = 20;
const MAX_SECTION_LENGTH = 800;

const rateLimiter = new Map();

/**
 * Contrato de respuesta esperado por el cliente (ai-service.js > _parseAndValidateContent)
 * - Obligatorios: 'titulo', 'eslogan', 'descripcion', 'beneficios'(3), 'servicios'(3), 'cta'
 * - Arrays esperados: menuItems(6), chefs(3), desayuno(6), almuerzo(6), cena(6)
 * - Objetos opcionales: about, menu, contacto, ofertas, formulario, footer, navegacion
 * - Debe incluir schemaVersion (el cliente lo completa a 1 si falta).
 */
const SYSTEM_PROMPT = `
Eres un redactor experto en UX/UI y marketing digital especializado en crear contenido completo para sitios web de restaurantes y cafeterías.

Tu tarea es generar contenido estructurado y completo que llene TODA la página web, incluyendo menús detallados, información del equipo, y datos de contacto reales.

Devuelve SIEMPRE un JSON válido con este esquema COMPLETO:
{
  "schemaVersion": 1,
  "titulo": "Nombre del negocio (ej: Café Bravíssimo)",
  "eslogan": "Eslogan memorable y atractivo",
  "descripcion": "Descripción completa del negocio (2-3 oraciones)",
  "beneficios": ["Beneficio específico 1", "Beneficio específico 2", "Beneficio específico 3"],
  "servicios": ["Servicio principal 1", "Servicio principal 2", "Servicio principal 3"],
  "cta": "Call to action persuasivo (ej: Haz tu Reserva)",
  "about": {
    "subtitulo": "Sobre Nosotros",
    "titulo": "Título inspirador sobre la historia/misión"
  },
  "menu": {
    "subtitulo": "Nuestro Menú",
    "titulo": "Título atractivo para la sección de menú principal"
  },
  "menuItems": [
    {"nombre": "Producto 1", "descripcion": "Descripción apetitosa", "precio": "$XX"},
    {"nombre": "Producto 2", "descripcion": "Descripción apetitosa", "precio": "$XX"},
    {"nombre": "Producto 3", "descripcion": "Descripción apetitosa", "precio": "$XX"},
    {"nombre": "Producto 4", "descripcion": "Descripción apetitosa", "precio": "$XX"},
    {"nombre": "Producto 5", "descripcion": "Descripción apetitosa", "precio": "$XX"},
    {"nombre": "Producto 6", "descripcion": "Descripción apetitosa", "precio": "$XX"}
  ],
  "chefs": [
    {"nombre": "Nombre completo", "cargo": "Cargo específico"},
    {"nombre": "Nombre completo", "cargo": "Cargo específico"},
    {"nombre": "Nombre completo", "cargo": "Cargo específico"}
  ],
  "desayuno": [
    {"nombre": "Desayuno 1", "descripcion": "Descripción del desayuno", "precio": "$XX"},
    {"nombre": "Desayuno 2", "descripcion": "Descripción del desayuno", "precio": "$XX"},
    {"nombre": "Desayuno 3", "descripcion": "Descripción del desayuno", "precio": "$XX"},
    {"nombre": "Desayuno 4", "descripcion": "Descripción del desayuno", "precio": "$XX"},
    {"nombre": "Desayuno 5", "descripcion": "Descripción del desayuno", "precio": "$XX"},
    {"nombre": "Desayuno 6", "descripcion": "Descripción del desayuno", "precio": "$XX"}
  ],
  "almuerzo": [
    {"nombre": "Almuerzo 1", "descripcion": "Descripción del almuerzo", "precio": "$XX"},
    {"nombre": "Almuerzo 2", "descripcion": "Descripción del almuerzo", "precio": "$XX"},
    {"nombre": "Almuerzo 3", "descripcion": "Descripción del almuerzo", "precio": "$XX"},
    {"nombre": "Almuerzo 4", "descripcion": "Descripción del almuerzo", "precio": "$XX"},
    {"nombre": "Almuerzo 5", "descripcion": "Descripción del almuerzo", "precio": "$XX"},
    {"nombre": "Almuerzo 6", "descripcion": "Descripción del almuerzo", "precio": "$XX"}
  ],
  "cena": [
    {"nombre": "Cena 1", "descripcion": "Descripción de la cena", "precio": "$XX"},
    {"nombre": "Cena 2", "descripcion": "Descripción de la cena", "precio": "$XX"},
    {"nombre": "Cena 3", "descripcion": "Descripción de la cena", "precio": "$XX"},
    {"nombre": "Cena 4", "descripcion": "Descripción de la cena", "precio": "$XX"},
    {"nombre": "Cena 5", "descripcion": "Descripción de la cena", "precio": "$XX"},
    {"nombre": "Cena 6", "descripcion": "Descripción de la cena", "precio": "$XX"}
  ],
  "contacto": {
    "subtitulo": "Contáctanos",
    "titulo": "Título llamativo para contacto/reservas",
    "descripcion": "Descripción de ubicación o invitación",
    "telefono": {
      "titulo": "Teléfonos",
      "numero1": "Número de teléfono realista",
      "numero2": "Segundo número realista"
    },
    "email": {
      "titulo": "Correos Electrónicos", 
      "email1": "email@negocio.com",
      "email2": "info@negocio.com"
    }
  },
  "ofertas": {
    "subtitulo": "Ofertas Especiales",
    "titulo": "Título atractivo para promociones"
  },
  "formulario": {
    "titulo": "Haz tu Reserva"
  },
  "navegacion": {
    "desayuno": "Desayunos",
    "almuerzo": "Almuerzos",
    "cena": "Cenas"
  },
  "footer": {
    "copyright": "© 2024 [Nombre del Negocio]. Todos los derechos reservados."
  }
}

INSTRUCCIONES CRÍTICAS:
1. Devuelve EXCLUSIVAMENTE un JSON válido (sin comentarios ni Markdown).
2. Respeta exactamente los nombres de campos y la estructura.
3. Asegúrate de que 'beneficios' y 'servicios' tengan 3 elementos; 'menuItems' 6; 'chefs' 3; 'desayuno', 'almuerzo', 'cena' 6.
4. Usa español neutro y precios realistas.
`.trim();

const EXPLICIT_ALLOWED_ORIGINS = new Set([
  "http://127.0.0.1:8080",
  "http://localhost:8080",
  "http://localhost:8888",
  "http://localhost:5500", // Añadido localhost común
  "http://localhost:3000", // Añadido puerto React dev
  "https://syncelle.com",  // Dominio Producción
  "https://www.syncelle.com", // Variación con www
  "https://syncelle.netlify.app" // Posible dominio Netlify (por si acaso)
]);

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin") || "";

    if (!isAllowedOrigin(origin, env.PRIMARY_ORIGIN)) {
      return new Response(JSON.stringify({ error: "Origin not allowed" }), {
        status: 403,
        headers: {
          "content-type": "application/json",
        },
      });
    }

    const corsHeaders = createCorsHeaders(origin);

    if (request.method === "OPTIONS") {
      return handleOptions(request, corsHeaders);
    }

    if (request.method === "POST" && url.pathname === "/generate") {
      const rateLimitedResponse = enforceRateLimit(request, corsHeaders);
      if (rateLimitedResponse) {
        return rateLimitedResponse;
      }

      let payload;
      try {
        payload = await request.json();
      } catch {
        return jsonResponse(
          { error: "Invalid JSON body" },
          400,
          corsHeaders,
        );
      }

      const validationErrors = validatePayload(payload);
      if (validationErrors.length) {
        return jsonResponse(
          { error: "Invalid payload", details: validationErrors },
          400,
          corsHeaders,
        );
      }

      if (!env.OPENAI_API_KEY) {
        return jsonResponse(
          { error: "OPENAI_API_KEY is not set" },
          500,
          corsHeaders,
        );
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
      let openAiResponse;

      try {
        openAiResponse = await fetch(`${env.OPENAI_BASE_URL || "https://api.openai.com/v1"}/chat/completions`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify(buildOpenAiBody(payload, env.OPENAI_MODEL)),
          signal: controller.signal,
        });
      } catch (error) {
        clearTimeout(timeoutId);
        if (error && error.name === "AbortError") {
          return jsonResponse(
            { error: "Upstream request timed out" },
            504,
            corsHeaders,
          );
        }

        console.error("OpenAI fetch failed", error);
        return jsonResponse(
          { error: "Failed to contact OpenAI" },
          502,
          corsHeaders,
        );
      } finally {
        clearTimeout(timeoutId);
      }

      if (!openAiResponse) {
        return jsonResponse(
          { error: "No response from OpenAI" },
          502,
          corsHeaders,
        );
      }

      if (!openAiResponse.ok) {
        const errorBody = await openAiResponse.text();
        return new Response(errorBody || JSON.stringify({ error: "OpenAI error" }), {
          status: openAiResponse.status,
          headers: withCorsHeaders(
            {
              "content-type": openAiResponse.headers.get("content-type") || "application/json",
            },
            corsHeaders,
          ),
        });
      }

      if (!openAiResponse.body) {
        return jsonResponse(
          { error: "OpenAI response missing body" },
          502,
          corsHeaders,
        );
      }

      const headers = withCorsHeaders(
        {
          "content-type": openAiResponse.headers.get("content-type") || "text/event-stream",
          "cache-control": "no-store",
        },
        corsHeaders,
      );

      return new Response(openAiResponse.body, {
        status: 200,
        headers,
      });
    }

    return new Response("Not found", {
      status: 404,
      headers: corsHeaders,
    });
  },
};

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
    return jsonResponse(
      { error: "Rate limit exceeded. Try again soon." },
      429,
      corsHeaders,
    );
  }

  entry.count += 1;
  return null;
}

function sweepRateLimiter(now) {
  for (const [ip, entry] of rateLimiter) {
    if (now - entry.windowStart >= RATE_LIMIT_WINDOW_MS) {
      rateLimiter.delete(ip);
    }
  }
}

function validatePayload(payload) {
  const errors = [];
  const { prompt, brand, sections } = payload || {};

  if (typeof prompt !== "string" || !prompt.trim()) {
    errors.push("prompt must be a non-empty string");
  } else if (prompt.length > MAX_PROMPT_LENGTH) {
    errors.push(`prompt must be <= ${MAX_PROMPT_LENGTH} characters`);
  }

  if (typeof brand !== "string" || !brand.trim()) {
    errors.push("brand must be a non-empty string");
  } else if (brand.length > MAX_BRAND_LENGTH) {
    errors.push(`brand must be <= ${MAX_BRAND_LENGTH} characters`);
  }

  if (!Array.isArray(sections)) {
    errors.push("sections must be an array of strings");
  } else if (sections.length > MAX_SECTIONS) {
    errors.push(`sections must include <= ${MAX_SECTIONS} items`);
  } else {
    sections.forEach((section, index) => {
      if (typeof section !== "string" || !section.trim()) {
        errors.push(`sections[${index}] must be a non-empty string`);
      } else if (section.length > MAX_SECTION_LENGTH) {
        errors.push(`sections[${index}] must be <= ${MAX_SECTION_LENGTH} characters`);
      }
    });
  }

  return errors;
}

const SYSTEM_PROMPT_V2 = `
Eres un Arquitecto Web Senior de clase mundial. Tu misión es diseñar sitios web ÚNICOS y NO REPETITIVOS.

CRÍTICO:
1.  **NO** uses siempre la estructura "Hero -> Bento -> Marquee -> Narrative". ¡Eso es aburrido!
2.  **ADAPTA LA ESTRUCTURA AL NEGOCIO**:
    -   **Restaurante:** Hero -> Menú (Showcase) -> Historia (Narrative) -> Reserva (CTA).
    -   **Portafolio:** Hero -> Galería (Bento) -> Sobre mí (Narrative) -> Contacto.
    -   **Startup:** Hero -> Marquee (Logos) -> Problema (Narrative) -> Solución (Bento) -> Pricing.
3.  **COLORES REALES:** El frontend aplicará tus colores. Sé audaz. Usa contrastes.
4.  **IMÁGENES:** Describe prompts fotográficos detallados (iluminación, ángulo, estilo).

Devuelve un JSON válido con este esquema:
{
  "meta": {
    "title": "Nombre del Sitio",
    "description": "Descripción SEO",
    "version": "2.1"
  },
  "theme": {
    "mode": "dark | light",
    "palette": {
      "primary": "#Hex",
      "secondary": "#Hex",
      "accent": "#Hex",
      "background": "#Hex (Fondo base de la página)",
      "surface": "#Hex"
    },
    "typography": {
      "headingFont": "Nombre Google Font (ej: Playfair Display, Space Grotesk, Syne)",
      "bodyFont": "Nombre Google Font (ej: Inter, Lato, DM Sans)"
    }
  },
  "blocks": [
    {
      "type": "hero",
      "variant": "video-centered | split",
      "data": {
        "headline": "Título Corto e Impactante",
        "subheadline": "Subtítulo persuasivo",
        "cta_primary": "Botón 1",
        "image_prompt": "Descripción cinemática detallada para generar fondo"
      }
    },
    {
      "type": "narrative",
      "variant": "image-left | image-right | center", 
      "style": { "backgroundColor": "transparent | #Hex (Para romper monotonía)" },
      "data": {
        "title": "Título Sección",
        "paragraphs": ["Texto 1", "Texto 2"],
        "image_prompt": "Descripción foto editorial"
      }
    },
    {
      "type": "bento-grid",
      "data": {
        "items": [{"title": "", "description": "", "icon": "Emoji o nombre"}]
      }
    },
    {
      "type": "showcase",
      "variant": "carousel | grid",
      "data": { "items": [{"title": "Plato/Producto", "subtitle": "Precio/Desc", "image_prompt": "Foto producto"}] }
    },
    {
      "type": "marquee",
      "data": { "items": ["Texto 1", "Texto 2"] }
    }
  ]
}

INSTRUCCIONES FINALES:
-   ¡Sé creativo con el orden! No pongas un Marquee si no tiene sentido.
-   Usa la variante 'split' en el Hero a veces.
-   Cambia el color de fondo de algunas secciones (ej: una sección clara en una web oscura) usando el campo "style".
`;

function buildOpenAiBody(payload, model) {
  const { prompt, brand, sections, version } = payload;
  
  // Determinar qué Prompt del Sistema usar según la versión
  const isV2 = version === 2;
  const selectedSystemPrompt = isV2 ? SYSTEM_PROMPT_V2 : SYSTEM_PROMPT;

  // Extrae solo la parte del usuario si el cliente envió el prompt combinado
  let userPrompt = typeof prompt === "string" ? prompt.trim() : "";
  const marker = "USUARIO:";
  if (userPrompt.includes(marker)) {
    const idx = userPrompt.indexOf(marker);
    userPrompt = userPrompt.slice(idx + marker.length).trim();
  }
  if (userPrompt.length > MAX_PROMPT_LENGTH) {
    userPrompt = userPrompt.slice(0, MAX_PROMPT_LENGTH);
  }

  const brandLine = typeof brand === "string" && brand.trim()
    ? `Marca sugerida: ${brand.trim()}`
    : "";
  
  // En V2, las "secciones sugeridas" son menos estrictas, pero se pueden pasar como contexto
  const sectionsLine = Array.isArray(sections) && sections.length
    ? `Secciones sugeridas: ${sections.join(", ")}`
    : "";

  const systemContent = [selectedSystemPrompt, brandLine, sectionsLine]
    .filter(Boolean)
    .join("\n\n");

  return {
    model: model || "gpt-4o-mini",
    stream: true,
    messages: [
      { role: "system", content: systemContent },
      { role: "user", content: userPrompt || "Genera el contenido completo siguiendo el contrato indicado." },
    ],
  };
}

function isAllowedOrigin(origin, primaryOrigin) {
  if (!origin) {
    // Direct navigation or same-origin requests often have no Origin header.
    return true;
  }

  try {
    const parsed = new URL(origin);
    if (EXPLICIT_ALLOWED_ORIGINS.has(origin)) {
      return true;
    }
    const isLocal =
      parsed.hostname.includes("localhost") || parsed.hostname === "127.0.0.1";
    if (parsed.protocol !== "https:" && !isLocal) {
      return false;
    }

    if (isLocal) {
      return true;
    }

    if (parsed.hostname.endsWith(".netlify.app") || parsed.hostname === "netlify.app") {
      return true;
    }

    // Permitir cualquier subdominio de Vercel (Previews y Producción)
    if (parsed.hostname.endsWith(".vercel.app") || parsed.hostname === "vercel.app") {
      return true;
    }

    if (primaryOrigin && origin === primaryOrigin) {
      return true;
    }
  } catch {
    return false;
  }

  return false;
}

function createCorsHeaders(origin) {
  return {
    "access-control-allow-origin": origin,
    "access-control-allow-methods": "POST, OPTIONS",
    "access-control-allow-headers": "content-type, authorization",
    "access-control-max-age": "86400",
    "vary": "Origin",
  };
}

function withCorsHeaders(headers, corsHeaders) {
  const merged = new Headers(corsHeaders);
  for (const [key, value] of Object.entries(headers || {})) {
    merged.set(key, value);
  }
  return merged;
}

function jsonResponse(body, status, corsHeaders) {
  return new Response(JSON.stringify(body), {
    status,
    headers: withCorsHeaders({ "content-type": "application/json" }, corsHeaders),
  });
}

function handleOptions(request, corsHeaders) {
  if (
    request.headers.get("Access-Control-Request-Method") &&
    request.headers.get("Access-Control-Request-Headers")
  ) {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
}

