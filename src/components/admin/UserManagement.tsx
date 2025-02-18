
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type UserWithRole = {
  id: string;
  email: string | null;
  created_at: string | null;
  role: string;
}

export function UserManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ['app-users'],
    queryFn: async () => {
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      const userIds = [...new Set(userRoles.map(role => role.user_id))];
      
      const usersWithRoles: UserWithRole[] = [];
      
      for (const role of userRoles) {
        const { data: userData, error: userError } = await supabase.auth.admin.getUserById(role.user_id);
        
        if (!userError && userData.user) {
          usersWithRoles.push({
            id: role.user_id,
            email: userData.user.email,
            created_at: userData.user.created_at,
            role: role.role
          });
        }
      }

      return usersWithRoles;
    },
  });

  const handleEmpowerAdmin = async (userId: string) => {
    try {
      const { data: existingRole } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .single();

      if (existingRole) {
        toast({
          title: "Info",
          description: "User is already an admin",
        });
        return;
      }

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
