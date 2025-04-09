import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Invoices from "./Invoices";
import Payments from "./Payments";
import Agreements from "./Agreements";

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
    queryKey: ["dispensary", id],
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
            <p>Loading customers details...</p>
          </CardContent>
        </Card>
      </div>
    );
  }  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dispensaries")}
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
            {dispensary.status.charAt(0).toUpperCase() +
              dispensary.status.slice(1)}
          </Badge>
        </div>
      </div>

      <Tabs
        defaultValue="details"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
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
          {/* <TabsTrigger
            value="payments"
            className="data-[state=active]:border-b-2 data-[state=active]:border-myers-yellow rounded-none border-transparent px-4 py-2"
          >
            Payments
          </TabsTrigger> */}
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
              <CardTitle>Customer Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Profile
                    </h3>
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
                    <h3 className="text-sm font-medium text-gray-500">
                      Dispensary Name
                    </h3>
                    <p className="mt-1">{dispensary.name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Location
                    </h3>
                    <p className="mt-1">{dispensary.location}</p>
                  </div>
                  {/* <div>
                    <h3 className="text-sm font-medium text-gray-500">Category</h3>
                    <p className="mt-1">{dispensary.category}</p>
                  </div> */}
                </div>

                <div className="flex flex-col gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Customer Name
                    </h3>
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
                    <h3 className="text-sm font-medium text-gray-500">
                      Assigned Engineer
                    </h3>
                    <p className="mt-1">{dispensary.assignedEngineer || "—"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Last Service Date
                    </h3>
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

        {/* <TabsContent value="payments">
          <Payments dispensaryId={id} viewMode={true} />
        </TabsContent> */}

        <TabsContent value="agreements">
          <Agreements dispensaryId={id} viewMode={true}/>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DispensaryView;
