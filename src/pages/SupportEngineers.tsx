
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Plus, Search, Edit, Trash, Eye } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious,
  PaginationEllipsis
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface SupportEngineer {
  id: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  specialization: string;
  region: string;
  status: 'available' | 'on-leave' | 'assigned';
  activeRequests: number;
  joinedDate: string;
  phone?: string;
}

// Mock data for initial load
const mockSupportEngineers: SupportEngineer[] = [
  {
    id: '1',
    firstName: 'James',
    lastName: 'Wilson',
    name: 'James Wilson',
    email: 'james@myerssecurity.com',
    phone: '555-123-4567',
    specialization: 'Hardware Installation',
    region: 'North',
    status: 'available',
    activeRequests: 0,
    joinedDate: '2023-01-10'
  },
  {
    id: '2',
    firstName: 'Emma',
    lastName: 'Roberts',
    name: 'Emma Roberts',
    email: 'emma@myerssecurity.com',
    phone: '555-987-6543',
    specialization: 'Software Troubleshooting',
    region: 'East',
    status: 'assigned',
    activeRequests: 3,
    joinedDate: '2023-03-15'
  },
  {
    id: '3',
    firstName: 'David',
    lastName: 'Lee',
    name: 'David Lee',
    email: 'david@myerssecurity.com',
    phone: '555-456-7890',
    specialization: 'Network Configuration',
    region: 'West',
    status: 'on-leave',
    activeRequests: 0,
    joinedDate: '2023-02-22'
  },
  {
    id: '4',
    firstName: 'Lisa',
    lastName: 'Chen',
    name: 'Lisa Chen',
    email: 'lisa@myerssecurity.com',
    phone: '555-789-0123',
    specialization: 'Software Troubleshooting',
    region: 'South',
    status: 'assigned',
    activeRequests: 2,
    joinedDate: '2023-04-05'
  }
];

// Initialize localStorage if not already set
const initializeLocalStorage = () => {
  if (!localStorage.getItem('supportEngineers')) {
    localStorage.setItem('supportEngineers', JSON.stringify(mockSupportEngineers));
  }
};

