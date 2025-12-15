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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      billing_items: {
        Row: {
          amount: number
          created_at: string
          equipment_id: string | null
          facility_id: string
          id: string
          item_type: Database["public"]["Enums"]["billing_item_type"]
          tier_applied: Database["public"]["Enums"]["facility_tier"]
        }
        Insert: {
          amount?: number
          created_at?: string
          equipment_id?: string | null
          facility_id: string
          id?: string
          item_type: Database["public"]["Enums"]["billing_item_type"]
          tier_applied: Database["public"]["Enums"]["facility_tier"]
        }
        Update: {
          amount?: number
          created_at?: string
          equipment_id?: string | null
          facility_id?: string
          id?: string
          item_type?: Database["public"]["Enums"]["billing_item_type"]
          tier_applied?: Database["public"]["Enums"]["facility_tier"]
        }
        Relationships: [
          {
            foreignKeyName: "billing_items_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "billing_items_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "facilities"
            referencedColumns: ["id"]
          },
        ]
      }
      equipment: {
        Row: {
          benchmark_defaults: Json
          brand: string | null
          compliance_ruleset: string
          condition: string | null
          created_at: string
          displacement: number | null
          efficiency_score: number | null
          equipment_type: string
          facility_id: string
          gpm: number | null
          hp: number | null
          id: string
          image_url: string | null
          logger_module: Database["public"]["Enums"]["logger_module"]
          model: string | null
          rpm: number | null
          sensor_enabled: boolean
          updated_at: string
          voltage: number | null
        }
        Insert: {
          benchmark_defaults?: Json
          brand?: string | null
          compliance_ruleset?: string
          condition?: string | null
          created_at?: string
          displacement?: number | null
          efficiency_score?: number | null
          equipment_type: string
          facility_id: string
          gpm?: number | null
          hp?: number | null
          id?: string
          image_url?: string | null
          logger_module?: Database["public"]["Enums"]["logger_module"]
          model?: string | null
          rpm?: number | null
          sensor_enabled?: boolean
          updated_at?: string
          voltage?: number | null
        }
        Update: {
          benchmark_defaults?: Json
          brand?: string | null
          compliance_ruleset?: string
          condition?: string | null
          created_at?: string
          displacement?: number | null
          efficiency_score?: number | null
          equipment_type?: string
          facility_id?: string
          gpm?: number | null
          hp?: number | null
          id?: string
          image_url?: string | null
          logger_module?: Database["public"]["Enums"]["logger_module"]
          model?: string | null
          rpm?: number | null
          sensor_enabled?: boolean
          updated_at?: string
          voltage?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "equipment_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "facilities"
            referencedColumns: ["id"]
          },
        ]
      }
      facilities: {
        Row: {
          address: string | null
          created_at: string
          id: string
          max_equipment_included: number
          name: string
          sensor_enabled: boolean
          tier: Database["public"]["Enums"]["facility_tier"]
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          id?: string
          max_equipment_included?: number
          name: string
          sensor_enabled?: boolean
          tier?: Database["public"]["Enums"]["facility_tier"]
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          id?: string
          max_equipment_included?: number
          name?: string
          sensor_enabled?: boolean
          tier?: Database["public"]["Enums"]["facility_tier"]
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      billing_item_type: "facility_setup" | "equipment_fee" | "sensor_addon"
      facility_tier: "starter" | "professional" | "enterprise"
      logger_module: "boiler" | "chiller" | "energy" | "compressor" | "pump"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
      billing_item_type: ["facility_setup", "equipment_fee", "sensor_addon"],
      facility_tier: ["starter", "professional", "enterprise"],
      logger_module: ["boiler", "chiller", "energy", "compressor", "pump"],
    },
  },
} as const
