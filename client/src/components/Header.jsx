import React, { useState } from 'react';
import { Sparkles, Menu, X, FileText } from 'lucide-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-3">
          {/* Logo */}
          <a
            href="#home"
            className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-brand-500 rounded-lg p-1"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-accent-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-brand-900 to-slate-800 bg-clip-text text-transparent">
                SCRIPTO
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 -mt-1">
                Smart Formatter
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <button
              onClick={() => scrollToSection('home')}
              className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-brand-600 hover:bg-brand-50/50 rounded-lg transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('how-it-works-section')}
              className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-brand-600 hover:bg-brand-50/50 rounded-lg transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('features-section')}
              className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-brand-600 hover:bg-brand-50/50 rounded-lg transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('examples-section')}
              className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-brand-600 hover:bg-brand-50/50 rounded-lg transition-colors"
            >
              Examples
            </button>
            <button
              onClick={() => scrollToSection('faq-section')}
              className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-brand-600 hover:bg-brand-50/50 rounded-lg transition-colors"
            >
              FAQ
            </button>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => scrollToSection('letter-generator-section')}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 active:bg-brand-800 rounded-xl shadow-sm hover:shadow-md hover:shadow-brand-600/20 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
            >
              <Sparkles className="w-4 h-4 text-brand-200" />
              <span>Create Letter</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu panel */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white/95 px-4 pt-2 pb-5 space-y-2 shadow-lg">
          <button
            onClick={() => scrollToSection('home')}
            className="w-full text-left px-3 py-2 text-base font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-600 rounded-md"
          >
            Home
          </button>
          <button
            onClick={() => scrollToSection('how-it-works-section')}
            className="w-full text-left px-3 py-2 text-base font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-600 rounded-md"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollToSection('features-section')}
            className="w-full text-left px-3 py-2 text-base font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-600 rounded-md"
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection('examples-section')}
            className="w-full text-left px-3 py-2 text-base font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-600 rounded-md"
          >
            Examples
          </button>
          <button
            onClick={() => scrollToSection('faq-section')}
            className="w-full text-left px-3 py-2 text-base font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-600 rounded-md"
          >
            FAQ
          </button>
          <div className="pt-2">
            <button
              onClick={() => scrollToSection('letter-generator-section')}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-brand-600 rounded-xl shadow-md"
            >
              <Sparkles className="w-4 h-4 text-brand-200" />
              <span>Create Letter</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
