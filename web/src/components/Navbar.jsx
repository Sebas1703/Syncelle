'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    // Check Auth
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Inicio', href: '/' },
    { name: 'Sobre Nosotros', href: '/nosotros' },
    { name: 'Servicios', href: '/servicios' },
    { name: 'Contáctanos', href: '/contacto' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-4 pointer-events-none"
      >
        <div 
          className={`pointer-events-auto transition-all duration-300 ease-in-out
            ${isScrolled || mobileMenuOpen ? 'w-[95%] max-w-5xl' : 'w-full max-w-6xl'}
            rounded-full border border-white/10 bg-black/60 backdrop-blur-xl shadow-lg shadow-black/20
            px-6 py-3 flex items-center justify-between
          `}
        >
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-black font-bold text-lg shadow-[0_0_15px_rgba(16,185,129,0.4)] group-hover:scale-105 transition-transform">
              S
            </div>
            <span className="font-bold text-lg tracking-tight group-hover:text-emerald-400 transition-colors">Syncelle</span>
          </Link>

          {/* DESKTOP LINKS */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-emerald-400 relative group ${
                  pathname === link.href ? 'text-white' : 'text-zinc-400'
                }`}
              >
                {link.name}
                {pathname === link.href && (
                  <motion.span 
                    layoutId="activeNav"
                    className="absolute -bottom-1 left-0 right-0 h-px bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" 
                  />
                )}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-emerald-500 transition-all group-hover:w-full opacity-50" />
              </Link>
            ))}
          </div>

          {/* RIGHT ACTIONS */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <Link 
                href="/dashboard"
                className="px-5 py-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-bold transition-all border border-zinc-700"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">
                  Login
                </Link>
                <Link 
                  href="/signup"
                  className="px-5 py-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black text-sm font-bold transition-all shadow-[0_0_20px_-5px_rgba(16,185,129,0.4)] hover:shadow-[0_0_25px_-5px_rgba(16,185,129,0.6)] hover:scale-105"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>

          {/* MOBILE TOGGLE */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
          >
            <div className="flex flex-col gap-1.5 items-center justify-center w-6">
              <motion.span 
                animate={mobileMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                className="w-full h-0.5 bg-white origin-center transition-all"
              />
              <motion.span 
                animate={mobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                className="w-full h-0.5 bg-white transition-all"
              />
              <motion.span 
                animate={mobileMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                className="w-full h-0.5 bg-white origin-center transition-all"
              />
            </div>
          </button>
        </div>
      </motion.nav>

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="fixed inset-0 z-40 bg-black/60 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div 
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute top-24 left-4 right-4 bg-[#111] border border-zinc-800 rounded-3xl p-6 shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link 
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-4 rounded-xl hover:bg-white/5 text-lg font-medium text-zinc-300 hover:text-white transition-all flex justify-between items-center group"
                  >
                    {link.name}
                    <span className="opacity-0 group-hover:opacity-100 text-emerald-500">→</span>
                  </Link>
                ))}
                <div className="h-px bg-zinc-800 my-2" />
                {user ? (
                   <Link 
                   href="/dashboard"
                   className="p-4 text-center rounded-xl bg-zinc-800 text-white font-bold"
                 >
                   Ir al Dashboard
                 </Link>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Link href="/login" className="p-3 text-center rounded-xl border border-zinc-700 text-zinc-300 font-bold">
                      Login
                    </Link>
                    <Link href="/dashboard" className="p-3 text-center rounded-xl bg-emerald-500 text-black font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                      Crea con IA
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
