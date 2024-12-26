export interface Model {
  id: string;
  name: string;
  description: string;
  context_length?: number;
  pricing?: {
    prompt: number;
    completion: number;
  };
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