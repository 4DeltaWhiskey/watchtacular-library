
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

export const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, user } = useAuth();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
