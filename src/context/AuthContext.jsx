import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);  // Novo: Estado de loading
  const navigate = useNavigate();

  const isAuthenticated = !!user;  // Novo: Derivado de user

  const login = async (name, password = null) => {
    try {
      const response = await api.post('/login', { name, password });
      const { user: userData, token } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);

      // Redirecionar baseado no role
      if (userData.role === 'admin') {
        navigate('/admin-dashboard');  // Ajuste se usar /dashboard unificado
      } else {
        navigate('/student-dashboard');  // Ajuste se usar /dashboard unificado
      }

      return userData;
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;  // Lança erro para ser capturado no componente
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);  // Finaliza loading após verificação
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);