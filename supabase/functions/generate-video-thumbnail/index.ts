
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function formatDuration(seconds: number): string {
  if (!seconds) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { videoUrl } = await req.json()
    console.log('Processing video URL:', videoUrl)

    // Extract video ID from YouTube URL
    const videoId = videoUrl.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([^"&?\/\s]{11})/)?.[1]
    if (!videoId) {
      throw new Error('Invalid YouTube URL')
    }

    // First get basic metadata from oEmbed
    const oembedResponse = await fetch(`https://www.youtube.com/oembed?url=${videoUrl}&format=json`)
    const oembedData = await oembedResponse.json()

    // Then get additional metadata using YouTube API
    const YOUTUBE_API_KEY = Deno.env.get("YOUTUBE_API_KEY")
    const videoResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=contentDetails,snippet&key=${YOUTUBE_API_KEY}`
    )
    const videoData = await videoResponse.json()

    if (!videoData.items || videoData.items.length === 0) {
      throw new Error('Video not found')
    }

    const video = videoData.items[0]
    
    // Parse duration from YouTube's ISO 8601 format
    const duration = video.contentDetails.duration
    const seconds = duration
      .match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
      ?.slice(1)
      .map(x => parseInt(x) || 0)
      .reduce((acc, x, i) => acc + x * [3600, 60, 1][i], 0)

    console.log('Processed video data:', {
      title: video.snippet.title,
      description: video.snippet.description,
      duration: formatDuration(seconds),
      author: video.snippet.channelTitle,
    })

    // Return the processed metadata
    return new Response(
      JSON.stringify({
        thumbnailUrl: oembedData.thumbnail_url,
        duration: formatDuration(seconds),
        author: video.snippet.channelTitle,
        title: video.snippet.title,
        description: video.snippet.description || "",
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error in generate-video-thumbnail function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
