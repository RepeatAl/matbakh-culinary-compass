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
      foods: {
        Row: {
          category: string
          created_at: string | null
          id: string
          name: Json
          properties: Json | null
          slug: string
        }
        Insert: {
          category: string
          created_at?: string | null
          id?: string
          name: Json
          properties?: Json | null
          slug: string
        }
        Update: {
          category?: string
          created_at?: string | null
          id?: string
          name?: Json
          properties?: Json | null
          slug?: string
        }
        Relationships: []
      }
      foods_seasons: {
        Row: {
          food_id: string
          season_id: string
        }
        Insert: {
          food_id: string
          season_id: string
        }
        Update: {
          food_id?: string
          season_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "foods_seasons_food_id_fkey"
            columns: ["food_id"]
            isOneToOne: false
            referencedRelation: "foods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "foods_seasons_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
        ]
      }
      ingredient_tags: {
        Row: {
          created_at: string | null
          id: string
          ingredient_id: string
          tag: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          ingredient_id: string
          tag: string
        }
        Update: {
          created_at?: string | null
          id?: string
          ingredient_id?: string
          tag?: string
        }
        Relationships: [
          {
            foreignKeyName: "ingredient_tags_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
        ]
      }
      ingredients: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          id: string
          name: string
          quantity: number | null
          recipe_id: string
          unit: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          name: string
          quantity?: number | null
          recipe_id: string
          unit?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          name?: string
          quantity?: number | null
          recipe_id?: string
          unit?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ingredients_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      meal_plan_items: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          id: string
          meal: Database["public"]["Enums"]["meal_type"]
          meal_plan_id: string
          recipe_id: string | null
          updated_at: string | null
          weekday: Database["public"]["Enums"]["weekday_short"]
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          meal: Database["public"]["Enums"]["meal_type"]
          meal_plan_id: string
          recipe_id?: string | null
          updated_at?: string | null
          weekday: Database["public"]["Enums"]["weekday_short"]
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          meal?: Database["public"]["Enums"]["meal_type"]
          meal_plan_id?: string
          recipe_id?: string | null
          updated_at?: string | null
          weekday?: Database["public"]["Enums"]["weekday_short"]
        }
        Relationships: [
          {
            foreignKeyName: "meal_plan_items_meal_plan_id_fkey"
            columns: ["meal_plan_id"]
            isOneToOne: false
            referencedRelation: "meal_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meal_plan_items_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      meal_plans: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          id: string
          updated_at: string | null
          user_id: string
          week_start: string
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
          week_start: string
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
          week_start?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string | null
        }
        Insert: {
          first_name?: string | null
          id: string
          last_name?: string | null
          updated_at?: string | null
        }
        Update: {
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles_ext: {
        Row: {
          allergies: string[] | null
          consent_agb: boolean | null
          consent_agb_at: string | null
          consent_marketing: boolean | null
          consent_marketing_at: string | null
          consent_privacy: boolean | null
          consent_privacy_at: string | null
          created_at: string | null
          diabetes_type: string | null
          disliked_foods: string[] | null
          favorite_foods: string[] | null
          goals: string[] | null
          id: string
          is_diabetic: boolean
          language: string | null
          other_allergies: string | null
          other_conditions: string | null
          phone: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          allergies?: string[] | null
          consent_agb?: boolean | null
          consent_agb_at?: string | null
          consent_marketing?: boolean | null
          consent_marketing_at?: string | null
          consent_privacy?: boolean | null
          consent_privacy_at?: string | null
          created_at?: string | null
          diabetes_type?: string | null
          disliked_foods?: string[] | null
          favorite_foods?: string[] | null
          goals?: string[] | null
          id?: string
          is_diabetic?: boolean
          language?: string | null
          other_allergies?: string | null
          other_conditions?: string | null
          phone?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          allergies?: string[] | null
          consent_agb?: boolean | null
          consent_agb_at?: string | null
          consent_marketing?: boolean | null
          consent_marketing_at?: string | null
          consent_privacy?: boolean | null
          consent_privacy_at?: string | null
          created_at?: string | null
          diabetes_type?: string | null
          disliked_foods?: string[] | null
          favorite_foods?: string[] | null
          goals?: string[] | null
          id?: string
          is_diabetic?: boolean
          language?: string | null
          other_allergies?: string | null
          other_conditions?: string | null
          phone?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_ext_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      recipes: {
        Row: {
          cook_minutes: number | null
          created_at: string | null
          deleted_at: string | null
          description: string | null
          id: string
          prep_minutes: number | null
          publish: boolean | null
          search_vector: unknown | null
          servings: number | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cook_minutes?: number | null
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          prep_minutes?: number | null
          publish?: boolean | null
          search_vector?: unknown | null
          servings?: number | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cook_minutes?: number | null
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          prep_minutes?: number | null
          publish?: boolean | null
          search_vector?: unknown | null
          servings?: number | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      seasons: {
        Row: {
          id: string
          months: number[]
          name: string
        }
        Insert: {
          id?: string
          months: number[]
          name: string
        }
        Update: {
          id?: string
          months?: number[]
          name?: string
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
      meal_type: "breakfast" | "lunch" | "dinner" | "snack"
      weekday_short: "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      meal_type: ["breakfast", "lunch", "dinner", "snack"],
      weekday_short: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
    },
  },
} as const
