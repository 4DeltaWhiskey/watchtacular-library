
import { ChevronLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";

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
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Example URL
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
  // ... add entries for all other videos
};

const VideoDetail = () => {
  const { id } = useParams();
  const video = VIDEOS[id as keyof typeof VIDEOS];

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
          <span>•</span>
          <span>{video.likes} likes</span>
        </div>

        <div className="flex items-center gap-3 py-4 border-y border-border">
          <div className="flex-1">
            <h3 className="font-semibold">{video.author}</h3>
          </div>
        </div>

        <p className="text-muted-foreground leading-relaxed">
          {video.description}
        </p>
      </div>
    </div>
  );
};

export default VideoDetail;
