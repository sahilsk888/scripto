import React, { useState } from 'react';
import {
  Sparkles,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  AlertCircle,
  Users,
  Plus,
  Image as ImageIcon,
  Lock,
  Camera,
  Trash2,
  RefreshCw,
  ZoomIn
} from 'lucide-react';
import ImageLightboxModal from './ImageLightboxModal';

export const LETTER_TYPES = [
  'Formal Letter',
  'Informal Letter',
  'Application Letter',
  'Leave Application',
  'Job Application',
  'Complaint Letter',
  'Request Letter',
  'Permission Letter',
  'Resignation Letter',
  'Apology Letter',
  'Invitation Letter',
  'Thank You Letter',
  'Business Letter',
  'School/College Letter',
  'Recommendation Letter',
  'Cover Letter',
  'Custom Letter'
];

export const TONES = [
  'Very Formal',
  'Formal',
  'Professional',
  'Friendly',
  'Polite',
  'Casual',
  'Persuasive'
];

export const LANGUAGES = [
  'English',
  'Hindi',
  'Kannada',
  'Tamil',
  'Telugu',
  'Malayalam',
  'Marathi',
  'Bengali',
  'Gujarati',
  'Urdu'
];

export const LENGTHS = [
  { id: 'Short', label: 'Short', desc: '1-2 concise paragraphs' },
  { id: 'Medium', label: 'Medium', desc: 'Standard formal length' },
  { id: 'Detailed', label: 'Detailed', desc: 'Thorough & comprehensive' }
];

