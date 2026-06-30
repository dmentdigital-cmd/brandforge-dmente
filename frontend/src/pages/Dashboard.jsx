// ===================================
// DASHBOARD PAGE
// ===================================

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useAssessmentStore } from '../stores/assessmentStore';
import { ArrowRight, LogOut, Zap } from 'lucide-react';

const MODULES = [
  {
    id: 'fundamentals',
    title: 'Módulo 1: Fundamentos',
    icon: '🎯',
    description: 'Autoconocimiento y diagnóstico de tu marca',
    color: 'from-blue-500 to-blue-600',
    borderColor: 'border-blue-500/30',
    estimatedTime: '10 min'
  },
  {
    id: 'strategy',
    title: 'Módulo 2: Estrategia',
    icon: '📊',
    description: 'Define tu nicho y propuesta de valor',
    color: 'from-purple-500 to-purple-600',
    borderColor: 'border-purple-500/30',
    estimatedTime: '12 min',
    locked: true
  },
  {
    id: 'identity',
    title: 'Módulo 3: Identidad Visual',
    icon: '🎨',
    description: 'Crea tu guía visual y brand identity',
    color: 'from-pink-500 to-pink-600',
    borderColor: 'border-pink-500/30',
    estimatedTime: '15 min',
    locked: true
  },
  {
    id: 'platforms',
    title: 'Módulo 4: Plataformas',
    icon: '🌐',
    description: 'Estrategia de presencia en redes',
    color: 'from-green-500 to-green-600',
    borderColor: 'border-green-500/30',
    estimatedTime: '12 min',
    locked: true
  },
  {
    id: 'narrative',
    title: 'Módulo 5: Narrativa',
    icon: '📝',
    description: 'Comunica tu historia y mensaje',
    color: 'from-yellow-500 to-yellow-600',
    borderColor: 'border-yellow-500/30',
    estimatedTime: '14 min',
    locked: true
  },
  {
    id: 'monetization',
    title: 'Módulo 6: Monetización',
    icon: '💰',
    description: 'Plan de ingresos y escalamiento',
    color: 'from-red-500 to-red-600',
    borderColor: 'border-red-500/30',
    estimatedTime: '16 min',
    locked: true
  }
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuthStore();
  const { fetchProgress } = useAssessmentStore();

  const [progress, setProgress] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Cargar progreso
    fetchProgress()
      .then(data => setProgress(data))
      .catch(err => console.error('Failed to fetch progress:', err))
      .finally(() => setIsLoading(false));
  }, [isAuthenticated, navigate, fetchProgress]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleStartModule = (moduleId) => {
    navigate(`/assessment/${moduleId}`);
  };

  // Obtener status de módulo
  const getModuleStatus = (moduleId) => {
    if (!progress) return 'not_started';
    const assessment = progress.assessments?.find(a => a.moduleId === moduleId);
    return assessment?.status || 'not_started';
  };

  const getModuleScore = (moduleId) => {
    if (!progress) return null;
    const assessment = progress.assessments?.find(a => a.moduleId === moduleId);
    return assessment?.score;
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">🎯 BrandForge</h1>
            <p className="text-sm text-slate-400">Dashboard</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-white">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-slate-400">{user?.email}</p>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition-all"
            >
              <LogOut size={18} />
              Salir
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Bienvenido, {user?.firstName}! 👋
          </h2>
          <p className="text-slate-400 text-lg">
            Completa los 6 módulos para diagnosticar, estrategizar y monetizar tu marca personal
          </p>
        </div>

        {/* Progress Overview */}
        {progress && (
          <div className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <div className="text-slate-400 text-sm font-semibold mb-2">MÓDULOS COMPLETADOS</div>
              <div className="text-4xl font-bold text-blue-400">
                {progress.completedModules}/{MODULES.length}
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <div className="text-slate-400 text-sm font-semibold mb-2">PROGRESO GENERAL</div>
              <div className="text-4xl font-bold text-green-400">
                {Math.round((progress.completedModules / MODULES.length) * 100)}%
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <div className="text-slate-400 text-sm font-semibold mb-2">SIGUIENTE MÓDULO</div>
              <div className="text-lg font-semibold text-slate-300">
                {progress.completedModules === MODULES.length
                  ? '✓ Completado'
                  : MODULES[progress.completedModules]?.title.split(':')[1].trim()}
              </div>
            </div>
          </div>
        )}

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MODULES.map((module, idx) => {
            const status = getModuleStatus(module.id);
            const score = getModuleScore(module.id);
            const isAvailable = idx === 0 || progress?.completedModules >= idx;

            return (
              <div
                key={module.id}
                className={`
                  bg-gradient-to-br ${module.color}/10 backdrop-blur
                  border ${module.borderColor} rounded-lg p-6
                  transition-all duration-300 cursor-pointer hover:shadow-lg
                  ${isAvailable ? 'hover:border-opacity-100 hover:shadow-lg hover:shadow-slate-900/20' : 'opacity-60 cursor-not-allowed'}
                `}
                onClick={() => isAvailable && handleStartModule(module.id)}
              >
                {/* Icon y Title */}
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{module.icon}</div>
                  {status === 'completed' && (
                    <div className="px-2 py-1 bg-green-500/20 text-green-300 text-xs font-semibold rounded">
                      ✓ Completado
                    </div>
                  )}
                  {isAvailable && status === 'not_started' && (
                    <div className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs font-semibold rounded">
                      Disponible
                    </div>
                  )}
                  {!isAvailable && (
                    <div className="px-2 py-1 bg-slate-500/20 text-slate-300 text-xs font-semibold rounded flex items-center gap-1">
                      <Zap size={12} /> Bloqueado
                    </div>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-2">{module.title}</h3>
                <p className="text-slate-400 text-sm mb-4">{module.description}</p>

                {/* Score si está completado */}
                {score !== null && (
                  <div className="mb-4 p-3 bg-slate-700/50 rounded-lg">
                    <div className="text-sm text-slate-400 mb-1">Tu puntuación</div>
                    <div className="text-2xl font-bold text-white">{score}/100</div>
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                  <div className="text-xs text-slate-400">⏱️ {module.estimatedTime}</div>
                  {isAvailable && (
                    <div className="flex items-center gap-1 text-blue-400 font-semibold text-sm">
                      {status === 'completed' ? 'Ver resultado' : 'Comenzar'}
                      <ArrowRight size={16} />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-2">
            ¿Listo para transformar tu marca?
          </h3>
          <p className="text-blue-100 mb-6">
            Completa todos los módulos y recibe un plan personalizado de 90 días
          </p>
          <button
            onClick={() => handleStartModule('fundamentals')}
            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-all"
          >
            Comenzar ahora
            <ArrowRight size={20} />
          </button>
        </div>
      </main>
    </div>
  );
}
