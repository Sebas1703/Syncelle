import React from 'react';
import { motion } from 'framer-motion';

const fallbackImage = "https://images.unsplash.com/photo-1527254059249-05af64a0bc3f?auto=format&fit=crop&w=1200&q=80";

const Narrative = ({ data, variant = 'image-right', style }) => {
  const imageUrl = data.image_url || fallbackImage;
  const isImageLeft = variant === 'image-left';

  return (
    <section 
      className="py-24 px-6 w-full"
      style={{ backgroundColor: style?.backgroundColor || 'transparent' }}
    >
      <div className={`max-w-7xl mx-auto flex flex-col gap-12 items-center ${isImageLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
        
        {/* TEXTO */}
        <motion.div 
          initial={{ opacity: 0, x: isImageLeft ? 50 : -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex-1"
        >
          <h2 className="text-sm font-mono mb-6 tracking-widest uppercase" style={{ color: 'var(--primary)' }}>
            {data?.title || "Nuestra Filosofía"}
          </h2>
          <div className="space-y-6">
            {data?.paragraphs?.map((p, i) => (
              <p 
                key={i} 
                className="text-xl md:text-3xl leading-relaxed font-light"
                style={{ color: 'var(--text-main)', opacity: 0.9 }}
              >
                {p}
              </p>
            ))}
          </div>
        </motion.div>

        {/* IMAGEN */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex-1 w-full aspect-[4/5] md:aspect-square overflow-hidden rounded-2xl relative shadow-2xl"
        >
          <img 
            src={imageUrl} 
            alt="Narrative Visual" 
            className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
          />
          {/* Sombra interna para integrar */}
          <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl" />
        </motion.div>

      </div>
    </section>
  );
};

export default Narrative;
