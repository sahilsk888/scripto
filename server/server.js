import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly load .env from the server directory, and fallback to root
dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import letterRoutes, { handleUpload } from './routes/letterRoutes.js';
import { analyzeImageController } from './controllers/letterController.js';

const app = express();
const PORT = process.env.PORT || 5000;
const clientDistPath = path.resolve(__dirname, '../client/dist');

// Middleware
app.use(cors({
  origin: '*', // Allows local and cross-origin clients
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// API Routes
app.use('/api/letters', letterRoutes);
app.post('/api/analyze-image', handleUpload, analyzeImageController);

// Root health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'SCRIPTO API is running',
    aiProvider: 'gemini'
  });
});

// Serve frontend static assets from client/dist
app.use(express.static(clientDistPath));

// API 404 handler for unmatched /api routes
app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    error: `API route not found: ${req.method} ${req.originalUrl}`
  });
});

// SPA catch-all handler: Serve index.html for all non-API GET requests
app.get('*', (req, res) => {
  const indexPath = path.join(clientDistPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Frontend build not found. Please run "npm run build:client" first.');
  }
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error occurred.'
  });
});

// Start unified server
app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(` SCRIPTO running unified on: http://localhost:${PORT}`);
  console.log(` Web Application: http://localhost:${PORT}/`);
  console.log(` API Endpoint:    http://localhost:${PORT}/api/letters/generate`);
  console.log(` Health Check:    http://localhost:${PORT}/api/health`);
  console.log(`=========================================`);
});
