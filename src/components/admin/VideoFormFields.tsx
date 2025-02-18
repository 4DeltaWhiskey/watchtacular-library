
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { VideoData } from "@/types/video-edit";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface VideoFormFieldsProps {
  videoData: VideoData;
  categories?: any[];
  onVideoDataChange: (field: keyof VideoData, value: string) => void;
}

export function VideoFormFields({ videoData, categories, onVideoDataChange }: VideoFormFieldsProps) {
  const [isGeneratingThumbnail, setIsGeneratingThumbnail] = useState(false);
  const { toast } = useToast();

  const generateThumbnail = async (videoUrl: string) => {
    if (!videoUrl) return;

    console.log('Starting thumbnail generation for URL:', videoUrl);
    setIsGeneratingThumbnail(true);
    
    try {
      console.log('Invoking generate-video-thumbnail function...');
      const { data, error } = await supabase.functions.invoke('generate-video-thumbnail', {
        body: { videoUrl },
      });

      console.log('Function response:', { data, error });

      if (error) throw error;
      if (data) {
        console.log('Setting video metadata:', data);
        onVideoDataChange("thumbnail", data.thumbnailUrl);
        if (data.duration) onVideoDataChange("duration", data.duration);
        if (data.author) onVideoDataChange("author", data.author);
        
        toast({
          title: "Success",
          description: "Video metadata fetched successfully",
        });
      } else {
        console.log('No data in response');
        toast({
          title: "Error",
          description: "No metadata received",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching video metadata:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch video metadata",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingThumbnail(false);
    }
  };

  const handleVideoUrlChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    console.log('Video URL changed:', newUrl);
    onVideoDataChange("video_url", newUrl);
    
    if (newUrl) {
      console.log('Triggering metadata fetch');
      await generateThumbnail(newUrl);
    } else {
      console.log('Skipping metadata fetch: no URL provided');
    }
  };

  return (
    <div className="grid gap-4">
      <div className="space-y-2">
        <label htmlFor="video_url" className="text-sm font-medium">
          Video URL
        </label>
        <Input
          id="video_url"
          value={videoData.video_url}
          onChange={handleVideoUrlChange}
          placeholder="Enter video URL"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="thumbnail" className="text-sm font-medium">
          Thumbnail URL
        </label>
        <div className="relative">
          <Input
            id="thumbnail"
            value={videoData.thumbnail}
            onChange={(e) => onVideoDataChange("thumbnail", e.target.value)}
            placeholder="Enter thumbnail URL"
            required
            className={isGeneratingThumbnail ? "opacity-50" : ""}
            disabled={isGeneratingThumbnail}
          />
          {isGeneratingThumbnail && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
            </div>
          )}
        </div>
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
          onChange={(e) => onVideoDataChange("duration", e.target.value)}
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
          onChange={(e) => onVideoDataChange("author", e.target.value)}
          placeholder="Enter author name"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="category" className="text-sm font-medium">
          Category
        </label>
        <Select
          value={videoData.category_id}
          onValueChange={(value) => onVideoDataChange("category_id", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories?.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
