// ===================================
// ASSESSMENT FLOW COMPONENT (Main)
// ===================================

import { useEffect, useState } from 'react';
import { useAssessmentStore } from '../../stores/assessmentStore';
import QuestionCard from './QuestionCard';
import ProgressBar from './ProgressBar';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

export default function AssessmentFlow({ moduleId, onComplete }) {
  const {
    currentAssessment,
    questions,
    currentQuestionIndex,
    isLoading,
    isSubmitting,
    error,
    startAssessment,
    submitAnswer,
    previousQuestion,
    nextQuestion,
    completeAssessment,
    getCurrentQuestion,
    getCurrentAnswer,
    isComplete
  } = useAssessmentStore();

  const [showFeedback, setShowFeedback] = useState(false);

  // Inicializar assessment
  useEffect(() => {
    if (moduleId && !currentAssessment) {
      startAssessment(moduleId).catch(err => {
        console.error('Failed to start assessment:', err);
      });
    }
  }, [moduleId, currentAssessment, startAssessment]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin mb-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full" />
        </div>
        <p className="text-slate-400">Cargando assessment...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-lg">
        <p className="text-red-400 font-semibold">Error</p>
        <p className="text-red-300 text-sm mt-1">{error}</p>
      </div>
    );
  }

  if (!currentAssessment || questions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">No hay assessment activo</p>
      </div>
    );
  }

  const currentQuestion = getCurrentQuestion();
  const currentAnswer = getCurrentAnswer();
  const totalQuestions = questions.length;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const assessmentComplete = isComplete();

  const handleSelectAnswer = async (answerId) => {
    try {
      await submitAnswer(currentQuestion.id, answerId, 0.7);
      setShowFeedback(true);

      // Avanzar automáticamente después de 1 segundo
      setTimeout(() => {
        setShowFeedback(false);
        if (!isLastQuestion) {
          nextQuestion();
        }
      }, 1000);
    } catch (err) {
      console.error('Failed to submit answer:', err);
    }
  };

  const handleComplete = async () => {
    try {
      const results = await completeAssessment();
      if (onComplete) {
        onComplete(results);
      }
    } catch (err) {
      console.error('Failed to complete assessment:', err);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Header con progreso */}
      <div className="mb-8">
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-white mb-2">
            {currentAssessment.moduleId === 'fundamentals' && '🎯 Fundamentos de Marca Personal'}
          </h1>
          <p className="text-slate-400">
            Completa esta evaluación para diagnosticar tu marca personal
          </p>
        </div>

        <ProgressBar current={currentQuestionIndex + 1} total={totalQuestions} />
      </div>

      {/* Pregunta actual */}
      <div className="mb-8 relative">
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-8">
          <QuestionCard
            question={currentQuestion}
            selectedAnswer={currentAnswer}
            onSelectAnswer={handleSelectAnswer}
            isLoading={isSubmitting}
            showFeedback={showFeedback}
          />
        </div>
      </div>

      {/* Navegación */}
      <div className="flex justify-between items-center gap-4">
        {/* Botón anterior */}
        <button
          onClick={previousQuestion}
          disabled={currentQuestionIndex === 0 || isSubmitting}
          className="flex items-center gap-2 px-4 py-2 rounded-lg
            bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200"
        >
          <ChevronLeft size={20} />
          Anterior
        </button>

        {/* Info */}
        <div className="text-center">
          <p className="text-sm text-slate-400">
            {currentQuestionIndex + 1} / {totalQuestions}
          </p>
        </div>

        {/* Botón siguiente/completar */}
        {!isLastQuestion ? (
          <button
            onClick={nextQuestion}
            disabled={!currentAnswer || isSubmitting}
            className="flex items-center gap-2 px-4 py-2 rounded-lg
              bg-blue-600 hover:bg-blue-700 text-white
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200"
          >
            Siguiente
            <ChevronRight size={20} />
          </button>
        ) : (
          <button
            onClick={handleComplete}
            disabled={!assessmentComplete || isSubmitting}
            className="flex items-center gap-2 px-6 py-2 rounded-lg
              bg-green-600 hover:bg-green-700 text-white font-semibold
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                Procesando...
              </>
            ) : (
              <>
                <Check size={20} />
                Finalizar
              </>
            )}
          </button>
        )}
      </div>

      {/* Advertencia si no está completo */}
      {isLastQuestion && !assessmentComplete && (
        <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded
          flex items-start gap-2">
          <span className="text-yellow-400 text-sm font-semibold">⚠️</span>
          <p className="text-yellow-300 text-sm">
            Aún hay preguntas sin responder. Responde todas antes de finalizar.
          </p>
        </div>
      )}
    </div>
  );
}
