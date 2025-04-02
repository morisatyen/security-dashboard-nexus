import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Plus,
  Search,
  Edit,
  Trash,
  Eye,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
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

interface SupportEngineer {
  id: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  specialization: string;
  region: string;
  status: "active" | "inactive";
  activeRequests: number;
  joinedDate: string;
  phone?: string;
}

// Mock data for initial load
const mockSupportEngineers: SupportEngineer[] = [
  {
    id: "1",
    firstName: "James",
    lastName: "Wilson",
    name: "James Wilson",
    email: "james@myerssecurity.com",
    phone: "555-123-4567",
    specialization: "Hardware Installation",
    region: "North",
    status: "active",
    activeRequests: 0,
    joinedDate: "2023-01-10",
  },
  {
    id: "2",
    firstName: "Emma",
    lastName: "Roberts",
    name: "Emma Roberts",
    email: "emma@myerssecurity.com",
    phone: "555-987-6543",
    specialization: "Software Troubleshooting",
    region: "East",
    status: "active",
    activeRequests: 3,
    joinedDate: "2023-03-15",
  },
  {
    id: "3",
    firstName: "David",
    lastName: "Lee",
    name: "David Lee",
    email: "david@myerssecurity.com",
    phone: "555-456-7890",
    specialization: "Network Configuration",
    region: "West",
    status: "active",
    activeRequests: 0,
    joinedDate: "2023-02-22",
  },
  {
    id: "4",
    firstName: "Lisa",
    lastName: "Chen",
    name: "Lisa Chen",
    email: "lisa@myerssecurity.com",
    phone: "555-789-0123",
    specialization: "Software Troubleshooting",
    region: "South",
    status: "active",
    activeRequests: 2,
    joinedDate: "2023-04-05",
  },
  {
    id: "5",
    firstName: "Lisaa",
    lastName: "Chena",
    name: "Lisaa Chen",
    email: "lisaa@myerssecurity.com",
    phone: "555-789-0123",
    specialization: "Software Troubleshooting",
    region: "South",
    status: "active",
    activeRequests: 2,
    joinedDate: "2023-04-05",
  },
  {
    id: "6",
    firstName: "Lisa",
    lastName: "Chen",
    name: "Lisa Chen",
    email: "lisa@myerssecurity.com",
    phone: "555-789-0123",
    specialization: "Software Troubleshooting",
    region: "South",
    status: "active",
    activeRequests: 2,
    joinedDate: "2023-04-05",
  },
  {
    id: "7",
    firstName: "Lisa",
    lastName: "Chen",
    name: "Lisa Chen",
    email: "lisa@myerssecurity.com",
    phone: "555-789-0123",
    specialization: "Software Troubleshooting",
    region: "South",
    status: "inactive",
    activeRequests: 2,
    joinedDate: "2023-04-05",
  },
  {
    id: "8",
    firstName: "Lisa",
    lastName: "Chen",
    name: "Lisa Chen",
    email: "lisa@myerssecurity.com",
    phone: "555-789-0123",
    specialization: "Software Troubleshooting",
    region: "South",
    status: "active",
    activeRequests: 2,
    joinedDate: "2023-04-05",
  },
  {
    id: "9",
    firstName: "Lisa",
    lastName: "Chen",
    name: "Lisa Chen",
    email: "lisa@myerssecurity.com",
    phone: "555-789-0123",
    specialization: "Software Troubleshooting",
    region: "South",
    status: "active",
    activeRequests: 2,
    joinedDate: "2023-04-05",
  },
  {
    id: "10",
    firstName: "Lisa",
    lastName: "Chen",
    name: "Lisa Chen",
    email: "lisa@myerssecurity.com",
    phone: "555-789-0123",
    specialization: "Software Troubleshooting",
    region: "South",
    status: "inactive",
    activeRequests: 2,
    joinedDate: "2023-04-05",
  },
  {
    id: "11",
    firstName: "Lisa",
    lastName: "Chen",
    name: "Lisa Chen",
    email: "lisa@myerssecurity.com",
    phone: "555-789-0123",
    specialization: "Software Troubleshooting",
    region: "South",
    status: "inactive",
    activeRequests: 2,
    joinedDate: "2023-04-05",
  },
  {
    id: "12",
    firstName: "Lisa",
    lastName: "Chen",
    name: "Lisa Chen",
    email: "lisa@myerssecurity.com",
    phone: "555-789-0123",
    specialization: "Software Troubleshooting",
    region: "South",
    status: "active",
    activeRequests: 2,
    joinedDate: "2023-04-05",
  },
  {
    id: "13",
    firstName: "Lisa",
    lastName: "Chen",
    name: "Lisa Chen",
    email: "lisa@myerssecurity.com",
    phone: "555-789-0123",
    specialization: "Software Troubleshooting",
    region: "South",
    status: "active",
    activeRequests: 2,
    joinedDate: "2023-04-05",
  },
  {
    id: "14",
    firstName: "Lisa",
    lastName: "Chen",
    name: "Lisa Chen",
    email: "lisa@myerssecurity.com",
    phone: "555-789-0123",
    specialization: "Software Troubleshooting",
    region: "South",
    status: "active",
    activeRequests: 2,
    joinedDate: "2023-04-05",
  },
  {
    id: "15",
    firstName: "Lisa",
    lastName: "Chen",
    name: "Lisa Chen",
    email: "lisa@myerssecurity.com",
    phone: "555-789-0123",
    specialization: "Software Troubleshooting",
    region: "South",
    status: "active",
    activeRequests: 2,
    joinedDate: "2023-04-05",
  },
];

