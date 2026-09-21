import React, { useEffect } from 'react';
import { X, ZoomIn } from 'lucide-react';

/**
 * Clean fullscreen / lightbox preview modal for inspecting reference images.
 * Preserves aspect ratio, never crops or distorts, and closes on ×, backdrop click, or Escape key.
 */
export default function ImageLightboxModal({ isOpen, imageUrl, alt = 'Reference Image', onClose }) {
  // Handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background body scroll while lightbox is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen || !imageUrl) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-xs transition-opacity duration-200 animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Enlarged image preview"
    >
      {/* Floating Close Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white/90 hover:text-white transition-all shadow-lg border border-white/10 cursor-pointer group focus:outline-none focus:ring-2 focus:ring-brand-400"
        title="Close preview (Esc)"
        aria-label="Close preview"
      >
        <X className="w-5 h-5 group-hover:scale-110 transition-transform" />
      </button>

      {/* Image Container */}
      <div
        className="relative max-w-full max-h-full flex items-center justify-center animate-scaleUp select-none"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={imageUrl}
          alt={alt}
          className="max-w-[94vw] max-h-[88vh] sm:max-h-[90vh] object-contain rounded-lg shadow-2xl transition-transform"
        />

        {/* Subtle bottom info badge */}
        <div className="absolute -bottom-8 sm:-bottom-9 left-1/2 -translate-x-1/2 text-center pointer-events-none">
          <span className="text-[11px] font-medium text-slate-300/80 bg-slate-900/60 px-3 py-1 rounded-full backdrop-blur-xs">
            Press Esc or click outside to close
          </span>
        </div>
      </div>
    </div>
  );
}
