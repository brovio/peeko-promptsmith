const openingPhrases = [
  "Apply this to",
  "Leverage this for",
  "Enhance with this",
  "Build on this for",
  "Try this for",
  "Utilize this to",
  "Start with this for",
  "Improve with this",
  "Boost using this",
  "Refine with this"
];

export function getRandomOpeningPhrase(): string {
  const randomIndex = Math.floor(Math.random() * openingPhrases.length);
  return openingPhrases[randomIndex];
}

export function generateDescriptionPrompt(title: string): string {
  return `Generate a clear and concise description (max 200 characters) for a use case titled "${title}".
Rules:
1. Start with "${getRandomOpeningPhrase()}"
2. Focus on purpose and benefits
3. Avoid repeating technical details from the title
4. Keep it direct and brief
5. No markup, just plain text
6. Must be under 200 characters
7. Focus on what it helps achieve`;
}