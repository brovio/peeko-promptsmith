import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function tryModelSequence(prompt: string, model: string, openRouterKey: string) {
  try {
    console.log(`Attempting to use model: ${model}`);
    
    const requestBody = {
      model: model,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    };

    console.log('Request body:', JSON.stringify(requestBody));
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://lovable.dev',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error response from OpenRouter API:`, {
        status: response.status,
        error: errorText,
        headers: Object.fromEntries(response.headers.entries())
      });
      throw new Error(`OpenRouter API request failed: ${errorText}`);
    }

    const data = await response.json();
    console.log('OpenRouter API Response:', JSON.stringify(data));

    if (!data.choices?.[0]?.message?.content) {
      console.error(`Invalid response structure:`, data);
      throw new Error('Invalid response structure from OpenRouter API');
    }

    console.log(`Successfully generated with model: ${model}`);
    return {
      generatedText: data.choices[0].message.content,
      model: model,
      usage: data.usage || { prompt_tokens: 0, completion_tokens: 0 }
    };
  } catch (error) {
    console.error(`Error with model ${model}:`, error);
    throw error;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openRouterKey = Deno.env.get('OPENROUTER_API_KEY');
    if (!openRouterKey) {
      throw new Error('OpenRouter API key not configured');
    }

    const { prompt, model } = await req.json();
    if (!prompt || !model) {
      throw new Error('Missing required parameters: prompt and model are required');
    }

    console.log('Received request:', { 
      promptLength: prompt?.length || 0,
      requestedModel: model 
    });

    const result = await tryModelSequence(prompt, model, openRouterKey);

    return new Response(
      JSON.stringify({
        generatedText: result.generatedText,
        model: result.model,
        usage: {
          prompt_tokens: result.usage.prompt_tokens,
          completion_tokens: result.usage.completion_tokens,
          total_tokens: (result.usage.prompt_tokens + result.usage.completion_tokens),
          total_cost: (result.usage.prompt_tokens + result.usage.completion_tokens) * 0.00001
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