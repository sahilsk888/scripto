import React, { useState } from 'react';
import {
  Copy,
  Check,
  Download,
  Printer,
  Edit3,
  RotateCcw,
  PlusCircle,
  FileText,
  Eye,
  Sparkles
} from 'lucide-react';
import LoadingState from './LoadingState';

export default function LetterPreview({
  letter,
  isLoading,
  isImageReference = false,
  onLetterChange,
  onRegenerate,
  onNewLetter
}) {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Handle Copy to clipboard
  const handleCopy = async () => {
    if (!letter) return;
    try {
      await navigator.clipboard.writeText(letter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Handle Download as letter.txt
  const handleDownload = () => {
    if (!letter) return;
    const element = document.createElement('a');
    const file = new Blob([letter], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = 'letter.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    URL.revokeObjectURL(element.href);
  };

  // Handle Print letter
  const handlePrint = () => {
    if (!letter) return;
    window.print();
  };

  // Empty State
  if (!isLoading && !letter) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-slate-300 shadow-sm p-8 sm:p-12 flex flex-col items-center justify-center text-center min-h-[460px]">
        <div className="w-16 h-16 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-500 mb-4 shadow-sm">
          <FileText className="w-8 h-8 stroke-[1.5]" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 tracking-tight">
          Your letter will appear here
        </h3>
        <p className="text-sm text-slate-500 max-w-sm mt-1 mb-6">
          Enter your topic on the left, choose your style and tone, and click <strong>Generate Letter</strong>.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
          <span className="px-2.5 py-1 bg-slate-100 rounded-md font-medium text-slate-600">
            📄 Formatted Structure
          </span>
          <span className="px-2.5 py-1 bg-slate-100 rounded-md font-medium text-slate-600">
            🖨️ Print Ready
          </span>
          <span className="px-2.5 py-1 bg-slate-100 rounded-md font-medium text-slate-600">
            ✏️ Direct Editable
          </span>
        </div>
      </div>
    );
  }

  // Loading State
  if (isLoading) {
    return <LoadingState isImageReference={isImageReference} />;
  }

  // Calculate word and character count
  const wordCount = letter.trim().split(/\s+/).filter(Boolean).length;
  const charCount = letter.length;

  return (
    <div className="flex flex-col space-y-4">
      {/* Top Action Toolbar (Hidden during print) */}
      <div
        id="preview-header-bar"
        className="bg-white rounded-xl border border-slate-200 shadow-sm px-4 py-3 flex flex-wrap items-center justify-between gap-3 no-print"
      >
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
          <span className="text-sm font-bold text-slate-800 tracking-tight">Generated Letter</span>
          <span className="text-xs text-slate-400 font-mono hidden sm:inline">
            ({wordCount} words • {charCount} chars)
          </span>
        </div>

        {/* Action Buttons */}
        <div id="preview-actions-bar" className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {/* Edit Mode Toggle */}
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all flex items-center gap-1.5 ${
              isEditing
                ? 'bg-brand-50 border-brand-300 text-brand-700'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
            title={isEditing ? 'Done Editing' : 'Edit Letter Directly'}
          >
            {isEditing ? (
              <>
                <Eye className="w-3.5 h-3.5 text-brand-600" />
                <span>Done Editing</span>
              </>
            ) : (
              <>
                <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                <span>Edit Letter</span>
              </>
            )}
          </button>

          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all flex items-center gap-1.5"
            title="Copy letter to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-bold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy</span>
              </>
            )}
          </button>

          {/* Download Button */}
          <button
            type="button"
            onClick={handleDownload}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all flex items-center gap-1.5"
            title="Download as letter.txt"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Download</span>
          </button>

          {/* Print Button */}
          <button
            type="button"
            onClick={handlePrint}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all flex items-center gap-1.5"
            title="Print letter"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print</span>
          </button>

          {/* Regenerate Button */}
          <button
            type="button"
            onClick={onRegenerate}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-brand-50 hover:text-brand-700 hover:border-brand-200 transition-all flex items-center gap-1.5"
            title="Regenerate with current parameters"
          >
            <RotateCcw className="w-3.5 h-3.5 text-brand-600" />
            <span className="hidden md:inline">Regenerate</span>
          </button>

          {/* New Letter Button */}
          <button
            type="button"
            onClick={onNewLetter}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 transition-all flex items-center gap-1.5"
            title="Clear and start new letter"
          >
            <PlusCircle className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden md:inline">New Letter</span>
          </button>
        </div>
      </div>

      {/* Realistic Paper Document Container */}
      <div
        id="letter-printable-paper"
        className="letter-paper rounded-2xl border border-slate-200/90 shadow-paper-lg p-6 sm:p-10 lg:p-12 relative min-h-[550px] transition-all"
      >
        {isEditing ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-brand-700 bg-brand-50/80 px-3 py-1.5 rounded-lg border border-brand-200/60 no-print">
              <span>Editing mode enabled — changes are saved instantly to your preview.</span>
            </div>
            <textarea
              value={letter}
              onChange={(e) => onLetterChange(e.target.value)}
              rows={22}
              className="w-full text-slate-900 font-serif leading-relaxed text-sm sm:text-base p-2 border-0 focus:outline-none focus:ring-1 focus:ring-brand-500 rounded bg-transparent resize-y"
              placeholder="Your letter text here..."
            />
          </div>
        ) : (
          <div className="letter-body font-serif text-slate-800 text-sm sm:text-base leading-relaxed whitespace-pre-wrap selection:bg-brand-100 selection:text-slate-900">
            {letter}
          </div>
        )}
      </div>
    </div>
  );
}
