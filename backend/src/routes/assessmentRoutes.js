// ===================================
// ASSESSMENT ROUTES
// ===================================

import express from 'express';
import {
  getModuleQuestions,
  startNewAssessment,
  submitResponse,
  submitAssessment,
  getProgress,
  getAssessment
} from '../controllers/assessmentController.js';
import { verifyToken } from '../utils/authMiddleware.js';

const router = express.Router();

// Public route - get questions without auth (if needed)
router.get('/questions/:moduleId', getModuleQuestions);

// Protected routes - require authentication
router.post('/start', verifyToken, startNewAssessment);
router.post('/:assessmentId/response', verifyToken, submitResponse);
router.post('/:assessmentId/submit', verifyToken, submitAssessment);
router.get('/progress', verifyToken, getProgress);
router.get('/:assessmentId', verifyToken, getAssessment);

export default router;
