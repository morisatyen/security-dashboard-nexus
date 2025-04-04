
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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
];

const Chat: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredCustomers = mockChatCustomers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Customer Chats</h1>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle>All Conversations</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-y-auto max-h-[600px]">
            {filteredCustomers.length > 0 ? (
              <ul className="space-y-1">
                {filteredCustomers.map((customer) => (
                  <li key={customer.id}>
                    <button
                      className="w-full px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-start justify-between"
                      onClick={() => navigate(`/customer-chat/${customer.id}`)}
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
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[280px]">
                            {customer.lastMessage}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">{customer.timestamp}</span>
                    </button>
                    <Separator className="mt-1" />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="py-10 text-center text-gray-500 dark:text-gray-400">
                No chat conversations found.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Chat;