const SupportEngineers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [viewingEngineer, setViewingEngineer] = useState<SupportEngineer | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [regionFilter, setRegionFilter] = useState<string>('');
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Initialize localStorage when component mounts
  useEffect(() => {
    initializeLocalStorage();
  }, []);
  
  // CRUD Operations with localStorage
  const { data: engineers = [], refetch } = useQuery({
    queryKey: ['supportEngineers'],
    queryFn: () => {
      const storedData = localStorage.getItem('supportEngineers');
      return Promise.resolve(storedData ? JSON.parse(storedData) : mockSupportEngineers);
    },
  });
  
  const filteredEngineers = engineers.filter(engineer => {
    const engineerName = engineer.name || `${engineer.firstName} ${engineer.lastName}`;
    const matchesSearch = 
      engineerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      engineer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      engineer.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      engineer.region.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter ? engineer.status === statusFilter : true;
    const matchesRegion = regionFilter ? engineer.region === regionFilter : true;
    
    return matchesSearch && matchesStatus && matchesRegion;
  });
  
  const totalPages = Math.ceil(filteredEngineers.length / itemsPerPage);
  const paginatedEngineers = filteredEngineers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const handleAddEngineer = () => {
    navigate('/users/support-engineers/add');
  };
  
  const handleEditEngineer = (engineer: SupportEngineer) => {
    navigate(`/users/support-engineers/edit/${engineer.id}`);
  };
  
  const handleViewEngineer = (engineer: SupportEngineer) => {
    setViewingEngineer(engineer);
  };
  
  const handleDeleteEngineer = (engineer: SupportEngineer) => {
    const confirmed = window.confirm(`Are you sure you want to delete ${engineer.name || `${engineer.firstName} ${engineer.lastName}`}?`);
    
    if (confirmed) {
      const updatedEngineers = engineers.filter(e => e.id !== engineer.id);
      localStorage.setItem('supportEngineers', JSON.stringify(updatedEngineers));
      refetch();
      
      toast({
        title: "Engineer Deleted",
        description: `${engineer.name || `${engineer.firstName} ${engineer.lastName}`} has been deleted successfully.`,
      });
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'assigned':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'on-leave':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default:
        return '';
    }
  };
  
  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxDisplayedPages = 5;
    
    if (totalPages <= maxDisplayedPages) {
      // If we have fewer pages than the max, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);
      
      // Calculate start and end of displayed page range
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust if at the beginning
      if (currentPage <= 2) {
        endPage = 3;
      }
      
      // Adjust if at the end
      if (currentPage >= totalPages - 1) {
        startPage = totalPages - 2;
      }
      
      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pageNumbers.push('ellipsis-start');
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push('ellipsis-end');
      }
      
      // Always show last page
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Support Engineers</h1>
        <Button onClick={handleAddEngineer} className="bg-myers-yellow text-myers-darkBlue hover:bg-yellow-400">
          <Plus className="h-4 w-4 mr-2" />
          Add Support Engineer
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle>Support Engineers List</CardTitle>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search engineers..."
                  className="pl-8 w-full sm:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <div>
                <select
                  className="px-3 py-2 rounded-md border text-sm"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All Statuses</option>
                  <option value="available">Available</option>
                  <option value="assigned">Assigned</option>
                  <option value="on-leave">On Leave</option>
                </select>
              </div>
              
              <div>
                <select
                  className="px-3 py-2 rounded-md border text-sm"
                  value={regionFilter}
                  onChange={(e) => setRegionFilter(e.target.value)}
                >
                  <option value="">All Regions</option>
                  <option value="North">North</option>
                  <option value="South">South</option>
                  <option value="East">East</option>
                  <option value="West">West</option>
                </select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Specialization</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Active Requests</TableHead>
                  <TableHead>Joined Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedEngineers.length > 0 ? (
                  paginatedEngineers.map((engineer) => (
                    <TableRow key={engineer.id}>
                      <TableCell className="font-medium">
                        {engineer.name || `${engineer.firstName} ${engineer.lastName}`}
                      </TableCell>
                      <TableCell>{engineer.email}</TableCell>
                      <TableCell>{engineer.specialization}</TableCell>
                      <TableCell>{engineer.region}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline"
                          className={getStatusColor(engineer.status)}
                        >
                          {engineer.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{engineer.activeRequests}</TableCell>
                      <TableCell>{engineer.joinedDate}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleViewEngineer(engineer)}
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleEditEngineer(engineer)}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDeleteEngineer(engineer)}
                          >
                            <Trash className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                      No support engineers found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between">
            <div className="mb-4 sm:mb-0">
              <span className="text-sm text-muted-foreground mr-2">Items per page:</span>
              <select 
                className="px-2 py-1 border rounded text-sm"
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1); // Reset to first page when changing items per page
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
            
            {filteredEngineers.length > 0 && (
              <div className="flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                    
                    {getPageNumbers().map((pageNumber, index) => (
                      <PaginationItem key={`${pageNumber}-${index}`}>
                        {pageNumber === 'ellipsis-start' || pageNumber === 'ellipsis-end' ? (
                          <PaginationEllipsis />
                        ) : (
                          <PaginationLink
                            isActive={currentPage === pageNumber}
                            onClick={() => setCurrentPage(Number(pageNumber))}
                          >
                            {pageNumber}
                          </PaginationLink>
                        )}
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* View Engineer Dialog */}
      <Dialog open={!!viewingEngineer} onOpenChange={(open) => !open && setViewingEngineer(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Support Engineer Details</DialogTitle>
          </DialogHeader>
          {viewingEngineer && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-2">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Name</h3>
                  <p className="mt-1">
                    {viewingEngineer.name || `${viewingEngineer.firstName} ${viewingEngineer.lastName}`}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <p className="mt-1">{viewingEngineer.email}</p>
                </div>
                {viewingEngineer.phone && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                    <p className="mt-1">{viewingEngineer.phone}</p>
                  </div>
                )}
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Specialization</h3>
                  <p className="mt-1">{viewingEngineer.specialization}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Region</h3>
                  <p className="mt-1">{viewingEngineer.region}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <Badge 
                    variant="outline"
                    className={getStatusColor(viewingEngineer.status)}
                  >
                    {viewingEngineer.status}
                  </Badge>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Active Requests</h3>
                  <p className="mt-1">{viewingEngineer.activeRequests}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Joined Date</h3>
                  <p className="mt-1">{viewingEngineer.joinedDate}</p>
                </div>
              </div>
              <div className="flex justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => setViewingEngineer(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SupportEngineers;
