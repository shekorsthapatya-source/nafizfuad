import { useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Photography from "./pages/Photography";
import PhotoDetail from "./pages/PhotoDetail";
import ProjectDetail from "./pages/ProjectDetail";
import AwardDetail from "./pages/AwardDetail";

const queryClient = new QueryClient();

const PageTitle = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    const map: Record<string, string> = {
      "/": "Nafiz Fuad | Home",
      "/about": "Nafiz Fuad | About",
      "/projects": "Nafiz Fuad | Projects",
      "/awards": "Nafiz Fuad | Awards",
      "/photography": "Nafiz Fuad | Photography",
      "/contact": "Nafiz Fuad | Contact",
      "/admin": "Nafiz Fuad | Admin",
      "/login": "Nafiz Fuad | Login",
    };
    document.title = map[pathname] || "Nafiz Fuad";
  }, [pathname]);
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Analytics />
      <BrowserRouter>
        <PageTitle />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<Index />} />
          <Route path="/projects" element={<Index />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="/awards" element={<Index />} />
          <Route path="/awards/:slug" element={<AwardDetail />} />
          <Route path="/contact" element={<Index />} />
          <Route path="/photography" element={<Photography />} />
          <Route path="/photography/:slug" element={<PhotoDetail />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
