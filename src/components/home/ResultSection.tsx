import { ResultsDisplay } from "@/components/ResultsDisplay";

interface ResultSectionProps {
  result: string;
}

export function ResultSection({ result }: ResultSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Results</h2>
      <ResultsDisplay result={result} />
    </div>
  );
}