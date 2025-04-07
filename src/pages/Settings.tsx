import React, { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// Define the schema for the form
const formSchema = z.object({
  contactNumber: z.string().min(1, "Contact number is required"),
  supportEmail: z.string().email("Invalid email address")
});

// Dummy initial data
const initialSettings = {
  contactNumber: "(555) 123-4567",
  supportEmail: "support@myers-security.com"
};

const Settings: React.FC = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contactNumber: "",
      supportEmail: ""
    }
  });

  useEffect(() => {
    // Simulate loading data from API
    setTimeout(() => {
      // Check if settings exist in localStorage
      const storedSettings = localStorage.getItem("supportSettings");
      const settings = storedSettings ? JSON.parse(storedSettings) : initialSettings;
      
      // Set form values
      form.reset(settings);
      setIsLoading(false);
    }, 500);
  }, [form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Save to localStorage (in a real app, this would be an API call)
    localStorage.setItem("supportSettings", JSON.stringify(values));
    
    toast({
      title: "Settings Saved",
      description: "The support contact information has been updated successfully."
    });
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-myers-yellow border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Settings
      </h1>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Contact Support Information</CardTitle>
          <CardDescription>
            Manage the contact information displayed to customers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="contactNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Support Contact Number</FormLabel>
                    <FormControl>
                      <Input placeholder="(555) 123-4567" {...field} />
                    </FormControl>
                    <FormDescription>
                      This number will be displayed as the primary contact for support
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="supportEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Support Email Address</FormLabel>
                    <FormControl>
                      <Input placeholder="support@company.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      Email address for customer support inquiries
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-myers-yellow text-myers-darkBlue hover:bg-yellow-400"
                >
                  Save Settings
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;