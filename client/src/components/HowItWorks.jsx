import React from 'react';
import { PenTool, Cpu, Printer } from 'lucide-react';

const STEPS = [
  {
    step: '01',
    title: 'Tell us your idea',
    description: 'Type a brief description of what you want to communicate, whether it is a job application, a formal complaint, or a sick leave request.',
    icon: PenTool,
    tag: 'Input your topic'
  },
  {
    step: '02',
    title: 'AI writes your letter',
    description: 'Our Google Gemini-powered engine applies proper etiquette, salutations, correct grammar, and selected tone in seconds.',
    icon: Cpu,
    tag: 'Instant generation'
  },
  {
    step: '03',
    title: 'Copy, edit, download or print',
    description: 'Tweak words directly in the live editor, copy with a click, download a .txt copy, or send directly to your printer with flawless formatting.',
    icon: Printer,
    tag: 'Ready to send'
  }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works-section" className="py-20 bg-white border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200/60">
            Simple Workflow
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How It Works
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            From an informal idea to a ready-to-sign letter in three effortless steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {STEPS.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative bg-slate-50/60 border border-slate-200/80 rounded-2xl p-7 hover:shadow-md hover:border-brand-300 transition-all group"
              >
                <div className="flex items-center justify-between mb-5">
                  <span className="text-3xl font-black text-brand-200 group-hover:text-brand-400 transition-colors font-mono">
                    {item.step}
                  </span>
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-brand-600 group-hover:scale-110 group-hover:bg-brand-600 group-hover:text-white transition-all">
                    <Icon className="w-6 h-6" />
                  </div>
                </div>

                <span className="inline-block text-[11px] font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded mb-2">
                  {item.tag}
                </span>

                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
