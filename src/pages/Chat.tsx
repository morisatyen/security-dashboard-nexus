
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import CustomerChat from "./CustomerChat";

interface ChatCustomer {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  avatar?: string;
  isOnline: boolean;
}

const mockChatCustomers: ChatCustomer[] = [
  {
    id: "1",
    name: "Downtown Dispensary",
    lastMessage: "Can you help us with our security system?",
    timestamp: "10:25 AM",
    unread: 3,
    avatar: "/placeholder.svg",
    isOnline: true,
  },
  {
    id: "2",
    name: "Green Leaf Dispensary",
    lastMessage: "Thank you for your quick response!",
    timestamp: "Yesterday",
    unread: 0,
    avatar: "/placeholder.svg",
    isOnline: false,
  },
  {
    id: "3",
    name: "Herbal Solutions",
    lastMessage: "We're experiencing issues with our camera system.",
    timestamp: "2 days ago",
    unread: 1,
    avatar: "/placeholder.svg",
    isOnline: true,
  },
  {
    id: "4",
    name: "Healing Center",
    lastMessage: "When can we schedule a maintenance visit?",
    timestamp: "Oct 28",
    unread: 0,
    avatar: "/placeholder.svg",
    isOnline: false,
  },
  {
    id: "5",
    name: "Evergreen Dispensary",
    lastMessage: "Our alarm went off this morning. False alarm?",
    timestamp: "Oct 25",
    unread: 0,
    avatar: "/placeholder.svg",
    isOnline: true,
  },
  {
    id: "6",
    name: "Evergreen Dispensary",
    lastMessage: "Our alarm went off this morning. False alarm?",
    timestamp: "Oct 25",
    unread: 0,
    avatar: "/placeholder.svg",
    isOnline: true,
  },
  {
    id: "7",
    name: "Evergreen Dispensary",
    lastMessage: "Our alarm went off this morning. False alarm?",
    timestamp: "Oct 25",
    unread: 0,
    avatar: "/placeholder.svg",
    isOnline: true,
  },
  {
    id: "8",
    name: "Evergreen Dispensary",
    lastMessage: "Our alarm went off this morning. False alarm?",
    timestamp: "Oct 25",
    unread: 0,
    avatar: "/placeholder.svg",
    isOnline: true,
  },
];

const Chat: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredCustomers = mockChatCustomers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Customer Chats</h1>
      </div>

      <div className="flex h-full bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
        {/* Left Sidebar - User List */}
        <div className="w-full md:w-1/3 lg:w-1/4 border-r dark:border-gray-700 flex flex-col">
          <div className="p-4 border-b dark:border-gray-700">
            <div className="relative w-full">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="overflow-y-auto flex-1">
            {filteredCustomers.length > 0 ? (
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredCustomers.map((customer) => (
                  <li key={customer.id}>
                    <button
                      className={`w-full px-4 py-3 flex items-start justify-between hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
                        id === customer.id ? "bg-gray-100 dark:bg-gray-800" : ""
                      }`}
                      onClick={() => navigate(`/chat/${customer.id}`)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="relative">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={customer.avatar} alt={customer.name} />
                            <AvatarFallback>{customer.name[0]}</AvatarFallback>
                          </Avatar>
                          {customer.isOnline && (
                            <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white dark:ring-gray-900"></span>
                          )}
                        </div>
                        <div className="text-left">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              {customer.name}
                            </h3>
                            {customer.unread > 0 && (
                              <Badge className="bg-myers-yellow text-myers-darkBlue">
                                {customer.unread}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[180px]">
                            {customer.lastMessage}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">{customer.timestamp}</span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="py-10 text-center text-gray-500 dark:text-gray-400">
                No chat conversations found.
              </div>
            )}
          </div>
        </div>
        
        {/* Right Section - Chat Content */}
        <div className="hidden md:flex md:w-2/3 lg:w-3/4 flex-col">
          {id ? (
            <CustomerChat customerId={id} />
          ) : (
            <div className="flex-1 flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-900">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Select a conversation</h3>
                <p className="text-gray-500 dark:text-gray-400">Choose a customer from the list to view your conversation.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
