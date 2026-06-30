// ===================================
// REGISTER PAGE
// ===================================

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import RegisterForm from '../components/Auth/RegisterForm';

export default function Register() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  // Si ya está autenticado, redirigir al dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col items-center justify-center px-4">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-white mb-2">🎯 BrandForge</h1>
        <p className="text-slate-400">Construye tu marca personal</p>
      </div>

      {/* Formulario */}
      <RegisterForm />

      {/* Footer */}
      <div className="mt-12 text-center text-slate-500 text-sm">
        <p>No es azar, es propósito.</p>
        <p className="mt-1">© 2026 Dmente Digital. Todos los derechos reservados.</p>
      </div>
    </div>
  );
}
