
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Language, VideoData } from "@/types/video-edit";
import { validateVideoId } from "@/utils/video-validation";
import { useVideoTranslations } from "@/hooks/use-video-translations";
import { useVideoMutation } from "@/hooks/use-video-mutation";

export function useVideoData(id: string | undefined) {
  const [videoData, setVideoData] = useState<VideoData>({
    video_url: "",
    thumbnail: "",
    duration: "",
    author: "",
    category_id: undefined,
  });

  const {
    translations,
    updateTranslationsFromData,
    handleTranslationChange,
    saveTranslations,
  } = useVideoTranslations(id);

  const isNewVideo = !id || id === "new";

  // Query for existing video data
  const { isLoading } = useQuery({
    queryKey: ["admin-video", id],
    queryFn: async () => {
      if (isNewVideo || !id || id === ":id") {
        return null;
      }

      if (!validateVideoId(id)) {
        throw new Error("Invalid video ID format");
      }

      const { data, error } = await supabase
        .from("videos")
        .select(`
          *,
          video_translations (
            language,
            title,
            description
          )
        `)
        .eq("id", id)
        .single();

      if (error) throw error;

      // Initialize form data with existing data
      setVideoData({
        video_url: data.video_url || "",
        thumbnail: data.thumbnail || "",
        duration: data.duration || "",
        author: data.author || "",
        category_id: data.category_id,
      });

      if (data.video_translations) {
        updateTranslationsFromData(data.video_translations);
      }

      return data;
    },
    enabled: !isNewVideo && !!id && id !== ":id",
  });

  const videoMutation = useVideoMutation(id, videoData, saveTranslations);

  const handleVideoDataChange = (field: keyof VideoData, value: string) => {
    setVideoData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return {
    videoData,
    translations,
    isNewVideo,
    isLoading,
    videoMutation,
    handleVideoDataChange,
    handleTranslationChange,
  };
}
