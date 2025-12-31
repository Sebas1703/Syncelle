'use client';

import React from 'react';
import { motion } from 'framer-motion';

const ProductCard = ({ product, onAction }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group"
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-[var(--surface)] mb-4">
        <img 
          src={product.image_url || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80"} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <button 
          onClick={() => onAction?.({ type: 'ADD_TO_CART', payload: product })}
          className="absolute bottom-4 left-4 right-4 bg-white text-black py-3 rounded-xl font-bold opacity-0 translate-y-4 transition-all group-hover:opacity-100 group-hover:translate-y-0 shadow-xl active:scale-95"
        >
          Añadir al Carrito
        </button>
      </div>
      <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--text-main)' }}>{product.name}</h3>
      <p className="text-sm opacity-60 mb-2" style={{ color: 'var(--text-main)' }}>{product.desc}</p>
      <span className="text-xl font-black" style={{ color: 'var(--primary)' }}>{product.price}</span>
    </motion.div>
  );
};

const ProductGrid = ({ data, onAction }) => {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div className="max-w-2xl">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4" style={{ color: 'var(--text-main)' }}>
            {data?.title || "Colección Exclusiva"}
          </h2>
          <p className="text-xl opacity-60 font-light" style={{ color: 'var(--text-main)' }}>
            Diseños seleccionados para quienes buscan lo extraordinario.
          </p>
        </div>
        <div className="flex gap-4">
           {/* Filtros decorativos profesionales */}
           <span className="px-4 py-2 rounded-full border border-white/10 text-xs font-bold uppercase tracking-widest opacity-40">Todo</span>
           <span className="px-4 py-2 rounded-full border border-white/10 text-xs font-bold uppercase tracking-widest opacity-40">Novedades</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {data?.products?.map((product, idx) => (
          <ProductCard key={idx} product={product} onAction={onAction} />
        ))}
      </div>
    </section>
  );
};

export default ProductGrid;

