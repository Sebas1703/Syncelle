'use client';

import React from 'react';
import BentoGrid from './blocks/BentoGrid';
import Marquee from './blocks/Marquee';
import Narrative from './blocks/Narrative';
import Showcase from './blocks/Showcase';
import CTAFooter from './blocks/CTAFooter';
import { motion } from 'framer-motion';

const fallbackImage = "https://images.unsplash.com/photo-1527254059249-05af64a0bc3f?auto=format&fit=crop&w=1600&q=80";

const NavbarBlock = ({ data, variant }) => {
  const style = variant || "topbar";
  const base = "w-full max-w-6xl mx-auto flex items-center justify-between px-6 py-3";
  const glass = "backdrop-blur-xl bg-black/60 border border-white/10 rounded-full";
  const topbar = "border-b border-white/10";
  const floating = "rounded-full shadow-xl bg-black/70 border border-white/10 px-6";
  const cls = style === "glass" ? glass : style === "floating" ? floating : topbar;
  const links = data?.links || [];
  return (
    <nav className={`sticky top-0 z-40 text-white ${style === "topbar" ? "bg-black/60 backdrop-blur" : "bg-transparent"}`}>
      <div className={`${base} ${cls}`}>
        <div className="flex items-center gap-3">
          <span className="w-9 h-9 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-black">S</span>
          <span className="font-bold text-lg">{data?.brand || "Syncelle"}</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm">
          {links.map((l, i) => (
            <a key={i} href={l.href} className="hover:text-emerald-400 transition-colors">{l.label}</a>
          ))}
          {data?.cta && (
            <a href="/dashboard" className="px-4 py-2 rounded-full bg-white text-black font-semibold hover:scale-105 transition">
              {data.cta}
            </a>
          )}
        </div>
      </div>
    </nav>
  );
};

