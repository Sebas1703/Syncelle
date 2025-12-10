'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Bloquear scroll cuando el menú está abierto
  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('scroll-locked');
    } else {
      document.body.classList.remove('scroll-locked');
    }
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header__container">
        
        <div className="header__row">
            <div className="logo-wrapper">
                <Link href="/" onClick={closeMenu}>
                    <Image 
                        src="/logo2.png" 
                        alt="Syncelle Logo" 
                        width={120} 
                        height={40} 
                        className="logo" 
                        priority 
                    />
                </Link>
            </div>

            <button 
                className="nav-toggle" 
                aria-label="Abrir menú" 
                aria-expanded={isMenuOpen}
                onClick={toggleMenu}
            >
                <span></span>
                <span></span>
                <span></span>
            </button>
        </div>

        <nav className="nav">
            {/* Overlay para cerrar al hacer clic fuera */}
            {isMenuOpen && (
                <div className="nav-overlay" onClick={closeMenu}></div>
            )}
            
            <ul className={`nav__menu ${isMenuOpen ? 'is-active' : ''}`}>
                <li><Link href="/" className="nav__link" onClick={closeMenu}>Inicio</Link></li>
                <li><Link href="/nosotros" className="nav__link" onClick={closeMenu}>Sobre Nosotros</Link></li>
                <li><Link href="/dashboard" className="nav__link" onClick={closeMenu}>Crea con IA</Link></li>
                <li><Link href="/servicios" className="nav__link" onClick={closeMenu}>Servicios</Link></li>
                <li><Link href="/contacto" className="nav__link" onClick={closeMenu}>Contáctanos</Link></li>
            </ul>
        </nav>

      </div>
    </header>
  );
}
