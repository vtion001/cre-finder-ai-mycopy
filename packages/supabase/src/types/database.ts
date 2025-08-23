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
      asset_licenses: {
        Row: {
          asset_type_slug: string
          created_at: string | null
          id: string
          is_active: boolean | null
          search_params: Json | null
          updated_at: string | null
          use_codes: number[] | null
          user_id: string
        }
        Insert: {
          asset_type_slug: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          search_params?: Json | null
          updated_at?: string | null
          use_codes?: number[] | null
          user_id: string
        }
        Update: {
          asset_type_slug?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          search_params?: Json | null
          updated_at?: string | null
          use_codes?: number[] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "asset_licenses_asset_type_slug_fkey"
            columns: ["asset_type_slug"]
            isOneToOne: false
            referencedRelation: "asset_types"
            referencedColumns: ["slug"]
          },
          {
            foreignKeyName: "asset_licenses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
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
      call_recordings: {
        Row: {
          call_id: string
          created_at: string | null
          duration: number
          file_size: number
          format: string
          id: string
          recording_url: string
          status: string
          transcribed_at: string | null
          transcript: string | null
          transcription_status: string
          updated_at: string | null
          uploaded_at: string | null
          user_id: string
        }
        Insert: {
          call_id: string
          created_at?: string | null
          duration: number
          file_size: number
          format?: string
          id?: string
          recording_url: string
          status?: string
          transcribed_at?: string | null
          transcript?: string | null
          transcription_status?: string
          updated_at?: string | null
          uploaded_at?: string | null
          user_id: string
        }
        Update: {
          call_id?: string
          created_at?: string | null
          duration?: number
          file_size?: number
          format?: string
          id?: string
          recording_url?: string
          status?: string
          transcribed_at?: string | null
          transcript?: string | null
          transcription_status?: string
          updated_at?: string | null
          uploaded_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "call_recordings_call_id_fkey"
            columns: ["call_id"]
            isOneToOne: false
            referencedRelation: "outbound_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "call_recordings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_results: {
        Row: {
          campaign_id: string
          channel: string
          created_at: string
          delivered_at: string | null
          error_message: string | null
          id: string
          max_retries: number
          record_id: string
          response_data: Json | null
          retry_count: number
          sent_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          campaign_id: string
          channel: string
          created_at?: string
          delivered_at?: string | null
          error_message?: string | null
          id?: string
          max_retries?: number
          record_id: string
          response_data?: Json | null
          retry_count?: number
          sent_at?: string | null
          status: string
          updated_at?: string
        }
        Update: {
          campaign_id?: string
          channel?: string
          created_at?: string
          delivered_at?: string | null
          error_message?: string | null
          id?: string
          max_retries?: number
          record_id?: string
          response_data?: Json | null
          retry_count?: number
          sent_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_results_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_templates: {
        Row: {
          channel: string
          content: Json
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          updated_at: string
          user_id: string
          variables: Json | null
        }
        Insert: {
          channel: string
          content: Json
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
          user_id: string
          variables?: Json | null
        }
        Update: {
          channel?: string
          content?: Json
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
          user_id?: string
          variables?: Json | null
        }
        Relationships: []
      }
      campaigns: {
        Row: {
          campaign_type: string
          channels: Json
          completed_at: string | null
          created_at: string
          delivered_count: number
          description: string | null
          failed_count: number
          id: string
          name: string
          priority: string
          record_ids: string[]
          responded_count: number
          results: Json | null
          scheduled_at: string | null
          sent_count: number
          settings: Json | null
          status: string
          template_id: string | null
          total_records: number
          updated_at: string
          user_id: string
        }
        Insert: {
          campaign_type?: string
          channels?: Json
          completed_at?: string | null
          created_at?: string
          delivered_count?: number
          description?: string | null
          failed_count?: number
          id?: string
          name: string
          priority?: string
          record_ids?: string[]
          responded_count?: number
          results?: Json | null
          scheduled_at?: string | null
          sent_count?: number
          settings?: Json | null
          status?: string
          template_id?: string | null
          total_records?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          campaign_type?: string
          channels?: Json
          completed_at?: string | null
          created_at?: string
          delivered_count?: number
          description?: string | null
          failed_count?: number
          id?: string
          name?: string
          priority?: string
          record_ids?: string[]
          responded_count?: number
          results?: Json | null
          scheduled_at?: string | null
          sent_count?: number
          settings?: Json | null
          status?: string
          template_id?: string | null
          total_records?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "campaign_templates"
            referencedColumns: ["id"]
          },
        ]
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
      integration_configs: {
        Row: {
          config: Json
          created_at: string
          id: string
          provider: string
          updated_at: string
          user_id: string
        }
        Insert: {
          config?: Json
          created_at?: string
          id?: string
          provider: string
          updated_at?: string
          user_id: string
        }
        Update: {
          config?: Json
          created_at?: string
          id?: string
          provider?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      integration_status: {
        Row: {
          created_at: string | null
          error_message: string | null
          id: string
          integration_type: string
          is_configured: boolean | null
          last_tested_at: string | null
          test_status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          integration_type: string
          is_configured?: boolean | null
          last_tested_at?: string | null
          test_status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          integration_type?: string
          is_configured?: boolean | null
          last_tested_at?: string | null
          test_status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      location_licenses: {
        Row: {
          asset_license_id: string
          created_at: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          location_formatted: string
          location_internal_id: string
          location_name: string
          location_state: string
          location_type: Database["public"]["Enums"]["location_type"]
          result_count: number
          updated_at: string | null
        }
        Insert: {
          asset_license_id: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          location_formatted: string
          location_internal_id: string
          location_name: string
          location_state: string
          location_type: Database["public"]["Enums"]["location_type"]
          result_count?: number
          updated_at?: string | null
        }
        Update: {
          asset_license_id?: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          location_formatted?: string
          location_internal_id?: string
          location_name?: string
          location_state?: string
          location_type?: Database["public"]["Enums"]["location_type"]
          result_count?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "location_licenses_asset_license_id_fkey"
            columns: ["asset_license_id"]
            isOneToOne: false
            referencedRelation: "asset_licenses"
            referencedColumns: ["id"]
          },
        ]
      }
      outbound_events: {
        Row: {
          channel: Database["public"]["Enums"]["outbound_channel"]
          cost_cents: number | null
          created_at: string
          error: string | null
          id: string
          payload: Json | null
          status: string
          to_contact: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          channel: Database["public"]["Enums"]["outbound_channel"]
          cost_cents?: number | null
          created_at?: string
          error?: string | null
          id?: string
          payload?: Json | null
          status?: string
          to_contact?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          channel?: Database["public"]["Enums"]["outbound_channel"]
          cost_cents?: number | null
          created_at?: string
          error?: string | null
          id?: string
          payload?: Json | null
          status?: string
          to_contact?: string | null
          updated_at?: string
          user_id?: string
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
      properties: {
        Row: {
          address_line_1: string
          address_line_2: string | null
          bathrooms: number | null
          bedrooms: number | null
          city: string
          contact_info: Json | null
          country: string | null
          created_at: string | null
          description: string | null
          documents: string[] | null
          id: string
          images: string[] | null
          is_active: boolean | null
          is_featured: boolean | null
          latitude: number | null
          longitude: number | null
          lot_size: number | null
          price: number | null
          price_type: string | null
          property_features: string[] | null
          property_type: string
          square_feet: number | null
          state: string
          status: string | null
          title: string
          updated_at: string | null
          user_id: string
          year_built: number | null
          zip_code: string
        }
        Insert: {
          address_line_1: string
          address_line_2?: string | null
          bathrooms?: number | null
          bedrooms?: number | null
          city: string
          contact_info?: Json | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          documents?: string[] | null
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          is_featured?: boolean | null
          latitude?: number | null
          longitude?: number | null
          lot_size?: number | null
          price?: number | null
          price_type?: string | null
          property_features?: string[] | null
          property_type: string
          square_feet?: number | null
          state: string
          status?: string | null
          title: string
          updated_at?: string | null
          user_id: string
          year_built?: number | null
          zip_code: string
        }
        Update: {
          address_line_1?: string
          address_line_2?: string | null
          bathrooms?: number | null
          bedrooms?: number | null
          city?: string
          contact_info?: Json | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          documents?: string[] | null
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          is_featured?: boolean | null
          latitude?: number | null
          longitude?: number | null
          lot_size?: number | null
          price?: number | null
          price_type?: string | null
          property_features?: string[] | null
          property_type?: string
          square_feet?: number | null
          state?: string
          status?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
          year_built?: number | null
          zip_code?: string
        }
        Relationships: []
      }
      property_records: {
        Row: {
          absentee_owner: boolean | null
          address: string
          adjustable_rate: boolean | null
          assessed_value: number | null
          asset_license_id: string
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
          location_license_id: string
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
          skip_trace_data: Json | null
          skip_trace_updated_at: string | null
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
          asset_license_id: string
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
          location_license_id: string
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
          skip_trace_data?: Json | null
          skip_trace_updated_at?: string | null
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
          asset_license_id?: string
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
          location_license_id?: string
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
          skip_trace_data?: Json | null
          skip_trace_updated_at?: string | null
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
            foreignKeyName: "property_records_asset_license_id_fkey"
            columns: ["asset_license_id"]
            isOneToOne: false
            referencedRelation: "asset_licenses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_records_location_license_id_fkey"
            columns: ["location_license_id"]
            isOneToOne: false
            referencedRelation: "location_licenses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_records_location_license_id_fkey"
            columns: ["location_license_id"]
            isOneToOne: false
            referencedRelation: "user_licenses"
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
      sendgrid_configs: {
        Row: {
          api_key: string
          created_at: string | null
          custom_subject: string | null
          from_email: string
          from_name: string
          id: string
          is_active: boolean | null
          template_id: string | null
          updated_at: string | null
          user_id: string
          webhook_url: string | null
        }
        Insert: {
          api_key: string
          created_at?: string | null
          custom_subject?: string | null
          from_email: string
          from_name: string
          id?: string
          is_active?: boolean | null
          template_id?: string | null
          updated_at?: string | null
          user_id: string
          webhook_url?: string | null
        }
        Update: {
          api_key?: string
          created_at?: string | null
          custom_subject?: string | null
          from_email?: string
          from_name?: string
          id?: string
          is_active?: boolean | null
          template_id?: string | null
          updated_at?: string | null
          user_id?: string
          webhook_url?: string | null
        }
        Relationships: []
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
      twilio_configs: {
        Row: {
          account_sid: string
          auth_token: string
          created_at: string | null
          custom_message: string | null
          id: string
          is_active: boolean | null
          messaging_service_sid: string | null
          phone_number: string
          updated_at: string | null
          user_id: string
          webhook_url: string | null
        }
        Insert: {
          account_sid: string
          auth_token: string
          created_at?: string | null
          custom_message?: string | null
          id?: string
          is_active?: boolean | null
          messaging_service_sid?: string | null
          phone_number: string
          updated_at?: string | null
          user_id: string
          webhook_url?: string | null
        }
        Update: {
          account_sid?: string
          auth_token?: string
          created_at?: string | null
          custom_message?: string | null
          id?: string
          is_active?: boolean | null
          messaging_service_sid?: string | null
          phone_number?: string
          updated_at?: string | null
          user_id?: string
          webhook_url?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          avatar_url: string | null
          billing_address: Json | null
          created_at: string | null
          crm_id: string | null
          email: string
          full_name: string | null
          id: string
          locale: string | null
          phone_number: string | null
          role: Database["public"]["Enums"]["user_role"]
          time_format: number | null
          timezone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          billing_address?: Json | null
          created_at?: string | null
          crm_id?: string | null
          email: string
          full_name?: string | null
          id: string
          locale?: string | null
          phone_number?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          time_format?: number | null
          timezone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          billing_address?: Json | null
          created_at?: string | null
          crm_id?: string | null
          email?: string
          full_name?: string | null
          id?: string
          locale?: string | null
          phone_number?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          time_format?: number | null
          timezone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      vapi_assistants: {
        Row: {
          created_at: string
          first_message: string | null
          id: string
          is_active: boolean
          model_parameters: Json | null
          name: string
          system_prompt: string | null
          updated_at: string
          user_id: string
          vapi_assistant_id: string | null
          voice_parameters: Json | null
        }
        Insert: {
          created_at?: string
          first_message?: string | null
          id?: string
          is_active?: boolean
          model_parameters?: Json | null
          name: string
          system_prompt?: string | null
          updated_at?: string
          user_id: string
          vapi_assistant_id?: string | null
          voice_parameters?: Json | null
        }
        Update: {
          created_at?: string
          first_message?: string | null
          id?: string
          is_active?: boolean
          model_parameters?: Json | null
          name?: string
          system_prompt?: string | null
          updated_at?: string
          user_id?: string
          vapi_assistant_id?: string | null
          voice_parameters?: Json | null
        }
        Relationships: []
      }
      vapi_configs: {
        Row: {
          api_key: string
          assistant_id: string
          created_at: string | null
          custom_prompt: string | null
          id: string
          is_active: boolean | null
          organization: string
          phone_number: string
          updated_at: string | null
          user_id: string
          webhook_url: string | null
        }
        Insert: {
          api_key: string
          assistant_id: string
          created_at?: string | null
          custom_prompt?: string | null
          id?: string
          is_active?: boolean | null
          organization: string
          phone_number: string
          updated_at?: string | null
          user_id: string
          webhook_url?: string | null
        }
        Update: {
          api_key?: string
          assistant_id?: string
          created_at?: string | null
          custom_prompt?: string | null
          id?: string
          is_active?: boolean | null
          organization?: string
          phone_number?: string
          updated_at?: string | null
          user_id?: string
          webhook_url?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      public_properties: {
        Row: {
          address_line_1: string | null
          bathrooms: number | null
          bedrooms: number | null
          city: string | null
          country: string | null
          created_at: string | null
          description: string | null
          id: string | null
          images: string[] | null
          is_featured: boolean | null
          latitude: number | null
          longitude: number | null
          lot_size: number | null
          price: number | null
          price_type: string | null
          property_features: string[] | null
          property_type: string | null
          square_feet: number | null
          state: string | null
          status: string | null
          title: string | null
          year_built: number | null
          zip_code: string | null
        }
        Insert: {
          address_line_1?: string | null
          bathrooms?: number | null
          bedrooms?: number | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          id?: string | null
          images?: string[] | null
          is_featured?: boolean | null
          latitude?: number | null
          longitude?: number | null
          lot_size?: number | null
          price?: number | null
          price_type?: string | null
          property_features?: string[] | null
          property_type?: string | null
          square_feet?: number | null
          state?: string | null
          status?: string | null
          title?: string | null
          year_built?: number | null
          zip_code?: string | null
        }
        Update: {
          address_line_1?: string | null
          bathrooms?: number | null
          bedrooms?: number | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          id?: string | null
          images?: string[] | null
          is_featured?: boolean | null
          latitude?: number | null
          longitude?: number | null
          lot_size?: number | null
          price?: number | null
          price_type?: string | null
          property_features?: string[] | null
          property_type?: string | null
          square_feet?: number | null
          state?: string | null
          status?: string | null
          title?: string | null
          year_built?: number | null
          zip_code?: string | null
        }
        Relationships: []
      }
      user_licenses: {
        Row: {
          asset_type_slug: string | null
          created_at: string | null
          expires_at: string | null
          id: string | null
          is_active: boolean | null
          location_formatted: string | null
          location_internal_id: string | null
          location_name: string | null
          location_state: string | null
          location_type: Database["public"]["Enums"]["location_type"] | null
          result_count: number | null
          updated_at: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "asset_licenses_asset_type_slug_fkey"
            columns: ["asset_type_slug"]
            isOneToOne: false
            referencedRelation: "asset_types"
            referencedColumns: ["slug"]
          },
          {
            foreignKeyName: "asset_licenses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_licenses_by_asset_type: {
        Row: {
          asset_type_name: string | null
          asset_type_slug: string | null
          expires_at: string | null
          license_count: number | null
          location_ids: string[] | null
          total_result_count: number | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "asset_licenses_asset_type_slug_fkey"
            columns: ["asset_type_slug"]
            isOneToOne: false
            referencedRelation: "asset_types"
            referencedColumns: ["slug"]
          },
          {
            foreignKeyName: "asset_licenses_user_id_fkey"
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
    }
    Enums: {
      location_type: "county" | "city"
      outbound_channel:
        | "sms"
        | "voicemail"
        | "phone"
        | "email"
        | "postcard"
        | "handwritten"
      pricing_plan_interval: "day" | "week" | "month" | "year"
      pricing_type: "one_time" | "recurring"
      subscription_status:
        | "trialing"
        | "active"
        | "canceled"
        | "incomplete"
        | "incomplete_expired"
        | "past_due"
        | "unpaid"
        | "paused"
      user_role: "investor" | "wholesaler" | "broker" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          type: Database["storage"]["Enums"]["buckettype"]
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string | null
        }
        Relationships: []
      }
      buckets_analytics: {
        Row: {
          created_at: string
          format: string
          id: string
          type: Database["storage"]["Enums"]["buckettype"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          format?: string
          id: string
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          format?: string
          id?: string
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string
        }
        Relationships: []
      }
      iceberg_namespaces: {
        Row: {
          bucket_id: string
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "iceberg_namespaces_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets_analytics"
            referencedColumns: ["id"]
          },
        ]
      }
      iceberg_tables: {
        Row: {
          bucket_id: string
          created_at: string
          id: string
          location: string
          name: string
          namespace_id: string
          updated_at: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          id?: string
          location: string
          name: string
          namespace_id: string
          updated_at?: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          id?: string
          location?: string
          name?: string
          namespace_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "iceberg_tables_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets_analytics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "iceberg_tables_namespace_id_fkey"
            columns: ["namespace_id"]
            isOneToOne: false
            referencedRelation: "iceberg_namespaces"
            referencedColumns: ["id"]
          },
        ]
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          level: number | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          user_metadata: Json | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          level?: number | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          user_metadata?: Json | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          level?: number | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          user_metadata?: Json | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      prefixes: {
        Row: {
          bucket_id: string
          created_at: string | null
          level: number
          name: string
          updated_at: string | null
        }
        Insert: {
          bucket_id: string
          created_at?: string | null
          level?: number
          name: string
          updated_at?: string | null
        }
        Update: {
          bucket_id?: string
          created_at?: string | null
          level?: number
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prefixes_bucketId_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads: {
        Row: {
          bucket_id: string
          created_at: string
          id: string
          in_progress_size: number
          key: string
          owner_id: string | null
          upload_signature: string
          user_metadata: Json | null
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          id: string
          in_progress_size?: number
          key: string
          owner_id?: string | null
          upload_signature: string
          user_metadata?: Json | null
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          id?: string
          in_progress_size?: number
          key?: string
          owner_id?: string | null
          upload_signature?: string
          user_metadata?: Json | null
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads_parts: {
        Row: {
          bucket_id: string
          created_at: string
          etag: string
          id: string
          key: string
          owner_id: string | null
          part_number: number
          size: number
          upload_id: string
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          etag: string
          id?: string
          key: string
          owner_id?: string | null
          part_number: number
          size?: number
          upload_id: string
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          etag?: string
          id?: string
          key?: string
          owner_id?: string | null
          part_number?: number
          size?: number
          upload_id?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_parts_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "s3_multipart_uploads_parts_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: false
            referencedRelation: "s3_multipart_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_prefixes: {
        Args: { _bucket_id: string; _name: string }
        Returns: undefined
      }
      can_insert_object: {
        Args: { bucketid: string; metadata: Json; name: string; owner: string }
        Returns: undefined
      }
      delete_prefix: {
        Args: { _bucket_id: string; _name: string }
        Returns: boolean
      }
      extension: {
        Args: { name: string }
        Returns: string
      }
      filename: {
        Args: { name: string }
        Returns: string
      }
      foldername: {
        Args: { name: string }
        Returns: string[]
      }
      get_level: {
        Args: { name: string }
        Returns: number
      }
      get_prefix: {
        Args: { name: string }
        Returns: string
      }
      get_prefixes: {
        Args: { name: string }
        Returns: string[]
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          bucket_id: string
          size: number
        }[]
      }
      list_multipart_uploads_with_delimiter: {
        Args: {
          bucket_id: string
          delimiter_param: string
          max_keys?: number
          next_key_token?: string
          next_upload_token?: string
          prefix_param: string
        }
        Returns: {
          created_at: string
          id: string
          key: string
        }[]
      }
      list_objects_with_delimiter: {
        Args: {
          bucket_id: string
          delimiter_param: string
          max_keys?: number
          next_token?: string
          prefix_param: string
          start_after?: string
        }
        Returns: {
          id: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
      operation: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      search: {
        Args: {
          bucketname: string
          levels?: number
          limits?: number
          offsets?: number
          prefix: string
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          created_at: string
          id: string
          last_accessed_at: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
      search_legacy_v1: {
        Args: {
          bucketname: string
          levels?: number
          limits?: number
          offsets?: number
          prefix: string
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          created_at: string
          id: string
          last_accessed_at: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
      search_v1_optimised: {
        Args: {
          bucketname: string
          levels?: number
          limits?: number
          offsets?: number
          prefix: string
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          created_at: string
          id: string
          last_accessed_at: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
      search_v2: {
        Args: {
          bucket_name: string
          levels?: number
          limits?: number
          prefix: string
          start_after?: string
        }
        Returns: {
          created_at: string
          id: string
          key: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
    }
    Enums: {
      buckettype: "STANDARD" | "ANALYTICS"
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
      location_type: ["county", "city"],
      outbound_channel: [
        "sms",
        "voicemail",
        "phone",
        "email",
        "postcard",
        "handwritten",
      ],
      pricing_plan_interval: ["day", "week", "month", "year"],
      pricing_type: ["one_time", "recurring"],
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
      user_role: ["investor", "wholesaler", "broker", "admin"],
    },
  },
  storage: {
    Enums: {
      buckettype: ["STANDARD", "ANALYTICS"],
    },
  },
} as const

