
import React, { useEffect, useState } from 'react';
import { 
  Users, 
  Store, 
  TicketCheck, 
  FileText, 
  TrendingUp, 
  TrendingDown,
  AlertCircle
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { formatCurrency } from '../utils/helpers';

// Type definitions
interface DashboardCounts {
  users: number;
  activeUsers: number;
  dispensaries: number;
  openDispensaries: number;
  serviceRequests: number;
  pendingRequests: number;
  invoices: number;
  paidInvoices: number;
  totalRevenue: number;
}

const Dashboard: React.FC = () => {
  const [counts, setCounts] = useState<DashboardCounts>({
    users: 0,
    activeUsers: 0,
    dispensaries: 0,
    openDispensaries: 0,
    serviceRequests: 0,
    pendingRequests: 0,
    invoices: 0,
    paidInvoices: 0,
    totalRevenue: 0
  });
  
  const [requestsData, setRequestsData] = useState<{ name: string; value: number }[]>([]);
  const [invoicesData, setInvoicesData] = useState<{ name: string; value: number }[]>([]);
  
  useEffect(() => {
    // Load data from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const dispensaries = JSON.parse(localStorage.getItem('dispensaries') || '[]');
    const serviceRequests = JSON.parse(localStorage.getItem('serviceRequests') || '[]');
    const invoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    
    // Calculate counts
    const activeUsers = users.filter((user: any) => user.status === 'active').length;
    const openDispensaries = dispensaries.filter((d: any) => d.status === 'open').length;
    const pendingRequests = serviceRequests.filter((r: any) => r.status === 'pending').length;
    const paidInvoices = invoices.filter((i: any) => i.status === 'paid').length;
    const totalRevenue = invoices.reduce((acc: number, invoice: any) => {
      return acc + (invoice.status === 'paid' ? invoice.amount : 0);
    }, 0);
    
    setCounts({
      users: users.length,
      activeUsers,
      dispensaries: dispensaries.length,
      openDispensaries,
      serviceRequests: serviceRequests.length,
      pendingRequests,
      invoices: invoices.length,
      paidInvoices,
      totalRevenue
    });
    
    // Prepare chart data
    const requestStatusCounts = {
      pending: serviceRequests.filter((r: any) => r.status === 'pending').length,
      'in-progress': serviceRequests.filter((r: any) => r.status === 'in-progress').length,
      resolved: serviceRequests.filter((r: any) => r.status === 'resolved').length,
    };
    
    setRequestsData([
      { name: 'Pending', value: requestStatusCounts.pending },
      { name: 'In Progress', value: requestStatusCounts['in-progress'] },
      { name: 'Resolved', value: requestStatusCounts.resolved },
    ]);
    
    const invoiceStatusCounts = {
      pending: invoices.filter((i: any) => i.status === 'pending').length,
      paid: invoices.filter((i: any) => i.status === 'paid').length,
      overdue: invoices.filter((i: any) => i.status === 'overdue').length,
    };
    
    setInvoicesData([
      { name: 'Pending', value: invoiceStatusCounts.pending },
      { name: 'Paid', value: invoiceStatusCounts.paid },
      { name: 'Overdue', value: invoiceStatusCounts.overdue },
    ]);
    
  }, []);
  
  // Colors for the pie charts
  const COLORS = ['#FFB020', '#3E79F7', '#10B981', '#F04438'];
  
  // Monthly revenue data (mocked)
  const revenueData = [
    { month: 'Jan', revenue: 4500 },
    { month: 'Feb', revenue: 5200 },
    { month: 'Mar', revenue: 4800 },
    { month: 'Apr', revenue: 6000 },
    { month: 'May', revenue: 5700 },
    { month: 'Jun', revenue: 6500 },
  ];
  
  const statCards = [
    {
      title: 'Total Users',
      count: counts.users,
      active: counts.activeUsers,
      icon: <Users className="h-12 w-12 text-blue-600 dark:text-blue-400" />,
      activeLabel: 'Active Users',
      color: 'blue'
    },
    {
      title: 'Cutomers',
      count: counts.dispensaries,
      active: counts.openDispensaries,
      icon: <Store className="h-12 w-12 text-green-600 dark:text-green-400" />,
      activeLabel: 'Open Dispensaries',
      color: 'green'
    },
    {
      title: 'Service Requests',
      count: counts.serviceRequests,
      active: counts.pendingRequests,
      icon: <TicketCheck className="h-12 w-12 text-yellow-600 dark:text-yellow-400" />,
      activeLabel: 'Pending Requests',
      color: 'yellow'
    },
    {
      title: 'Invoices',
      count: counts.invoices,
      active: counts.paidInvoices,
      icon: <FileText className="h-12 w-12 text-purple-600 dark:text-purple-400" />,
      activeLabel: 'Paid Invoices',
      color: 'purple'
    },
  ];
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome to Myers Security admin dashboard</p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div 
            key={index} 
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg overflow-hidden relative card-hover"
          >
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{card.title}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{card.count}</p>
                <div className="flex items-center mt-3">
                  <div className={`text-xs font-medium px-2 py-1 rounded-full flex items-center 
                    ${card.title === 'Service Requests' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' : 
                    `bg-${card.color}-100 text-${card.color}-800 dark:bg-${card.color}-900/30 dark:text-${card.color}-300`}`}
                  >
                    {card.title === 'Service Requests' ? (
                      <AlertCircle className="w-3 h-3 mr-1" />
                    ) : (
                      <TrendingUp className="w-3 h-3 mr-1" />
                    )}
                    {card.active} {card.activeLabel}
                  </div>
                </div>
              </div>
              <div className="flex items-start">
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Revenue Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Revenue Overview</h2>
            <div className="text-sm text-gray-500 dark:text-gray-400">Past 6 months</div>
          </div>
          
          <div className="flex items-center mb-6">
            <div className="mr-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(counts.totalRevenue)}</p>
            </div>
            <div className="px-3 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 text-xs font-medium flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              +12% from last month
            </div>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={revenueData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#9CA3AF' }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#9CA3AF' }} 
                  tickFormatter={(value) => `$${value}`} 
                />
                <Tooltip 
                  formatter={(value: any) => [`$${value}`, 'Revenue']} 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                    borderColor: '#E5E7EB',
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar 
                  dataKey="revenue" 
                  fill="#FEF001" 
                  radius={[4, 4, 0, 0]} 
                  barSize={35}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Status charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Service Requests by Status */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Service Requests by Status</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={requestsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {requestsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip formatter={(value: any) => [`${value}`, 'Requests']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Invoices by Status */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Invoices by Status</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={invoicesData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {invoicesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip formatter={(value: any) => [`${value}`, 'Invoices']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
