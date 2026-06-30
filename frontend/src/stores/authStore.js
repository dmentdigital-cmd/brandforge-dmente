// ===================================
// AUTH STORE (Zustand)
// ===================================

import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  // State
  isAuthenticated: !!localStorage.getItem('authToken'),
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('authToken'),
  isLoading: false,
  error: null,

  // Actions

  /**
   * Login
   */
  login: (user, token) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({
      isAuthenticated: true,
      user,
      token,
      error: null
    });
  },

  /**
   * Logout
   */
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    set({
      isAuthenticated: false,
      user: null,
      token: null
    });
  },

  /**
   * Verificar si está autenticado
   */
  checkAuth: () => {
    const token = localStorage.getItem('authToken');
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    if (token && user) {
      set({
        isAuthenticated: true,
        user,
        token
      });
      return true;
    }

    return false;
  },

  /**
   * Establecer error
   */
  setError: (error) => {
    set({ error });
  },

  /**
   * Establecer loading
   */
  setLoading: (isLoading) => {
    set({ isLoading });
  }
}));
