
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import CategoryFilter from "@/components/CategoryFilter";
import FeaturedVideo from "@/components/FeaturedVideo";
import VideoGrid from "@/components/VideoGrid";
import { FormattedMessage } from "react-intl";
import { useLanguage } from "@/contexts/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const { language } = useLanguage();

  const { data: categories, isLoading: loadingCategories } = useQuery({
    queryKey: ["categories", language],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select(`
          id,
          name,
          translations:category_translations!inner(
            name
          )
        `)
        .eq('translations.language', language)
        .order("name");
      
      if (error) throw error;
      
      const translatedCategories = data.map(cat => ({
        id: cat.id,
        name: cat.translations[0]?.name || cat.name
      }));
      
      return ["All", ...translatedCategories.map(cat => cat.name)];
    }
  });

  const { data: videos, isLoading: loadingVideos } = useQuery({
    queryKey: ["videos", language, activeCategory],
    queryFn: async () => {
      let query = supabase
        .from("videos")
        .select(`
          *,
          category:categories(
            id,
            name,
            translations:category_translations!inner(
              name
            )
          ),
          translation:video_translations!inner(
            title,
            description
          )
        `)
        .eq("translation.language", language)
        .is("deleted_at", null); // Only fetch non-deleted videos

      if (activeCategory !== "All") {
        query = query.eq(
          "category.translations.name",
          activeCategory
        );
      }
      
      const { data, error } = await query.order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const featuredVideo = videos?.find(video => video.is_featured) || videos?.[0];

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      {featuredVideo && (
        <FeaturedVideo
          id={featuredVideo.id}
          title={featuredVideo.translation[0]?.title || ""}
          description={featuredVideo.translation[0]?.description || ""}
          thumbnail={featuredVideo.thumbnail}
          views={featuredVideo.views.toString()}
          duration={featuredVideo.duration}
        />
      )}
      
      <div className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            <FormattedMessage id="app.recentStreams" defaultMessage="Recent Streams" />
          </h2>
          {categories && (
            <CategoryFilter
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
          )}
        </div>
        {videos && (
          <VideoGrid
            videos={videos.map(video => ({
              id: video.id,
              title: video.translation[0]?.title || "",
              thumbnail: video.thumbnail,
              views: video.views,
              duration: video.duration,
              date: new Date(video.created_at).toLocaleDateString(),
              category: video.category?.translations[0]?.name || video.category?.name || "Uncategorized"
            }))}
            category={activeCategory}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
