
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

export const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, user, session } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to access the admin panel",
        variant: "destructive",
      });
    } else if (!isAdmin) {
      toast({
        title: "Access denied",
        description: "You need admin privileges to access this page",
        variant: "destructive",
      });
    }
  }, [session, isAdmin, toast]);

  // If there's no session, redirect to auth page
  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  // If user is logged in but not admin, redirect to home
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  // If user is admin, render the admin page
  return <>{children}</>;
};
