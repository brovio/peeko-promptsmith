const API_URL = "https://openrouter.ai/api/v1";

export async function fetchModels(apiKey: string) {
  try {
    const response = await fetch(`${API_URL}/models`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    return data.data.map((model: any) => {
      const [provider] = model.id.split('/');
      const cleanModelName = model.name.replace(`${provider}/`, '').trim();
      
      return {
        id: model.id,
        name: model.name,
        provider: provider,
        description: model.description || '',
        context_length: model.context_length || null,
        input_price: model.pricing?.prompt || null,
        output_price: model.pricing?.completion || null,
        max_tokens: model.max_tokens || null,
        clean_model_name: cleanModelName,
      };
    });
  } catch (error) {
    console.error('Error fetching models:', error);
    throw error;
  }
}