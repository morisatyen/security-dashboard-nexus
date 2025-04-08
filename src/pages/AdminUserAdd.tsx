import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SupportEngineer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  specialization: string;
  region: string;
  status: "active" | "inactive";
  activeRequests: number;
  joinedDate: string;
}

const AdminUserAdd: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const phone = formData.get("phone") as string;
    const specialization = formData.get("specialization") as string;
    const region = formData.get("region") as string;
    const status = formData.get("status") as "active" | "inactive";

    const newEngineer: SupportEngineer = {
      id: Date.now().toString(),
      firstName,
      lastName,
      email,
      password,
      phone,
      specialization,
      region,
      status,
      activeRequests: 0,
      joinedDate: new Date().toISOString().split("T")[0],
    };

    // Save to localStorage
    const storedData = localStorage.getItem("supportEngineers");
    const engineers = storedData ? JSON.parse(storedData) : [];
    const updatedEngineers = [...engineers, newEngineer];
    localStorage.setItem("supportEngineers", JSON.stringify(updatedEngineers));

    // Show success message
    toast({
      title: "Admin User Created",
      description: `${firstName} ${lastName} has been created successfully.`,
    });

    // Redirect back to the list page
    setTimeout(() => {
      navigate("/users/admin-users");
    }, 1000);
  };

  const handleCancel = () => {
    navigate("/users/admin-users");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" onClick={handleCancel} className="p-0 h-auto">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Add Admin User
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create a new Admin User</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="firstName" className="text-sm font-medium">
                  First Name <span className="text-red-500">*</span>
                </label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="Enter first name"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="lastName" className="text-sm font-medium">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Enter last name"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email <span className="text-red-500">*</span>
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter email address"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password <span className="text-red-500">*</span>
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter password"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="Enter phone number"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="status" className="text-sm font-medium">
                  Status <span className="text-red-500">*</span>
                </label>
                <Select required>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-myers-yellow text-myers-darkBlue hover:bg-yellow-400"
              >
                {isSubmitting ? "Creating..." : "Create Admin User"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUserAdd;
