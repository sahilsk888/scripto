import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQS = [
  {
    q: 'How does SCRIPTO work?',
    a: 'SCRIPTO takes your informal notes, purpose, and chosen settings, and leverages Google Gemini models trained on professional correspondence to craft a complete letter with proper headers, subject line, paragraph structure, and etiquette.'
  },
  {
    q: 'Can I write letters in different languages?',
    a: 'Yes! SCRIPTO supports 10 languages: English, Hindi, Kannada, Tamil, Telugu, Malayalam, Marathi, Bengali, Gujarati, and Urdu. The AI outputs the complete letter naturally in the native script of your selected language.'
  },
  {
    q: 'Can I edit the generated letter?',
    a: 'Absolutely. Click the "Edit Letter" button above the paper preview to tweak any sentence, add personal details, or rephrase paragraphs. Changes are preserved directly in your preview.'
  },
  {
    q: 'Can I download my letter?',
    a: 'Yes, you can click the "Download" button to save your formatted letter as a .txt file, or click "Copy" to immediately paste it into your email client or Word processor.'
  },
  {
    q: 'Is the generated letter ready to print?',
    a: 'Yes! When you click "Print", SCRIPTO applies a print stylesheet that hides the navigation, forms, and background elements, leaving only a clean, crisp document sized for standard paper.'
  },
  {
    q: 'Can I choose different tones?',
    a: 'Yes, you can select from 7 tones: Very Formal, Formal, Professional, Friendly, Polite, Casual, and Persuasive, making SCRIPTO suitable for everything from corporate disputes to heartfelt thank-you notes.'
  }
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section id="faq-section" className="py-20 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-600 bg-white px-3 py-1 rounded-full border border-slate-200">
            Got Questions?
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Everything you need to know about generating and formatting letters with SCRIPTO.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.q}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  className="w-full px-6 py-4.5 text-left flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="text-base font-bold text-slate-800">
                    {faq.q}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 bg-brand-50 text-brand-600' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/30">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
