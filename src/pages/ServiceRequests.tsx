
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Search, Edit, Trash, Calendar, User, Clock } from 'lucide-react';
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

interface ServiceRequest {
  id: string;
  requestId: string;
  dispensaryName: string;
  dispensaryId: string;
  description: string;
  status: 'pending' | 'in-progress' | 'resolved';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedEngineer: string | null;
  requestDate: string;
  lastUpdated: string | null;
}

const mockServiceRequests: ServiceRequest[] = [
  {
    id: '1',
    requestId: 'SR-2023-001',
    dispensaryName: 'Downtown Dispensary',
    dispensaryId: '1',
    description: 'Security camera malfunction in main entrance',
    status: 'pending',
    priority: 'high',
    assignedEngineer: null,
    requestDate: '2023-11-01',
    lastUpdated: null
  },
  {
    id: '2',
    requestId: 'SR-2023-002',
    dispensaryName: 'Green Leaf Dispensary',
    dispensaryId: '2',
    description: 'Software update required for POS system',
    status: 'in-progress',
    priority: 'medium',
    assignedEngineer: 'Emma Roberts',
    requestDate: '2023-11-02',
    lastUpdated: '2023-11-03'
  },
  {
    id: '3',
    requestId: 'SR-2023-003',
    dispensaryName: 'Herbal Solutions',
    dispensaryId: '3',
    description: 'Door access control system not functioning',
    status: 'resolved',
    priority: 'high',
    assignedEngineer: 'James Wilson',
    requestDate: '2023-10-25',
    lastUpdated: '2023-10-28'
  },
  {
    id: '4',
    requestId: 'SR-2023-004',
    dispensaryName: 'Healing Center',
    dispensaryId: '4',
    description: 'Regular maintenance check request',
    status: 'in-progress',
    priority: 'low',
    assignedEngineer: 'Lisa Chen',
    requestDate: '2023-11-05',
    lastUpdated: '2023-11-05'
  },
  {
    id: '5',
    requestId: 'SR-2023-005',
    dispensaryName: 'Downtown Dispensary',
    dispensaryId: '1',
    description: 'Alarm system false triggers',
    status: 'pending',
    priority: 'critical',
    assignedEngineer: null,
    requestDate: '2023-11-06',
    lastUpdated: null
  },
  {
    id: '6',
    requestId: 'SR-2023-006',
    dispensaryName: 'Evergreen Dispensary',
    dispensaryId: '5',
    description: 'Network configuration issues',
    status: 'pending',
    priority: 'medium',
    assignedEngineer: null,
    requestDate: '2023-11-07',
    lastUpdated: null
  }
];

const supportEngineers = [
  { id: '1', name: 'James Wilson' },
  { id: '2', name: 'Emma Roberts' },
  { id: '3', name: 'David Lee' },
  { id: '4', name: 'Lisa Chen' }
];

const dispensaries = [
  { id: '1', name: 'Downtown Dispensary' },
  { id: '2', name: 'Green Leaf Dispensary' },
  { id: '3', name: 'Herbal Solutions' },
  { id: '4', name: 'Healing Center' },
  { id: '5', name: 'Evergreen Dispensary' }
];

