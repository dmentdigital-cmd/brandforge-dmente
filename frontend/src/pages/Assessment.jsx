// ===================================
// ASSESSMENT PAGE
// ===================================

import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { AssessmentFlow, ResultsSummary } from '../components/Assessment';
import { useAuthStore } from '../stores/authStore';

export default function Assessment() {
  const { moduleId = 'fundamentals' } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const [results, setResults] = useState(null);

  // Verificar autenticación
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-white mb-4">Acceso Denegado</h1>
        <p className="text-slate-400 mb-6">Debes iniciar sesión para acceder a los assessments</p>
        <button
          onClick={() => navigate('/login')}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Ir a Login
        </button>
      </div>
    );
  }

  const handleComplete = (completedResults) => {
    setResults(completedResults);
  };

  const handleContinue = () => {
    // Ir al siguiente módulo o dashboard
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Mostrar assessment o resultados */}
        {!results ? (
          <AssessmentFlow
            moduleId={moduleId}
            onComplete={handleComplete}
          />
        ) : (
          <ResultsSummary
            results={results}
            onContinue={handleContinue}
          />
        )}
      </div>
    </div>
  );
}
