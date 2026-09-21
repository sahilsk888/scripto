import { generateLetterWithAI, generateLetterFromImageWithAI } from '../services/aiService.js';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

/**
 * Controller to handle letter generation request
 * POST /api/letters/generate
 */
export async function generateLetterController(req, res) {
  try {
    const {
      topic,
      letterType,
      tone,
      language,
      length,
      recipientName,
      senderName,
      organization,
      date,
      additionalInstructions
    } = req.body || {};

    // Validate topic
    if (!topic || typeof topic !== 'string' || !topic.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Please enter what the letter is about.'
      });
    }

    // Security & length limits
    if (topic.trim().length > 3000) {
      return res.status(400).json({
        success: false,
        error: 'Topic is too long. Please limit your description to 3000 characters.'
      });
    }

    if (additionalInstructions && additionalInstructions.length > 2000) {
      return res.status(400).json({
        success: false,
        error: 'Additional instructions cannot exceed 2000 characters.'
      });
    }

    // Call Gemini AI Service
    const letter = await generateLetterWithAI({
      topic: topic.trim(),
      letterType: letterType?.trim() || 'Formal Letter',
      tone: tone?.trim() || 'Formal',
      language: language?.trim() || 'English',
      length: length?.trim() || 'Medium',
      recipientName: recipientName?.trim() || '',
      senderName: senderName?.trim() || '',
      organization: organization?.trim() || '',
      date: date?.trim() || '',
      additionalInstructions: additionalInstructions?.trim() || ''
    });

    return res.status(200).json({
      success: true,
      letter
    });
  } catch (error) {
    console.error('Letter generation error:', error?.message || error);
    const statusCode = error?.status || 500;
    const errorCode = error?.code || 'AI_GENERATION_ERROR';

    return res.status(statusCode).json({
      success: false,
      errorCode,
      error: error?.message || 'Unable to generate the letter right now. Please try again.'
    });
  }
}

/**
 * Controller to handle reference image analysis and letter generation
 * POST /api/letters/analyze-image
 */
export async function analyzeImageController(req, res) {
  try {
    const file = req.file;

    if (!file || !file.buffer) {
      return res.status(400).json({
        success: false,
        error: 'Please upload or capture a reference image (JPEG, PNG, or WebP).'
      });
    }

    // MIME type validation
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return res.status(400).json({
        success: false,
        error: 'Unsupported file format. Please upload a JPEG, PNG, or WebP image.'
      });
    }

    // File size validation
    if (file.size > MAX_FILE_SIZE) {
      return res.status(400).json({
        success: false,
        error: 'Image file exceeds the 10 MB limit. Please choose a smaller image.'
      });
    }

    // Optional user parameters passed with multipart body
    const {
      letterType,
      tone,
      language,
      length,
      recipientName,
      senderName,
      organization,
      date,
      additionalInstructions
    } = req.body || {};

    const result = await generateLetterFromImageWithAI({
      imageBuffer: file.buffer,
      mimeType: file.mimetype,
      letterType: letterType?.trim(),
      tone: tone?.trim(),
      language: language?.trim() || 'English',
      length: length?.trim() || 'Medium',
      recipientName: recipientName?.trim(),
      senderName: senderName?.trim(),
      organization: organization?.trim(),
      date: date?.trim(),
      additionalInstructions: additionalInstructions?.trim()
    });

    return res.status(200).json({
      success: true,
      letter: result.letter,
      extractedContext: result.extractedContext
    });
  } catch (error) {
    console.error('Image analysis error:', error?.message || error);
    const statusCode = error?.status && error.status >= 400 && error.status < 600 ? error.status : 500;
    const errorCode = error?.code || 'IMAGE_ANALYSIS_ERROR';

    return res.status(statusCode).json({
      success: false,
      errorCode,
      error: error?.message || "We couldn't analyze this image. Please try another image."
    });
  }
}
