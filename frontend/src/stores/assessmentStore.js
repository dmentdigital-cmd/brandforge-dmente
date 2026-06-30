// ===================================
// ASSESSMENT STORE (Zustand)
// ===================================

import { create } from 'zustand';
import * as assessmentAPI from '../services/assessmentAPI';

export const useAssessmentStore = create((set, get) => ({
  // State
  currentAssessment: null,
  questions: [],
  currentQuestionIndex: 0,
  answers: {}, // { questionId: selectedAnswer }
  isLoading: false,
  isSubmitting: false,
  error: null,
  results: null,

  // Actions

  /**
   * Obtener preguntas de un módulo
   */
  fetchQuestions: async (moduleId) => {
    set({ isLoading: true, error: null });
    try {
      const data = await assessmentAPI.getQuestions(moduleId);
      set({ questions: data.questions });
      return data;
    } catch (error) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  /**
   * Iniciar nuevo assessment
   */
  startAssessment: async (moduleId) => {
    set({ isLoading: true, error: null });
    try {
      const data = await assessmentAPI.startAssessment(moduleId);
      set({
        currentAssessment: {
          id: data.assessmentId,
          moduleId: data.moduleId,
          totalQuestions: data.questionCount,
          startedAt: new Date()
        },
        questions: data.questions,
        currentQuestionIndex: 0,
        answers: {},
        results: null
      });
      return data.assessmentId;
    } catch (error) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  /**
   * Guardar respuesta a pregunta actual
   */
  submitAnswer: async (questionId, selectedAnswer, confidence = 0.5) => {
    const { currentAssessment, answers } = get();

    if (!currentAssessment) {
      set({ error: 'No active assessment' });
      return false;
    }

    set({ isSubmitting: true, error: null });
    try {
      const response = await assessmentAPI.submitResponse(
        currentAssessment.id,
        questionId,
        selectedAnswer,
        confidence
      );

      // Actualizar respuestas locales
      set({
        answers: {
          ...answers,
          [questionId]: selectedAnswer
        }
      });

      // Mover a siguiente pregunta
      const state = get();
      if (state.currentQuestionIndex < state.questions.length - 1) {
        set({ currentQuestionIndex: state.currentQuestionIndex + 1 });
      }

      return response;
    } catch (error) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ isSubmitting: false });
    }
  },

  /**
   * Ir a pregunta anterior
   */
  previousQuestion: () => {
    const { currentQuestionIndex } = get();
    if (currentQuestionIndex > 0) {
      set({ currentQuestionIndex: currentQuestionIndex - 1 });
    }
  },

  /**
   * Ir a pregunta siguiente (sin validar respuesta)
   */
  nextQuestion: () => {
    const { currentQuestionIndex, questions } = get();
    if (currentQuestionIndex < questions.length - 1) {
      set({ currentQuestionIndex: currentQuestionIndex + 1 });
    }
  },

  /**
   * Completar assessment
   */
  completeAssessment: async () => {
    const { currentAssessment } = get();

    if (!currentAssessment) {
      set({ error: 'No active assessment' });
      return false;
    }

    set({ isSubmitting: true, error: null });
    try {
      const response = await assessmentAPI.completeAssessment(
        currentAssessment.id
      );

      set({
        results: response,
        currentAssessment: null
      });

      return response;
    } catch (error) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ isSubmitting: false });
    }
  },

  /**
   * Obtener progreso del usuario
   */
  fetchProgress: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await assessmentAPI.getProgress();
      return data;
    } catch (error) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  /**
   * Resetear assessment
   */
  resetAssessment: () => {
    set({
      currentAssessment: null,
      questions: [],
      currentQuestionIndex: 0,
      answers: {},
      results: null,
      error: null
    });
  },

  /**
   * Obtener pregunta actual
   */
  getCurrentQuestion: () => {
    const { questions, currentQuestionIndex } = get();
    return questions[currentQuestionIndex] || null;
  },

  /**
   * Obtener respuesta a pregunta actual
   */
  getCurrentAnswer: () => {
    const { answers } = get();
    const currentQuestion = get().getCurrentQuestion();
    if (!currentQuestion) return null;
    return answers[currentQuestion.id];
  },

  /**
   * Obtener progreso (%)
   */
  getProgress: () => {
    const { currentQuestionIndex, questions } = get();
    if (questions.length === 0) return 0;
    return Math.round(((currentQuestionIndex + 1) / questions.length) * 100);
  },

  /**
   * Verificar si assessment está completo
   */
  isComplete: () => {
    const { answers, questions } = get();
    return questions.every(q => q.id in answers);
  }
}));
