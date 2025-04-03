import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

// Dummy data for the About Us page
const initialAboutUsData = {
  title: "About Myers Security",
  content: `
Myers Security is a leading provider of security solutions for cannabis dispensaries across the United States. Founded in 2010, we specialize in tailored security systems designed specifically for the unique challenges faced by the cannabis industry.

Our team of expert engineers and security specialists work closely with dispensary owners and operators to develop comprehensive security solutions that ensure compliance with state and local regulations while providing peace of mind.

At Myers Security, we believe in building long-term relationships with our clients, providing ongoing support, maintenance, and updates to keep security systems operating at peak performance. Our mission is to protect your business, your employees, and your customers with state-of-the-art security technology and exceptional service.

With over a decade of experience in the cannabis security sector, Myers Security has become the trusted partner for dispensaries looking to enhance their security infrastructure and protect their valuable assets.
  `,
};

// Quill editor modules and formats
const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    ["link", "image"],
    ["clean"],
  ],
};

const quillFormats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
];

const ManageCMS: React.FC = () => {
  const [aboutUsData, setAboutUsData] = useState(initialAboutUsData);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const handleSave = () => {
    // In a real application, this would save to a backend
    toast({
      title: "Changes saved",
      description: "The About Us page has been updated successfully.",
    });
    setIsEditing(false);
  };

  const handleContentChange = (content: string) => {
    setAboutUsData({ ...aboutUsData, content });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Manage CMS Pages
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>About Us Page</CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Page Title
                </label>
                <Input
                  id="title"
                  value={aboutUsData.title}
                  onChange={(e) =>
                    setAboutUsData({ ...aboutUsData, title: e.target.value })
                  }
                  className="w-full"
                />
              </div>
              <div>
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Page Content
                </label>
                <div className="min-h-[300px]">
                  <ReactQuill
                    value={aboutUsData.content}
                    onChange={handleContentChange}
                    modules={quillModules}
                    formats={quillFormats}
                    className="bg-white dark:bg-gray-800 h-[250px] mb-12 rounded-md"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-8">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="bg-myers-yellow text-myers-darkBlue hover:bg-yellow-400"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  {aboutUsData.title}
                </h3>
                <div className="prose dark:prose-invert max-w-none">
                  {aboutUsData.content.split("\n\n").map((paragraph, index) => (
                    <p
                      key={index}
                      className="mb-4 text-gray-700 dark:text-gray-300"
                      dangerouslySetInnerHTML={{ __html: paragraph }}
                    >                      
                    </p>
                  ))}
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-myers-yellow text-myers-darkBlue hover:bg-yellow-400"
                >
                  Edit Page
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageCMS;
