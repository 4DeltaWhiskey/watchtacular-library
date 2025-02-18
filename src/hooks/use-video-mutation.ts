
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { VideoData } from "@/types/video-edit";
import { useNavigate } from "react-router-dom";

export function useVideoMutation(
  id: string | undefined,
  videoData: VideoData,
  saveTranslations: (videoId: string) => Promise<void>
) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isNewVideo = !id || id === "new";

  return useMutation({
    mutationFn: async () => {
      if (isNewVideo) {
        // Create new video
        const { data: newVideo, error: videoError } = await supabase
          .from("videos")
          .insert({
            ...videoData,
            views: 0,
            likes: 0,
          })
          .select()
          .single();

        if (videoError) throw videoError;

        // Create translations for the new video
        await saveTranslations(newVideo.id);
        return newVideo.id;
      } else {
        // Update existing video
        const { error: videoError } = await supabase
          .from("videos")
          .update(videoData)
          .eq("id", id);

        if (videoError) throw videoError;

        // Update translations
        await saveTranslations(id);
        return id;
      }
    },
    onSuccess: (newVideoId) => {
      toast({
        title: "Success",
        description: isNewVideo ? "Video created successfully" : "Video updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["admin-videos"] });
      if (isNewVideo) {
        navigate(`/admin/videos/${newVideoId}/edit`);
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save video",
        variant: "destructive",
      });
    },
  });
}
