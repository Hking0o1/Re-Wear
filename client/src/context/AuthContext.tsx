import React, { useState, type ReactNode } from 'react';
import type { AuthState } from '../types';
import axios from 'axios';
import { AuthContext } from './AuthContextDef';

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
        return true;
      }
      return false;
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        // @ts-expect-error: response is expected on axios error
        console.error('Login error:', err.response.data);
      }
      return false;
    }
  };
  
  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const res = await axios.post('/api/auth/register', { name, email, password });
      if (res.data.success) {
        setAuthState({ user: res.data.data.user, isLoggedIn: true });
        return true;
      }
      return false;
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        // @ts-expect-error: response is expected on axios error
        console.error('Registration error:', err.response.data);
      }
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
