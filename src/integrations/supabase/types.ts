export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      daily_logs: {
        Row: {
          arrival_other: string | null
          arrival_tags: string[]
          body_scan: boolean
          coherence_breathing: boolean
          created_at: string
          day_number: number
          focus_level: number | null
          guided_visualization: boolean
          how_resumed: string | null
          id: string
          logged_at: string
          missed_practice: boolean
          reflection: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          arrival_other?: string | null
          arrival_tags?: string[]
          body_scan?: boolean
          coherence_breathing?: boolean
          created_at?: string
          day_number: number
          focus_level?: number | null
          guided_visualization?: boolean
          how_resumed?: string | null
          id?: string
          logged_at?: string
          missed_practice?: boolean
          reflection?: string | null
          updated_at?: string
          user_id?: string
        }
        Update: {
          arrival_other?: string | null
          arrival_tags?: string[]
          body_scan?: boolean
          coherence_breathing?: boolean
          created_at?: string
          day_number?: number
          focus_level?: number | null
          guided_visualization?: boolean
          how_resumed?: string | null
          id?: string
          logged_at?: string
          missed_practice?: boolean
          reflection?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      focus_assessments: {
        Row: {
          answers: number[]
          assessed_at: string
          id: string
          moment: Database["public"]["Enums"]["assessment_moment"]
          total_score: number | null
          user_id: string
        }
        Insert: {
          answers: number[]
          assessed_at?: string
          id?: string
          moment: Database["public"]["Enums"]["assessment_moment"]
          total_score?: number | null
          user_id?: string
        }
        Update: {
          answers?: number[]
          assessed_at?: string
          id?: string
          moment?: Database["public"]["Enums"]["assessment_moment"]
          total_score?: number | null
          user_id?: string
        }
        Relationships: []
      }
      implementation_intentions: {
        Row: {
          created_at: string
          id: string
          if_situation: string
          position: number
          then_action: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          if_situation: string
          position?: number
          then_action: string
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: string
          if_situation?: string
          position?: number
          then_action?: string
          user_id?: string
        }
        Relationships: []
      }
      maintenance_rituals: {
        Row: {
          ritual: string
          updated_at: string
          user_id: string
        }
        Insert: {
          ritual?: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          ritual?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          access_status: Database["public"]["Enums"]["access_status"]
          created_at: string
          email: string | null
          first_login_at: string | null
          id: string
          last_read_anchor: string | null
          last_read_anchor_label: string | null
          last_read_at: string | null
          last_read_slug: string | null
          onboarding_completed_at: string | null
          purchased_at: string | null
          updated_at: string
        }
        Insert: {
          access_status?: Database["public"]["Enums"]["access_status"]
          created_at?: string
          email?: string | null
          first_login_at?: string | null
          id: string
          last_read_anchor?: string | null
          last_read_anchor_label?: string | null
          last_read_at?: string | null
          last_read_slug?: string | null
          onboarding_completed_at?: string | null
          purchased_at?: string | null
          updated_at?: string
        }
        Update: {
          access_status?: Database["public"]["Enums"]["access_status"]
          created_at?: string
          email?: string | null
          first_login_at?: string | null
          id?: string
          last_read_anchor?: string | null
          last_read_anchor_label?: string | null
          last_read_at?: string | null
          last_read_slug?: string | null
          onboarding_completed_at?: string | null
          purchased_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      reading_progress: {
        Row: {
          completed_at: string
          slug: string
          user_id: string
        }
        Insert: {
          completed_at?: string
          slug: string
          user_id?: string
        }
        Update: {
          completed_at?: string
          slug?: string
          user_id?: string
        }
        Relationships: []
      }
      resource_usage_events: {
        Row: {
          created_at: string
          id: string
          resource_name: string
          resource_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          resource_name: string
          resource_type: string
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: string
          resource_name?: string
          resource_type?: string
          user_id?: string
        }
        Relationships: []
      }
      user_activity_events: {
        Row: {
          anchor: string | null
          created_at: string
          event_type: string
          id: string
          metadata: Json
          slug: string | null
          user_id: string
        }
        Insert: {
          anchor?: string | null
          created_at?: string
          event_type: string
          id?: string
          metadata?: Json
          slug?: string | null
          user_id?: string
        }
        Update: {
          anchor?: string | null
          created_at?: string
          event_type?: string
          id?: string
          metadata?: Json
          slug?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      complete_onboarding: { Args: never; Returns: undefined }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      mark_first_login: { Args: never; Returns: undefined }
      set_last_read: {
        Args: { _anchor?: string; _anchor_label?: string; _slug: string }
        Returns: undefined
      }
    }
    Enums: {
      access_status: "activo" | "pendiente" | "revocado"
      app_role: "admin" | "user"
      assessment_moment:
        | "pre_dia1"
        | "cierre_semana1"
        | "cierre_semana2"
        | "dia21"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      access_status: ["activo", "pendiente", "revocado"],
      app_role: ["admin", "user"],
      assessment_moment: [
        "pre_dia1",
        "cierre_semana1",
        "cierre_semana2",
        "dia21",
      ],
    },
  },
} as const
