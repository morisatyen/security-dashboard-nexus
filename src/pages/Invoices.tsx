
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Search, FileText, Download, Trash, User, Calendar } from 'lucide-react';
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

interface Invoice {
  id: string;
  invoiceNumber: string;
  dispensaryName: string;
  dispensaryId: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
  issuedDate: string;
  dueDate: string;
  paidDate: string | null;
  description: string;
}

interface InvoicesProps {
  dispensaryId?: string;
  viewMode?: boolean;
}

const mockInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2023-001',
    dispensaryName: 'Downtown Dispensary',
    dispensaryId: '1',
    amount: 1250.00,
    status: 'paid',
    issuedDate: '2023-10-01',
    dueDate: '2023-10-15',
    paidDate: '2023-10-12',
    description: 'Security system installation'
  },
  {
    id: '2',
    invoiceNumber: 'INV-2023-002',
    dispensaryName: 'Green Leaf Dispensary',
    dispensaryId: '2',
    amount: 750.00,
    status: 'pending',
    issuedDate: '2023-10-15',
    dueDate: '2023-10-30',
    paidDate: null,
    description: 'Monthly maintenance service'
  },
  {
    id: '3',
    invoiceNumber: 'INV-2023-003',
    dispensaryName: 'Herbal Solutions',
    dispensaryId: '3',
    amount: 1800.00,
    status: 'overdue',
    issuedDate: '2023-09-15',
    dueDate: '2023-09-30',
    paidDate: null,
    description: 'Security upgrade and camera installation'
  },
  {
    id: '4',
    invoiceNumber: 'INV-2023-004',
    dispensaryName: 'Healing Center',
    dispensaryId: '4',
    amount: 500.00,
    status: 'paid',
    issuedDate: '2023-10-20',
    dueDate: '2023-11-05',
    paidDate: '2023-10-25',
    description: 'Emergency service call'
  },
  {
    id: '5',
    invoiceNumber: 'INV-2023-005',
    dispensaryName: 'Evergreen Dispensary',
    dispensaryId: '5',
    amount: 950.00,
    status: 'pending',
    issuedDate: '2023-11-01',
    dueDate: '2023-11-15',
    paidDate: null,
    description: 'Quarterly security review'
  }
];

const dispensaries = [
  { id: '1', name: 'Downtown Dispensary' },
  { id: '2', name: 'Green Leaf Dispensary' },
  { id: '3', name: 'Herbal Solutions' },
  { id: '4', name: 'Healing Center' },
  { id: '5', name: 'Evergreen Dispensary' }
];

