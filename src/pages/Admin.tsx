
import { Settings, Users, Video } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type Tab = "users" | "videos" | "settings";

export default function Admin() {
  const [activeTab, setActiveTab] = useState<Tab>("users");

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await supabase.auth.admin.listUsers();
      if (error) throw error;
      return data.users;
    },
  });

  const { data: videos, isLoading: videosLoading } = useQuery({
    queryKey: ['admin-videos'],
    queryFn: async () => {
      const { data, error } = await supabase.from('videos').select('*');
      if (error) throw error;
      return data;
    },
  });

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
                  <Card key={user.id} className="p-4">
                    <div className="font-medium">{user.email}</div>
                    <div className="text-sm text-muted-foreground">
                      Created: {new Date(user.created_at).toLocaleDateString()}
                    </div>
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
                    <div className="font-medium">{video.title}</div>
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
