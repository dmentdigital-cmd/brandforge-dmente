// ===================================
// ASSESSMENT SERVICE
// ===================================

import Assessment from '../models/Assessment.js';
import AssessmentResponse from '../models/AssessmentResponse.js';
import questionnaire from '../../data/questionnaire.json' assert { type: 'json' };

/**
 * Obtener preguntas de un módulo
 */
export const getQuestions = (moduleId) => {
  const module = questionnaire[moduleId];

  if (!module) {
    throw new Error(`Module ${moduleId} not found`);
  }

  return {
    moduleId,
    title: module.title,
    description: module.description,
    icon: module.icon,
    estimatedTime: module.estimatedTime,
    questionCount: module.questions.length,
    questions: module.questions.map(q => ({
      id: q.id,
      number: q.number,
      type: q.type,
      question: q.question,
      description: q.description,
      options: q.options
      // No incluir respuesta correcta en el cliente
    }))
  };
};

/**
 * Iniciar un nuevo assessment
 */
export const startAssessment = async (userId, moduleId) => {
  const module = questionnaire[moduleId];

  if (!module) {
    throw new Error(`Module ${moduleId} not found`);
  }

  // Crear assessment
  const assessment = await Assessment.create({
    userId,
    moduleId,
    totalQuestions: module.questions.length,
    status: 'in_progress'
  });

  // Retornar assessment con preguntas
  return {
    assessmentId: assessment.id,
    ...getQuestions(moduleId)
  };
};

/**
 * Guardar respuesta a una pregunta
 */
export const saveResponse = async (assessmentId, questionId, selectedAnswer, confidence = 0.5) => {
  // Verificar que assessment existe
  const assessment = await Assessment.findByPk(assessmentId);
  if (!assessment) {
    throw new Error('Assessment not found');
  }

  if (assessment.status !== 'in_progress') {
    throw new Error('Assessment already completed');
  }

  // Obtener pregunta del cuestionario
  const module = questionnaire[assessment.moduleId];
  const question = module.questions.find(q => q.id === questionId);

  if (!question) {
    throw new Error(`Question ${questionId} not found`);
  }

  // Validar que la respuesta es una opción válida
  const validOption = question.options.find(opt => opt.id === selectedAnswer);
  if (!validOption) {
    throw new Error(`Invalid answer option: ${selectedAnswer}`);
  }

  // Verificar si ya existe respuesta a esta pregunta
  let response = await AssessmentResponse.findOne({
    where: { assessmentId, questionId }
  });

  const isCorrect = selectedAnswer === question.correctAnswer;

  if (response) {
    // Actualizar respuesta existente
    response.selectedAnswer = selectedAnswer;
    response.isCorrect = isCorrect;
    response.confidence = confidence;
    await response.save();
  } else {
    // Crear nueva respuesta
    response = await AssessmentResponse.create({
      assessmentId,
      questionId,
      selectedAnswer,
      isCorrect,
      confidence
    });
  }

  // Actualizar contador de respuestas respondidas
  const answeredCount = await AssessmentResponse.count({
    where: { assessmentId }
  });

  assessment.answeredQuestions = answeredCount;
  await assessment.save();

  return {
    success: true,
    questionIndex: question.number,
    totalQuestions: assessment.totalQuestions,
    progress: Math.round((answeredCount / assessment.totalQuestions) * 100)
  };
};

/**
 * Completar assessment y calcular score
 */
export const completeAssessment = async (assessmentId) => {
  // Obtener assessment
  const assessment = await Assessment.findByPk(assessmentId, {
    include: [{
      model: AssessmentResponse,
      attributes: ['questionId', 'isCorrect', 'confidence']
    }]
  });

  if (!assessment) {
    throw new Error('Assessment not found');
  }

  if (assessment.status === 'completed') {
    throw new Error('Assessment already completed');
  }

  // Calcular score
  const responses = assessment.AssessmentResponses || [];
  const correctCount = responses.filter(r => r.isCorrect).length;
  const totalQuestions = assessment.totalQuestions;

  const score = totalQuestions > 0
    ? Math.round((correctCount / totalQuestions) * 100)
    : 0;

  // Generar análisis
  const analysis = generateAnalysis(score, assessment.moduleId, responses);

  // Actualizar assessment
  assessment.status = 'completed';
  assessment.score = score;
  assessment.completedAt = new Date();
  assessment.analysis = analysis;
  await assessment.save();

  return {
    assessmentId: assessment.id,
    moduleId: assessment.moduleId,
    score,
    scoreLevel: getScoreLevel(score),
    correctAnswers: correctCount,
    totalQuestions,
    analysis,
    completedAt: assessment.completedAt
  };
};

