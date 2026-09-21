import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import app from './app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly load .env from the server directory, and fallback to root
dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const PORT = process.env.PORT || 5000;
const clientDistPath = path.resolve(__dirname, '../client/dist');

// Serve frontend static assets from client/dist (for standalone local production)
app.use(express.static(clientDistPath));

// SPA catch-all handler: Serve index.html for all non-API GET requests
app.get('*', (req, res) => {
  const indexPath = path.join(clientDistPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Frontend build not found. Please run "npm run build:client" first.');
  }
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
