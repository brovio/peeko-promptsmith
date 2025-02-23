export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      api_keys: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          key_value: string
          provider: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          key_value: string
          provider: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          key_value?: string
          provider?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "api_keys_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      available_models: {
        Row: {
          clean_model_name: string
          context_length: number | null
          created_at: string | null
          description: string | null
          id: string
          input_price: number | null
          is_active: boolean | null
          max_tokens: number | null
          model_id: string
          name: string
          output_price: number | null
          p_model: string | null
          p_provider: string | null
          provider: string
          updated_at: string | null
        }
        Insert: {
          clean_model_name: string
          context_length?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          input_price?: number | null
          is_active?: boolean | null
          max_tokens?: number | null
          model_id: string
          name: string
          output_price?: number | null
          p_model?: string | null
          p_provider?: string | null
          provider: string
          updated_at?: string | null
        }
        Update: {
          clean_model_name?: string
          context_length?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          input_price?: number | null
          is_active?: boolean | null
          max_tokens?: number | null
          model_id?: string
          name?: string
          output_price?: number | null
          p_model?: string | null
          p_provider?: string | null
          provider?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      model_preferences: {
        Row: {
          created_at: string | null
          id: string
          is_enabled: boolean | null
          model_id: string
          priority: number | null
          provider: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_enabled?: boolean | null
          model_id: string
          priority?: number | null
          provider: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_enabled?: boolean | null
          model_id?: string
          priority?: number | null
          provider?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "model_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      models_in_use: {
        Row: {
          created_at: string | null
          endpoint: string | null
          id: string
          is_active: boolean | null
          model_id: string
          provider: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          endpoint?: string | null
          id?: string
          is_active?: boolean | null
          model_id: string
          provider: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          endpoint?: string | null
          id?: string
          is_active?: boolean | null
          model_id?: string
          provider?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "models_in_use_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          full_name: string | null
          github_url: string | null
          id: string
          is_superadmin: boolean | null
          linkedin_url: string | null
          role: string | null
          role_type: Database["public"]["Enums"]["user_role"] | null
          twitter_url: string | null
          updated_at: string | null
          username: string | null
          website_url: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          github_url?: string | null
          id: string
          is_superadmin?: boolean | null
          linkedin_url?: string | null
          role?: string | null
          role_type?: Database["public"]["Enums"]["user_role"] | null
          twitter_url?: string | null
          updated_at?: string | null
          username?: string | null
          website_url?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          github_url?: string | null
          id?: string
          is_superadmin?: boolean | null
          linkedin_url?: string | null
          role?: string | null
          role_type?: Database["public"]["Enums"]["user_role"] | null
          twitter_url?: string | null
          updated_at?: string | null
          username?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      prompt_tests: {
        Row: {
          cost: number | null
          created_at: string | null
          id: string
          input: string
          latency: number | null
          prompt_id: string | null
          provider: string
          result: string
          tokens: number | null
          user_id: string | null
        }
        Insert: {
          cost?: number | null
          created_at?: string | null
          id?: string
          input: string
          latency?: number | null
          prompt_id?: string | null
          provider: string
          result: string
          tokens?: number | null
          user_id?: string | null
        }
        Update: {
          cost?: number | null
          created_at?: string | null
          id?: string
          input?: string
          latency?: number | null
          prompt_id?: string | null
          provider?: string
          result?: string
          tokens?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prompt_tests_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prompt_tests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      prompts: {
        Row: {
          category: string | null
          content: string
          cost: number | null
          created_at: string | null
          id: string
          is_public: boolean | null
          model_id: string | null
          processing_time: number | null
          result: string | null
          tags: string[] | null
          template_id: string | null
          title: string | null
          tokens: number | null
          updated_at: string | null
          user_id: string | null
          version: number | null
        }
        Insert: {
          category?: string | null
          content: string
          cost?: number | null
          created_at?: string | null
          id?: string
          is_public?: boolean | null
          model_id?: string | null
          processing_time?: number | null
          result?: string | null
          tags?: string[] | null
          template_id?: string | null
          title?: string | null
          tokens?: number | null
          updated_at?: string | null
          user_id?: string | null
          version?: number | null
        }
        Update: {
          category?: string | null
          content?: string
          cost?: number | null
          created_at?: string | null
          id?: string
          is_public?: boolean | null
          model_id?: string | null
          processing_time?: number | null
          result?: string | null
          tags?: string[] | null
          template_id?: string | null
          title?: string | null
          tokens?: number | null
          updated_at?: string | null
          user_id?: string | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "prompts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      role_available_models: {
        Row: {
          created_at: string | null
          id: string
          model_id: string | null
          role_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          model_id?: string | null
          role_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          model_id?: string | null
          role_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "role_available_models_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "available_models"
            referencedColumns: ["model_id"]
          },
          {
            foreignKeyName: "role_available_models_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "role_definitions"
            referencedColumns: ["id"]
          },
        ]
      }
      role_definitions: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          role_type: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          role_type?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          role_type?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "role_definitions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      templates: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_enabled: boolean | null
          is_public: boolean | null
          name: string
          system_prompt: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_enabled?: boolean | null
          is_public?: boolean | null
          name: string
          system_prompt?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_enabled?: boolean | null
          is_public?: boolean | null
          name?: string
          system_prompt?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "templates_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      theme_configurations: {
        Row: {
          accent: string
          accent_foreground: string
          background: string
          border: string
          card: string
          card_foreground: string
          created_at: string | null
          created_by: string | null
          destructive: string
          destructive_foreground: string
          divider: string
          dropdown_bg: string | null
          dropdown_text: string | null
          filter_bg: string | null
          filter_text: string | null
          foreground: string
          icon: string
          id: string
          input: string
          input_text: string | null
          is_active: boolean | null
          muted: string
          muted_foreground: string
          name: string
          popover: string
          popover_foreground: string
          primary_color: string
          primary_foreground: string
          ring: string
          search_bg: string | null
          search_text: string | null
          secondary: string
          secondary_foreground: string
          theme_type: Database["public"]["Enums"]["theme_type"]
          updated_at: string | null
        }
        Insert: {
          accent: string
          accent_foreground: string
          background: string
          border: string
          card: string
          card_foreground: string
          created_at?: string | null
          created_by?: string | null
          destructive: string
          destructive_foreground: string
          divider: string
          dropdown_bg?: string | null
          dropdown_text?: string | null
          filter_bg?: string | null
          filter_text?: string | null
          foreground: string
          icon: string
          id?: string
          input: string
          input_text?: string | null
          is_active?: boolean | null
          muted: string
          muted_foreground: string
          name: string
          popover: string
          popover_foreground: string
          primary_color: string
          primary_foreground: string
          ring: string
          search_bg?: string | null
          search_text?: string | null
          secondary: string
          secondary_foreground: string
          theme_type?: Database["public"]["Enums"]["theme_type"]
          updated_at?: string | null
        }
        Update: {
          accent?: string
          accent_foreground?: string
          background?: string
          border?: string
          card?: string
          card_foreground?: string
          created_at?: string | null
          created_by?: string | null
          destructive?: string
          destructive_foreground?: string
          divider?: string
          dropdown_bg?: string | null
          dropdown_text?: string | null
          filter_bg?: string | null
          filter_text?: string | null
          foreground?: string
          icon?: string
          id?: string
          input?: string
          input_text?: string | null
          is_active?: boolean | null
          muted?: string
          muted_foreground?: string
          name?: string
          popover?: string
          popover_foreground?: string
          primary_color?: string
          primary_foreground?: string
          ring?: string
          search_bg?: string | null
          search_text?: string | null
          secondary?: string
          secondary_foreground?: string
          theme_type?: Database["public"]["Enums"]["theme_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "theme_configurations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      themes: {
        Row: {
          accent_color: string
          background_color: string
          created_at: string | null
          foreground_color: string
          id: string
          is_active: boolean | null
          name: string
          primary_color: string
          secondary_color: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          accent_color: string
          background_color: string
          created_at?: string | null
          foreground_color: string
          id?: string
          is_active?: boolean | null
          name: string
          primary_color: string
          secondary_color: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          accent_color?: string
          background_color?: string
          created_at?: string | null
          foreground_color?: string
          id?: string
          is_active?: boolean | null
          name?: string
          primary_color?: string
          secondary_color?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "themes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      use_case_operations: {
        Row: {
          cost: number | null
          created_at: string | null
          id: string
          modified_text: string
          operation_type: string
          original_text: string
          tokens_used: number | null
          use_case_id: string
          user_id: string | null
          words_changed: number | null
        }
        Insert: {
          cost?: number | null
          created_at?: string | null
          id?: string
          modified_text: string
          operation_type: string
          original_text: string
          tokens_used?: number | null
          use_case_id: string
          user_id?: string | null
          words_changed?: number | null
        }
        Update: {
          cost?: number | null
          created_at?: string | null
          id?: string
          modified_text?: string
          operation_type?: string
          original_text?: string
          tokens_used?: number | null
          use_case_id?: string
          user_id?: string | null
          words_changed?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "use_case_operations_use_case_id_fkey"
            columns: ["use_case_id"]
            isOneToOne: false
            referencedRelation: "use_cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "use_case_operations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      use_cases: {
        Row: {
          created_at: string | null
          description: string
          enhancer: string
          id: string
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          enhancer: string
          id?: string
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          enhancer?: string
          id?: string
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "use_cases_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      waitlist: {
        Row: {
          created_at: string | null
          email: string
          id: string
          notes: string | null
          status: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          notes?: string | null
          status?: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          notes?: string | null
          status?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_email: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      is_superadmin: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      theme_type: "light" | "dark" | "black" | "custom" | "peeko"
      user_role: "admin" | "basic" | "premium"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
