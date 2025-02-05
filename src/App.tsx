
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import LanguageSwitcher from "./components/LanguageSwitcher";
import Index from "./pages/Index";
import VideoDetail from "./pages/VideoDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <div className="min-h-screen">
          <LanguageSwitcher />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/video/:id" element={<VideoDetail />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </div>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
