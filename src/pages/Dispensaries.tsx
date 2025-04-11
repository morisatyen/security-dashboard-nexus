import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Edit,
  Trash,
  Calendar,
  User,
  Eye,
  ArrowUp,
  ArrowDown,
  MessageCircle,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Dispensary {
  id: string;
  name: string;
  location: string;
  category: string;
  status: "active" | "inactive";
  assignedEngineer: string | null;
  lastServiceDate: string | null;
  createdAt: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  password?: string;
  profilePicture?: string;
}

const mockDispensaries: Dispensary[] = [
  {
    id: "1",
    name: "Downtown Dispensary",
    location: "123 Main St, Seattle, WA",
    category: "Recreational",
    status: "active",
    assignedEngineer: "Emma Roberts",
    lastServiceDate: "2023-10-15",
    createdAt: "2023-01-05",
    contactPerson: "John Smith",
    phone: "206-555-1234",
    email: "john@downtown.com",
    password: "password123",
    profilePicture: "/placeholder.svg",
  },
  {
    id: "2",
    name: "Green Leaf Dispensary",
    location: "456 Oak Ave, Portland, OR",
    category: "Medical",
    status: "inactive",
    assignedEngineer: "James Wilson",
    lastServiceDate: "2023-11-02",
    createdAt: "2023-02-12",
    contactPerson: "Sarah Johnson",
    phone: "503-555-6789",
    email: "sarah@greenleaf.com",
    password: "password123",
    profilePicture: "/placeholder.svg",
  },
  {
    id: "3",
    name: "Herbal Solutions",
    location: "789 Pine St, Denver, CO",
    category: "Recreational",
    status: "active",
    assignedEngineer: null,
    lastServiceDate: "2023-09-20",
    createdAt: "2023-03-18",
    contactPerson: "Mike Davis",
    phone: "303-555-4321",
    email: "mike@herbalsolutions.com",
    password: "password123",
    profilePicture: "/placeholder.svg",
  },
  {
    id: "4",
    name: "Healing Center",
    location: "101 Maple Rd, San Francisco, CA",
    category: "Medical",
    status: "inactive",
    assignedEngineer: "Lisa Chen",
    lastServiceDate: "2023-10-25",
    createdAt: "2023-04-22",
    contactPerson: "Emma Williams",
    phone: "415-555-8765",
    email: "emma@healingcenter.com",
    password: "password123",
    profilePicture: "/placeholder.svg",
  },
  {
    id: "5",
    name: "Evergreen Dispensary",
    location: "202 Cedar Blvd, Las Vegas, NV",
    category: "Recreational",
    status: "active",
    assignedEngineer: "David Lee",
    lastServiceDate: "2023-11-05",
    createdAt: "2023-05-01",
    contactPerson: "Alex Turner",
    phone: "702-555-9876",
    email: "alex@evergreen.com",
    password: "password123",
    profilePicture: "/placeholder.svg",
  },
  {
    id: "6",
    name: "Wellness Dispensary",
    location: "303 Pine Ave, Chicago, IL",
    category: "Medical",
    status: "active",
    assignedEngineer: "Emma Roberts",
    lastServiceDate: "2023-11-10",
    createdAt: "2023-06-15",
    contactPerson: "Chris Garcia",
    phone: "312-555-1122",
    email: "chris@wellness.com",
    password: "password123",
    profilePicture: "/placeholder.svg",
  },
  {
    id: "7",
    name: "Green Zone",
    location: "404 Elm St, Boston, MA",
    category: "Recreational",
    status: "active",
    assignedEngineer: "James Wilson",
    lastServiceDate: "2023-11-08",
    createdAt: "2023-07-22",
    contactPerson: "Taylor Reed",
    phone: "617-555-3344",
    email: "taylor@greenzone.com",
    password: "password123",
    profilePicture: "/placeholder.svg",
  },
  {
    id: "8",
    name: "Nature's Remedy",
    location: "505 Oak Blvd, Austin, TX",
    category: "Medical",
    status: "active",
    assignedEngineer: null,
    lastServiceDate: "2023-10-30",
    createdAt: "2023-08-05",
    contactPerson: "Jordan Patel",
    phone: "512-555-5566",
    email: "jordan@naturesremedy.com",
    password: "password123",
    profilePicture: "/placeholder.svg",
  },
];

const initializeLocalStorage = () => {
  if (!localStorage.getItem("dispensaries")) {
    localStorage.setItem("dispensaries", JSON.stringify(mockDispensaries));
  }
};

initializeLocalStorage();

type SortField = "name" | "contactPerson" | "createdAt";
type SortDirection = "asc" | "desc";

