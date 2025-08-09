import { create } from 'zustand';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../libs/firebase.js';

export const useAuthStore = create((set, get) => ({
  user: null,
  loading: true,
  error: null,
  isInitialized: false,

  // Actions
  setUser: (user) => set({ 
    user, 
    loading: false, 
    error: null,
    isInitialized: true 
  }),
  
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error }),
  
  clearError: () => set({ error: null }),

  logout: async () => {
    try {
      set({ loading: true, error: null });
      await signOut(auth);
      set({ user: null, loading: false });
      return { success: true };
    } catch (error) {
      set({ 
        loading: false, 
        error: error.message || 'Failed to logout' 
      });
      return { success: false, error: error.message };
    }
  },

  // Helper methods
  isAuthenticated: () => {
    const { user, isInitialized } = get();
    return isInitialized && !!user;
  },

  getUserId: () => {
    const { user } = get();
    return user?.uid || null;
  },

  getUserEmail: () => {
    const { user } = get();
    return user?.email || null;
  }
}));

// Listen for auth state changes with error handling
let authUnsubscribe = null;

const initializeAuthListener = () => {
  if (authUnsubscribe) return; // Prevent multiple listeners

  authUnsubscribe = onAuthStateChanged(
    auth, 
    (firebaseUser) => {
      useAuthStore.getState().setUser(firebaseUser || null);
    },
    (error) => {
      console.error('Auth state change error:', error);
      useAuthStore.getState().setError('Authentication error occurred');
      useAuthStore.getState().setUser(null);
    }
  );
};

// Initialize the listener
initializeAuthListener();

// Cleanup function for testing or unmounting
export const cleanupAuthListener = () => {
  if (authUnsubscribe) {
    authUnsubscribe();
    authUnsubscribe = null;
  }
};