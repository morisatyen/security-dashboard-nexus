import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Edit,
  Trash,
  Eye,
  ArrowUp,
  ArrowDown,
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
  title: string;
  bannerlink?: string;
  status: "active" | "inactive";
  createdAt: string;
  profilePicture?: string;
}

const mockBanners: Dispensary[] = [
  {
    id: "1",
    title: "John Dave",
    bannerlink: "john@downtown.com",
    status: "active",
    profilePicture: "/placeholder.svg",
    createdAt: "2025-02-05",
  },
  {
    id: "2",
    title: "IceGreen Leaf",
    status: "inactive",
    createdAt: "2025-03-12",
    bannerlink: "sarah@greenleaf.com",
    profilePicture: "",
  },
  {
    id: "3",
    title: "Stuart Bily",
    status: "active",
    createdAt: "2025-04-12",
    bannerlink: "sarah@greenleaf.com",
    profilePicture: "",
  },
];

const initializeLocalStorage = () => {
  if (!localStorage.getItem("BannersData")) {
    localStorage.setItem("BannersData", JSON.stringify(mockBanners));
  }
};

initializeLocalStorage();

type SortField = "title" | "createdAt";
type SortDirection = "asc" | "desc";

const ManageBanner: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [viewingDispensary, setViewingDispensary] = useState<Dispensary | null>(
    null
  );
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [sortField, setSortField] = useState<SortField>("title");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: dispensaries = [], refetch } = useQuery({
    queryKey: ["BannersData"],
    queryFn: () => {
      const storedData = localStorage.getItem("BannersData");
      return Promise.resolve(storedData ? JSON.parse(storedData) : mockBanners);
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
      const matchesSearch = dispensary.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter
        ? dispensary.status === statusFilter
        : true;

      return matchesSearch && matchesStatus;
    });

    return [...filtered].sort((a, b) => {
      if (sortField === "title") {
        return sortDirection === "asc"
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      } else {
        return sortDirection === "asc"
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
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
    navigate("/banners/add");
  };

  const handleEditDispensary = (dispensary: Dispensary) => {
    navigate(`/banners/edit/${dispensary.id}`);
  };

  const handleViewDispensary = (dispensary: Dispensary) => {
    navigate(`/banners/view/${dispensary.id}`);
  };

  const handleDeleteDispensary = (dispensary: Dispensary) => {
    const updatedDispensaries = dispensaries.filter(
      (d) => d.id !== dispensary.id
    );
    localStorage.setItem("dispensaries", JSON.stringify(updatedDispensaries));
    refetch();

    toast({
      title: "Benner Deleted",
      description: `${dispensary.title} has been deleted successfully.`,
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
          Manage Banners
        </h1>
        <Button
          onClick={handleAddDispensary}
          className="bg-myers-yellow text-myers-darkBlue hover:bg-yellow-400"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Banner
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
                  placeholder="Search banners..."
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
                    onClick={() => handleSort("title")}
                  >
                    <div className="flex items-center">
                      Banner Title
                      {sortField === "title" &&
                        (sortDirection === "asc" ? (
                          <ArrowUp className="ml-1 h-4 w-4" />
                        ) : (
                          <ArrowDown className="ml-1 h-4 w-4" />
                        ))}
                    </div>
                  </TableHead>

                  <TableHead>Banner Link</TableHead>

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
                  <TableHead className="text-end">Actions</TableHead>
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
                              alt={`${dispensary.title} profile`}
                              className="h-20 w-20 rounded-full border border-gray-200  object-cover"
                            />
                          ) : (
                            <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-500">
                                {dispensary.title.charAt(0)}
                              </span>
                            </div>
                          )}
                          {dispensary.title}
                        </div>
                      </TableCell>

                      <TableCell>{dispensary.bannerlink}</TableCell>

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
                          {/* <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewDispensary(dispensary)}
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button> */}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditDispensary(dispensary)}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
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
                      No banners found
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
            <DialogTitle>Banner Details</DialogTitle>
          </DialogHeader>
          {/* {viewingDispensary && (
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
          )} */}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageBanner;
