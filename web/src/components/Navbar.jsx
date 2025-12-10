import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  return (
    <header className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo2.png" alt="Syncelle Logo" width={120} height={40} className="object-contain" />
        </Link>
        
        <nav className="hidden md:flex gap-8">
          <Link href="/" className="text-white hover:text-emerald-400 transition-colors">Inicio</Link>
          <Link href="#como-funciona" className="text-zinc-400 hover:text-white transition-colors">Cómo funciona</Link>
          <Link href="#planes" className="text-zinc-400 hover:text-white transition-colors">Planes</Link>
        </nav>

        <div className="flex gap-4">
          <Link href="/login" className="text-white font-medium hover:text-emerald-400 transition-colors px-4 py-2">
            Iniciar Sesión
          </Link>
          <Link href="/login" className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-5 py-2 rounded-full transition-colors">
            Empezar
          </Link>
        </div>
      </div>
    </header>
  );
}

