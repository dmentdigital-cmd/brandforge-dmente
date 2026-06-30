// ===================================
// REPORT SERVICE (PDF Generation)
// ===================================

import PDFDocument from 'pdfkit';
import Assessment from '../models/Assessment.js';
import User from '../models/User.js';
import questionnaire from '../../data/questionnaire.json' assert { type: 'json' };

/**
 * Generar reporte PDF de assessment
 */
export const generateAssessmentPDF = async (assessmentId, userId) => {
  try {
    // Obtener assessment completo
    const assessment = await Assessment.findByPk(assessmentId, {
      include: [
        {
          model: User,
          attributes: ['firstName', 'lastName', 'email', 'profession']
        }
      ]
    });

    if (!assessment) {
      throw new Error('Assessment not found');
    }

    if (assessment.userId !== userId) {
      throw new Error('Unauthorized');
    }

    if (assessment.status !== 'completed') {
      throw new Error('Assessment not completed');
    }

    // Crear PDF
    const doc = new PDFDocument({
      size: 'A4',
      margin: 40
    });

    // Información del módulo
    const module = questionnaire[assessment.moduleId];
    const user = assessment.User;

    // ==================== HEADER ====================
    doc.fontSize(24).font('Helvetica-Bold').text('BrandForge', { align: 'center' });
    doc.fontSize(12).font('Helvetica').text('Reporte de Evaluación de Marca Personal', { align: 'center' });
    doc.fontSize(10).fillColor('#666').text('www.dmentedigital.co', { align: 'center', link: 'https://www.dmentedigital.co' });
    doc.moveDown(0.5);

    // ==================== DIVIDER ====================
    doc.strokeColor('#e5e7eb').lineWidth(1).moveTo(40, doc.y).lineTo(555, doc.y).stroke();
    doc.moveDown(0.5);

    // ==================== USER INFO ====================
    doc.fontSize(14).font('Helvetica-Bold').fillColor('#000').text('Información del Usuario');
    doc.fontSize(10).font('Helvetica').fillColor('#666');
    doc.text(`Nombre: ${user.firstName} ${user.lastName}`);
    doc.text(`Email: ${user.email}`);
    doc.text(`Profesión: ${user.profession || 'No especificada'}`);
    doc.text(`Fecha de Evaluación: ${new Date(assessment.completedAt).toLocaleDateString('es-ES')}`);
    doc.moveDown();

    // ==================== MÓDULO INFO ====================
    doc.fontSize(14).font('Helvetica-Bold').fillColor('#000').text('Módulo Evaluado');
    doc.fontSize(10).font('Helvetica').fillColor('#666');
    doc.text(`${module.title}`);
    doc.text(`${module.description}`);
    doc.moveDown();

    // ==================== DIVIDER ====================
    doc.strokeColor('#e5e7eb').lineWidth(1).moveTo(40, doc.y).lineTo(555, doc.y).stroke();
    doc.moveDown(0.5);

    // ==================== SCORE ====================
    const scoreColor = getScoreColor(assessment.analysis?.scoreLevel);
    const scoreLabel = getScoreLabel(assessment.analysis?.scoreLevel);

    doc.fontSize(14).font('Helvetica-Bold').fillColor('#000').text('Tu Puntuación');
    doc.moveDown(0.3);

    // Score grande
    doc.fontSize(48).font('Helvetica-Bold').fillColor(scoreColor);
    doc.text(`${assessment.score}`, { align: 'center' });
    doc.fontSize(14).font('Helvetica').fillColor(scoreColor);
    doc.text(`de 100 - Nivel: ${scoreLabel}`, { align: 'center' });
    doc.moveDown();

    // ==================== PROGRESS ====================
    doc.fontSize(12).font('Helvetica-Bold').fillColor('#000').text('Progreso de Respuestas');
    doc.fontSize(10).font('Helvetica').fillColor('#666');
    doc.text(`${assessment.answeredQuestions} de ${assessment.totalQuestions} preguntas respondidas`);

    // Barra visual de progreso (con caracteres)
    const percentage = Math.round((assessment.answeredQuestions / assessment.totalQuestions) * 100);
    const barLength = 50;
    const filledLength = Math.round((percentage / 100) * barLength);
    const bar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength);
    doc.fontSize(9).text(bar);
    doc.fontSize(10).text(`${percentage}% completado`, { align: 'center' });
    doc.moveDown();

    // ==================== CATEGORY SCORES ====================
    if (assessment.analysis?.categoryScores) {
      doc.fontSize(14).font('Helvetica-Bold').fillColor('#000').text('Resultados por Categoría');

      Object.entries(assessment.analysis.categoryScores).forEach(([category, score]) => {
        const categoryLabel = category.charAt(0).toUpperCase() + category.slice(1);
        doc.fontSize(10).font('Helvetica').fillColor('#333').text(`${categoryLabel}:`, { continued: true });
        doc.fillColor('#666').text(` ${score}%`);
      });
      doc.moveDown();
    }

    // ==================== DIVIDER ====================
    doc.strokeColor('#e5e7eb').lineWidth(1).moveTo(40, doc.y).lineTo(555, doc.y).stroke();
    doc.moveDown(0.5);

    // ==================== INSIGHTS ====================
    if (assessment.analysis?.insights && assessment.analysis.insights.length > 0) {
      doc.fontSize(14).font('Helvetica-Bold').fillColor('#000').text('Análisis e Insights');
      doc.moveDown(0.3);

      assessment.analysis.insights.forEach((insight, idx) => {
        doc.fontSize(10).font('Helvetica').fillColor('#666');
        doc.text(`${idx + 1}. ${insight}`);
      });
      doc.moveDown();
    }

    // ==================== NEXT STEPS ====================
    if (assessment.analysis?.nextSteps && assessment.analysis.nextSteps.length > 0) {
      doc.fontSize(14).font('Helvetica-Bold').fillColor('#000').text('Próximos Pasos Recomendados');
      doc.moveDown(0.3);

      assessment.analysis.nextSteps.forEach((step) => {
        doc.fontSize(10).font('Helvetica-Bold').fillColor('#1e40af').text(`• ${step.title}`);
        doc.fontSize(9).font('Helvetica').fillColor('#666').text(step.description);
        doc.moveDown(0.2);
      });
      doc.moveDown();
    }

    // ==================== FOOTER ====================
    doc.strokeColor('#e5e7eb').lineWidth(1).moveTo(40, doc.y).lineTo(555, doc.y).stroke();
    doc.moveDown(0.5);

    doc.fontSize(8).fillColor('#999').text('© 2026 Dmente Digital. Todos los derechos reservados.', { align: 'center' });
    doc.text('No es azar, es propósito. www.dmentedigital.co', { align: 'center' });

    return doc;
  } catch (error) {
    throw error;
  }
};

/**
 * Obtener color según score
 */
const getScoreColor = (scoreLevel) => {
  const colors = {
    excellent: '#10b981',  // Green
    high: '#3b82f6',       // Blue
    medium: '#f59e0b',     // Amber
    low: '#ef4444',        // Red
    very_low: '#dc2626'    // Dark Red
  };
  return colors[scoreLevel] || '#6b7280';
};

/**
 * Obtener etiqueta según score
 */
const getScoreLabel = (scoreLevel) => {
  const labels = {
    excellent: 'Excelente',
    high: 'Alto',
    medium: 'Medio',
    low: 'Bajo',
    very_low: 'Muy Bajo'
  };
  return labels[scoreLevel] || 'Sin Clasificar';
};

/**
 * Generar nombre de archivo
 */
export const getReportFilename = (moduleId, userId) => {
  const timestamp = new Date().toISOString().split('T')[0];
  return `BrandForge_${moduleId}_${userId}_${timestamp}.pdf`;
};
