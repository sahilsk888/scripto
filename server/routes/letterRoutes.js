import express from 'express';
import multer from 'multer';
import { generateLetterController, analyzeImageController } from '../controllers/letterController.js';

const router = express.Router();

// Configure Multer for in-memory temporary processing (no permanent disk storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10 MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      const err = new Error('Unsupported file format. Please upload a JPEG, PNG, or WebP image.');
      err.code = 'INVALID_FILE_TYPE';
      cb(err, false);
    }
  }
});

// Multer error handling wrapper middleware
const handleUpload = (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          errorCode: 'FILE_TOO_LARGE',
          error: 'Image file exceeds the 10 MB limit. Please select a smaller image.'
        });
      }
      return res.status(400).json({
        success: false,
        errorCode: err.code || 'UPLOAD_ERROR',
        error: err.message || 'Error processing uploaded image.'
      });
    }
    next();
  });
};

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'SCRIPTO API is running',
    aiProvider: 'gemini'
  });
});

// Letter generation endpoint: POST /api/letters/generate
router.post('/generate', generateLetterController);

// Image reference analysis & generation endpoint: POST /api/letters/analyze-image
router.post('/analyze-image', handleUpload, analyzeImageController);

export { handleUpload };
export default router;

