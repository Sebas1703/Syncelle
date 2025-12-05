import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import BentoGrid from './components/blocks/BentoGrid';
import Marquee from './components/blocks/Marquee';
import Narrative from './components/blocks/Narrative';
import Showcase from './components/blocks/Showcase';
import CTAFooter from './components/blocks/CTAFooter';

// --- BLOCK REGISTRY SYSTEM ---
// Este objeto mapea los "types" del JSON a componentes de React reales
const BlockRegistry = {
  'hero': ({ data }) => (
    <section className="min-h-screen w-full flex flex-col justify-center items-center bg-zinc-950 text-white p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(16,185,129,0.1),_transparent_50%)]" />
      <motion.h1 
        initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-6xl md:text-8xl font-bold text-center mb-6 relative z-10 tracking-tighter"
      >
        {data?.headline || "Syncelle Design Engine"}
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="text-xl text-zinc-400 max-w-2xl text-center relative z-10 font-light"
      >
        {data?.subheadline || "Ready to render next-gen websites."}
      </motion.p>
      
      {data?.cta_primary && (
         <motion.button 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 px-8 py-4 bg-white text-black rounded-full font-bold hover:bg-emerald-400 transition-colors relative z-10"
         >
            {data.cta_primary}
         </motion.button>
      )}
    </section>
  ),
  'bento-grid': BentoGrid,
  'marquee': Marquee,
  'narrative': Narrative,
  'showcase': Showcase,
  'cta-footer': CTAFooter,
};

// --- COMPONENTE RENDERER ---
// Recibe un bloque genérico y decide qué pintar
const BlockRenderer = ({ block, index }) => {
  const Component = BlockRegistry[block.type];
  
  if (!Component) {
    console.warn(`Block type "${block.type}" not found in registry.`);
    return (
      <div className="p-10 border border-red-500/20 bg-red-500/5 m-4 rounded-lg text-red-400 font-mono text-sm">
        [Módulo Desconocido: {block.type}]
      </div>
    );
  }

  return <Component data={block.data} key={index} />;
};

function App() {
  const [siteData, setSiteData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Intentar cargar datos reales desde localStorage (vienen del Dashboard)
    const storedData = localStorage.getItem('syncelle_site_data');
    
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        setSiteData(parsed);
        setLoading(false);
        console.log("Loaded data from LocalStorage:", parsed);
        return;
      } catch (e) {
        console.error("Error parsing stored data:", e);
      }
    }

    // 2. Si no hay datos, usar Mock (Simulación de carga compleja)
    console.warn("No data in localStorage. Using Mock Data.");
    setTimeout(() => {
      setSiteData({
        meta: { title: "Syncelle Demo" },
        blocks: [
          {
            type: "hero",
            data: { 
              headline: "Diseño sin Límites",
              subheadline: "Transformamos ideas abstractas en experiencias digitales tangibles, bloque a bloque."
            }
          },
          {
            type: "bento-grid",
            data: {
              items: [
                { title: "Velocidad Extrema", description: "Renderizado en milisegundos con optimización global.", size: "large", icon: "⚡" },
                { title: "Diseño Modular", description: "Componentes atómicos reconfigurables.", icon: "🧩" },
                { title: "Animaciones", description: "Transiciones fluidas a 60fps nativas.", icon: "🎬" },
                { title: "SEO Ready", description: "Estructura semántica perfecta.", icon: "🔍" },
                { title: "Escalable", description: "De landing page a portal corporativo.", icon: "📈" },
              ]
            }
          }
        ]
      });
      setLoading(false);
    }, 800);
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-t-2 border-emerald-500 rounded-full animate-spin"></div>
          <div className="text-emerald-500/50 font-mono text-sm tracking-widest">INITIALIZING ENGINE</div>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-black min-h-screen text-white selection:bg-emerald-500/30 selection:text-emerald-200">
      {siteData?.blocks.map((block, index) => (
        <BlockRenderer key={index} block={block} index={index} />
      ))}
    </main>
  );
}

export default App;
