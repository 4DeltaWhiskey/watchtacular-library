
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Edit, Plus, Star, Trash2 } from "lucide-react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type SortOption = "titleAsc" | "titleDesc" | "viewsAsc" | "viewsDesc" | "dateAsc" | "dateDesc";

export function VideoManagement() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [sortBy, setSortBy] = useState<SortOption>("dateDesc");
  const [videoToDelete, setVideoToDelete] = useState<string | null>(null);
  const [showFinalConfirmation, setShowFinalConfirmation] = useState(false);
  
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
        `)
        .is('deleted_at', null);  // Only fetch non-deleted videos
      if (error) throw error;
      return data;
    },
  });

  const sortedVideos = videos?.slice().sort((a, b) => {
    if (a.is_featured) return -1;
    if (b.is_featured) return 1;

    const titleA = a.video_translations?.[0]?.title || '';
    const titleB = b.video_translations?.[0]?.title || '';
    const viewsA = a.views;
    const viewsB = b.views;
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();

    switch (sortBy) {
      case 'titleAsc':
        return titleA.localeCompare(titleB);
      case 'titleDesc':
        return titleB.localeCompare(titleA);
      case 'viewsAsc':
        return viewsA - viewsB;
      case 'viewsDesc':
        return viewsB - viewsA;
      case 'dateAsc':
        return dateA - dateB;
      case 'dateDesc':
        return dateB - dateA;
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

  const deleteMutation = useMutation({
    mutationFn: async (videoId: string) => {
      const { error } = await supabase
        .from('videos')
        .update({
          deleted_at: new Date().toISOString(),
          is_featured: false, // Remove featured status when deleting
        })
        .eq('id', videoId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-videos'] });
      toast({
        title: "Success",
        description: "Video has been deleted",
      });
      setVideoToDelete(null);
      setShowFinalConfirmation(false);
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

  const handleDelete = (videoId: string) => {
    deleteMutation.mutate(videoId);
  };

  const handleInitialDeleteClick = (videoId: string) => {
    setVideoToDelete(videoId);
  };

  const handleFirstConfirm = () => {
    setShowFinalConfirmation(true);
  };

  const handleCancel = () => {
    setVideoToDelete(null);
    setShowFinalConfirmation(false);
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
              <SelectItem value="dateDesc">Newest First</SelectItem>
              <SelectItem value="dateAsc">Oldest First</SelectItem>
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
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>Views: {video.views}</div>
                  <div>Uploaded: {new Date(video.created_at).toLocaleDateString()}</div>
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
                  <AlertDialog open={videoToDelete === video.id && !showFinalConfirmation}>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleInitialDeleteClick(video.id)}
                        className="flex-1"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action will delete the video "{video.video_translations?.[0]?.title}". This action requires additional confirmation.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleFirstConfirm}>Continue</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <AlertDialog open={videoToDelete === video.id && showFinalConfirmation}>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Final Confirmation Required</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you absolutely sure you want to delete this video? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDelete(video.id)}
                          className="bg-destructive hover:bg-destructive/90"
                        >
                          Delete Video
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
