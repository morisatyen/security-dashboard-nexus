import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search, Edit, Trash, Eye, ArrowUpDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
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
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface KnowledgeBaseItem {
  id: string;
  title: string;
  category: "Services" | "Case Studies" | "Testimonials";
  description: string;
  videoUrl: string | null;
  blogUrl: string | null;
  fileUrl: string | null;
  status: "active" | "inactive";
  createdAt: string;
}

// Mock data for initial load
const mockKnowledgeBaseItems: KnowledgeBaseItem[] = [
  {
    id: "1",
    title: "Security System Installation Guide",
    category: "Services",
    description: "Step-by-step guide for installing our security systems",
    videoUrl: "https://www.youtube.com/watch?v=example1",
    blogUrl: null,
    fileUrl: "https://example.com/installation-guide.pdf",
    status: "active",
    createdAt: "2023-05-10",
  },
  {
    id: "2",
    title: "Downtown Dispensary Success Story",
    category: "Case Studies",
    description: "How Downtown Dispensary improved security with our systems",
    videoUrl: null,
    blogUrl: "https://myerssecurity.com/blog/downtown-case-study",
    fileUrl: "https://example.com/downtown-case-study.pdf",
    status: "active",
    createdAt: "2023-06-15",
  },
  {
    id: "3",
    title: "Client Testimonial - Green Leaf",
    category: "Testimonials",
    description: "Testimonial from Green Leaf Dispensary about our services",
    videoUrl: "https://www.youtube.com/watch?v=example3",
    blogUrl: null,
    fileUrl: null,
    status: "active",
    createdAt: "2023-07-22",
  },
  {
    id: "4",
    title: "Network Security Best Practices",
    category: "Services",
    description: "Guidelines for maintaining network security",
    videoUrl: null,
    blogUrl: "https://myerssecurity.com/blog/network-security",
    fileUrl: "https://example.com/network-security.pdf",
    status: "inactive",
    createdAt: "2023-08-05",
  },
  {
    id: "5",
    title: "Herbal Solutions Implementation",
    category: "Case Studies",
    description: "Case study on Herbal Solutions security implementation",
    videoUrl: "https://www.youtube.com/watch?v=example5",
    blogUrl: "https://myerssecurity.com/blog/herbal-case-study",
    fileUrl: null,
    status: "active",
    createdAt: "2023-09-18",
  },
];

// Initialize localStorage if not already set
const initializeLocalStorage = () => {
  if (!localStorage.getItem("knowledgeBase")) {
    localStorage.setItem(
      "knowledgeBase",
      JSON.stringify(mockKnowledgeBaseItems)
    );
  }
};

