
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

type UserWithRole = {
  user_id: string;
  role: string;
}

export function UserManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isAdmin, user } = useAuth();

  const { data: users, isLoading, error } = useQuery({
    queryKey: ['app-users'],
    queryFn: async () => {
      if (!isAdmin) {
        throw new Error("Unauthorized");
      }

      // Fetch all roles
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      return roles;
    },
    enabled: isAdmin // Only run query if user is admin
  });

  const handleEmpowerAdmin = async (userId: string) => {
    if (!isAdmin || !user) {
      toast({
        title: "Error",
        description: "You are not authorized to perform this action",
        variant: "destructive",
      });
      return;
    }

    try {
      // First check if the user already has a role
      const { data: existingRole, error: checkError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        throw checkError;
      }

      if (existingRole?.role === 'admin') {
        toast({
          title: "Info",
          description: "User is already an admin",
        });
        return;
      }

      const { error } = await supabase
        .from('user_roles')
        .upsert({ 
          user_id: userId, 
          role: 'admin' 
        });
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "User has been empowered as an admin",
      });
      
      queryClient.invalidateQueries({ queryKey: ['app-users'] });
    } catch (error: any) {
      console.error('Error empowering admin:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to empower user as admin",
        variant: "destructive",
      });
    }
  };

  if (!isAdmin) {
    return (
      <div className="p-4">
        <p className="text-red-500">You do not have permission to access this page.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <p className="text-red-500">Error loading users: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <h2 className="text-2xl font-semibold">Users Management</h2>
      {isLoading ? (
        <p>Loading users...</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {users?.map((user) => (
            <Card key={user.user_id} className="p-4 space-y-4">
              <div>
                <div className="font-medium">User ID: {user.user_id}</div>
                <div className="text-sm text-muted-foreground">
                  Role: {user.role}
                </div>
              </div>
              <Button 
                onClick={() => handleEmpowerAdmin(user.user_id)}
                variant="outline"
                size="sm"
                disabled={user.role === 'admin'}
              >
                <Users className="mr-2 h-4 w-4" />
                {user.role === 'admin' ? 'Already Admin' : 'Empower as Admin'}
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
