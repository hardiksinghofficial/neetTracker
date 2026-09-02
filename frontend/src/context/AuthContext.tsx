import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  mode: 'edit' | 'view';
  currentUser: string;
  login: (code: string, selectedMode: 'edit' | 'view') => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [mode, setMode] = useState<'edit' | 'view'>('edit');
  const [currentUser, setCurrentUser] = useState<string>('Akarsh Singh');

  useEffect(() => {
    const savedAuth = localStorage.getItem('neet_is_authenticated');
    const savedMode = localStorage.getItem('neet_access_mode');
    const savedUser = localStorage.getItem('neet_current_user');

    if (savedAuth === 'true') {
      setIsAuthenticated(true);
      if (savedMode === 'edit' || savedMode === 'view') {
        setMode(savedMode);
      }
      if (savedUser) {
        setCurrentUser(savedUser);
      }
    }
  }, []);

  const login = async (code: string, selectedMode: 'edit' | 'view'): Promise<boolean> => {
    const trimmed = code.trim().toLowerCase();

    // Student Codes
    const studentCodes = ['2027', 'akarsh2027', 'akarsh'];
    // Parent Codes
    const parentCodes = ['9999', 'parent2027', 'parent', '1234'];

    if (selectedMode === 'edit' && studentCodes.includes(trimmed)) {
      setIsAuthenticated(true);
      setMode('edit');
      setCurrentUser('Akarsh Singh');
      localStorage.setItem('neet_is_authenticated', 'true');
      localStorage.setItem('neet_access_mode', 'edit');
      localStorage.setItem('neet_current_user', 'Akarsh Singh');
      return true;
    }

    if (selectedMode === 'view' && parentCodes.includes(trimmed)) {
      setIsAuthenticated(true);
      setMode('view');
      setCurrentUser('Parent View');
      localStorage.setItem('neet_is_authenticated', 'true');
      localStorage.setItem('neet_access_mode', 'view');
      localStorage.setItem('neet_current_user', 'Parent View');
      return true;
    }

    return false;
  };

  const logout = () => {
    localStorage.removeItem('neet_is_authenticated');
    localStorage.removeItem('neet_access_mode');
    localStorage.removeItem('neet_current_user');
    setIsAuthenticated(false);
    setMode('edit');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, mode, currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
