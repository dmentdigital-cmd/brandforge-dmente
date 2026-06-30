// ===================================
// REPORTS PAGE (Historial)
// ===================================

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useAssessmentStore } from '../stores/assessmentStore';
import { Download, Eye, Calendar } from 'lucide-react';
import { downloadAssessmentPDF } from '../services/assessmentAPI';

const MODULE_NAMES = {
  fundamentals: '🎯 Fundamentos',
  strategy: '📊 Estrategia',
  identity: '🎨 Identidad Visual',
  platforms: '🌐 Plataformas',
  narrative: '📝 Narrativa',
  monetization: '💰 Monetización'
};

const getScoreColor = (score) => {
  if (score >= 91) return 'text-green-400';
  if (score >= 76) return 'text-blue-400';
  if (score >= 61) return 'text-yellow-400';
  if (score >= 31) return 'text-red-400';
  return 'text-red-600';
};

const getScoreBgColor = (score) => {
  if (score >= 91) return 'bg-green-500/10';
  if (score >= 76) return 'bg-blue-500/10';
  if (score >= 61) return 'bg-yellow-500/10';
  if (score >= 31) return 'bg-red-500/10';
  return 'bg-red-600/10';
};

export default function Reports() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { fetchProgress } = useAssessmentStore();

  const [assessments, setAssessments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Cargar assessments
    fetchProgress()
      .then(data => {
        const completed = data.assessments?.filter(a => a.status === 'completed') || [];
        setAssessments(completed.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt)));
      })
      .catch(err => console.error('Failed to fetch progress:', err))
      .finally(() => setIsLoading(false));
  }, [isAuthenticated, navigate, fetchProgress]);

  const handleDownloadPDF = async (assessmentId) => {
    setDownloadingId(assessmentId);
    try {
      await downloadAssessmentPDF(assessmentId);
    } catch (error) {
      console.error('Failed to download PDF:', error);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">🎯 BrandForge</h1>
            <p className="text-sm text-slate-400">Mis Reportes</p>
          </div>

          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition-all"
          >
            Volver a Dashboard
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Title */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Mis Reportes</h2>
          <p className="text-slate-400 text-lg">
            Historial completo de tus evaluaciones y reportes generados
          </p>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full" />
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && assessments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400 mb-6">No hay reportes aún</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
            >
              Ir al Dashboard
            </button>
          </div>
        )}

        {/* Reports List */}
        {!isLoading && assessments.length > 0 && (
          <div className="space-y-4">
            {assessments.map((assessment) => (
              <div
                key={assessment.assessmentId}
                className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-all"
              >
                <div className="flex items-start justify-between">
                  {/* Left side - Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-white">
                        {MODULE_NAMES[assessment.moduleId] || assessment.moduleId}
                      </h3>
                      <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs font-semibold rounded">
                        ✓ Completado
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        {new Date(assessment.completedAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                      <div>
                        {new Date(assessment.completedAt).toLocaleTimeString('es-ES', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Right side - Score and Actions */}
                  <div className="flex items-center gap-6 ml-6">
                    {/* Score */}
                    <div className={`text-center p-4 rounded-lg ${getScoreBgColor(assessment.score)}`}>
                      <div className={`text-3xl font-bold ${getScoreColor(assessment.score)}`}>
                        {assessment.score}
                      </div>
                      <div className="text-xs text-slate-400 mt-1">/100</div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/assessment/${assessment.moduleId}`)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition-all"
                        title="Ver detalles"
                      >
                        <Eye size={18} />
                      </button>

                      <button
                        onClick={() => handleDownloadPDF(assessment.assessmentId)}
                        disabled={downloadingId === assessment.assessmentId}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Descargar PDF"
                      >
                        {downloadingId === assessment.assessmentId ? (
                          <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                        ) : (
                          <Download size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats */}
        {!isLoading && assessments.length > 0 && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <div className="text-slate-400 text-sm font-semibold mb-2">TOTAL COMPLETADOS</div>
              <div className="text-4xl font-bold text-blue-400">{assessments.length}</div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <div className="text-slate-400 text-sm font-semibold mb-2">PROMEDIO</div>
              <div className="text-4xl font-bold text-green-400">
                {Math.round(assessments.reduce((sum, a) => sum + a.score, 0) / assessments.length)}
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <div className="text-slate-400 text-sm font-semibold mb-2">MEJOR SCORE</div>
              <div className="text-4xl font-bold text-yellow-400">
                {Math.max(...assessments.map(a => a.score))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
