
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from 'lucide-react';

const KnowledgeBaseAdd: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(event.currentTarget);
    const title = formData.get('title') as string;
    const category = formData.get('category') as 'Services' | 'Case Studies' | 'Testimonials';
    const description = formData.get('description') as string;
    const videoUrl = formData.get('videoUrl') as string;
    const blogUrl = formData.get('blogUrl') as string;
    const fileUrl = formData.get('fileUrl') as string;
    const status = formData.get('status') as 'active' | 'inactive';
    
    const newItem = {
      id: Date.now().toString(),
      title,
      category,
      description,
      videoUrl: videoUrl || null,
      blogUrl: blogUrl || null,
      fileUrl: fileUrl || null,
      status,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    // Save to localStorage
    const existingItems = JSON.parse(localStorage.getItem('knowledgeBase') || '[]');
    const updatedItems = [...existingItems, newItem];
    localStorage.setItem('knowledgeBase', JSON.stringify(updatedItems));
    
    // Show success message
    toast({
      title: "Knowledge Base Item Created",
      description: "Your knowledge base item has been created successfully."
    });
    
    // Redirect back to the list page
    setTimeout(() => {
      navigate('/knowledge-base');
    }, 1000);
  };
  
  const handleCancel = () => {
    navigate('/knowledge-base');
  };
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          onClick={handleCancel}
          className="p-0 h-auto"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add Knowledge Base Item</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Create a new knowledge base item</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">Title <span className="text-red-500">*</span></label>
                <Input 
                  id="title" 
                  name="title" 
                  placeholder="Enter title"
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium">Category <span className="text-red-500">*</span></label>
                <select 
                  id="category" 
                  name="category" 
                  className="w-full px-3 py-2 border rounded-md"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Services">Services</option>
                  <option value="Case Studies">Case Studies</option>
                  <option value="Testimonials">Testimonials</option>
                </select>
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="description" className="text-sm font-medium">Description <span className="text-red-500">*</span></label>
                <textarea 
                  id="description" 
                  name="description" 
                  placeholder="Enter description"
                  rows={4}
                  className="w-full px-3 py-2 border rounded-md"
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="videoUrl" className="text-sm font-medium">Video URL</label>
                <Input 
                  id="videoUrl" 
                  name="videoUrl" 
                  placeholder="https://www.youtube.com/watch?v=example"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="blogUrl" className="text-sm font-medium">Blog URL</label>
                <Input 
                  id="blogUrl" 
                  name="blogUrl" 
                  placeholder="https://myerssecurity.com/blog/example"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="fileUrl" className="text-sm font-medium">File URL</label>
                <Input 
                  id="fileUrl" 
                  name="fileUrl" 
                  placeholder="https://example.com/file.pdf"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="status" className="text-sm font-medium">Status <span className="text-red-500">*</span></label>
                <select 
                  id="status" 
                  name="status" 
                  className="w-full px-3 py-2 border rounded-md"
                  required
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-myers-yellow text-myers-darkBlue hover:bg-yellow-400"
              >
                {isSubmitting ? 'Creating...' : 'Create Item'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default KnowledgeBaseAdd;
