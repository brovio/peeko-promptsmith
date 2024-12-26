import { useState } from "react";
import { ModelSelector } from "@/components/ModelSelector";
import { CategorySelector } from "@/components/CategorySelector";
import { PromptInput } from "@/components/PromptInput";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

const defaultModels = [
  { id: "openai/gpt-3.5-turbo", name: "GPT-3.5 Turbo", description: "" },
  { id: "anthropic/claude-2", name: "Claude 2", description: "" },
];

export default function Index() {
  const [selectedModel, setSelectedModel] = useState(defaultModels[0].id);
  const [selectedCategory, setSelectedCategory] = useState("general");
  const [result, setResult] = useState("");
  const navigate = useNavigate();

  const handlePromptSubmit = async (enhancedPrompt: string) => {
    // TODO: Integrate with OpenRouter API
    setResult("This is a placeholder response. Please configure your OpenRouter API key in settings.");
  };

  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">PeekoPrompter</h1>
          <Button variant="ghost" onClick={() => navigate("/settings")}>
            <Settings className="h-5 w-5" />
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Model & Category</h2>
              <div className="flex gap-4 flex-col sm:flex-row">
                <ModelSelector
                  models={defaultModels}
                  selectedModel={selectedModel}
                  onModelSelect={setSelectedModel}
                />
                <CategorySelector
                  selectedCategory={selectedCategory}
                  onCategorySelect={setSelectedCategory}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Your Prompt</h2>
              <PromptInput
                selectedCategory={selectedCategory}
                onSubmit={handlePromptSubmit}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Results</h2>
            <ResultsDisplay result={result} />
          </div>
        </div>
      </div>
    </div>
  );
}