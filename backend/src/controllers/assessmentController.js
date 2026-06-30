// ===================================
// ASSESSMENT CONTROLLER
// ===================================

import {
  getQuestions,
  startAssessment,
  saveResponse,
  completeAssessment,
  getUserProgress,
  getAssessmentDetails
} from '../services/assessmentService.js';

/**
 * GET /api/assessment/questions/:moduleId
 * Obtener preguntas de un módulo sin iniciar assessment
 */
export const getModuleQuestions = async (req, res) => {
  try {
    const { moduleId } = req.params;

    if (!moduleId) {
      return res.status(400).json({ error: 'moduleId is required' });
    }

    const questions = getQuestions(moduleId);
    res.json(questions);
  } catch (error) {
    console.error('Get questions error:', error);
    if (error.message.includes('not found')) {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to get questions' });
  }
};

/**
 * POST /api/assessment/start
 * Iniciar un nuevo assessment
 */
export const startNewAssessment = async (req, res) => {
  try {
    const { moduleId } = req.body;
    const userId = req.user.id;

    if (!moduleId) {
      return res.status(400).json({ error: 'moduleId is required' });
    }

    const assessment = await startAssessment(userId, moduleId);

    res.status(201).json({
      message: 'Assessment started successfully',
      ...assessment
    });
  } catch (error) {
    console.error('Start assessment error:', error);
    if (error.message.includes('not found')) {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to start assessment' });
  }
};

/**
 * POST /api/assessment/:assessmentId/response
 * Guardar respuesta a una pregunta
 */
export const submitResponse = async (req, res) => {
  try {
    const { assessmentId } = req.params;
    const { questionId, selectedAnswer, confidence, timeSpent } = req.body;

    // Validaciones
    if (!assessmentId) {
      return res.status(400).json({ error: 'assessmentId is required' });
    }
    if (!questionId) {
      return res.status(400).json({ error: 'questionId is required' });
    }
    if (!selectedAnswer) {
      return res.status(400).json({ error: 'selectedAnswer is required' });
    }

    const result = await saveResponse(
      assessmentId,
      questionId,
      selectedAnswer,
      confidence || 0.5
    );

    res.json({
      message: 'Response saved successfully',
      ...result
    });
  } catch (error) {
    console.error('Submit response error:', error);

    if (error.message.includes('not found')) {
      return res.status(404).json({ error: error.message });
    }
    if (error.message.includes('already completed')) {
      return res.status(400).json({ error: error.message });
    }
    if (error.message.includes('Invalid')) {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: 'Failed to submit response' });
  }
};

/**
 * POST /api/assessment/:assessmentId/submit
 * Completar assessment
 */
export const submitAssessment = async (req, res) => {
  try {
    const { assessmentId } = req.params;

    if (!assessmentId) {
      return res.status(400).json({ error: 'assessmentId is required' });
    }

    const result = await completeAssessment(assessmentId);

    res.json({
      message: 'Assessment completed successfully',
      ...result
    });
  } catch (error) {
    console.error('Submit assessment error:', error);

    if (error.message.includes('not found')) {
      return res.status(404).json({ error: error.message });
    }
    if (error.message.includes('already completed')) {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: 'Failed to complete assessment' });
  }
};

/**
 * GET /api/assessment/progress
 * Obtener progreso de todos los assessments del usuario
 */
export const getProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const progress = await getUserProgress(userId);

    res.json({
      userId,
      assessments: progress,
      completedModules: progress.filter(a => a.status === 'completed').length,
      totalAssessments: progress.length
    });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ error: 'Failed to get progress' });
  }
};

/**
 * GET /api/assessment/:assessmentId
 * Obtener detalles de un assessment específico
 */
export const getAssessment = async (req, res) => {
  try {
    const { assessmentId } = req.params;

    if (!assessmentId) {
      return res.status(400).json({ error: 'assessmentId is required' });
    }

    const assessment = await getAssessmentDetails(assessmentId);

    res.json({
      assessment
    });
  } catch (error) {
    console.error('Get assessment error:', error);
    if (error.message.includes('not found')) {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to get assessment' });
  }
};
