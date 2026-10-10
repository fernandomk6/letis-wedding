// Login component for admin authentication
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import './Login.css';

const Login = ({ onLoginSuccess }) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  // Prevent body scroll when login modal is open
  useEffect(() => {
    document.body.classList.add('login-modal-open');
    return () => {
      document.body.classList.remove('login-modal-open');
    };
  }, []);

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);

    try {
      await signInWithGoogle();
      onLoginSuccess();
      navigate('/admin');
    } catch (error) {
      if (error.code !== 'auth/popup-closed-by-user' && error.code !== 'auth/cancelled-popup-request') {
        setError('Não foi possível entrar com o Google. Tente novamente.');
      }
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Letis Wedding</h1>
          <p>Crie e gerencie sua lista de presentes</p>
        </div>

        <div className="login-form">
          {error && <div className="error-message">{error}</div>}

          <button
            type="button"
            className="login-button"
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar com Google'}
          </button>
        </div>

        <div className="login-footer">
          <p>Use sua conta Google para acessar sua lista</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