export default function LetterForm({
  formData,
  onChange,
  onSubmit,
  onReset,
  isLoading,
  error,
  onOpenAddSection,
  referenceImage,
  referencePreviewUrl,
  onRemoveReferenceImage,
  onGenerateFromImage
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);

  const handleFieldChange = (field, value) => {
    onChange({ ...formData, [field]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (referenceImage) {
      onGenerateFromImage();
    } else {
      onSubmit();
    }
  };

  return (
    <div id="generator-form-col" className="bg-white rounded-2xl border border-slate-200/90 shadow-paper p-6 sm:p-7 flex flex-col justify-between">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Section Header */}
        <div className="border-b border-slate-100 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span>Tell us what you need</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Describe your purpose and SCRIPTO will handle the etiquette & format.
              </p>
            </div>
            <button
              type="button"
              onClick={onReset}
              title="Reset Form"
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-xs flex items-center gap-1 font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>

        {/* Error alert banner */}
        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs sm:text-sm text-rose-700 flex items-start gap-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1 leading-snug">{error}</div>
          </div>
        )}

        {/* NEW FEATURE: + Add Section Button & Reference Image Preview */}
        {!referenceImage ? (
          <div>
            <button
              type="button"
              id="add-section-button"
              onClick={onOpenAddSection}
              className="w-full py-2.5 px-4 rounded-xl border-2 border-dashed border-slate-300 hover:border-brand-500 bg-slate-50/70 hover:bg-brand-50/50 text-slate-700 hover:text-brand-700 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer group shadow-xs hover:shadow-sm"
            >
              <Plus className="w-4 h-4 text-brand-600 group-hover:rotate-90 transition-transform duration-200" />
              <span>+ Add Section</span>
              <span className="text-[11px] font-normal text-slate-500 group-hover:text-brand-600">
                (Reference Image)
              </span>
            </button>
          </div>
        ) : (
          <div className="bg-brand-50/50 border border-brand-200 rounded-2xl p-4 space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-900 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-brand-600" />
                <span>REFERENCE IMAGE</span>
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={onOpenAddSection}
                  className="text-xs text-brand-700 hover:text-brand-900 font-semibold px-2.5 py-1 rounded-md hover:bg-brand-100/70 transition-colors flex items-center gap-1 cursor-pointer"
                  title="Replace image"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Change</span>
                </button>
                <button
                  type="button"
                  onClick={onRemoveReferenceImage}
                  className="text-xs text-slate-400 hover:text-rose-600 font-medium px-2 py-1 rounded-md hover:bg-rose-50 transition-colors flex items-center gap-1 cursor-pointer"
                  title="Remove reference image"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Remove</span>
                </button>
              </div>
            </div>

            {/* Image Thumbnail Preview (Click to inspect) */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => setShowLightbox(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') setShowLightbox(true);
              }}
              className="relative group rounded-xl overflow-hidden border border-brand-200/80 bg-white max-h-44 flex items-center justify-center shadow-xs cursor-zoom-in hover:border-brand-400 transition-all"
              title="Click to inspect full image"
            >
              <img
                src={referencePreviewUrl}
                alt="Reference (Click to inspect)"
                className="max-h-44 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/15 flex items-center justify-center transition-colors duration-200 pointer-events-none">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-slate-900/75 text-white text-[11px] font-medium px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm backdrop-blur-xs">
                  <ZoomIn className="w-3 h-3" />
                  <span>Click to preview</span>
                </span>
              </div>
            </div>

            {/* Prompt & Action */}
            <div className="space-y-2 pt-1">
              <p className="text-xs font-semibold text-slate-700">
                What should SCRIPTO do with this image?
              </p>
              <button
                type="button"
                id="generate-from-reference-button"
                onClick={onGenerateFromImage}
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-brand-600 via-brand-600 to-accent-600 hover:from-brand-700 hover:to-accent-700 active:scale-[0.99] disabled:opacity-50 shadow-md hover:shadow-brand-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className={`w-4 h-4 text-amber-200 ${isLoading ? 'animate-spin' : ''}`} />
                <span>{isLoading ? 'Analyzing & Writing...' : 'Generate Professional Letter'}</span>
              </button>
            </div>

            {/* Privacy note */}
            <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-0.5">
              <Lock className="w-3 h-3 text-slate-400 shrink-0" />
              <span>Your image is used only as a reference to generate your letter.</span>
            </div>
          </div>
        )}

        {/* Main Topic / Reason Textarea */}
        <div>
          <label htmlFor="topic" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            What is this letter about? {!referenceImage && <span className="text-rose-500">*</span>}
            {referenceImage && <span className="text-[11px] font-normal text-slate-400 ml-1.5">(Optional with image reference)</span>}
          </label>
          <div className="relative">
            <textarea
              id="topic"
              name="topic"
              rows={referenceImage ? 2 : 4}
              required={!referenceImage}
              value={formData.topic}
              onChange={(e) => handleFieldChange('topic', e.target.value)}
              placeholder={
                referenceImage
                  ? "Add any extra instructions (e.g. rewrite more formally, mention medical slip is attached)..."
                  : "Example: I want to write a leave application to my college because I am sick and need 3 days leave."
              }
              className="w-full px-3.5 py-3 text-sm text-slate-800 placeholder-slate-400 bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
            />
            <div className="mt-1 flex justify-between items-center text-[11px] text-slate-400">
              <span>Be as brief or detailed as you like</span>
              <span>{formData.topic.length} chars</span>
            </div>
          </div>
        </div>

        {/* TO AND FROM Section */}
        <div className="bg-slate-50/80 border border-slate-200/90 rounded-xl p-3.5 sm:p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-brand-600" />
              <span>To &amp; From Details</span>
            </span>
            <span className="text-[11px] text-slate-400 font-medium">Optional</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* FROM Field */}
            <div>
              <label htmlFor="senderName" className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase tracking-wide">FROM</span>
                <span>Sender (Your Name / Role)</span>
              </label>
              <input
                id="senderName"
                type="text"
                value={formData.senderName}
                onChange={(e) => handleFieldChange('senderName', e.target.value)}
                placeholder="e.g., Sahil Kumar, Student / Team Member"
                className="w-full px-3 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all shadow-xs"
              />
            </div>

            {/* TO Field */}
            <div>
              <label htmlFor="recipientName" className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-md bg-brand-100 text-brand-800 text-[10px] font-extrabold uppercase tracking-wide">TO</span>
                <span>Recipient (Name / Designation)</span>
              </label>
              <input
                id="recipientName"
                type="text"
                value={formData.recipientName}
                onChange={(e) => handleFieldChange('recipientName', e.target.value)}
                placeholder="e.g., The Class Advisor, Principal, HR Manager"
                className="w-full px-3 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all shadow-xs"
              />
            </div>
          </div>
        </div>

        {/* Grid for Primary Controls: Letter Type, Tone, Language, Length */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Letter Type */}
          <div>
            <label htmlFor="letterType" className="block text-xs font-semibold text-slate-700 mb-1">
              Letter Type
            </label>
            <div className="relative">
              <select
                id="letterType"
                value={formData.letterType}
                onChange={(e) => handleFieldChange('letterType', e.target.value)}
                className="w-full px-3 py-2.5 text-sm text-slate-800 bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 appearance-none transition-all pr-9 cursor-pointer font-medium"
              >
                {LETTER_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Tone */}
          <div>
            <label htmlFor="tone" className="block text-xs font-semibold text-slate-700 mb-1">
              Tone
            </label>
            <div className="relative">
              <select
                id="tone"
                value={formData.tone}
                onChange={(e) => handleFieldChange('tone', e.target.value)}
                className="w-full px-3 py-2.5 text-sm text-slate-800 bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 appearance-none transition-all pr-9 cursor-pointer font-medium"
              >
                {TONES.map((tone) => (
                  <option key={tone} value={tone}>
                    {tone}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Language */}
          <div>
            <label htmlFor="language" className="block text-xs font-semibold text-slate-700 mb-1">
              Language
            </label>
            <div className="relative">
              <select
                id="language"
                value={formData.language}
                onChange={(e) => handleFieldChange('language', e.target.value)}
                className="w-full px-3 py-2.5 text-sm text-slate-800 bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 appearance-none transition-all pr-9 cursor-pointer font-medium"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Length */}
          <div>
            <label htmlFor="length" className="block text-xs font-semibold text-slate-700 mb-1">
              Length
            </label>
            <div className="relative">
              <select
                id="length"
                value={formData.length}
                onChange={(e) => handleFieldChange('length', e.target.value)}
                className="w-full px-3 py-2.5 text-sm text-slate-800 bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 appearance-none transition-all pr-9 cursor-pointer font-medium"
              >
                {LENGTHS.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label} ({item.desc})
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Expandable Additional Details */}
        <div className="border border-slate-200/70 rounded-xl overflow-hidden bg-slate-50/40">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full px-4 py-3 flex items-center justify-between text-xs font-semibold text-slate-700 hover:bg-slate-100/60 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-brand-600" />
              <span>More Details (Organization, Date, Custom Notes)</span>
            </span>
            {showAdvanced ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {showAdvanced && (
            <div className="p-4 pt-2 border-t border-slate-200/60 space-y-3.5 bg-white/70 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="organization" className="block text-[11px] font-medium text-slate-600 mb-1">
                    Organization / Company / School
                  </label>
                  <input
                    id="organization"
                    type="text"
                    value={formData.organization}
                    onChange={(e) => handleFieldChange('organization', e.target.value)}
                    placeholder="e.g., ABC University, Acme Corp"
                    className="w-full px-3 py-2 text-xs text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1.5 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label htmlFor="date" className="block text-[11px] font-medium text-slate-600 mb-1">
                    Date
                  </label>
                  <input
                    id="date"
                    type="text"
                    value={formData.date}
                    onChange={(e) => handleFieldChange('date', e.target.value)}
                    placeholder="e.g., September 15, 2026 or Today"
                    className="w-full px-3 py-2 text-xs text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1.5 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="additionalInstructions" className="block text-[11px] font-medium text-slate-600 mb-1">
                  Additional Instructions / Specific Points to Include
                </label>
                <input
                  id="additionalInstructions"
                  type="text"
                  value={formData.additionalInstructions}
                  onChange={(e) => handleFieldChange('additionalInstructions', e.target.value)}
                  placeholder="e.g., Mention medical certificate is attached; request reply by Friday"
                  className="w-full px-3 py-2 text-xs text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1.5 focus:ring-brand-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Primary Action Button */}
        <div className="pt-2">
          <button
            type="submit"
            id="generate-letter-button"
            disabled={isLoading || (!referenceImage && !formData.topic.trim())}
            className="w-full py-3.5 px-6 rounded-xl font-bold text-sm sm:text-base text-white bg-gradient-to-r from-brand-600 via-brand-600 to-accent-600 hover:from-brand-700 hover:to-accent-700 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-md hover:shadow-lg hover:shadow-brand-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className={`w-5 h-5 text-amber-200 ${isLoading ? 'animate-spin' : ''}`} />
            <span>
              {isLoading
                ? 'Generating Letter...'
                : referenceImage
                ? '✨ Generate Letter from Reference'
                : '✨ Generate Letter'}
            </span>
          </button>
        </div>
      </form>

      {/* Fullscreen Lightbox for Inspection */}
      <ImageLightboxModal
        isOpen={showLightbox}
        imageUrl={referencePreviewUrl}
        alt="Reference Document Preview"
        onClose={() => setShowLightbox(false)}
      />
    </div>
  );
}
