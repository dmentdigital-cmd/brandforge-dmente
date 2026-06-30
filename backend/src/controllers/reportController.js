// ===================================
// REPORT CONTROLLER
// ===================================

import { generateAssessmentPDF, getReportFilename } from '../services/reportService.js';
import Assessment from '../models/Assessment.js';

/**
 * GET /api/report/:assessmentId/pdf
 * Descargar PDF del assessment
 */
export const downloadAssessmentPDF = async (req, res) => {
  try {
    const { assessmentId } = req.params;
    const userId = req.user.id;

    if (!assessmentId) {
      return res.status(400).json({ error: 'assessmentId is required' });
    }

    // Verificar que el assessment existe y pertenece al usuario
    const assessment = await Assessment.findByPk(assessmentId);

    if (!assessment) {
      return res.status(404).json({ error: 'Assessment not found' });
    }

    if (assessment.userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (assessment.status !== 'completed') {
      return res.status(400).json({ error: 'Assessment not completed' });
    }

    // Generar PDF
    const doc = await generateAssessmentPDF(assessmentId, userId);

    // Configurar headers para descarga
    const filename = getReportFilename(assessment.moduleId, userId);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    // Pipe del documento al response
    doc.pipe(res);
    doc.end();
  } catch (error) {
    console.error('Download PDF error:', error);

    if (error.message === 'Unauthorized') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    if (error.message.includes('not found')) {
      return res.status(404).json({ error: error.message });
    }
    if (error.message.includes('not completed')) {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: 'Failed to generate PDF' });
  }
};

/**
 * GET /api/report/assessment/:assessmentId
 * Obtener datos del reporte (sin PDF)
 */
export const getReportData = async (req, res) => {
  try {
    const { assessmentId } = req.params;
    const userId = req.user.id;

    if (!assessmentId) {
      return res.status(400).json({ error: 'assessmentId is required' });
    }

    // Obtener assessment
    const assessment = await Assessment.findByPk(assessmentId, {
      attributes: ['id', 'moduleId', 'status', 'score', 'analysis', 'completedAt', 'startedAt'],
      where: { userId }
    });

    if (!assessment) {
      return res.status(404).json({ error: 'Assessment not found' });
    }

    res.json({
      assessment: {
        id: assessment.id,
        moduleId: assessment.moduleId,
        status: assessment.status,
        score: assessment.score,
        analysis: assessment.analysis,
        completedAt: assessment.completedAt,
        startedAt: assessment.startedAt
      }
    });
  } catch (error) {
    console.error('Get report data error:', error);
    res.status(500).json({ error: 'Failed to get report data' });
  }
};
