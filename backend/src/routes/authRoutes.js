// ===================================
// AUTH ROUTES
// ===================================

import express from 'express';
import {
  register,
  login,
  getCurrentUser,
  logout,
  refreshToken
} from '../controllers/authController.js';
import { verifyToken } from '../utils/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', verifyToken, getCurrentUser);
router.post('/logout', verifyToken, logout);
router.post('/refresh', verifyToken, refreshToken);

export default router;
