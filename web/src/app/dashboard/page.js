'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { generateSiteContent } from '@/lib/ai-generator';
import Navbar from '@/components/Navbar';

export default function Dashboard() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [model, setModel] = useState('fast'); // 'fast' o 'elite'
  const [status, setStatus] = useState('');
  const [projects, setProjects] = useState([]);
  const [credits, setCredits] = useState(0);
  const router = useRouter();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    // Fetch projects
    const { data: projs } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (projs) setProjects(projs);

    // Fetch credits (from a 'profiles' table we'll assume exists or handle missing)
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', session.user.id)
      .single();

    if (profile) {
      setCredits(profile.credits);
    } else if (profileError && profileError.code === 'PGRST116') {
      // Profile doesn't exist, create it with 3 starter credits
      const { data: newProfile } = await supabase
        .from('profiles')
        .insert({ id: session.user.id, credits: 3 })
        .select()
        .single();
      if (newProfile) setCredits(newProfile.credits);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation(); // Evitar que redirija al hacer clic en eliminar
    if (!confirm('¿Estás seguro de que quieres eliminar este proyecto?')) return;

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setProjects(projects.filter(p => p.id !== id));
    } catch (err) {
      alert('Error al eliminar: ' + err.message);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    // Validar créditos para modelo Elite
    if (model === 'elite' && credits <= 0) {
      alert("No tienes créditos Elite suficientes. Usa el modelo Rápido o recarga créditos.");
      return;
    }

    setIsGenerating(true);
    setStatus('Conectando con la IA...');

    try {
      // 1. Generar contenido
      const content = await generateSiteContent(prompt, (bytes) => {
        setStatus(`Diseñando... ${bytes} bytes generados`);
      }, model);

      if (!content || typeof content !== 'object') {
        throw new Error("La IA no devolvió un diseño válido.");
      }

      if (content.error) {
        throw new Error(content.error);
      }

      setStatus('Guardando proyecto...');

      // 2. Obtener sesión robusta
      const { data: { session } } = await supabase.auth.getSession();
      
      let user = session?.user;

      if (!user) {
        const { data: { user: refreshedUser }, error: refreshError } = await supabase.auth.getUser();
        if (refreshError || !refreshedUser) {
           throw new Error("Tu sesión expiró. Por favor, recarga la página e inicia sesión.");
        }
        user = refreshedUser;
      }

      // 3. Descontar crédito si es Elite
      if (model === 'elite') {
        const { error: creditError } = await supabase
          .from('profiles')
          .update({ credits: credits - 1 })
          .eq('id', user.id);
        
        if (!creditError) setCredits(prev => prev - 1);
      }

      // 4. Guardar en Supabase
      const { data: project, error } = await supabase
        .from('projects')
        .insert({
          user_id: user.id,
          name: content.meta?.projectName || content.meta?.title || 'Nuevo Proyecto',
          prompt: prompt,
          structured_data: content
        })
        .select()
        .single();

      if (error) throw error;

      // 5. Redirigir
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
      
      <div className="pt-24 lg:pt-32 pb-12 px-4 lg:px-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 max-w-5xl mx-auto px-2 lg:px-0">
          <div className="flex flex-col">
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">Panel de Control</h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Créditos Elite:</span>
              <span className={`text-[10px] font-black px-3 py-1 rounded-full ${credits > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                {credits} 💎
              </span>
              <Link href="/billing" className="text-[10px] text-zinc-500 hover:text-white underline ml-1">Recargar</Link>
            </div>
          </div>
          <button 
            onClick={async () => {
              await supabase.auth.signOut();
              router.push('/login');
            }}
            className="text-xs font-bold text-zinc-400 hover:text-white border border-zinc-800 px-6 py-2.5 rounded-full transition-all active:scale-95"
          >
            Cerrar Sesión
          </button>
        </header>

        <main className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Columna Izquierda: Generador */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 lg:p-8 backdrop-blur-xl h-fit lg:sticky lg:top-32 order-1">
            <h2 className="text-2xl lg:text-3xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Crear Nuevo Sitio
            </h2>
            <p className="text-zinc-400 mb-6 lg:mb-8 text-sm">
              Describe tu idea. La IA diseñará colores, textos y estructura única para ti.
            </p>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isGenerating}
              placeholder="Ej: Un portafolio para un fotógrafo de bodas, estilo minimalista, elegante, con tonos crema y dorados..."
              className="w-full h-32 lg:h-40 bg-black/50 border border-zinc-700 rounded-xl p-4 text-base focus:outline-none focus:border-emerald-500 transition-colors resize-none mb-6"
            />

            {/* Selector de Inteligencia */}
            <div className="flex bg-black/50 p-1 rounded-2xl mb-6 border border-zinc-800">
              <button 
                onClick={() => setModel('fast')}
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${model === 'fast' ? 'bg-zinc-800 text-white shadow-xl' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                ⚡ Rápido
              </button>
              <button 
                onClick={() => setModel('elite')}
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${model === 'elite' ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.4)]' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                💎 Elite
              </button>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full bg-white hover:bg-zinc-200 text-black font-black py-4 rounded-xl text-lg transition-all disabled:opacity-50 disabled:scale-100 active:scale-95 shadow-[0_10px_30px_-10px_rgba(255,255,255,0.3)]"
            >
              {isGenerating ? 'Diseñando...' : 'Generar Sitio Mágico ✨'}
            </button>

            {status && (
              <div className="mt-6 text-center font-mono text-[10px] lg:text-xs text-emerald-400 animate-pulse border border-emerald-500/20 bg-emerald-500/5 p-2 rounded-lg">
                {status}
              </div>
            )}
          </div>

          {/* Columna Derecha: Historial */}
          <div className="order-2">
            <h3 className="text-xl font-bold mb-6 text-zinc-300 px-2 lg:px-0">Tus Sitios Generados</h3>
            
            {projects.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-zinc-800 rounded-2xl mx-2 lg:mx-0">
                <p className="text-zinc-500">Aún no has creado ningún sitio.</p>
              </div>
            ) : (
              <div className="grid gap-4 px-2 lg:px-0 pb-10">
                {projects.map((proj) => (
                  <div 
                    key={proj.id}
                    onClick={() => router.push(`/site/${proj.id}`)}
                    className="group bg-zinc-900/40 border border-zinc-800/60 p-5 lg:p-6 rounded-3xl cursor-pointer hover:border-emerald-500/40 transition-all hover:bg-zinc-800/40 backdrop-blur-sm"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex flex-col gap-1 truncate pr-4">
                         <h4 className="font-bold text-base lg:text-lg group-hover:text-emerald-400 transition-colors truncate">
                           {proj.name || 'Sin Título'}
                         </h4>
                         <span className="text-[9px] text-zinc-600 font-mono uppercase tracking-widest">
                            ID: {proj.id.split('-')[0]}
                         </span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-[10px] text-zinc-500 font-mono">
                          {new Date(proj.created_at).toLocaleDateString()}
                        </span>
                        <button 
                          onClick={(e) => handleDelete(proj.id, e)}
                          className="p-2 opacity-100 lg:opacity-0 group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-all"
                          title="Eliminar proyecto"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                    <p className="text-zinc-500 text-xs lg:text-sm line-clamp-2 text-ellipsis font-light italic">
                      "{proj.prompt}"
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

