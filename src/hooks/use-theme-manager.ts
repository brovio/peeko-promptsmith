import { Theme } from "@/types/theme";
import { create } from "zustand";

interface ThemeState {
  currentTheme: Theme | null;
  applyTheme: (theme: Theme) => void;
}

export const useThemeManager = create<ThemeState>((set) => ({
  currentTheme: null,
  applyTheme: (theme: Theme) => {
    // Apply theme CSS variables
    const root = document.documentElement;
    root.style.setProperty('--background', theme.background);
    root.style.setProperty('--foreground', theme.foreground);
    root.style.setProperty('--input-text', theme.input_text);
    root.style.setProperty('--dropdown-bg', theme.dropdown_bg);
    root.style.setProperty('--dropdown-text', theme.dropdown_text);
    root.style.setProperty('--search-bg', theme.search_bg);
    root.style.setProperty('--search-text', theme.search_text);
    root.style.setProperty('--filter-bg', theme.filter_bg);
    root.style.setProperty('--filter-text', theme.filter_text);
    root.style.setProperty('--icon', theme.icon);
    root.style.setProperty('--divider', theme.divider);
    root.style.setProperty('--card', theme.card);
    root.style.setProperty('--card-foreground', theme.card_foreground);
    root.style.setProperty('--popover', theme.popover);
    root.style.setProperty('--popover-foreground', theme.popover_foreground);
    root.style.setProperty('--primary', theme.primary_color);
    root.style.setProperty('--primary-foreground', theme.primary_foreground);
    root.style.setProperty('--secondary', theme.secondary);
    root.style.setProperty('--secondary-foreground', theme.secondary_foreground);
    root.style.setProperty('--muted', theme.muted);
    root.style.setProperty('--muted-foreground', theme.muted_foreground);
    root.style.setProperty('--accent', theme.accent);
    root.style.setProperty('--accent-foreground', theme.accent_foreground);
    root.style.setProperty('--destructive', theme.destructive);
    root.style.setProperty('--destructive-foreground', theme.destructive_foreground);
    root.style.setProperty('--border', theme.border);
    root.style.setProperty('--input', theme.input);
    root.style.setProperty('--ring', theme.ring);
    
    set({ currentTheme: theme });
  },
}));