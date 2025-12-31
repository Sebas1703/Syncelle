
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 60_000;
const REQUEST_TIMEOUT_MS = 45_000;
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

// === IMAGENES: CATÁLOGO CURADO (Pexels/Unsplash, sin Pollinations) ===
const IMAGE_CATALOG = {
  restaurant: [
    "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=1600&q=80"
  ],
  fashion: [
    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1600&q=80",
    "https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1600&q=80"
  ],
  tech: [
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=80",
    "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80"
  ],
  beauty: [
    "https://images.pexels.com/photos/265783/pexels-photo-265783.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1600&q=80",
    "https://images.pexels.com/photos/226734/pexels-photo-226734.jpeg?auto=compress&cs=tinysrgb&w=1600"
  ],
  default: [
    "https://images.unsplash.com/photo-1527254059249-05af64a0bc3f?auto=format&fit=crop&w=1600&q=80",
    "https://images.pexels.com/photos/255379/pexels-photo-255379.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1600&q=80"
  ]
};

function pickImageUrl(category = "default") {
  const pool = IMAGE_CATALOG[category] || IMAGE_CATALOG.default;
  const idx = Math.floor(Math.random() * pool.length);
  return pool[idx];
}

// Enriquecer datos: imágenes de stock, navbar/footer, páginas mínimas
function enrichSiteData(siteData, prompt) {
  const category = detectCategory(prompt);
  const heroImage = pickImageUrl(category);
  const storyImage = pickImageUrl(category);
  const productImage = pickImageUrl(category);

  // Asegurar theme
  siteData.meta = siteData.meta || {};
  siteData.meta.version = "4.0";

  siteData.theme = siteData.theme || {};
  siteData.theme.palette = siteData.theme.palette || {
    background: "#0f1115",
    surface: "#161920",
    primary: "#00d18f",
    secondary: "#5dd6ff",
    textMain: "#ffffff",
    textMuted: "#9ca3af"
  };
  siteData.theme.typography = siteData.theme.typography || {
    headingFont: "Space Grotesk",
    bodyFont: "Inter"
  };

  // Navbar/footer layout defaults
  siteData.layout = siteData.layout || {};
  siteData.layout.navbar = siteData.layout.navbar || { style: pickNavbarVariant(), cta: "Dashboard" };
  siteData.layout.footer = siteData.layout.footer || { variant: pickFooterVariant() };

  // Si no hay pages, construimos 3
  if (!Array.isArray(siteData.pages) || siteData.pages.length === 0) {
    const baseBlocks = siteData.blocks || [];
    siteData.pages = [
      { name: "home", blocks: ensureHeroAndNav(baseBlocks, heroImage, siteData.layout.navbar) },
      { name: "about", blocks: buildAboutBlocks(storyImage, siteData.layout.navbar) },
      { name: "services", blocks: buildServicesBlocks(productImage, siteData.layout.navbar) }
    ];
    siteData.blocks = undefined;
  } else {
    // Aseguramos hero/nav/footer en cada página
    siteData.pages = siteData.pages.map((p, idx) => {
      const blocks = Array.isArray(p.blocks) ? p.blocks : [];
      return {
        ...p,
        blocks: ensureHeroAndNav(blocks, idx === 0 ? heroImage : storyImage, siteData.layout.navbar)
      };
    });
  }

  // Footer: si no hay bloque footer al final, añadimos CTA footer
  siteData.pages = siteData.pages.map(p => {
    const hasFooter = p.blocks.some(b => b.type === "cta-footer");
    if (!hasFooter) {
      p.blocks.push({
        type: "cta-footer",
        variant: siteData.layout.footer.variant,
        data: {
          text: "Listo para empezar.",
          button_text: "Volver al Dashboard"
        }
      });
    }
    return p;
  });

  return siteData;
}

