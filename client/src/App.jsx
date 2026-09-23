import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import LetterForm from './components/LetterForm';
import LetterPreview from './components/LetterPreview';
import AddSectionModal from './components/AddSectionModal';
import HowItWorks from './components/HowItWorks';
import Features from './components/Features';
import ExampleLetters from './components/ExampleLetters';
import FaqSection from './components/FaqSection';
import Footer from './components/Footer';
import { generateLetterAPI, analyzeImageAndGenerateLetterAPI } from './services/api';

const DEFAULT_FORM_DATA = {
  topic: '',
  letterType: 'Formal Letter',
  tone: 'Formal',
  language: 'English',
  length: 'Medium',
  recipientName: '',
  senderName: '',
  organization: '',
  date: new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }),
  additionalInstructions: ''
};

export default function App() {
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [error, setError] = useState(null);

  // New Feature: Reference Image & Add Section modal state
  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false);
  const [referenceImage, setReferenceImage] = useState(null);
  const [referencePreviewUrl, setReferencePreviewUrl] = useState(null);

  // Trigger standard letter generation
  const handleGenerate = async () => {
    if (!formData.topic.trim()) {
      setError('Please describe what your letter is about.');
      return;
    }

    setIsLoading(true);
    setIsImageLoading(false);
    setError(null);

    try {
      const result = await generateLetterAPI(formData);
      setGeneratedLetter(result.letter);

      // Scroll smoothly to preview if on mobile
      if (window.innerWidth < 1024) {
        setTimeout(() => {
          const previewEl = document.getElementById('letter-printable-paper');
          if (previewEl) {
            previewEl.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    } catch (err) {
      console.error('Generation failure:', err);
      setError(err.message || 'Failed to generate letter. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger letter generation from Reference Image
  const handleGenerateFromImage = async () => {
    if (!referenceImage) {
      setError('Please select or capture a reference image first.');
      return;
    }

    setIsLoading(true);
    setIsImageLoading(true);
    setError(null);

    try {
      const result = await analyzeImageAndGenerateLetterAPI(referenceImage, formData);
      setGeneratedLetter(result.letter);

      // Sync extracted structured context to form inputs for user visibility & editing
      if (result.extractedContext) {
        const ctx = result.extractedContext;
        setFormData((prev) => ({
          ...prev,
          topic: prev.topic?.trim() ? prev.topic : (ctx.purpose || ctx.subject || prev.topic),
          letterType: ctx.documentType || prev.letterType,
          recipientName: ctx.recipient || prev.recipientName,
          senderName: ctx.sender || prev.senderName,
          organization: ctx.organization || prev.organization,
          date: ctx.date || prev.date
        }));
      }

      // Scroll smoothly to preview on mobile
      if (window.innerWidth < 1024) {
        setTimeout(() => {
          const previewEl = document.getElementById('letter-printable-paper');
          if (previewEl) {
            previewEl.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    } catch (err) {
      console.error('Image reference generation failure:', err);
      setError(err.message || "We couldn't analyze this image. Please try another image.");
    } finally {
      setIsLoading(false);
      setIsImageLoading(false);
    }
  };

  // Handle image selected from camera or upload
  const handleImageSelected = (file, previewUrl) => {
    // Revoke previous blob if any
    if (referencePreviewUrl && referencePreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(referencePreviewUrl);
    }
    setReferenceImage(file);
    setReferencePreviewUrl(previewUrl);
    setIsAddSectionOpen(false);
    setError(null);
  };

  // Remove reference image
  const handleRemoveReferenceImage = () => {
    if (referencePreviewUrl && referencePreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(referencePreviewUrl);
    }
    setReferenceImage(null);
    setReferencePreviewUrl(null);
  };

  // Reset form and letter preview
  const handleReset = () => {
    handleRemoveReferenceImage();
    setFormData(DEFAULT_FORM_DATA);
    setGeneratedLetter('');
    setError(null);
  };

  // Populate from preset example
  const handleSelectExample = (example) => {
    handleRemoveReferenceImage();
    setFormData((prev) => ({
      ...prev,
      topic: example.topic,
      letterType: example.letterType || 'Formal Letter',
      tone: example.tone || 'Formal',
      recipientName: example.recipientName || '',
      senderName: example.senderName || '',
      organization: example.organization || '',
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      additionalInstructions: ''
    }));
    setError(null);

    // Scroll up to generator
    const el = document.getElementById('letter-generator-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (referencePreviewUrl && referencePreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(referencePreviewUrl);
      }
    };
  }, [referencePreviewUrl]);

  return (
    <>
      <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-brand-500 selection:text-white no-print">
        {/* Navigation Header */}
        <Header />

        <main className="flex-grow">
          {/* Hero Section */}
          <Hero
            onGetStarted={() => {
              const el = document.getElementById('letter-generator-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          />

          {/* Generator Section (Hero Feature) */}
          <section
            id="letter-generator-section"
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 scroll-mt-24"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Generator Form (5 cols on lg) */}
              <div className="lg:col-span-5">
                <LetterForm
                  formData={formData}
                  onChange={setFormData}
                  onSubmit={handleGenerate}
                  onReset={handleReset}
                  isLoading={isLoading}
                  error={error}
                  onOpenAddSection={() => setIsAddSectionOpen(true)}
                  referenceImage={referenceImage}
                  referencePreviewUrl={referencePreviewUrl}
                  onRemoveReferenceImage={handleRemoveReferenceImage}
                  onGenerateFromImage={handleGenerateFromImage}
                />
              </div>

              {/* Right Column: Letter Document Preview (7 cols on lg) */}
              <div className="lg:col-span-7">
                <LetterPreview
                  letter={generatedLetter}
                  isLoading={isLoading}
                  isImageReference={isImageLoading}
                  onLetterChange={setGeneratedLetter}
                  onRegenerate={referenceImage ? handleGenerateFromImage : handleGenerate}
                  onNewLetter={handleReset}
                />
              </div>
            </div>
          </section>

          {/* How It Works */}
          <HowItWorks />

          {/* Features Showcase */}
          <Features />

          {/* Example Presets */}
          <ExampleLetters onSelectExample={handleSelectExample} />

          {/* FAQ Section */}
          <FaqSection />
        </main>

        {/* Footer */}
        <Footer />

        {/* Modal: Add Reference Image (Camera / Upload) */}
        <AddSectionModal
          isOpen={isAddSectionOpen}
          onClose={() => setIsAddSectionOpen(false)}
          onImageSelected={handleImageSelected}
        />
      </div>

      {/* Dedicated Print-Only Document Container (Issue 2) */}
      {generatedLetter && (
        <div id="print-root" className="print-only">
          <div className="print-letter-content">
            {generatedLetter}
          </div>
        </div>
      )}
    </>
  );
}


