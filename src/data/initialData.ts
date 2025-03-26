
export type Role = 'admin' | 'manager' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface Dispensary {
  id: string;
  name: string;
  address: string;
  category: 'retail' | 'medical' | 'hybrid';
  status: 'open' | 'closed' | 'maintenance';
  supportEngineerId: string;
  createdAt: string;
}

export interface ServiceRequest {
  id: string;
  dispensaryId: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'resolved';
  assignedToId: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface Invoice {
  id: string;
  dispensaryId: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
  dueDate: string;
  createdAt: string;
  paidAt?: string;
}

// Initial Users
export const initialUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@myers.security',
    role: 'admin',
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Manager User',
    email: 'manager@myers.security',
    role: 'manager',
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Regular User',
    email: 'user@myers.security',
    role: 'user',
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'John Engineer',
    email: 'john@myers.security',
    role: 'user',
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Sarah Support',
    email: 'sarah@myers.security',
    role: 'user',
    status: 'active',
    createdAt: new Date().toISOString(),
  },
];

// Initial Dispensaries
export const initialDispensaries: Dispensary[] = [
  {
    id: '1',
    name: 'Green Leaf Dispensary',
    address: '123 Main St, Anytown, CA',
    category: 'retail',
    status: 'open',
    supportEngineerId: '4',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Medical Care Cannabis',
    address: '456 Oak Ave, Somewhere, CA',
    category: 'medical',
    status: 'open',
    supportEngineerId: '5',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Hybrid Solutions',
    address: '789 Pine Rd, Nowhere, CA',
    category: 'hybrid',
    status: 'maintenance',
    supportEngineerId: '4',
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Nature\'s Remedy',
    address: '101 River St, Othertown, CA',
    category: 'retail',
    status: 'closed',
    supportEngineerId: '5',
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Wellness Cannabis Center',
    address: '202 Mountain Blvd, Summit, CA',
    category: 'medical',
    status: 'open',
    supportEngineerId: '4',
    createdAt: new Date().toISOString(),
  },
];

// Initial Service Requests
export const initialServiceRequests: ServiceRequest[] = [
  {
    id: '1',
    dispensaryId: '1',
    title: 'POS System Offline',
    description: 'The point of sale system is not connecting to the network.',
    priority: 'high',
    status: 'pending',
    assignedToId: '4',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    dispensaryId: '2',
    title: 'Security Camera Installation',
    description: 'Need to install 3 new security cameras in the storage area.',
    priority: 'medium',
    status: 'in-progress',
    assignedToId: '5',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    dispensaryId: '3',
    title: 'Door Lock Maintenance',
    description: 'The electronic door lock needs to be recalibrated.',
    priority: 'low',
    status: 'resolved',
    assignedToId: '4',
    createdAt: new Date().toISOString(),
    resolvedAt: new Date().toISOString(),
  },
  {
    id: '4',
    dispensaryId: '1',
    title: 'Alarm System False Alerts',
    description: 'The alarm system is triggering false alerts every night at 2 AM.',
    priority: 'high',
    status: 'in-progress',
    assignedToId: '5',
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    dispensaryId: '4',
    title: 'Network Connectivity Issues',
    description: 'WiFi keeps dropping in the retail area.',
    priority: 'medium',
    status: 'pending',
    assignedToId: '4',
    createdAt: new Date().toISOString(),
  },
];

// Initial Invoices
export const initialInvoices: Invoice[] = [
  {
    id: '1',
    dispensaryId: '1',
    amount: 1250.99,
    status: 'paid',
    dueDate: new Date(new Date().setDate(new Date().getDate() - 15)).toISOString(),
    createdAt: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString(),
    paidAt: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(),
  },
  {
    id: '2',
    dispensaryId: '2',
    amount: 2100.50,
    status: 'pending',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 15)).toISOString(),
    createdAt: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
  },
  {
    id: '3',
    dispensaryId: '3',
    amount: 899.99,
    status: 'overdue',
    dueDate: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(),
    createdAt: new Date(new Date().setDate(new Date().getDate() - 40)).toISOString(),
  },
  {
    id: '4',
    dispensaryId: '4',
    amount: 499.99,
    status: 'paid',
    dueDate: new Date(new Date().setDate(new Date().getDate() - 20)).toISOString(),
    createdAt: new Date(new Date().setDate(new Date().getDate() - 50)).toISOString(),
    paidAt: new Date(new Date().setDate(new Date().getDate() - 18)).toISOString(),
  },
  {
    id: '5',
    dispensaryId: '5',
    amount: 1500.00,
    status: 'pending',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString(),
    createdAt: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
  },
];

export const getInitialData = () => {
  // Check if data exists in localStorage
  const users = localStorage.getItem('users');
  const dispensaries = localStorage.getItem('dispensaries');
  const serviceRequests = localStorage.getItem('serviceRequests');
  const invoices = localStorage.getItem('invoices');

  // If not, initialize with default data
  if (!users) {
    localStorage.setItem('users', JSON.stringify(initialUsers));
  }
  
  if (!dispensaries) {
    localStorage.setItem('dispensaries', JSON.stringify(initialDispensaries));
  }
  
  if (!serviceRequests) {
    localStorage.setItem('serviceRequests', JSON.stringify(initialServiceRequests));
  }
  
  if (!invoices) {
    localStorage.setItem('invoices', JSON.stringify(initialInvoices));
  }

  return {
    users: users ? JSON.parse(users) : initialUsers,
    dispensaries: dispensaries ? JSON.parse(dispensaries) : initialDispensaries,
    serviceRequests: serviceRequests ? JSON.parse(serviceRequests) : initialServiceRequests,
    invoices: invoices ? JSON.parse(invoices) : initialInvoices,
  };
};
