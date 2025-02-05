
import { useState } from "react";
import CategoryFilter from "@/components/CategoryFilter";
import FeaturedVideo from "@/components/FeaturedVideo";
import VideoGrid from "@/components/VideoGrid";

const CATEGORIES = ["All", "Gaming", "Tech", "Art"];

const FEATURED_VIDEO = {
  title: "Building a Game Engine from Scratch",
  description:
    "Watch as we build a complete 2D game engine using modern OpenGL and C++. Perfect for game developers and graphics enthusiasts.",
  thumbnail: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80",
  views: "24K",
  duration: "2:15:30",
};

const VIDEOS = [
  {
    id: 1,
    title: "Advanced TypeScript Patterns",
    thumbnail: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80",
    views: "12K",
    duration: "1:22:15",
    date: "2 days ago",
    category: "Tech",
  },
  {
    id: 2,
    title: "Let's Play: Elden Ring",
    thumbnail: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&q=80",
    views: "8.5K",
    duration: "4:45:00",
    date: "3 days ago",
    category: "Gaming",
  },
  {
    id: 3,
    title: "Digital Art Masterclass",
    thumbnail: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80",
    views: "15K",
    duration: "2:30:00",
    date: "5 days ago",
    category: "Art",
  },
  // Duplicate videos with different IDs to fill the grid
  {
    id: 4,
    title: "React Performance Tips",
    thumbnail: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80",
    views: "10K",
    duration: "1:15:00",
    date: "1 week ago",
    category: "Tech",
  },
  {
    id: 5,
    title: "Minecraft Modding",
    thumbnail: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&q=80",
    views: "7K",
    duration: "3:20:00",
    date: "1 week ago",
    category: "Gaming",
  },
  {
    id: 6,
    title: "Character Design Workshop",
    thumbnail: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80",
    views: "9K",
    duration: "1:45:00",
    date: "2 weeks ago",
    category: "Art",
  },
];

const Index = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 mb-8">
        <FeaturedVideo {...FEATURED_VIDEO} />
      </div>
      
      <div className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Recent Streams</h2>
          <CategoryFilter
            categories={CATEGORIES}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>
        <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6">
          <VideoGrid videos={VIDEOS} category={activeCategory} />
        </div>
      </div>
    </div>
  );
};

export default Index;