const KnowledgeBase: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [viewingItem, setViewingItem] = useState<KnowledgeBaseItem | null>(
    null
  );
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [sortField, setSortField] = useState<string>("title");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const { toast } = useToast();
  const navigate = useNavigate();

  // Initialize localStorage when component mounts
  useEffect(() => {
    initializeLocalStorage();
  }, []);

  // CRUD Operations with localStorage
  const { data: knowledgeBase = [], refetch } = useQuery({
    queryKey: ["knowledgeBase"],
    queryFn: () => {
      const storedData = localStorage.getItem("knowledgeBase");
      return Promise.resolve(
        storedData ? JSON.parse(storedData) : mockKnowledgeBaseItems
      );
    },
  });

  // Filtering logic
  const filteredItems = knowledgeBase.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter
      ? item.category === categoryFilter
      : true;
    const matchesStatus = statusFilter ? item.status === statusFilter : true;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Sorting logic
  const sortedItems = [...filteredItems].sort((a, b) => {
    let comparison = 0;

    if (sortField === "title") {
      comparison = a.title.localeCompare(b.title);
    } else if (sortField === "category") {
      comparison = a.category.localeCompare(b.category);
    } else if (sortField === "status") {
      comparison = a.status.localeCompare(b.status);
    } else if (sortField === "createdAt") {
      comparison =
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }

    return sortDirection === "asc" ? comparison : -comparison;
  });

  // Pagination
  const totalPages = Math.ceil(sortedItems.length / itemsPerPage);
  const paginatedItems = sortedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, sortedItems.length);
  const totalItems = sortedItems.length;
  const resultsText = `Showing ${startItem ?? 0} to ${endItem ?? 0} of ${
    totalItems ?? 0
  } results`;

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleAddItem = () => {
    navigate("/knowledge-base/add");
  };

  const handleEditItem = (item: KnowledgeBaseItem) => {
    navigate(`/knowledge-base/edit/${item.id}`);
  };

  const handleViewItem = (item: KnowledgeBaseItem) => {
    setViewingItem(item);
  };

  const handleDeleteItem = (item: KnowledgeBaseItem) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${item.title}"?`
    );
    if (confirmed) {
      const updatedItems = knowledgeBase.filter((i) => i.id !== item.id);
      localStorage.setItem("knowledgeBase", JSON.stringify(updatedItems));
      refetch();

      toast({
        title: "Item Deleted",
        description: `"${item.title}" has been deleted successfully.`,
      });
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
        pageNumbers.push("ellipsis-start");
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push("ellipsis-end");
      }

      // Always show last page
      if (totalPages > 1) {
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Knowledge Base
        </h1>
        <Button
          onClick={handleAddItem}
          className="bg-myers-yellow text-myers-darkBlue hover:bg-yellow-400"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Knowledge Base Item
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle>Knowledge Base Items</CardTitle>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search items..."
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
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="">All Categories</option>
                  <option value="Services">Services</option>
                  <option value="Case Studies">Case Studies</option>
                  <option value="Testimonials">Testimonials</option>
                </select>
              </div>

              <div>
                <select
                  className="px-3 py-2 rounded-md border text-myers-darkBlue"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
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
                  <TableHead
                    onClick={() => handleSort("title")}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center">
                      Title
                      {sortField === "title" && (
                        <ArrowUpDown
                          className={`ml-1 h-4 w-4 ${
                            sortDirection === "desc" ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </div>
                  </TableHead>
                  <TableHead
                    onClick={() => handleSort("category")}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center">
                      Category
                      {sortField === "category" && (
                        <ArrowUpDown
                          className={`ml-1 h-4 w-4 ${
                            sortDirection === "desc" ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead
                    onClick={() => handleSort("status")}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center">
                      Status
                      {sortField === "status" && (
                        <ArrowUpDown
                          className={`ml-1 h-4 w-4 ${
                            sortDirection === "desc" ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </div>
                  </TableHead>
                  <TableHead
                    onClick={() => handleSort("createdAt")}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center">
                      Created Date
                      {sortField === "createdAt" && (
                        <ArrowUpDown
                          className={`ml-1 h-4 w-4 ${
                            sortDirection === "desc" ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedItems.length > 0 ? (
                  paginatedItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {item.title}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                        >
                          {item.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {item.description}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            item.status === "active"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                          }
                        >
                          {item.status === "active" ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>{item.createdAt}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewItem(item)}
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditItem(item)}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteItem(item)}
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
                    <TableCell
                      colSpan={6}
                      className="text-center py-6 text-muted-foreground"
                    >
                      No knowledge base items found
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
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div>
                <span className="text-sm text-muted-foreground mr-2">
                  Items per page:
                </span>
                <select
                  className="px-2 py-1 border rounded text-myers-darkBlue"
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

              {filteredItems.length > 0 && (
                <div className="flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                          }
                          className={
                            currentPage === 1
                              ? "pointer-events-none opacity-50"
                              : ""
                          }
                        />
                      </PaginationItem>

                      {/* {getPageNumbers().map((pageNumber, index) => (
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
                    ))} */}
                      <PaginationItem>
                        <PaginationLink isActive={true}>
                          {currentPage}
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationNext
                          onClick={() =>
                            setCurrentPage((prev) =>
                              Math.min(prev + 1, totalPages)
                            )
                          }
                          className={
                            currentPage === totalPages
                              ? "pointer-events-none opacity-50"
                              : ""
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* View Knowledge Base Item Dialog */}
      <Dialog
        open={!!viewingItem}
        onOpenChange={(open) => !open && setViewingItem(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Knowledge Base Item Details</DialogTitle>
          </DialogHeader>
          {viewingItem && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-2">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Title</h3>
                  <p className="mt-1">{viewingItem.title}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Category
                  </h3>
                  <Badge
                    variant="outline"
                    className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                  >
                    {viewingItem.category}
                  </Badge>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Description
                  </h3>
                  <p className="mt-1">{viewingItem.description}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <Badge
                    variant="outline"
                    className={
                      viewingItem.status === "active"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                    }
                  >
                    {viewingItem.status === "active" ? "Active" : "Inactive"}
                  </Badge>
                </div>
                {viewingItem.videoUrl && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Video URL
                    </h3>
                    <a
                      href={viewingItem.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 text-blue-600 hover:underline break-all"
                    >
                      {viewingItem.videoUrl}
                    </a>
                  </div>
                )}
                {viewingItem.blogUrl && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Blog URL
                    </h3>
                    <a
                      href={viewingItem.blogUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 text-blue-600 hover:underline break-all"
                    >
                      {viewingItem.blogUrl}
                    </a>
                  </div>
                )}
                {viewingItem.fileUrl && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      File URL
                    </h3>
                    <a
                      href={viewingItem.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 text-blue-600 hover:underline break-all"
                    >
                      {viewingItem.fileUrl}
                    </a>
                  </div>
                )}
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Created Date
                  </h3>
                  <p className="mt-1">{viewingItem.createdAt}</p>
                </div>
              </div>
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setViewingItem(null)}>
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

export default KnowledgeBase;
