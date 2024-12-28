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
          context_length: number | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          model_id: string
          name: string
          provider: string
          updated_at: string | null
        }
        Insert: {
          context_length?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          model_id: string
          name: string
          provider: string
          updated_at?: string | null
        }
        Update: {
          context_length?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          model_id?: string
          name?: string
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
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          is_superadmin: boolean | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          is_superadmin?: boolean | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          is_superadmin?: boolean | null
          updated_at?: string | null
          username?: string | null
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
      [_ in never]: never
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
