
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Role, User, initialUsers } from '../data/initialData';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  hasPermission: (permission: PermissionType) => boolean;
}

type PermissionType = 
  | 'users.create' 
  | 'users.read' 
  | 'users.update' 
  | 'users.delete'
  | 'roles.create'
  | 'roles.read'
  | 'roles.update'
  | 'roles.delete'
  | 'dispensaries.create'
  | 'dispensaries.read'
  | 'dispensaries.update'
  | 'dispensaries.delete'
  | 'serviceRequests.create'
  | 'serviceRequests.read'
  | 'serviceRequests.update'
  | 'serviceRequests.delete'
  | 'invoices.create'
  | 'invoices.read'
  | 'invoices.update'
  | 'invoices.delete';

// Role-based permissions map
const rolePermissions: Record<Role, PermissionType[]> = {
  admin: [
    'users.create', 'users.read', 'users.update', 'users.delete',
    'roles.create', 'roles.read', 'roles.update', 'roles.delete',
    'dispensaries.create', 'dispensaries.read', 'dispensaries.update', 'dispensaries.delete',
    'serviceRequests.create', 'serviceRequests.read', 'serviceRequests.update', 'serviceRequests.delete',
    'invoices.create', 'invoices.read', 'invoices.update', 'invoices.delete'
  ],
  manager: [
    'users.create', 'users.read', 'users.update', 
    'roles.read',
    'dispensaries.create', 'dispensaries.read', 'dispensaries.update',
    'serviceRequests.create', 'serviceRequests.read', 'serviceRequests.update',
    'invoices.create', 'invoices.read', 'invoices.update'
  ],
  user: [
    'users.read',
    'roles.read',
    'dispensaries.read',
    'serviceRequests.read',
    'invoices.read'
  ]
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (from localStorage)
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // In a real app, this would make an API call to validate credentials
    // For this demo, we'll just check against our static users
    // Note: In a real app, passwords would be hashed and not stored in plain text
    
    // For demo purposes, any password works with existing emails
    const usersFromStorage = localStorage.getItem('users');
    const users = usersFromStorage ? JSON.parse(usersFromStorage) : initialUsers;
    
    const foundUser = users.find((u: User) => u.email === email && u.status === 'active');
    
    if (foundUser && password.length > 0) {
      setUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const hasPermission = (permission: PermissionType): boolean => {
    if (!user) return false;
    return rolePermissions[user.role].includes(permission);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        login, 
        logout, 
        isAuthenticated: !!user,
        hasPermission 
      }}
    >
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
