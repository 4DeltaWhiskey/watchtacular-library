
export type Video = {
  id: string | number;
  title: string;
  description: string;
  thumbnail: string;
  views: string;
  duration: string;
  date: string;
  category: string;
  videoUrl: string;
  author: string;
  likes: string;
};

export type Comment = {
  id: number;
  author: string;
  content: string;
  likes: number;
  timestamp: string;
};

export type Reaction = {
  type: 'like' | 'dislike' | 'heart' | 'star';
  count: number;
  active: boolean;
};

export type VideoReactions = {
  [key: string]: Reaction;
};
