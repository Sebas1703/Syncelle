'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

const STEPS = [
  {
    id: 'company',
    title: 'Your Company',
    subtitle: 'Basic information about your business',
    fields: [
      { key: 'company_name', label: 'Company / Product Name', type: 'text', placeholder: 'Acme SaaS', required: true },
      { key: 'company_website', label: 'Website URL', type: 'text', placeholder: 'https://acme.com' },
      { key: 'company_country', label: 'Country of Incorporation', type: 'text', placeholder: 'United States', required: true },
      { key: 'company_address', label: 'Business Address', type: 'text', placeholder: '123 Main St, City, State' },
      { key: 'contact_email', label: 'Data Protection Contact Email', type: 'email', placeholder: 'privacy@acme.com', required: true },
    ]
  },
  {
    id: 'product',
    title: 'Your Product',
    subtitle: 'What data does your SaaS collect and process?',
    fields: [
      { key: 'product_description', label: 'Describe your product in one sentence', type: 'textarea', placeholder: 'A project management tool for remote teams', required: true },
      {
        key: 'data_collected', label: 'What personal data do you collect?', type: 'multiselect',
        options: ['Name', 'Email address', 'Phone number', 'Physical address', 'Payment information', 'IP address', 'Browser/device data', 'Location data', 'Usage analytics', 'Uploaded files/content', 'Profile photos', 'Social media profiles'],
        required: true
      },
      {
        key: 'data_purpose', label: 'Why do you collect this data?', type: 'multiselect',
        options: ['Provide the service', 'User authentication', 'Billing & payments', 'Customer support', 'Analytics & improvement', 'Marketing emails', 'Personalization', 'Legal compliance'],
        required: true
      },
      {
        key: 'data_storage_region', label: 'Where is your data stored?', type: 'select',
        options: ['United States', 'European Union', 'United Kingdom', 'Canada', 'Australia', 'Multiple regions'],
        required: true
      },
    ]
  },
  {
    id: 'stack',
    title: 'Your Tech Stack',
    subtitle: 'Select the third-party services your product uses. These become your sub-processors.',
    fields: [
      {
        key: 'hosting', label: 'Hosting & Infrastructure', type: 'multiselect',
        options: ['AWS', 'Google Cloud', 'Azure', 'Vercel', 'Netlify', 'DigitalOcean', 'Heroku', 'Railway', 'Fly.io', 'Cloudflare'],
      },
      {
        key: 'database', label: 'Database & Storage', type: 'multiselect',
        options: ['Supabase', 'Firebase', 'MongoDB Atlas', 'PlanetScale', 'Neon', 'PostgreSQL (self-hosted)', 'Redis Cloud', 'AWS S3', 'Cloudflare R2'],
      },
      {
        key: 'auth_provider', label: 'Authentication', type: 'multiselect',
        options: ['Supabase Auth', 'Auth0', 'Clerk', 'Firebase Auth', 'NextAuth.js', 'Custom/self-built'],
      },
      {
        key: 'payments', label: 'Payments', type: 'multiselect',
        options: ['Stripe', 'Paddle', 'LemonSqueezy', 'PayPal', 'Chargebee', 'None'],
      },
      {
        key: 'analytics', label: 'Analytics & Monitoring', type: 'multiselect',
        options: ['Google Analytics', 'Mixpanel', 'PostHog', 'Amplitude', 'Plausible', 'Sentry', 'LogRocket', 'Datadog', 'None'],
      },
      {
        key: 'email_service', label: 'Email & Communications', type: 'multiselect',
        options: ['SendGrid', 'Resend', 'Postmark', 'Mailgun', 'AWS SES', 'Intercom', 'Crisp', 'None'],
      },
      {
        key: 'other_services', label: 'Other services (comma-separated)', type: 'text',
        placeholder: 'e.g., Slack API, Notion API, OpenAI',
      },
    ]
  },
  {
    id: 'users',
    title: 'Your Users',
    subtitle: 'Who uses your product and where are they located?',
    fields: [
      {
        key: 'business_model', label: 'Business model', type: 'select',
        options: ['B2B (sell to businesses)', 'B2C (sell to consumers)', 'Both B2B and B2C'],
        required: true,
      },
      {
        key: 'user_regions', label: 'Where are your users located?', type: 'multiselect',
        options: ['European Union', 'United States', 'United Kingdom', 'Canada', 'Australia', 'Latin America', 'Asia', 'Global / All regions'],
        required: true,
      },
      {
        key: 'minors', label: 'Can users under 16 use your product?', type: 'select',
        options: ['No — adults only', 'Yes — some users may be minors', 'Not sure'],
        required: true,
      },
      {
        key: 'data_sharing', label: 'Do you share data with third parties for their own purposes (not just sub-processing)?', type: 'select',
        options: ['No', 'Yes — with advertising partners', 'Yes — with business partners', 'Not sure'],
      },
      {
        key: 'cookie_usage', label: 'Do you use cookies or tracking?', type: 'multiselect',
        options: ['Essential cookies only', 'Analytics cookies', 'Marketing/advertising cookies', 'Third-party cookies', 'No cookies'],
      },
    ]
  }
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) {
        router.push('/login');
        return;
      }
      setUser(session.user);

      // Load existing data if any
      supabase
        .from('company_profiles')
        .select('questionnaire_data')
        .eq('user_id', session.user.id)
        .single()
        .then(({ data }) => {
          if (data?.questionnaire_data) {
            setFormData(data.questionnaire_data);
          }
        });
    });
  }, [router]);

  const step = STEPS[currentStep];
  const isLastStep = currentStep === STEPS.length - 1;
  const progress = ((currentStep + 1) / STEPS.length) * 100;

  const updateField = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const toggleMultiSelect = (key, option) => {
    const current = formData[key] || [];
    const updated = current.includes(option)
      ? current.filter(o => o !== option)
      : [...current, option];
    updateField(key, updated);
  };

  const handleNext = () => {
    if (isLastStep) {
      handleSubmit();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) return;
    setSaving(true);

    try {
      // Upsert company profile with questionnaire data
      const { error } = await supabase
        .from('company_profiles')
        .upsert({
          user_id: user.id,
          company_name: formData.company_name || '',
          questionnaire_data: formData,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });

      if (error) throw error;
      router.push('/dashboard');
    } catch (err) {
      alert('Error saving: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-zinc-900">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-black font-bold text-lg">S</div>
            <span className="font-bold tracking-tight">Syncelle</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-xs text-zinc-500 font-mono">Step {currentStep + 1} of {STEPS.length}</span>
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-0.5 bg-zinc-900">
          <motion.div
            className="h-full bg-emerald-500"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="pt-28 pb-32 px-6 max-w-3xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-10">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{step.title}</h1>
              <p className="text-zinc-500">{step.subtitle}</p>
            </div>

            <div className="space-y-8">
              {step.fields.map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-zinc-300 mb-3">
                    {field.label}
                    {field.required && <span className="text-emerald-500 ml-1">*</span>}
                  </label>

                  {field.type === 'text' && (
                    <input
                      type="text"
                      value={formData[field.key] || ''}
                      onChange={(e) => updateField(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 transition-colors placeholder:text-zinc-700"
                    />
                  )}

                  {field.type === 'email' && (
                    <input
                      type="email"
                      value={formData[field.key] || ''}
                      onChange={(e) => updateField(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 transition-colors placeholder:text-zinc-700"
                    />
                  )}

                  {field.type === 'textarea' && (
                    <textarea
                      value={formData[field.key] || ''}
                      onChange={(e) => updateField(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      rows={3}
                      className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 transition-colors resize-none placeholder:text-zinc-700"
                    />
                  )}

                  {field.type === 'select' && (
                    <div className="space-y-2">
                      {field.options.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => updateField(field.key, option)}
                          className={`w-full text-left px-4 py-3 rounded-xl border transition-all text-sm ${
                            formData[field.key] === option
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                              : 'bg-zinc-900/50 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}

                  {field.type === 'multiselect' && (
                    <div className="flex flex-wrap gap-2">
                      {field.options.map((option) => {
                        const selected = (formData[field.key] || []).includes(option);
                        return (
                          <button
                            key={option}
                            type="button"
                            onClick={() => toggleMultiSelect(field.key, option)}
                            className={`px-4 py-2 rounded-xl border text-sm transition-all ${
                              selected
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                            }`}
                          >
                            {selected && <span className="mr-1">&#10003;</span>}
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-xl border-t border-zinc-900">
        <div className="max-w-3xl mx-auto px-6 py-4 flex justify-between items-center">
          <button
            onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
            disabled={currentStep === 0}
            className="px-6 py-3 text-sm font-medium text-zinc-400 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Back
          </button>

          <div className="flex gap-2">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === currentStep ? 'bg-emerald-500' : i < currentStep ? 'bg-emerald-500/40' : 'bg-zinc-800'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={saving}
            className="px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl text-sm transition-all disabled:opacity-50"
          >
            {saving ? 'Saving...' : isLastStep ? 'Generate Documents' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}
