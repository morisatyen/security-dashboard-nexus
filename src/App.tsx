
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

import Splash from "./components/Splash";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import AdminUsers from "./pages/AdminUsers";
import SupportEngineers from "./pages/SupportEngineers";
import Dispensaries from "./pages/Dispensaries";
import ServiceRequests from "./pages/ServiceRequests";
import Invoices from "./pages/Invoices";

// Initialize data
import { getInitialData } from "./data/initialData";
getInitialData();

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Splash />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Layout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="users" element={<div>Users Management</div>} />
              <Route path="users/admin-users" element={<AdminUsers />} />
              <Route path="users/support-engineers" element={<SupportEngineers />} />
              <Route path="dispensaries" element={<Dispensaries />} />
              <Route path="service-requests" element={<ServiceRequests />} />
              <Route path="invoices" element={<Invoices />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
