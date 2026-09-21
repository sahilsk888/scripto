import React from 'react';
import { FileText, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Brand */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-accent-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                SCRIPTO
              </span>
            </div>
            <p className="text-sm text-slate-500 max-w-md leading-relaxed">
              SCRIPTO simplifies formal correspondence. Craft standard-compliant leave requests, business inquiries, job cover letters, and formal applications in seconds.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-600 font-medium bg-emerald-50 w-fit px-3 py-1 rounded-full border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Secure API backend architecture • Keys never exposed in client</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => scrollTo('home')}
                  className="hover:text-brand-600 transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('letter-generator-section')}
                  className="hover:text-brand-600 transition-colors"
                >
                  Letter Generator
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('how-it-works-section')}
                  className="hover:text-brand-600 transition-colors"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('features-section')}
                  className="hover:text-brand-600 transition-colors"
                >
                  Features
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('faq-section')}
                  className="hover:text-brand-600 transition-colors"
                >
                  FAQ
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Formats */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Popular Formats
            </h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li>Leave Applications</li>
              <li>Job & Cover Letters</li>
              <li>Complaint & Grievance Letters</li>
              <li>College & School Inquiries</li>
              <li>Recommendation Letters</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} SCRIPTO. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with modern React, Tailwind CSS, Node.js & Google Gemini
          </p>
        </div>
      </div>
    </footer>
  );
}
