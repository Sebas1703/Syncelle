import { supabase } from '@/lib/supabase';
import BlockRenderer from '@/components/BlockRenderer';
import { notFound } from 'next/navigation';

// Forzamos dinámico para que no intente cachear estáticamente sin datos
export const dynamic = 'force-dynamic';

export default async function SitePage({ params }) {
  const { id } = params;

  // Fetching de datos en el SERVIDOR
  // Esto ocurre en Vercel antes de enviar HTML al usuario
  const { data, error } = await supabase
    .from('projects')
    .select('structured_data')
    .eq('id', id)
    .single();

  if (error || !data) {
    console.error("Error loading project:", error);
    return notFound();
  }

  const siteData = data.structured_data;
  const theme = siteData.theme || {};
  const palette = theme.palette || {};

  // Definir variables CSS dinámicas basadas en la IA
  const dynamicStyles = {
    '--bg-page': palette.background || '#09090b', 
    '--text-main': theme.mode === 'light' ? '#000000' : '#ffffff',
    '--primary': palette.primary || '#10b981',
    '--secondary': palette.secondary || '#3b82f6',
    '--surface': palette.surface || '#18181b',
    '--accent': palette.accent || '#f59e0b',
    'fontFamily': theme.typography?.bodyFont || 'sans-serif',
  };

  const headingFont = theme.typography?.headingFont || 'Inter';
  const bodyFont = theme.typography?.bodyFont || 'Inter';

  return (
    <main 
      className="min-h-screen transition-colors duration-700 ease-in-out"
      style={{
        backgroundColor: 'var(--bg-page)',
        color: 'var(--text-main)',
        ...dynamicStyles
      }}
    >
      {/* Carga dinámica de fuentes de Google */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=${headingFont.replace(/ /g, '+')}:wght@400;700;900&family=${bodyFont.replace(/ /g, '+')}:wght@300;400;600&display=swap');
        
        h1, h2, h3, h4, h5, h6 { 
          font-family: '${headingFont}', sans-serif !important; 
        }
        body, p, button, span, div { 
          font-family: '${bodyFont}', sans-serif; 
        }
      `}} />

      {siteData?.blocks?.map((block, index) => (
        <BlockRenderer key={index} block={block} index={index} />
      ))}

      {/* Botón Flotante para Volver al Dashboard (Solo visible para el creador idealmente, por ahora para todos) */}
      <a 
        href="/dashboard"
        className="fixed bottom-6 right-6 z-50 px-6 py-3 bg-black/80 backdrop-blur-xl border border-white/10 text-white rounded-full font-medium shadow-2xl hover:scale-105 transition-transform flex items-center gap-2 group"
      >
        <span>←</span>
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap">Volver al Dashboard</span>
        <span className="group-hover:hidden">Syncelle</span>
      </a>
    </main>
  );
}
