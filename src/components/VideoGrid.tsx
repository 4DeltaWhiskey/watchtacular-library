import VideoCard from "./VideoCard";
import type { Video } from "@/types/video";

interface GridVideo {
  id: string;
  title: string;
  thumbnail: string;
  views: number;
  duration: string;
  date: string;
  category: string;
}

interface VideoGridProps {
  videos: GridVideo[];
  category: string;
}

const VideoGrid = ({ videos, category }: VideoGridProps) => {
  const filteredVideos =
    category === "All"
      ? videos
      : videos.filter((video) => video.category === category);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredVideos.map((video) => (
        <VideoCard
          key={video.id}
          id={video.id}
          title={video.title}
          thumbnail={video.thumbnail}
          views={video.views.toString()}
          duration={video.duration}
          date={video.date}
        />
      ))}
    </div>
  );
};

export default VideoGrid;