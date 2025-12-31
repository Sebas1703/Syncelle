import { supabase } from '@/lib/supabase';
import BlockRenderer from '@/components/BlockRenderer';
import { notFound } from 'next/navigation';
import SiteActions from '@/components/SiteActions';

// Forzamos dinámico para que no intente cachear estáticamente sin datos
export const dynamic = 'force-dynamic';

export default async function SitePage({ params }) {
  const { id } = params;

  // Fetching de datos en el SERVIDOR
  // Esto ocurre en Vercel antes de enviar HTML al usuario
  const { data, error } = await supabase
    .from('projects')
    .select('structured_data,prompt')
    .eq('id', id)
    .single();

  if (error || !data) {
    console.error("Error loading project:", error);
    return notFound();
  }

  const siteData = data.structured_data;
  const originalPrompt = data.prompt || '';
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

      {Array.isArray(siteData?.pages) && siteData.pages.length > 0 ? (
        siteData.pages.map((page, pageIdx) => (
          <div key={pageIdx} id={page.name || `page-${pageIdx}`} className="scroll-mt-20">
            {page?.blocks?.map((block, index) => (
              <BlockRenderer key={`${pageIdx}-${index}`} block={block} index={index} />
            ))}
          </div>
        ))
      ) : (
        siteData?.blocks?.map((block, index) => (
          <BlockRenderer key={index} block={block} index={index} />
        ))
      )}

      <SiteActions siteData={siteData} originalPrompt={originalPrompt} />
    </main>
  );
}
