'use client';
import { motion } from 'framer-motion';

export default function ContactForm({ data }) {
  return (
    <section className="py-24 px-6 max-w-xl mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="glass-panel-strong p-8 md:p-12 rounded-[2rem] border border-white/10"
      >
        <h2 className="text-3xl font-bold mb-2 tracking-tighter" style={{ color: 'var(--text-main)' }}>{data?.title || "Hablemos"}</h2>
        <p className="text-zinc-500 mb-8">{data?.subtitle || "Cuéntanos sobre tu próximo gran proyecto."}</p>
        
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <input 
            type="text" 
            placeholder="Nombre completo"
            className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-[var(--primary)] transition-colors"
          />
          <input 
            type="email" 
            placeholder="Correo electrónico"
            className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-[var(--primary)] transition-colors"
          />
          <textarea 
            placeholder="Tu mensaje..."
            rows={4}
            className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-[var(--primary)] transition-colors resize-none"
          />
          <button 
            className="w-full py-4 rounded-2xl font-bold text-black transition-transform active:scale-95"
            style={{ backgroundColor: 'var(--primary)' }}
          >
            {data?.buttonText || "Enviar Mensaje"}
          </button>
        </form>
      </motion.div>
    </section>
  );
}

