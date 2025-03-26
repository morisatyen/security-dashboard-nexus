import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Search, Edit, Trash, Calendar, User, Eye } from 'lucide-react';
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

interface Dispensary {
  id: string;
  name: string;
  location: string;
  category: string;
  status: 'open' | 'under-maintenance' | 'closed';
  assignedEngineer: string | null;
  lastServiceDate: string | null;
  createdAt: string;
}

const mockDispensaries: Dispensary[] = [
  {
    id: '1',
    name: 'Downtown Dispensary',
    location: '123 Main St, Seattle, WA',
    category: 'Recreational',
    status: 'open',
    assignedEngineer: 'Emma Roberts',
    lastServiceDate: '2023-10-15',
    createdAt: '2023-01-05'
  },
  {
    id: '2',
    name: 'Green Leaf Dispensary',
    location: '456 Oak Ave, Portland, OR',
    category: 'Medical',
    status: 'under-maintenance',
    assignedEngineer: 'James Wilson',
    lastServiceDate: '2023-11-02',
    createdAt: '2023-02-12'
  },
  {
    id: '3',
    name: 'Herbal Solutions',
    location: '789 Pine St, Denver, CO',
    category: 'Recreational',
    status: 'closed',
    assignedEngineer: null,
    lastServiceDate: '2023-09-20',
    createdAt: '2023-03-18'
  },
  {
    id: '4',
    name: 'Healing Center',
    location: '101 Maple Rd, San Francisco, CA',
    category: 'Medical',
    status: 'open',
    assignedEngineer: 'Lisa Chen',
    lastServiceDate: '2023-10-25',
    createdAt: '2023-04-22'
  },
  {
    id: '5',
    name: 'Evergreen Dispensary',
    location: '202 Cedar Blvd, Las Vegas, NV',
    category: 'Recreational',
    status: 'open',
    assignedEngineer: 'David Lee',
    lastServiceDate: '2023-11-05',
    createdAt: '2023-05-01'
  },
  {
    id: '6',
    name: 'Wellness Dispensary',
    location: '303 Pine Ave, Chicago, IL',
    category: 'Medical',
    status: 'open',
    assignedEngineer: 'Emma Roberts',
    lastServiceDate: '2023-11-10',
    createdAt: '2023-06-15'
  },
  {
    id: '7',
    name: 'Green Zone',
    location: '404 Elm St, Boston, MA',
    category: 'Recreational',
    status: 'under-maintenance',
    assignedEngineer: 'James Wilson',
    lastServiceDate: '2023-11-08',
    createdAt: '2023-07-22'
  },
  {
    id: '8',
    name: "Nature's Remedy",
    location: '505 Oak Blvd, Austin, TX',
    category: 'Medical',
    status: 'closed',
    assignedEngineer: null,
    lastServiceDate: '2023-10-30',
    createdAt: '2023-08-05'
  }
];

const supportEngineers = [
  { id: '1', name: 'James Wilson' },
  { id: '2', name: 'Emma Roberts' },
  { id: '3', name: 'David Lee' },
  { id: '4', name: 'Lisa Chen' }
];

const initializeLocalStorage = () => {
  if (!localStorage.getItem('dispensaries')) {
    localStorage.setItem('dispensaries', JSON.stringify(mockDispensaries));
  }
};

initializeLocalStorage();

