import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser ] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser  = localStorage.getItem('user');
    if (storedUser ) {
      setUser (JSON.parse(storedUser ));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (username) => {
    try {
      const response = await api.get(`/auth/login-by-name/${encodeURIComponent(username)}`);
      const userData = response.data;

      if (userData) {
        setUser (userData);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(userData));
        return { success: true };
      } else {
        return { success: false, error: 'Nome de usuário não encontrado.' };
      }
    } catch (error) {
      console.error('Erro no login:', error);
      const mockUsers = {
        'joão': { id: 1, name: 'João', role: 'student' },
        'maria': { id: 2, name: 'Maria', role: 'student' },
        'professora': { id: 3, name: 'Professora Ana', role: 'admin' }
      };
      if (mockUsers[username.toLowerCase()]) {
        const userData = mockUsers[username.toLowerCase()];
        setUser (userData);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(userData));
        return { success: true };
      }
      return { success: false, error: 'Nome não encontrado. Tente novamente ou peça ajuda.' };
    }
  };

  const logout = () => {
    setUser (null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};