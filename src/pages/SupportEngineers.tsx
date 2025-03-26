
import React, { useState } from 'react';
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
  name: string;
  email: string;
  specialization: string;
  region: string;
  status: 'available' | 'on-leave' | 'assigned';
  activeRequests: number;
  joinedDate: string;
}

const mockSupportEngineers: SupportEngineer[] = [
  {
    id: '1',
    name: 'James Wilson',
    email: 'james@myerssecurity.com',
    specialization: 'Hardware Installation',
    region: 'North',
    status: 'available',
    activeRequests: 0,
    joinedDate: '2023-01-10'
  },
  {
    id: '2',
    name: 'Emma Roberts',
    email: 'emma@myerssecurity.com',
    specialization: 'Software Troubleshooting',
    region: 'East',
    status: 'assigned',
    activeRequests: 3,
    joinedDate: '2023-03-15'
  },
  {
    id: '3',
    name: 'David Lee',
    email: 'david@myerssecurity.com',
    specialization: 'Network Configuration',
    region: 'West',
    status: 'on-leave',
    activeRequests: 0,
    joinedDate: '2023-02-22'
  },
  {
    id: '4',
    name: 'Lisa Chen',
    email: 'lisa@myerssecurity.com',
    specialization: 'Software Troubleshooting',
    region: 'South',
    status: 'assigned',
    activeRequests: 2,
    joinedDate: '2023-04-05'
  }
];

const SupportEngineers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEngineer, setEditingEngineer] = useState<SupportEngineer | null>(null);
  const [viewingEngineer, setViewingEngineer] = useState<SupportEngineer | null>(null);
  const { toast } = useToast();
  
  // In a real app, this would fetch from an API
  const { data: engineers = mockSupportEngineers } = useQuery({
    queryKey: ['supportEngineers'],
    queryFn: () => Promise.resolve(mockSupportEngineers),
    initialData: mockSupportEngineers,
  });
  
  const filteredEngineers = engineers.filter(engineer => 
    engineer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    engineer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    engineer.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    engineer.region.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const totalPages = Math.ceil(filteredEngineers.length / itemsPerPage);
  const paginatedEngineers = filteredEngineers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const handleAddEngineer = () => {
    setShowAddForm(true);
    setEditingEngineer(null);
  };
  
  const handleEditEngineer = (engineer: SupportEngineer) => {
    setEditingEngineer(engineer);
    setShowAddForm(true);
  };
  
  const handleViewEngineer = (engineer: SupportEngineer) => {
    setViewingEngineer(engineer);
  };
  
  const handleDeleteEngineer = (engineer: SupportEngineer) => {
    toast({
      title: "Engineer Deleted",
      description: `${engineer.name} has been deleted successfully.`,
    });
    // In a real application, you would call an API to delete the engineer
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
      
      {showAddForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{editingEngineer ? 'Edit Support Engineer' : 'Add New Support Engineer'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">Name</label>
                  <Input 
                    id="name" 
                    placeholder="Enter name" 
                    defaultValue={editingEngineer?.name || ''}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">Email</label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="Enter email" 
                    defaultValue={editingEngineer?.email || ''}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="specialization" className="text-sm font-medium">Specialization</label>
                  <select 
                    id="specialization" 
                    className="w-full px-3 py-2 border rounded-md"
                    defaultValue={editingEngineer?.specialization || ''}
                  >
                    <option value="">Select Specialization</option>
                    <option value="Hardware Installation">Hardware Installation</option>
                    <option value="Software Troubleshooting">Software Troubleshooting</option>
                    <option value="Network Configuration">Network Configuration</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="region" className="text-sm font-medium">Region</label>
                  <select 
                    id="region" 
                    className="w-full px-3 py-2 border rounded-md"
                    defaultValue={editingEngineer?.region || ''}
                  >
                    <option value="">Select Region</option>
                    <option value="North">North</option>
                    <option value="South">South</option>
                    <option value="East">East</option>
                    <option value="West">West</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="status" className="text-sm font-medium">Status</label>
                  <select 
                    id="status" 
                    className="w-full px-3 py-2 border rounded-md"
                    defaultValue={editingEngineer?.status || 'available'}
                  >
                    <option value="available">Available</option>
                    <option value="assigned">Assigned</option>
                    <option value="on-leave">On Leave</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="bg-myers-yellow text-myers-darkBlue hover:bg-yellow-400"
                  onClick={() => {
                    toast({
                      title: `Engineer ${editingEngineer ? 'Updated' : 'Created'}`,
                      description: `Engineer has been ${editingEngineer ? 'updated' : 'created'} successfully.`,
                    });
                    setShowAddForm(false);
                  }}
                >
                  {editingEngineer ? 'Update' : 'Create'} Engineer
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
      
      <Card>
        <CardHeader className="pb-2">
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
                      <TableCell className="font-medium">{engineer.name}</TableCell>
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
                  <p className="mt-1">{viewingEngineer.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <p className="mt-1">{viewingEngineer.email}</p>
                </div>
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
