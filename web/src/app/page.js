import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Image from 'next/image';

export const metadata = {
  title: 'Syncelle - Tu página web sin complicaciones',
  description: 'Tu sitio web activo mientras lo necesites. Sin contratos. Sin excusas.',
  openGraph: {
    title: 'Syncelle - Tu página web sin complicaciones',
    description: 'Tu sitio web activo mientras lo necesites. Sin contratos. Sin excusas.',
    images: ['https://syncelle.com/logo1.png'],
    type: 'website',
  },
};

export default function Home() {
  return (
    <div className="bg-[#0B0B0B] min-h-screen text-white font-inter">
      <Navbar />

      <section className="cta-hero">
        <div className="cta-hero__container">
          <div className="cta-hero__text">
            <h1>Tu página web. <br />Activa mientras la necesites.</h1>
            <p className="subtitle">Una suscripción. Una web. Cero complicaciones.</p>
            <Link href="/dashboard" className="cta-main">Solicita la tuya</Link>
          </div>
          <div className="cta-hero__mockup">
            <Image 
                src="/mockup.png" 
                alt="Mockup ejemplo" 
                width={540} 
                height={540}
                priority 
                className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      <div className="main-container">
        <main>
          <section className="como-funciona">
            <h2>¿Cómo funciona?</h2>
            <div className="steps">
              <div className="step">
                <div className="icon-step">📞</div>
                <h3>Te contactas</h3>
              </div>
              <div className="step-arrow" aria-hidden="true">
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 18H28M28 18L22 12M28 18L22 24" stroke="#00F4AE" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="step">
                <div className="icon-step">🖥️</div>
                <h3>Diseñamos y publicamos</h3>
              </div>
              <div className="step-arrow" aria-hidden="true">
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 18H28M28 18L22 12M28 18L22 24" stroke="#00F4AE" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="step">
                <div className="icon-step">💳</div>
                <h3>Pagas mes a mes, sin contratos</h3>
              </div>
            </div>
          </section>

          <section className="beneficios">
            <h2>¿Por qué elegirnos?</h2>
            <ul>
              <li>Diseño profesional</li>
              <li>Mantenimiento incluido</li>
              <li>Baja automática si no pagas (honestidad total)</li>
              <li>Ideal para negocios, políticos, artistas, profesionales</li>
            </ul>
          </section>

          <section className="planes-precios">
            <h2 style={{ marginBottom: '2.5rem' }}>Planes y precios</h2>
            <div className="planes-grid">
              <div className="plan-card">
                <div className="plan-nombre">Básico</div>
                <div className="plan-precio">$19<span className="precio-periodo">/mes</span></div>
                <ul className="plan-detalles">
                  <li>1 página estática</li>
                  <li>Diseño profesional</li>
                  <li>Soporte por email</li>
                  <li>Baja automática</li>
                </ul>
                <Link href="/dashboard" className="cta-secundario">Elegir Básico</Link>
              </div>
              <div className="plan-card plan-destacado">
                <div className="plan-nombre">Pro</div>
                <div className="plan-precio">$29<span className="precio-periodo">/mes</span></div>
                <ul className="plan-detalles">
                  <li>Hasta 3 páginas</li>
                  <li>Diseño personalizado</li>
                  <li>Soporte prioritario</li>
                  <li>Mantenimiento incluido</li>
                </ul>
                <Link href="/dashboard" className="cta-main">Elegir Pro</Link>
              </div>
              <div className="plan-card">
                <div className="plan-nombre">Premium</div>
                <div className="plan-precio">$49<span className="precio-periodo">/mes</span></div>
                <ul className="plan-detalles">
                  <li>Páginas ilimitadas</li>
                  <li>Diseño avanzado</li>
                  <li>Soporte 24/7</li>
                  <li>Integraciones a medida</li>
                </ul>
                <Link href="/dashboard" className="cta-secundario">Elegir Premium</Link>
              </div>
            </div>
            <p className="condiciones">Permanencia mínima: 1 mes. Sin contratos largos.</p>
          </section>

          {/* Sección Fundador Syncelle */}
          <section className="fundador-syncelle">
            <div className="fundador-container">
              <div className="fundador-texto">
                <h2>Sebastián Pérez.</h2>
                <p className="cargo">Fundador & CEO de Syncelle.</p>
                <p className="cita">Esta visión nació de una sola idea: que cualquier persona pudiera tener su espacio digital sin barreras, sin contratos, sin excusas. Syncelle es tecnología con alma.</p>
              </div>
              <div className="fundador-foto">
                <Image 
                    src="/founder_&_CEO.jpeg" 
                    alt="Sebastián Mauricio Pérez Roa - Fundador Syncelle" 
                    width={220} 
                    height={220}
                    className="object-cover"
                />
              </div>
            </div>
          </section>
        </main>

        <footer>
          <p>&copy; 2025 Syncelle. Todos los derechos reservados.</p>
        </footer>
      </div>
    </div>
  );
}
