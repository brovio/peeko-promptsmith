import { Model } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";

export const insertOrUpdateModel = async (model: Model) => {
  const modelData = {
    model_id: model.id,
    name: model.name || model.id,
    provider: model.provider,
    description: model.description || '',
    context_length: model.context_length,
    input_price: model.input_price,
    output_price: model.output_price,
    max_tokens: model.max_tokens,
    is_active: true,
    clean_model_name: model.clean_model_name,
    p_model: model.clean_model_name,
    p_provider: model.provider
  };

  const { error } = await supabase
    .from('available_models')
    .upsert(modelData, {
      onConflict: 'model_id'
    });

  if (error) throw error;
};

export const refreshModelsInDatabase = async (models: Model[]) => {
  for (const model of models) {
    await insertOrUpdateModel(model);
  }
};