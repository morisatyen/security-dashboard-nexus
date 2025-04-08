import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Password form schema with validation
const passwordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

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

const DispensaryEdit: React.FC = () => {
  const [dispensary, setDispensary] = useState<Dispensary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { id } = useParams<{ id: string }>();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("details");

  // Setup password form
  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });
  useEffect(() => {
    // Fetch the dispensary from localStorage
    const storedData = localStorage.getItem("dispensaries");
    if (storedData) {
      const dispensaries: Dispensary[] = JSON.parse(storedData);
      const foundDispensary = dispensaries.find((d) => d.id === id);
      if (foundDispensary) {
        setDispensary(foundDispensary);
        setImagePreview(foundDispensary.profilePicture);
      } else {
        toast({
          title: "Dispensary Not Found",
          description: "The requested dispensary could not be found.",
          variant: "destructive",
        });
        navigate("/dispensaries");
      }
    }
    setIsLoading(false);
  }, [id, navigate, toast]);

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
    const assignedEngineer = formData.get("assignedEngineer") as string;
    const lastServiceDate = formData.get("lastServiceDate") as string;

    const updatedDispensary: Dispensary = {
      id: dispensary!.id,
      name,
      location,
      category,
      status,
      contactPerson,
      phone,
      email,
      password,
      profilePicture: imagePreview || dispensary.profilePicture,
      assignedEngineer: assignedEngineer || null,
      lastServiceDate: lastServiceDate || null,
      createdAt: dispensary!.createdAt,
    };

    // Update localStorage
    const storedData = localStorage.getItem("dispensaries");
    if (storedData) {
      const dispensaries: Dispensary[] = JSON.parse(storedData);
      const updatedDispensaries = dispensaries.map((d) =>
        d.id === id ? updatedDispensary : d
      );
      localStorage.setItem("dispensaries", JSON.stringify(updatedDispensaries));

      // Show success message
      toast({
        title: "Customer Updated",
        description: `${name} has been updated successfully.`,
      });

      // Redirect back to the list page
      setTimeout(() => {
        navigate("/dispensaries");
      }, 1000);
    }
  };
  const handlePasswordSubmit = (values: z.infer<typeof passwordSchema>) => {};

  const handleCancel = () => {
    navigate("/dispensaries");
  };

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center">
        <div className="w-10 h-10 border-4 border-myers-yellow border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!dispensary) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" onClick={handleCancel} className="p-0 h-auto">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Edit Customer
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit customer</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="details"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="mb-6">
              <TabsTrigger value="details">Customer Profile</TabsTrigger>
              <TabsTrigger value="password">Change Password</TabsTrigger>
            </TabsList>
            <TabsContent value="details">
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
                      defaultValue={dispensary.name}
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
                      defaultValue={dispensary.location}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="contactPerson"
                      className="text-sm font-medium"
                    >
                      Customer Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="contactPerson"
                      name="contactPerson"
                      placeholder="Enter customer name"
                      defaultValue={dispensary.contactPerson}
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
                      defaultValue={dispensary.phone}
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
                      defaultValue={dispensary.email}
                      required
                    />
                  </div>

                  {/* <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password <span className="text-red-500">*</span>
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter password"
                  defaultValue={dispensary.password}
                  required
                />
              </div> */}

                  {/* <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium">Category <span className="text-red-500">*</span></label>
                <select 
                  id="category" 
                  name="category" 
                  className="w-full px-3 py-2 border rounded-md"
                  defaultValue={dispensary.category}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Recreational">Recreational</option>
                  <option value="Medical">Medical</option>
                </select>
              </div> */}
                  <div className="space-y-2">
                    <label htmlFor="status" className="text-sm font-medium">
                      Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="status"
                      name="status"
                      className="w-full px-3 py-2 border rounded-md text-myers-darkBlue"
                      defaultValue={dispensary.status}
                      required
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="profilePicture"
                      className="text-sm font-medium"
                    >
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

                  {/* <div className="space-y-2">
                <label htmlFor="assignedEngineer" className="text-sm font-medium">Assigned Engineer</label>
                <select 
                  id="assignedEngineer" 
                  name="assignedEngineer" 
                  className="w-full px-3 py-2 border rounded-md"
                  defaultValue={dispensary.assignedEngineer || ''}
                >
                  <option value="">None</option>
                  <option value="Emma Roberts">Emma Roberts</option>
                  <option value="James Wilson">James Wilson</option>
                  <option value="David Lee">David Lee</option>
                  <option value="Lisa Chen">Lisa Chen</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="lastServiceDate" className="text-sm font-medium">Last Service Date</label>
                <Input 
                  id="lastServiceDate" 
                  name="lastServiceDate" 
                  type="date"
                  defaultValue={dispensary.lastServiceDate || ''}
                />
              </div> */}
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-myers-yellow text-myers-darkBlue hover:bg-yellow-400"
                  >
                    {isSubmitting ? "Updating..." : "Update Customer"}
                  </Button>
                </div>
              </form>
            </TabsContent>
            <TabsContent value="password">
              <Form {...passwordForm}>
                <form
                  onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}
                  className="space-y-6"
                >
                  <div className="max-w-md space-y-4">
                    <FormField
                      control={passwordForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            New Password <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Enter new password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={passwordForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Confirm Password{" "}
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Confirm new password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-myers-yellow text-myers-darkBlue hover:bg-yellow-400"
                    >
                      {isSubmitting ? "Updating..." : "Update Password"}
                    </Button>
                  </div>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DispensaryEdit;
