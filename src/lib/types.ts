export interface Model {
  id: string;
  name: string;
  provider: string;
  description: string;
  clean_model_name: string;
  context_length?: number;
  input_price?: number;
  output_price?: number;
  max_tokens?: number;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  template: string;
}

export interface PromptResult {
  prompt: string;
  response: string;
  model: string;
  timestamp: Date;
}
