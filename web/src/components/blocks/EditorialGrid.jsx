'use client';
import { motion } from 'framer-motion';
import { getImageUrl } from '@/utils/design-utils';

export default function EditorialGrid({ data }) {
  const items = data.items || [];

  return (
    <section className="py-32 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-32">
        {items.map((item, i) => (
          <div 
            key={i} 
            className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-16 md:gap-32`}
          >
            {/* IMAGEN ASIMÉTRICA */}
            <motion.div 
              initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex-1 w-full"
            >
              <div className="relative group">
                <div className="absolute -inset-4 bg-[var(--surface)] rounded-[3rem] -z-10 scale-95 group-hover:scale-100 transition-transform duration-700" />
                <img 
                  src={getImageUrl(item)} 
                  alt={item.title} 
                  className="w-full aspect-[4/5] object-cover rounded-[2.5rem] shadow-2xl transition-transform duration-700 group-hover:-translate-y-4" 
                />
              </div>
            </motion.div>

            {/* CONTENIDO EDITORIAL */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex-1 flex flex-col items-start"
            >
              <span className="text-[var(--primary)] font-bold text-xs tracking-widest uppercase mb-4">0{i + 1} / Insight</span>
              <h3 className="text-4xl md:text-6xl font-bold mb-6 tracking-tighter leading-none italic-serif">
                {item.title}
              </h3>
              <p className="text-xl opacity-60 font-light leading-relaxed mb-8">
                {item.description}
              </p>
              <div className="h-px w-24 bg-white/20 mb-8" />
              <button className="text-sm font-black uppercase tracking-widest hover:text-[var(--primary)] transition-colors">
                Ver Detalles →
              </button>
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  );
}

