export interface ColorTheme {
  background: string;
  foreground: string;
  primary: string;
  secondary: string;
  accent: string;
}

export function generateColorTheme(): ColorTheme {
  const baseColors = {
    offWhite: '#FFFCF2',
    lightGray: '#CCC5B9',
    darkGray: '#403D39',
    nearBlack: '#252422',
    orange: '#EB5E28'
  };

  function shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }

  const colorPool = [
    baseColors.offWhite,
    baseColors.lightGray,
    baseColors.darkGray,
    baseColors.nearBlack
  ];
  
  const shuffledColors = shuffleArray(colorPool);
  
  return {
    background: shuffledColors[0],
    foreground: shuffledColors[0] === baseColors.nearBlack || shuffledColors[0] === baseColors.darkGray 
      ? baseColors.offWhite 
      : baseColors.nearBlack,
    primary: shuffledColors[1],
    secondary: shuffledColors[2],
    accent: baseColors.orange
  };
}