
import { AdminProtectedRoute } from "@/components/AdminProtectedRoute";
import Auth from "@/pages/Auth";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import VideoDetail from "@/pages/VideoDetail";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Admin from "@/pages/Admin";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import LoginButton from "@/components/LoginButton";

const queryClient = new QueryClient();

export default function App() {
  return (
    <Router>
      <ThemeProvider attribute="class" defaultTheme="system" storageKey="vite-ui-theme">
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <div className="min-h-screen">
              <div className="flex items-center justify-end gap-4 p-4">
                <ThemeSwitcher />
                <LanguageSwitcher />
                <LoginButton />
              </div>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route 
                  path="/admin" 
                  element={
                    <AdminProtectedRoute>
                      <Admin />
                    </AdminProtectedRoute>
                  } 
                />
                <Route path="/videos/:id" element={<VideoDetail />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
            </div>
          </QueryClientProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}
