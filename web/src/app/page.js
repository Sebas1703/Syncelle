import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent pointer-events-none" />
      
      <div className="relative z-10 text-center">
        <h1 className="text-7xl font-bold mb-6 tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
          Syncelle
        </h1>
        <p className="text-2xl text-zinc-400 mb-12 max-w-2xl mx-auto">
          La plataforma de generación web impulsada por Inteligencia Artificial.
          Diseña, publica y escala en segundos.
        </p>
        
        <div className="flex gap-4 justify-center">
          <Link 
            href="/login"
            className="px-8 py-4 bg-white text-black rounded-full font-bold hover:bg-zinc-200 transition-colors"
          >
            Iniciar Sesión
          </Link>
          <Link 
            href="/signup" // Tendrías que crear signup o redirigir a login por ahora
            className="px-8 py-4 border border-white/20 rounded-full font-bold hover:bg-white/10 transition-colors"
          >
            Registrarse
          </Link>
        </div>
      </div>
    </main>
  );
}
