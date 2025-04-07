import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "../contexts/AuthContext";
import { getInitials } from "../utils/helpers";

const EditProfile: React.FC = () => {
  const { user, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Create a copy of the user data for editing
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role || "",
    bio:
      user?.bio ||
      "Security specialist with over 5 years of experience in the cannabis industry.",
    phone: user?.phone || "+1 (555) 123-4567",
    location: user?.location || "Denver, CO",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // In a real app, this would call an API to update the user profile
    // For now we'll just simulate success
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    });

    // Update the user context
    if (updateUserProfile) {
      updateUserProfile({
        ...user,
        ...formData,
      });
    }

    // Navigate back to dashboard
    navigate("/dashboard");
  };

  return (
    <div className="space-y-6">
  <div className="flex justify-between items-center">
    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
      Edit Profile
    </h1>
  </div>

  <Card>
    <CardHeader>
      <CardTitle>Profile Information</CardTitle>
    </CardHeader>
    <CardContent>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6 mb-6">
          <div className="flex flex-col items-center">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src="/src/images/Logo1.png"
                alt={formData.name}
              />
              <AvatarFallback className="text-lg bg-myers-yellow text-myers-darkBlue">
                {getInitials(formData.name)}
              </AvatarFallback>
            </Avatar>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-3"
            >
              Change Photo
            </Button>
          </div>

          <div className="flex-1 space-y-4 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  First Name
                </label>
                <Input
                  name="firstName"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full"
                  placeholder="Enter your first name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Last Name
                </label>
                <Input
                  name="lastName"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full"
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone Number
                </label>
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  // value={formData.role}
                  // onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-600"
                  required
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-myers-yellow text-myers-darkBlue hover:bg-yellow-400"
          >
            Save Changes
          </Button>
        </div>
      </form>
    </CardContent>
  </Card>
</div>

  );
};

export default EditProfile;
