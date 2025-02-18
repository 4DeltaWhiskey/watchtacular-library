
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function VideoManagement() {
  const { data: videos, isLoading } = useQuery({
    queryKey: ['admin-videos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('videos')
        .select(`
          *,
          video_translations (
            title,
            language
          )
        `);
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="grid gap-4">
      <h2 className="text-2xl font-semibold">Videos Management</h2>
      {isLoading ? (
        <p>Loading videos...</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {videos?.map((video) => (
            <Card key={video.id} className="p-4">
              <div className="font-medium">
                {video.video_translations?.[0]?.title || 'Untitled Video'}
              </div>
              <div className="text-sm text-muted-foreground">
                Views: {video.views}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
