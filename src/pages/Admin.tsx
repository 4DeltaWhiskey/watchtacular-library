
import { Settings, Users, Video } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Tab = "users" | "videos" | "settings";

export default function Admin() {
  const [activeTab, setActiveTab] = useState<Tab>("users");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['app-users'],
    queryFn: async () => {
      // Instead of using admin.listUsers(), we'll query our user_roles table
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select(`
          user_id,
          role,
          users:user_id (
            email,
            created_at
          )
        `);

      if (rolesError) throw rolesError;
      return userRoles.map(role => ({
        id: role.user_id,
        email: role.users?.email,
        created_at: role.users?.created_at,
        role: role.role
      }));
    },
  });

  const { data: videos, isLoading: videosLoading } = useQuery({
    queryKey: ['admin-videos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('videos')
        .select(`
          *,
          video_translations (
            title,
            language
          )
        `);
      if (error) throw error;
      return data;
    },
  });

  const handleEmpowerAdmin = async (userId: string) => {
    try {
      // Check if user is already an admin
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
      
      // Refresh users data
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
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      
      <div className="flex gap-4">
        <Button
          variant={activeTab === "users" ? "default" : "outline"}
          onClick={() => setActiveTab("users")}
        >
          <Users className="mr-2 h-4 w-4" />
          Users
        </Button>
        <Button
          variant={activeTab === "videos" ? "default" : "outline"}
          onClick={() => setActiveTab("videos")}
        >
          <Video className="mr-2 h-4 w-4" />
          Videos
        </Button>
        <Button
          variant={activeTab === "settings" ? "default" : "outline"}
          onClick={() => setActiveTab("settings")}
        >
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </div>

      <Separator />

      <div className="grid gap-6">
        {activeTab === "users" && (
          <div className="grid gap-4">
            <h2 className="text-2xl font-semibold">Users Management</h2>
            {usersLoading ? (
              <p>Loading users...</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {users?.map((user) => (
                  <Card key={user.id} className="p-4 space-y-4">
                    <div>
                      <div className="font-medium">{user.email}</div>
                      <div className="text-sm text-muted-foreground">
                        Created: {new Date(user.created_at).toLocaleDateString()}
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
        )}

        {activeTab === "videos" && (
          <div className="grid gap-4">
            <h2 className="text-2xl font-semibold">Videos Management</h2>
            {videosLoading ? (
              <p>Loading videos...</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {videos?.map((video) => (
                  <Card key={video.id} className="p-4">
                    <div className="font-medium">
                      {video.video_translations?.[0]?.title || 'Untitled Video'}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Views: {video.views}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "settings" && (
          <div className="grid gap-4">
            <h2 className="text-2xl font-semibold">Settings</h2>
            <Card className="p-6">
              <p>Admin settings coming soon...</p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
