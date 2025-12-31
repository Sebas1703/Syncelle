'use client';
import { motion } from 'framer-motion';

export default function TextContent({ data }) {
  return (
    <section className="py-20 px-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        {data.title && <h2 className="text-3xl md:text-5xl font-bold mb-8 tracking-tighter" style={{ color: 'var(--text-main)' }}>{data.title}</h2>}
        <div className="prose prose-invert max-w-none opacity-70 text-lg leading-relaxed" style={{ color: 'var(--text-main)' }}>
          {data.text || data.content}
        </div>
      </motion.div>
    </section>
  );
}

