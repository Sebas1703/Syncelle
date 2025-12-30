import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utilidad para combinar clases (shadcn-like)
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const BentoItem = ({ item, index }) => {
  // Determinamos el tamaño de la celda basado en la propiedad 'size' o por defecto
  const isLarge = item.size === 'large';
  const colSpan = isLarge ? "md:col-span-2" : "md:col-span-1";
  const rowSpan = isLarge ? "md:row-span-2" : "md:row-span-1";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className={cn(
        "group relative overflow-hidden rounded-3xl p-8 transition-all duration-300",
        "glass-panel hover:border-white/20 hover:shadow-2xl hover:shadow-[var(--primary)]/10",
        colSpan,
        rowSpan
      )}
    >
      {/* Fondo degradado sutil dinámico */}
      <div 
        className="absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-20" 
        style={{
            background: `radial-gradient(circle at 100% 0%, var(--primary), transparent 60%)`
        }}
      />
      
      <div className="flex h-full flex-col justify-between relative z-10">
        {/* Icono o Elemento Visual Superior */}
        <div className="mb-6 text-4xl" style={{ color: 'var(--primary)' }}>
            {item.icon || "✦"}
        </div>

        {/* Contenido Texto */}
        <div>
          <h3 className="text-2xl font-bold mb-2 tracking-tight" style={{ color: 'var(--text-main)' }}>
            {item.title}
          </h3>
          <p className="text-base font-light leading-relaxed opacity-70" style={{ color: 'var(--text-main)' }}>
            {item.description}
          </p>
        </div>
      </div>

      {/* Decoración Glow */}
      {isLarge && (
        <div 
            className="absolute -right-10 -top-10 h-64 w-64 rounded-full blur-[80px] transition-all duration-700 opacity-20 group-hover:opacity-40" 
            style={{ backgroundColor: 'var(--secondary)' }}
        />
      )}
    </motion.div>
  );
};

export default function BentoGrid({ data }) {
  const items = data?.items || [];

  return (
    <section className="w-full py-20 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[minmax(180px,auto)]">
        {items.map((item, idx) => (
          <BentoItem key={idx} item={item} index={idx} />
        ))}
      </div>
    </section>
  );
}