function ensureHeroAndNav(blocks, imageUrl, navbarLayout) {
  const newBlocks = [...blocks];
  const hasNav = newBlocks.some(b => b.type === "navbar");
  if (!hasNav) {
    newBlocks.unshift({
      type: "navbar",
      variant: navbarLayout.style,
      data: {
        brand: "Syncelle",
        links: [
          { label: "Inicio", href: "#home" },
          { label: "Sobre", href: "#about" },
          { label: "Servicios", href: "#services" },
          { label: "Contacto", href: "#footer" }
        ],
        cta: navbarLayout.cta || "Dashboard"
      }
    });
  }

  const hasHero = newBlocks.some(b => b.type === "hero");
  if (!hasHero) {
    newBlocks.push({
      type: "hero",
      variant: "split",
      data: {
        headline: "Construye tu presencia online",
        subheadline: "Una plataforma premium para lanzar tu marca",
        cta_primary: "Comienza ahora",
        cta_secondary: "Explorar más",
        image_url: imageUrl
      }
    });
  } else {
    newBlocks.forEach(b => {
      if (b.type === "hero" && !b.data?.image_url) {
        b.data = b.data || {};
        b.data.image_url = imageUrl;
      }
    });
  }

  // Inyectar imágenes faltantes en narrative/showcase
  newBlocks.forEach(b => {
    if (b.type === "narrative" && !b.data?.image_url) {
      b.data = b.data || {};
      b.data.image_url = imageUrl;
    }
    if (b.type === "showcase" && Array.isArray(b.data?.items)) {
      b.data.items = b.data.items.map(it => ({
        ...it,
        image_url: it.image_url || imageUrl
      }));
    }
  });

  return newBlocks;
}

function buildAboutBlocks(imageUrl, navbarLayout) {
  return ensureHeroAndNav([
    {
      type: "narrative",
      variant: "image-right",
      data: {
        title: "Nuestra historia",
        paragraphs: [
          "Combinamos diseño, tecnología y narrativa para lanzar marcas memorables.",
          "Equipo senior, calidad de producción, sin atajos."
        ],
        image_url: imageUrl
      }
    }
  ], imageUrl, navbarLayout);
}

function buildServicesBlocks(imageUrl, navbarLayout) {
  return ensureHeroAndNav([
    {
      type: "bento-grid",
      data: {
        items: [
          { title: "Branding", description: "Identidad visual premium", icon: "🎨", size: "large" },
          { title: "Web UX", description: "Interfaces claras y efectivas", icon: "💻", size: "small" },
          { title: "Content", description: "Narrativa y conversión", icon: "📝", size: "small" }
        ]
      }
    },
    {
      type: "showcase",
      variant: "grid",
      data: {
        items: [
          { title: "Proyecto A", subtitle: "Caso de éxito", image_url: imageUrl },
          { title: "Proyecto B", subtitle: "Lanzamiento", image_url: imageUrl }
        ]
      }
    }
  ], imageUrl, navbarLayout);
}

function pickNavbarVariant() {
  const variants = ["floating", "topbar", "glass"];
  return variants[Math.floor(Math.random() * variants.length)];
}

function pickFooterVariant() {
  const variants = ["minimal", "centered", "split"];
  return variants[Math.floor(Math.random() * variants.length)];
}

function detectCategory(prompt) {
  const p = (prompt || "").toLowerCase();
  if (p.includes("restaurant") || p.includes("restaurante") || p.includes("bar") || p.includes("café") || p.includes("cafe")) return "restaurant";
  if (p.includes("moda") || p.includes("fashion") || p.includes("ropa") || p.includes("streetwear")) return "fashion";
  if (p.includes("saas") || p.includes("startup") || p.includes("tech") || p.includes("software")) return "tech";
  if (p.includes("belleza") || p.includes("spa") || p.includes("estética") || p.includes("salón")) return "beauty";
  return "default";
}
// === SYSTEM PROMPT: MOTOR PREMIUM (SIN POLLINATIONS) ===
const SYSTEM_PROMPT_ARCHITECT = `
Actúa como Arquitecto Principal, Director Creativo y Frontend Lead.
Objetivo: sitios premium, listos para negocio, superiores a un equipo senior.

Reglas no negociables:
- Nada de plantillas genéricas.
- Mobile-first, performance-first, HTML semántico.
- Navbar elegante y variada, Footer usable (varios estilos).
- Múltiples páginas lógicas (home, about/story, servicios/portfolio/pricing).
- Imágenes reales de stock (Pexels/Unsplash), nunca Pollinations ni IA.
- JSON estricto; si huele a genérico, rehacer.

Fases internas:
1) Análisis: industria, madurez, objetivo, público, tono. Normaliza prompts pobres.
2) Dirección creativa: mood, sofisticación, inspiración (Linear, Stripe, Vercel, Relume). Nada arbitrario.
3) Sistema de diseño: tokens (background, surface, primary, secondary, textMain, textMuted), tipografías (heading/body de Google Fonts), spacing y escalas.
4) Arquitectura UI: Navbar funcional, Hero con propuesta, secciones con propósito (Features/Bento, Trust/Narrative, Showcase), Footer acorde. Mínimo 3 páginas.
5) Imágenes inteligentes: ubica imágenes solo donde aportan (Hero, Features clave, Trust/Story). Usa URLs de stock (keywords o URLs directas). Nada de Pollinations.
6) Validación: ¿parece web real y vendible? ¿Jerarquía clara? Si se siente genérico, rehacer.

Salida JSON V4.0 (sin texto fuera del JSON):
{
  "_thinking": "Breve razonamiento de tus decisiones",
  "meta": { "title": "...", "description": "...", "version": "4.0" },
  "theme": {
    "mode": "dark | light",
    "palette": { "background": "#0f1115", "surface": "#161920", "primary": "#00d18f", "secondary": "#5dd6ff", "textMain": "#ffffff", "textMuted": "#9ca3af" },
    "typography": { "headingFont": "Space Grotesk", "bodyFont": "Inter" },
    "spacing": { "sectionY": 96, "container": 120 }
  },
  "layout": { "navbar": { "style": "floating | topbar | glass", "cta": "Dashboard | Comprar | Contacto" }, "footer": { "variant": "minimal | centered | split" } },
  "pages": [
    { "name": "home", "blocks": [ ... ] },
    { "name": "about", "blocks": [ ... ] },
    { "name": "services", "blocks": [ ... ] }
  ]
}
- Incluye Navbar (global) y Footer (con variante) en las páginas.
- Imágenes: provee keywords de stock o URLs directas de stock (Pexels/Unsplash). Nada de IA.
- No incluyas Markdown ni texto fuera del JSON.
`;

