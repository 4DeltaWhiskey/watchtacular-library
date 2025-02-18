
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { videoUrl } = await req.json();

    // First, get a description for the thumbnail
    const descriptionResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a video thumbnail designer. Given a video URL, create a brief, clear description for DALL-E to generate an appealing thumbnail image. Focus on key visual elements that would make an engaging thumbnail.'
          },
          {
            role: 'user',
            content: `Create a thumbnail description for this video: ${videoUrl}`
          }
        ],
      }),
    });

    const descriptionData = await descriptionResponse.json();
    const thumbnailDescription = descriptionData.choices[0].message.content;

    // Then, generate the image using DALL-E
    const imageResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: thumbnailDescription + ". Make it suitable for a video thumbnail, with vibrant colors and engaging composition.",
        n: 1,
        size: "1024x1024",
      }),
    });

    const imageData = await imageResponse.json();
    const thumbnailUrl = imageData.data[0].url;

    return new Response(
      JSON.stringify({ thumbnailUrl }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error generating thumbnail:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
