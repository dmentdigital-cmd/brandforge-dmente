import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'

// Pages (to be created)
// import Home from './pages/Home'
// import Dashboard from './pages/Dashboard'
// import Assessment from './pages/Assessment'

export default function App() {
  const [apiStatus, setApiStatus] = useState('checking')

  useEffect(() => {
    // Check API health
    axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/health`)
      .then(() => setApiStatus('connected'))
      .catch(() => setApiStatus('disconnected'))
  }, [])

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        {/* Header */}
        <header className="bg-slate-800 border-b border-slate-700">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">BrandForge</h1>
            <div className="text-sm">
              <span className={`px-2 py-1 rounded ${
                apiStatus === 'connected'
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-red-500/20 text-red-400'
              }`}>
                {apiStatus === 'connected' ? '✓ API Connected' : '✗ API Disconnected'}
              </span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-8">
          {/* Placeholder routes */}
          <Routes>
            {/* <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/assessment" element={<Assessment />} /> */}
            <Route path="/" element={
              <div className="text-center text-white py-16">
                <h2 className="text-4xl font-bold mb-4">Bienvenido a BrandForge</h2>
                <p className="text-slate-300 text-lg mb-8">
                  Tu plataforma SaaS para construir, auditar y monetizar tu marca personal
                </p>
                <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-8 max-w-2xl mx-auto">
                  <p className="text-slate-400 mb-4">🚀 Aplicación en desarrollo</p>
                  <p className="text-sm text-slate-500">
                    Las rutas y componentes se están implementando según el SPEC.md
                  </p>
                </div>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  )
}
