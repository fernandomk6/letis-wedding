// Header component
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import './Header.css';

const Header = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleAdminClick = () => {
    navigate('/admin');
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <h1>Letis Wedding</h1>
          <p>Lista de Presentes</p>
        </div>
        
        <div className="header-actions">
          {isAdmin && (
            <button 
              className="admin-button"
              onClick={handleAdminClick}
            >
              👑 Área Administrativa
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
