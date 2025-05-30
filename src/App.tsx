
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
import AdminUserAdd from "./pages/AdminUserAdd";
import AdminUserEdit from "./pages/AdminUserEdit";
import SupportEngineers from "./pages/SupportEngineers";
import SupportEngineerAdd from "./pages/SupportEngineerAdd";
import SupportEngineerEdit from "./pages/SupportEngineerEdit";
import Dispensaries from "./pages/Dispensaries";
import DispensaryAdd from "./pages/DispensaryAdd";
import DispensaryEdit from "./pages/DispensaryEdit";
import DispensaryView from "./pages/DispensaryView";
import ServiceRequests from "./pages/ServiceRequests";
import ServiceRequestEdit from "./pages/ServiceRequestEdit";
import ServiceRequestView from "./pages/ServiceRequestView";
import KnowledgeBase from "./pages/KnowledgeBase";
import KnowledgeBaseAdd from "./pages/KnowledgeBaseAdd";
import KnowledgeBaseEdit from "./pages/KnowledgeBaseEdit";
import ManageCMS from "./pages/ManageCMS";
import CMSPageAdd from "./pages/CMSPageAdd";
import CMSPageEdit from "./pages/CMSPageEdit";
import EditProfile from "./pages/EditProfile";
import Chat from "./pages/Chat";

// Initialize data
import { getInitialData } from "./data/initialData";
import Settings from "./pages/Settings";
import ManageServices from "./pages/ManageServices";
import ManageServicesAdd from "./pages/ManageServicesAdd";
import ManageServicesEdit from "./pages/ManageServicesEdit";
import ManageEmailTemplatesAdd from "./pages/ManageEmailTemplatesAdd";
import ManageEmailTemplatesEdit from "./pages/ManageEmailTemplatesEdit";
import ManageEmailTemplates from "./pages/ManageEmailTemplates";
import ManageBanner from "./pages/ManageBanner";
import ManageBannerAdd from "./pages/ManageBannerAdd";
import ManageBannerEdit from "./pages/ManageBannerEdit";
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
                <Route path="support-ticket" element={<ServiceRequests />} />
                <Route path="support-ticket/edit/:id" element={<ServiceRequestEdit />} />
                <Route path="support-ticket/view/:id" element={<ServiceRequestView />} />                
                <Route path="knowledge-base" element={<KnowledgeBase />} />
                <Route path="knowledge-base/add" element={<KnowledgeBaseAdd />} />
                <Route path="knowledge-base/edit/:id" element={<KnowledgeBaseEdit />} />
                <Route path="services" element={<ManageServices />} />
                <Route path="services/add" element={<ManageServicesAdd />} />
                <Route path="services/edit/:id" element={<ManageServicesEdit />} />
                <Route path="manage-cms" element={<ManageCMS />} />
                <Route path="manage-cms/add" element={<CMSPageAdd />} />
                <Route path="manage-cms/edit/:id" element={<CMSPageEdit />} />
                <Route path="email-templates" element={<ManageEmailTemplates />} />
                <Route path="email-templates/add" element={<ManageEmailTemplatesAdd />} />
                <Route path="email-templates/edit/:id" element={<ManageEmailTemplatesEdit />} />                
                <Route path="edit-profile" element={<EditProfile />} />
                <Route path="chat" element={<Chat />} />
                <Route path="chat/:id" element={<Chat />} />
                <Route path="settings" element={<Settings />} />
                <Route path="banners" element={<ManageBanner />} />
                <Route path="banners/add" element={<ManageBannerAdd />} />
                <Route path="banners/edit/:id" element={<ManageBannerEdit />} />
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
