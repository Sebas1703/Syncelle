'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const BentoItem = ({ item, index }) => {
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
        "group relative overflow-hidden rounded-3xl p-8 transition-all duration-300 min-h-[250px]",
        "glass-panel hover:border-white/20 hover:shadow-2xl hover:shadow-[var(--primary)]/10",
        colSpan,
        rowSpan
      )}
    >
      <div 
        className="absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-20" 
        style={{ background: `radial-gradient(circle at 100% 0%, var(--primary), transparent 60%)` }}
      />
      
      <div className="flex h-full flex-col justify-between relative z-10">
        <div className="mb-6 text-4xl" style={{ color: 'var(--primary)' }}>
            {item.icon || "✦"}
        </div>

        <div>
          <h3 className="text-2xl font-bold mb-2 tracking-tight" style={{ color: 'var(--text-main)' }}>
            {item.title}
          </h3>
          <p className="text-base font-light leading-relaxed opacity-70" style={{ color: 'var(--text-main)' }}>
            {item.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default function BentoGrid({ data }) {
  // ADAPTACIÓN DE DATOS: Soporta tanto 'items' como 'features'
  let items = data?.items || [];
  
  if (items.length === 0 && data?.features) {
    items = data.features.map(f => ({
      title: typeof f === 'string' ? f : f.title,
      description: typeof f === 'string' ? "Excelencia garantizada en cada detalle de nuestro servicio." : f.description,
      icon: "✦"
    }));
  }

  if (items.length === 0) return null;

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
