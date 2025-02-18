
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { videoUrl } = await req.json()

    // Your existing code to fetch video metadata
    const response = await fetch(`https://www.youtube.com/oembed?url=${videoUrl}&format=json`)
    const data = await response.json()

    // Return both the video metadata and thumbnails
    return new Response(
      JSON.stringify({
        thumbnailUrl: data.thumbnail_url,
        duration: data.duration || "0:00",
        author: data.author_name || "",
        title: data.title || "",
        description: data.description || "",
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