const ServiceRequests: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRequest, setEditingRequest] = useState<ServiceRequest | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');
  const { toast } = useToast();
  
  // In a real app, this would fetch from an API
  const { data: serviceRequests = mockServiceRequests } = useQuery({
    queryKey: ['serviceRequests'],
    queryFn: () => Promise.resolve(mockServiceRequests),
    initialData: mockServiceRequests,
  });
  
  const filteredRequests = serviceRequests.filter(request => {
    const matchesSearch = 
      request.requestId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.dispensaryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (request.assignedEngineer?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    
    const matchesStatus = statusFilter ? request.status === statusFilter : true;
    const matchesPriority = priorityFilter ? request.priority === priorityFilter : true;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });
  
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const handleAddRequest = () => {
    setShowAddForm(true);
    setEditingRequest(null);
  };
  
  const handleEditRequest = (request: ServiceRequest) => {
    setEditingRequest(request);
    setShowAddForm(true);
  };
  
  const handleDeleteRequest = (request: ServiceRequest) => {
    toast({
      title: "Service Request Deleted",
      description: `Request ${request.requestId} has been deleted successfully.`,
    });
    // In a real application, you would call an API to delete the service request
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'resolved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default:
        return '';
    }
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'medium':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'critical':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return '';
    }
  };
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Service Requests</h1>
        <Button onClick={handleAddRequest} className="bg-myers-yellow text-myers-darkBlue hover:bg-yellow-400">
          <Plus className="h-4 w-4 mr-2" />
          Add Service Request
        </Button>
      </div>
      
      {showAddForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{editingRequest ? 'Edit Service Request' : 'Add New Service Request'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="dispensary" className="text-sm font-medium">Dispensary</label>
                  <select 
                    id="dispensary" 
                    className="w-full px-3 py-2 border rounded-md"
                    defaultValue={editingRequest?.dispensaryId || ''}
                  >
                    <option value="">Select Dispensary</option>
                    {dispensaries.map(dispensary => (
                      <option key={dispensary.id} value={dispensary.id}>
                        {dispensary.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">Description</label>
                  <Input 
                    id="description" 
                    placeholder="Describe the issue" 
                    defaultValue={editingRequest?.description || ''}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="priority" className="text-sm font-medium">Priority</label>
                  <select 
                    id="priority" 
                    className="w-full px-3 py-2 border rounded-md"
                    defaultValue={editingRequest?.priority || 'medium'}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="status" className="text-sm font-medium">Status</label>
                  <select 
                    id="status" 
                    className="w-full px-3 py-2 border rounded-md"
                    defaultValue={editingRequest?.status || 'pending'}
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="assignedEngineer" className="text-sm font-medium">Assigned Engineer</label>
                  <select 
                    id="assignedEngineer" 
                    className="w-full px-3 py-2 border rounded-md"
                    defaultValue={editingRequest?.assignedEngineer || ''}
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
                  <label htmlFor="requestDate" className="text-sm font-medium">Request Date</label>
                  <Input 
                    id="requestDate" 
                    type="date"
                    defaultValue={editingRequest?.requestDate || new Date().toISOString().split('T')[0]}
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
                      title: `Service Request ${editingRequest ? 'Updated' : 'Created'}`,
                      description: `Service request has been ${editingRequest ? 'updated' : 'created'} successfully.`,
                    });
                    setShowAddForm(false);
                  }}
                >
                  {editingRequest ? 'Update' : 'Create'} Request
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
              <CardTitle>Service Requests List</CardTitle>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search requests..."
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
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
              
              <div>
                <select
                  className="px-3 py-2 rounded-md border text-sm"
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                >
                  <option value="">All Priorities</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
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
                  <TableHead>Request ID</TableHead>
                  <TableHead>Dispensary</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Assigned Engineer</TableHead>
                  <TableHead>Request Date</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedRequests.length > 0 ? (
                  paginatedRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.requestId}</TableCell>
                      <TableCell>{request.dispensaryName}</TableCell>
                      <TableCell className="max-w-xs truncate">{request.description}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline"
                          className={getStatusColor(request.status)}
                        >
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1).replace('-', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline"
                          className={getPriorityColor(request.priority)}
                        >
                          {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {request.assignedEngineer ? (
                          <div className="flex items-center">
                            <User className="h-3.5 w-3.5 mr-1.5 text-gray-500 dark:text-gray-400" />
                            {request.assignedEngineer}
                          </div>
                        ) : (
                          <span className="text-gray-500 dark:text-gray-400">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="h-3.5 w-3.5 mr-1.5 text-gray-500 dark:text-gray-400" />
                          {request.requestDate}
                        </div>
                      </TableCell>
                      <TableCell>
                        {request.lastUpdated ? (
                          <div className="flex items-center">
                            <Clock className="h-3.5 w-3.5 mr-1.5 text-gray-500 dark:text-gray-400" />
                            {request.lastUpdated}
                          </div>
                        ) : (
                          <span className="text-gray-500 dark:text-gray-400">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleEditRequest(request)}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDeleteRequest(request)}
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
                    <TableCell colSpan={9} className="text-center py-6 text-muted-foreground">
                      No service requests found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          {filteredRequests.length > itemsPerPage && (
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

export default ServiceRequests;
