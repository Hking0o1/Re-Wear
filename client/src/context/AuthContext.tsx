import React, { createContext, useState, type ReactNode } from 'react';
import type { User, AuthState } from '../types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@rewear.com',
    name: 'Admin User',
    points: 1000,
    joinedDate: new Date('2024-01-15'),
    isAdmin: true
  },
  {
    id: '2',
    email: 'sarah@example.com',
    name: 'Sarah Johnson',
    points: 250,
    joinedDate: new Date('2024-03-20')
  }
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoggedIn: false
  });

  const login = async (email: string, password: string): Promise<boolean> => {
    const user = mockUsers.find(u => u.email === email);
    if (user && password === 'password') {
      setAuthState({ user, isLoggedIn: true });
      return true;
    }
    return false;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      points: 100,
      joinedDate: new Date()
    };
    mockUsers.push(newUser);
    setAuthState({ user: newUser, isLoggedIn: true });
    return true;
  };

  const logout = () => {
    setAuthState({ user: null, isLoggedIn: false });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
