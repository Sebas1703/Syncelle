'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const DOC_TYPES = [
  { key: 'privacy_policy', title: 'Privacy Policy', icon: '🛡️', desc: 'GDPR & CCPA compliant privacy policy' },
  { key: 'terms_of_service', title: 'Terms of Service', icon: '📋', desc: 'Professional SaaS terms of service' },
  { key: 'dpa', title: 'Data Processing Agreement', icon: '🔐', desc: 'Enterprise-ready DPA with SCCs' },
  { key: 'sub_processors', title: 'Sub-processor List', icon: '📡', desc: 'Auto-detected third-party services' },
];

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [generatingDoc, setGeneratingDoc] = useState(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    loadData();
  }, []);

  // Show success message after payment
  useEffect(() => {
    if (searchParams.get('payment') === 'success') {
      // Reload data to pick up new subscription
      setTimeout(() => loadData(), 2000);
    }
  }, [searchParams]);

  const loadData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      router.push('/login');
      return;
    }
    setUser(session.user);

    // Load company profile
    const { data: companyProfile } = await supabase
      .from('company_profiles')
      .select('*')
      .eq('user_id', session.user.id)
      .single();

    setProfile(companyProfile);

    // Load subscription
    const { data: sub } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', session.user.id)
      .single();

    setSubscription(sub);

    // Load generated documents
    const { data: docs } = await supabase
      .from('documents')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (docs) setDocuments(docs);
    setLoading(false);
  };

  const isSubscribed = subscription &&
    (subscription.status === 'active' || subscription.status === 'trialing') &&
    new Date(subscription.current_period_end) > new Date();

  const handleCheckout = async (plan) => {
    if (!user) return;
    setCheckoutLoading(true);

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan,
          user_id: user.id,
          user_email: user.email,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Checkout failed');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (err) {
      alert('Error: ' + err.message);
      setCheckoutLoading(false);
    }
  };

  const handleGenerate = async (docType) => {
    if (!profile?.questionnaire_data) {
      router.push('/onboarding');
      return;
    }

    if (!isSubscribed) {
      setShowPaywall(true);
      return;
    }

    setGenerating(true);
    setGeneratingDoc(docType);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doc_type: docType,
          questionnaire_data: profile.questionnaire_data,
          user_id: user.id,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        if (err.error === 'SUBSCRIPTION_REQUIRED') {
          setShowPaywall(true);
          return;
        }
        throw new Error(err.error || 'Generation failed');
      }

      const { content } = await response.json();

      const { error } = await supabase
        .from('documents')
        .upsert({
          user_id: user.id,
          doc_type: docType,
          content: content,
          company_name: profile.company_name,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id,doc_type' })
        .select()
        .single();

      if (error) throw error;
      await loadData();
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setGenerating(false);
      setGeneratingDoc(null);
    }
  };

  const handleGenerateAll = async () => {
    if (!profile?.questionnaire_data) {
      router.push('/onboarding');
      return;
    }

    if (!isSubscribed) {
      setShowPaywall(true);
      return;
    }

    setGenerating(true);
    const currentUser = user;
    const currentProfile = profile;
    const errors = [];

    for (const doc of DOC_TYPES) {
      setGeneratingDoc(doc.key);
      try {
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            doc_type: doc.key,
            questionnaire_data: currentProfile.questionnaire_data,
            user_id: currentUser.id,
          }),
        });

        if (!response.ok) {
          const err = await response.json();
          if (err.error === 'SUBSCRIPTION_REQUIRED') {
            setShowPaywall(true);
            setGenerating(false);
            setGeneratingDoc(null);
            return;
          }
          throw new Error(err.error || 'Generation failed');
        }

        const { content } = await response.json();

        const { error } = await supabase
          .from('documents')
          .upsert({
            user_id: currentUser.id,
            doc_type: doc.key,
            content: content,
            company_name: currentProfile.company_name,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'user_id,doc_type' })
          .select()
          .single();

        if (error) throw error;
      } catch (err) {
        errors.push(`${doc.title}: ${err.message}`);
      }
    }

    setGenerating(false);
    setGeneratingDoc(null);
    await loadData();

    if (errors.length > 0) {
      alert('Some documents failed:\n' + errors.join('\n'));
    }
  };

  const getDocForType = (key) => documents.find(d => d.doc_type === key);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-900 bg-black/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-black font-bold text-lg">S</div>
            <span className="font-bold tracking-tight">Syncelle</span>
          </Link>
          <div className="flex items-center gap-4">
            {isSubscribed && (
              <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                {subscription.plan === 'annual' ? 'Annual Plan' : 'Monthly Plan'}
              </span>
            )}
            <span className="text-xs text-zinc-500">{user?.email}</span>
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                router.push('/login');
              }}
              className="text-xs text-zinc-500 hover:text-white transition-colors"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Payment success banner */}
        {searchParams.get('payment') === 'success' && (
          <div className="mb-8 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center">
            <p className="text-emerald-400 font-bold">Payment successful! Your subscription is now active.</p>
          </div>
        )}

        {/* Welcome & Status */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Your Compliance Documents
          </h1>
          {profile?.questionnaire_data ? (
            <div className="flex items-center gap-4 flex-wrap">
              <p className="text-zinc-500">
                Company: <span className="text-zinc-300">{profile.company_name || 'Not set'}</span>
              </p>
              <Link href="/onboarding" className="text-xs text-emerald-400 hover:underline">
                Edit questionnaire
              </Link>
            </div>
          ) : (
            <div className="mt-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 max-w-xl">
              <p className="text-zinc-400 mb-4">
                Complete the questionnaire first so we can generate documents tailored to your SaaS.
              </p>
              <Link
                href="/onboarding"
                className="inline-block px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl text-sm transition-all"
              >
                Start Questionnaire
              </Link>
            </div>
          )}
        </div>

        {/* Subscription CTA for non-subscribers */}
        {!isSubscribed && profile?.questionnaire_data && (
          <div className="mb-8 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8">
            <h2 className="text-xl font-bold mb-2">Subscribe to generate your documents</h2>
            <p className="text-zinc-500 text-sm mb-6">
              Your questionnaire is complete. Subscribe to generate all 4 compliance documents instantly.
            </p>
            <div className="flex gap-4 flex-wrap">
              <button
                onClick={() => handleCheckout('monthly')}
                disabled={checkoutLoading}
                className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
              >
                $35/month
              </button>
              <button
                onClick={() => handleCheckout('annual')}
                disabled={checkoutLoading}
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl text-sm font-bold transition-all disabled:opacity-50"
              >
                $290/year (save $130)
              </button>
            </div>
          </div>
        )}

        {/* Generate All Button — only for subscribers */}
        {isSubscribed && profile?.questionnaire_data && (
          <div className="mb-8">
            <button
              onClick={handleGenerateAll}
              disabled={generating}
              className="px-8 py-3 bg-white hover:bg-zinc-200 text-black font-bold rounded-xl text-sm transition-all disabled:opacity-50"
            >
              {generating ? 'Generating...' : 'Generate All Documents'}
            </button>
          </div>
        )}

        {/* Document Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {DOC_TYPES.map((docType) => {
            const existingDoc = getDocForType(docType.key);
            const isGeneratingThis = generatingDoc === docType.key;

            return (
              <div
                key={docType.key}
                className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-6 hover:border-zinc-700 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{docType.icon}</span>
                      <h3 className="font-bold text-lg">{docType.title}</h3>
                    </div>
                    <p className="text-zinc-500 text-sm">{docType.desc}</p>
                  </div>
                  {existingDoc && (
                    <span className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                      Generated
                    </span>
                  )}
                </div>

                {existingDoc && (
                  <p className="text-[11px] text-zinc-600 mb-4">
                    Last updated: {new Date(existingDoc.updated_at).toLocaleDateString()}
                  </p>
                )}

                <div className="flex gap-3">
                  {existingDoc ? (
                    <>
                      <Link
                        href={`/documents/${docType.key}`}
                        className="flex-1 py-2.5 text-center bg-zinc-800 hover:bg-zinc-700 rounded-xl text-sm font-medium transition-colors"
                      >
                        View & Copy
                      </Link>
                      <button
                        onClick={() => handleGenerate(docType.key)}
                        disabled={generating}
                        className="px-4 py-2.5 border border-zinc-800 hover:border-zinc-700 rounded-xl text-sm text-zinc-400 hover:text-white transition-all disabled:opacity-50"
                      >
                        {isGeneratingThis ? '...' : 'Regenerate'}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => isSubscribed ? handleGenerate(docType.key) : setShowPaywall(true)}
                      disabled={generating || !profile?.questionnaire_data}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50 ${
                        isSubscribed
                          ? 'bg-emerald-500 hover:bg-emerald-400 text-black'
                          : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                      }`}
                    >
                      {isGeneratingThis ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                          Generating...
                        </span>
                      ) : isSubscribed ? 'Generate' : 'Subscribe to Generate'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Paywall Modal */}
      {showPaywall && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowPaywall(false)}>
          <div className="bg-[#111] border border-zinc-800 rounded-3xl p-8 max-w-lg w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-2">Unlock Your Compliance Documents</h2>
            <p className="text-zinc-500 mb-8">
              Subscribe to generate all 4 documents — Privacy Policy, Terms of Service, DPA, and Sub-processor List — tailored to your SaaS.
            </p>

            <div className="space-y-4 mb-8">
              <button
                onClick={() => handleCheckout('monthly')}
                disabled={checkoutLoading}
                className="w-full p-4 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl text-left transition-all disabled:opacity-50"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold">Monthly</p>
                    <p className="text-sm text-zinc-500">Cancel anytime</p>
                  </div>
                  <p className="text-xl font-bold">$35<span className="text-sm text-zinc-500 font-normal">/mo</span></p>
                </div>
              </button>

              <button
                onClick={() => handleCheckout('annual')}
                disabled={checkoutLoading}
                className="w-full p-4 bg-emerald-500/5 border border-emerald-500/30 hover:border-emerald-500/50 rounded-2xl text-left transition-all relative disabled:opacity-50"
              >
                <span className="absolute -top-3 right-4 bg-emerald-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  Save $130
                </span>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold">Annual</p>
                    <p className="text-sm text-zinc-500">Best value — 2 months free</p>
                  </div>
                  <p className="text-xl font-bold">$290<span className="text-sm text-zinc-500 font-normal">/yr</span></p>
                </div>
              </button>
            </div>

            <ul className="space-y-2 mb-6 text-sm text-zinc-400">
              {['4 AI-generated legal documents', 'Tailored to your specific SaaS', 'Unlimited regenerations', 'PDF & copy-paste export', 'Sub-processor auto-detection'].map((f, i) => (
                <li key={i} className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>

            <button
              onClick={() => setShowPaywall(false)}
              className="w-full text-center text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              Maybe later
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
