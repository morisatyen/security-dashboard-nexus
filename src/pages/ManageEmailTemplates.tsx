
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

const ManageEmailTemplates: React.FC = () => {
  const [templates] = useState(initialTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  const handleEditTemplate = (templateId: string) => {
    navigate(`/email-templates/edit/${templateId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Email Templates</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Email Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-4">
              {templates.map(template => (
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
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditTemplate(template.id);
                      }}
                      className="px-2"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    Subject: {template.subject}
                  </p>
                  {selectedTemplate === template.id && (
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
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageEmailTemplates;
