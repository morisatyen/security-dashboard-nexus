
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumb: React.FC = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(segment => segment);
  
  // Map of paths to readable names
  const pathMap: Record<string, string> = {
    'dashboard': 'Dashboard',
    'users': 'Users',
    'dispensaries': 'Customers',
    'service-requests': 'Service Requests',
    'admin-users': 'Admin Users',
    'support-engineers': 'Support Engineers',
    'invoices': 'Invoices',
    'add': 'Add',
    'edit': 'Edit',
    'view': 'View',
  };
  
  return (
    <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="flex items-center flex-wrap gap-y-2">
          <li className="flex items-center">
            <Link 
              to="/dashboard" 
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 flex items-center"
            >
              <Home className="h-4 w-4" />
              <span className="sr-only">Home</span>
            </Link>
          </li>
          
          {pathSegments.map((segment, index) => {
            const url = `/${pathSegments.slice(0, index + 1).join('/')}`;
            const isLast = index === pathSegments.length - 1;
            
            return (
              <li key={segment} className="flex items-center">
                <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
                {isLast ? (
                  <span className="font-medium text-gray-900 dark:text-white">
                    {pathMap[segment] || segment}
                  </span>
                ) : (
                  <Link 
                    to={url} 
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    {pathMap[segment] || segment}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
