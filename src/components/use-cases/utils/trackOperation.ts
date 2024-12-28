import { supabase } from "@/integrations/supabase/client";

export const trackOperation = async (
  operationType: string,
  originalText: string,
  modifiedText: string,
  tokensUsed: number,
  cost: number,
  useCaseId: string
) => {
  if (!useCaseId) {
    console.warn('No useCaseId provided for operation tracking');
    return;
  }

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { error } = await supabase
      .from('use_case_operations')
      .insert({
        use_case_id: useCaseId,
        user_id: user.id,
        operation_type: operationType,
        original_text: originalText,
        modified_text: modifiedText,
        tokens_used: tokensUsed,
        cost: cost,
        words_changed: Math.abs(modifiedText.split(/\s+/).length - originalText.split(/\s+/).length)
      });

    if (error) {
      console.error(`Error tracking ${operationType} operation:`, error);
      throw error;
    }
  } catch (error) {
    console.error(`Error tracking ${operationType} operation:`, error);
    throw error;
  }
};