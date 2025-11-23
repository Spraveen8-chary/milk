import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Role } from './types';
import { MOCK_USERS, CURRENT_USER_KEY } from './constants';

interface AuthContextType {
  user: User | null;
  login: (email: string, role: Role) => boolean;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check local storage on mount
    const storedUser = localStorage.getItem(CURRENT_USER_KEY);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (email: string, role: Role): boolean => {
    // Mock login logic
    const foundUser = MOCK_USERS.find(u => u.email === email && u.role === role);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(foundUser));
      return true;
    }
    
    // Fallback for demo if using generic credentials
    if (email === 'demo') {
        const demoUser = MOCK_USERS.find(u => u.role === role);
        if (demoUser) {
            setUser(demoUser);
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(demoUser));
            return true;
        }
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};