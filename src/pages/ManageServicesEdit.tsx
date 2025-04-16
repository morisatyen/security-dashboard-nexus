import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ direction: "rtl" }],
    [{ align: [] }],
    ["link", "image", "video", "formula"],
    ["blockquote", "code-block"],
    ["clean"],
  ],
};

const quillFormats = [
  "header",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "color",
  "background",
  "script",
  "list",
  "bullet",
  "indent",
  "direction",
  "align",
  "link",
  "image",
  "video",
  "formula",
  "code-block",
  "blockquote",
  "clean",
];

interface KnowledgeBaseItem {
  id: string;
  title: string;
  category: "Services" | "Case Studies" | "Testimonials";
  description: string;
  videoUrl: string | null;
  blogUrl: string | null;
  fileUrl: string | null;
  status: "active" | "inactive";
  createdAt: string;
}

const ManageServicesEdit: React.FC = () => {
  const [item, setItem] = useState<KnowledgeBaseItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [frimgPreview, setFrImgPreview] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [description, setDescription] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    // Fetch the item from localStorage
    const storedData = localStorage.getItem("manageServices");
    if (storedData) {
      const items: KnowledgeBaseItem[] = JSON.parse(storedData);
      const foundItem = items.find((i) => i.id === id);
      if (foundItem) {
        setItem(foundItem);
      } else {
        toast({
          title: "Item Not Found",
          description: "The requested knowledge base item could not be found.",
          variant: "destructive",
        });
        navigate("/services");
      }
    }
    setIsLoading(false);
  }, [id, navigate, toast]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const title = formData.get("title") as string;
    const category = formData.get("category") as
      | "Services"
      | "Case Studies"
      | "Testimonials";
    const description = formData.get("description") as string;
    const videoUrl = formData.get("videoUrl") as string;
    const blogUrl = formData.get("blogUrl") as string;
    const fileUrl = formData.get("fileUrl") as string;
    const status = formData.get("status") as "active" | "inactive";

    const updatedItem: KnowledgeBaseItem = {
      id: item!.id,
      title,
      category,
      description,
      videoUrl: videoUrl || null,
      blogUrl: blogUrl || null,
      fileUrl: fileUrl || null,
      status,
      createdAt: item!.createdAt,
    };

    // Update localStorage
    const storedData = localStorage.getItem("manageServices");
    if (storedData) {
      const items: KnowledgeBaseItem[] = JSON.parse(storedData);
      const updatedItems = items.map((i) => (i.id === id ? updatedItem : i));
      localStorage.setItem("manageServices", JSON.stringify(updatedItems));

      // Show success message
      toast({
        title: "Service Item Updated",
        description: "Your Service item has been updated successfully.",
      });

      // Redirect back to the list page
      setTimeout(() => {
        navigate("/services");
      }, 1000);
    }
  };

  const handleCancel = () => {
    navigate("/services");
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
  const handlefrontedImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFrImgPreview(reader.result as string);
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
          Edit Service
        </h1>
      </div>

      <Card>
        {/* <CardHeader>
          <CardTitle>Edit knowledge base item</CardTitle>
        </CardHeader> */}
        <CardContent className="mt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
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

              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium">
                  Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  className="w-full px-3 py-2 border rounded-md text-myers-darkBlue"
                  defaultValue={item.category}
                  required
                >
                  <option value="">Select Types of services</option>
                  <option value="Services">Services</option>
                  <option value="Case Studies">Case Studies</option>
                  <option value="Testimonials">Testimonials</option>
                </select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description <span className="text-red-500">*</span>
                </label>
                <div className="min-h-[200px]">
                  <ReactQuill
                    value={description}
                    onChange={setDescription}
                    modules={quillModules}
                    formats={quillFormats}
                    className="h-[150px]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="videoUrl" className="text-sm font-medium">
                  Video URL
                </label>
                <Input
                  id="videoUrl"
                  name="videoUrl"
                  placeholder="https://www.youtube.com/watch?v=example"
                  defaultValue={item.videoUrl || ""}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="blogUrl" className="text-sm font-medium">
                  Blog URL
                </label>
                <Input
                  id="blogUrl"
                  name="blogUrl"
                  placeholder="https://myerssecurity.com/blog/example"
                  defaultValue={item.blogUrl || ""}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="fileUrl" className="text-sm font-medium">
                  Upload File
                </label>
                <Input
                  id="fileUrl"
                  name="fileUrl"
                  type="file"
                  accept="image/*,application/pdf"
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
                                <label htmlFor="fileUrl" className="text-sm font-medium">
                                  Frontend File
                                </label>
                                <Input
                                  id="fileUrl"
                                  name="fileUrl"
                                  type="file"
                                  accept="image/*,application/pdf"
                                  onChange={handlefrontedImageChange}
                                />
                                {frimgPreview && (
                                  <img
                                    src={frimgPreview}
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
                  className="w-full px-3 py-2 border rounded-md text-myers-darkBlue"
                  defaultValue={item.status}
                  required
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
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
                {isSubmitting ? "Updating..." : "Update Item"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageServicesEdit;
