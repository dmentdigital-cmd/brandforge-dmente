// ===================================
// REGISTER FORM COMPONENT
// ===================================

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import axios from 'axios';
import { Mail, Lock, User, Briefcase, Loader } from 'lucide-react';

export default function RegisterForm() {
  const navigate = useNavigate();
  const { login, setError, error } = useAuthStore();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    profession: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validar contraseñas
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setIsLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.post(`${API_URL}/api/auth/register`, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        profession: formData.profession
      });

      const { user, token } = response.data;

      // Guardar en store
      login(user, token);

      // Redirigir al dashboard
      navigate('/dashboard');
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to register';
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Crear Cuenta</h2>
          <p className="text-slate-400">Únete a BrandForge hoy</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-slate-300 mb-2">
                Nombre
              </label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-3 text-slate-500" />
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Tu nombre"
                  required
                  className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg
                    text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500
                    transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-slate-300 mb-2">
                Apellido
              </label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-3 text-slate-500" />
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Tu apellido"
                  required
                  className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg
                    text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500
                    transition-all"
                />
              </div>
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-3 text-slate-500" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                required
                className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg
                  text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500
                  transition-all"
              />
            </div>
          </div>

          {/* Profesión */}
          <div>
            <label htmlFor="profession" className="block text-sm font-medium text-slate-300 mb-2">
              Profesión
            </label>
            <div className="relative">
              <Briefcase size={18} className="absolute left-3 top-3 text-slate-500" />
              <input
                type="text"
                id="profession"
                name="profession"
                value={formData.profession}
                onChange={handleChange}
                placeholder="Ej: Abogado, Coach, Desarrollador"
                className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg
                  text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500
                  transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
              Contraseña
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-3 text-slate-500" />
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg
                  text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500
                  transition-all"
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-2">
              Confirmar Contraseña
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-3 text-slate-500" />
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg
                  text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500
                  transition-all"
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Botón */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg
              flex items-center justify-center gap-2 transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader size={18} className="animate-spin" />
                Registrando...
              </>
            ) : (
              'Crear Cuenta'
            )}
          </button>
        </form>

        {/* Link a login */}
        <div className="mt-6 text-center">
          <p className="text-slate-400">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
