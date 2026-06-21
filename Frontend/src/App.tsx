import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import ScrollToTop from "./components/ScrollToTop";
import ContactSupport from "./pages/ContactSupport";

import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import EditGig from "./pages/EditGig";
import EditProfile from "./pages/EditProfile";

import Services from "./pages/Services";
import About from "./pages/About";
import Contact from "./pages/Contact";
import BrowseGigs from "./pages/BrowseGigs";
import GigDetail from "./pages/GigDetail";
import MistriDashboard from "./pages/MistriDashboard";
import ClientDashboard from "./pages/ClientDashboard";
import CreateGig from "./pages/CreateGig";
import Orders from "./pages/Orders";
import Messages from "./pages/Messages";
import AdminPanel from "./pages/AdminPanel";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
 

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Layout>
              <Routes>
                {/* Public routes - accessible to clients and guests, not mistris when logged in */}
                <Route 
                  path="/" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <Home />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/services" 
                  element={
                    <ProtectedRoute allowedRoles={['client', 'admin']}>
                      <Services />
                    </ProtectedRoute>
                  } 
                />
                <Route path="/contact-support" element={<ContactSupport />} />

                <Route 
                  path="/gigs" 
                  element={
                    <ProtectedRoute allowedRoles={['client', 'admin']}>
                      <BrowseGigs />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/gig/:id" 
                  element={
                    <ProtectedRoute allowedRoles={['client', 'admin']}>
                      <GigDetail />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/about" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <About />
                    </ProtectedRoute>
                  } 
                />
                <Route path="/edit-gig/:id" element={<ProtectedRoute allowedRoles={['mistri']}><EditGig /></ProtectedRoute>} />
<Route path="/edit-profile" element={<EditProfile />} />

                <Route 
                  path="/contact" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <Contact />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Dashboard routes */}
                <Route path="/mistri-dashboard" element={<MistriDashboard />} />
                <Route 
                  path="/client-dashboard" 
                  element={
                    <ProtectedRoute allowedRoles={['client']}>
                      <ClientDashboard />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Mistri-specific routes */}
                <Route 
                  path="/create-gig" 
                  element={
                    <ProtectedRoute allowedRoles={['mistri']}>
                      <CreateGig />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Shared routes */}
                <Route path="/orders" element={<Orders />} />
                <Route path="/messages" element={<Messages />} />
                
                {/* Admin routes */}
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminPanel />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Auth routes */}
                <Route path="/login" element={<Login />} />
                
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
