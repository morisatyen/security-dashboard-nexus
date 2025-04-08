import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Plus, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

// Initial dummy data for email templates
const initialTemplates = [
  {
    id: "welcome",
    name: "Welcome Email",
    slug: "welcome-email",
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
    slug: "service-request-confirmation",
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
    slug: "invoice-notification",
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

const ManageEmailTemplates: React.FC = () => {
  const [templates, setTemplates] = useState(initialTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if there are templates in localStorage
    const storedTemplates = localStorage.getItem("emailTemplates");
    if (!storedTemplates) {
      // Initialize with default templates
      localStorage.setItem("emailTemplates", JSON.stringify(initialTemplates));
    } else {
      // Load templates from localStorage
      setTemplates(JSON.parse(storedTemplates));
    }
  }, []);

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  const handleEditTemplate = (templateId: string) => {
    navigate(`/email-templates/edit/${templateId}`);
  };

  const handleAddTemplate = () => {
    // Generate a new ID (would be handled by backend in a real app)
    const newId = `template-${Date.now()}`;
    
    // Create a new template
    const newTemplate = {
      id: newId,
      name: "New Template",
      slug: "new-template",
      subject: "New Email Template",
      content: "Enter your email content here.",
      variables: []
    };
    
    // Add to localStorage
    const updatedTemplates = [...templates, newTemplate];
    localStorage.setItem("emailTemplates", JSON.stringify(updatedTemplates));
    setTemplates(updatedTemplates);
    
    // Navigate to edit page
    navigate(`/email-templates/edit/${newId}`);
  };

  const handleDeleteTemplate = (templateId: string) => {
    const updatedTemplates = templates.filter(template => template.id !== templateId);
    setTemplates(updatedTemplates);
    localStorage.setItem("emailTemplates", JSON.stringify(updatedTemplates));
    
    toast({
      title: "Template Deleted",
      description: "The email template has been deleted successfully.",
    });
    
    if (selectedTemplate === templateId) {
      setSelectedTemplate(null);
    }
  };

  const handlePreviewTemplate = (template: any) => {
    setPreviewTemplate(template);
    setIsPreviewOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Email Templates</h1>
        <Button
          onClick={handleAddTemplate}
          className="bg-myers-yellow text-myers-darkBlue hover:bg-yellow-400"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Template
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Email Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-4">
              {templates.length > 0 ? (
                templates.map(template => (
                  <div 
                    key={template.id} 
                    className={`
                      p-4 rounded-md border transition-all duration-200
                      ${selectedTemplate === template.id 
                        ? 'border-myers-yellow bg-gray-50 dark:bg-gray-800' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-myers-yellow'
                      }
                    `}
                    onClick={() => handleSelectTemplate(template.id)}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">{template.name}</h3>
                      <div className="flex items-center space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            {/* <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePreviewTemplate(template);
                              }}
                              className="px-2"
                            >
                              <Eye className="h-4 w-4" />
                            </Button> */}
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[625px]">
                            <DialogHeader>
                              <DialogTitle>Preview: {previewTemplate?.name}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="border-b pb-2">
                                <div className="font-semibold">Subject:</div>
                                <div>{previewTemplate?.subject}</div>
                              </div>
                              <div>
                                <div className="font-semibold mb-2">Content:</div>
                                <div className="whitespace-pre-wrap p-4 border rounded bg-gray-50 dark:bg-gray-800">
                                  {previewTemplate?.content}
                                </div>
                              </div>
                            </div>
                            <DialogFooter>
                              {/* <Button
                                variant="outline"
                                onClick={() => setIsPreviewOpen(false)}
                              >
                                Close
                              </Button> */}
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditTemplate(template.id);
                          }}
                          className="px-2"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={(e) => e.stopPropagation()}
                              className="text-red-500 hover:text-red-700 px-2"
                            >
                              <Trash className="h-4 w-4 mr-1" />
                              
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete the "{template.name}" email template. This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteTemplate(template.id)}
                                className="bg-red-500 hover:bg-red-600 text-white"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                    {/* <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Subject: {template.subject}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Slug: {template.slug}
                    </p> */}
                    {/* {selectedTemplate === template.id && (
                      <div className="mt-3 space-y-2">
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                          Available Variables:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {template.variables.map((variable) => (
                            <div 
                              key={variable} 
                              className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md text-xs"
                            >
                              {`{{${variable}}}`}
                            </div>
                          ))}
                        </div>
                      </div>
                    )} */}
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-gray-500">
                  No email templates found. Click "Add Template" to create a new template.
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageEmailTemplates;