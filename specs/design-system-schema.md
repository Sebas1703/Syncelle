# Syncelle Design Engine - JSON Schema V2

## Concepto
El JSON ya no describe un negocio (Menú, Chefs), describe una **Experiencia Web**. La IA actúa como Director Creativo, seleccionando componentes, ritmos visuales y estilos.

## Estructura Global
```json
{
  "meta": {
    "title": "Nombre del Sitio",
    "description": "SEO Description",
    "version": "2.0"
  },
  "theme": {
    "mode": "dark | light | auto",
    "palette": {
      "primary": "#Hex",
      "secondary": "#Hex",
      "accent": "#Hex",
      "background": "#Hex",
      "surface": "#Hex"
    },
    "typography": {
      "headingFont": "Clash Display | Playfair | Inter",
      "bodyFont": "Satoshi | Roboto | Lora"
    },
    "vibe": "minimalist | brutalist | luxury | corporate | playful"
  },
  "blocks": [
    // Array ordenado de componentes visuales
  ]
}
```

## Catálogo de Bloques (Block Registry)

La IA seleccionará de este catálogo. Cada bloque soporta variantes.

### 1. Hero Section (`type: "hero"`)
El impacto inicial.
- **variants**: 
  - `fullscreen-video`: Video de fondo, texto centrado grande.
  - `split-screen`: Texto izquierda, imagen 3D/hero derecha.
  - `typographic`: Solo texto gigante cinético (estilo Apple/Dora).
- **data**: `headline`, `subheadline`, `cta_primary`, `cta_secondary`, `media_url`.

### 2. Bento Grid (`type: "bento-grid"`)
Para mostrar características, servicios o beneficios de forma modular (estilo Apple).
- **variants**: `3-col`, `4-col`, `asymmetric`.
- **data**: Array de `items` (icono, título, descripción, tamaño de celda).

### 3. Marquee (`type: "marquee"`)
Texto en movimiento infinito para generar dinamismo.
- **variants**: `filled`, `outline`, `giant`.
- **data**: `items` (lista de palabras clave o logos).

### 4. Narrative Section (`type: "narrative"`)
Texto editorial con scroll-trigger images. Reemplaza al "About Us" aburrido.
- **variants**: `sticky-image`, `text-reveal`.
- **data**: `paragraphs`, `highlighted_text`, `image_sequence`.

### 5. Showcase (`type: "showcase"`)
Para productos, platos o portafolio.
- **variants**: `carousel-3d`, `parallax-scroll`, `hover-expand`.
- **data**: `items` (img, title, price/tag).

### 6. CTA Footer (`type: "cta-footer"`)
Cierre fuerte.
- **variants**: `minimal-centered`, `split-map`, `giant-link`.
- **data**: `text`, `button_text`, `social_links`.

## Ejemplo de Prompt System (Concepto)
"Actúa como un diseñador web premiado en Awwwards. Tu objetivo es crear un sitio web para [IDEA]. No uses estructuras genéricas. Selecciona los bloques más impactantes del catálogo para transmitir la identidad de la marca. Define una paleta de colores única y justifica tu elección de tipografía."

