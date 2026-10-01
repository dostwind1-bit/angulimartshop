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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      articles: {
        Row: {
          author: string
          category_id: string | null
          content: string | null
          created_at: string
          excerpt: string | null
          id: string
          image_url: string | null
          is_featured: boolean
          is_sponsored: boolean
          meta_description: string | null
          published_at: string | null
          seo_title: string | null
          slug: string
          status: string
          tags: string[]
          title: string
          updated_at: string
          views: number
        }
        Insert: {
          author?: string
          category_id?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean
          is_sponsored?: boolean
          meta_description?: string | null
          published_at?: string | null
          seo_title?: string | null
          slug: string
          status?: string
          tags?: string[]
          title: string
          updated_at?: string
          views?: number
        }
        Update: {
          author?: string
          category_id?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean
          is_sponsored?: boolean
          meta_description?: string | null
          published_at?: string | null
          seo_title?: string | null
          slug?: string
          status?: string
          tags?: string[]
          title?: string
          updated_at?: string
          views?: number
        }
        Relationships: [
          {
            foreignKeyName: "articles_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      banners: {
        Row: {
          button_label: string
          clicks: number
          created_at: string
          destination_url: string | null
          expiry_date: string | null
          id: string
          image_url: string | null
          is_active: boolean
          placement: string
          start_date: string | null
          subtitle: string | null
          title: string
        }
        Insert: {
          button_label?: string
          clicks?: number
          created_at?: string
          destination_url?: string | null
          expiry_date?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          placement?: string
          start_date?: string | null
          subtitle?: string | null
          title: string
        }
        Update: {
          button_label?: string
          clicks?: number
          created_at?: string
          destination_url?: string | null
          expiry_date?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          placement?: string
          start_date?: string | null
          subtitle?: string | null
          title?: string
        }
        Relationships: []
      }
      brands: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          logo_url: string | null
          name: string
          slug: string
          sort_order: number
          website: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name: string
          slug: string
          sort_order?: number
          website?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name?: string
          slug?: string
          sort_order?: number
          website?: string | null
        }
        Relationships: []
      }
      businesses: {
        Row: {
          category_id: string | null
          city: string | null
          cover_url: string | null
          created_at: string
          description: string | null
          gallery: Json
          id: string
          instagram: string | null
          is_featured: boolean
          logo_url: string | null
          name: string
          offer_text: string | null
          slug: string
          status: string
          tagline: string | null
          updated_at: string
          valid_until: string | null
          views: number
          website: string | null
          whatsapp: string | null
        }
        Insert: {
          category_id?: string | null
          city?: string | null
          cover_url?: string | null
          created_at?: string
          description?: string | null
          gallery?: Json
          id?: string
          instagram?: string | null
          is_featured?: boolean
          logo_url?: string | null
          name: string
          offer_text?: string | null
          slug: string
          status?: string
          tagline?: string | null
          updated_at?: string
          valid_until?: string | null
          views?: number
          website?: string | null
          whatsapp?: string | null
        }
        Update: {
          category_id?: string | null
          city?: string | null
          cover_url?: string | null
          created_at?: string
          description?: string | null
          gallery?: Json
          id?: string
          instagram?: string | null
          is_featured?: boolean
          logo_url?: string | null
          name?: string
          offer_text?: string | null
          slug?: string
          status?: string
          tagline?: string | null
          updated_at?: string
          valid_until?: string | null
          views?: number
          website?: string | null
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "businesses_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          is_active: boolean
          name: string
          slug: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name: string
          slug: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      leads: {
        Row: {
          business_name: string | null
          category: string | null
          city: string | null
          created_at: string
          email: string | null
          form_name: string
          id: string
          message: string | null
          name: string
          page_url: string | null
          promotion_type: string | null
          ref: string
          referrer: string | null
          source: string | null
          status: string
          utm: Json
          website: string | null
          whatsapp: string
        }
        Insert: {
          business_name?: string | null
          category?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          form_name: string
          id?: string
          message?: string | null
          name: string
          page_url?: string | null
          promotion_type?: string | null
          ref?: string
          referrer?: string | null
          source?: string | null
          status?: string
          utm?: Json
          website?: string | null
          whatsapp: string
        }
        Update: {
          business_name?: string | null
          category?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          form_name?: string
          id?: string
          message?: string | null
          name?: string
          page_url?: string | null
          promotion_type?: string | null
          ref?: string
          referrer?: string | null
          source?: string | null
          status?: string
          utm?: Json
          website?: string | null
          whatsapp?: string
        }
        Relationships: []
      }
      outbound_clicks: {
        Row: {
          created_at: string
          id: string
          page_url: string | null
          target_id: string | null
          target_label: string | null
          target_type: string
          url: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          page_url?: string | null
          target_id?: string | null
          target_label?: string | null
          target_type: string
          url?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          page_url?: string | null
          target_id?: string | null
          target_label?: string | null
          target_type?: string
          url?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          affiliate_url: string | null
          brand_id: string | null
          business_id: string | null
          category_id: string | null
          clicks: number
          cons: string[]
          created_at: string
          cta_label: string
          currency: string
          description: string | null
          gallery: Json
          id: string
          image_url: string | null
          is_affiliate: boolean
          is_featured: boolean
          is_new_launch: boolean
          is_trending: boolean
          merchant: string | null
          name: string
          original_price: number | null
          price: number | null
          pros: string[]
          slug: string
          status: string
          summary: string | null
          updated_at: string
          views: number
        }
        Insert: {
          affiliate_url?: string | null
          brand_id?: string | null
          business_id?: string | null
          category_id?: string | null
          clicks?: number
          cons?: string[]
          created_at?: string
          cta_label?: string
          currency?: string
          description?: string | null
          gallery?: Json
          id?: string
          image_url?: string | null
          is_affiliate?: boolean
          is_featured?: boolean
          is_new_launch?: boolean
          is_trending?: boolean
          merchant?: string | null
          name: string
          original_price?: number | null
          price?: number | null
          pros?: string[]
          slug: string
          status?: string
          summary?: string | null
          updated_at?: string
          views?: number
        }
        Update: {
          affiliate_url?: string | null
          brand_id?: string | null
          business_id?: string | null
          category_id?: string | null
          clicks?: number
          cons?: string[]
          created_at?: string
          cta_label?: string
          currency?: string
          description?: string | null
          gallery?: Json
          id?: string
          image_url?: string | null
          is_affiliate?: boolean
          is_featured?: boolean
          is_new_launch?: boolean
          is_trending?: boolean
          merchant?: string | null
          name?: string
          original_price?: number | null
          price?: number | null
          pros?: string[]
          slug?: string
          status?: string
          summary?: string | null
          updated_at?: string
          views?: number
        }
        Relationships: [
          {
            foreignKeyName: "products_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          points: number
          referral_code: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          points?: number
          referral_code?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          points?: number
          referral_code?: string | null
        }
        Relationships: []
      }
      promotions: {
        Row: {
          amount: number | null
          business_name: string | null
          category_id: string | null
          city: string | null
          clicks: number
          contact_name: string | null
          created_at: string
          email: string | null
          expiry_date: string | null
          id: string
          image_url: string | null
          is_featured: boolean
          notes: string | null
          payment_status: string
          promotion_type: string
          start_date: string | null
          status: string
          target_url: string | null
          title: string
          updated_at: string
          website: string | null
          whatsapp: string | null
        }
        Insert: {
          amount?: number | null
          business_name?: string | null
          category_id?: string | null
          city?: string | null
          clicks?: number
          contact_name?: string | null
          created_at?: string
          email?: string | null
          expiry_date?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean
          notes?: string | null
          payment_status?: string
          promotion_type?: string
          start_date?: string | null
          status?: string
          target_url?: string | null
          title: string
          updated_at?: string
          website?: string | null
          whatsapp?: string | null
        }
        Update: {
          amount?: number | null
          business_name?: string | null
          category_id?: string | null
          city?: string | null
          clicks?: number
          contact_name?: string | null
          created_at?: string
          email?: string | null
          expiry_date?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean
          notes?: string | null
          payment_status?: string
          promotion_type?: string
          start_date?: string | null
          status?: string
          target_url?: string | null
          title?: string
          updated_at?: string
          website?: string | null
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "promotions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      referrals: {
        Row: {
          code: string
          created_at: string
          id: string
          points: number
          referred_id: string
          referrer_id: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          points?: number
          referred_id: string
          referrer_id: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          points?: number
          referred_id?: string
          referrer_id?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          affiliate_disclosure: string
          hero_badge: string
          hero_primary_label: string
          hero_primary_url: string
          hero_secondary_label: string
          hero_secondary_url: string
          hero_subtitle: string
          hero_title: string
          id: boolean
          location: string
          owner_name: string
          promo_button_label: string
          promo_button_url: string
          promo_subtitle: string
          promo_title: string
          show_deals: boolean
          show_featured: boolean
          show_promo: boolean
          show_trending: boolean
          site_name: string
          tagline: string
          updated_at: string
          whatsapp_number: string
        }
        Insert: {
          affiliate_disclosure?: string
          hero_badge?: string
          hero_primary_label?: string
          hero_primary_url?: string
          hero_secondary_label?: string
          hero_secondary_url?: string
          hero_subtitle?: string
          hero_title?: string
          id?: boolean
          location?: string
          owner_name?: string
          promo_button_label?: string
          promo_button_url?: string
          promo_subtitle?: string
          promo_title?: string
          show_deals?: boolean
          show_featured?: boolean
          show_promo?: boolean
          show_trending?: boolean
          site_name?: string
          tagline?: string
          updated_at?: string
          whatsapp_number?: string
        }
        Update: {
          affiliate_disclosure?: string
          hero_badge?: string
          hero_primary_label?: string
          hero_primary_url?: string
          hero_secondary_label?: string
          hero_secondary_url?: string
          hero_subtitle?: string
          hero_title?: string
          id?: boolean
          location?: string
          owner_name?: string
          promo_button_label?: string
          promo_button_url?: string
          promo_subtitle?: string
          promo_title?: string
          show_deals?: boolean
          show_featured?: boolean
          show_promo?: boolean
          show_trending?: boolean
          site_name?: string
          tagline?: string
          updated_at?: string
          whatsapp_number?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
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
      claim_referral: { Args: { _code: string }; Returns: Json }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "editor" | "user"
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
      app_role: ["admin", "editor", "user"],
    },
  },
} as const
