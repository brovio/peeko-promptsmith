import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openRouterKey = Deno.env.get('OPENROUTER_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openRouterKey) {
      throw new Error('OpenRouter API key not configured');
    }

    const { prompt, model } = await req.json();
    
    if (!prompt || !model) {
      throw new Error('Missing required parameters: prompt and model');
    }

    console.log('Calling OpenRouter API with:', { 
      model, 
      promptLength: prompt.length,
      prompt: prompt.substring(0, 100) + '...' // Log first 100 chars for debugging
    });

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://lovable.dev',
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'user', content: prompt }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Raw API response:', JSON.stringify(data, null, 2));
    
    // More detailed validation of response structure
    if (!data) {
      throw new Error('Empty response from OpenRouter API');
    }
    
    if (!Array.isArray(data.choices)) {
      throw new Error('Invalid response format: missing choices array');
    }
    
    if (!data.choices[0]?.message?.content) {
      console.error('Invalid OpenRouter API response structure:', data);
      throw new Error('Invalid response format: missing message content');
    }

    const generatedText = data.choices[0].message.content;
    console.log('Successfully generated response:', {
      model,
      tokensUsed: data.usage?.total_tokens || 'N/A',
      contentLength: generatedText.length,
      preview: generatedText.substring(0, 100) + '...' // Log preview of response
    });

    return new Response(
      JSON.stringify({
        generatedText,
        model: model,
        usage: {
          prompt_tokens: data.usage?.prompt_tokens || 0,
          completion_tokens: data.usage?.completion_tokens || 0,
          total_tokens: data.usage?.total_tokens || 0,
          total_cost: data.usage?.total_tokens ? data.usage.total_tokens * 0.00001 : 0
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in generate function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});