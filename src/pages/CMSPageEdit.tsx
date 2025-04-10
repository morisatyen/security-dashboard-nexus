
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

// Dummy data for CMS pages
interface CMSPage {
  id: string;
  title: string;
  slug: string;
  content: string;
}

const initialCMSPages: CMSPage[] = [
  {
    id: "1",
    title: "About Us",
    slug: "about-us",
    content: `
Myers Security is a leading provider of security solutions for cannabis dispensaries across the United States. Founded in 2010, we specialize in tailored security systems designed specifically for the unique challenges faced by the cannabis industry.

Our team of expert engineers and security specialists work closely with dispensary owners and operators to develop comprehensive security solutions that ensure compliance with state and local regulations while providing peace of mind.

At Myers Security, we believe in building long-term relationships with our clients, providing ongoing support, maintenance, and updates to keep security systems operating at peak performance. Our mission is to protect your business, your employees, and your customers with state-of-the-art security technology and exceptional service.

With over a decade of experience in the cannabis security sector, Myers Security has become the trusted partner for dispensaries looking to enhance their security infrastructure and protect their valuable assets.
    `,
  },
  {
    id: "2",
    title: "Services",
    slug: "services",
    content: "Our services include comprehensive security solutions for cannabis dispensaries...",
  },
  {
    id: "3",
    title: "Contact",
    slug: "contact",
    content: "Get in touch with our security experts to discuss your dispensary's security needs...",
  }
];

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
];

const CMSPageEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [page, setPage] = useState<CMSPage | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // In a real app, this would fetch data from an API
    const foundPage = initialCMSPages.find(p => p.id === id);
    if (foundPage) {
      setPage(foundPage);
      setTitle(foundPage.title);
      setSlug(foundPage.slug);
      setContent(foundPage.content);
    }
  }, [id]);

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
    
    // Only auto-generate slug if it's still the original slug
    if (slug === page?.slug) {
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
      title: "Page updated",
      description: `The page "${title}" has been updated successfully.`,
    });
    
    navigate("/manage-cms");
  };

  if (!page) {
    return (
      <div className="p-6 flex justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit CMS Page</h1>
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
                  // className="bg-white dark:bg-gray-800 h-[250px] mb-12 rounded-md"
                  className="h-[250px]"
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
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CMSPageEdit;
