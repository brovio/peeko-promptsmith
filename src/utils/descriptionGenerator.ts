import { supabase } from "@/integrations/supabase/client";

export async function generateDescription(title: string): Promise<string> {
  try {
    const { data, error } = await supabase.functions.invoke('generate', {
      body: {
        prompt: `Generate a clear and concise description (max 200 characters) for a use case titled "${title}". Focus on the purpose and benefits, avoiding technical details already mentioned in the title. The description should be direct and brief.`,
      },
    });

    if (error) throw error;
    
    return data.generatedText.trim();
  } catch (error) {
    console.error('Error generating description:', error);
    throw error;
  }
}