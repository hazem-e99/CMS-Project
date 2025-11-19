import { create } from 'zustand';
import { authService } from '../services/authService';

/**
 * Authentication store using Zustand
 */
export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('authUser') || 'null'),
  token: localStorage.getItem('authToken'),
  isAuthenticated: !!localStorage.getItem('authToken'),
  
  login: async (email, password) => {
    try {
      const response = await authService.login(email, password);
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('authUser', JSON.stringify(response.user));
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
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      set({ user: null, token: null, isAuthenticated: false });
    }
  },
  
  checkAuth: () => {
    const token = localStorage.getItem('authToken');
    const storedUser = JSON.parse(localStorage.getItem('authUser') || 'null');
    set({ 
      isAuthenticated: !!token,
      token,
      user: storedUser,
    });
  },
}));