const rateLimiter = new Map();

export default {
  async fetch(request, env, ctx) {
    // 1. CORS & Pre-flight
    const url = new URL(request.url);
    const origin = request.headers.get("Origin") || "";
    
    if (!isAllowedOrigin(origin, env.PRIMARY_ORIGIN)) {
      return new Response(JSON.stringify({ error: "Origin not allowed" }), { status: 403, headers: { "content-type": "application/json" } });
    }

    const corsHeaders = createCorsHeaders(origin);
    if (request.method === "OPTIONS") return handleOptions(request, corsHeaders);

    // 2. Solo permitir POST a /generate
    if (request.method !== "POST" || url.pathname !== "/generate") {
      return new Response("Not found", { status: 404, headers: corsHeaders });
    }

    // 3. Rate Limiting
    const rateError = enforceRateLimit(request, corsHeaders);
    if (rateError) return rateError;

    try {
      // 4. Parse Body
      const payload = await request.json();
      const { prompt, brand } = payload;

      if (!prompt || typeof prompt !== "string") {
        return jsonResponse({ error: "Prompt is required" }, 400, corsHeaders);
      }

      if (!env.OPENAI_API_KEY) {
        return jsonResponse({ error: "Server Configuration Error: API Key missing" }, 500, corsHeaders);
      }

      // 5. Construcción del Mensaje para la IA
      // Forzamos un pensamiento creativo antes de la ejecución
      const userMessage = `
        PROYECTO: ${brand || "Marca Nueva"}
        CONCEPTO DEL USUARIO: "${prompt}"
        
        EJECUCIÓN:
        1. Define la identidad visual (Colores, Tipografía, Vibe).
        2. Estructura el contenido para este nicho específico.
        3. Genera el JSON completo.
      `;

      // 6. Llamada a OpenAI (no streaming, para validar JSON y enriquecer)
      const openAiResponse = await fetch(`${env.OPENAI_BASE_URL || "https://api.openai.com/v1"}/chat/completions`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: env.OPENAI_MODEL || "gpt-4o",
          stream: false,
          messages: [
            { role: "system", content: SYSTEM_PROMPT_ARCHITECT },
            { role: "user", content: userMessage },
          ],
          temperature: 0.85,
        }),
      });

      if (!openAiResponse.ok) {
        const errText = await openAiResponse.text();
        return new Response(errText, { status: openAiResponse.status, headers: corsHeaders });
      }

      // Validamos JSON y enriquecemos imágenes/navbar/footer/páginas
      const result = await openAiResponse.json();
      const content = result?.choices?.[0]?.message?.content;
      if (!content) {
        return jsonResponse({ error: "No content from model" }, 502, corsHeaders);
      }

      let siteData;
      try {
        siteData = JSON.parse(content);
      } catch (e) {
        return jsonResponse({ error: "Invalid JSON from model", details: e.message, raw: content }, 502, corsHeaders);
      }

      const enriched = enrichSiteData(siteData, prompt);
      return jsonResponse(enriched, 200, corsHeaders);

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
