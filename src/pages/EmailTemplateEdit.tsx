import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface EmailTemplate {
  id: string;
  name: string;
  slug: string;
  subject: string;
  content: string;
  variables: string[];
}

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format"),
  subject: z.string().min(1, "Subject is required"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  variables: z.string(),
});

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

const EmailTemplateEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
      subject: "",
      content: "",
      variables: "",
    },
  });

  useEffect(() => {
    if (!id) return;

    // Simulate API call to fetch template data
    setTimeout(() => {
      const storedData = localStorage.getItem("emailTemplates");
      const templates = storedData ? JSON.parse(storedData) : [];
      const template = templates.find((t: EmailTemplate) => t.id === id);

      if (template) {
        form.reset({
          name: template.name,
          slug: template.slug,
          subject: template.subject,
          content: template.content,
          variables: template.variables.join(", "),
        });
      }
      setIsLoading(false);
    }, 500);
  }, [id, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!id) return;

    const updatedTemplate = {
      id,
      name: values.name,
      slug: values.slug,
      subject: values.subject,
      content: values.content,
      variables: values.variables
        .split(",")
        .map((v) => v.trim())
        .filter((v) => v !== ""),
    };

    const storedData = localStorage.getItem("emailTemplates");
    const templates = storedData ? JSON.parse(storedData) : [];
    const updatedTemplates = templates.map((template: EmailTemplate) =>
      template.id === id ? updatedTemplate : template
    );

    localStorage.setItem("emailTemplates", JSON.stringify(updatedTemplates));

    toast({
      title: "Template Updated",
      description: "The email template has been updated successfully.",
    });

    navigate("/email-templates");
  };

  const handleBack = () => {
    navigate("/email-templates");
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
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={handleBack} size="icon">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Edit Email Template
        </h1>
      </div>

      <Card>       
        <CardContent className="mt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Template Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter template name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="enter-slug-here" {...field} />
                    </FormControl>
                    <FormDescription>
                      URL-friendly version of the name (lowercase, hyphenated,
                      no special characters)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Subject</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter email subject" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Content</FormLabel>
                    <FormControl>
                      <div className="min-h-[200px]">
                        <ReactQuill
                          theme="snow"
                          value={field.value}
                          onChange={field.onChange}
                          className="h-[200px] mb-20"
                          modules={quillModules}
                          formats={quillFormats}
                        />
                      </div>
                    </FormControl>                   
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-myers-yellow text-myers-darkBlue hover:bg-yellow-400"
                >
                  Save Template
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailTemplateEdit;
