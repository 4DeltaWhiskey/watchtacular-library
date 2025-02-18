
import { Button } from "@/components/ui/button";
import { VideoFormFields } from "./VideoFormFields";
import { VideoTranslations } from "./VideoTranslations";
import { Language, VideoData, VideoTranslation } from "@/types/video-edit";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface VideoEditFormProps {
  videoData: VideoData;
  translations: Record<Language, VideoTranslation>;
  isNewVideo: boolean;
  isPending: boolean;
  onVideoDataChange: (field: keyof VideoData, value: string) => void;
  onTranslationChange: (lang: Language, field: keyof VideoTranslation, value: string) => void;
  onTranslate: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function VideoEditForm({
  videoData,
  translations,
  isNewVideo,
  isPending,
  onVideoDataChange,
  onTranslationChange,
  onTranslate,
  onSubmit,
}: VideoEditFormProps) {
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

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <VideoFormFields
        videoData={videoData}
        categories={categories}
        onVideoDataChange={onVideoDataChange}
      />

      <VideoTranslations
        translations={translations}
        onTranslationChange={onTranslationChange}
        onTranslate={onTranslate}
      />

      <Button
        type="submit"
        className="w-full"
        disabled={isPending}
      >
        {isPending ? "Saving..." : (isNewVideo ? "Create Video" : "Save Changes")}
      </Button>
    </form>
  );
}