// Initialize localStorage if not already set
const initializeLocalStorage = () => {
  if (!localStorage.getItem("supportEngineers")) {
    localStorage.setItem(
      "supportEngineers",
      JSON.stringify(mockSupportEngineers)
    );
  }
};

type SortField = "name" | "email" | "status" | "joinedDate";
type SortDirection = "asc" | "desc";

const SupportEngineers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [viewingEngineer, setViewingEngineer] =
    useState<SupportEngineer | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [regionFilter, setRegionFilter] = useState<string>("");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const { toast } = useToast();
  const navigate = useNavigate();
  const tableCardRef = useRef<HTMLDivElement>(null);

  // Initialize localStorage when component mounts
  useEffect(() => {
    initializeLocalStorage();
  }, []);

  // Setup intersection observer for sticky card header
  useEffect(() => {
    if (!tableCardRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.target instanceof HTMLElement) {
          if (!entry.isIntersecting) {
            entry.target.classList.add("sticky-card");
          } else {
            entry.target.classList.remove("sticky-card");
          }
        }
      },
      { threshold: 0 }
    );

    observer.observe(tableCardRef.current);

    return () => {
      if (tableCardRef.current) {
        observer.unobserve(tableCardRef.current);
      }
    };
  }, []);

  // CRUD Operations with localStorage
  const { data: engineers = [], refetch } = useQuery({
    queryKey: ["supportEngineers"],
    queryFn: () => {
      const storedData = localStorage.getItem("supportEngineers");
      return Promise.resolve(
        storedData ? JSON.parse(storedData) : mockSupportEngineers
      );
    },
  });

  const filteredEngineers = engineers.filter((engineer) => {
    const engineerName =
      engineer.name || `${engineer.firstName} ${engineer.lastName}`;
    const matchesSearch =
      engineerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      engineer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      engineer.specialization
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      engineer.region.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter
      ? engineer.status === statusFilter
      : true;
    const matchesRegion = regionFilter
      ? engineer.region === regionFilter
      : true;

    return matchesSearch && matchesStatus && matchesRegion;
  });

  // Apply sorting
  const sortedEngineers = [...filteredEngineers].sort((a, b) => {
    let comparison = 0;

    switch (sortField) {
      case "name":
        const aName = a.name || `${a.firstName} ${a.lastName}`;
        const bName = b.name || `${b.firstName} ${b.lastName}`;
        comparison = aName.localeCompare(bName);
        break;
      case "email":
        comparison = a.email.localeCompare(b.email);
        break;
      case "status":
        comparison = a.status.localeCompare(b.status);
        break;
      case "joinedDate":
        comparison =
          new Date(a.joinedDate).getTime() - new Date(b.joinedDate).getTime();
        break;
    }

    return sortDirection === "asc" ? comparison : -comparison;
  });

  const totalPages = Math.ceil(sortedEngineers.length / itemsPerPage);
  const paginatedEngineers = sortedEngineers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(
    startIndex + paginatedEngineers.length - 1,
    sortedEngineers.length
  );

  const handleAddEngineer = () => {
    navigate("/users/support-engineers/add");
  };

  const handleEditEngineer = (engineer: SupportEngineer) => {
    navigate(`/users/support-engineers/edit/${engineer.id}`);
  };

  const handleViewEngineer = (engineer: SupportEngineer) => {
    setViewingEngineer(engineer);
  };

  const handleDeleteEngineer = (engineer: SupportEngineer) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${
        engineer.name || `${engineer.firstName} ${engineer.lastName}`
      }?`
    );

    if (confirmed) {
      const updatedEngineers = engineers.filter((e) => e.id !== engineer.id);
      localStorage.setItem(
        "supportEngineers",
        JSON.stringify(updatedEngineers)
      );
      refetch();

      toast({
        title: "Engineer Deleted",
        description: `${
          engineer.name || `${engineer.firstName} ${engineer.lastName}`
        } has been deleted successfully.`,
      });
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field)
      return <ChevronUp className="h-4 w-4 opacity-30" />;
    return sortDirection === "asc" ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    );
  };

  // const getStatusColor = (status: string) => {
  //   switch (status) {
  //     case "available":
  //       return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
  //     case "assigned":
  //       return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
  //     case "on-leave":
  //       return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  //     default:
  //       return "";
  //   }
  // };

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
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Support Engineers
        </h1>
        <Button
          onClick={handleAddEngineer}
          className="bg-myers-yellow text-myers-darkBlue hover:bg-yellow-400"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Support Engineer
        </Button>
      </div>

      <Card ref={tableCardRef} className="scroll-margin-top">
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
                  className="px-3 py-2 rounded-md border text-myers-darkBlue"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div>
                <select
                  className="px-3 py-2 rounded-md border text-myers-darkBlue"
                  value={regionFilter}
                  onChange={(e) => setRegionFilter(e.target.value)}
                >
                  <option value="">All Region</option>
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
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center">
                      Name
                      <span className="ml-2">{renderSortIcon("name")}</span>
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("email")}
                  >
                    <div className="flex items-center">
                      Email
                      <span className="ml-2">{renderSortIcon("email")}</span>
                    </div>
                  </TableHead>
                  {/* <TableHead>Specialization</TableHead> */}
                  {/* <TableHead>Region</TableHead> */}
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center">
                      Status
                      <span className="ml-2">{renderSortIcon("status")}</span>
                    </div>
                  </TableHead>
                  <TableHead>Active Requests</TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("joinedDate")}
                  >
                    <div className="flex items-center">
                      CreateAt
                      <span className="ml-2">
                        {renderSortIcon("joinedDate")}
                      </span>
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedEngineers.length > 0 ? (
                  paginatedEngineers.map((engineer) => (
                    <TableRow key={engineer.id}>
                      <TableCell className="font-medium">
                        {engineer.name ||
                          `${engineer.firstName} ${engineer.lastName}`}
                      </TableCell>
                      <TableCell>{engineer.email}</TableCell>
                      {/* <TableCell>{engineer.specialization}</TableCell> */}
                      {/* <TableCell>{engineer.region}</TableCell> */}
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            engineer.status === "active"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                          }
                        >
                          {engineer.status === "active" ? "Active" : "Inactive"}
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
                    <TableCell
                      colSpan={8}
                      className="text-center py-6 text-muted-foreground"
                    >
                      No support engineers found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between">
            {sortedEngineers.length > 0 && (
              <div className="mb-4 sm:mb-0 text-sm text-muted-foreground">
                Showing {startIndex} to {endIndex} of {sortedEngineers.length}{" "}
                results
              </div>
            )}

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

              {filteredEngineers.length > 0 && (
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

      {/* View Engineer Dialog */}
      <Dialog
        open={!!viewingEngineer}
        onOpenChange={(open) => !open && setViewingEngineer(null)}
      >
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
                    {viewingEngineer.name ||
                      `${viewingEngineer.firstName} ${viewingEngineer.lastName}`}
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
                  <h3 className="text-sm font-medium text-gray-500">
                    Specialization
                  </h3>
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
                    className={
                      viewingEngineer.status === "active"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                    }
                  >
                    {viewingEngineer.status === "active"
                      ? "Active"
                      : "Inactive"}
                  </Badge>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Active Requests
                  </h3>
                  <p className="mt-1">{viewingEngineer.activeRequests}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Joined Date
                  </h3>
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
