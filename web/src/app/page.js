import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function Home() {
  return (
    <>
      <Navbar />
      
      <main className="pt-20">
        {/* HERO SECTION */}
        <section className="cta-hero">
          <div className="cta-hero__container">
            <div className="cta-hero__text">
              <h1>Tu página web. <br/>Activa mientras la necesites.</h1>
              <p className="subtitle">Una suscripción. Una web. Cero complicaciones.</p>
              <Link href="/login" className="cta-main">Solicita la tuya</Link>
            </div>
            <div className="cta-hero__mockup">
              <Image src="/mockup.png" alt="Mockup ejemplo" width={600} height={400} priority />
            </div>
          </div>
        </section>

        {/* CÓMO FUNCIONA */}
        <section id="como-funciona" className="py-20 px-4 max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-emerald-400 mb-12">¿Cómo funciona?</h2>
          <div className="steps">
            <div className="step">
              <div className="icon-step">📞</div>
              <h3 className="text-xl font-bold text-white">Te contactas</h3>
            </div>
            <div className="hidden md:block text-emerald-500 text-4xl">→</div>
            <div className="step">
              <div className="icon-step">🖥️</div>
              <h3 className="text-xl font-bold text-white">Diseñamos y publicamos</h3>
            </div>
            <div className="hidden md:block text-emerald-500 text-4xl">→</div>
            <div className="step">
              <div className="icon-step">💳</div>
              <h3 className="text-xl font-bold text-white">Pagas mes a mes</h3>
            </div>
          </div>
        </section>

        {/* PLANES */}
        <section id="planes" className="planes-precios">
          <h2 className="text-3xl font-bold text-emerald-400 mb-8">Planes y precios</h2>
          <div className="planes-grid">
            <div className="plan-card">
              <div className="plan-nombre">Básico</div>
              <div className="plan-precio">$19<span className="text-sm font-normal text-zinc-400">/mes</span></div>
              <ul className="plan-detalles">
                <li>1 página estática</li>
                <li>Diseño profesional</li>
                <li>Soporte por email</li>
              </ul>
              <Link href="/login" className="text-emerald-400 border border-emerald-400 px-6 py-2 rounded-full hover:bg-emerald-400/10 transition-colors">Elegir Básico</Link>
            </div>
            
            <div className="plan-card plan-destacado">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-black px-4 py-1 rounded-full text-sm font-bold">RECOMENDADO</div>
              <div className="plan-nombre">Pro</div>
              <div className="plan-precio">$29<span className="text-sm font-normal text-zinc-400">/mes</span></div>
              <ul className="plan-detalles">
                <li>Hasta 3 páginas</li>
                <li>Diseño personalizado</li>
                <li>Soporte prioritario</li>
                <li>Mantenimiento incluido</li>
              </ul>
              <Link href="/login" className="bg-emerald-500 text-black font-bold px-8 py-3 rounded-full hover:bg-emerald-400 transition-colors block w-full">Elegir Pro</Link>
            </div>

            <div className="plan-card">
              <div className="plan-nombre">Premium</div>
              <div className="plan-precio">$49<span className="text-sm font-normal text-zinc-400">/mes</span></div>
              <ul className="plan-detalles">
                <li>Páginas ilimitadas</li>
                <li>Diseño avanzado</li>
                <li>Soporte 24/7</li>
              </ul>
              <Link href="/login" className="text-emerald-400 border border-emerald-400 px-6 py-2 rounded-full hover:bg-emerald-400/10 transition-colors">Elegir Premium</Link>
            </div>
          </div>
        </section>

        {/* FUNDADOR */}
        <section className="fundador-syncelle">
          <div className="fundador-container">
            <div className="fundador-texto">
              <h2 className="text-2xl font-bold text-emerald-400 mb-2">Sebastián Pérez.</h2>
              <p className="text-zinc-400 mb-4">Fundador & CEO de Syncelle.</p>
              <p className="text-lg italic text-zinc-300">"Esta visión nació de una sola idea: que cualquier persona pudiera tener su espacio digital sin barreras, sin contratos, sin excusas. Syncelle es tecnología con alma."</p>
            </div>
            <div className="fundador-foto">
              <Image src="/founder_&_CEO.jpeg" alt="Sebastián Pérez" width={200} height={200} className="rounded-full border-4 border-zinc-800" />
            </div>
          </div>
        </section>

        <footer className="py-8 text-center text-zinc-500 border-t border-white/10 mt-12">
          <p>© 2025 Syncelle. Todos los derechos reservados.</p>
        </footer>
      </main>
    </>
  );
}
