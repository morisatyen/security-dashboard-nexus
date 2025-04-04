
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ArrowLeft } from "lucide-react";

// Dummy email templates data
const initialTemplates = [
  {
    id: "welcome",
    name: "Welcome Email",
    subject: "Welcome to Myers Security",
    content: `
Dear {{customer_name}},

Welcome to Myers Security! We're thrilled to have you as our new customer.

Your account has been successfully created and you can now access our customer portal using the credentials we've sent to your email.

If you have any questions or need assistance, please don't hesitate to contact our support team at support@myers-security.com or call us at (555) 123-4567.

Best regards,
The Myers Security Team
    `,
    variables: ["customer_name"]
  },
  {
    id: "service-request",
    name: "Service Request Confirmation",
    subject: "Your Service Request Has Been Received",
    content: `
Dear {{customer_name}},

Thank you for submitting a service request with Myers Security. Your request (ID: {{request_id}}) has been received and will be processed shortly.

Request Details:
- Date: {{request_date}}
- Description: {{request_description}}
- Priority: {{request_priority}}

We will assign a support engineer to your case and they will contact you within {{response_time}} hours.

For urgent matters, please call our emergency support line at (555) 987-6543.

Best regards,
Customer Support
Myers Security
    `,
    variables: ["customer_name", "request_id", "request_date", "request_description", "request_priority", "response_time"]
  },
  {
    id: "invoice",
    name: "Invoice Notification",
    subject: "New Invoice from Myers Security",
    content: `
Dear {{customer_name}},

We have issued a new invoice for your recent services with Myers Security.

Invoice Details:
- Invoice Number: {{invoice_number}}
- Date: {{invoice_date}}
- Amount Due: {{invoice_amount}}
- Due Date: {{due_date}}

To view and pay your invoice, please log in to your customer portal at portal.myers-security.com or click the link below:

{{invoice_link}}

If you have any questions about this invoice, please contact our billing department at billing@myers-security.com.

Thank you for your business!

Sincerely,
Myers Security Financial Team
    `,
    variables: ["customer_name", "invoice_number", "invoice_date", "invoice_amount", "due_date", "invoice_link"]
  }
];

// Quill editor modules and formats
const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{'list': 'ordered'}, {'list': 'bullet'}],
    [{'indent': '-1'}, {'indent': '+1'}],
    ['link'],
    ['clean']
  ],
};

const quillFormats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'list', 'bullet', 'indent',
  'link'
];

const EmailTemplateEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [template, setTemplate] = useState<any>(null);

  useEffect(() => {
    // Fetch the template by ID from the dummy data
    const foundTemplate = initialTemplates.find(t => t.id === id);
    if (foundTemplate) {
      setTemplate(foundTemplate);
    } else {
      navigate("/email-templates");
      toast({
        title: "Template not found",
        description: "The requested email template could not be found.",
        variant: "destructive",
      });
    }
  }, [id, navigate, toast]);

  const handleContentChange = (content: string) => {
    if (template) {
      setTemplate({ ...template, content });
    }
  };

  const handleSave = () => {
    // In a real application, this would save to a backend
    toast({
      title: "Template updated",
      description: `Email template "${template.name}" has been updated successfully.`,
    });
    navigate("/email-templates");
  };

  if (!template) {
    return (
      <div className="p-6 flex justify-center items-center">
        <div className="spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate("/email-templates")}
            className="flex items-center"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Email Template</h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Template: {template.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Template Name
            </label>
            <Input
              value={template.name}
              onChange={(e) => setTemplate({ ...template, name: e.target.value })}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Subject
            </label>
            <Input
              value={template.subject}
              onChange={(e) => setTemplate({ ...template, subject: e.target.value })}
              className="w-full"
            />
          </div>
          
          {/* <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Available Variables
            </label>
            <div className="flex flex-wrap gap-2">
              {template.variables.map((variable: string) => (
                <div 
                  key={variable} 
                  className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md text-xs"
                >
                  {`{{${variable}}}`}
                </div>
              ))}
            </div>
          </div> */}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Content
            </label>
            <div className="min-h-[300px]">
              <ReactQuill
                value={template.content}
                onChange={handleContentChange}
                modules={quillModules}
                formats={quillFormats}
                className="bg-white dark:bg-gray-800 h-[250px] mb-12 rounded-md"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-8">
            <Button 
              variant="outline" 
              onClick={() => navigate("/email-templates")}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              className="bg-myers-yellow text-myers-darkBlue hover:bg-yellow-400"
            >
              Save Template
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailTemplateEdit;
