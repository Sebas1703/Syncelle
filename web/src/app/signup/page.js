'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        }
      });

      if (error) throw error;

      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-10 shadow-2xl">
        <div className="text-center mb-10">
          <Link href="/" className="inline-block mb-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-black font-black text-2xl shadow-[0_0_20px_rgba(16,185,129,0.4)]">
              S
            </div>
          </Link>
          <h1 className="text-3xl font-bold mb-2 text-white">Crea tu cuenta</h1>
          <p className="text-zinc-400">Empieza a diseñar el futuro hoy mismo.</p>
        </div>

        {success ? (
          <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-2xl text-center">
            <h2 className="text-emerald-400 font-bold mb-2">¡Casi listo!</h2>
            <p className="text-zinc-300 text-sm">
              Hemos enviado un correo de confirmación a <span className="text-white font-medium">{email}</span>. 
              Verifica tu bandeja de entrada para continuar.
            </p>
            <button 
              onClick={() => router.push('/login')}
              className="mt-6 text-sm text-emerald-400 hover:underline"
            >
              Ir al inicio de sesión
            </button>
          </div>
        ) : (
          <form onSubmit={handleSignup} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Correo electrónico</label>
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="tu@ejemplo.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Contraseña</label>
              <input 
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-white hover:bg-zinc-200 text-black font-bold py-4 rounded-xl transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Creando cuenta...' : 'Registrarse'}
            </button>

            <p className="text-center text-zinc-500 text-sm">
              ¿Ya tienes una cuenta? <Link href="/login" className="text-white hover:text-emerald-400 transition-colors font-medium">Inicia sesión</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

