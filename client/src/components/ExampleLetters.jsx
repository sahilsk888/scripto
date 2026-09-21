import React from 'react';
import { ArrowRight, Calendar, Briefcase, AlertOctagon, KeyRound } from 'lucide-react';

const EXAMPLES = [
  {
    title: 'Leave Application',
    badge: 'College / Office',
    icon: Calendar,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    topic: 'I need to request 3 days of medical leave from my company due to severe viral flu. I have consulted a physician and will submit the prescription.',
    letterType: 'Leave Application',
    tone: 'Polite',
    recipientName: 'The HR Manager',
    senderName: 'Sahil Kumar',
    organization: 'Tech Innovations Ltd.'
  },
  {
    title: 'Job Application',
    badge: 'Career & Employment',
    icon: Briefcase,
    color: 'text-brand-600',
    bg: 'bg-brand-50',
    topic: 'Applying for the Senior Frontend Developer position. I have 4 years of experience building scalable React & TypeScript web applications, reducing page latency by 40%.',
    letterType: 'Job Application',
    tone: 'Professional',
    recipientName: 'Hiring Team',
    senderName: 'Sahil Kumar',
    organization: 'Apex Software Labs'
  },
  {
    title: 'Complaint Letter',
    badge: 'Consumer & Services',
    icon: AlertOctagon,
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    topic: 'Reporting persistent broadband internet outages over the past two weeks despite multiple support tickets. Requesting immediate line repair and a service credit.',
    letterType: 'Complaint Letter',
    tone: 'Formal',
    recipientName: 'Customer Support Lead',
    senderName: 'Sahil Kumar',
    organization: 'FiberNet Broadband Services'
  },
  {
    title: 'Permission Letter',
    badge: 'School & Campus',
    icon: KeyRound,
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    topic: 'Requesting permission to use the college auditorium and AV equipment on Saturday for the annual inter-college robotics workshop and exhibition.',
    letterType: 'Permission Letter',
    tone: 'Very Formal',
    recipientName: 'The Dean of Student Affairs',
    senderName: 'Student Club President',
    organization: 'National Institute of Technology'
  }
];

export default function ExampleLetters({ onSelectExample }) {
  return (
    <section id="examples-section" className="py-20 bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200/60">
            Presets & Templates
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Popular Example Letters
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Click any template below to automatically fill the generator and see how SCRIPTO structures your document.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {EXAMPLES.map((example) => {
            const Icon = example.icon;
            return (
              <div
                key={example.title}
                className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-6 flex flex-col justify-between hover:border-brand-400 hover:shadow-md transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl ${example.bg} flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${example.color}`} />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {example.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {example.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                    "{example.topic}"
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectExample(example)}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold text-brand-600 bg-white hover:bg-brand-600 hover:text-white border border-brand-200 hover:border-transparent rounded-xl transition-all shadow-sm"
                >
                  <span>Use This Example</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
