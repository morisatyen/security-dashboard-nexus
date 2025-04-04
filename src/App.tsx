
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

import Splash from "./components/Splash";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import AdminUsers from "./pages/AdminUsers";
import SupportEngineers from "./pages/SupportEngineers";
import SupportEngineerAdd from "./pages/SupportEngineerAdd";
import SupportEngineerEdit from "./pages/SupportEngineerEdit";
import Dispensaries from "./pages/Dispensaries";
import DispensaryAdd from "./pages/DispensaryAdd";
import DispensaryEdit from "./pages/DispensaryEdit";
import DispensaryView from "./pages/DispensaryView";
import ServiceRequests from "./pages/ServiceRequests";
import ServiceRequestEdit from "./pages/ServiceRequestEdit";
import KnowledgeBase from "./pages/KnowledgeBase";
import KnowledgeBaseAdd from "./pages/KnowledgeBaseAdd";
import KnowledgeBaseEdit from "./pages/KnowledgeBaseEdit";
import ManageCMS from "./pages/ManageCMS";
import ManageEmailTemplates from "./pages/ManageEmailTemplates";
import EmailTemplateEdit from "./pages/EmailTemplateEdit";
import EditProfile from "./pages/EditProfile";

// Initialize data
import { getInitialData } from "./data/initialData";
import AdminUserAdd from "./pages/AdminUserAdd";
import AdminUserEdit from "./pages/AdminUserEdit";
getInitialData();

const queryClient = new QueryClient();

const App = () => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Splash />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/" element={<Layout />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="users/admin-users" element={<AdminUsers />} />
                <Route path="users/admin-users/add" element={<AdminUserAdd />} />
                <Route path="users/admin-users/edit/:id" element={<AdminUserEdit />} />
                <Route path="users/support-engineers" element={<SupportEngineers />} />
                <Route path="users/support-engineers/add" element={<SupportEngineerAdd />} />
                <Route path="users/support-engineers/edit/:id" element={<SupportEngineerEdit />} />
                <Route path="dispensaries" element={<Dispensaries />} />
                <Route path="dispensaries/add" element={<DispensaryAdd />} />
                <Route path="dispensaries/edit/:id" element={<DispensaryEdit />} />
                <Route path="dispensaries/view/:id" element={<DispensaryView />} />                
                <Route path="service-requests" element={<ServiceRequests />} />
                <Route path="service-requests/edit/:id" element={<ServiceRequestEdit />} />                
                <Route path="knowledge-base" element={<KnowledgeBase />} />
                <Route path="knowledge-base/add" element={<KnowledgeBaseAdd />} />
                <Route path="knowledge-base/edit/:id" element={<KnowledgeBaseEdit />} />
                <Route path="manage-cms" element={<ManageCMS />} />
                <Route path="email-templates" element={<ManageEmailTemplates />} />
                <Route path="email-templates/edit/:id" element={<EmailTemplateEdit />} />
                <Route path="edit-profile" element={<EditProfile />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
