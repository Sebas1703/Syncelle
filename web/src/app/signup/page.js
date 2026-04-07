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
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/onboarding`,
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
          <h1 className="text-3xl font-bold mb-2 text-white">Create your account</h1>
          <p className="text-zinc-400">Get your compliance docs in under 10 minutes.</p>
        </div>

        {success ? (
          <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-2xl text-center">
            <h2 className="text-emerald-400 font-bold text-xl mb-2">Check your inbox</h2>
            <p className="text-zinc-300 text-sm">
              We sent a confirmation email to <span className="text-white font-medium">{email}</span>.
              Click the link to activate your account.
            </p>
            <button
              onClick={() => router.push('/login')}
              className="mt-6 text-sm text-emerald-400 hover:underline"
            >
              Go to login
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
              <label className="block text-sm font-medium text-zinc-400 mb-2">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="you@company.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="Min. 6 characters"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white hover:bg-zinc-200 text-black font-bold py-4 rounded-xl transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>

            <p className="text-center text-zinc-500 text-sm">
              Already have an account? <Link href="/login" className="text-white hover:text-emerald-400 transition-colors font-medium">Log in</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
