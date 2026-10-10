// Authentication context and hooks
import { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../firebase/auth.js';
import { userService } from '../firebase/services.jsx';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    const user = await authService.signInWithGoogle();
    // Garante o perfil do usuário em users/{uid}
    await userService.ensureProfile(user);
    return user;
  };

  const signOut = async () => {
    await authService.signOut();
  };

  const value = {
    user,
    signInWithGoogle,
    signOut,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
