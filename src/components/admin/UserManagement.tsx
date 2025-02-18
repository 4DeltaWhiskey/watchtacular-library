
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
      // First get all users from auth.users through our proxy
      const { data: userData, error: userError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (userError) throw userError;

      const usersWithRoles: UserWithRole[] = [];
      
      for (const role of userData) {
        const { data: user, error: userError } = await supabase.auth.admin.getUserById(role.user_id);
        
        if (!userError && user.user) {
          usersWithRoles.push({
            id: role.user_id,
            email: user.user.email,
            created_at: user.user.created_at,
            role: role.role
          });
        }
      }

      return usersWithRoles;
    },
  });

  const handleEmpowerAdmin = async (userId: string) => {
    try {
      // First check if user is already admin
      const { data: isAdmin } = await supabase.rpc(
        'check_user_role',
        { user_id: userId, required_role: 'admin' }
      );

      if (isAdmin) {
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
