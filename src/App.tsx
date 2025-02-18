
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ThemeProvider } from "next-themes";
import LanguageSwitcher from "./components/LanguageSwitcher";
import Index from "./pages/Index";
import VideoDetail from "./pages/VideoDetail";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import { VideoEdit } from "./components/admin/VideoEdit";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark">
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <div className="min-h-screen">
            <BrowserRouter>
              <LanguageSwitcher />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/video/:id" element={<VideoDetail />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/videos/:id/edit" element={<VideoEdit />} />
                <Route path="/admin/videos/new" element={<VideoEdit />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </div>
        </TooltipProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
