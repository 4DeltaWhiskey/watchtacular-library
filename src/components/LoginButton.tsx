
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LogIn, LogOut } from "lucide-react";

const LoginButton = () => {
  const { user } = useAuth();
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
  );
};

export default LoginButton;
