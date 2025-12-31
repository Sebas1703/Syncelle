'use client';

import React from 'react';
import BentoGrid from './blocks/BentoGrid';
import Marquee from './blocks/Marquee';
import Narrative from './blocks/Narrative';
import Showcase from './blocks/Showcase';
import CTAFooter from './blocks/CTAFooter';
import ProductGrid from './blocks/ProductGrid';
import TextContent from './blocks/TextContent';
import ContactForm from './blocks/ContactForm';
import ImageBlock from './blocks/ImageBlock';
import { motion } from 'framer-motion';

// Utilidad para asegurar imágenes de alta calidad (Fallback a Unsplash)
const getImageUrl = (data) => {
  if (!data) return "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80";
  if (data.image_url) return data.image_url;
  if (!data.image_prompt) return "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80";
  
  const keywords = encodeURIComponent(data.image_prompt.split(',')[0].trim());
  return `https://source.unsplash.com/featured/1600x900?${keywords}`;
};

const BlockRegistry = {
  'hero': ({ data, variant, onAction }) => {
    const bgImage = getImageUrl(data);
    
    if (variant === 'split') {
      return (
        <section className="min-h-screen w-full flex items-center justify-center p-6 md:p-12 relative overflow-hidden bg-[var(--bg-page)]">
           <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-left"
              >
                  <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter leading-tight" style={{ color: 'var(--text-main)' }}>
                    {data?.headline}
                  </h1>
                  <p className="text-xl md:text-2xl opacity-70 mb-8 font-light leading-relaxed" style={{ color: 'var(--text-main)' }}>
                    {data?.subheadline}
                  </p>
                  <div className="flex gap-4">
                     {data?.cta_primary && (
                        <button className="px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform" style={{ backgroundColor: 'var(--primary)', color: 'black' }}>
                           {data.cta_primary}
                        </button>
                     )}
                  </div>
              </motion.div>

              <motion.div 
                 initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                 whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.8, delay: 0.2 }}
                 className="relative h-[500px] w-full rounded-3xl overflow-hidden shadow-2xl"
              >
                 <img src={bgImage} alt="Hero Visual" className="object-cover w-full h-full" />
                 <div className="absolute bottom-6 left-6 right-6 p-6 glass-panel rounded-2xl">
                    <p className="text-sm text-white/80 font-mono">Premium Digital Experience</p>
                 </div>
              </motion.div>
           </div>
        </section>
      );
    }

    return (
      <section className="min-h-screen w-full flex flex-col justify-center items-center relative overflow-hidden px-4 md:px-8 pt-20">
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
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-page)] via-[var(--bg-page)]/50 to-transparent" />
        </motion.div>
        
        <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
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
  'product-grid': ProductGrid,
  'text-content': TextContent,
  'contact-form': ContactForm,
  'image-block': ImageBlock,
  
  // ALIASES (Para robustez ante alucinaciones de la IA)
  'featured-products': ProductGrid,
  'text': TextContent,
  'image': ImageBlock,
  'form': ContactForm,
  'contact': ContactForm
};

export default function BlockRenderer({ block, index, onAction }) {
  const Component = BlockRegistry[block.type];
  
  if (!Component) {
    return (
      <div className="p-10 border border-red-500/20 bg-red-500/5 m-4 rounded-lg text-red-400 font-mono text-sm">
        [Bloque: {block.type}]
      </div>
    );
  }

  return <Component data={block.data} variant={block.variant} style={block.style} onAction={onAction} />;
}