const FeaturedFlavors = ({ data }) => {
  const items = data?.items || data?.flavors || [];
  const image = data?.image_url || fallbackImage;
  return (
    <section className="py-16 px-4 md:px-8 max-w-6xl mx-auto" id="featured-flavors">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="md:w-1/3">
          <h2 className="text-3xl font-bold mb-3">{data?.title || "Sabores destacados"}</h2>
          <p className="text-base opacity-80">{data?.description || "Una selección curada de nuestros sabores artesanales."}</p>
        </div>
        <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {items.map((it, idx) => (
            <div key={idx} className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <div className="text-sm uppercase tracking-wide text-emerald-400 mb-2">{it.tag || "Nuevo"}</div>
              <h3 className="text-xl font-bold mb-2">{it.title || it.name || `Sabor ${idx+1}`}</h3>
              <p className="text-sm opacity-80 mb-3">{it.description || it.notes || "Sabor artesanal con ingredientes naturales."}</p>
              {(it.image_url || image) && (
                <div className="h-32 rounded-xl overflow-hidden border border-white/5">
                  <img src={it.image_url || image} alt={it.title || "Sabor"} className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ArtisanalProcess = ({ data }) => {
  const steps = data?.steps || data?.items || [];
  return (
    <section className="py-16 px-4 md:px-8 max-w-6xl mx-auto" id="process">
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div>
          <h2 className="text-3xl font-bold mb-3">{data?.title || "Proceso artesanal"}</h2>
          <p className="text-base opacity-80">{data?.description || "Transparencia en cada etapa: ingredientes naturales, producción pequeña, cuidado en el detalle."}</p>
        </div>
        <div className="space-y-4">
          {steps.map((s, idx) => (
            <div key={idx} className="flex gap-4 p-4 rounded-xl border border-white/10 bg-white/5">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 flex items-center justify-center font-bold">{idx+1}</div>
              <div>
                <h4 className="font-semibold">{s.title || s.name || `Paso ${idx+1}`}</h4>
                <p className="text-sm opacity-80">{s.description || s.detail || ""}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const IngredientsBlock = ({ data }) => {
  const items = data?.items || data?.list || [];
  return (
    <section className="py-16 px-4 md:px-8 max-w-6xl mx-auto" id="ingredients">
      <div className="bg-white/3 border border-white/5 rounded-2xl p-8 backdrop-blur">
        <h2 className="text-3xl font-bold mb-4">{data?.title || "Ingredientes y origen"}</h2>
        <p className="text-base opacity-80 mb-6">{data?.description || "Seleccionamos productores locales y materias primas naturales."}</p>
        <div className="flex flex-wrap gap-3">
          {items.map((ing, idx) => (
            <span key={idx} className="px-4 py-2 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-200 text-sm">
              {ing.name || ing.title || ing}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

const LocationHours = ({ data }) => {
  return (
    <section className="py-16 px-4 md:px-8 max-w-6xl mx-auto" id="location">
      <div className="grid md:grid-cols-2 gap-8 items-center rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
        <div>
          <h2 className="text-3xl font-bold mb-3">{data?.title || "Ubicación y horarios"}</h2>
          <p className="text-base opacity-80 mb-4">{data?.description || "Visítanos y vive la experiencia artesanal."}</p>
          <div className="space-y-2 text-sm">
            {data?.address && <div><strong>Dirección:</strong> {data.address}</div>}
            {data?.hours && <div><strong>Horario:</strong> {data.hours}</div>}
            {data?.phone && <div><strong>Tel:</strong> {data.phone}</div>}
          </div>
        </div>
        <div className="w-full h-64 rounded-2xl overflow-hidden border border-white/10 bg-black/30 flex items-center justify-center text-sm opacity-60">
          {data?.map_url ? (
            <iframe src={data.map_url} className="w-full h-full border-0" loading="lazy" />
          ) : (
            "Mapa / foto del local"
          )}
        </div>
      </div>
    </section>
  );
};

const ServiceList = ({ data }) => {
  const items = data?.items || [];
  return (
    <section className="py-16 px-4 md:px-8 max-w-6xl mx-auto" id="services">
      <h2 className="text-3xl font-bold mb-6">{data?.title || "Servicios"}</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {items.map((it, idx) => (
          <div key={idx} className="p-5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur">
            <h3 className="text-xl font-semibold mb-2">{it.title || `Servicio ${idx+1}`}</h3>
            <p className="text-sm opacity-80 mb-3">{it.description || it.subtitle || ""}</p>
            {it.cta && (
              <button className="text-emerald-400 text-sm font-semibold hover:text-emerald-300">{it.cta}</button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

const StoryBlock = ({ data }) => {
  const img = data?.image_url || fallbackImage;
  return (
    <section className="py-16 px-4 md:px-8 max-w-6xl mx-auto" id="story">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-3">{data?.title || "Nuestra historia"}</h2>
          <p className="text-base opacity-80 whitespace-pre-line">{(data?.paragraphs || []).join("\\n") || data?.description || "Compartimos el proceso, los valores y la pasión detrás de cada producto."}</p>
        </div>
        <div className="h-72 rounded-2xl overflow-hidden border border-white/10 shadow-lg">
          <img src={img} alt={data?.title || "Historia"} className="w-full h-full object-cover" />
        </div>
      </div>
    </section>
  );
};

const BlockRegistry = {
  'navbar': NavbarBlock,
  'hero': ({ data, variant }) => {
    const bgImage = data?.image_url || fallbackImage;
    
    // VARIANT: SPLIT (Texto Izq / Imagen Der)
    if (variant === 'split') {
      return (
        <section className="min-h-screen w-full flex items-center justify-center p-6 md:p-12 relative overflow-hidden bg-[var(--bg-page)]">
           <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-left"
              >
                  <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter leading-tight" style={{ color: 'var(--text-main)' }}>
                    {data?.headline}
                  </h1>
                  <p className="text-xl md:text-2xl opacity-70 mb-8 font-light leading-relaxed" style={{ color: 'var(--text-main)' }}>
                    {data?.subheadline}
                  </p>
                  <div className="flex gap-4">
                     {data?.cta_primary && (
                        <button className="px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform" style={{ backgroundColor: 'var(--primary)', color: 'black' }}>
                           {data.cta_primary}
                        </button>
                     )}
                  </div>
              </motion.div>

              <motion.div 
                 initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                 whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.8, delay: 0.2 }}
                 className="relative h-[500px] w-full rounded-3xl overflow-hidden shadow-2xl"
              >
                 <img src={bgImage} alt="Hero Visual" className="object-cover w-full h-full" />
                 {/* Glass overlay en la esquina */}
                 <div className="absolute bottom-6 left-6 right-6 p-6 glass-panel rounded-2xl">
                    <p className="text-sm text-white/80 font-mono">Generated by Syncelle AI</p>
                 </div>
              </motion.div>
           </div>
        </section>
      );
    }

    // VARIANT: DEFAULT (Centered Cinematic)
    return (
      <section className="min-h-screen w-full flex flex-col justify-center items-center relative overflow-hidden px-4 md:px-8 pt-20">
        {/* Capa de Imagen de Fondo con Parallax suave */}
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url('${bgImage}')` }}
          />
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-page)] via-[var(--bg-page)]/50 to-transparent" />
        </motion.div>
        
        {/* Contenido Centrado */}
        <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
          {/* ... resto del contenido centrado ... */}
          <motion.h1 
            initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 tracking-tighter leading-[1.1] text-white drop-shadow-2xl"
          >
            {data?.headline || "Diseño sin límites."}
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-lg md:text-2xl text-white/80 max-w-2xl font-light mb-10 leading-relaxed shadow-black drop-shadow-md"
          >
            {data?.subheadline || "Creamos experiencias digitales que marcan la diferencia."}
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            {data?.cta_primary && (
              <button 
                  className="px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 shadow-[0_0_30px_-5px_var(--primary)] hover:shadow-[0_0_40px_-5px_var(--primary)] active:scale-95"
                  style={{
                    backgroundColor: 'var(--primary)',
                    color: '#000' 
                  }}
              >
                  {data.cta_primary}
              </button>
            )}
            
            {data?.cta_secondary && (
              <button 
                  className="px-8 py-4 rounded-full font-bold text-lg transition-all hover:bg-white/10 border border-white/20 backdrop-blur-md text-white active:scale-95"
              >
                  {data.cta_secondary}
              </button>
            )}
          </motion.div>
        </div>
      </section>
    );
  },
  'bento-grid': BentoGrid,
  'marquee': Marquee,
  'narrative': Narrative,
  'showcase': Showcase,
  'cta-footer': CTAFooter,
  'featured-flavors': FeaturedFlavors,
  'artisanal-process': ArtisanalProcess,
  'ingredients': IngredientsBlock,
  'location-hours': LocationHours,
  'service-list': ServiceList,
  'story': StoryBlock,
};

// Bloque genérico para tipos no mapeados (e.g. featured-flavors, artisanal-process, etc.)
const UnknownBlock = ({ block }) => {
  const title = block.data?.title || block.type || "Sección";
  const description = block.data?.description || block.data?.subheadline || "";
  const items = block.data?.items || block.data?.list || [];
  const image = block.data?.image_url || fallbackImage;
  const hasItems = Array.isArray(items) && items.length > 0;

  return (
    <section className="py-16 px-4 md:px-8 max-w-6xl mx-auto">
      <div className="bg-white/3 border border-white/5 rounded-2xl p-8 backdrop-blur">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-3">{title}</h2>
            {description && <p className="text-lg opacity-80 mb-4">{description}</p>}
            {hasItems && (
              <ul className="space-y-2 text-sm opacity-80">
                {items.map((it, idx) => (
                  <li key={idx} className="flex gap-2 items-start">
                    <span className="text-emerald-400 mt-1">•</span>
                    <span>{typeof it === "string" ? it : (it.title || it.name || JSON.stringify(it))}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="relative w-full h-72 rounded-2xl overflow-hidden shadow-lg">
            <img src={image} alt={title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default function BlockRenderer({ block, index }) {
  const Component = BlockRegistry[block.type];
  
  if (!Component) {
    return <UnknownBlock block={block} />;
  }

  // Pasamos variant y style explícitamente
  return <Component data={block.data} variant={block.variant} style={block.style} />;
}

