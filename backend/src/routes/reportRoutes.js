// ===================================
// REPORT ROUTES
// ===================================

import express from 'express';
import {
  downloadAssessmentPDF,
  getReportData
} from '../controllers/reportController.js';
import { verifyToken } from '../utils/authMiddleware.js';

const router = express.Router();

// Protected routes - require authentication
router.get('/:assessmentId/pdf', verifyToken, downloadAssessmentPDF);
router.get('/:assessmentId', verifyToken, getReportData);

export default router;