/**
 * Obtener progreso de assessments del usuario
 */
export const getUserProgress = async (userId) => {
  const assessments = await Assessment.findAll({
    where: { userId },
    order: [['createdAt', 'DESC']],
    attributes: ['id', 'moduleId', 'status', 'score', 'completedAt', 'startedAt']
  });

  return assessments.map(a => ({
    assessmentId: a.id,
    moduleId: a.moduleId,
    status: a.status,
    score: a.score,
    startedAt: a.startedAt,
    completedAt: a.completedAt
  }));
};

/**
 * Generar análisis de respuestas
 */
const generateAnalysis = (score, moduleId, responses) => {
  const module = questionnaire[moduleId];
  const scoreLevel = getScoreLevel(score);

  // Categorizar respuestas por categoría de pregunta
  const byCategory = {};

  responses.forEach(response => {
    const question = module.questions.find(q => q.id === response.questionId);
    if (question) {
      if (!byCategory[question.category]) {
        byCategory[question.category] = { correct: 0, total: 0 };
      }
      byCategory[question.category].total++;
      if (response.isCorrect) {
        byCategory[question.category].correct++;
      }
    }
  });

  // Calcular porcentajes por categoría
  const categoryScores = {};
  Object.keys(byCategory).forEach(cat => {
    categoryScores[cat] = Math.round(
      (byCategory[cat].correct / byCategory[cat].total) * 100
    );
  });

  return {
    overallScore: score,
    scoreLevel,
    timestamp: new Date(),
    categoryScores,
    insights: generateInsights(score, scoreLevel, categoryScores),
    nextSteps: generateNextSteps(score, scoreLevel, moduleId)
  };
};

/**
 * Generar insights basados en score
 */
const generateInsights = (score, scoreLevel, categoryScores) => {
  const insights = [];

  if (scoreLevel === 'excellent') {
    insights.push('Tu marca personal está bien definida y diferenciada.');
    insights.push('Tienes claridad en tu posicionamiento y valores.');
  } else if (scoreLevel === 'high') {
    insights.push('Vas en la dirección correcta pero hay áreas de mejora.');
    insights.push('Refuerza tu narrativa y presencia online.');
  } else if (scoreLevel === 'medium') {
    insights.push('Tienes los fundamentos pero necesitas más claridad.');
    insights.push('Enfócate en definir tu propuesta de valor única.');
  } else if (scoreLevel === 'low') {
    insights.push('Tu marca personal necesita un rediseño estratégico.');
    insights.push('Comienza por definir quién eres y qué te hace único.');
  } else {
    insights.push('Necesitas autoconocimiento y claridad de propósito.');
    insights.push('Te recomendamos trabajar primero en definir tu identidad.');
  }

  return insights;
};

/**
 * Generar próximos pasos
 */
const generateNextSteps = (score, scoreLevel, moduleId) => {
  const nextSteps = [];

  if (moduleId === 'fundamentals') {
    if (scoreLevel === 'excellent' || scoreLevel === 'high') {
      nextSteps.push({
        priority: 1,
        title: 'Módulo 2: Estrategia',
        description: 'Define tu nicho y propuesta de valor con precisión',
        action: 'Continuar con estrategia'
      });
    } else {
      nextSteps.push({
        priority: 1,
        title: 'Clarifícate primero',
        description: 'Tómate tiempo para definir tu identidad profesional',
        action: 'Reflexionar y repetir assessment'
      });
    }
  }

  return nextSteps;
};

/**
 * Obtener nivel de score
 */
const getScoreLevel = (score) => {
  if (score >= 91) return 'excellent';
  if (score >= 76) return 'high';
  if (score >= 61) return 'medium';
  if (score >= 31) return 'low';
  return 'very_low';
};

/**
 * Obtener detalles de assessment
 */
export const getAssessmentDetails = async (assessmentId) => {
  const assessment = await Assessment.findByPk(assessmentId, {
    include: [{
      model: AssessmentResponse,
      attributes: ['id', 'questionId', 'selectedAnswer', 'isCorrect']
    }]
  });

  if (!assessment) {
    throw new Error('Assessment not found');
  }

  return {
    id: assessment.id,
    moduleId: assessment.moduleId,
    status: assessment.status,
    score: assessment.score,
    analysis: assessment.analysis,
    startedAt: assessment.startedAt,
    completedAt: assessment.completedAt,
    responses: assessment.AssessmentResponses
  };
};
