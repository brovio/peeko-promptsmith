import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openRouterKey = Deno.env.get('OPENROUTER_API_KEY');

async function tryModelSequence(prompt: string, model: string) {
  try {
    console.log(`Attempting to use model: ${model}`);
    
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
          {
            role: 'user',
            content: prompt
          }
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
      throw new Error(`OpenRouter API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log('OpenRouter API response:', {
      model: model,
      hasChoices: !!data.choices,
      choicesLength: data.choices?.length,
      firstChoice: data.choices?.[0]
    });

    if (!data.choices?.[0]?.message?.content) {
      console.error('Invalid response structure:', data);
      throw new Error('Invalid response structure from OpenRouter API');
    }

    console.log(`Successfully generated with model: ${model}`);
    return {
      generatedText: data.choices[0].message.content,
      model: model,
      usage: data.usage || { 
        prompt_tokens: data.usage?.prompt_tokens || 0, 
        completion_tokens: data.usage?.completion_tokens || 0,
        total_tokens: data.usage?.total_tokens || 0
      }
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
    const { prompt, model } = await req.json();
    console.log('Received prompt request:', { 
      promptLength: prompt?.length || 0,
      requestedModel: model 
    });

    if (!openRouterKey) {
      throw new Error('OpenRouter API key not configured');
    }

    if (!prompt?.trim()) {
      throw new Error('Prompt is required');
    }

    if (!model?.trim()) {
      throw new Error('Model is required');
    }

    const result = await tryModelSequence(prompt, model);

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