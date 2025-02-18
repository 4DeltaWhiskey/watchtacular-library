
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

const formatDuration = (isoDuration: string) => {
  const match = isoDuration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return "0:00";

  const hours = (match[1] || '').replace('H', '');
  const minutes = (match[2] || '').replace('M', '');
  const seconds = (match[3] || '').replace('S', '');

  let result = '';
  if (hours) {
    result += `${hours}:`;
    result += `${minutes.padStart(2, '0')}:`;
  } else if (minutes) {
    result += `${minutes}:`;
  } else {
    result += '0:';
  }
  result += seconds.padStart(2, '0');

  return result;
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
    let metadata = {
      title: '',
      description: '',
      author: '',
      duration: '',
    };

    // Check if it's a YouTube video
    const youtubeId = extractYouTubeVideoId(videoUrl);
    if (youtubeId) {
      // Use YouTube's API to get video details
      const apiKey = Deno.env.get('YOUTUBE_API_KEY');
      if (!apiKey) {
        throw new Error('YouTube API key not configured');
      }

      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?id=${youtubeId}&part=snippet,contentDetails&key=${apiKey}`
      );
      
      const data = await response.json();
      console.log('YouTube API response:', data);

      if (data.items && data.items.length > 0) {
        const video = data.items[0];
        thumbnailUrl = `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
        
        metadata = {
          title: video.snippet.title,
          description: video.snippet.description,
          author: video.snippet.channelTitle,
          duration: formatDuration(video.contentDetails.duration),
        };
      } else {
        throw new Error('Video not found');
      }
    } else {
      // For non-YouTube videos, use default values
      console.log('Non-YouTube video URL detected, using fallback values');
      thumbnailUrl = 'https://placehold.co/1280x720/darkgray/white?text=Video+Thumbnail';
      metadata = {
        title: '',
        description: '',
        author: '',
        duration: '',
      };
    }

    return new Response(
      JSON.stringify({ 
        thumbnailUrl,
        ...metadata
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    );
  } catch (error) {
    console.error('Error processing video:', error);
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
