import { Play } from "lucide-react";

interface VideoCardProps {
  title: string;
  thumbnail: string;
  views: string;
  duration: string;
  date: string;
}

const VideoCard = ({ title, thumbnail, views, duration, date }: VideoCardProps) => {
  return (
    <div className="video-card group">
      <div className="relative aspect-video overflow-hidden rounded-lg">
        <img
          src={thumbnail}
          alt={title}
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Play className="w-12 h-12 text-white" />
        </div>
        <div className="video-duration">{duration}</div>
      </div>
      <div className="mt-3">
        <h3 className="font-semibold text-lg line-clamp-2">{title}</h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
          <span>{views} views</span>
          <span>•</span>
          <span>{date}</span>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;