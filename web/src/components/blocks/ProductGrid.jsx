'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { getImageUrl } from '@/utils/design-utils';

const ProductCard = ({ product, onAction }) => {
  const imageUrl = getImageUrl(product);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group"
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem] bg-[var(--surface)] mb-6 border border-white/5 shadow-lg group-hover:shadow-[var(--primary)]/10 transition-all duration-500">
        <img 
          src={imageUrl} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <button 
          onClick={() => onAction?.({ type: 'ADD_TO_CART', payload: product })}
          className="absolute bottom-6 left-6 right-6 bg-white text-black py-4 rounded-2xl font-bold opacity-0 translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0 shadow-2xl active:scale-95"
        >
          Añadir al Carrito
        </button>
      </div>
      
      <div className="px-2">
        <h3 className="text-xl font-bold mb-1 tracking-tight" style={{ color: 'var(--text-main)' }}>{product.name}</h3>
        <p className="text-sm opacity-50 mb-3 line-clamp-1" style={{ color: 'var(--text-main)' }}>{product.description || product.desc || "Calidad excepcional y diseño exclusivo."}</p>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-black" style={{ color: 'var(--primary)' }}>{product.price}</span>
          {product.isNew && (
              <span className="text-[10px] font-black uppercase tracking-tighter px-3 py-1 bg-[var(--primary)] text-black rounded-full shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]">Nuevo</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const ProductGrid = ({ data, onAction }) => {
  const products = data?.products || data?.items || [];

  return (
    <section className="py-32 px-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
        <div className="max-w-2xl text-left">
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 leading-none" style={{ color: 'var(--text-main)' }}>
            {data?.title || data?.headline || "Colección Exclusiva"}
          </h2>
          <p className="text-xl md:text-2xl opacity-60 font-light leading-relaxed" style={{ color: 'var(--text-main)' }}>
            {data?.subtitle || data?.subheadline || "Piezas seleccionadas para quienes definen el mañana."}
          </p>
        </div>
        <div className="flex gap-3">
           <span className="px-6 py-2 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 cursor-pointer transition-opacity">Todos</span>
           <span className="px-6 py-2 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 cursor-pointer transition-opacity">Limitados</span>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-white/10 rounded-[3rem] opacity-30">
          <p className="text-xl font-light">Cargando catálogo premium...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
          {products.map((product, idx) => (
            <ProductCard key={idx} product={product} onAction={onAction} />
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductGrid;
