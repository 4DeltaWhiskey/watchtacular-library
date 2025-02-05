import { ChevronLeft } from "lucide-react";
import { Link, useParams, Navigate } from "react-router-dom";
import { useState } from "react";
import { VideoComments } from "@/components/VideoComments";
import { VideoReactions } from "@/components/VideoReactions";
import { VIDEOS, INITIAL_COMMENTS } from "@/data/videos";
import type { VideoReactionsType } from "@/types/video";
import { FormattedMessage, useIntl } from "react-intl";
import { useLanguage } from "@/contexts/LanguageContext";
import VideoPlayer from "@/components/ui/video-player";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const INITIAL_REACTIONS: VideoReactionsType = {
  like: { type: 'like', count: 0, active: false },
  dislike: { type: 'dislike', count: 0, active: false },
  heart: { type: 'heart', count: 0, active: false },
  star: { type: 'star', count: 0, active: false }
};

const VideoDetail = () => {
  const { id } = useParams();
  const [reactions, setReactions] = useState<VideoReactionsType>(INITIAL_REACTIONS);
  const { toast } = useToast();
  const intl = useIntl();
  const { language } = useLanguage();

  // Query for video data from Supabase
  const { data: videoData, isLoading } = useQuery({
    queryKey: ["video", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("videos")
        .select(`
          *,
          category:categories(
            id,
            name,
            translations:category_translations!inner(
              name
            )
          )
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id && id !== "featured"
  });

  // Query for video translations
  const { data: videoTranslation } = useQuery({
    queryKey: ["video-translation", id, language],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("video_translations")
        .select("*")
        .eq("video_id", id)
        .eq("language", language)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!id && id !== "featured"
  });

  // Handle redirects and error states after hooks
  if (id === "featured") {
    return <Navigate to="/video/d290f1ee-6c54-4b01-90e6-d701748f0851" replace />;
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
        </div>
      </div>
    );
  }

  // Handle non-existent video
  if (!videoData) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            <FormattedMessage id="app.videoNotFound" />
          </h1>
          <Link to="/" className="text-primary hover:underline">
            <FormattedMessage id="app.returnHome" />
          </Link>
        </div>
      </div>
    );
  }

  const handleReaction = (type: keyof VideoReactionsType) => {
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
      title: intl.formatMessage({ id: "app.success" }),
      description: intl.formatMessage(
        { id: reactions[type].active ? "app.reactionRemoved" : "app.reactionAdded" },
        { type: type.toString() }
      ),
    });
  };

  const comments = INITIAL_COMMENTS.map(comment => ({
    id: String(comment.id),
    video_id: id || '',
    author: comment.author,
    content: comment.content,
    likes: comment.likes,
    created_at: new Date().toISOString()
  }));

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 group"
      >
        <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        <FormattedMessage id="app.backToVideos" />
      </Link>

      <div className="aspect-video w-full bg-black rounded-lg overflow-hidden mb-6">
        <VideoPlayer src={videoData.video_url} />
      </div>

      <div className="space-y-4">
        <h1 className="text-3xl font-bold">
          {videoTranslation?.title || videoData.title}
        </h1>
        
        <div className="flex items-center gap-4 text-muted-foreground">
          <span>
            {videoData.views} <FormattedMessage id="app.views" />
          </span>
          <span>•</span>
          <span>{new Date(videoData.created_at).toLocaleDateString()}</span>
        </div>

        <div className="flex items-center gap-3 py-4 border-y border-border">
          <div className="flex-1">
            <h3 className="font-semibold">{videoData.author}</h3>
          </div>
          <VideoReactions reactions={reactions} onReaction={handleReaction} />
        </div>

        <p className="text-muted-foreground leading-relaxed">
          {videoTranslation?.description || videoData.description}
        </p>

        <VideoComments initialComments={comments} videoId={id || ''} />
      </div>
    </div>
  );
};

export default VideoDetail;