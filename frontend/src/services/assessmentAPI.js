// ===================================
// ASSESSMENT API SERVICE
// ===================================

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const TIMEOUT = import.meta.env.VITE_API_TIMEOUT || 30000;

// Crear instancia de axios
const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para errores
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Token expirado, limpiar
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    throw error.response?.data || error;
  }
);

/**
 * Obtener preguntas de un módulo
 */
export const getQuestions = async (moduleId) => {
  try {
    const { data } = await api.get(`/assessment/questions/${moduleId}`);
    return data;
  } catch (error) {
    throw new Error(error.error || 'Failed to fetch questions');
  }
};

/**
 * Iniciar un nuevo assessment
 */
export const startAssessment = async (moduleId) => {
  try {
    const { data } = await api.post('/assessment/start', { moduleId });
    return data;
  } catch (error) {
    throw new Error(error.error || 'Failed to start assessment');
  }
};

/**
 * Guardar respuesta a una pregunta
 */
export const submitResponse = async (assessmentId, questionId, selectedAnswer, confidence = 0.5) => {
  try {
    const { data } = await api.post(`/assessment/${assessmentId}/response`, {
      questionId,
      selectedAnswer,
      confidence
    });
    return data;
  } catch (error) {
    throw new Error(error.error || 'Failed to submit response');
  }
};

/**
 * Completar assessment
 */
export const completeAssessment = async (assessmentId) => {
  try {
    const { data } = await api.post(`/assessment/${assessmentId}/submit`, {});
    return data;
  } catch (error) {
    throw new Error(error.error || 'Failed to complete assessment');
  }
};

/**
 * Obtener progreso del usuario
 */
export const getProgress = async () => {
  try {
    const { data } = await api.get('/assessment/progress');
    return data;
  } catch (error) {
    throw new Error(error.error || 'Failed to fetch progress');
  }
};

/**
 * Obtener detalles de un assessment
 */
export const getAssessmentDetails = async (assessmentId) => {
  try {
    const { data } = await api.get(`/assessment/${assessmentId}`);
    return data;
  } catch (error) {
    throw new Error(error.error || 'Failed to fetch assessment details');
  }
};

/**
 * Descargar PDF del assessment
 */
export const downloadAssessmentPDF = async (assessmentId) => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch(
      `${API_URL}/api/report/${assessmentId}/pdf`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to download PDF');
    }

    // Crear blob y descargar
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BrandForge_Report_${new Date().toISOString().split('T')[0]}.pdf`;
    document.body.appendChild(link);
    link.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);

    return true;
  } catch (error) {
    throw new Error(error.message || 'Failed to download PDF');
  }
};

/**
 * Obtener datos del reporte
 */
export const getReportData = async (assessmentId) => {
  try {
    const { data } = await api.get(`/report/${assessmentId}`);
    return data;
  } catch (error) {
    throw new Error(error.error || 'Failed to fetch report data');
  }
};
