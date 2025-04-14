import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Plus,
  Search,
  Edit,
  Trash,
  Calendar,
  User,
  Clock,
  Eye,
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
import { Link, useNavigate } from "react-router-dom";
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

interface ServiceRequest {
  id: string;
  requestId: string;
  dispensaryName: string;
  dispensaryId: string;
  description: string;
  status: "pending" | "in-progress" | "resolved";
  priority: "low" | "medium" | "high" | "critical";
  assignedEngineer: string | null;
  requestDate: string;
  lastUpdated: string | null;
}

const mockServiceRequests: ServiceRequest[] = [
  {
    id: "1",
    requestId: "SR-2023-001",
    dispensaryName: "Downtown Dispensary",
    dispensaryId: "1",
    description: "Security camera malfunction in main entrance",
    status: "pending",
    priority: "high",
    assignedEngineer: null,
    requestDate: "2023-11-01",
    lastUpdated: null,
  },
  {
    id: "2",
    requestId: "SR-2023-002",
    dispensaryName: "Green Leaf Dispensary",
    dispensaryId: "2",
    description: "Software update required for POS system",
    status: "in-progress",
    priority: "medium",
    assignedEngineer: "Emma Roberts",
    requestDate: "2023-11-02",
    lastUpdated: "2023-11-03",
  },
  {
    id: "3",
    requestId: "SR-2023-003",
    dispensaryName: "Herbal Solutions",
    dispensaryId: "3",
    description: "Door access control system not functioning",
    status: "resolved",
    priority: "high",
    assignedEngineer: "James Wilson",
    requestDate: "2023-10-25",
    lastUpdated: "2023-10-28",
  },
  {
    id: "4",
    requestId: "SR-2023-004",
    dispensaryName: "Healing Center",
    dispensaryId: "4",
    description: "Regular maintenance check request",
    status: "in-progress",
    priority: "low",
    assignedEngineer: "Lisa Chen",
    requestDate: "2023-11-05",
    lastUpdated: "2023-11-05",
  },
  {
    id: "5",
    requestId: "SR-2023-005",
    dispensaryName: "Downtown Dispensary",
    dispensaryId: "1",
    description: "Alarm system false triggers",
    status: "pending",
    priority: "critical",
    assignedEngineer: null,
    requestDate: "2023-11-06",
    lastUpdated: null,
  },
  {
    id: "6",
    requestId: "SR-2023-006",
    dispensaryName: "Evergreen Dispensary",
    dispensaryId: "5",
    description: "Network configuration issues",
    status: "pending",
    priority: "medium",
    assignedEngineer: null,
    requestDate: "2023-11-07",
    lastUpdated: null,
  },
  {
    id: "7",
    requestId: "SR-2023-007",
    dispensaryName: "Wellness Dispensary",
    dispensaryId: "6",
    description: "Replace batteries in backup system",
    status: "in-progress",
    priority: "low",
    assignedEngineer: "David Lee",
    requestDate: "2023-11-08",
    lastUpdated: "2023-11-09",
  },
  {
    id: "8",
    requestId: "SR-2023-008",
    dispensaryName: "Green Zone",
    dispensaryId: "7",
    description: "Motion sensor calibration required",
    status: "pending",
    priority: "medium",
    assignedEngineer: null,
    requestDate: "2023-11-10",
    lastUpdated: null,
  },
];

const supportEngineers = [
  { id: "1", name: "James Wilson" },
  { id: "2", name: "Emma Roberts" },
  { id: "3", name: "David Lee" },
  { id: "4", name: "Lisa Chen" },
];

const dispensaries = [
  { id: "1", name: "Downtown Dispensary" },
  { id: "2", name: "Green Leaf Dispensary" },
  { id: "3", name: "Herbal Solutions" },
  { id: "4", name: "Healing Center" },
  { id: "5", name: "Evergreen Dispensary" },
  { id: "6", name: "Wellness Dispensary" },
  { id: "7", name: "Green Zone" },
  { id: "8", name: "Nature's Remedy" },
];

const initializeLocalStorage = () => {
  if (!localStorage.getItem("serviceRequests")) {
    localStorage.setItem(
      "serviceRequests",
      JSON.stringify(mockServiceRequests)
    );
  }
};

initializeLocalStorage();

