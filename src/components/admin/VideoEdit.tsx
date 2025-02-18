
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

export function VideoEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [translations, setTranslations] = useState<Record<Language, VideoTranslation>>({
    en: { title: "", description: "" },
    ar: { title: "", description: "" },
  });

  // Query for existing video data
  const { data: videoData, isLoading } = useQuery({
    queryKey: ["admin-video", id],
    queryFn: async () => {
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

      // Initialize translations state with existing data
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
  });

  // Mutation for updating video metadata
  const updateVideoMutation = useMutation({
    mutationFn: async () => {
      // Update video translations
      const translationPromises = Object.entries(translations).map(([lang, trans]) => {
        return supabase
          .from("video_translations")
          .upsert({
            video_id: id,
            language: lang,
            title: trans.title,
            description: trans.description,
          })
          .eq("video_id", id)
          .eq("language", lang);
      });

      const results = await Promise.all(translationPromises);
      const errors = results.filter((result) => result.error);

      if (errors.length > 0) {
        throw new Error("Failed to update some translations");
      }

      return results;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Video metadata updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["admin-video", id] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update video metadata",
        variant: "destructive",
      });
    },
  });

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
    updateVideoMutation.mutate();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!videoData) {
    return <div>Video not found</div>;
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
          <CardTitle>Edit Video Metadata</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
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
              disabled={updateVideoMutation.isPending}
            >
              {updateVideoMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
