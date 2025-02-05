
import { ThumbsUp, ThumbsDown, Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { VideoReactions as VideoReactionsType } from "@/types/video";

interface VideoReactionProps {
  reactions: VideoReactionsType;
  onReaction: (type: keyof VideoReactionsType) => void;
}

export const VideoReactions = ({ reactions, onReaction }: VideoReactionProps) => {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant={reactions.like.active ? "default" : "secondary"}
        size="sm"
        onClick={() => onReaction('like')}
        className="flex items-center gap-1"
      >
        <ThumbsUp className="w-4 h-4" />
        <span>{reactions.like.count}</span>
      </Button>
      <Button
        variant={reactions.dislike.active ? "default" : "secondary"}
        size="sm"
        onClick={() => onReaction('dislike')}
        className="flex items-center gap-1"
      >
        <ThumbsDown className="w-4 h-4" />
        <span>{reactions.dislike.count}</span>
      </Button>
      <Button
        variant={reactions.heart.active ? "default" : "secondary"}
        size="sm"
        onClick={() => onReaction('heart')}
        className="flex items-center gap-1"
      >
        <Heart className="w-4 h-4" />
        <span>{reactions.heart.count}</span>
      </Button>
      <Button
        variant={reactions.star.active ? "default" : "secondary"}
        size="sm"
        onClick={() => onReaction('star')}
        className="flex items-center gap-1"
      >
        <Star className="w-4 h-4" />
        <span>{reactions.star.count}</span>
      </Button>
    </div>
  );
};
