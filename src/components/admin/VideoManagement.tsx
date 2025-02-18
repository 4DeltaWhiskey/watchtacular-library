
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Edit, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function VideoManagement() {
  const navigate = useNavigate();
  
  const { data: videos, isLoading } = useQuery({
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

  const handleEdit = (videoId: string) => {
    navigate(`/admin/videos/${videoId}/edit`);
  };

  const handleNewVideo = () => {
    navigate(`/admin/videos/new`);
  };

  return (
    <div className="grid gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Videos Management</h2>
        <Button onClick={handleNewVideo}>
          <Plus className="mr-2 h-4 w-4" />
          New Video
        </Button>
      </div>
      {isLoading ? (
        <p>Loading videos...</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {videos?.map((video) => (
            <Card key={video.id} className="p-4">
              <div className="space-y-4">
                <img 
                  src={video.thumbnail} 
                  alt={video.video_translations?.[0]?.title || 'Video thumbnail'}
                  className="w-full h-40 object-cover rounded-md"
                />
                <div className="font-medium">
                  {video.video_translations?.[0]?.title || 'Untitled Video'}
                </div>
                <div className="text-sm text-muted-foreground">
                  Views: {video.views}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(video.id)}
                  className="w-full"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
