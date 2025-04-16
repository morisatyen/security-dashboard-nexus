import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";

interface ServiceRequest {
  id: string;
  requestId: string;
  dispensaryName: string;
  dispensaryId: string;
  description: string;
  status: "pending" | "in-progress" | "resolved";
  priority: "low" | "medium" | "high" | "critical";
  assignedEngineer: string | null;
  createdAt: string;
  lastUpdated: string | null;
}

// Mock data - in a real app, this would come from API/localStorage
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
    createdAt: "2023-11-01",
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
    createdAt: "2023-11-02",
    lastUpdated: "2023-11-03",
  },
  // Additional mock data would be here
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

const supportEngineers = [
  { id: "1", name: "James Wilson" },
  { id: "2", name: "Emma Roberts" },
  { id: "3", name: "David Lee" },
  { id: "4", name: "Lisa Chen" },
];

const ServiceRequestEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [serviceRequest, setServiceRequest] = useState<ServiceRequest | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchServiceRequest = () => {
      const storedRequests = localStorage.getItem("serviceRequests");
      const requests = storedRequests
        ? JSON.parse(storedRequests)
        : mockServiceRequests;
      const request = requests.find((r: ServiceRequest) => r.id === id);

      if (request) {
        setServiceRequest(request);
      }
      setLoading(false);
    };

    fetchServiceRequest();
  }, [id]);

  const handleChange = (field: string, value: string) => {
    if (serviceRequest) {
      setServiceRequest({
        ...serviceRequest,
        [field]: value,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!serviceRequest) return;

    // In a real app, this would be an API call
    const storedRequests = localStorage.getItem("serviceRequests");
    const requests = storedRequests
      ? JSON.parse(storedRequests)
      : mockServiceRequests;

    const updatedRequests = requests.map((r: ServiceRequest) =>
      r.id === serviceRequest.id
        ? {
            ...serviceRequest,
            lastUpdated: new Date().toISOString().split("T")[0],
          }
        : r
    );

    localStorage.setItem("serviceRequests", JSON.stringify(updatedRequests));

    toast({
      title: "Service Request Updated",
      description: `Request ${serviceRequest.requestId} has been updated successfully.`,
    });

    navigate("/support-ticket");
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center">
          <div className="w-8 h-8 border-4 border-myers-yellow border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!serviceRequest) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">
                Service Request Not Found
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                The service request you are looking for does not exist or has
                been removed.
              </p>
              <Button asChild>
                <Link to="/support-ticket">Back to Service Requests</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link to="/support-ticket">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Edit Support Ticket: {serviceRequest.requestId}
          </h1>
        </div>
      </div>

      <Card>
        {/* <CardHeader>
          <CardTitle>Service Request Details</CardTitle>
        </CardHeader> */}
        <CardContent className="mt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="dispensaryId" className="text-sm font-medium">
                  Customer Name
                </label>
                <Select
                  value={serviceRequest.dispensaryId}
                  onValueChange={(value) => handleChange("dispensaryId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Dispensary" />
                  </SelectTrigger>
                  <SelectContent>
                    {dispensaries.map((dispensary) => (
                      <SelectItem key={dispensary.id} value={dispensary.id}>
                        {dispensary.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description
                </label>
                <Input
                  id="description"
                  value={serviceRequest.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="priority" className="text-sm font-medium">
                  Types of Service Request
                </label>
                <Select
                  // value={serviceRequest.priority}
                  onValueChange={(value) =>
                    handleChange(
                      "type",
                      value as
                        | "technicalsupport"
                        | "installation"
                        | "testing"
                        | "security"
                        | "product"
                        | "service"
                        | "billing"
                        | "genralsupport"
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Types Of Service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technicalsupport">
                      Technical Support
                    </SelectItem>
                    <SelectItem value="installation">
                      Installation & Upgrade Requests
                    </SelectItem>
                    <SelectItem value="testing">
                      Testing & Compliance
                    </SelectItem>
                    <SelectItem value="security">
                      Security & Emergency
                    </SelectItem>
                    <SelectItem value="product">Product Inquiry</SelectItem>
                    <SelectItem value="service">Service Inquiry</SelectItem>
                    <SelectItem value="billing">
                      Billing or Payment Issues
                    </SelectItem>
                    <SelectItem value="genralsupport">
                      General Support
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 relative">
                <label htmlFor="priority" className="text-sm font-medium">
                  Priority
                </label>
                <Select
                  value={serviceRequest.priority}
                  onValueChange={(value) =>
                    handleChange(
                      "priority",
                      value as "low" | "medium" | "high" | "critical"
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 relative">
                <label htmlFor="status" className="text-sm font-medium">
                  Status
                </label>
                <Select
                  value={serviceRequest.status}
                  onValueChange={(value) =>
                    handleChange(
                      "status",
                      value as "pending" | "in-progress" | "resolved"
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 relative">
                <label
                  htmlFor="assignedEngineer"
                  className="text-sm font-medium"
                >
                  Assigned Engineer
                </label>
                <Select
                  value={serviceRequest.assignedEngineer || ""}
                  onValueChange={(value) =>
                    handleChange("assignedEngineer", value || null)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Engineer" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* <SelectItem value="">None</SelectItem> */}
                    {supportEngineers.map((engineer) => (
                      <SelectItem key={engineer.id} value={engineer.name}>
                        {engineer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="createdAt" className="text-sm font-medium">
                  Request Date
                </label>
                <Input
                  id="createdAt"
                  type="date"
                  value={serviceRequest.createdAt}
                  onChange={(e) => handleChange("createdAt", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => navigate("/support-ticket")}
              >
                Cancel
              </Button>
              <Button
                className="bg-myers-yellow text-myers-darkBlue hover:bg-yellow-400"
                type="submit"
              >
                Update Service Request
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceRequestEdit;
