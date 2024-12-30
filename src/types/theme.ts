export type ThemeType = 'light' | 'dark' | 'custom' | 'peeko';

export interface ThemeConfiguration {
  id: string;
  name: string;
  theme_type: ThemeType;
  background: string;
  foreground: string;
  input_text: string;
  dropdown_bg: string;
  dropdown_text: string;
  search_bg: string;
  search_text: string;
  filter_bg: string;
  filter_text: string;
  icon: string;
  divider: string;
  card: string;
  card_foreground: string;
  popover: string;
  popover_foreground: string;
  primary_color: string;
  primary_foreground: string;
  secondary: string;
  secondary_foreground: string;
  muted: string;
  muted_foreground: string;
  accent: string;
  accent_foreground: string;
  destructive: string;
  destructive_foreground: string;
  border: string;
  input: string;
  ring: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  is_active?: boolean;
}