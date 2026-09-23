import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Upload,
  X,
  RotateCcw,
  Check,
  AlertCircle,
  Image as ImageIcon,
  Lock,
  ArrowLeft,
  ZoomIn
} from 'lucide-react';
import ImageLightboxModal from './ImageLightboxModal';

export default function AddSectionModal({ isOpen, onClose, onImageSelected }) {
  // Mode: 'select' | 'camera' | 'upload_preview' | 'captured_preview'
  const [mode, setMode] = useState('select');
  const [stream, setStream] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [showLightbox, setShowLightbox] = useState(false);

  const isConfirmedRef = useRef(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // Stop camera tracks cleanly
  const stopCameraStream = (activeStream = stream) => {
    if (activeStream) {
      activeStream.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (e) {
          console.warn('Error stopping camera track:', e);
        }
      });
      setStream(null);
    }
  };

  // Reset modal state
  const resetState = () => {
    stopCameraStream();
    if (previewUrl && previewUrl.startsWith('blob:') && !isConfirmedRef.current) {
      URL.revokeObjectURL(previewUrl);
    }
    isConfirmedRef.current = false;
    setMode('select');
    setCameraError(null);
    setUploadError(null);
    setPreviewUrl(null);
    setSelectedFile(null);
    setShowLightbox(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  // Cleanup on unmount or when modal closes
  useEffect(() => {
    if (!isOpen) {
      resetState();
    }
    return () => {
      stopCameraStream();
      if (previewUrl && previewUrl.startsWith('blob:') && !isConfirmedRef.current) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [isOpen]);

  // Hook camera stream into video element when entering camera mode
  useEffect(() => {
    if (mode === 'camera' && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch((err) => {
        console.warn('Error playing video stream:', err);
      });
    }
  }, [mode, stream]);

  // Option 1: Start Camera
  const handleStartCamera = async () => {
    setCameraError(null);
    setMode('camera');

    try {
      if (!navigator?.mediaDevices?.getUserMedia) {
        throw new Error('Camera API is not supported in this browser environment.');
      }

      // Try back/environment camera first (mobile friendly), fallback to user/default
      let mediaStream;
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false
        });
      } catch {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
      }

      setStream(mediaStream);
    } catch (err) {
      console.error('Camera access failure:', err);
      setCameraError('Camera access is unavailable. Please upload an image instead.');
      setMode('camera');
    }
  };

  // Capture frame from live camera
  const handleCapturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current || document.createElement('canvas');

    const width = video.videoWidth || 640;
    const height = video.videoHeight || 480;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, width, height);

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setCameraError('Failed to capture image. Please try again.');
          return;
        }
        if (previewUrl && previewUrl.startsWith('blob:')) {
          URL.revokeObjectURL(previewUrl);
        }
        const file = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
        const objectUrl = URL.createObjectURL(blob);
        setSelectedFile(file);
        setPreviewUrl(objectUrl);
        stopCameraStream();
        setMode('captured_preview');
      },
      'image/jpeg',
      0.92
    );
  };

  // Retake photo: restart camera
  const handleRetakePhoto = () => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setSelectedFile(null);
    handleStartCamera();
  };

  // Option 2: File Picker trigger
  const handleTriggerFileInput = () => {
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  // Handle file chosen by user
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate MIME types
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Unsupported file format. Please upload a .jpg, .jpeg, .png, or .webp image.');
      setMode('select');
      return;
    }

    // Validate 10MB limit
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File is too large. Maximum allowed size is 10 MB.');
      setMode('select');
      return;
    }

    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }

    const objectUrl = URL.createObjectURL(file);
    setSelectedFile(file);
    setPreviewUrl(objectUrl);
    setUploadError(null);
    setMode('upload_preview');
  };

  // Confirm image selection
  const handleConfirmImage = () => {
    if (!selectedFile || !previewUrl) return;
    isConfirmedRef.current = true;
    onImageSelected(selectedFile, previewUrl);
    // Modal will close, stream will be cleaned up
    stopCameraStream();
    setMode('select');
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-2xl border border-slate-200/90 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] transition-all transform animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            {mode !== 'select' && (
              <button
                type="button"
                onClick={() => {
                  stopCameraStream();
                  setCameraError(null);
                  setUploadError(null);
                  setMode('select');
                }}
                className="p-1 -ml-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors"
                title="Back to options"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <h3 id="modal-title" className="text-base font-bold text-slate-800 tracking-tight">
                {mode === 'camera'
                  ? 'TAKE PHOTO'
                  : mode === 'upload_preview' || mode === 'captured_preview'
                  ? 'REFERENCE IMAGE'
                  : 'ADD REFERENCE'}
              </h3>
              <p className="text-xs text-slate-500">
                {mode === 'select' && 'Use an image to help SCRIPTO understand what kind of letter you need.'}
                {mode === 'camera' && 'Point camera at your document, draft, or notice'}
                {(mode === 'upload_preview' || mode === 'captured_preview') && 'Review your reference photo'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Hidden File Input for Uploads */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Hidden Canvas for Camera Frame Capture */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Upload Error Banner */}
          {uploadError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1">{uploadError}</div>
            </div>
          )}

          {/* MODE 1: Initial Selection Screen */}
          {mode === 'select' && (
            <div className="space-y-3 py-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Take Photo Button */}
                <button
                  type="button"
                  id="take-photo-button"
                  onClick={handleStartCamera}
                  className="flex flex-col items-center justify-center gap-3 p-5 rounded-xl border-2 border-dashed border-brand-200 bg-brand-50/40 hover:bg-brand-50 hover:border-brand-500 hover:shadow-sm text-brand-700 transition-all group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <span className="text-sm font-bold block text-slate-800 group-hover:text-brand-700">
                      📷 Take Photo
                    </span>
                    <span className="text-[11px] text-slate-500 mt-0.5 block">
                      Snap handwritten note or document
                    </span>
                  </div>
                </button>

                {/* Upload Photo Button */}
                <button
                  type="button"
                  id="upload-photo-button"
                  onClick={handleTriggerFileInput}
                  className="flex flex-col items-center justify-center gap-3 p-5 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/70 hover:bg-slate-100/70 hover:border-brand-400 hover:shadow-sm text-slate-700 transition-all group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-600 group-hover:text-brand-600 flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <span className="text-sm font-bold block text-slate-800 group-hover:text-brand-700">
                      ↑ Upload Photo
                    </span>
                    <span className="text-[11px] text-slate-500 mt-0.5 block">
                      JPG, PNG, or WEBP up to 10 MB
                    </span>
                  </div>
                </button>
              </div>

              {/* Privacy Notice */}
              <div className="flex items-center gap-2 pt-2 px-1 text-[11px] text-slate-400">
                <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Your image is used only as a reference to generate your letter.</span>
              </div>
            </div>
          )}

          {/* MODE 2: Camera View */}
          {mode === 'camera' && (
            <div className="space-y-4">
              {cameraError ? (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-center space-y-3">
                  <div className="w-10 h-10 mx-auto rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-semibold text-amber-900 leading-snug">
                    Camera access is unavailable. Please upload an image instead.
                  </p>
                  <div className="pt-1 flex justify-center gap-2">
                    <button
                      type="button"
                      onClick={handleTriggerFileInput}
                      className="px-4 py-2 bg-brand-600 text-white rounded-lg text-xs font-bold hover:bg-brand-700 transition-colors flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Image</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="relative bg-slate-950 rounded-xl overflow-hidden aspect-[4/3] flex items-center justify-center shadow-inner">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/70 to-transparent flex justify-center">
                      <span className="text-[11px] text-white/90 bg-black/40 px-2.5 py-1 rounded-full backdrop-blur-xs">
                        Hold document steady in frame
                      </span>
                    </div>
                  </div>

                  {/* Camera Action: Capture */}
                  <div className="flex justify-center pt-1">
                    <button
                      type="button"
                      id="capture-photo-button"
                      onClick={handleCapturePhoto}
                      className="px-6 py-2.5 rounded-full font-bold text-sm text-white bg-brand-600 hover:bg-brand-700 active:scale-95 shadow-md hover:shadow-brand-500/25 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Capture</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MODE 3: Preview of Captured or Uploaded Image */}
          {(mode === 'captured_preview' || mode === 'upload_preview') && previewUrl && (
            <div className="space-y-4">
              <div
                role="button"
                tabIndex={0}
                onClick={() => setShowLightbox(true)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') setShowLightbox(true);
                }}
                className="relative group bg-slate-100 rounded-xl border border-slate-200 overflow-hidden flex items-center justify-center max-h-[300px] cursor-zoom-in hover:border-brand-400 transition-all"
                title="Click to inspect full image"
              >
                <img
                  src={previewUrl}
                  alt="Reference preview (Click to inspect)"
                  className="max-w-full max-h-[300px] object-contain transition-transform duration-200 group-hover:scale-[1.01]"
                />
                <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/15 flex items-center justify-center transition-colors duration-200 pointer-events-none">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-slate-900/75 text-white text-[11px] font-medium px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm backdrop-blur-xs">
                    <ZoomIn className="w-3 h-3" />
                    <span>Click to inspect</span>
                  </span>
                </div>
              </div>

              {/* Actions below preview */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                {mode === 'captured_preview' ? (
                  <button
                    type="button"
                    onClick={handleRetakePhoto}
                    className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Retake</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleTriggerFileInput}
                    className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Change Image</span>
                  </button>
                )}

                <button
                  type="button"
                  id="use-image-button"
                  onClick={handleConfirmImage}
                  className="px-5 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-sm hover:shadow-brand-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{mode === 'captured_preview' ? 'Use Photo' : 'Use This Image'}</span>
                </button>
              </div>

              {/* Privacy Reassurance */}
              <div className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1.5">
                <Lock className="w-3 h-3 text-slate-400" />
                <span>Your image is used only as a reference to generate your letter.</span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer (Cancel button when on select screen) */}
        {mode === 'select' && (
          <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex justify-end">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Fullscreen Lightbox for Inspection */}
      <ImageLightboxModal
        isOpen={showLightbox}
        imageUrl={previewUrl}
        alt="Reference Image Preview"
        onClose={() => setShowLightbox(false)}
      />
    </div>
  );
}
