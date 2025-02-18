
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Edit, Plus, Star, ArrowUpDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SortOption = "titleAsc" | "titleDesc" | "viewsAsc" | "viewsDesc";

export function VideoManagement() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [sortBy, setSortBy] = useState<SortOption>("titleAsc");
  
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
          ),
          category:categories(
            name,
            translations:category_translations(
              name,
              language
            )
          )
        `);
      if (error) throw error;
      return data;
    },
  });

  const sortedVideos = videos?.slice().sort((a, b) => {
    const titleA = a.video_translations?.[0]?.title || '';
    const titleB = b.video_translations?.[0]?.title || '';
    const viewsA = a.views;
    const viewsB = b.views;

    switch (sortBy) {
      case 'titleAsc':
        return titleA.localeCompare(titleB);
      case 'titleDesc':
        return titleB.localeCompare(titleA);
      case 'viewsAsc':
        return viewsA - viewsB;
      case 'viewsDesc':
        return viewsB - viewsA;
      default:
        return 0;
    }
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
        <div className="flex items-center gap-4">
          <Select
            value={sortBy}
            onValueChange={(value: SortOption) => setSortBy(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="titleAsc">Title A-Z</SelectItem>
              <SelectItem value="titleDesc">Title Z-A</SelectItem>
              <SelectItem value="viewsAsc">Views (Low to High)</SelectItem>
              <SelectItem value="viewsDesc">Views (High to Low)</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleNewVideo}>
            <Plus className="mr-2 h-4 w-4" />
            New Video
          </Button>
        </div>
      </div>
      {isLoading ? (
        <p>Loading videos...</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sortedVideos?.map((video) => (
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
                  <div className="absolute bottom-2 left-2 bg-black/60 text-white px-2 py-1 rounded text-sm">
                    {video.category?.translations?.[0]?.name || video.category?.name || "Uncategorized"}
                  </div>
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
