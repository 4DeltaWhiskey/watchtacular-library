
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

type UserWithRole = {
  id: string;
  email: string | null;
  created_at: string | null;
  role: string;
}

export function UserManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isAdmin } = useAuth();

  const { data: users, isLoading, error } = useQuery({
    queryKey: ['app-users'],
    queryFn: async () => {
      if (!isAdmin) {
        throw new Error("Unauthorized");
      }

      // Get all users with roles using a single query
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');

      if (rolesError) throw rolesError;

      const usersWithRoles: UserWithRole[] = [];
      
      // Fetch user details for each role
      for (const role of roles) {
        try {
          const { data: { user }, error: userError } = await supabase.auth.admin.getUserById(role.user_id);
          
          if (!userError && user) {
            usersWithRoles.push({
              id: user.id,
              email: user.email,
              created_at: user.created_at,
              role: role.role
            });
          }
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      }

      return usersWithRoles;
    },
    enabled: isAdmin // Only run query if user is admin
  });

  const handleEmpowerAdmin = async (userId: string) => {
    if (!isAdmin) {
      toast({
        title: "Error",
        description: "You are not authorized to perform this action",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role: 'admin' });
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "User has been empowered as an admin",
      });
      
      queryClient.invalidateQueries({ queryKey: ['app-users'] });
    } catch (error: any) {
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
            <Card key={user.id} className="p-4 space-y-4">
              <div>
                <div className="font-medium">{user.email}</div>
                <div className="text-sm text-muted-foreground">
                  Created: {new Date(user.created_at || '').toLocaleDateString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  Role: {user.role}
                </div>
              </div>
              <Button 
                onClick={() => handleEmpowerAdmin(user.id)}
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
