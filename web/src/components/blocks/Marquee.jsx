import React from 'react';
import { motion } from 'framer-motion';

const Marquee = ({ data }) => {
  // Duplicamos los items para asegurar el loop infinito sin cortes
  const items = [...(data?.items || []), ...(data?.items || []), ...(data?.items || [])];

  return (
    <div className="relative flex overflow-hidden py-10 bg-zinc-950 border-y border-white/5">
      <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-transparent to-zinc-950 z-10 pointer-events-none" />
      
      <motion.div
        className="flex gap-12 whitespace-nowrap"
        animate={{ x: [0, -1000] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 20,
            ease: "linear",
          },
        }}
      >
        {items.map((text, i) => (
          <div key={i} className="flex items-center gap-4">
            <span className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50 uppercase tracking-tighter">
              {text}
            </span>
            <span className="text-emerald-500 text-2xl">✦</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default Marquee;

