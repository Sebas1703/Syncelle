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
    '--bg-page': palette.background || '#09090b', // Default zinc-950
    '--text-main': theme.mode === 'light' ? '#000000' : '#ffffff',
    '--primary': palette.primary || '#10b981', // Default emerald-500
    '--secondary': palette.secondary || '#3b82f6', // Default blue-500
    '--surface': palette.surface || '#18181b', // Default zinc-900
    '--accent': palette.accent || '#f59e0b',
    'fontFamily': theme.typography?.bodyFont || 'sans-serif',
  };

  return (
    <main 
      className="min-h-screen transition-colors duration-700 ease-in-out"
      style={{
        backgroundColor: 'var(--bg-page)',
        color: 'var(--text-main)',
        ...dynamicStyles
      }}
    >
      {/* Fuente de Google Fonts si la IA la sugiere (Implementación simple) */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=${(theme.typography?.headingFont || 'Inter').replace(' ', '+')}:wght@400;700&display=swap');
        h1, h2, h3, h4, h5, h6 { font-family: '${theme.typography?.headingFont || 'sans-serif'}', sans-serif; }
      `}} />

      {siteData?.blocks?.map((block, index) => (
        <BlockRenderer key={index} block={block} index={index} />
      ))}
    </main>
  );
}
