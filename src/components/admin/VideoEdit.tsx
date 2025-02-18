
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VideoFormFields } from "./VideoFormFields";
import { VideoTranslations } from "./VideoTranslations";
import { Language, VideoData, VideoTranslation } from "@/types/video-edit";

export function VideoEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [videoData, setVideoData] = useState<VideoData>({
    video_url: "",
    thumbnail: "",
    duration: "",
    author: "",
    category_id: undefined,
  });
  const [translations, setTranslations] = useState<Record<Language, VideoTranslation>>({
    en: { title: "", description: "" },
    ar: { title: "", description: "" },
  });

  const isNewVideo = !id || id === "new";

  // Query for categories
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data;
    },
  });

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
        video_url: data.video_url,
        thumbnail: data.thumbnail,
        duration: data.duration,
        author: data.author,
        category_id: data.category_id,
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

  const translateMutation = useMutation({
    mutationFn: async (text: string) => {
      const { data, error } = await supabase.functions.invoke('translate-text', {
        body: { text },
      });

      if (error) throw error;
      return data.translatedText;
    },
  });

  const handleTranslate = async () => {
    try {
      // Translate title
      if (translations.en.title) {
        const translatedTitle = await translateMutation.mutateAsync(translations.en.title);
        handleTranslationChange("ar", "title", translatedTitle);
      }

      // Translate description
      if (translations.en.description) {
        const translatedDesc = await translateMutation.mutateAsync(translations.en.description);
        handleTranslationChange("ar", "description", translatedDesc);
      }

      toast({
        title: "Success",
        description: "Text translated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to translate text",
        variant: "destructive",
      });
    }
  };

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    videoMutation.mutate();
  };

  if (!isNewVideo && isLoading) {
    return <div>Loading...</div>;
  }

  if (!isNewVideo && id === ":id") {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-500">Invalid video ID</p>
          <Button
            variant="ghost"
            className="mt-4"
            onClick={() => navigate("/admin")}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Videos
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        className="mb-6 group"
        onClick={() => navigate("/admin")}
      >
        <ChevronLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
        Back to Videos
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>{isNewVideo ? "Add New Video" : "Edit Video"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <VideoFormFields
              videoData={videoData}
              categories={categories}
              onVideoDataChange={handleVideoDataChange}
            />

            <VideoTranslations
              translations={translations}
              onTranslationChange={handleTranslationChange}
              onTranslate={handleTranslate}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={videoMutation.isPending}
            >
              {videoMutation.isPending ? "Saving..." : (isNewVideo ? "Create Video" : "Save Changes")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
