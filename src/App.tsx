
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "next-themes";
import LanguageSwitcher from "./components/LanguageSwitcher";
import { ThemeSwitcher } from "./components/ThemeSwitcher";
import LoginButton from "./components/LoginButton";
import Index from "./pages/Index";
import VideoDetail from "./pages/VideoDetail";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark">
      <AuthProvider>
        <LanguageProvider>
          <BrowserRouter>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <div className="min-h-screen">
                <header className="fixed top-0 right-0 w-full bg-background/80 backdrop-blur-sm border-b z-50">
                  <div className="container mx-auto">
                    <div className="flex items-center justify-end gap-4 p-4">
                      <ThemeSwitcher />
                      <LanguageSwitcher />
                      <LoginButton />
                    </div>
                  </div>
                </header>
                <main className="pt-20">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/video/:id" element={<VideoDetail />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
              </div>
            </TooltipProvider>
          </BrowserRouter>
        </LanguageProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
