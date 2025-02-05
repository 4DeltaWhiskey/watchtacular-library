
export const VIDEOS = {
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

export const INITIAL_COMMENTS = [
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

export const INITIAL_REACTIONS = {
  like: { type: 'like' as const, count: 1200, active: false },
  dislike: { type: 'dislike' as const, count: 50, active: false },
  heart: { type: 'heart' as const, count: 300, active: false },
  star: { type: 'star' as const, count: 150, active: false },
};
