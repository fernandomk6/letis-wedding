// Firebase Authentication operations
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth } from './config.js';

// Admin credentials (for reference - DO NOT expose in UI)
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'leticia@exemplo.com';
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'casei';

export const authService = {
  // Sign in admin
  async signInAdmin(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  },

  // Sign out
  async signOut() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  },

  // Get current user
  getCurrentUser() {
    return auth.currentUser;
  },

  // Listen to auth state changes
  onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, callback);
  },

  // Check if user is admin
  isAdmin(user) {
    return user && user.email === ADMIN_EMAIL;
  },

  // Get admin credentials (for setup purposes only)
  getAdminCredentials() {
    return {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    };
  }
};