const Invoices: React.FC<InvoicesProps> = ({ dispensaryId, viewMode = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');
  const { toast } = useToast();
  
  // In a real app, this would fetch from an API
  const { data: invoices = mockInvoices } = useQuery({
    queryKey: ['invoices', dispensaryId],
    queryFn: () => {
      // If in dispensary view mode, filter invoices by dispensaryId
      if (dispensaryId) {
        return Promise.resolve(
          mockInvoices.filter(invoice => invoice.dispensaryId === dispensaryId)
        );
      }
      return Promise.resolve(mockInvoices);
    },
    initialData: dispensaryId 
      ? mockInvoices.filter(invoice => invoice.dispensaryId === dispensaryId)
      : mockInvoices,
  });
  
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.dispensaryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter ? invoice.status === statusFilter : true;
    
    let matchesDate = true;
    if (dateFilter === 'current-month') {
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const invoiceMonth = new Date(invoice.issuedDate).getMonth();
      const invoiceYear = new Date(invoice.issuedDate).getFullYear();
      matchesDate = invoiceMonth === currentMonth && invoiceYear === currentYear;
    } else if (dateFilter === 'previous-month') {
      const date = new Date();
      date.setMonth(date.getMonth() - 1);
      const previousMonth = date.getMonth();
      const previousYear = date.getFullYear();
      const invoiceMonth = new Date(invoice.issuedDate).getMonth();
      const invoiceYear = new Date(invoice.issuedDate).getFullYear();
      matchesDate = invoiceMonth === previousMonth && invoiceYear === previousYear;
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });
  
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const handleAddInvoice = () => {
    setShowAddForm(true);
    setEditingInvoice(null);
  };
  
  const handleDeleteInvoice = (invoice: Invoice) => {
    toast({
      title: "Invoice Deleted",
      description: `Invoice ${invoice.invoiceNumber} has been deleted successfully.`,
    });
    // In a real application, you would call an API to delete the invoice
  };
  
  const handleDownloadInvoice = (invoice: Invoice) => {
    toast({
      title: "Invoice Downloaded",
      description: `Invoice ${invoice.invoiceNumber} has been downloaded successfully.`,
    });
    // In a real application, you would generate a PDF and trigger a download
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'overdue':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return '';
    }
  };

  // Calculate the "Showing X to Y of Z results" text
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, filteredInvoices.length);
  const totalItems = filteredInvoices.length;
  const resultsText = `Showing ${startItem} to ${endItem} of ${totalItems} results`;
  
  return (
    <div className={viewMode ? "" : "p-6 space-y-6"}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {!viewMode && (
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Invoices</h1>
        )}
        <Button onClick={handleAddInvoice} className="bg-myers-yellow text-myers-darkBlue hover:bg-yellow-400">
          <Plus className="h-4 w-4 mr-2" />
          Generate New Invoice
        </Button>
      </div>
      
      {showAddForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Generate New Invoice</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="dispensary" className="text-sm font-medium">Dispensary Name</label>
                  <select 
                    id="dispensary" 
                    className="w-full px-3 py-2 border rounded-md"
                    defaultValue={dispensaryId || ""}
                    disabled={!!dispensaryId}
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
                  <label htmlFor="amount" className="text-sm font-medium">Amount ($)</label>
                  <Input 
                    id="amount" 
                    type="number"
                    placeholder="0.00" 
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="issuedDate" className="text-sm font-medium">Issue Date</label>
                  <Input 
                    id="issuedDate" 
                    type="date"
                    defaultValue={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="dueDate" className="text-sm font-medium">Due Date</label>
                  <Input 
                    id="dueDate" 
                    type="date"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="description" className="text-sm font-medium">Description</label>
                  <textarea 
                    id="description" 
                    className="w-full px-3 py-2 border rounded-md min-h-[100px]"
                    placeholder="Invoice description..."
                  ></textarea>
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
                      title: "Invoice Generated",
                      description: "Invoice has been generated successfully.",
                    });
                    setShowAddForm(false);
                  }}
                >
                  Generate Invoice
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
              <CardTitle>Invoices List</CardTitle>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search invoices..."
                  className="pl-8 w-full sm:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <div>
                <select
                  className="px-3 py-2 rounded-md border text-myers-darkBlue"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
              
              <div>
                <select
                  className="px-3 py-2 rounded-md border text-myers-darkBlue"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                >
                  <option value="">All Dates</option>
                  <option value="current-month">Current Month</option>
                  <option value="previous-month">Previous Month</option>
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
                  <TableHead>Invoice #</TableHead>
                  {!dispensaryId && <TableHead>Dispensary</TableHead>}
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Issued Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Paid Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedInvoices.length > 0 ? (
                  paginatedInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                      {!dispensaryId && <TableCell>{invoice.dispensaryName}</TableCell>}
                      <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline"
                          className={getStatusColor(invoice.status)}
                        >
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="h-3.5 w-3.5 mr-1.5 text-gray-500 dark:text-gray-400" />
                          {invoice.issuedDate}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="h-3.5 w-3.5 mr-1.5 text-gray-500 dark:text-gray-400" />
                          {invoice.dueDate}
                        </div>
                      </TableCell>
                      <TableCell>
                        {invoice.paidDate ? (
                          <div className="flex items-center">
                            <Calendar className="h-3.5 w-3.5 mr-1.5 text-green-500" />
                            {invoice.paidDate}
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
                            onClick={() => handleDownloadInvoice(invoice)}
                          >
                            <Download className="h-4 w-4" />
                            <span className="sr-only">Download</span>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDeleteInvoice(invoice)}
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
                    <TableCell colSpan={dispensaryId ? 7 : 8} className="text-center py-6 text-muted-foreground">
                      No invoices found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between">
            <div className="text-sm text-muted-foreground mb-4 sm:mb-0">
              {resultsText}
            </div>
            
            {filteredInvoices.length > itemsPerPage && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                  
                  <PaginationItem>
                    <PaginationLink isActive={true}>
                      {currentPage}
                    </PaginationLink>
                  </PaginationItem>
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Invoices;
