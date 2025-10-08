import { createContext, useContext, useState, useEffect } from 'react';

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
    } catch (error) {
      console.error('Erro no login:', error);
      return { success: false, error: 'Erro no login.' };
    }
  };

  const register = async (name) => {
    try {
      const mockUsers = JSON.parse(localStorage.getItem('mockUsers') || '{}');
      const newId = Object.keys(mockUsers).length + 1;
      const newUser  = { id: newId, name: name.trim(), role: 'student' };
      
      mockUsers[name.toLowerCase()] = newUser ;
      localStorage.setItem('mockUsers', JSON.stringify(mockUsers));

      setUser (newUser );
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(newUser ));
      return { success: true, user: newUser  };
    } catch (error) {
      console.error('Erro no cadastro:', error);
      return { success: false, error: 'Erro ao cadastrar. Tente novamente.' };
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
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};