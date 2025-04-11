
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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

const ManageCMS: React.FC = () => {
  const [cmsPages, setCMSPages] = useState(initialCMSPages);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleDelete = (id: string) => {
    // In a real application, this would call an API to delete the page
    setCMSPages(cmsPages.filter(page => page.id !== id));
    toast({
      title: "Page deleted",
      description: "The page has been deleted successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Manage CMS Pages
        </h1>
        <Button
          onClick={() => navigate("/manage-cms/add")}
          className="bg-myers-yellow text-myers-darkBlue hover:bg-yellow-400"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Page
        </Button>
      </div>

      <Card>
        {/* <CardHeader>
          
        </CardHeader> */}
        <div className="mb-5">

        </div>
        <CardContent>
          {cmsPages.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Page Title</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cmsPages.map((page) => (
                  <TableRow key={page.id}>
                    <TableCell className="font-medium">{page.title}</TableCell>
                    <TableCell>{page.slug}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/manage-cms/edit/${page.id}`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(page.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-6 text-gray-500">
              No CMS pages found. Click "Add Page" to create a new page.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageCMS;
