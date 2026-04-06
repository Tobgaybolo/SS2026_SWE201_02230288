// auth.tsx
import React, { createContext, useContext, useState } from 'react';

// Define the shape of auth context data
interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isSignedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Step 1: CREATE CONTEXT
// createContext() creates a context object for authentication data
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Step 2: CREATE CUSTOM HOOK WITH useContext()
// useContext() accesses the context value from the nearest AuthProvider
// This custom hook allows components to easily access auth data
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Step 3: CREATE PROVIDER COMPONENT
// The Provider component wraps the app and provides the context value to all children
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock user data
      const mockUser: User = {
        id: '123',
        email,
        name: email.split('@')[0],
      };
      setUser(mockUser);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock user data
      const mockUser: User = {
        id: Math.random().toString(),
        email,
        name,
      };
      setUser(mockUser);
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Create the context value object with user data and auth functions
  const value: AuthContextType = {
    user,
    isLoading,
    isSignedIn: user !== null,
    login,
    signup,
    logout,
  };

  // Provide the context value to all child components
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
