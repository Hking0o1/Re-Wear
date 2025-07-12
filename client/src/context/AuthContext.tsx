import React, { createContext, useState, type ReactNode } from 'react';
import type { User, AuthState } from '../types';
import axios from 'axios'; // Add this import

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoggedIn: false
  });

  // LOGIN
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      if (res.data.success) {
        setAuthState({ user: res.data.data.user, isLoggedIn: true });
        // Optionally store token: localStorage.setItem('token', res.data.data.token);
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  // REGISTER
  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const res = await axios.post('/api/auth/register', { name, email, password });
      if (res.data.success) {
        setAuthState({ user: res.data.data.user, isLoggedIn: true });
        // Optionally store token: localStorage.setItem('token', res.data.data.token);
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  const logout = () => {
    setAuthState({ user: null, isLoggedIn: false });
    // Optionally: localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
