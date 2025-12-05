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
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.08)" }}
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-colors",
        colSpan,
        rowSpan
      )}
    >
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      
      <div className="flex h-full flex-col justify-between">
        {/* Icono o Elemento Visual Superior */}
        <div className="mb-4 text-4xl text-emerald-400">
            {/* Placeholder para iconos dinámicos, por ahora un emoji o div */}
            {item.icon || "✨"}
        </div>

        {/* Contenido Texto */}
        <div>
          <h3 className="text-xl font-bold text-white mb-1">{item.title}</h3>
          <p className="text-sm text-zinc-400 leading-relaxed">
            {item.description}
          </p>
        </div>
      </div>

      {/* Elemento decorativo opcional */}
      {isLarge && (
        <div className="absolute right-4 top-4 h-32 w-32 rounded-full bg-emerald-500/10 blur-3xl group-hover:bg-emerald-500/20 transition-all" />
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

