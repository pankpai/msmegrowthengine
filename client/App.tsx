import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Layout from "@/components/Layout";
import DashboardLayout from "@/components/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Dashboard from "@/pages/Dashboard";
import Services from "@/pages/Services";
import ServiceA from "@/pages/ServiceA";
import ServiceB from "@/pages/ServiceB";
import Profile from "@/pages/Profile";
import { Provider } from "react-redux";
import { store } from "./store/store";
import InfluencerServiceFrame from "./pages/builder-influence/Index";
import ReviewSenitmentServiceFrame from "./pages/review-sentiment/Index";
import PricingPlans from "./pages/Pricing";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Site layout routes */}
          <Route element={<ProtectedRoute />}>
            <Route
              path="/builder-influencer"
              element={<InfluencerServiceFrame />}
            />
            <Route
              path="/review-sentiment"
              element={<ReviewSenitmentServiceFrame />}
            />
          </Route>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/services/list" element={<Services />} />
             <Route path="/pricing" element={<PricingPlans />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Dashboard layout routes (protected) */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/service-a" element={<ServiceA />} />
              <Route path="/services/service-b" element={<ServiceB />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <App />
  </Provider>,
);
