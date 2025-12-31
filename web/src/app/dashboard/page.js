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
    <div className="min-h-screen bg-[#050505] text-zinc-100 selection:bg-emerald-500/30 overflow-x-hidden">
      <Navbar />
      
      <div className="pt-32 lg:pt-40 pb-24 px-4 lg:px-12 max-w-7xl mx-auto">
        {/* HEADER MINIMALISTA */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-20">
          <div className="space-y-2">
            <h1 className="text-4xl lg:text-6xl font-black tracking-tighter text-white">
              Studio<span className="text-emerald-500">.</span>
            </h1>
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2 px-3 py-1 bg-zinc-900/50 border border-zinc-800 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Status: Pro Plan</span>
               </div>
               <div className="flex items-center gap-2 px-3 py-1 bg-zinc-900/50 border border-zinc-800 rounded-full">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Credits: {credits} 💎</span>
               </div>
            </div>
          </div>
          
          <button 
            onClick={async () => {
              await supabase.auth.signOut();
              router.push('/login');
            }}
            className="group flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-white transition-all"
          >
            Cerrar Sesión 
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </header>

        <main className="space-y-32">
          {/* SECCIÓN GENERADOR: El Corazón del Dashboard */}
          <section className="relative">
            {/* Elementos Decorativos de Fondo (Aura) */}
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-4xl mx-auto glass-panel-strong p-8 lg:p-16 rounded-[3rem] border-white/5 shadow-2xl relative z-10">
              <div className="max-w-2xl mx-auto text-center space-y-6 mb-12">
                <h2 className="text-3xl lg:text-5xl font-bold tracking-tight text-white">
                  ¿Qué vamos a <span className="italic-serif text-emerald-400">crear</span> hoy?
                </h2>
                <p className="text-zinc-500 text-sm lg:text-base font-medium">
                  Define tu visión en una frase. Nuestra IA se encargará del diseño, la estructura y el alma de tu sitio.
                </p>
              </div>

              <div className="space-y-8">
                <div className="relative group">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    disabled={isGenerating}
                    placeholder="Ej: Una boutique de perfumes de lujo con estética minimalista y tipografía brutalista..."
                    className="w-full h-48 bg-black/40 border border-zinc-800 rounded-3xl p-8 text-lg lg:text-xl focus:outline-none focus:border-emerald-500/50 transition-all resize-none placeholder:text-zinc-700 leading-relaxed shadow-inner"
                  />
                  <div className="absolute bottom-6 right-8 flex items-center gap-2 pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity">
                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest font-mono">
                      {prompt.length} caracteres
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Selector Inteligencia */}
                  <div className="flex bg-black/40 p-1.5 rounded-2xl border border-zinc-800">
                    <button 
                      onClick={() => setModel('fast')}
                      className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${model === 'fast' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-400'}`}
                    >
                      ⚡ Rápido
                    </button>
                    <button 
                      onClick={() => setModel('elite')}
                      className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${model === 'elite' ? 'bg-gradient-to-r from-emerald-500 to-emerald-400 text-black' : 'text-zinc-500 hover:text-zinc-400'}`}
                    >
                      💎 Elite
                    </button>
                  </div>

                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating || !prompt.trim()}
                    className="relative overflow-hidden group bg-white text-black font-black py-4 rounded-2xl text-lg lg:text-xl transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:scale-100 disabled:hover:scale-100 shadow-[0_20px_40px_-15px_rgba(255,255,255,0.2)]"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isGenerating ? (
                        <>
                          <span className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                          Procesando visión...
                        </>
                      ) : 'Generar Sitio Mágico ✨'}
                    </span>
                  </button>
                </div>

                {status && (
                  <div className="pt-4 text-center">
                    <span className="inline-block px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full font-mono text-[10px] text-emerald-400 animate-pulse uppercase tracking-widest">
                      {status}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* SECCIÓN PROYECTOS: Gallery Style */}
          <section className="space-y-12 pb-20">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-8">
               <h3 className="text-2xl font-bold tracking-tight text-zinc-300">Colección de Sitios</h3>
               <span className="text-xs font-mono text-zinc-600 uppercase tracking-widest">
                  {projects.length} sitios generados
               </span>
            </div>
            
            {projects.length === 0 ? (
              <div className="text-center py-32 border-2 border-dashed border-zinc-900 rounded-[3rem] opacity-30">
                <p className="text-lg font-medium">Tu galería está vacía.</p>
                <p className="text-sm">Empieza por describir tu primera idea arriba.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((proj) => (
                  <div 
                    key={proj.id}
                    onClick={() => router.push(`/site/${proj.id}`)}
                    className="group relative flex flex-col h-[400px] bg-zinc-900/20 border border-zinc-800/50 rounded-[2.5rem] overflow-hidden cursor-pointer hover:border-emerald-500/30 transition-all hover:bg-zinc-800/20 backdrop-blur-sm shadow-xl"
                  >
                    {/* Preview Area (Simulado o real si tuviéramos capturas) */}
                    <div className="h-48 bg-zinc-900/50 relative overflow-hidden flex items-center justify-center p-8">
                       <div className="w-full h-full border border-zinc-800 rounded-xl bg-black/40 opacity-40 group-hover:scale-105 transition-transform duration-700" />
                       <span className="absolute text-[8px] font-black uppercase tracking-[0.4em] text-zinc-800">
                          Syncelle Site Preview
                       </span>
                    </div>

                    <div className="flex-1 p-8 flex flex-col">
                      <div className="flex justify-between items-start mb-4">
                        <div className="space-y-1 truncate pr-4">
                           <h4 className="font-bold text-xl group-hover:text-emerald-400 transition-colors truncate">
                             {proj.name || 'Sin Título'}
                           </h4>
                           <p className="text-[10px] text-zinc-600 font-mono">CREADO EL {new Date(proj.created_at).toLocaleDateString()}</p>
                        </div>
                        <button 
                          onClick={(e) => handleDelete(proj.id, e)}
                          className="p-3 bg-zinc-950 border border-zinc-800 opacity-0 group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-500 rounded-2xl transition-all active:scale-90"
                          title="Eliminar"
                        >
                          🗑️
                        </button>
                      </div>
                      
                      <p className="text-zinc-500 text-sm line-clamp-3 leading-relaxed font-light italic mt-auto">
                        "{proj.prompt}"
                      </p>
                    </div>

                    {/* Botón flotante para entrar */}
                    <div className="absolute bottom-6 right-8 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                       <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-black text-sm shadow-2xl">
                          ↗
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
      </div>
    </div>
  );
}

