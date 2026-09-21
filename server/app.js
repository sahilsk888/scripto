import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import letterRoutes, { handleUpload } from './routes/letterRoutes.js';
import { analyzeImageController } from './controllers/letterController.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Routes
app.use('/api/letters', letterRoutes);
app.post('/api/analyze-image', handleUpload, analyzeImageController);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'SCRIPTO API is running',
    aiProvider: 'gemini'
  });
});

// API 404 handler for unmatched /api routes
app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    error: `API route not found: ${req.method} ${req.originalUrl}`
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error occurred.'
  });
});

export default app;
