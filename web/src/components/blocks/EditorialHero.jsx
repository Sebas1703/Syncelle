'use client';
import { motion } from 'framer-motion';
import { getImageUrl } from '@/utils/design-utils';

export default function EditorialHero({ data, onAction }) {
  const imageUrl = getImageUrl(data);
  
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center px-6 py-20 overflow-hidden bg-[var(--bg-page)]">
      {/* Texto de fondo decorativo masivo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none opacity-[0.02] text-[25vw] font-black leading-none whitespace-nowrap z-0">
        {data.title?.split(' ')[0]}
      </div>

      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* LADO IZQUIERDO: CONTENIDO EDITORIAL */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          <motion.span 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-[var(--primary)] font-mono text-sm tracking-[0.3em] uppercase mb-6"
          >
            {data.eyebrow || "Selected Collection"}
          </motion.span>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl md:text-[7rem] font-bold leading-[0.9] tracking-tighter mb-8 italic-serif"
            style={{ color: 'var(--text-main)' }}
          >
            {data.title}
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl opacity-60 max-w-xl mb-10 font-light leading-relaxed"
            style={{ color: 'var(--text-main)' }}
          >
            {data.subtitle}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex gap-6 items-center"
          >
            <button 
              onClick={() => onAction?.({ type: 'NAVIGATE', payload: 'products' })}
              className="group relative px-10 py-5 bg-white text-black font-bold rounded-full overflow-hidden transition-transform active:scale-95"
            >
              <span className="relative z-10">{data.cta || "Explorar Ahora"}</span>
              <div className="absolute inset-0 bg-[var(--primary)] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>
          </motion.div>
        </div>

        {/* LADO DERECHO: IMAGEN ARTÍSTICA */}
        <div className="lg:col-span-5 relative">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative aspect-[3/4] w-full rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white/5"
          >
            <img 
              src={imageUrl} 
              alt="Editorial Visual" 
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 scale-110 hover:scale-100" 
            />
            {/* Overlay decorativo */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
          </motion.div>
          
          {/* Elemento flotante asimétrico */}
          <motion.div 
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-6 -left-6 p-6 glass-panel-strong rounded-2xl hidden md:block max-w-[200px]"
          >
            <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-2">Details</p>
            <p className="text-xs font-medium leading-tight">Handcrafted excellence in every single pixel.</p>
          </motion.div>
        </div>

      </div>
    </section>
  );
}

