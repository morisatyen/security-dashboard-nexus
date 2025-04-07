
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Edit } from "lucide-react";
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
  const [isEditingInvoice, setIsEditingInvoice] = useState(false);
  const [isEditingPayment, setIsEditingPayment] = useState(false);
  const [isEditingAgreement, setIsEditingAgreement] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

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

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setIsEditingInvoice(false);
    setIsEditingPayment(false);
    setIsEditingAgreement(false);
    setSelectedItemId(null);
  };

  const handleEditInvoice = (invoiceId: string) => {
    setIsEditingInvoice(true);
    setSelectedItemId(invoiceId);
  };

  const handleEditPayment = (paymentId: string) => {
    setIsEditingPayment(true);
    setSelectedItemId(paymentId);
  };

  const handleEditAgreement = (agreementId: string) => {
    setIsEditingAgreement(true);
    setSelectedItemId(agreementId);
  };

  const handleCancelEdit = () => {
    setIsEditingInvoice(false);
    setIsEditingPayment(false);
    setIsEditingAgreement(false);
    setSelectedItemId(null);
  };

  if (!dispensary) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <p>Loading customer details...</p>
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
        onValueChange={handleTabChange}
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
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Invoices</h2>
            <div className="flex gap-2">
              {isEditingInvoice ? (
                <Button 
                  variant="outline" 
                  onClick={handleCancelEdit}
                >
                  Cancel
                </Button>
              ) : (
                <Button 
                  onClick={() => handleEditInvoice("new")}
                  className="bg-myers-yellow text-myers-darkBlue hover:bg-yellow-400 flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Invoice
                </Button>
              )}
            </div>
          </div>
          
          {isEditingInvoice ? (
            <Card>
              <CardHeader>
                <CardTitle>{selectedItemId === "new" ? "Add New Invoice" : "Edit Invoice"}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8 text-gray-500">Invoice edit form would go here</p>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={handleCancelEdit}>Cancel</Button>
                  <Button className="bg-myers-yellow text-myers-darkBlue hover:bg-yellow-400">
                    Save Invoice
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Invoices dispensaryId={id} viewMode={true} onEdit={handleEditInvoice} />
          )}
        </TabsContent>

        <TabsContent value="payments">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Payments</h2>
            <div className="flex gap-2">
              {isEditingPayment ? (
                <Button 
                  variant="outline" 
                  onClick={handleCancelEdit}
                >
                  Cancel
                </Button>
              ) : (
                <Button 
                  onClick={() => handleEditPayment("new")}
                  className="bg-myers-yellow text-myers-darkBlue hover:bg-yellow-400 flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Payment
                </Button>
              )}
            </div>
          </div>
          
          {isEditingPayment ? (
            <Card>
              <CardHeader>
                <CardTitle>{selectedItemId === "new" ? "Add New Payment" : "Edit Payment"}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8 text-gray-500">Payment edit form would go here</p>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={handleCancelEdit}>Cancel</Button>
                  <Button className="bg-myers-yellow text-myers-darkBlue hover:bg-yellow-400">
                    Save Payment
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Payments dispensaryId={id} viewMode={true} onEdit={handleEditPayment} />
          )}
        </TabsContent>

        <TabsContent value="agreements">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Service Agreements</h2>
            <div className="flex gap-2">
              {isEditingAgreement ? (
                <Button 
                  variant="outline" 
                  onClick={handleCancelEdit}
                >
                  Cancel
                </Button>
              ) : (
                <Button 
                  onClick={() => handleEditAgreement("new")}
                  className="bg-myers-yellow text-myers-darkBlue hover:bg-yellow-400 flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Agreement
                </Button>
              )}
            </div>
          </div>
          
          {isEditingAgreement ? (
            <Card>
              <CardHeader>
                <CardTitle>{selectedItemId === "new" ? "Add New Agreement" : "Edit Agreement"}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8 text-gray-500">Agreement edit form would go here</p>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={handleCancelEdit}>Cancel</Button>
                  <Button className="bg-myers-yellow text-myers-darkBlue hover:bg-yellow-400">
                    Save Agreement
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Agreements dispensaryId={id} viewMode={true} onEdit={handleEditAgreement} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DispensaryView;