const Dispensaries: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [viewingDispensary, setViewingDispensary] = useState<Dispensary | null>(
    null
  );
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: dispensaries = [], refetch } = useQuery({
    queryKey: ["dispensaries"],
    queryFn: () => {
      const storedData = localStorage.getItem("dispensaries");
      return Promise.resolve(
        storedData ? JSON.parse(storedData) : mockDispensaries
      );
    },
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredDispensaries = useMemo(() => {
    const filtered = dispensaries.filter((dispensary) => {
      const matchesSearch =
        dispensary.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dispensary.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dispensary.assignedEngineer
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        false;

      const matchesStatus = statusFilter
        ? dispensary.status === statusFilter
        : true;
      const matchesCategory = categoryFilter
        ? dispensary.category === categoryFilter
        : true;

      return matchesSearch && matchesStatus && matchesCategory;
    });

    return [...filtered].sort((a, b) => {
      if (sortField === "name") {
        return sortDirection === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortField === "createdAt") {
        return sortDirection === "asc"
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortField === "contactPerson") {
        return sortDirection === "asc"
          ? a.contactPerson.localeCompare(b.contactPerson)
          : b.contactPerson.localeCompare(a.contactPerson);
      }
      return 0;
    });
  }, [
    dispensaries,
    searchTerm,
    statusFilter,
    categoryFilter,
    sortField,
    sortDirection,
  ]);

  const totalPages = Math.ceil(filteredDispensaries.length / itemsPerPage);
  const paginatedDispensaries = filteredDispensaries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAddDispensary = () => {
    navigate("/dispensaries/add");
  };

  const handleEditDispensary = (dispensary: Dispensary) => {
    navigate(`/dispensaries/edit/${dispensary.id}`);
  };

  const handleViewDispensary = (dispensary: Dispensary) => {
    navigate(`/dispensaries/view/${dispensary.id}`);
  };

  const handleChatWithDispensary = (dispensary: Dispensary) => {
    navigate(`/chat/${dispensary.id}`);
  };

  const handleDeleteDispensary = (dispensary: Dispensary) => {
    const updatedDispensaries = dispensaries.filter(
      (d) => d.id !== dispensary.id
    );
    localStorage.setItem("dispensaries", JSON.stringify(updatedDispensaries));
    refetch();

    toast({
      title: "Dispensary Deleted",
      description: `${dispensary.name} has been deleted successfully.`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "inactive":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Active";
      case "inactive":
        return "Inactive";
      default:
        return status;
    }
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(
    currentPage * itemsPerPage,
    filteredDispensaries.length
  );
  const totalItems = filteredDispensaries.length;
  const resultsText = `Showing ${startItem ?? 0} to ${endItem ?? 0} of ${
    totalItems ?? 0
  } results`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Customers
        </h1>
        <Button
          onClick={handleAddDispensary}
          className="bg-myers-yellow text-myers-darkBlue hover:bg-yellow-400"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col space-y-4">
            {/* <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"></div> */}

            <div className="flex flex-wrap items-center justify-between gap-2">
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
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search customers..."
                  className="pl-8 w-full sm:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
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
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center">
                      Dispensaries Name
                      {sortField === "name" &&
                        (sortDirection === "asc" ? (
                          <ArrowUp className="ml-1 h-4 w-4" />
                        ) : (
                          <ArrowDown className="ml-1 h-4 w-4" />
                        ))}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => handleSort("contactPerson")}
                  >
                    <div className="flex items-center">
                      Customers Name
                      {sortField === "contactPerson" &&
                        (sortDirection === "asc" ? (
                          <ArrowUp className="ml-1 h-4 w-4" />
                        ) : (
                          <ArrowDown className="ml-1 h-4 w-4" />
                        ))}
                    </div>
                  </TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => handleSort("createdAt")}
                  >
                    <div className="flex items-center">
                      CreatedAt
                      {sortField === "createdAt" &&
                        (sortDirection === "asc" ? (
                          <ArrowUp className="ml-1 h-4 w-4" />
                        ) : (
                          <ArrowDown className="ml-1 h-4 w-4" />
                        ))}
                    </div>
                  </TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedDispensaries.length > 0 ? (
                  paginatedDispensaries.map((dispensary) => (
                    <TableRow key={dispensary.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          {dispensary.profilePicture ? (
                            <img
                              src={dispensary.profilePicture}
                              alt={`${dispensary.name} profile`}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-500">
                                {dispensary.name.charAt(0)}
                              </span>
                            </div>
                          )}
                          {dispensary.name}
                        </div>
                      </TableCell>
                      <TableCell>{dispensary.contactPerson}</TableCell>
                      <TableCell>{dispensary.email}</TableCell>
                      <TableCell>{dispensary.location}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getStatusColor(dispensary.status)}
                        >
                          {getStatusLabel(dispensary.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>{dispensary.createdAt}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleChatWithDispensary(dispensary)}
                          >
                            <MessageCircle className="h-4 w-4" />
                            <span className="sr-only">Chat</span>
                          </Button>
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
                          {/* <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteDispensary(dispensary)}
                          >
                            <Trash className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button> */}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => e.stopPropagation()}
                                className="text-red-500 hover:text-red-700 px-2"
                              >
                                <Trash className="h-4 w-4 mr-1" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete the "
                                  {dispensary.name}" Dispensary. This action
                                  cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleDeleteDispensary(dispensary)
                                  }
                                  className="bg-red-500 hover:bg-red-600 text-white"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-6 text-muted-foreground"
                    >
                      No dispensaries found
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
              {filteredDispensaries.length > 0 && (
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

      <Dialog
        open={!!viewingDispensary}
        onOpenChange={(open) => !open && setViewingDispensary(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
          </DialogHeader>
          {viewingDispensary && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-2">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Name</h3>
                  <p className="mt-1">{viewingDispensary.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Location
                  </h3>
                  <p className="mt-1">{viewingDispensary.location}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Category
                  </h3>
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
                  <h3 className="text-sm font-medium text-gray-500">
                    Contact Person
                  </h3>
                  <p className="mt-1">
                    {viewingDispensary.contactPerson || "—"}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                  <p className="mt-1">{viewingDispensary.phone || "—"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <p className="mt-1">{viewingDispensary.email || "—"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Assigned Engineer
                  </h3>
                  <p className="mt-1">
                    {viewingDispensary.assignedEngineer || "—"}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Last Service Date
                  </h3>
                  <p className="mt-1">
                    {viewingDispensary.lastServiceDate || "—"}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Created At
                  </h3>
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