const ServiceRequests: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRequest, setEditingRequest] = useState<ServiceRequest | null>(
    null
  );
  const [viewingRequest, setViewingRequest] = useState<ServiceRequest | null>(
    null
  );
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<string>("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: serviceRequests = [], refetch } = useQuery({
    queryKey: ["serviceRequests"],
    queryFn: () => {
      const storedData = localStorage.getItem("serviceRequests");
      return Promise.resolve(
        storedData ? JSON.parse(storedData) : mockServiceRequests
      );
    },
  });

  const filteredRequests = serviceRequests.filter((request) => {
    const matchesSearch =
      request.requestId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.dispensaryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.assignedEngineer
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      false;

    const matchesStatus = statusFilter ? request.status === statusFilter : true;
    const matchesPriority = priorityFilter
      ? request.priority === priorityFilter
      : true;

    return matchesSearch && matchesStatus && matchesPriority;
  });

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

  const handleViewRequest = (request: ServiceRequest) => {
    navigate(`/support-ticket/view/${request.id}`);
  };

  const handleDeleteRequest = (request: ServiceRequest) => {
    const updatedRequests = serviceRequests.filter((r) => r.id !== request.id);
    localStorage.setItem("serviceRequests", JSON.stringify(updatedRequests));
    refetch();

    toast({
      title: "Service Request Deleted",
      description: `Request ${request.requestId} has been deleted successfully.`,
    });
  };

  const handleSaveRequest = (formData: FormData) => {
    const dispensaryId = formData.get("dispensary") as string;
    const description = formData.get("description") as string;
    const priority = formData.get("priority") as
      | "low"
      | "medium"
      | "high"
      | "critical";
    const status = formData.get("status") as
      | "pending"
      | "in-progress"
      | "resolved";
    const assignedEngineer = formData.get("assignedEngineer") as string;
    const requestDate = formData.get("requestDate") as string;

    const dispensary = dispensaries.find((d) => d.id === dispensaryId);
    const dispensaryName = dispensary ? dispensary.name : "Unknown Dispensary";

    if (editingRequest) {
      const updatedRequests = serviceRequests.map((r) =>
        r.id === editingRequest.id
          ? {
              ...r,
              dispensaryId,
              dispensaryName,
              description,
              priority,
              status,
              assignedEngineer: assignedEngineer || null,
              requestDate,
              lastUpdated: new Date().toISOString().split("T")[0],
            }
          : r
      );
      localStorage.setItem("serviceRequests", JSON.stringify(updatedRequests));
      toast({
        title: "Service Request Updated",
        description: `Request ${editingRequest.requestId} has been updated successfully.`,
      });
    } else {
      const newRequestId = `SR-${new Date().getFullYear()}-${(
        serviceRequests.length + 1
      )
        .toString()
        .padStart(3, "0")}`;
      const newRequest: ServiceRequest = {
        id: Date.now().toString(),
        requestId: newRequestId,
        dispensaryId,
        dispensaryName,
        description,
        priority,
        status,
        assignedEngineer: assignedEngineer || null,
        requestDate,
        lastUpdated: null,
      };
      const updatedRequests = [...serviceRequests, newRequest];
      localStorage.setItem("serviceRequests", JSON.stringify(updatedRequests));
      toast({
        title: "Service Request Created",
        description: `New request ${newRequestId} has been created successfully.`,
      });
    }

    setShowAddForm(false);
    refetch();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "in-progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "resolved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      default:
        return "";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
      case "medium":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "high":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      case "critical":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "";
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
        pageNumbers.push("ellipsis-start");
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      if (endPage < totalPages - 1) {
        pageNumbers.push("ellipsis-end");
      }

      if (totalPages > 1) {
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, filteredRequests.length);
  const totalItems = filteredRequests.length;
  const resultsText = `Showing ${startItem ?? 0} to ${endItem ?? 0} of ${
    totalItems ?? 0
  } results`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Support Tickets
        </h1>
        {/* <Button onClick={handleAddRequest} className="bg-myers-yellow text-myers-darkBlue hover:bg-yellow-400">
          <Plus className="h-4 w-4 mr-2" />
          Add Service Request
        </Button> */}
      </div>

      {showAddForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              {editingRequest
                ? "Edit Service Request"
                : "Add New Service Request"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleSaveRequest(formData);
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="dispensary" className="text-sm font-medium">
                    Dispensary
                  </label>
                  <select
                    id="dispensary"
                    name="dispensary"
                    className="w-full px-3 py-2 border rounded-md"
                    defaultValue={editingRequest?.dispensaryId || ""}
                    required
                  >
                    <option value="">Select Dispensary</option>
                    {dispensaries.map((dispensary) => (
                      <option key={dispensary.id} value={dispensary.id}>
                        {dispensary.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Description
                  </label>
                  <Input
                    id="description"
                    name="description"
                    placeholder="Describe the issue"
                    defaultValue={editingRequest?.description || ""}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="priority" className="text-sm font-medium">
                    Priority
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    className="w-full px-3 py-2 border rounded-md"
                    defaultValue={editingRequest?.priority || "medium"}
                    required
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="status" className="text-sm font-medium">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    className="w-full px-3 py-2 border rounded-md"
                    defaultValue={editingRequest?.status || "pending"}
                    required
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="assignedEngineer"
                    className="text-sm font-medium"
                  >
                    Assigned Engineer
                  </label>
                  <select
                    id="assignedEngineer"
                    name="assignedEngineer"
                    className="w-full px-3 py-2 border rounded-md"
                    defaultValue={editingRequest?.assignedEngineer || ""}
                  >
                    <option value="">None</option>
                    {supportEngineers.map((engineer) => (
                      <option key={engineer.id} value={engineer.name}>
                        {engineer.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="requestDate" className="text-sm font-medium">
                    Request Date
                  </label>
                  <Input
                    id="requestDate"
                    name="requestDate"
                    type="date"
                    defaultValue={
                      editingRequest?.requestDate ||
                      new Date().toISOString().split("T")[0]
                    }
                    required
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
                  {editingRequest ? "Update" : "Create"} Request
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col space-y-4">
            {/* <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle>Service Requests List</CardTitle>
            </div> */}

            <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2">
              <div className="flex flex-wrap gap-2">
                <select
                  className="px-3 py-2 rounded-md border text-myers-darkBlue"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>

                <select
                  className="px-3 py-2 rounded-md border text-myers-darkBlue"
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
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tickets..."
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
                  <TableHead>Ticket No</TableHead>
                  <TableHead>Dispensary</TableHead>
                  {/* <TableHead>Description</TableHead> */}
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Assigned Engineer</TableHead>
                  <TableHead>Request Date</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedRequests.length > 0 ? (
                  paginatedRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">
                        {request.requestId}
                      </TableCell>
                      <TableCell>{request.dispensaryName}</TableCell>
                      {/* <TableCell className="max-w-xs truncate">{request.description}</TableCell> */}
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getStatusColor(request.status)}
                        >
                          {request.status.charAt(0).toUpperCase() +
                            request.status.slice(1).replace("-", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getPriorityColor(request.priority)}
                        >
                          {request.priority.charAt(0).toUpperCase() +
                            request.priority.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {request.assignedEngineer ? (
                          <div className="flex items-center">
                            <User className="h-3.5 w-3.5 mr-1.5 text-gray-500 dark:text-gray-400" />
                            {request.assignedEngineer}
                          </div>
                        ) : (
                          <span className="text-gray-500 dark:text-gray-400">
                            —
                          </span>
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
                          <span className="text-gray-500 dark:text-gray-400">
                            —
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" asChild>
                            <Link to={`/support-ticket/view/${request.id}`}>
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" asChild>
                            <Link to={`/support-ticket/edit/${request.id}`}>
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Link>
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
                                  {request.dispensaryName}" request. This action
                                  cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteRequest(request)}
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
                      colSpan={9}
                      className="text-center py-6 text-muted-foreground"
                    >
                      No support tickets found
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
                    setCurrentPage(1);
                  }}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>

              {filteredRequests.length > 0 && (
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
        open={!!viewingRequest}
        onOpenChange={(open) => !open && setViewingRequest(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Service Request Details</DialogTitle>
          </DialogHeader>
          {viewingRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-2">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Request ID
                  </h3>
                  <p className="mt-1">{viewingRequest.requestId}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Dispensary
                  </h3>
                  <p className="mt-1">{viewingRequest.dispensaryName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Description
                  </h3>
                  <p className="mt-1">{viewingRequest.description}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <Badge
                    variant="outline"
                    className={getStatusColor(viewingRequest.status)}
                  >
                    {viewingRequest.status.charAt(0).toUpperCase() +
                      viewingRequest.status.slice(1).replace("-", " ")}
                  </Badge>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Priority
                  </h3>
                  <Badge
                    variant="outline"
                    className={getPriorityColor(viewingRequest.priority)}
                  >
                    {viewingRequest.priority.charAt(0).toUpperCase() +
                      viewingRequest.priority.slice(1)}
                  </Badge>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Assigned Engineer
                  </h3>
                  <p className="mt-1">
                    {viewingRequest.assignedEngineer || "—"}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Request Date
                  </h3>
                  <p className="mt-1">{viewingRequest.requestDate}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Last Updated
                  </h3>
                  <p className="mt-1">{viewingRequest.lastUpdated || "—"}</p>
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => setViewingRequest(null)}
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

export default ServiceRequests;
