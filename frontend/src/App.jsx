import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuthStore } from './stores/authStore'

// Pages
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Assessment from './pages/Assessment'
import ProtectedRoute from './components/Auth/ProtectedRoute'

export default function App() {
  const [apiStatus, setApiStatus] = useState('checking')
  const { checkAuth } = useAuthStore()

  useEffect(() => {
    // Verificar autenticación al cargar
    checkAuth()

    // Verificar salud del API
    axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/health`)
      .then(() => setApiStatus('connected'))
      .catch(() => setApiStatus('disconnected'))
  }, [checkAuth])

  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/assessment"
          element={
            <ProtectedRoute>
              <Assessment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/assessment/:moduleId"
          element={
            <ProtectedRoute>
              <Assessment />
            </ProtectedRoute>
          }
        />

        {/* Home - redirigir a dashboard si autenticado, login si no */}
        <Route
          path="/"
          element={
            <Navigate to="/dashboard" replace />
          }
        />

        {/* 404 - Página no encontrada */}
        <Route
          path="*"
          element={
            <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-white mb-4">404</h1>
                <p className="text-slate-400 mb-8">Página no encontrada</p>
                <a
                  href="/dashboard"
                  className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all"
                >
                  Volver al Dashboard
                </a>
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  )
}
