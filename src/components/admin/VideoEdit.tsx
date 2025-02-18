
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Language = "en" | "ar";

type VideoTranslation = {
  title: string;
  description: string | null;
};

type VideoData = {
  video_url: string;
  thumbnail: string;
  duration: string;
  author: string;
};

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
  });
  const [translations, setTranslations] = useState<Record<Language, VideoTranslation>>({
    en: { title: "", description: "" },
    ar: { title: "", description: "" },
  });

  const isNewVideo = id === "new";

  // Query for existing video data
  const { isLoading } = useQuery({
    queryKey: ["admin-video", id],
    queryFn: async () => {
      // Return null for new videos to prevent querying the database
      if (isNewVideo || !id || id === "new") {
        return null;
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
    enabled: !isNewVideo && id !== undefined && id !== "new",
  });

  // Mutation for creating/updating video
  const videoMutation = useMutation({
    mutationFn: async () => {
      let videoId = id;

      // If it's a new video, create it first
      if (isNewVideo) {
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
        videoId = newVideo.id;
      } else {
        // Update existing video
        const { error: videoError } = await supabase
          .from("videos")
          .update(videoData)
          .eq("id", videoId);

        if (videoError) throw videoError;
      }

      // Update translations
      const translationPromises = Object.entries(translations).map(([lang, trans]) => {
        return supabase
          .from("video_translations")
          .upsert({
            video_id: videoId,
            language: lang,
            title: trans.title,
            description: trans.description,
          });
      });

      const results = await Promise.all(translationPromises);
      const errors = results.filter((result) => result.error);

      if (errors.length > 0) {
        throw new Error("Failed to update some translations");
      }

      return videoId;
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    videoMutation.mutate();
  };

  if (!isNewVideo && isLoading) {
    return <div>Loading...</div>;
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
            <div className="grid gap-4">
              <div className="space-y-2">
                <label htmlFor="video_url" className="text-sm font-medium">
                  Video URL
                </label>
                <Input
                  id="video_url"
                  value={videoData.video_url}
                  onChange={(e) => handleVideoDataChange("video_url", e.target.value)}
                  placeholder="Enter video URL"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="thumbnail" className="text-sm font-medium">
                  Thumbnail URL
                </label>
                <Input
                  id="thumbnail"
                  value={videoData.thumbnail}
                  onChange={(e) => handleVideoDataChange("thumbnail", e.target.value)}
                  placeholder="Enter thumbnail URL"
                  required
                />
                {videoData.thumbnail && (
                  <img
                    src={videoData.thumbnail}
                    alt="Video thumbnail preview"
                    className="mt-2 max-w-xs rounded-md"
                  />
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="duration" className="text-sm font-medium">
                  Duration
                </label>
                <Input
                  id="duration"
                  value={videoData.duration}
                  onChange={(e) => handleVideoDataChange("duration", e.target.value)}
                  placeholder="e.g., 2:30"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="author" className="text-sm font-medium">
                  Author
                </label>
                <Input
                  id="author"
                  value={videoData.author}
                  onChange={(e) => handleVideoDataChange("author", e.target.value)}
                  placeholder="Enter author name"
                  required
                />
              </div>
            </div>

            <div className="grid gap-6">
              <Tabs defaultValue="en">
                <TabsList>
                  <TabsTrigger value="en">English</TabsTrigger>
                  <TabsTrigger value="ar">Arabic</TabsTrigger>
                </TabsList>

                {(["en", "ar"] as const).map((lang) => (
                  <TabsContent key={lang} value={lang} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor={`title-${lang}`} className="text-sm font-medium">
                        Title
                      </label>
                      <Input
                        id={`title-${lang}`}
                        value={translations[lang].title}
                        onChange={(e) =>
                          handleTranslationChange(lang, "title", e.target.value)
                        }
                        dir={lang === "ar" ? "rtl" : "ltr"}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor={`description-${lang}`} className="text-sm font-medium">
                        Description
                      </label>
                      <Textarea
                        id={`description-${lang}`}
                        value={translations[lang].description || ""}
                        onChange={(e) =>
                          handleTranslationChange(lang, "description", e.target.value)
                        }
                        dir={lang === "ar" ? "rtl" : "ltr"}
                        rows={5}
                      />
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>

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
