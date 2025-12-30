'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { generateSiteContent } from '@/lib/ai-generator';
import Navbar from '@/components/Navbar';

export default function Dashboard() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState('');
  const [projects, setProjects] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (data) setProjects(data);
  };

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
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <div className="pt-32 pb-12 px-8">
        <header className="flex justify-between items-center mb-12 max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold">Panel de Control</h1>
          <button 
            onClick={async () => {
              await supabase.auth.signOut();
              router.push('/login');
            }}
            className="text-sm text-zinc-400 hover:text-white border border-zinc-800 px-4 py-2 rounded-full transition-colors"
          >
            Cerrar Sesión
          </button>
        </header>

        <main className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Columna Izquierda: Generador */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 backdrop-blur-xl h-fit sticky top-32">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Crear Nuevo Sitio
            </h2>
            <p className="text-zinc-400 mb-8 text-sm">
              Describe tu idea. La IA diseñará colores, textos y estructura única para ti.
            </p>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isGenerating}
              placeholder="Ej: Un portafolio para un fotógrafo de bodas, estilo minimalista, elegante, con tonos crema y dorados..."
              className="w-full h-40 bg-black/50 border border-zinc-700 rounded-xl p-4 text-base focus:outline-none focus:border-emerald-500 transition-colors resize-none mb-6"
            />

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full bg-white hover:bg-zinc-200 text-black font-bold py-4 rounded-xl text-lg transition-all disabled:opacity-50 disabled:scale-100 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              {isGenerating ? 'Diseñando tu sitio...' : 'Generar Sitio Mágico ✨'}
            </button>

            {status && (
              <div className="mt-6 text-center font-mono text-xs text-emerald-400 animate-pulse border border-emerald-500/20 bg-emerald-500/5 p-2 rounded-lg">
                {status}
              </div>
            )}
          </div>

          {/* Columna Derecha: Historial */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-zinc-300">Tus Sitios Generados</h3>
            
            {projects.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-zinc-800 rounded-2xl">
                <p className="text-zinc-500">Aún no has creado ningún sitio.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {projects.map((proj) => (
                  <div 
                    key={proj.id}
                    onClick={() => router.push(`/site/${proj.id}`)}
                    className="group bg-zinc-900 border border-zinc-800 p-6 rounded-2xl cursor-pointer hover:border-zinc-600 transition-all hover:translate-x-2"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-lg group-hover:text-emerald-400 transition-colors">
                        {proj.name || 'Sin Título'}
                      </h4>
                      <span className="text-xs text-zinc-500 font-mono">
                        {new Date(proj.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-zinc-400 text-sm line-clamp-2 text-ellipsis">
                      {proj.prompt}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

