
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Edit, Plus, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export function VideoManagement() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
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

  const toggleFeatureMutation = useMutation({
    mutationFn: async (videoId: string) => {
      const { error } = await supabase
        .from('videos')
        .update({ is_featured: true })
        .eq('id', videoId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-videos'] });
      toast({
        title: "Success",
        description: "Featured video updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleEdit = (videoId: string) => {
    navigate(`/admin/videos/${videoId}/edit`);
  };

  const handleNewVideo = () => {
    navigate(`/admin/videos/new`);
  };

  const handleToggleFeature = (videoId: string) => {
    toggleFeatureMutation.mutate(videoId);
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
                <div className="relative">
                  <img 
                    src={video.thumbnail} 
                    alt={video.video_translations?.[0]?.title || 'Video thumbnail'}
                    className="w-full h-40 object-cover rounded-md"
                  />
                  {video.is_featured && (
                    <div className="absolute top-2 right-2 bg-primary/90 text-white px-2 py-1 rounded-md text-sm flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      Featured
                    </div>
                  )}
                </div>
                <div className="font-medium">
                  {video.video_translations?.[0]?.title || 'Untitled Video'}
                </div>
                <div className="text-sm text-muted-foreground">
                  Views: {video.views}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(video.id)}
                    className="flex-1"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant={video.is_featured ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => handleToggleFeature(video.id)}
                    className="flex-1"
                    disabled={video.is_featured}
                  >
                    <Star className="mr-2 h-4 w-4" />
                    {video.is_featured ? 'Featured' : 'Set Featured'}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
