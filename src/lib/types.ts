export interface Model {
  id: string;
  name: string;
  description: string;
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