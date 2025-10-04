// Admin header component
import { useNavigate } from 'react-router-dom';
import './AdminHeader.css';

const AdminHeader = ({ onSignOut }) => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    onSignOut();
    navigate('/login');
  };

  return (
    <header className="admin-header">
      <div className="admin-header-content">
        <div className="admin-logo">
          <h1>Letis Wedding</h1>
          <p>Dashboard Administrativo</p>
        </div>
        
        <div className="admin-actions">
          <span className="admin-badge">👑 Administrador</span>
          <button className="signout-button" onClick={handleSignOut}>
            Sair
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
