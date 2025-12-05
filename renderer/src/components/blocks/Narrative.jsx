import React from 'react';
import { motion } from 'framer-motion';

const Narrative = ({ data }) => {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto flex flex-col md:flex-row gap-12 items-start">
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="flex-1"
      >
        <h2 className="text-sm font-mono text-emerald-400 mb-4 tracking-widest uppercase">
          {data?.title || "Our Philosophy"}
        </h2>
        <div className="space-y-6">
          {data?.paragraphs?.map((p, i) => (
            <p key={i} className="text-xl md:text-2xl text-zinc-300 leading-relaxed font-light">
              {p}
            </p>
          ))}
        </div>
      </motion.div>

      {data?.image_url && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="flex-1 w-full aspect-video md:aspect-square overflow-hidden rounded-2xl"
        >
          <img 
            src={data.image_url} 
            alt="Narrative" 
            className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-700"
          />
        </motion.div>
      )}
    </section>
  );
};

export default Narrative;

