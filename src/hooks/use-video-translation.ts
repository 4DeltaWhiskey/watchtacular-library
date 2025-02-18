
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Language, VideoTranslation } from "@/types/video-edit";

export function useVideoTranslation(
  translations: Record<Language, VideoTranslation>,
  handleTranslationChange: (lang: Language, field: keyof VideoTranslation, value: string) => void
) {
  const { toast } = useToast();

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

  return {
    handleTranslate,
    isTranslating: translateMutation.isPending,
  };
}
