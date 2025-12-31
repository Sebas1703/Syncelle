'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { getImageUrl } from '@/utils/design-utils';

const Narrative = ({ data, variant = 'image-right', style }) => {
  const imageUrl = getImageUrl(data);
  const isImageLeft = variant === 'image-left';

  // Soporte para múltiples formas de enviar el texto
  const paragraphs = data?.paragraphs || (data?.text ? [data.text] : ["Nuestra historia comienza con una visión de excelencia y diseño sin precedentes."]);

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
            {data?.title || data?.headline || "Nuestra Filosofía"}
          </h2>
          <div className="space-y-6">
            {paragraphs.map((p, i) => (
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
          <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl" />
        </motion.div>

      </div>
    </section>
  );
};

export default Narrative;
