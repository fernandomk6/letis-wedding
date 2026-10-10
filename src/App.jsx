// Main App component
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import Login from './components/Login.jsx';
import PublicList from './components/PublicList.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import './App.css';

const AppContent = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Rota pública para a lista de presentes */}
      <Route path="/l/:uid" element={<PublicList />} />
      
      {/* Rota do painel administrativo */}
      <Route 
        path="/admin" 
        element={
          user ? 
            <AdminDashboard /> : 
            <Navigate to="/login" replace />
        } 
      />
      
      {/* Rota de login */}
      <Route 
        path="/login" 
        element={
          user ? 
            <Navigate to="/admin" replace /> : 
            <Login onLoginSuccess={() => {}} />
        } 
      />
      
      {/* Rota raiz - redireciona para login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <AppContent />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;

