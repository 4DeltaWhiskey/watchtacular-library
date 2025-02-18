
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Language, VideoData, VideoTranslation } from "@/types/video-edit";
import { useNavigate } from "react-router-dom";

export function useVideoData(id: string | undefined) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [videoData, setVideoData] = useState<VideoData>({
    video_url: "",
    thumbnail: "",
    duration: "",
    author: "",
    category_id: undefined,
    title: "", // Added initial value for title
    description: "", // Added initial value for description
  });
  const [translations, setTranslations] = useState<Record<Language, VideoTranslation>>({
    en: { title: "", description: "" },
    ar: { title: "", description: "" },
  });

  const isNewVideo = !id || id === "new";

  // Query for existing video data
  const { isLoading } = useQuery({
    queryKey: ["admin-video", id],
    queryFn: async () => {
      if (isNewVideo || !id || id === ":id") {
        return null;
      }

      // Validate UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(id)) {
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
        title: data.title || "", // Added title
        description: data.description || "", // Added description
      });

      if (data.video_translations) {
        const newTranslations: Record<Language, VideoTranslation> = {
          en: { title: "", description: "" },
          ar: { title: "", description: "" },
        };

        data.video_translations.forEach((trans: any) => {
          if (trans.language === "en" || trans.language === "ar") {
            newTranslations[trans.language] = {
              title: trans.title || "",
              description: trans.description || "",
            };
          }
        });

        setTranslations(newTranslations);
      }

      return data;
    },
    enabled: !isNewVideo && !!id && id !== ":id",
  });

  // Mutation for creating/updating video
  const videoMutation = useMutation({
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
        const translationPromises = Object.entries(translations).map(([lang, trans]) => {
          return supabase
            .from("video_translations")
            .insert({
              video_id: newVideo.id,
              language: lang,
              title: trans.title,
              description: trans.description,
            });
        });

        const results = await Promise.all(translationPromises);
        const errors = results.filter((result) => result.error);

        if (errors.length > 0) {
          throw new Error("Failed to create some translations");
        }

        return newVideo.id;
      } else {
        // Update existing video
        const { error: videoError } = await supabase
          .from("videos")
          .update(videoData)
          .eq("id", id);

        if (videoError) throw videoError;

        // Update translations using upsert
        const translationPromises = Object.entries(translations).map(([lang, trans]) => {
          return supabase
            .from("video_translations")
            .upsert(
              {
                video_id: id,
                language: lang,
                title: trans.title,
                description: trans.description,
              },
              {
                onConflict: 'video_id,language',
                ignoreDuplicates: false,
              }
            );
        });

        const results = await Promise.all(translationPromises);
        const errors = results.filter((result) => result.error);

        if (errors.length > 0) {
          throw new Error("Failed to update some translations");
        }

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

  const handleVideoDataChange = (field: keyof VideoData, value: string) => {
    setVideoData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTranslationChange = (
    lang: Language,
    field: keyof VideoTranslation,
    value: string
  ) => {
    setTranslations((prev) => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        [field]: value,
      },
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
