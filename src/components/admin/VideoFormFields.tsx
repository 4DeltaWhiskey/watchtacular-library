
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { VideoData } from "@/types/video-edit";

interface VideoFormFieldsProps {
  videoData: VideoData;
  categories?: any[];
  onVideoDataChange: (field: keyof VideoData, value: string) => void;
}

export function VideoFormFields({ videoData, categories, onVideoDataChange }: VideoFormFieldsProps) {
  return (
    <div className="grid gap-4">
      <div className="space-y-2">
        <label htmlFor="video_url" className="text-sm font-medium">
          Video URL
        </label>
        <Input
          id="video_url"
          value={videoData.video_url}
          onChange={(e) => onVideoDataChange("video_url", e.target.value)}
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
          onChange={(e) => onVideoDataChange("thumbnail", e.target.value)}
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
