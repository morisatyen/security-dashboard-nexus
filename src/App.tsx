
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
import Dispensaries from "./pages/Dispensaries";
import ServiceRequests from "./pages/ServiceRequests";
import Invoices from "./pages/Invoices";
import KnowledgeBase from "./pages/KnowledgeBase";
import KnowledgeBaseAdd from "./pages/KnowledgeBaseAdd";
import KnowledgeBaseEdit from "./pages/KnowledgeBaseEdit";

// Initialize data
import { getInitialData } from "./data/initialData";
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
                <Route path="users/support-engineers" element={<SupportEngineers />} />
                <Route path="dispensaries" element={<Dispensaries />} />
                <Route path="service-requests" element={<ServiceRequests />} />
                <Route path="invoices" element={<Invoices />} />
                <Route path="knowledge-base" element={<KnowledgeBase />} />
                <Route path="knowledge-base/add" element={<KnowledgeBaseAdd />} />
                <Route path="knowledge-base/edit/:id" element={<KnowledgeBaseEdit />} />
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
