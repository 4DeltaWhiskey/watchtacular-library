
import { ChevronLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { VideoComments } from "@/components/VideoComments";
import { VideoReactions } from "@/components/VideoReactions";
import { VIDEOS, INITIAL_COMMENTS, INITIAL_REACTIONS } from "@/data/videos";
import type { VideoReactions as VideoReactionsType } from "@/types/video";
import { FormattedMessage } from "react-intl";

const VideoDetail = () => {
  const { id } = useParams();
  const video = VIDEOS[id as keyof typeof VIDEOS];
  const [reactions, setReactions] = useState<VideoReactionsType>(INITIAL_REACTIONS);
  const { toast } = useToast();

  if (!video) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            <FormattedMessage id="app.videoNotFound" defaultMessage="Video not found" />
          </h1>
          <Link to="/" className="text-primary hover:underline">
            <FormattedMessage id="app.returnHome" defaultMessage="Return to home" />
          </Link>
        </div>
      </div>
    );
  }

  const handleReaction = (type: keyof typeof reactions) => {
    setReactions(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        count: prev[type].active 
          ? prev[type].count - 1 
          : prev[type].count + 1,
        active: !prev[type].active,
      }
    }));

    toast({
      title: <FormattedMessage id="app.success" defaultMessage="Success" />,
      description: `${type} ${reactions[type].active ? 'removed' : 'added'}!`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 group"
      >
        <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        <FormattedMessage id="app.backToVideos" defaultMessage="Back to videos" />
      </Link>

      <div className="aspect-video w-full bg-black rounded-lg overflow-hidden mb-6">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="space-y-4">
        <h1 className="text-3xl font-bold">{video.title}</h1>
        
        <div className="flex items-center gap-4 text-muted-foreground">
          <span>{video.views} <FormattedMessage id="app.views" defaultMessage="views" /></span>
          <span>•</span>
          <span>{video.date}</span>
        </div>

        <div className="flex items-center gap-3 py-4 border-y border-border">
          <div className="flex-1">
            <h3 className="font-semibold">{video.author}</h3>
          </div>
          <VideoReactions reactions={reactions} onReaction={handleReaction} />
        </div>

        <p className="text-muted-foreground leading-relaxed">
          {video.description}
        </p>

        <VideoComments initialComments={INITIAL_COMMENTS} />
      </div>
    </div>
  );
};

export default VideoDetail;

