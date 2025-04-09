
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

// Quill editor modules and formats
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
    ["clean"]
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
  "clean"
]

const CMSPageAdd: React.FC = () => {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const navigate = useNavigate();

  const validateSlug = (value: string) => {
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    return slugRegex.test(value);
  };

  const generateSlug = (input: string) => {
    return input
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    
    // Only auto-generate slug if the slug field is empty or matches the previous auto-generated slug
    if (!slug || slug === generateSlug(title)) {
      setSlug(generateSlug(newTitle));
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSlug = e.target.value.toLowerCase();
    setSlug(newSlug);
    
    // Clear error when user types
    if (errors.slug) {
      setErrors({ ...errors, slug: "" });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) {
      newErrors.title = "Title is required";
    }
    
    if (!slug.trim()) {
      newErrors.slug = "Slug is required";
    } else if (!validateSlug(slug)) {
      newErrors.slug = "Slug must contain only lowercase letters, numbers, and hyphens";
    }
    
    if (!content.trim()) {
      newErrors.content = "Content is required";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // In a real app, this would save to a backend
    toast({
      title: "Page created",
      description: `The page "${title}" has been created successfully.`,
    });
    
    navigate("/manage-cms");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add CMS Page</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Page Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Page Title <span className="text-red-500">*</span></Label>
              <Input 
                id="title" 
                value={title} 
                onChange={handleTitleChange} 
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="slug">
                Slug <span className="text-red-500">*</span>
                <span className="text-gray-500 text-sm ml-2">(example: about-us)</span>
              </Label>
              <Input 
                id="slug" 
                value={slug} 
                onChange={handleSlugChange} 
                className={errors.slug ? "border-red-500" : ""}
              />
              {errors.slug && (
                <p className="text-red-500 text-sm mt-1">{errors.slug}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">Page Content <span className="text-red-500">*</span></Label>
              <div className="min-h-[300px]">
                <ReactQuill
                  value={content}
                  onChange={setContent}
                  modules={quillModules}
                  formats={quillFormats}
                  className="bg-white dark:bg-gray-800 h-[250px] mb-12 rounded-md"
                />
              </div>
              {errors.content && (
                <p className="text-red-500 text-sm mt-1">{errors.content}</p>
              )}
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate("/manage-cms")}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-myers-yellow text-myers-darkBlue hover:bg-yellow-400"
              >
                Create Page
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CMSPageAdd;
