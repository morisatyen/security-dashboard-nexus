import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Send,
  Calendar,
  User,
  Clock,
  Download,
  PaperclipIcon,
  SmilePlus,
  Edit,
  Pencil,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

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
  messages?: Message[];
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: "customer" | "admin" | "engineer";
  content: string;
  timestamp: string;
  attachments?: Attachment[];
}

interface Attachment {
  id: string;
  name: string;
  size: string;
  type: string;
  url: string;
}

const mockAttachments: Attachment[] = [
  {
    id: "att-1",
    name: "Error_Screenshot.png",
    size: "1.2 MB",
    type: "image/png",
    url: "#",
  },
  {
    id: "att-2",
    name: "System_Logs.txt",
    size: "256 KB",
    type: "text/plain",
    url: "#",
  },
];

// Mock messages for the conversation history
const generateMockMessages = (requestId: string): Message[] => [
  {
    id: "msg-1",
    senderId: "customer-1",
    senderName: "Downtown Dispensary",
    senderRole: "customer",
    content:
      "Hello, our security camera at the main entrance is not working properly. The feed keeps freezing every few minutes. We've tried restarting the system but the issue persists.",
    timestamp: "2023-11-01T09:30:00",
    attachments: [mockAttachments[0]],
  },
  {
    id: "msg-2",
    senderId: "admin-1",
    senderName: "Support Team",
    senderRole: "admin",
    content:
      "Thank you for reporting this issue. We'll look into it right away. Could you please provide more details about when this problem started?",
    timestamp: "2023-11-01T10:15:00",
  },
  {
    id: "msg-3",
    senderId: "customer-1",
    senderName: "Downtown Dispensary",
    senderRole: "customer",
    content:
      "It started yesterday evening around 8 PM. We also noticed that the camera makes a clicking sound occasionally.",
    timestamp: "2023-11-01T10:45:00",
  },
  {
    id: "msg-4",
    senderId: "engineer-1",
    senderName: "Emma Roberts",
    senderRole: "engineer",
    content:
      "I've reviewed the issue and it seems like there might be a problem with the camera's connection or power supply. I'll schedule a visit to your location to check the hardware. In the meantime, could you try connecting the camera to a different power outlet?",
    timestamp: "2023-11-01T11:30:00",
    attachments: [mockAttachments[1]],
  },
];

