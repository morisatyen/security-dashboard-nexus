
import { format } from 'date-fns';

// Format date to readable string
export const formatDate = (dateString: string): string => {
  try {
    return format(new Date(dateString), 'PPP');
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

// Format date with time
export const formatDateTime = (dateString: string): string => {
  try {
    return format(new Date(dateString), 'PPp');
  } catch (error) {
    console.error('Error formatting date time:', error);
    return 'Invalid date';
  }
};

// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// Generate unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Debounce function for search inputs
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

// Get initials from name
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

// Truncate text with ellipsis
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

// Status badge color mapper
export const getStatusColor = (status: string): string => {
  const statusMap: Record<string, string> = {
    // Dispensary status
    'open': 'bg-green-500',
    'closed': 'bg-red-500',
    'maintenance': 'bg-amber-500',
    
    // User status
    'active': 'bg-green-500',
    'inactive': 'bg-gray-500',
    
    // Service request status
    'pending': 'bg-amber-500',
    'in-progress': 'bg-blue-500',
    'resolved': 'bg-green-500',
    
    // Invoice status
    'paid': 'bg-green-500',
    'overdue': 'bg-red-500',
    
    // Priority
    'low': 'bg-blue-500',
    'medium': 'bg-amber-500',
    'high': 'bg-red-500',
  };
  
  return statusMap[status] || 'bg-gray-500';
};
