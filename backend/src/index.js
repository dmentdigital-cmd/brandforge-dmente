// ===================================
// BRANDFORGE BACKEND - MAIN SERVER
// ===================================

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

// Load environment variables
dotenv.config();

// Import routes (to be created)
// import authRoutes from './routes/authRoutes.js';
// import assessmentRoutes from './routes/assessmentRoutes.js';

// Initialize Express app
const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  req.id = uuidv4();
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - Request ID: ${req.id}`);
  next();
});

// ===================================
// ROUTES (PLACEHOLDER)
// ===================================

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    message: 'BrandForge API is running',
    environment: process.env.NODE_ENV || 'development',
    requestId: req.id
  });
});

// Placeholder routes (to be implemented)
// app.use('/api/auth', authRoutes);
// app.use('/api/assessment', assessmentRoutes);

// ===================================
// ERROR HANDLING
// ===================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path,
    method: req.method
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    requestId: req.id
  });
});

// ===================================
// SERVER START
// ===================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
    ╔════════════════════════════════╗
    ║   BRANDFORGE API STARTED        ║
    ║   http://localhost:${PORT}       ║
    ║   Environment: ${process.env.NODE_ENV}     ║
    ╚════════════════════════════════╝
  `);
});

export default app;
