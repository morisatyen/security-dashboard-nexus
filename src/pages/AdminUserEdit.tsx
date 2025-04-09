
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface SupportEngineer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  specialization: string;
  region: string;
  status: 'active' | 'inactive';
  activeRequests: number;
  joinedDate: string;
}

// Password form schema with validation
const passwordSchema = z.object({
  newPassword: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const AdminUserEdit: React.FC = () => {
  const [engineer, setEngineer] = useState<SupportEngineer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("details");
  
  // Setup password form
  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: ""
    }
  });
  
  useEffect(() => {
    // Fetch the engineer data from localStorage
    const storedData = localStorage.getItem('supportEngineers');
    if (storedData) {
      const engineers: SupportEngineer[] = JSON.parse(storedData);
      const foundEngineer = engineers.find(e => e.id === id);
      if (foundEngineer) {
        setEngineer(foundEngineer);
      } else {
        toast({
          title: "User Not Found",
          description: "The requested Admin users could not be found.",
          variant: "destructive"
        });
        navigate('/users/admin-users');
      }
    }
    setIsLoading(false);
  }, [id, navigate, toast]);
  
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(event.currentTarget);
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const status = formData.get('status') as 'active' | 'inactive';
    
    const updatedEngineer: SupportEngineer = {
      id: engineer!.id,
      firstName,
      lastName,
      email,
      password: engineer!.password, // Keep existing password if not changed
      phone,
      specialization: engineer!.specialization,
      region: engineer!.region,
      status,
      activeRequests: engineer!.activeRequests,
      joinedDate: engineer!.joinedDate
    };
    
    // Update localStorage
    updateUserInStorage(updatedEngineer);
  };
  
  const handlePasswordSubmit = (values: z.infer<typeof passwordSchema>) => {
    setIsSubmitting(true);
    
    if (!engineer) return;
    
    const updatedEngineer: SupportEngineer = {
      ...engineer,
      password: values.newPassword
    };
    
    // Update localStorage
    updateUserInStorage(updatedEngineer);
    
    // Reset password form
    passwordForm.reset();
  };
  
  const updateUserInStorage = (updatedEngineer: SupportEngineer) => {
    const storedData = localStorage.getItem('supportEngineers');
    if (storedData) {
      const engineers: SupportEngineer[] = JSON.parse(storedData);
      const updatedEngineers = engineers.map(e => e.id === id ? updatedEngineer : e);
      localStorage.setItem('supportEngineers', JSON.stringify(updatedEngineers));
      
      // Show success message
      toast({
        title: "Admin User Updated",
        description: `${updatedEngineer.firstName} ${updatedEngineer.lastName} has been updated successfully.`
      });
      
      setIsSubmitting(false);
      
      // Redirect back to the list page
      setTimeout(() => {
        navigate('/users/admin-users');
      }, 1000);
    }
  };
  
  const handleCancel = () => {
    navigate('/users/admin-users');
  };
  
  if (isLoading) {
    return (
      <div className="p-6 flex justify-center">
        <div className="w-10 h-10 border-4 border-myers-yellow border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!engineer) {
    return null;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          onClick={handleCancel}
          size="icon"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Admin User</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Edit Admin User</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="details">User Details</TabsTrigger>
              <TabsTrigger value="password">Change Password</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-sm font-medium">First Name <span className="text-red-500">*</span></label>
                    <Input 
                      id="firstName" 
                      name="firstName" 
                      placeholder="Enter first name"
                      defaultValue={engineer.firstName}
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-sm font-medium">Last Name <span className="text-red-500">*</span></label>
                    <Input 
                      id="lastName" 
                      name="lastName" 
                      placeholder="Enter last name"
                      defaultValue={engineer.lastName}
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">Email <span className="text-red-500">*</span></label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email"
                      placeholder="Enter email address"
                      defaultValue={engineer.email}
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium">Phone Number <span className="text-red-500">*</span></label>
                    <Input 
                      id="phone" 
                      name="phone" 
                      placeholder="Enter phone number"
                      defaultValue={engineer.phone}
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="status" className="text-sm font-medium">Status <span className="text-red-500">*</span></label>
                    <select 
                      id="status" 
                      name="status" 
                      className="w-full px-3 py-2 border rounded-md text-myers-darkBlue"
                      defaultValue={engineer.status}
                      required
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>                  
                    </select>
                  </div>
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
                    {isSubmitting ? 'Updating...' : 'Update User Details'}
                  </Button>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="password">
              <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-6">
                  <div className="max-w-md space-y-4">
                    <FormField
                      control={passwordForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password <span className="text-red-500">*</span></FormLabel>
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
                          <FormLabel>Confirm Password <span className="text-red-500">*</span></FormLabel>
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
                      {isSubmitting ? 'Updating...' : 'Update Password'}
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

export default AdminUserEdit;
