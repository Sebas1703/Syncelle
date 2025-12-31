'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';

export default function BillingPage() {
  const [loading, setLoading] = useState(false);

  const plans = [
    {
      name: "Starter Pack",
      credits: 5,
      price: "$9",
      description: "Perfecto para probar ideas rápidas.",
      color: "zinc"
    },
    {
      name: "Pro Pack",
      credits: 20,
      price: "$29",
      description: "Para emprendedores que lanzan proyectos reales.",
      color: "emerald",
      popular: true
    },
    {
      name: "Enterprise",
      credits: 100,
      price: "$99",
      description: "Potencia máxima para agencias.",
      color: "white"
    }
  ];

  const handleBuy = (plan) => {
    setLoading(true);
    // Aquí iría la lógica de Stripe Checkout
    alert(`Redirigiendo a Stripe para el ${plan.name}... (Próximamente)`);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">Recarga tus Créditos Elite</h1>
          <p className="text-zinc-400 text-xl max-w-2xl mx-auto">
            El modelo 💎 Elite usa GPT-4o para darte la máxima calidad de diseño, e-commerce avanzado y multi-página.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative p-8 rounded-3xl border ${
                plan.popular ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-zinc-800 bg-zinc-900/30'
              } flex flex-col`}
            >
              {plan.popular && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-black text-[10px] font-black uppercase px-3 py-1 rounded-full">
                  Más Popular
                </span>
              )}
              
              <h3 className="text-zinc-400 font-bold mb-2 uppercase tracking-widest text-xs">{plan.name}</h3>
              <div className="text-5xl font-black mb-4 flex items-baseline gap-2">
                {plan.credits}
                <span className="text-xl font-medium text-zinc-600">💎</span>
              </div>
              <p className="text-zinc-400 text-sm mb-8 leading-relaxed">{plan.description}</p>
              
              <div className="mt-auto">
                <div className="text-2xl font-bold mb-6">{plan.price} <span className="text-sm font-normal text-zinc-500">USD</span></div>
                <button 
                  onClick={() => handleBuy(plan)}
                  disabled={loading}
                  className={`w-full py-4 rounded-xl font-bold transition-all active:scale-95 ${
                    plan.popular ? 'bg-emerald-500 text-black' : 'bg-white text-black'
                  }`}
                >
                  {loading ? 'Procesando...' : 'Comprar Créditos'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 max-w-2xl mx-auto p-8 rounded-3xl border border-dashed border-zinc-800 text-center">
          <h4 className="font-bold mb-2">¿Necesitas una suscripción mensual?</h4>
          <p className="text-sm text-zinc-500">Contáctanos para planes personalizados de alta escala.</p>
        </div>
      </div>
    </div>
  );
}