const Dispensaries: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingDispensary, setEditingDispensary] = useState<Dispensary | null>(null);
  const [viewingDispensary, setViewingDispensary] = useState<Dispensary | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const { toast } = useToast();
  
  const { data: dispensaries = [], refetch } = useQuery({
    queryKey: ['dispensaries'],
    queryFn: () => {
      const storedData = localStorage.getItem('dispensaries');
      return Promise.resolve(storedData ? JSON.parse(storedData) : mockDispensaries);
    },
  });
  
  const filteredDispensaries = dispensaries.filter(dispensary => {
    const matchesSearch = 
      dispensary.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispensary.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (dispensary.assignedEngineer?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    
    const matchesStatus = statusFilter ? dispensary.status === statusFilter : true;
    const matchesCategory = categoryFilter ? dispensary.category === categoryFilter : true;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });
  
  const totalPages = Math.ceil(filteredDispensaries.length / itemsPerPage);
  const paginatedDispensaries = filteredDispensaries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const handleAddDispensary = () => {
    setShowAddForm(true);
    setEditingDispensary(null);
  };
  
  const handleEditDispensary = (dispensary: Dispensary) => {
    setEditingDispensary(dispensary);
    setShowAddForm(true);
  };

  const handleViewDispensary = (dispensary: Dispensary) => {
    setViewingDispensary(dispensary);
  };
  
  const handleDeleteDispensary = (dispensary: Dispensary) => {
    const updatedDispensaries = dispensaries.filter(d => d.id !== dispensary.id);
    localStorage.setItem('dispensaries', JSON.stringify(updatedDispensaries));
    refetch();
    
    toast({
      title: "Dispensary Deleted",
      description: `${dispensary.name} has been deleted successfully.`,
    });
  };

  const handleSaveDispensary = (formData: FormData) => {
    const name = formData.get('name') as string;
    const location = formData.get('location') as string;
    const category = formData.get('category') as string;
    const status = formData.get('status') as 'open' | 'under-maintenance' | 'closed';
    const assignedEngineer = formData.get('assignedEngineer') as string;
    const lastServiceDate = formData.get('lastServiceDate') as string;

    if (editingDispensary) {
      const updatedDispensaries = dispensaries.map(d => 
        d.id === editingDispensary.id 
          ? {
              ...d,
              name,
              location,
              category,
              status,
              assignedEngineer: assignedEngineer || null,
              lastServiceDate: lastServiceDate || null
            } 
          : d
      );
      localStorage.setItem('dispensaries', JSON.stringify(updatedDispensaries));
      toast({
        title: "Dispensary Updated",
        description: `${name} has been updated successfully.`,
      });
    } else {
      const newDispensary: Dispensary = {
        id: Date.now().toString(),
        name,
        location,
        category,
        status,
        assignedEngineer: assignedEngineer || null,
        lastServiceDate: lastServiceDate || null,
        createdAt: new Date().toISOString().split('T')[0]
      };
      const updatedDispensaries = [...dispensaries, newDispensary];
      localStorage.setItem('dispensaries', JSON.stringify(updatedDispensaries));
      toast({
        title: "Dispensary Created",
        description: `${name} has been created successfully.`,
      });
    }
    
    setShowAddForm(false);
    refetch();
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'under-maintenance':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'closed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return '';
    }
  };
  
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'open':
        return 'Open';
      case 'under-maintenance':
        return 'Under Maintenance';
      case 'closed':
        return 'Closed';
      default:
        return status;
    }
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxDisplayedPages = 5;
    
    if (totalPages <= maxDisplayedPages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);
      
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      if (currentPage <= 2) {
        endPage = 3;
      }
      
      if (currentPage >= totalPages - 1) {
        startPage = totalPages - 2;
      }
      
      if (startPage > 2) {
        pageNumbers.push('ellipsis-start');
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      if (endPage < totalPages - 1) {
        pageNumbers.push('ellipsis-end');
      }
      
      if (totalPages > 1) {
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dispensaries</h1>
        <Button onClick={handleAddDispensary} className="bg-myers-yellow text-myers-darkBlue hover:bg-yellow-400">
          <Plus className="h-4 w-4 mr-2" />
          Add Dispensary
        </Button>
      </div>
      
      {showAddForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{editingDispensary ? 'Edit Dispensary' : 'Add New Dispensary'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleSaveDispensary(formData);
            }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">Dispensary Name</label>
                  <Input 
                    id="name"
                    name="name"
                    placeholder="Enter name" 
                    defaultValue={editingDispensary?.name || ''}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="location" className="text-sm font-medium">Location</label>
                  <Input 
                    id="location"
                    name="location"
                    placeholder="Enter location" 
                    defaultValue={editingDispensary?.location || ''}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="category" className="text-sm font-medium">Category</label>
                  <select 
                    id="category"
                    name="category"
                    className="w-full px-3 py-2 border rounded-md"
                    defaultValue={editingDispensary?.category || ''}
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Recreational">Recreational</option>
                    <option value="Medical">Medical</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="status" className="text-sm font-medium">Status</label>
                  <select 
                    id="status"
                    name="status"
                    className="w-full px-3 py-2 border rounded-md"
                    defaultValue={editingDispensary?.status || 'open'}
                    required
                  >
                    <option value="open">Open</option>
                    <option value="under-maintenance">Under Maintenance</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="assignedEngineer" className="text-sm font-medium">Assigned Engineer</label>
                  <select 
                    id="assignedEngineer"
                    name="assignedEngineer"
                    className="w-full px-3 py-2 border rounded-md"
                    defaultValue={editingDispensary?.assignedEngineer || ''}
                  >
                    <option value="">None</option>
                    {supportEngineers.map(engineer => (
                      <option key={engineer.id} value={engineer.name}>
                        {engineer.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastServiceDate" className="text-sm font-medium">Last Service Date</label>
                  <Input 
                    id="lastServiceDate"
                    name="lastServiceDate"
                    type="date"
                    defaultValue={editingDispensary?.lastServiceDate || ''}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <Button 
                  variant="outline" 
                  type="button"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="bg-myers-yellow text-myers-darkBlue hover:bg-yellow-400"
                  type="submit"
                >
                  {editingDispensary ? 'Update' : 'Create'} Dispensary
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
      
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle>Dispensaries List</CardTitle>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search dispensaries..."
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
                  <option value="open">Open</option>
                  <option value="under-maintenance">Under Maintenance</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              
              <div>
                <select
                  className="px-3 py-2 rounded-md border text-sm"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="">All Categories</option>
                  <option value="Recreational">Recreational</option>
                  <option value="Medical">Medical</option>
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
                  <TableHead>Location</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned Engineer</TableHead>
                  <TableHead>Last Service Date</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedDispensaries.length > 0 ? (
                  paginatedDispensaries.map((dispensary) => (
                    <TableRow key={dispensary.id}>
                      <TableCell className="font-medium">{dispensary.name}</TableCell>
                      <TableCell>{dispensary.location}</TableCell>
                      <TableCell>{dispensary.category}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline"
                          className={getStatusColor(dispensary.status)}
                        >
                          {getStatusLabel(dispensary.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {dispensary.assignedEngineer ? (
                          <div className="flex items-center">
                            <User className="h-3.5 w-3.5 mr-1.5 text-gray-500 dark:text-gray-400" />
                            {dispensary.assignedEngineer}
                          </div>
                        ) : (
                          <span className="text-gray-500 dark:text-gray-400">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {dispensary.lastServiceDate ? (
                          <div className="flex items-center">
                            <Calendar className="h-3.5 w-3.5 mr-1.5 text-gray-500 dark:text-gray-400" />
                            {dispensary.lastServiceDate}
                          </div>
                        ) : (
                          <span className="text-gray-500 dark:text-gray-400">—</span>
                        )}
                      </TableCell>
                      <TableCell>{dispensary.createdAt}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleViewDispensary(dispensary)}
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleEditDispensary(dispensary)}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDeleteDispensary(dispensary)}
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
                      No dispensaries found
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
                  setCurrentPage(1);
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
            
            {filteredDispensaries.length > 0 && (
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

      <Dialog open={!!viewingDispensary} onOpenChange={(open) => !open && setViewingDispensary(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Dispensary Details</DialogTitle>
          </DialogHeader>
          {viewingDispensary && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-2">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Name</h3>
                  <p className="mt-1">{viewingDispensary.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Location</h3>
                  <p className="mt-1">{viewingDispensary.location}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Category</h3>
                  <p className="mt-1">{viewingDispensary.category}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <Badge 
                    variant="outline"
                    className={getStatusColor(viewingDispensary.status)}
                  >
                    {getStatusLabel(viewingDispensary.status)}
                  </Badge>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Assigned Engineer</h3>
                  <p className="mt-1">{viewingDispensary.assignedEngineer || "—"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Last Service Date</h3>
                  <p className="mt-1">{viewingDispensary.lastServiceDate || "—"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Created At</h3>
                  <p className="mt-1">{viewingDispensary.createdAt}</p>
                </div>
              </div>
              <div className="flex justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => setViewingDispensary(null)}
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

export default Dispensaries;
