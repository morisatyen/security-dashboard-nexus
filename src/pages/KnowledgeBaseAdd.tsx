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
const KnowledgeBaseAdd: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [frimgPreview, setFrImgPreview] = useState<string | null>(null);

  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

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

    const newItem = {
      id: Date.now().toString(),
      title,
      category,
      description,
      videoUrl: videoUrl || null,
      blogUrl: blogUrl || null,
      fileUrl: fileUrl || null,
      status,
      createdAt: new Date().toISOString().split("T")[0],
    };

    // Save to localStorage
    const existingItems = JSON.parse(
      localStorage.getItem("knowledgeBase") || "[]"
    );
    const updatedItems = [...existingItems, newItem];
    localStorage.setItem("knowledgeBase", JSON.stringify(updatedItems));

    // Show success message
    toast({
      title: "Knowledge Base Item Created",
      description: "Your knowledge base item has been created successfully.",
    });

    // Redirect back to the list page
    setTimeout(() => {
      navigate("/knowledge-base");
    }, 1000);
  };

  const handleCancel = () => {
    navigate("/knowledge-base");
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
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={handleCancel} size="icon">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Add Knowledge Base Item
        </h1>
      </div>

      <Card>
        {/* <CardHeader>
          <CardTitle>Create a new knowledge base item</CardTitle>
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
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium">
                  Category <span className="text-red-500">*</span>
                </label>
                <Select required>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>                    
                    <SelectItem value="casestudies">Case Studies</SelectItem>
                    <SelectItem value="testimonials">Testimonials</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description <span className="text-red-500">*</span>
                </label>
                {/* <textarea
                  id="description"
                  name="description"
                  placeholder="Enter description"
                  rows={4}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                /> */}
                <div className="min-h-[200px]">
                  <ReactQuill
                    value={description}
                    onChange={setDescription}
                    placeholder="Enter description"
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
              <div className="space-y-2 relative">
                <label htmlFor="status" className="text-sm font-medium">
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
                {isSubmitting ? "Creating..." : "Create Item"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default KnowledgeBaseAdd;
