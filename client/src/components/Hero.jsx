import React from 'react';
import { Sparkles, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

export default function Hero({ onGetStarted }) {
  return (
    <section id="home" className="relative pt-8 pb-12 overflow-hidden">
      {/* Background ambient lighting effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none -z-10">
        <div className="absolute top-12 left-1/4 w-72 h-72 bg-brand-400/15 rounded-full blur-3xl" />
        <div className="absolute top-20 right-1/4 w-80 h-80 bg-accent-400/15 rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200/70 text-brand-700 text-xs font-semibold mb-6 shadow-sm">
          <span className="flex h-2 w-2 rounded-full bg-brand-600 animate-ping" />
          <Sparkles className="w-3.5 h-3.5 text-brand-600" />
          <span>Next-Gen AI Letter Generator & Formatter</span>
        </div>

        {/* Large Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Write Better Letters{' '}
          <span className="bg-gradient-to-r from-brand-600 via-brand-700 to-accent-600 bg-clip-text text-transparent">
            with AI
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
          Just tell us what you want to say. SCRIPTO turns your idea into a professional, perfectly formatted letter in seconds.
        </p>

        {/* Value Prop Badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs sm:text-sm font-medium text-slate-600">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>17+ Letter Formats</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>10 Languages Supported</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Instant Document Export</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-brand-500" />
            <span>Grammar & Etiquette Polished</span>
          </div>
        </div>
      </div>
    </section>
  );
}
