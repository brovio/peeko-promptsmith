import { supabase } from "@/integrations/supabase/client";
import { trackOperation } from "./trackOperation";

export const enhanceOperation = async (
  currentEnhancer: string,
  useCaseId: string
) => {
  if (!currentEnhancer.trim()) {
    throw new Error("Please enter some content to enhance");
  }

  const { data, error } = await supabase.functions.invoke('generate', {
    body: {
      model: "google/gemini-2.0-flash-thinking-exp:free",
      prompt: `As an expert prompt engineer, enhance this prompt enhancer to improve its quality, clarity, and effectiveness:

Original enhancer:
${currentEnhancer}

Improve the enhancer by:
1. Making it more precise and clear
2. Optimizing its structure and flow
3. Adding any missing important elements
4. Ensuring it follows best practices

Return ONLY the enhanced version, nothing else.`,
    },
  });

  if (error) throw error;
  
  const newEnhancer = data.generatedText.trim();
  
  await trackOperation(
    'enhance',
    currentEnhancer,
    newEnhancer,
    data.usage?.total_tokens || 0,
    data.usage?.total_cost || 0,
    useCaseId
  );
  
  return { newEnhancer, model: data.model };
};