const ServiceRequestView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const messageInputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [newMessage, setNewMessage] = useState("");
  const [messageHistory, setMessageHistory] = useState<Message[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingEngineer, setIsEditingEngineer] = useState(false);
  const { data: serviceRequest, isLoading } = useQuery({
    queryKey: ["serviceRequest", id],
    queryFn: () => {
      const storedData = localStorage.getItem("serviceRequests");
      const allRequests = storedData ? JSON.parse(storedData) : [];
      const request = allRequests.find((req: ServiceRequest) => req.id === id);

      // If request exists but has no messages, add mock messages
      if (request && !request.messages) {
        request.messages = generateMockMessages(request.requestId);
      }

      return request || null;
    },
  });
  const [selectedStatus, setSelectedStatus] = useState(
    serviceRequest?.status || "pending"
  );
  const [selectedEngineer, setSelectedEngineer] = useState(
    serviceRequest?.assignedEngineer || ""
  );
  const statusOptions = ["pending", "in-progress", "resolved"];
  const engineers = ["Ravi", "Sneha", "Arjun", "Priya"];

  useEffect(() => {
    if (serviceRequest?.messages) {
      setMessageHistory(serviceRequest.messages);
    }
  }, [serviceRequest]);

  // useEffect(() => {
  //   scrollToBottom();
  // }, [messageHistory]);

  // const scrollToBottom = () => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // };

  const handleBack = () => {
    navigate("/service-requests");
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const currentDateTime = new Date().toISOString();

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      senderId: "admin-1",
      senderName: "Support Team",
      senderRole: "admin",
      content: newMessage,
      timestamp: currentDateTime,
    };

    setMessageHistory([...messageHistory, newMsg]);
    setNewMessage("");

    // Update localStorage with the new message
    if (id) {
      const storedData = localStorage.getItem("serviceRequests");
      const allRequests = storedData ? JSON.parse(storedData) : [];
      const updatedRequests = allRequests.map((req: ServiceRequest) => {
        if (req.id === id) {
          return {
            ...req,
            messages: [...(req.messages || []), newMsg],
            lastUpdated: currentDateTime.split("T")[0],
            status: req.status === "pending" ? "in-progress" : req.status,
          };
        }
        return req;
      });

      localStorage.setItem("serviceRequests", JSON.stringify(updatedRequests));
    }

    toast({
      title: "Response Sent",
      description: "Your response has been sent successfully.",
    });

    // Focus back on the input
    if (messageInputRef.current) {
      messageInputRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
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

  const handleStatusUpdate = () => {
    //update status api
  };
  const handleEngineerUpdate = () => {
    //api
    setIsEditingEngineer(false);
  };
  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-myers-yellow border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!serviceRequest) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">
                Service Request Not Found
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                The service request you're looking for doesn't exist or has been
                removed.
              </p>
              <Button onClick={handleBack}>Go Back to Service Requests</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={handleBack} size="icon">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Request: {serviceRequest.requestId}
        </h1>
        <Badge
          variant="outline"
          className={cn("mt-1", getStatusColor(serviceRequest.status))}
        >
          {serviceRequest.status.charAt(0).toUpperCase() +
            serviceRequest.status.slice(1).replace("-", " ")}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Request details column */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between w-full">
                <CardTitle>Request Details</CardTitle>
                <Link
                  to={`/service-requests/edit/${serviceRequest.id}`}
                  className="flex items-center gap-1 text-sm  hover:underline"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Customer Name
                </h3>
                <p className="mt-1 font-medium">
                  {serviceRequest.dispensaryName}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Issue Description
                </h3>
                <p className="mt-1">{serviceRequest.description}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Status
                </h3>

                {isEditing ? (
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="mt-1 border border-gray-300 rounded px-2 py-1 text-myers-darkBlue"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() +
                          status.slice(1).replace("-", " ")}
                      </option>
                    ))}
                  </select>
                ) : (
                  <Badge
                    variant="outline"
                    className={cn(
                      "mt-1",
                      getStatusColor(serviceRequest.status)
                    )}
                  >
                    {serviceRequest.status.charAt(0).toUpperCase() +
                      serviceRequest.status.slice(1).replace("-", " ")}
                  </Badge>
                )}
                <button
                  onClick={() => {
                    if (isEditing) {
                      handleStatusUpdate();
                    }
                    setIsEditing(!isEditing);
                  }}
                  className="ml-5 text-blue-700 text-sm underline"
                >
                  {isEditing ? (
                    <>
                      <Save className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <Edit className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Priority
                </h3>
                <Badge
                  variant="outline"
                  className={cn(
                    "mt-1",
                    getPriorityColor(serviceRequest.priority)
                  )}
                >
                  {serviceRequest.priority.charAt(0).toUpperCase() +
                    serviceRequest.priority.slice(1)}
                </Badge>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Assigned Support Engineer
                </h3>

                <div className="mt-1 flex items-center gap-2">
                  {isEditingEngineer ? (
                    <>
                      <select
                        value={selectedEngineer}
                        onChange={(e) => setSelectedEngineer(e.target.value)}
                        className="text-sm border rounded px-2 py-1 text-myers-darkBlue"
                      >
                        <option value="">Select Engineer</option>
                        {engineers.map((eng) => (
                          <option key={eng} value={eng}>
                            {eng}
                          </option>
                        ))}
                      </select>

                      <button onClick={handleEngineerUpdate} className="ml-5">
                        <Save className="w-4 h-4 text-blue-500" />
                      </button>
                    </>
                  ) : (
                    <>
                      {serviceRequest.assignedEngineer ? (
                        <p className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                          <User className="h-3.5 w-3.5 mr-1.5 text-gray-500 dark:text-gray-400" />
                          {serviceRequest.assignedEngineer}
                        </p>
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400 text-sm">
                          Unassigned
                        </span>
                      )}

                      <button onClick={() => setIsEditingEngineer(true)} className="ml-5">
                        <Edit className="w-4 h-4 text-blue-700" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Request Date
                </h3>
                <p className="mt-1 flex items-center">
                  <Calendar className="h-3.5 w-3.5 mr-1.5 text-gray-500 dark:text-gray-400" />
                  {serviceRequest.requestDate}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Last Updated
                </h3>
                <p className="mt-1 flex items-center">
                  <Clock className="h-3.5 w-3.5 mr-1.5 text-gray-500 dark:text-gray-400" />
                  {serviceRequest.lastUpdated || "Not updated yet"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat column */}
        <div className="lg:col-span-1">
          <Card className="flex flex-col h-full">
            <CardHeader>
              <CardTitle>Communication History</CardTitle>
              <CardDescription>
                View and respond to the conversation with{" "}
                {serviceRequest.dispensaryName}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow overflow-hidden">
              <div className="h-[500px] overflow-y-auto mb-4 pr-4 space-y-4">
                {messageHistory.map((message) => (
                  <div key={message.id} className="mb-4 last:mb-0">
                    <div
                      className={cn(
                        "flex flex-col",
                        message.senderRole === "admin" ||
                          message.senderRole === "engineer"
                          ? "items-end"
                          : "items-start"
                      )}
                    >
                      <div className="flex items-start mb-1 gap-2">
                        <Avatar
                          className={cn(
                            message.senderRole === "admin" ||
                              message.senderRole === "engineer"
                              ? "order-last"
                              : ""
                          )}
                        >
                          <AvatarFallback
                            className={cn(
                              message.senderRole === "customer"
                                ? "bg-blue-100 text-blue-800"
                                : message.senderRole === "engineer"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-green-100 text-green-800"
                            )}
                          >
                            {message.senderName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={cn(
                            "max-w-md rounded-lg px-4 py-2 shadow-sm",
                            message.senderRole === "admin"
                              ? "bg-myers-yellow text-myers-darkBlue"
                              : message.senderRole === "engineer"
                              ? "bg-purple-100 text-purple-900 dark:bg-purple-900 dark:text-purple-100"
                              : "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
                          )}
                        >
                          <div className="mb-1 flex items-center">
                            <span className="font-medium">
                              {message.senderName}
                            </span>
                            <span className="ml-2 text-xs opacity-70">
                              {formatTimestamp(message.timestamp)}
                            </span>
                          </div>
                          <div className="whitespace-pre-wrap">
                            {message.content}
                          </div>

                          {message.attachments &&
                            message.attachments.length > 0 && (
                              <div className="mt-2 space-y-2">
                                {message.attachments.map((attachment) => (
                                  <div
                                    key={attachment.id}
                                    className="flex items-center gap-2 p-2 rounded bg-white/20 dark:bg-black/20"
                                  >
                                    <PaperclipIcon className="h-4 w-4" />
                                    <span className="text-sm flex-grow truncate">
                                      {attachment.name}
                                    </span>
                                    <span className="text-xs">
                                      {attachment.size}
                                    </span>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6 p-0"
                                    >
                                      <Download className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </CardContent>
            <CardFooter className="border-t p-4">
              <div className="flex flex-col w-full space-y-2">
                <Textarea
                  ref={messageInputRef}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your response here..."
                  className="min-h-[80px] resize-none"
                />
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <PaperclipIcon className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <SmilePlus className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-myers-yellow text-myers-darkBlue hover:bg-yellow-400"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send Response
                  </Button>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ServiceRequestView;
