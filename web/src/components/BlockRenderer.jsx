'use client';

import React from 'react';
import BentoGrid from './blocks/BentoGrid';
import Marquee from './blocks/Marquee';
import Narrative from './blocks/Narrative';
import Showcase from './blocks/Showcase';
import CTAFooter from './blocks/CTAFooter';
import { motion } from 'framer-motion';

// Utilidad para generar imágenes de alta calidad
const getImageUrl = (prompt) => {
  if (!prompt) return null;
  const seed = Math.floor(Math.random() * 1000);
  // Usamos Pollinations para imágenes AI on-the-fly que coinciden con el contexto
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1920&height=1080&nologo=true&seed=${seed}&model=flux`;
};

const BlockRegistry = {
  'hero': ({ data }) => {
    const bgImage = getImageUrl(data.image_prompt || "abstract minimalist 3d shapes, dark background, 8k");
    
    return (
      <section className="min-h-screen w-full flex flex-col justify-center items-center relative overflow-hidden px-4 md:px-8 pt-20">
        {/* Capa de Imagen de Fondo con Parallax suave (simulado con scale) */}
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url('${bgImage}')` }}
          />
          {/* Overlay profesional para asegurar legibilidad */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-page)] via-[var(--bg-page)]/50 to-transparent" />
        </motion.div>
        
        {/* Contenido */}
        <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6"
          >
             <span className="px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-sm font-medium tracking-wide text-[var(--primary)] shadow-[0_0_15px_rgba(0,0,0,0.3)]">
               {data?.subheadline ? data.subheadline.split(' ').slice(0, 3).join(' ') : "Syncelle AI"}
             </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 tracking-tighter leading-[1.1] text-white drop-shadow-2xl"
          >
            {data?.headline || "Diseño sin límites."}
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-lg md:text-2xl text-white/80 max-w-2xl font-light mb-10 leading-relaxed shadow-black drop-shadow-md"
          >
            {data?.subheadline || "Creamos experiencias digitales que marcan la diferencia."}
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            {data?.cta_primary && (
              <button 
                  className="px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 shadow-[0_0_30px_-5px_var(--primary)] hover:shadow-[0_0_40px_-5px_var(--primary)] active:scale-95"
                  style={{
                    backgroundColor: 'var(--primary)',
                    color: '#000' 
                  }}
              >
                  {data.cta_primary}
              </button>
            )}
            
            {data?.cta_secondary && (
              <button 
                  className="px-8 py-4 rounded-full font-bold text-lg transition-all hover:bg-white/10 border border-white/20 backdrop-blur-md text-white active:scale-95"
              >
                  {data.cta_secondary}
              </button>
            )}
          </motion.div>
        </div>
      </section>
    );
  },
  'bento-grid': BentoGrid,
  'marquee': Marquee,
  'narrative': Narrative,
  'showcase': Showcase,
  'cta-footer': CTAFooter,
};

export default function BlockRenderer({ block, index }) {
  const Component = BlockRegistry[block.type];
  
  if (!Component) {
    return (
      <div className="p-10 border border-red-500/20 bg-red-500/5 m-4 rounded-lg text-red-400 font-mono text-sm">
        [Bloque: {block.type}]
      </div>
    );
  }

  return <Component data={block.data} />;
}

