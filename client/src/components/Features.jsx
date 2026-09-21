import React from 'react';
import {
  Sparkles,
  Layers,
  Globe2,
  FileCheck,
  Smile,
  Zap,
  Edit,
  DownloadCloud,
  Printer
} from 'lucide-react';

const FEATURES = [
  {
    title: 'AI-Powered Writing',
    description: 'Advanced language intelligence expands rough points into coherent, articulate letters with flawless syntax.',
    icon: Sparkles,
    color: 'text-amber-500',
    bg: 'bg-amber-50'
  },
  {
    title: 'Multiple Letter Types',
    description: '17 specialized formats including Leave, Job Applications, Resignations, Complaints, Permissions, and Business letters.',
    icon: Layers,
    color: 'text-brand-600',
    bg: 'bg-brand-50'
  },
  {
    title: 'Multiple Languages',
    description: 'Write natively in 10 languages: English, Hindi, Kannada, Tamil, Telugu, Malayalam, Marathi, Bengali, Gujarati, & Urdu.',
    icon: Globe2,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50'
  },
  {
    title: 'Professional Formatting',
    description: 'Includes proper sender/recipient alignment, formal dates, subject lines, salutations, and standard sign-offs.',
    icon: FileCheck,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50'
  },
  {
    title: 'Tone Selection',
    description: 'Choose from 7 bespoke tones—from Very Formal and Polite to Persuasive and Friendly—to suit every occasion.',
    icon: Smile,
    color: 'text-rose-500',
    bg: 'bg-rose-50'
  },
  {
    title: 'Instant Generation',
    description: 'Generate polished letters in under 5 seconds, saving you hours of drafting, rewriting, and formatting.',
    icon: Zap,
    color: 'text-amber-600',
    bg: 'bg-amber-50'
  },
  {
    title: 'Easy Editing',
    description: 'Edit the generated text directly on the document preview with instant character and word count tracking.',
    icon: Edit,
    color: 'text-cyan-600',
    bg: 'bg-cyan-50'
  },
  {
    title: 'Copy & Download',
    description: 'Single-click copy to your clipboard or download as a standard letter.txt document ready for email or archiving.',
    icon: DownloadCloud,
    color: 'text-blue-600',
    bg: 'bg-blue-50'
  },
  {
    title: 'Print Ready',
    description: 'Integrated print mode automatically hides navigation, forms, and background elements for clean physical printing.',
    icon: Printer,
    color: 'text-violet-600',
    bg: 'bg-violet-50'
  }
];

export default function Features() {
  return (
    <section id="features-section" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-600 bg-white px-3 py-1 rounded-full border border-slate-200">
            Why SCRIPTO
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Everything you need for perfect letters
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Engineered for students, professionals, job seekers, and businesses who demand impeccable written correspondence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-brand-300 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl ${feat.bg} flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 ${feat.color}`} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
