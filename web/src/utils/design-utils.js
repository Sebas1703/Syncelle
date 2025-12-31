// Utilidad para asegurar imágenes de alta calidad (Fallback a Unsplash)
export const getImageUrl = (data) => {
  if (!data) return "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80";
  
  // Soporte para múltiples nombres de propiedad de imagen
  const img = data.image_url || data.image || data.backgroundImage || data.bgImage || data.img;
  
  // Si es una URL real, devolverla
  if (img && typeof img === 'string' && img.startsWith('http')) return img;
  
  // Si es un objeto (a veces la IA manda { url: '...' })
  if (img && typeof img === 'object' && img.url) return img.url;

  // Si no es URL, usar como prompt para Unsplash
  const prompt = data.image_prompt || (typeof img === 'string' ? img : null) || "professional luxury design";
  const keywords = encodeURIComponent(prompt.split(',')[0].trim());
  return `https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80&sig=${keywords}`;
  // Nota: Para una integración profesional real, se debe usar el API oficial de Unsplash para buscar y obtener IDs específicos.
};

