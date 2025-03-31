import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

interface Dispensary {
  id: string;
  name: string;
  location: string;
  category: string;
  status: "active" | "inactive";
  assignedEngineer: string | null;
  lastServiceDate: string | null;
  createdAt: string;
  contactPerson: string;
  phone: string;
  email: string;
  password: string;
  profilePicture: string;
}

const DispensaryAdd: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const location = formData.get("location") as string;
    const category = formData.get("category") as string;
    const status = formData.get("status") as "active" | "inactive";
    const contactPerson = formData.get("contactPerson") as string;
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const profilePicture = "/placeholder.svg"; // Default profile picture
    const assignedEngineer = formData.get("assignedEngineer") as string;
    const lastServiceDate = formData.get("lastServiceDate") as string;

    const newDispensary: Dispensary = {
      id: Date.now().toString(),
      name,
      location,
      category,
      status,
      contactPerson,
      phone,
      email,
      password,
      profilePicture,
      assignedEngineer: assignedEngineer || null,
      lastServiceDate: lastServiceDate || null,
      createdAt: new Date().toISOString().split("T")[0],
    };

    // Save to localStorage
    const storedData = localStorage.getItem("dispensaries");
    const dispensaries = storedData ? JSON.parse(storedData) : [];
    const updatedDispensaries = [...dispensaries, newDispensary];
    localStorage.setItem("dispensaries", JSON.stringify(updatedDispensaries));

    // Show success message
    toast({
      title: "Dispensary Created",
      description: `${name} has been created successfully.`,
    });

    // Redirect back to the list page
    setTimeout(() => {
      navigate("/dispensaries");
    }, 1000);
  };

  const handleCancel = () => {
    navigate("/dispensaries");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" onClick={handleCancel} className="p-0 h-auto">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Add Dispensary
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create a new dispensary</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Dispensary Name <span className="text-red-500">*</span>
                </label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter dispensary name"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="location" className="text-sm font-medium">
                  Address <span className="text-red-500">*</span>
                </label>
                <Input
                  id="location"
                  name="location"
                  placeholder="Enter address"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="contactPerson" className="text-sm font-medium">
                  Contact Person <span className="text-red-500">*</span>
                </label>
                <Input
                  id="contactPerson"
                  name="contactPerson"
                  placeholder="Enter contact person name"
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

              {/* <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium">Category <span className="text-red-500">*</span></label>
                <select 
                  id="category" 
                  name="category" 
                  className="w-full px-3 py-2 border rounded-md"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Recreational">Recreational</option>
                  <option value="Medical">Medical</option>
                </select>
              </div> */}
              <div className="space-y-2">
                <label htmlFor="profilePicture" className="text-sm font-medium">
                  Profile Picture
                </label>
                <Input
                  id="profilePicture"
                  name="profilePicture"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Profile Preview"
                    className="w-24 h-24 rounded-md mt-2 border"
                  />
                )}
              </div>
              <div className="space-y-2">
                <label htmlFor="status" className="text-sm font-medium">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  id="status"
                  name="status"
                  className="w-full px-3 py-2 border rounded-md"
                  required
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {/* <div className="space-y-2">
                <label htmlFor="assignedEngineer" className="text-sm font-medium">Assigned Engineer</label>
                <select 
                  id="assignedEngineer" 
                  name="assignedEngineer" 
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="">None</option>
                  <option value="Emma Roberts">Emma Roberts</option>
                  <option value="James Wilson">James Wilson</option>
                  <option value="David Lee">David Lee</option>
                  <option value="Lisa Chen">Lisa Chen</option>
                </select>
              </div> */}

              {/* <div className="space-y-2">
                <label htmlFor="lastServiceDate" className="text-sm font-medium">Last Service Date</label>
                <Input 
                  id="lastServiceDate" 
                  name="lastServiceDate" 
                  type="date"
                />
              </div> */}
              
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
                {isSubmitting ? "Creating..." : "Create Dispensary"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default DispensaryAdd;
