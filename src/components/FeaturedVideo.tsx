
import { Play } from "lucide-react";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { useState } from "react";

interface FeaturedVideoProps {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  views: string;
  duration: string;
}

const FeaturedVideo = ({
  id,
  title,
  description,
  thumbnail,
  views,
  duration,
}: FeaturedVideoProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Link to={`/video/${id}`} className="relative aspect-[21/9] rounded-lg overflow-hidden group cursor-pointer block">
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
        <div className="relative">
          <p className={`text-lg text-gray-200 mb-4 max-w-2xl ${!isExpanded ? 'line-clamp-3' : ''}`}>
            {description}
          </p>
          {description.length > 100 && (
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsExpanded(!isExpanded);
              }}
              className="text-primary hover:text-primary/80 text-sm font-medium"
            >
              {isExpanded ? 'Show less' : 'Show more...'}
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-200">
          <span>{views} <FormattedMessage id="app.views" defaultMessage="views" /></span>
          <span>•</span>
          <span>{duration}</span>
        </div>
      </div>
    </Link>
  );
};

export default FeaturedVideo;
