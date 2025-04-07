import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft, Send, Paperclip } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  timestamp: string;
  sender: "admin" | "customer";
  read: boolean;
}

interface CustomerChatData {
  id: string;
  name: string;
  avatar?: string;
  isOnline: boolean;
  messages: Message[];
}

const mockCustomerChats: Record<string, CustomerChatData> = {
  "1": {
    id: "1",
    name: "Downtown Dispensary",
    avatar: "/placeholder.svg",
    isOnline: true,
    messages: [
      {
        id: "1-1",
        text: "Hello, we're having an issue with our security system. One of the cameras seems to be offline.",
        timestamp: "2023-11-01T09:30:00",
        sender: "customer",
        read: true,
      },
      {
        id: "1-2",
        text: "I'm sorry to hear that. Can you tell me which camera location is affected?",
        timestamp: "2023-11-01T09:32:00",
        sender: "admin",
        read: true,
      },
      {
        id: "1-3",
        text: "It's the one at the back entrance. The indicator light is blinking red.",
        timestamp: "2023-11-01T09:33:00",
        sender: "customer",
        read: true,
      },
      {
        id: "1-4",
        text: "Thanks for the information. That typically indicates a connection issue. Have you tried restarting the system?",
        timestamp: "2023-11-01T09:34:00",
        sender: "admin",
        read: true,
      },
      {
        id: "1-5",
        text: "Yes, we've tried that but it didn't help.",
        timestamp: "2023-11-01T09:35:00",
        sender: "customer",
        read: true,
      },
      {
        id: "1-6",
        text: "I'll schedule a technician to visit your location today. Does 2 PM work for you?",
        timestamp: "2023-11-01T09:36:00",
        sender: "admin",
        read: true,
      },
      {
        id: "1-7",
        text: "That would be perfect. Thank you for the quick response!",
        timestamp: "2023-11-01T09:37:00",
        sender: "customer",
        read: true,
      },
      {
        id: "1-8",
        text: "Can you help us with our security system?",
        timestamp: "2023-11-01T10:25:00",
        sender: "customer",
        read: false,
      },
    ],
  },
  "2": {
    id: "2",
    name: "Green Leaf Dispensary",
    avatar: "/placeholder.svg",
    isOnline: false,
    messages: [
      {
        id: "2-1",
        text: "We'd like to upgrade our security system. What options do you recommend?",
        timestamp: "2023-10-31T14:10:00",
        sender: "customer",
        read: true,
      },
      {
        id: "2-2",
        text: "We have several packages that might suit your needs. Would you prefer to focus on video surveillance or a comprehensive solution?",
        timestamp: "2023-10-31T14:15:00",
        sender: "admin",
        read: true,
      },
      {
        id: "2-3",
        text: "We're interested in a comprehensive solution that includes access control.",
        timestamp: "2023-10-31T14:20:00",
        sender: "customer",
        read: true,
      },
      {
        id: "2-4",
        text: "Great choice. I'll send you our premium package details. It includes 24/7 monitoring, access control, and high-resolution cameras.",
        timestamp: "2023-10-31T14:25:00",
        sender: "admin",
        read: true,
      },
      {
        id: "2-5",
        text: "Thank you for your quick response!",
        timestamp: "2023-10-31T14:30:00",
        sender: "customer",
        read: true,
      },
    ],
  },
  "3": {
    id: "3",
    name: "Herbal Solutions",
    avatar: "/placeholder.svg",
    isOnline: true,
    messages: [
      {
        id: "3-1",
        text: "Good morning! We're experiencing issues with our camera system.",
        timestamp: "2023-10-30T08:15:00",
        sender: "customer",
        read: true,
      },
      {
        id: "3-2",
        text: "Good morning! I'm sorry to hear that. Could you describe the issue in more detail?",
        timestamp: "2023-10-30T08:20:00",
        sender: "admin",
        read: true,
      },
      {
        id: "3-3",
        text: "The footage is very grainy and sometimes cuts out completely.",
        timestamp: "2023-10-30T08:25:00",
        sender: "customer",
        read: true,
      },
      {
        id: "3-4",
        text: "That could be due to several factors. Let me schedule a diagnostic visit. How does tomorrow at 11 AM sound?",
        timestamp: "2023-10-30T08:30:00",
        sender: "admin",
        read: true,
      },
      {
        id: "3-5",
        text: "Tomorrow at 11 works perfectly. Thank you!",
        timestamp: "2023-10-30T08:35:00",
        sender: "customer",
        read: true,
      },
    ],
  },
  "4": {
    id: "4",
    name: "Healing Center",
    avatar: "/placeholder.svg",
    isOnline: false,
    messages: [
      {
        id: "4-1",
        text: "Hello, we'd like to inquire about maintenance for our security system.",
        timestamp: "2023-10-28T10:00:00",
        sender: "customer",
        read: true,
      },
      {
        id: "4-2",
        text: "Hi there! We offer regular maintenance plans. How old is your current system?",
        timestamp: "2023-10-28T10:05:00",
        sender: "admin",
        read: true,
      },
      {
        id: "4-3",
        text: "Our system is about 3 years old. We haven't had any major issues, but want to ensure it stays in good condition.",
        timestamp: "2023-10-28T10:10:00",
        sender: "customer",
        read: true,
      },
      {
        id: "4-4",
        text: "That's a good approach. For a 3-year-old system, we recommend our quarterly maintenance plan. It includes hardware checks, software updates, and cleaning.",
        timestamp: "2023-10-28T10:15:00",
        sender: "admin",
        read: true,
      },
      {
        id: "4-5",
        text: "When can we schedule a maintenance visit?",
        timestamp: "2023-10-28T10:20:00",
        sender: "customer",
        read: true,
      },
    ],
  },
  "5": {
    id: "5",
    name: "Evergreen Dispensary",
    avatar: "/placeholder.svg",
    isOnline: true,
    messages: [
      {
        id: "5-1",
        text: "Our alarm went off this morning. False alarm?",
        timestamp: "2023-10-25T07:30:00",
        sender: "customer",
        read: true,
      },
      {
        id: "5-2",
        text: "I'll look into that right away. Did you receive a call from our monitoring center?",
        timestamp: "2023-10-25T07:35:00",
        sender: "admin",
        read: true,
      },
      {
        id: "5-3",
        text: "Yes, they called. We confirmed it was a false alarm, but we're not sure what triggered it.",
        timestamp: "2023-10-25T07:40:00",
        sender: "customer",
        read: true,
      },
      {
        id: "5-4",
        text: "I can see in our logs that the motion sensor in your storage room was triggered. This could be due to a variety of factors - from actual movement to environmental changes.",
        timestamp: "2023-10-25T07:45:00",
        sender: "admin",
        read: true,
      },
      {
        id: "5-5",
        text: "Would you like us to send a technician to check the sensor?",
        timestamp: "2023-10-25T07:46:00",
        sender: "admin",
        read: true,
      },
      {
        id: "5-6",
        text: "Yes, please. Better to be safe.",
        timestamp: "2023-10-25T07:50:00",
        sender: "customer",
        read: true,
      },
    ],
  },
};

