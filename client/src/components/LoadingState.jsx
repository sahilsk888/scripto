import React, { useState, useEffect } from 'react';
import { Loader2, Sparkles, Feather, ScanLine, Brain, FileText } from 'lucide-react';

const STANDARD_WRITING_PHRASES = [
  'Understanding context and intent...',
  'Structuring formal salutation & letter layout...',
  'Drafting eloquent, human-sounding paragraphs...',
  'Polishing grammar, tone, and etiquette...',
  'Finalizing formatting for print and copy...'
];

const IMAGE_REFERENCE_STAGES = [
  {
    title: 'Analyzing reference...',
    subtitle: 'Running vision OCR and deciphering document details...',
    icon: ScanLine
  },
  {
    title: 'Understanding context...',
    subtitle: 'Extracting key points, recipient, intent, and tone...',
    icon: Brain
  },
  {
    title: 'Writing your letter...',
    subtitle: 'Transforming reference into a polished, professional document...',
    icon: Feather
  }
];

export default function LoadingState({ isImageReference = false }) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [imageStageIndex, setImageStageIndex] = useState(0);

  useEffect(() => {
    if (isImageReference) {
      // Progress through image stages: 0 -> 1 at 2.4s -> 2 at 5.2s
      const timer1 = setTimeout(() => setImageStageIndex(1), 2400);
      const timer2 = setTimeout(() => setImageStageIndex(2), 5200);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    } else {
      const interval = setInterval(() => {
        setPhraseIndex((prev) => (prev + 1) % STANDARD_WRITING_PHRASES.length);
      }, 1800);
      return () => clearInterval(interval);
    }
  }, [isImageReference]);

  const currentStage = isImageReference ? IMAGE_REFERENCE_STAGES[imageStageIndex] : null;
  const StageIcon = currentStage ? currentStage.icon : Feather;

  return (
    <div className="flex flex-col items-center justify-center min-h-[460px] p-8 text-center bg-white rounded-2xl border border-slate-200/80 shadow-paper">
      {/* Animated icon orb */}
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-accent-600 flex items-center justify-center text-white shadow-lg shadow-brand-500/30 animate-pulse">
          <StageIcon className="w-8 h-8 text-white animate-bounce" />
        </div>
        <div className="absolute -bottom-1 -right-1 p-1 bg-white rounded-full shadow">
          <Loader2 className="w-4 h-4 text-brand-600 animate-spin" />
        </div>
      </div>

      {/* Main loading text */}
      <h3 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
        <span>{isImageReference ? currentStage.title : 'Writing your letter...'}</span>
        <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
      </h3>

      {/* Cycling stage message */}
      <p className="text-sm font-medium text-brand-600 mt-2 min-h-6 transition-all duration-300">
        {isImageReference ? currentStage.subtitle : STANDARD_WRITING_PHRASES[phraseIndex]}
      </p>

      <p className="text-xs text-slate-400 mt-1 max-w-xs">
        {isImageReference
          ? 'Extracting structured details and crafting a professional letter.'
          : 'Crafting a tailored document according to your selected format and tone.'}
      </p>

      {/* Skeleton placeholders */}
      <div className="w-full max-w-md mt-8 space-y-3 opacity-60">
        <div className="h-3.5 bg-slate-200 rounded-full w-2/5 animate-pulse" />
        <div className="h-3 bg-slate-100 rounded-full w-3/5 animate-pulse" />
        <div className="h-4 bg-slate-100 rounded-full w-full animate-pulse pt-2" />
        <div className="h-3 bg-slate-100 rounded-full w-11/12 animate-pulse" />
        <div className="h-3 bg-slate-100 rounded-full w-4/5 animate-pulse" />
        <div className="pt-4 flex justify-between">
          <div className="h-3 bg-slate-200 rounded-full w-1/4 animate-pulse" />
          <div className="h-3 bg-slate-100 rounded-full w-1/6 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

