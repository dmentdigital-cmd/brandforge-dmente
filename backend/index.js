// ===================================
// BACKEND SERVER ENTRY POINT
// ===================================

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import sequelize, { testConnection, syncDatabase } from './config/database.js';

// Import routes
import authRoutes from './src/routes/authRoutes.js';
import assessmentRoutes from './src/routes/assessmentRoutes.js';
import reportRoutes from './src/routes/reportRoutes.js';

// Import models (to ensure they're registered with Sequelize)
import User from './src/models/User.js';
import Assessment from './src/models/Assessment.js';
import AssessmentResponse from './src/models/AssessmentResponse.js';

// Define associations
Assessment.belongsTo(User, { foreignKey: 'userId' });
Assessment.hasMany(AssessmentResponse, { foreignKey: 'assessmentId' });
AssessmentResponse.belongsTo(Assessment, { foreignKey: 'assessmentId' });

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/assessment', assessmentRoutes);
app.use('/api/report', reportRoutes);

// Serve React app for all non-API routes (SPA fallback)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Initialize database and start server
const startServer = async () => {
  try {
    // Test database connection
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.error('Failed to connect to database. Exiting...');
      process.exit(1);
    }

    // Sync database
    await syncDatabase();

    // Start Express server
    app.listen(PORT, () => {
      console.log(`✓ Server running on http://localhost:${PORT}`);
      console.log(`✓ API endpoints at http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  await sequelize.close();
  process.exit(0);
});

export default app;
