'use client';

import Navbar from './Navbar';

export default function ConstructionPage({ title = "¡Esta página está en construcción!" }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#0B0B0B]">
      <Navbar />
      
      <main className="main-container flex-grow flex items-center justify-center p-4">
        <section className="w-full max-w-3xl">
          <div className="en-construccion">
            <span className="emoji">🚧</span>
            <h2>{title}</h2>
            <p>Estamos trabajando para traerte el mejor contenido pronto.</p>
          </div>
        </section>

        <style jsx>{`
          .main-container {
            max-width: 1280px;
            margin: 0 auto;
            width: 100%;
          }
          .en-construccion {
            background: linear-gradient(90deg, #00F4AE 0%, #00DA8E 100%);
            color: #0B0B0B;
            border-radius: 18px;
            box-shadow: 0 4px 32px #00F4AE44, 0 2px 8px #0002;
            padding: 2.2rem 1.5rem 1.7rem 1.5rem;
            text-align: center;
            margin-bottom: 2.5rem;
            transition: box-shadow 0.2s, transform 0.2s;
            cursor: pointer;
            position: relative;
          }
          .en-construccion:hover {
            box-shadow: 0 8px 48px #00F4AE77, 0 4px 16px #0003;
            transform: scale(1.03) rotate(-1deg);
          }
          .en-construccion .emoji {
            font-size: 2.5rem;
            display: block;
            margin-bottom: 0.5rem;
          }
          .en-construccion h2 {
            font-size: 2rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
          }
          .en-construccion p {
            font-size: 1.1rem;
            margin-bottom: 0;
          }
        `}</style>
      </main>

      <footer>
        <p>&copy; 2024 Syncelle. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

