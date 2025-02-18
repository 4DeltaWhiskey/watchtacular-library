
import { useState } from "react";
import { Language, VideoTranslation } from "@/types/video-edit";
import { supabase } from "@/integrations/supabase/client";

export function useVideoTranslations(videoId: string | undefined) {
  const [translations, setTranslations] = useState<Record<Language, VideoTranslation>>({
    en: { title: "", description: "" },
    ar: { title: "", description: "" },
  });

  const updateTranslationsFromData = (videoTranslations: any[]) => {
    const newTranslations: Record<Language, VideoTranslation> = {
      en: { title: "", description: "" },
      ar: { title: "", description: "" },
    };

    videoTranslations.forEach((trans: any) => {
      if (trans.language === "en" || trans.language === "ar") {
        newTranslations[trans.language] = {
          title: trans.title || "",
          description: trans.description || "",
        };
      }
    });

    setTranslations(newTranslations);
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

  const saveTranslations = async (videoId: string) => {
    const translationPromises = Object.entries(translations).map(([lang, trans]) => {
      return supabase
        .from("video_translations")
        .upsert(
          {
            video_id: videoId,
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
      throw new Error("Failed to save translations");
    }
  };

  return {
    translations,
    updateTranslationsFromData,
    handleTranslationChange,
    saveTranslations,
  };
}
