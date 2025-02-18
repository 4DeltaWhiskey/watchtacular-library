import { AdminProtectedRoute } from "@/components/AdminProtectedRoute";
import { Auth } from "@/pages/Auth";
import { Index } from "@/pages/Index";
import { NotFound } from "@/pages/NotFound";
import { VideoDetail } from "@/pages/VideoDetail";
import { Header } from "@/components/Header";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Admin from "@/pages/Admin";

const queryClient = new QueryClient();

export default function App() {
  return (
    <Router>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <div className="min-h-screen">
              <Header />
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
