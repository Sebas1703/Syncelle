'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const documents = [
  {
    title: "Privacy Policy",
    desc: "GDPR & CCPA compliant privacy policy tailored to your data practices, third-party services, and user base.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
  {
    title: "Terms of Service",
    desc: "Professional ToS covering liability, intellectual property, acceptable use, and SaaS-specific clauses.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  {
    title: "Data Processing Agreement",
    desc: "Enterprise-ready DPA with Standard Contractual Clauses, data transfer mechanisms, and breach notification terms.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
      </svg>
    ),
  },
  {
    title: "Sub-processor List",
    desc: "Auto-detected list of your third-party services with data categories, locations, and processing purposes.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
      </svg>
    ),
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30">
      <Navbar />

      <main className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* HERO */}
        <section className="max-w-7xl mx-auto flex flex-col items-center text-center mb-32 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col items-center"
          >
            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-sm mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-sm font-medium text-emerald-400 tracking-wide">AI-POWERED COMPLIANCE</span>
            </motion.div>

            <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent leading-[0.95]">
              GDPR documents<br />
              <span className="text-emerald-500">for your SaaS.</span>
            </motion.h1>

            <motion.p variants={fadeIn} className="text-xl text-zinc-400 max-w-2xl mb-4 leading-relaxed">
              Generate Privacy Policy, Terms of Service, DPA, and Sub-processor List tailored to your product — in 10 minutes, not 10 weeks.
            </motion.p>

            <motion.p variants={fadeIn} className="text-sm text-zinc-600 mb-10">
              No lawyers needed. No $10K/year platforms. Just answer a few questions.
            </motion.p>

            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4">
              <Link href="/signup" className="group relative px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-full text-lg transition-all hover:scale-105 shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)]">
                <span className="relative z-10">Generate Your Docs Free</span>
              </Link>
              <a href="#how-it-works" className="px-8 py-4 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white font-medium rounded-full text-lg transition-all">
                See How It Works
              </a>
            </motion.div>
          </motion.div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
        </section>

        {/* SOCIAL PROOF BAR */}
        <section className="max-w-4xl mx-auto mb-32">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-x-12 gap-y-4 text-zinc-600 text-sm font-medium"
          >
            <span>Used by 50+ indie SaaS founders</span>
            <span className="hidden sm:inline">|</span>
            <span>4 documents in one place</span>
            <span className="hidden sm:inline">|</span>
            <span>Enterprise clients love it</span>
          </motion.div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="max-w-6xl mx-auto mb-32">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">From zero to compliant in 10 minutes</h2>
            <p className="text-zinc-500 text-lg">No legal background needed. Our AI handles the complexity.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-zinc-800 to-transparent -z-10" />

            {[
              { num: "01", title: "Answer 15 questions", desc: "About your company, the data you collect, your tech stack, and where your users are located." },
              { num: "02", title: "AI generates your docs", desc: "Our engine creates 4 legally-structured documents personalized to your specific SaaS product." },
              { num: "03", title: "Download & deploy", desc: "Copy-paste or download as PDF. Share your DPA link with enterprise prospects instantly." }
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="bg-zinc-900/50 border border-zinc-800/50 backdrop-blur-xl p-8 rounded-3xl relative group hover:border-emerald-500/30 transition-colors"
              >
                <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400 text-lg font-bold mb-6">
                  {step.num}
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* DOCUMENTS YOU GET */}
        <section id="documents" className="max-w-6xl mx-auto mb-32">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">The full compliance bundle</h2>
            <p className="text-zinc-500 text-lg max-w-2xl mx-auto">
              Everything your enterprise clients ask for before signing. No more scrambling when a prospect sends a security questionnaire.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {documents.map((doc, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-zinc-900/30 border border-zinc-800/50 p-8 rounded-3xl hover:border-emerald-500/20 transition-colors group"
              >
                <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400 mb-6 group-hover:bg-emerald-500/20 transition-colors">
                  {doc.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{doc.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{doc.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* THE PROBLEM */}
        <section className="max-w-4xl mx-auto mb-32">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-zinc-900/30 border border-zinc-800 rounded-3xl p-10 md:p-16"
          >
            <h2 className="text-2xl md:text-4xl font-bold mb-8 text-center">Sound familiar?</h2>
            <div className="space-y-6 text-lg text-zinc-400 leading-relaxed">
              <p>
                <span className="text-white font-semibold">"We love your product, but we need a DPA before we can sign."</span>
                <br />
                Your enterprise prospect just asked for documents you don't have. You Google "DPA template", paste something generic, and hope for the best.
              </p>
              <p>
                Or worse — you look at Vanta ($10K/year) and Drata ($15K/year) and realize compliance tooling wasn't built for bootstrapped founders.
              </p>
              <p className="text-emerald-400 font-semibold">
                Syncelle generates the exact documents enterprise clients need, personalized to your SaaS, for less than the cost of a single hour with a lawyer.
              </p>
            </div>
          </motion.div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="max-w-5xl mx-auto mb-32">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Simple, transparent pricing</h2>
            <p className="text-zinc-500 text-lg">Cancel anytime. No contracts. No hidden fees.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Monthly */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative p-8 rounded-3xl border border-zinc-800 bg-black hover:border-zinc-700 transition-all"
            >
              <h3 className="text-xl font-medium text-zinc-400 mb-2">Monthly</h3>
              <div className="text-5xl font-bold text-white mb-2">
                $35<span className="text-lg text-zinc-500 font-normal">/mo</span>
              </div>
              <p className="text-zinc-600 text-sm mb-8">Billed monthly</p>
              <ul className="space-y-4 mb-8">
                {[
                  "4 AI-generated documents",
                  "Tailored to your SaaS",
                  "PDF & copy-paste export",
                  "Unlimited regenerations",
                  "Sub-processor auto-detection",
                ].map((feat, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-zinc-300">
                    <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feat}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="block w-full py-3 rounded-xl font-bold transition-colors bg-zinc-800 hover:bg-zinc-700 text-white text-center">
                Get Started
              </Link>
            </motion.div>

            {/* Annual */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="relative p-8 rounded-3xl border border-emerald-500/50 bg-zinc-900/80 shadow-2xl shadow-emerald-900/20 scale-[1.02] hover:scale-[1.04] transition-all"
            >
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Save $130/year
              </span>
              <h3 className="text-xl font-medium text-zinc-400 mb-2">Annual</h3>
              <div className="text-5xl font-bold text-white mb-2">
                $290<span className="text-lg text-zinc-500 font-normal">/yr</span>
              </div>
              <p className="text-zinc-600 text-sm mb-8">$24.17/mo — billed annually</p>
              <ul className="space-y-4 mb-8">
                {[
                  "Everything in Monthly",
                  "2 months free",
                  "Priority document updates",
                  "Email notifications on law changes",
                  "Early access to new doc types",
                ].map((feat, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-zinc-300">
                    <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feat}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="block w-full py-3 rounded-xl font-bold transition-colors bg-emerald-500 hover:bg-emerald-400 text-black text-center">
                Get Started
              </Link>
            </motion.div>
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-3xl mx-auto mb-32">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">FAQ</h2>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                q: "Are these documents legally valid?",
                a: "Our documents are generated using established legal frameworks and GDPR guidelines. They're structured by AI trained on real compliance documentation. We recommend a legal review for high-stakes situations, but for most indie SaaS companies, our docs are more than sufficient to satisfy enterprise procurement teams."
              },
              {
                q: "How is this different from free privacy policy generators?",
                a: "Free generators only create generic privacy policies. Syncelle generates the full compliance bundle — Privacy Policy, Terms of Service, DPA, and Sub-processor List — all personalized to your specific SaaS product, tech stack, and data practices."
              },
              {
                q: "What if my stack changes?",
                a: "Just update your questionnaire answers and regenerate. Your subscription includes unlimited regenerations, so your documents always stay current."
              },
              {
                q: "Can I share my DPA with enterprise prospects?",
                a: "Yes. Each document gets a shareable link you can send directly to prospects. No more emailing PDFs back and forth."
              },
              {
                q: "Do I need to understand GDPR to use Syncelle?",
                a: "Not at all. Our questionnaire is written in plain language. You answer questions about your business, and we handle the legal complexity."
              }
            ].map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-6"
              >
                <h3 className="font-bold text-lg mb-2">{faq.q}</h3>
                <p className="text-zinc-400 leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="max-w-4xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center bg-zinc-900/30 border border-zinc-800 rounded-3xl p-12 md:p-20 relative overflow-hidden"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
            <h2 className="text-3xl md:text-5xl font-bold mb-6 relative z-10">
              Stop losing deals over missing documents
            </h2>
            <p className="text-zinc-400 text-lg mb-10 max-w-xl mx-auto relative z-10">
              Your next enterprise client is waiting. Have your compliance docs ready when they ask.
            </p>
            <Link href="/signup" className="relative z-10 inline-block px-10 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-full text-lg transition-all hover:scale-105 shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)]">
              Generate Your Docs Now
            </Link>
          </motion.div>
        </section>
      </main>

      <footer className="border-t border-zinc-900 bg-black py-10 text-center text-zinc-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Syncelle. All rights reserved.</p>
      </footer>
    </div>
  );
}
