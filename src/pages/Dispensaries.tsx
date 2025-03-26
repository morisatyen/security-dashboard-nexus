
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Search, Edit, Trash, Calendar, User } from 'lucide-react';
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
  PaginationPrevious 
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

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
  }
];

const supportEngineers = [
  { id: '1', name: 'James Wilson' },
  { id: '2', name: 'Emma Roberts' },
  { id: '3', name: 'David Lee' },
  { id: '4', name: 'Lisa Chen' }
];

const Dispensaries: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingDispensary, setEditingDispensary] = useState<Dispensary | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const { toast } = useToast();
  
  // In a real app, this would fetch from an API
  const { data: dispensaries = mockDispensaries } = useQuery({
    queryKey: ['dispensaries'],
    queryFn: () => Promise.resolve(mockDispensaries),
    initialData: mockDispensaries,
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
  
  const itemsPerPage = 5;
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
  
  const handleDeleteDispensary = (dispensary: Dispensary) => {
    toast({
      title: "Dispensary Deleted",
      description: `${dispensary.name} has been deleted successfully.`,
    });
    // In a real application, you would call an API to delete the dispensary
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
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">Dispensary Name</label>
                  <Input 
                    id="name" 
                    placeholder="Enter name" 
                    defaultValue={editingDispensary?.name || ''}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="location" className="text-sm font-medium">Location</label>
                  <Input 
                    id="location" 
                    placeholder="Enter location" 
                    defaultValue={editingDispensary?.location || ''}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="category" className="text-sm font-medium">Category</label>
                  <select 
                    id="category" 
                    className="w-full px-3 py-2 border rounded-md"
                    defaultValue={editingDispensary?.category || ''}
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
                    className="w-full px-3 py-2 border rounded-md"
                    defaultValue={editingDispensary?.status || 'open'}
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
                    type="date"
                    defaultValue={editingDispensary?.lastServiceDate || ''}
                  />
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
                      title: `Dispensary ${editingDispensary ? 'Updated' : 'Created'}`,
                      description: `Dispensary has been ${editingDispensary ? 'updated' : 'created'} successfully.`,
                    });
                    setShowAddForm(false);
                  }}
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
          
          {filteredDispensaries.length > itemsPerPage && (
            <div className="mt-4 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }).map((_, index) => (
                    <PaginationItem key={index}>
                      <PaginationLink
                        isActive={currentPage === index + 1}
                        onClick={() => setCurrentPage(index + 1)}
                      >
                        {index + 1}
                      </PaginationLink>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default Dispensaries;
