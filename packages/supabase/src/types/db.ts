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
      asset_types: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          slug: string | null
          updated_at: string | null
          use_codes: number[] | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          slug?: string | null
          updated_at?: string | null
          use_codes?: number[] | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          slug?: string | null
          updated_at?: string | null
          use_codes?: number[] | null
        }
        Relationships: []
      }
      customers: {
        Row: {
          id: string
          stripe_customer_id: string | null
        }
        Insert: {
          id: string
          stripe_customer_id?: string | null
        }
        Update: {
          id?: string
          stripe_customer_id?: string | null
        }
        Relationships: []
      }
      prices: {
        Row: {
          active: boolean | null
          currency: string | null
          description: string | null
          id: string
          interval: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count: number | null
          metadata: Json | null
          product_id: string | null
          trial_period_days: number | null
          type: Database["public"]["Enums"]["pricing_type"] | null
          unit_amount: number | null
        }
        Insert: {
          active?: boolean | null
          currency?: string | null
          description?: string | null
          id: string
          interval?: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count?: number | null
          metadata?: Json | null
          product_id?: string | null
          trial_period_days?: number | null
          type?: Database["public"]["Enums"]["pricing_type"] | null
          unit_amount?: number | null
        }
        Update: {
          active?: boolean | null
          currency?: string | null
          description?: string | null
          id?: string
          interval?: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count?: number | null
          metadata?: Json | null
          product_id?: string | null
          trial_period_days?: number | null
          type?: Database["public"]["Enums"]["pricing_type"] | null
          unit_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "prices_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          active: boolean | null
          description: string | null
          id: string
          image: string | null
          metadata: Json | null
          name: string | null
        }
        Insert: {
          active?: boolean | null
          description?: string | null
          id: string
          image?: string | null
          metadata?: Json | null
          name?: string | null
        }
        Update: {
          active?: boolean | null
          description?: string | null
          id?: string
          image?: string | null
          metadata?: Json | null
          name?: string | null
        }
        Relationships: []
      }
      property_records: {
        Row: {
          absentee_owner: boolean | null
          address: string
          adjustable_rate: boolean | null
          assessed_value: number | null
          bathrooms: number | null
          bedrooms: number | null
          city: string | null
          corporate_owned: boolean | null
          county: string | null
          created_at: string | null
          document_type: string | null
          document_type_code: string | null
          equity_percent: number | null
          estimated_value: number | null
          fips: string | null
          high_equity: boolean | null
          id: string
          judgment: boolean | null
          land_use: string | null
          last_mortgage1_amount: string | null
          last_sale_amount: string | null
          last_sale_arms_length: boolean | null
          last_sale_date: string | null
          last_update_date: string | null
          latitude: number | null
          lender_name: string | null
          listing_amount: string | null
          loan_type_code: string | null
          longitude: number | null
          lot_square_feet: number | null
          mail_address: string | null
          mail_city: string | null
          mail_state: string | null
          mail_street: string | null
          mail_zip: string | null
          maturity_date_first: string | null
          median_income: string | null
          mfh_2_to_4: boolean | null
          mfh_5_plus: boolean | null
          mls_active: boolean | null
          mls_cancelled: boolean | null
          mls_days_on_market: number | null
          mls_failed: boolean | null
          mls_has_photos: boolean | null
          mls_last_sale_date: string | null
          mls_last_status_date: string | null
          mls_listing_date: string | null
          mls_listing_price: number | null
          mls_pending: boolean | null
          mls_sold: boolean | null
          mls_sold_price: number | null
          mls_status: string | null
          mls_type: string | null
          negative_equity: boolean | null
          neighborhood: Json | null
          open_mortgage_balance: number | null
          out_of_state_absentee_owner: boolean | null
          owner_occupied: boolean | null
          owner1_first_name: string | null
          owner1_last_name: string
          owner2_first_name: string | null
          owner2_last_name: string | null
          parcel_account_number: string | null
          patio: boolean | null
          patio_area: number | null
          pool: boolean | null
          pool_area: number | null
          portfolio_purchased_last_12_months: number | null
          portfolio_purchased_last_6_months: number | null
          pre_foreclosure: boolean | null
          price_per_square_foot: number | null
          prior_owner_individual: boolean | null
          prior_owner_months_owned: string | null
          prior_sale_amount: string | null
          private_lender: boolean | null
          property_id: string
          property_type: string | null
          property_use: string | null
          property_use_code: number | null
          recording_date: string | null
          rent_amount: string | null
          reo: boolean | null
          rooms_count: number | null
          search_log_id: string
          square_feet: number | null
          state: string
          stories: number | null
          street: string | null
          suggested_rent: string | null
          tax_delinquent_year: string | null
          tax_lien: boolean | null
          total_portfolio_equity: string | null
          total_portfolio_mortgage_balance: string | null
          total_portfolio_value: string | null
          total_properties_owned: string | null
          units_count: number | null
          updated_at: string | null
          user_id: string
          vacant: boolean | null
          year_built: number | null
          years_owned: number | null
          zip: string
        }
        Insert: {
          absentee_owner?: boolean | null
          address: string
          adjustable_rate?: boolean | null
          assessed_value?: number | null
          bathrooms?: number | null
          bedrooms?: number | null
          city?: string | null
          corporate_owned?: boolean | null
          county?: string | null
          created_at?: string | null
          document_type?: string | null
          document_type_code?: string | null
          equity_percent?: number | null
          estimated_value?: number | null
          fips?: string | null
          high_equity?: boolean | null
          id?: string
          judgment?: boolean | null
          land_use?: string | null
          last_mortgage1_amount?: string | null
          last_sale_amount?: string | null
          last_sale_arms_length?: boolean | null
          last_sale_date?: string | null
          last_update_date?: string | null
          latitude?: number | null
          lender_name?: string | null
          listing_amount?: string | null
          loan_type_code?: string | null
          longitude?: number | null
          lot_square_feet?: number | null
          mail_address?: string | null
          mail_city?: string | null
          mail_state?: string | null
          mail_street?: string | null
          mail_zip?: string | null
          maturity_date_first?: string | null
          median_income?: string | null
          mfh_2_to_4?: boolean | null
          mfh_5_plus?: boolean | null
          mls_active?: boolean | null
          mls_cancelled?: boolean | null
          mls_days_on_market?: number | null
          mls_failed?: boolean | null
          mls_has_photos?: boolean | null
          mls_last_sale_date?: string | null
          mls_last_status_date?: string | null
          mls_listing_date?: string | null
          mls_listing_price?: number | null
          mls_pending?: boolean | null
          mls_sold?: boolean | null
          mls_sold_price?: number | null
          mls_status?: string | null
          mls_type?: string | null
          negative_equity?: boolean | null
          neighborhood?: Json | null
          open_mortgage_balance?: number | null
          out_of_state_absentee_owner?: boolean | null
          owner_occupied?: boolean | null
          owner1_first_name?: string | null
          owner1_last_name: string
          owner2_first_name?: string | null
          owner2_last_name?: string | null
          parcel_account_number?: string | null
          patio?: boolean | null
          patio_area?: number | null
          pool?: boolean | null
          pool_area?: number | null
          portfolio_purchased_last_12_months?: number | null
          portfolio_purchased_last_6_months?: number | null
          pre_foreclosure?: boolean | null
          price_per_square_foot?: number | null
          prior_owner_individual?: boolean | null
          prior_owner_months_owned?: string | null
          prior_sale_amount?: string | null
          private_lender?: boolean | null
          property_id: string
          property_type?: string | null
          property_use?: string | null
          property_use_code?: number | null
          recording_date?: string | null
          rent_amount?: string | null
          reo?: boolean | null
          rooms_count?: number | null
          search_log_id: string
          square_feet?: number | null
          state: string
          stories?: number | null
          street?: string | null
          suggested_rent?: string | null
          tax_delinquent_year?: string | null
          tax_lien?: boolean | null
          total_portfolio_equity?: string | null
          total_portfolio_mortgage_balance?: string | null
          total_portfolio_value?: string | null
          total_properties_owned?: string | null
          units_count?: number | null
          updated_at?: string | null
          user_id: string
          vacant?: boolean | null
          year_built?: number | null
          years_owned?: number | null
          zip: string
        }
        Update: {
          absentee_owner?: boolean | null
          address?: string
          adjustable_rate?: boolean | null
          assessed_value?: number | null
          bathrooms?: number | null
          bedrooms?: number | null
          city?: string | null
          corporate_owned?: boolean | null
          county?: string | null
          created_at?: string | null
          document_type?: string | null
          document_type_code?: string | null
          equity_percent?: number | null
          estimated_value?: number | null
          fips?: string | null
          high_equity?: boolean | null
          id?: string
          judgment?: boolean | null
          land_use?: string | null
          last_mortgage1_amount?: string | null
          last_sale_amount?: string | null
          last_sale_arms_length?: boolean | null
          last_sale_date?: string | null
          last_update_date?: string | null
          latitude?: number | null
          lender_name?: string | null
          listing_amount?: string | null
          loan_type_code?: string | null
          longitude?: number | null
          lot_square_feet?: number | null
          mail_address?: string | null
          mail_city?: string | null
          mail_state?: string | null
          mail_street?: string | null
          mail_zip?: string | null
          maturity_date_first?: string | null
          median_income?: string | null
          mfh_2_to_4?: boolean | null
          mfh_5_plus?: boolean | null
          mls_active?: boolean | null
          mls_cancelled?: boolean | null
          mls_days_on_market?: number | null
          mls_failed?: boolean | null
          mls_has_photos?: boolean | null
          mls_last_sale_date?: string | null
          mls_last_status_date?: string | null
          mls_listing_date?: string | null
          mls_listing_price?: number | null
          mls_pending?: boolean | null
          mls_sold?: boolean | null
          mls_sold_price?: number | null
          mls_status?: string | null
          mls_type?: string | null
          negative_equity?: boolean | null
          neighborhood?: Json | null
          open_mortgage_balance?: number | null
          out_of_state_absentee_owner?: boolean | null
          owner_occupied?: boolean | null
          owner1_first_name?: string | null
          owner1_last_name?: string
          owner2_first_name?: string | null
          owner2_last_name?: string | null
          parcel_account_number?: string | null
          patio?: boolean | null
          patio_area?: number | null
          pool?: boolean | null
          pool_area?: number | null
          portfolio_purchased_last_12_months?: number | null
          portfolio_purchased_last_6_months?: number | null
          pre_foreclosure?: boolean | null
          price_per_square_foot?: number | null
          prior_owner_individual?: boolean | null
          prior_owner_months_owned?: string | null
          prior_sale_amount?: string | null
          private_lender?: boolean | null
          property_id?: string
          property_type?: string | null
          property_use?: string | null
          property_use_code?: number | null
          recording_date?: string | null
          rent_amount?: string | null
          reo?: boolean | null
          rooms_count?: number | null
          search_log_id?: string
          square_feet?: number | null
          state?: string
          stories?: number | null
          street?: string | null
          suggested_rent?: string | null
          tax_delinquent_year?: string | null
          tax_lien?: boolean | null
          total_portfolio_equity?: string | null
          total_portfolio_mortgage_balance?: string | null
          total_portfolio_value?: string | null
          total_properties_owned?: string | null
          units_count?: number | null
          updated_at?: string | null
          user_id?: string
          vacant?: boolean | null
          year_built?: number | null
          years_owned?: number | null
          zip?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_records_search_log_id_fkey"
            columns: ["search_log_id"]
            isOneToOne: false
            referencedRelation: "search_logs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_records_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      search_logs: {
        Row: {
          asset_type_id: string
          created_at: string | null
          execution_time_ms: number | null
          id: string
          result_count: number
          search_parameters: Json
          status: Database["public"]["Enums"]["search_status"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          asset_type_id: string
          created_at?: string | null
          execution_time_ms?: number | null
          id?: string
          result_count: number
          search_parameters: Json
          status?: Database["public"]["Enums"]["search_status"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          asset_type_id?: string
          created_at?: string | null
          execution_time_ms?: number | null
          id?: string
          result_count?: number
          search_parameters?: Json
          status?: Database["public"]["Enums"]["search_status"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "search_logs_asset_type_id_fkey"
            columns: ["asset_type_id"]
            isOneToOne: false
            referencedRelation: "asset_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "search_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          cancel_at: string | null
          cancel_at_period_end: boolean | null
          canceled_at: string | null
          created: string
          current_period_end: string
          current_period_start: string
          ended_at: string | null
          id: string
          metadata: Json | null
          price_id: string | null
          quantity: number | null
          status: Database["public"]["Enums"]["subscription_status"] | null
          trial_end: string | null
          trial_start: string | null
          user_id: string
        }
        Insert: {
          cancel_at?: string | null
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created?: string
          current_period_end?: string
          current_period_start?: string
          ended_at?: string | null
          id: string
          metadata?: Json | null
          price_id?: string | null
          quantity?: number | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          trial_end?: string | null
          trial_start?: string | null
          user_id: string
        }
        Update: {
          cancel_at?: string | null
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created?: string
          current_period_end?: string
          current_period_start?: string
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          price_id?: string | null
          quantity?: number | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          trial_end?: string | null
          trial_start?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_price_id_fkey"
            columns: ["price_id"]
            isOneToOne: false
            referencedRelation: "prices"
            referencedColumns: ["id"]
          },
        ]
      }
      user_license_asset_types: {
        Row: {
          asset_type_slug: string
          created_at: string | null
          id: string
          license_id: string
        }
        Insert: {
          asset_type_slug: string
          created_at?: string | null
          id?: string
          license_id: string
        }
        Update: {
          asset_type_slug?: string
          created_at?: string | null
          id?: string
          license_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_license_asset_types_asset_type_slug_fkey"
            columns: ["asset_type_slug"]
            isOneToOne: false
            referencedRelation: "asset_types"
            referencedColumns: ["slug"]
          },
          {
            foreignKeyName: "user_license_asset_types_license_id_fkey"
            columns: ["license_id"]
            isOneToOne: false
            referencedRelation: "user_active_licenses"
            referencedColumns: ["license_id"]
          },
          {
            foreignKeyName: "user_license_asset_types_license_id_fkey"
            columns: ["license_id"]
            isOneToOne: false
            referencedRelation: "user_licensed_combinations"
            referencedColumns: ["license_id"]
          },
          {
            foreignKeyName: "user_license_asset_types_license_id_fkey"
            columns: ["license_id"]
            isOneToOne: false
            referencedRelation: "user_licenses"
            referencedColumns: ["id"]
          },
        ]
      }
      user_licenses: {
        Row: {
          created_at: string | null
          id: string
          licensed: boolean
          location_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          licensed?: boolean
          location_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          licensed?: boolean
          location_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_licenses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          billing_address: Json | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          locale: string | null
          phone_number: string | null
          role: string | null
          time_format: number | null
          timezone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          billing_address?: Json | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          locale?: string | null
          phone_number?: string | null
          role?: string | null
          time_format?: number | null
          timezone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          billing_address?: Json | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          locale?: string | null
          phone_number?: string | null
          role?: string | null
          time_format?: number | null
          timezone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      user_active_licenses: {
        Row: {
          asset_count: number | null
          asset_type_slugs: string[] | null
          asset_types_key: string | null
          created_at: string | null
          license_id: string | null
          licensed: boolean | null
          location_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_licenses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_licensed_combinations: {
        Row: {
          asset_count: number | null
          asset_type_slugs: string[] | null
          asset_types_key: string | null
          created_at: string | null
          license_id: string | null
          licensed: boolean | null
          location_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_licenses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      slugify: {
        Args: { value: string }
        Returns: string
      }
      unaccent: {
        Args: { "": string }
        Returns: string
      }
      unaccent_init: {
        Args: { "": unknown }
        Returns: unknown
      }
      user_has_license_combo: {
        Args: {
          p_user_id: string
          p_location_id: string
          p_asset_types: string[]
        }
        Returns: boolean
      }
    }
    Enums: {
      pricing_plan_interval: "day" | "week" | "month" | "year"
      pricing_type: "one_time" | "recurring"
      search_status: "preview" | "pending" | "completed" | "failed"
      subscription_status:
        | "trialing"
        | "active"
        | "canceled"
        | "incomplete"
        | "incomplete_expired"
        | "past_due"
        | "unpaid"
        | "paused"
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
      pricing_plan_interval: ["day", "week", "month", "year"],
      pricing_type: ["one_time", "recurring"],
      search_status: ["preview", "pending", "completed", "failed"],
      subscription_status: [
        "trialing",
        "active",
        "canceled",
        "incomplete",
        "incomplete_expired",
        "past_due",
        "unpaid",
        "paused",
      ],
    },
  },
} as const

