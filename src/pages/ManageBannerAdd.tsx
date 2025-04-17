import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Trash } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ManageBannerAdd: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const title = formData.get("title") as string;
    const videoUrl = formData.get("videoUrl") as string;
    const status = formData.get("status") as "active" | "inactive";

    const newItem = {
      id: Date.now().toString(),
      title,
      videoUrl: videoUrl || null,
      status,
      createdAt: new Date().toISOString().split("T")[0],
    };

    // Save to localStorage
    const existingItems = JSON.parse(
      localStorage.getItem("BannersData") || "[]"
    );
    const updatedItems = [...existingItems, newItem];
    localStorage.setItem("BannersData", JSON.stringify(updatedItems));

    // Show success message
    toast({
      title: "Banner Created",
      description: "Your Banner item has been created successfully.",
    });

    // Redirect back to the list page
    setTimeout(() => {
      navigate("/banners");
    }, 1000);
  };

  const handleCancel = () => {
    navigate("/banners");
  };

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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={handleCancel} size="icon">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Add Banner
        </h1>
      </div>

      <Card>
        <CardContent className="mt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              {/* Left Side - Image Preview */}
              <div className="flex justify-center items-center h-full">
                <label
                  htmlFor="fileUrl"
                  className="relative w-full max-w-xs aspect-square border rounded-md flex items-center justify-center bg-gray-50 shadow cursor-pointer"
                >
                  {imagePreview ? (
                    <>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="object-contain w-full h-full rounded-md"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation(); // prevent triggering upload on remove
                          setImagePreview(null);
                        }}
                        className="absolute top-2 right-2 bg-white text-red-600 p-1 rounded-full shadow hover:bg-red-100"
                        title="Remove Image"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <span className="text-sm text-gray-400 text-center px-2">
                      Click to upload
                    </span>
                  )}
                </label>
              </div>

              {/* Right Side - All Inputs */}
              <div className="space-y-4">
                {/* Title */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="title"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Title <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Enter title"
                    required
                  />
                </div>

                {/* Banner Link */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="videoUrl"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Banner Link
                  </label>
                  <Input
                    id="videoUrl"
                    name="videoUrl"
                    placeholder="https://www.youtube.com/watch?v=example"
                  />
                </div>

                {/* Status */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="status"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Status <span className="text-red-500">*</span>
                  </label>
                  <Select required>
                    <SelectTrigger id="status" name="status" className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {/* File Upload -hidden if u */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="fileUrl"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Upload Banner
                  </label>
                  <Input
                    id="fileUrl"
                    name="fileUrl"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-myers-yellow text-myers-darkBlue hover:bg-yellow-400"
              >
                {isSubmitting ? "Creating..." : "Add Banner"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageBannerAdd;
