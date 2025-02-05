
import { Play } from "lucide-react";
import { Link } from "react-router-dom";

interface FeaturedVideoProps {
  title: string;
  description: string;
  thumbnail: string;
  views: string;
  duration: string;
}

const FeaturedVideo = ({
  title,
  description,
  thumbnail,
  views,
  duration,
}: FeaturedVideoProps) => {
  return (
    <Link to="/video/featured" className="relative aspect-[21/9] rounded-lg overflow-hidden group cursor-pointer block">
      <img
        src={thumbnail}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="rounded-full bg-primary/90 p-6 transform transition-transform duration-300 group-hover:scale-110">
          <Play className="w-12 h-12 text-white" />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 p-6 w-full">
        <h1 className="text-4xl font-bold mb-2">{title}</h1>
        <p className="text-lg text-gray-200 mb-4 max-w-2xl">{description}</p>
        <div className="flex items-center gap-2 text-sm text-gray-200">
          <span>{views} views</span>
          <span>•</span>
          <span>{duration}</span>
        </div>
      </div>
    </Link>
  );
};

export default FeaturedVideo;
