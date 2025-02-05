import { ChevronLeft, MessageSquare, ThumbsUp, ThumbsDown, Heart, Star } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const VIDEOS = {
  featured: {
    id: "featured",
    title: "Building a Game Engine from Scratch",
    description:
      "Watch as we build a complete 2D game engine using modern OpenGL and C++. Perfect for game developers and graphics enthusiasts.",
    thumbnail: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80",
    views: "24K",
    duration: "2:15:30",
    date: "1 day ago",
    category: "Tech",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    author: "TechMaster",
    likes: "1.2K",
  },
  1: {
    id: 1,
    title: "Advanced TypeScript Patterns",
    description: "Learn advanced TypeScript patterns and best practices for large-scale applications. We'll cover generics, mapped types, conditional types, and more.",
    thumbnail: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80",
    views: "12K",
    duration: "1:22:15",
    date: "2 days ago",
    category: "Tech",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    author: "TypeScript Pro",
    likes: "856",
  },
};

type Comment = {
  id: number;
  author: string;
  content: string;
  likes: number;
  timestamp: string;
};

const INITIAL_COMMENTS: Comment[] = [
  {
    id: 1,
    author: "Alex",
    content: "This was super helpful! Looking forward to more content like this.",
    likes: 12,
    timestamp: "2 hours ago",
  },
  {
    id: 2,
    author: "Sarah",
    content: "Great explanation of complex topics. Could you do a follow-up on advanced use cases?",
    likes: 8,
    timestamp: "5 hours ago",
  },
];

type Reaction = {
  type: 'like' | 'dislike' | 'heart' | 'star';
  count: number;
  active: boolean;
};

type VideoReactions = {
  [key: string]: Reaction;
};

const INITIAL_REACTIONS: VideoReactions = {
  like: { type: 'like', count: 1200, active: false },
  dislike: { type: 'dislike', count: 50, active: false },
  heart: { type: 'heart', count: 300, active: false },
  star: { type: 'star', count: 150, active: false },
};

const VideoDetail = () => {
  const { id } = useParams();
  const video = VIDEOS[id as keyof typeof VIDEOS];
  const [comments, setComments] = useState<Comment[]>(INITIAL_COMMENTS);
  const [newComment, setNewComment] = useState("");
  const [reactions, setReactions] = useState<VideoReactions>(INITIAL_REACTIONS);
  const { toast } = useToast();

  if (!video) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Video not found</h1>
          <Link to="/" className="text-primary hover:underline">
            Return to home
          </Link>
        </div>
      </div>
    );
  }

  const handleCommentSubmit = () => {
    if (!newComment.trim()) {
      toast({
        title: "Error",
        description: "Please enter a comment",
        variant: "destructive",
      });
      return;
    }

    const comment: Comment = {
      id: comments.length + 1,
      author: "You",
      content: newComment,
      likes: 0,
      timestamp: "Just now",
    };

    setComments([comment, ...comments]);
    setNewComment("");
    toast({
      title: "Success",
      description: "Comment added successfully",
    });
  };

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
      title: "Success",
      description: `${type} ${reactions[type].active ? 'removed' : 'added'}!`,
    });
  };

  const handleLike = (commentId: number) => {
    setComments(comments.map(comment => 
      comment.id === commentId 
        ? { ...comment, likes: comment.likes + 1 }
        : comment
    ));
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 group"
      >
        <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        Back to videos
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
          <span>{video.views} views</span>
          <span>•</span>
          <span>{video.date}</span>
        </div>

        <div className="flex items-center gap-3 py-4 border-y border-border">
          <div className="flex-1">
            <h3 className="font-semibold">{video.author}</h3>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={reactions.like.active ? "default" : "secondary"}
              size="sm"
              onClick={() => handleReaction('like')}
              className="flex items-center gap-1"
            >
              <ThumbsUp className="w-4 h-4" />
              <span>{reactions.like.count}</span>
            </Button>
            <Button
              variant={reactions.dislike.active ? "default" : "secondary"}
              size="sm"
              onClick={() => handleReaction('dislike')}
              className="flex items-center gap-1"
            >
              <ThumbsDown className="w-4 h-4" />
              <span>{reactions.dislike.count}</span>
            </Button>
            <Button
              variant={reactions.heart.active ? "default" : "secondary"}
              size="sm"
              onClick={() => handleReaction('heart')}
              className="flex items-center gap-1"
            >
              <Heart className="w-4 h-4" />
              <span>{reactions.heart.count}</span>
            </Button>
            <Button
              variant={reactions.star.active ? "default" : "secondary"}
              size="sm"
              onClick={() => handleReaction('star')}
              className="flex items-center gap-1"
            >
              <Star className="w-4 h-4" />
              <span>{reactions.star.count}</span>
            </Button>
          </div>
        </div>

        <p className="text-muted-foreground leading-relaxed">
          {video.description}
        </p>

        {/* Comments Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Comments
          </h2>
          
          {/* Comment Input */}
          <div className="space-y-4 mb-8">
            <Textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[100px]"
            />
            <Button onClick={handleCommentSubmit}>Post Comment</Button>
          </div>

          {/* Comments List */}
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-secondary/20 rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{comment.author}</h4>
                    <p className="text-sm text-muted-foreground">{comment.timestamp}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleLike(comment.id)}
                    className="flex items-center gap-1"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>{comment.likes}</span>
                  </Button>
                </div>
                <p className="text-foreground/90">{comment.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoDetail;
