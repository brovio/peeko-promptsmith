import { supabase } from "@/integrations/supabase/client";
import { trackOperation } from "./trackOperation";

export const remixOperation = async (
  currentEnhancer: string,
  useCaseId: string
) => {
  if (!currentEnhancer.trim()) {
    throw new Error("Please enter some content to remix");
  }

  const { data, error } = await supabase.functions.invoke('generate', {
    body: {
      model: "google/gemini-2.0-flash-thinking-exp:free",
      prompt: `As a creative prompt engineer, analyze and remix this prompt enhancer to generate new ideas and improvements while maintaining its core purpose. Consider different approaches and add innovative elements:

Original enhancer:
${currentEnhancer}

Provide a remixed version that:
1. Maintains the original intent
2. Adds creative new perspectives
3. Improves clarity and effectiveness
4. Suggests alternative approaches

Return ONLY the remixed enhancer text, nothing else.`,
    },
  });

  if (error) throw error;
  
  const newEnhancer = data.generatedText.trim();
  
  await trackOperation(
    'remix',
    currentEnhancer,
    newEnhancer,
    data.usage?.total_tokens || 0,
    data.usage?.total_cost || 0,
    useCaseId
  );
  
  return { newEnhancer, model: data.model };
};