
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const extractYouTubeVideoId = (url: string) => {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : null;
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { videoUrl } = await req.json();
    console.log('Processing video URL:', videoUrl);

    let thumbnailUrl: string;

    // Check if it's a YouTube video
    const youtubeId = extractYouTubeVideoId(videoUrl);
    if (youtubeId) {
      // Use YouTube's highest quality thumbnail
      thumbnailUrl = `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
      console.log('Using YouTube thumbnail:', thumbnailUrl);
    } else {
      // For non-YouTube videos, use a default thumbnail or implement other video platform handlers
      console.log('Non-YouTube video URL detected, using fallback thumbnail');
      thumbnailUrl = 'https://placehold.co/1280x720/darkgray/white?text=Video+Thumbnail';
    }

    return new Response(
      JSON.stringify({ thumbnailUrl }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    );
  } catch (error) {
    console.error('Error generating thumbnail:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});
