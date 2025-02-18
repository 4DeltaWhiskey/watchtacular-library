
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LogIn, LogOut } from "lucide-react";
import { Link } from "react-router-dom";

const LoginButton = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuth = async () => {
    if (user) {
      try {
        await supabase.auth.signOut();
        toast({
          title: "Signed out successfully",
        });
      } catch (error: any) {
        toast({
          title: "Error signing out",
          description: error.message,
          variant: "destructive",
        });
      }
    } else {
      navigate("/auth");
    }
  };

  return (
    <div className="flex items-center gap-2">
      {isAdmin && (
        <Button
          variant="outline"
          asChild
        >
          <Link to="/admin">Admin</Link>
        </Button>
      )}
      <Button
        variant="outline"
        onClick={handleAuth}
        className="gap-2"
      >
        {user ? (
          <>
            <span>{user.email}</span>
            <LogOut className="h-4 w-4" />
          </>
        ) : (
          <>
            <span>Login</span>
            <LogIn className="h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  );
};

export default LoginButton;
