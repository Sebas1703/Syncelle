'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import BlockRenderer from '@/components/BlockRenderer';

export default function SitePage({ params }) {
  const [siteData, setSiteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadSite() {
      try {
        console.log("Loading site ID:", params.id);
        
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', params.id)
          .single();

        if (error) throw error;
        if (!data) throw new Error("Proyecto no encontrado");

        // Extraer la parte de contenido estructurado
        setSiteData(data.structured_data);
      } catch (err) {
        console.error("Error cargando sitio:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      loadSite();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black text-white">
        <div className="animate-pulse text-emerald-500">Cargando Experiencia...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black text-white flex-col">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-zinc-500">{error}</p>
      </div>
    );
  }

  return (
    <main className="bg-black min-h-screen text-white">
      {siteData?.blocks?.map((block, index) => (
        <BlockRenderer key={index} block={block} index={index} />
      ))}
    </main>
  );
}

