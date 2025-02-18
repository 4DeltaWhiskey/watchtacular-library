
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Languages } from "lucide-react";
import { Language, VideoTranslation } from "@/types/video-edit";

interface VideoTranslationsProps {
  translations: Record<Language, VideoTranslation>;
  onTranslationChange: (lang: Language, field: keyof VideoTranslation, value: string) => void;
  onTranslate: () => void;
}

export function VideoTranslations({ translations, onTranslationChange, onTranslate }: VideoTranslationsProps) {
  return (
    <div className="grid gap-6">
      <Tabs defaultValue="en">
        <div className="flex items-center justify-between mb-2">
          <TabsList>
            <TabsTrigger value="en">English</TabsTrigger>
            <TabsTrigger value="ar">Arabic</TabsTrigger>
          </TabsList>
          <Button
            type="button"
            variant="outline"
            onClick={onTranslate}
            disabled={!translations.en.title && !translations.en.description}
          >
            <Languages className="w-4 h-4 mr-2" />
            Auto-translate to Arabic
          </Button>
        </div>

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
                  onTranslationChange(lang, "title", e.target.value)
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
                  onTranslationChange(lang, "description", e.target.value)
                }
                dir={lang === "ar" ? "rtl" : "ltr"}
                rows={5}
              />
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
