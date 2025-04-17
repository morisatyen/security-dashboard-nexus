import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Trash } from "lucide-react";


interface KnowledgeBaseItem {
  id: string;
  title: string;  
  bannerlink: string | null;  
  status: "active" | "inactive";
  createdAt: string;
  profilePicture?: string;
}

const ManageBannerEdit: React.FC = () => {
  const [item, setItem] = useState<KnowledgeBaseItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);  
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Fetch the item from localStorage
    const storedData = localStorage.getItem("BannersData");
    if (storedData) {
      const items: KnowledgeBaseItem[] = JSON.parse(storedData);
      const foundItem = items.find((i) => i.id === id);
      if (foundItem) {
        setItem(foundItem);
      } else {
        toast({
          title: "Banners Not Found",
          description: "The requested Banner item could not be found.",
          variant: "destructive",
        });
        navigate("/banners");
      }
    }
    setIsLoading(false);
  }, [id, navigate, toast]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const title = formData.get("title") as string;   
    const bannerlink = formData.get("bannerlink") as string;    
    const status = formData.get("status") as "active" | "inactive";

    const updatedItem: KnowledgeBaseItem = {
      id: item!.id,
      title,      
      bannerlink: bannerlink || null,      
      status,
      createdAt: item!.createdAt,
      profilePicture: imagePreview || item?.profilePicture || null,
    };

    // Update localStorage
    const storedData = localStorage.getItem("BannersData");
    if (storedData) {
      const items: KnowledgeBaseItem[] = JSON.parse(storedData);
      const updatedItems = items.map((i) => (i.id === id ? updatedItem : i));
      localStorage.setItem("BannersData", JSON.stringify(updatedItems));

      // Show success message
      toast({
        title: "Banner Updated",
        description: "Your Banner was updated successfully.",
      });

      // Redirect back to the list page
      setTimeout(() => {
        navigate("/banners");
      }, 1000);
    }
    setIsSubmitting(false);
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
  if (isLoading) {
    return (
      <div className="p-6 flex justify-center">
        <div className="w-10 h-10 border-4 border-myers-yellow border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!item) {
    return null;
  }

  return (
    <div className="space-y-6">
  <div className="flex items-center gap-2">
    <Button variant="outline" onClick={handleCancel} size="icon">
      <ArrowLeft className="h-5 w-5" />
    </Button>
    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
      Edit Banner
    </h1>
  </div>

  <Card>
    <CardContent className="mt-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Left Side - Image Preview */}
          <div className="flex justify-center items-center h-full">
            <div className="relative w-full max-w-xs aspect-square border rounded-md flex items-center justify-center bg-gray-50 shadow">
              {imagePreview || item?.profilePicture ? (
                <>
                  <img
                    src={imagePreview || item?.profilePicture}
                    alt="Preview"
                    className="object-contain w-full h-full rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => setImagePreview(null)}
                    className="absolute top-2 right-2 bg-white text-red-600 p-1 rounded-full shadow hover:bg-red-100"
                    title="Remove Image"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <span className="text-sm text-gray-400 text-center px-2">
                  Image Preview
                </span>
              )}
            </div>
          </div>

          {/* Right Side - Inputs */}
          <div className="space-y-4">
            {/* Title */}
            <div className="space-y-1.5">
              <label htmlFor="title" className="text-sm font-medium">
                Title <span className="text-red-500">*</span>
              </label>
              <Input
                id="title"
                name="title"
                placeholder="Enter title"
                defaultValue={item.title}
                required
              />
            </div>

            {/* Banner Link */}
            <div className="space-y-1.5">
              <label htmlFor="bannerlink" className="text-sm font-medium">
                Banner Link
              </label>
              <Input
                id="bannerlink"
                name="bannerlink"
                placeholder="https://www.youtube.com/watch?v=example"
                defaultValue={item.bannerlink}
              />
            </div>           

            {/* Status */}
            <div className="space-y-1.5">
              <label htmlFor="status" className="text-sm font-medium">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                id="status"
                name="status"
                className="w-full px-3 py-2 border rounded-md text-myers-darkBlue"
                defaultValue={item.status}
                required
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            {/* File Upload */}
            <div className="space-y-1.5">
              <label htmlFor="fileUrl" className="text-sm font-medium">
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

        {/* Buttons */}
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-myers-yellow text-myers-darkBlue hover:bg-yellow-400"
          >
            {isSubmitting ? "Updating..." : "Update Banner"}
          </Button>
        </div>
      </form>
    </CardContent>
  </Card>
</div>

  );
};

export default ManageBannerEdit;
