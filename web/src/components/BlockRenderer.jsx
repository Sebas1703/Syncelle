'use client';

import React from 'react';
import BentoGrid from './blocks/BentoGrid';
import Marquee from './blocks/Marquee';
import Narrative from './blocks/Narrative';
import Showcase from './blocks/Showcase';
import CTAFooter from './blocks/CTAFooter';
import { motion } from 'framer-motion';

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

