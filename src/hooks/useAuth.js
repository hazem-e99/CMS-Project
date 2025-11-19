import { create } from 'zustand';
import { authAPI } from '../services/api';

/**
 * Authentication store using Zustand
 */
export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('authToken'),
  isAuthenticated: !!localStorage.getItem('authToken'),
  
  login: async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      localStorage.setItem('authToken', response.token);
      set({ 
        user: response.user, 
        token: response.token, 
        isAuthenticated: true 
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  logout: async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      set({ user: null, token: null, isAuthenticated: false });
    }
  },
  
  checkAuth: () => {
    const token = localStorage.getItem('authToken');
    set({ isAuthenticated: !!token });
  },
}));

