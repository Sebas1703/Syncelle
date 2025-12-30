'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';

// Variantes de animación
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30">
      <Navbar />

      <main className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* HERO SECTION */}
        <section className="max-w-7xl mx-auto flex flex-col items-center text-center mb-32 relative z-10">
          
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col items-center"
          >
            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-sm mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-sm font-medium text-emerald-400 tracking-wide">WEB BUILDER CON IA</span>
            </motion.div>

            <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
              Tu página web.<br />
              <span className="text-emerald-500">Sin complicaciones.</span>
            </motion.h1>

            <motion.p variants={fadeIn} className="text-xl text-zinc-400 max-w-2xl mb-10 leading-relaxed">
              Syncelle diseña, construye y publica tu sitio web profesional en segundos usando inteligencia artificial de vanguardia.
            </motion.p>

            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4">
              <Link href="/dashboard" className="group relative px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-full text-lg transition-all hover:scale-105 shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)]">
                <span className="relative z-10">Crea tu sitio gratis</span>
                <div className="absolute inset-0 rounded-full bg-white/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link href="#como-funciona" className="px-8 py-4 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white font-medium rounded-full text-lg transition-all">
                Ver cómo funciona
              </Link>
            </motion.div>
          </motion.div>

          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
        </section>

        {/* CÓMO FUNCIONA */}
        <section id="como-funciona" className="max-w-6xl mx-auto mb-32">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">De idea a realidad en segundos</h2>
            <p className="text-zinc-500 text-lg">Tres pasos simples. Resultados profesionales.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-zinc-800 to-transparent -z-10" />

            {[
              { num: "01", title: "Describe tu idea", desc: "Cuéntanos qué necesitas. Una cafetería, un portafolio o una startup.", icon: "💡" },
              { num: "02", title: "La IA Diseña", desc: "Nuestro motor genera estructura, textos y diseño visual único.", icon: "✨" },
              { num: "03", title: "Publica", desc: "Obtén tu enlace personalizado y comparte tu negocio con el mundo.", icon: "🚀" }
            ].map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="bg-zinc-900/50 border border-zinc-800/50 backdrop-blur-xl p-8 rounded-3xl relative group hover:border-emerald-500/30 transition-colors"
              >
                <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-inner border border-zinc-700">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{step.desc}</p>
                <span className="absolute top-8 right-8 text-6xl font-bold text-zinc-800/50 -z-10">{step.num}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* PLANES Y PRECIOS */}
        <section id="precios" className="max-w-6xl mx-auto mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Precios transparentes</h2>
            <p className="text-zinc-500 text-lg">Sin contratos ocultos. Cancela cuando quieras.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 items-center">
            {/* Plan Básico */}
            <PlanCard 
              name="Básico" 
              price="$19" 
              features={["1 Página Estática", "Diseño Profesional", "Soporte por Email"]} 
            />
            
            {/* Plan Pro (Destacado) */}
            <PlanCard 
              name="Pro" 
              price="$29" 
              features={["Hasta 3 Páginas", "Diseño Personalizado", "Soporte Prioritario", "Mantenimiento Incluido"]} 
              isPopular 
            />

            {/* Plan Premium */}
            <PlanCard 
              name="Premium" 
              price="$49" 
              features={["Páginas Ilimitadas", "Diseño Avanzado", "Soporte 24/7", "Integraciones a Medida"]} 
            />
          </div>
        </section>

        {/* FUNDADOR - REFINADO (Sobriedad y Confianza) */}
        <section className="max-w-3xl mx-auto mb-20">
          <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-8 flex flex-col md:flex-row gap-6 items-center hover:border-zinc-700 transition-colors">
            {/* Foto Monocromática y Compacta */}
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-500">
               {/* Usamos un div con gradiente si no hay foto, o la etiqueta img si existiera */}
               <div className="w-full h-full bg-gradient-to-br from-zinc-700 to-zinc-900" />
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <p className="text-lg text-zinc-300 font-medium leading-relaxed mb-3">
                "Syncelle elimina las barreras técnicas para que cualquier negocio tenga presencia digital real, sin depender de agencias ni contratos abusivos."
              </p>
              <div className="flex flex-col md:flex-row items-center gap-2 justify-center md:justify-start text-sm">
                <span className="font-bold text-white">Sebastián Pérez</span>
                <span className="hidden md:inline text-zinc-600">•</span>
                <span className="text-zinc-500">Fundador</span>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-zinc-900 bg-black py-10 text-center text-zinc-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Syncelle. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

// Componente auxiliar para Tarjetas de Precios
function PlanCard({ name, price, features, isPopular }) {
  return (
    <div className={`relative p-8 rounded-3xl border transition-transform hover:-translate-y-2 duration-300 ${
      isPopular 
        ? 'bg-zinc-900/80 border-emerald-500/50 shadow-2xl shadow-emerald-900/20 scale-105 z-10' 
        : 'bg-black border-zinc-800 hover:border-zinc-700'
    }`}>
      {isPopular && (
        <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          Más Popular
        </span>
      )}
      <h3 className="text-xl font-medium text-zinc-400 mb-2">{name}</h3>
      <div className="text-4xl font-bold text-white mb-6">
        {price}<span className="text-lg text-zinc-500 font-normal">/mes</span>
      </div>
      <ul className="space-y-4 mb-8">
        {features.map((feat, i) => (
          <li key={i} className="flex items-center gap-3 text-sm text-zinc-300">
            <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {feat}
          </li>
        ))}
      </ul>
      <button className={`w-full py-3 rounded-xl font-bold transition-colors ${
        isPopular 
          ? 'bg-emerald-500 hover:bg-emerald-400 text-black' 
          : 'bg-zinc-800 hover:bg-zinc-700 text-white'
      }`}>
        Elegir {name}
      </button>
    </div>
  );
}
