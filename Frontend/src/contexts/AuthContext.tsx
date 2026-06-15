import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';




export type UserRole = 'client' | 'mistri' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  profileImage?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string, role: UserRole, phone?: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Check for hardcoded admin credentials
      if (email === 'admin@gmail.com' && password === '1234') {
        const adminUser: User = {
          id: 'admin-001',
          email: 'admin@gmail.com',
          name: 'Admin',
          role: 'admin',
          createdAt: new Date().toISOString()
        };
        setUser(adminUser);
        localStorage.setItem('currentUser', JSON.stringify(adminUser));
        return true;
      }

      // Check for hardcoded mistri credentials
      if (email === 'mistri@gmail.com' && password === '1234') {
        const mistriUser: User = {
          id: 'mistri-demo',
          email: 'mistri@gmail.com',
          name: 'Demo Mistri',
          role: 'mistri',
          phone: '03001234567',
          createdAt: new Date().toISOString()
        };
        setUser(mistriUser);
        localStorage.setItem('currentUser', JSON.stringify(mistriUser));
        return true;
      }

      // Check for hardcoded client credentials
      if (email === 'client@gmail.com' && password === '1234') {
        const clientUser: User = {
          id: 'client-demo',
          email: 'client@gmail.com',
          name: 'Demo Client',
          role: 'client',
          phone: '03009876543',
          createdAt: new Date().toISOString()
        };
        setUser(clientUser);
        localStorage.setItem('currentUser', JSON.stringify(clientUser));
        return true;
      }

      // Get all users from localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Find user with matching credentials
      const foundUser = users.find(
        (u: any) => u.email === email && u.password === password
      );

      if (foundUser) {
        const { password: _, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const signup = async (
    email: string,
    password: string,
    name: string,
    role: UserRole,
    phone?: string
  ): Promise<boolean> => {
    try {
      // Get existing users
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Check if user already exists
      if (users.find((u: any) => u.email === email)) {
        return false;
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        email,
        password,
        name,
        role,
        phone,
        createdAt: new Date().toISOString()
      };

      // Save to users array
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));

      // Auto-login after signup
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));

      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;

    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));

    // Update in users array
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex((u: any) => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updates };
      localStorage.setItem('users', JSON.stringify(users));
    }
  };

  const value: AuthContextType = {
    user,
    login,
    signup,
    logout,
    updateUser,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
