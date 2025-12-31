'use client';
import { motion } from 'framer-motion';

export default function ImageBlock({ data }) {
  return (
    <section className="py-12 px-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="aspect-video w-full rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl"
      >
        <img 
          src={data.image_url} 
          alt={data.alt || "Visual content"} 
          className="w-full h-full object-cover"
        />
      </motion.div>
    </section>
  );
}

