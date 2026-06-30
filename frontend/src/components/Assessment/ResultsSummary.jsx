// ===================================
// RESULTS SUMMARY COMPONENT
// ===================================

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { ArrowRight, Download } from 'lucide-react';

const SCORE_COLORS = {
  excellent: '#10b981',
  high: '#3b82f6',
  medium: '#f59e0b',
  low: '#ef4444',
  very_low: '#dc2626'
};

const SCORE_LABELS = {
  excellent: 'Excelente',
  high: 'Alto',
  medium: 'Medio',
  low: 'Bajo',
  very_low: 'Muy Bajo'
};

export default function ResultsSummary({ results, onContinue }) {
  if (!results) {
    return null;
  }

  const {
    score,
    scoreLevel,
    correctAnswers,
    totalQuestions,
    analysis,
    completedAt
  } = results;

  // Preparar datos para gráfico
  const chartData = analysis?.categoryScores
    ? Object.entries(analysis.categoryScores).map(([category, score]) => ({
        name: category.charAt(0).toUpperCase() + category.slice(1),
        score
      }))
    : [];

  const getScoreColor = (level) => SCORE_COLORS[level] || '#6b7280';
  const getScoreBgColor = (level) => {
    const colors = {
      excellent: 'from-green-500/20 to-green-600/10',
      high: 'from-blue-500/20 to-blue-600/10',
      medium: 'from-amber-500/20 to-amber-600/10',
      low: 'from-red-500/20 to-red-600/10',
      very_low: 'from-red-600/20 to-red-700/10'
    };
    return colors[level] || 'from-slate-500/20 to-slate-600/10';
  };

  const getScoreBorder = (level) => {
    const colors = {
      excellent: 'border-green-500/30',
      high: 'border-blue-500/30',
      medium: 'border-amber-500/30',
      low: 'border-red-500/30',
      very_low: 'border-red-600/30'
    };
    return colors[level] || 'border-slate-500/30';
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">
          🎉 ¡Evaluación Completada!
        </h2>
        <p className="text-slate-400">
          Aquí están tus resultados y análisis
        </p>
      </div>

      {/* Score principal */}
      <div className={`
        bg-gradient-to-br ${getScoreBgColor(scoreLevel)}
        border ${getScoreBorder(scoreLevel)}
        rounded-lg p-8 text-center
      `}>
        <div className="mb-4">
          <span className="text-6xl font-bold text-white">{score}</span>
          <span className="text-2xl text-slate-400">/100</span>
        </div>

        <div className="mb-4">
          <h3 className="text-2xl font-semibold text-white">
            {SCORE_LABELS[scoreLevel]}
          </h3>
          <p className="text-sm text-slate-300 mt-2">
            Respondiste {correctAnswers} de {totalQuestions} preguntas correctamente
          </p>
        </div>

        {/* Barra de score visual */}
        <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden mt-4">
          <div
            className="h-full transition-all duration-500"
            style={{
              width: `${score}%`,
              backgroundColor: getScoreColor(scoreLevel)
            }}
          />
        </div>
      </div>

      {/* Insights */}
      {analysis?.insights && analysis.insights.length > 0 && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">💡 Insights Principales</h3>
          <ul className="space-y-3">
            {analysis.insights.map((insight, idx) => (
              <li key={idx} className="flex gap-3">
                <span className="text-blue-400 font-bold mt-0.5">•</span>
                <span className="text-slate-300">{insight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Gráfico de categorías (si existen) */}
      {chartData.length > 0 && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">📊 Resultados por Categoría</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '8px'
                }}
                formatter={(value) => `${value}%`}
              />
              <Bar dataKey="score" fill="#3b82f6" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, idx) => (
                  <Cell key={idx} fill="#3b82f6" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Próximos pasos */}
      {analysis?.nextSteps && analysis.nextSteps.length > 0 && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">🚀 Próximos Pasos</h3>
          <div className="space-y-3">
            {analysis.nextSteps.map((step, idx) => (
              <div
                key={idx}
                className="p-4 bg-slate-700/50 border border-slate-600 rounded-lg hover:bg-slate-700 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-white">{step.title}</p>
                    <p className="text-sm text-slate-400 mt-1">{step.description}</p>
                  </div>
                  <span className="ml-4 px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded">
                    P{step.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Acciones */}
      <div className="flex flex-col sm:flex-row gap-4 pt-6">
        <button
          onClick={onContinue}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg
            bg-blue-600 hover:bg-blue-700 text-white font-semibold
            transition-all duration-200"
        >
          Continuar a Módulo Siguiente
          <ArrowRight size={20} />
        </button>

        <button
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg
            bg-slate-700 hover:bg-slate-600 text-white font-semibold
            transition-all duration-200"
        >
          <Download size={20} />
          Descargar Reporte (Próximamente)
        </button>
      </div>

      {/* Metadata */}
      <div className="text-center text-xs text-slate-500">
        <p>Completado el {new Date(completedAt).toLocaleDateString('es-ES')}</p>
      </div>
    </div>
  );
}
