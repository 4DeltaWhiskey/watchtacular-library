
import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";
import VideoDetail from "@/pages/VideoDetail";
import NotFound from "@/pages/NotFound";
import Admin from "@/pages/Admin";
import Auth from "@/pages/Auth";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AdminProtectedRoute } from "@/components/AdminProtectedRoute";
import { VideoEdit } from "@/components/admin/VideoEdit";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/video/:id" element={<VideoDetail />} />
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/admin"
              element={
                <AdminProtectedRoute>
                  <Admin />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/videos/:id/edit"
              element={
                <AdminProtectedRoute>
                  <VideoEdit />
                </AdminProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
