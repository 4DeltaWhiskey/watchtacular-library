export type Category = {
  id: string;
  name: string;
  created_at: string;
};

export type Video = {
  id: string;
  video_url: string;
  thumbnail: string;
  duration: string;
  views: number;
  likes: number;
  author: string;
  category_id?: string;
  created_at: string;
  updated_at: string;
};

export type VideoTranslation = {
  id: string;
  video_id: string;
  language: string;
  title: string;
  description?: string;
  created_at: string;
  updated_at: string;
};

export type Comment = {
  id: string;
  video_id: string;
  author: string;
  content: string;
  likes: number;
  created_at: string;
};

export type VideoWithTranslation = Video & {
  translation: VideoTranslation;
  category?: Category;
};