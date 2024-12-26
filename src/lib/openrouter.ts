import { Model } from './types';

export async function fetchModels(apiKey: string): Promise<Model[]> {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/models', {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': window.location.href,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch models');
    }
    
    const data = await response.json();
    return data.data.map((model: any) => ({
      id: model.id,
      name: model.name || model.id,
      description: model.description || '',
      context_length: model.context_length,
      pricing: {
        prompt: model.pricing?.prompt || 0,
        completion: model.pricing?.completion || 0,
      },
    }));
  } catch (error) {
    console.error('Error fetching models:', error);
    throw error;
  }
}

export async function sendPrompt(apiKey: string, model: string, prompt: string): Promise<string> {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': window.location.href,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to send prompt');
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error sending prompt:', error);
    throw error;
  }
}