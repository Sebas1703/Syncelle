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

  return (
    <main className="bg-black min-h-screen text-white">
      {siteData?.blocks?.map((block, index) => (
        <BlockRenderer key={index} block={block} index={index} />
      ))}
    </main>
  );
}
