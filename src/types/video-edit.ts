
export type Language = "en" | "ar";

export type VideoTranslation = {
  title: string;
  description: string | null;
};

export type VideoData = {
  video_url: string;
  thumbnail: string;
  duration: string;
  author: string;
  category_id?: string;
};
