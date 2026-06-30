// ===================================
// QUESTION CARD COMPONENT
// ===================================

import AnswerOption from './AnswerOption';
import { useState } from 'react';

export default function QuestionCard({
  question,
  selectedAnswer,
  onSelectAnswer,
  isLoading,
  showFeedback
}) {
  const [confidence, setConfidence] = useState(0.7);

  if (!question) {
    return null;
  }

  return (
    <div className="w-full">
      {/* Número y tipo de pregunta */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
            Pregunta {question.number}
          </span>
          <span className="text-xs px-2 py-1 rounded-full bg-slate-700 text-slate-400">
            {question.type === 'single_choice' ? 'Única respuesta' : 'Múltiples respuestas'}
          </span>
        </div>
      </div>

      {/* Pregunta principal */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2 leading-tight">
          {question.question}
        </h2>
        {question.description && (
          <p className="text-slate-400 text-sm leading-relaxed">
            {question.description}
          </p>
        )}
      </div>

      {/* Opciones de respuesta */}
      <div className="mb-8">
        <div className="mb-4">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Selecciona tu respuesta:
          </label>
        </div>

        <div className="space-y-0">
          {question.options.map(option => (
            <AnswerOption
              key={option.id}
              id={option.id}
              text={option.text}
              isSelected={selectedAnswer === option.id}
              isDisabled={isLoading || showFeedback}
              onSelect={onSelectAnswer}
            />
          ))}
        </div>
      </div>

      {/* Confidence slider (si es necesario) */}
      {selectedAnswer && !showFeedback && (
        <div className="mt-6 pt-6 border-t border-slate-600">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              ¿Qué tan seguro estás de tu respuesta?
            </label>
            <span className="text-sm font-semibold text-blue-400">
              {Math.round(confidence * 100)}%
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={confidence}
            onChange={(e) => setConfidence(parseFloat(e.target.value))}
            disabled={isLoading}
            className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer
              accent-blue-500"
          />

          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>No seguro</span>
            <span>Muy seguro</span>
          </div>
        </div>
      )}

      {/* Feedback (si se muestra) */}
      {showFeedback && (
        <div className="mt-6 p-4 rounded-lg bg-green-500/10 border border-green-500/30">
          <p className="text-sm text-green-300">
            ✓ Respuesta guardada correctamente
          </p>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center">
          <div className="animate-spin">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full" />
          </div>
        </div>
      )}
    </div>
  );
}
