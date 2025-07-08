
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
  hasPermission: (permission: string) => boolean; // Add hasPermission function
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  loading: true,
  login: async () => {},
  logout: () => {},
  hasPermission: () => false, // Add default implementation
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
      if (email !== 'admin@myerssecurity.com' || password !== 'password') {
        throw new Error('Invalid email or password');
      }
      
      const mockUser: User = {
        id: '1',
        name: 'Admin User',
        email: 'admin@myerssecurity.com',
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

  // Implement hasPermission function
  const hasPermission = (permission: string): boolean => {
    // For demo purposes, let's implement a simple permission system
    // In a real application, this would check against user's roles and permissions
    if (!user) return false;
    
    // Admin has all permissions
    if (user.role === 'Administrator') return true;
    
    // Define common permissions based on role
    const rolePermissions: Record<string, string[]> = {
      'Administrator': ['users.read', 'users.write', 'dispensaries.read', 'dispensaries.write', 'serviceRequests.read', 'serviceRequests.write', 'roles.read', 'roles.write'],
      'Support Engineer': ['dispensaries.read', 'serviceRequests.read', 'serviceRequests.write'],
      'Manager': ['dispensaries.read', 'serviceRequests.read'],
    };
    
    // Check if the user's role has the required permission
    return rolePermissions[user.role]?.includes(permission) || false;
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      loading, 
      login, 
      logout,
      updateUserProfile,
      hasPermission
    }}>
      {children}
    </AuthContext.Provider>
  );
};
