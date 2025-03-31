
import React, { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Invoices from "./Invoices";

// Dummy data components for the other tabs
const PaymentsTab = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="rounded-md border overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="p-4 text-left font-medium">Payment ID</th>
              <th className="p-4 text-left font-medium">Amount</th>
              <th className="p-4 text-left font-medium">Date</th>
              <th className="p-4 text-left font-medium">Method</th>
              <th className="p-4 text-left font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="p-4">PAY-2023-001</td>
              <td className="p-4">$1,250.00</td>
              <td className="p-4">Oct 12, 2023</td>
              <td className="p-4">Credit Card</td>
              <td className="p-4">
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                  Completed
                </Badge>
              </td>
            </tr>
            <tr className="border-t">
              <td className="p-4">PAY-2023-002</td>
              <td className="p-4">$750.00</td>
              <td className="p-4">Nov 5, 2023</td>
              <td className="p-4">Bank Transfer</td>
              <td className="p-4">
                <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                  Pending
                </Badge>
              </td>
            </tr>
            <tr className="border-t">
              <td className="p-4">PAY-2023-003</td>
              <td className="p-4">$500.00</td>
              <td className="p-4">Oct 25, 2023</td>
              <td className="p-4">Credit Card</td>
              <td className="p-4">
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                  Completed
                </Badge>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ServiceAgreementsTab = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="rounded-md border overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="p-4 text-left font-medium">Agreement ID</th>
              <th className="p-4 text-left font-medium">Type</th>
              <th className="p-4 text-left font-medium">Start Date</th>
              <th className="p-4 text-left font-medium">End Date</th>
              <th className="p-4 text-left font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="p-4">AGR-2023-001</td>
              <td className="p-4">Maintenance</td>
              <td className="p-4">Jan 1, 2023</td>
              <td className="p-4">Dec 31, 2023</td>
              <td className="p-4">
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                  Active
                </Badge>
              </td>
            </tr>
            <tr className="border-t">
              <td className="p-4">AGR-2023-002</td>
              <td className="p-4">Security</td>
              <td className="p-4">Mar 15, 2023</td>
              <td className="p-4">Mar 14, 2024</td>
              <td className="p-4">
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                  Active
                </Badge>
              </td>
            </tr>
            <tr className="border-t">
              <td className="p-4">AGR-2022-003</td>
              <td className="p-4">Emergency Support</td>
              <td className="p-4">Sep 1, 2022</td>
              <td className="p-4">Aug 31, 2023</td>
              <td className="p-4">
                <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                  Expired
                </Badge>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

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

const DispensaryView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("details");
  
  // Fetch dispensary data from localStorage
  const { data: dispensary } = useQuery({
    queryKey: ['dispensary', id],
    queryFn: () => {
      const storedData = localStorage.getItem("dispensaries");
      const dispensaries = storedData ? JSON.parse(storedData) : [];
      const foundDispensary = dispensaries.find((d: Dispensary) => d.id === id);
      
      if (!foundDispensary) {
        throw new Error("Dispensary not found");
      }
      
      return foundDispensary;
    },
  });
  
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

  if (!dispensary) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <p>Loading dispensary details...</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost"
            size="icon"
            onClick={() => navigate('/dispensaries')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {dispensary.name}
          </h1>
          <Badge 
            variant="outline"
            className={getStatusColor(dispensary.status)}
          >
            {dispensary.status.charAt(0).toUpperCase() + dispensary.status.slice(1)}
          </Badge>
        </div>
      </div>
      
      <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full flex justify-start border-b bg-transparent p-0">
          <TabsTrigger 
            value="details" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-myers-yellow rounded-none border-transparent px-4 py-2"
          >
            Details
          </TabsTrigger>
          <TabsTrigger 
            value="invoices" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-myers-yellow rounded-none border-transparent px-4 py-2"
          >
            Invoices
          </TabsTrigger>
          <TabsTrigger 
            value="payments" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-myers-yellow rounded-none border-transparent px-4 py-2"
          >
            Payments
          </TabsTrigger>
          <TabsTrigger 
            value="agreements" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-myers-yellow rounded-none border-transparent px-4 py-2"
          >
            Service Agreements
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Dispensary Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Profile</h3>
                    <div className="mt-2 flex items-center">
                      {dispensary.profilePicture ? (
                        <img 
                          src={dispensary.profilePicture} 
                          alt={`${dispensary.name} profile`}
                          className="h-20 w-20 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-xl text-gray-500">
                            {dispensary.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Name</h3>
                    <p className="mt-1">{dispensary.name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Location</h3>
                    <p className="mt-1">{dispensary.location}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Category</h3>
                    <p className="mt-1">{dispensary.category}</p>
                  </div>
                </div>
                
                <div className="flex flex-col gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Contact Person</h3>
                    <p className="mt-1">{dispensary.contactPerson || "—"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                    <p className="mt-1">{dispensary.phone || "—"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                    <p className="mt-1">{dispensary.email || "—"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Assigned Engineer</h3>
                    <p className="mt-1">{dispensary.assignedEngineer || "—"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Last Service Date</h3>
                    <p className="mt-1">{dispensary.lastServiceDate || "—"}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="invoices">
          <Invoices dispensaryId={id} viewMode={true} />
        </TabsContent>
        
        <TabsContent value="payments">
          <PaymentsTab />
        </TabsContent>
        
        <TabsContent value="agreements">
          <ServiceAgreementsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DispensaryView;
