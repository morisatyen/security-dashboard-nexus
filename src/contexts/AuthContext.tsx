
import React, { createContext, useContext, useState, useEffect } from 'react';

// Add bio, phone and location to the user type
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  bio?: string;
  phone?: string;
  location?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserProfile?: (updatedUser: User) => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  loading: true,
  login: async () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // In a real application, this would verify the token with your API
        const storedUser = localStorage.getItem('user');
        
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Authentication error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // In a real application, this would call your API
      // For the sake of this demo, we'll just simulate a successful login
      
      // Check if email and password are provided
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      
      // Demo user credentials check
      if (email !== 'admin@example.com' || password !== 'password') {
        throw new Error('Invalid email or password');
      }
      
      const mockUser: User = {
        id: '1',
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'Administrator',
        bio: 'Security specialist with over 5 years of experience in the cannabis industry.',
        phone: '+1 (555) 123-4567',
        location: 'Denver, CO'
      };
      
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  // Add function to update user profile
  const updateUserProfile = (updatedUser: User) => {
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      loading, 
      login, 
      logout,
      updateUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};
