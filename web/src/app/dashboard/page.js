'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { generateSiteContent } from '@/lib/ai-generator';

export default function Dashboard() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState('');
  const router = useRouter();

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setStatus('Conectando con la IA...');

    try {
      // 1. Generar contenido
      const content = await generateSiteContent(prompt, (bytes) => {
        setStatus(`Diseñando... ${bytes} bytes generados`);
      });

      setStatus('Guardando proyecto...');

      // 2. Obtener sesión robusta
      const { data: { session } } = await supabase.auth.getSession();
      
      let user = session?.user;

      // Si no hay sesión válida en memoria, intentar refrescar o getUser
      if (!user) {
        const { data: { user: refreshedUser }, error: refreshError } = await supabase.auth.getUser();
        if (refreshError || !refreshedUser) {
           // Guardar backup local por si acaso
           localStorage.setItem('syncelle_pending_project', JSON.stringify({ prompt, content }));
           throw new Error("Tu sesión expiró. Por favor, recarga la página e inicia sesión.");
        }
        user = refreshedUser;
      }

      // 3. Guardar en Supabase
      const { data: project, error } = await supabase
        .from('projects')
        .insert({
          user_id: user.id,
          name: content.meta?.title || 'Nuevo Proyecto',
          prompt: prompt,
          structured_data: content
        })
        .select()
        .single();

      if (error) throw error;

      // 4. Redirigir
      setStatus('Redirigiendo...');
      router.push(`/site/${project.id}`);

    } catch (error) {
      console.error(error);
      setStatus(`Error: ${error.message}`);
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <header className="flex justify-between items-center mb-12 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold">Syncelle Dashboard</h1>
        <button 
          onClick={async () => {
            await supabase.auth.signOut();
            router.push('/login');
          }}
          className="text-sm text-zinc-400 hover:text-white"
        >
          Cerrar Sesión
        </button>
      </header>

      <main className="max-w-3xl mx-auto">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 mb-8">
          <h2 className="text-3xl font-bold mb-4 text-center">¿Qué quieres crear hoy?</h2>
          <p className="text-zinc-400 text-center mb-8">
            Describe tu idea. Sé específico sobre el estilo y el contenido.
          </p>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isGenerating}
            placeholder="Una landing page para una marca de café artesanal, estilo minimalista con colores tierra..."
            className="w-full h-40 bg-black border border-zinc-700 rounded-xl p-4 text-lg focus:outline-none focus:border-emerald-500 transition-colors resize-none mb-6"
          />

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-4 rounded-xl text-xl transition-all disabled:opacity-50 disabled:scale-100 active:scale-95"
          >
            {isGenerating ? 'Generando...' : 'Generar Sitio Mágico ✨'}
          </button>

          {status && (
            <div className="mt-6 text-center font-mono text-sm text-emerald-400 animate-pulse">
              {status}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