interface CustomerChatProps {
  customerId?: string;
}

const CustomerChat: React.FC<CustomerChatProps> = ({ customerId }) => {
  const [message, setMessage] = useState("");
  const [chatData, setChatData] = useState<CustomerChatData | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (customerId && mockCustomerChats[customerId]) {
      setChatData(mockCustomerChats[customerId]);
    }
  }, [customerId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatData?.messages]);

  const handleSendMessage = () => {
    if (!message.trim() || !chatData) return;

    const newMessage: Message = {
      id: `${chatData.id}-${chatData.messages.length + 1}`,
      text: message,
      timestamp: new Date().toISOString(),
      sender: "admin",
      read: false,
    };

    const updatedChat = {
      ...chatData,
      messages: [...chatData.messages, newMessage],
    };

    setChatData(updatedChat);
    setMessage("");

    // In a real app, you would send this to an API
    // For now, we'll just update our mock data
    mockCustomerChats[chatData.id] = updatedChat;
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (!chatData) {
    return null;
  }

  // Group messages by date for display
  const messagesByDate: Record<string, Message[]> = {};
  chatData.messages.forEach(msg => {
    const date = formatDate(msg.timestamp);
    if (!messagesByDate[date]) {
      messagesByDate[date] = [];
    }
    messagesByDate[date].push(msg);
  });

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b dark:border-gray-700 flex items-center space-x-3">
        <div className="relative">
          <Avatar className="h-10 w-10">
            <AvatarImage src={chatData.avatar} alt={chatData.name} />
            <AvatarFallback>{chatData.name[0]}</AvatarFallback>
          </Avatar>
          {chatData.isOnline && (
            <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white dark:ring-gray-900"></span>
          )}
        </div>
        <div>
          <h2 className="text-lg font-medium">{chatData.name}</h2>
          <p className="text-sm text-gray-500">
            {chatData.isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
        <div className="space-y-4">
          {Object.entries(messagesByDate).map(([date, msgs]) => (
            <div key={date}>
              <div className="flex justify-center my-3">
                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs">
                  {date}
                </span>
              </div>
              {msgs.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender === "admin" ? "justify-end" : "justify-start"
                  } mb-2`}
                >
                  {msg.sender === "customer" && (
                    <Avatar className="h-8 w-8 mr-2 flex-shrink-0 self-end">
                      <AvatarImage src={chatData.avatar} alt={chatData.name} />
                      <AvatarFallback>{chatData.name[0]}</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-[70%] px-4 py-2 rounded-lg ${
                      msg.sender === "admin"
                        ? "bg-myers-yellow text-myers-darkBlue"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                    <p
                      className={`text-xs mt-1 ${
                        msg.sender === "admin"
                          ? "text-myers-darkBlue/70"
                          : "text-gray-500"
                      }`}
                    >
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <div className="p-4 border-t dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon">
            <Paperclip className="h-5 w-5" />
          </Button>
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button 
            className="bg-myers-yellow text-myers-darkBlue hover:bg-yellow-400"
            onClick={handleSendMessage}
            disabled={!message.trim()}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CustomerChat;
