'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { getImageUrl } from '@/utils/design-utils';

const Showcase = ({ data }) => {
  const images = data?.items || data?.images || [];

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div className="max-w-2xl">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4" style={{ color: 'var(--text-main)' }}>
            {data?.title || "Galería Visual"}
          </h2>
          <p className="text-xl opacity-60 font-light" style={{ color: 'var(--text-main)' }}>
            {data?.subtitle || "Una mirada profunda a nuestro universo creativo."}
          </p>
        </div>
      </div>

      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {images.map((img, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="relative group overflow-hidden rounded-[2rem] break-inside-avoid shadow-xl"
          >
            <img 
              src={getImageUrl(typeof img === 'string' ? { image_prompt: img } : img)} 
              alt={`Showcase ${idx}`}
              className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
               <span className="px-6 py-2 rounded-full border border-white/20 backdrop-blur-md text-white text-sm font-bold">Ver Detalles</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Showcase;
