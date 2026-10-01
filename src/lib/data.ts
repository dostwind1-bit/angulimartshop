import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Category = {
  id: string;
  slug: string;
  name: string;
  icon: string | null;
  description: string | null;
  sort_order: number;
  is_active: boolean;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category_id: string | null;
  summary: string | null;
  description: string | null;
  pros: string[];
  cons: string[];
  image_url: string | null;
  price: number | null;
  original_price: number | null;
  merchant: string | null;
  affiliate_url: string | null;
  cta_label: string;
  is_featured: boolean;
  is_trending: boolean;
  is_new_launch: boolean;
  status: string;
  views: number;
  clicks: number;
  created_at: string;
};

export type Business = {
  id: string;
  slug: string;
  name: string;
  category_id: string | null;
  tagline: string | null;
  description: string | null;
  logo_url: string | null;
  cover_url: string | null;
  city: string | null;
  website: string | null;
  instagram: string | null;
  whatsapp: string | null;
  offer_text: string | null;
  valid_until: string | null;
  status: string;
  is_featured: boolean;
  created_at: string;
};

export type Article = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  image_url: string | null;
  author: string;
  category_id: string | null;
  tags: string[];
  seo_title: string | null;
  meta_description: string | null;
  is_sponsored: boolean;
  is_featured: boolean;
  status: string;
  published_at: string | null;
  created_at: string;
};

export type SiteSettings = {
  site_name: string;
  tagline: string;
  whatsapp_number: string;
  owner_name: string;
  location: string;
  affiliate_disclosure: string;
};

export const categoriesQuery = queryOptions({
  queryKey: ["categories"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("sort_order");
    if (error) throw error;
    return (data ?? []) as Category[];
  },
});

export const settingsQuery = queryOptions({
  queryKey: ["site-settings"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("site_settings")
      .select("site_name, tagline, whatsapp_number, owner_name, location, affiliate_disclosure")
      .maybeSingle();
    if (error) throw error;
    return (data ?? null) as SiteSettings | null;
  },
});

export const productsQuery = (limit = 24) =>
  queryOptions({
    queryKey: ["products", limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("status", "published")
        .order("is_featured", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(limit);
      if (error) throw error;
      return (data ?? []) as unknown as Product[];
    },
  });

export const productQuery = (slug: string) =>
  queryOptions({
    queryKey: ["product", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return (data ?? null) as unknown as Product | null;
    },
  });

export const businessesQuery = (limit = 24) =>
  queryOptions({
    queryKey: ["businesses", limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("businesses")
        .select("*")
        .eq("status", "published")
        .order("is_featured", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(limit);
      if (error) throw error;
      return (data ?? []) as unknown as Business[];
    },
  });

export const businessQuery = (slug: string) =>
  queryOptions({
    queryKey: ["business", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("businesses")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return (data ?? null) as unknown as Business | null;
    },
  });

export const articlesQuery = (limit = 24) =>
  queryOptions({
    queryKey: ["articles", limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(limit);
      if (error) throw error;
      return (data ?? []) as unknown as Article[];
    },
  });

export const articleQuery = (slug: string) =>
  queryOptions({
    queryKey: ["article", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return (data ?? null) as unknown as Article | null;
    },
  });

export async function trackOutboundClick(input: {
  target_type: string;
  target_id?: string | null;
  target_label?: string | null;
  url?: string | null;
}) {
  try {
    await supabase.from("outbound_clicks").insert({
      target_type: input.target_type,
      target_id: input.target_id ?? null,
      target_label: input.target_label ?? null,
      url: input.url ?? null,
      page_url: typeof window !== "undefined" ? window.location.href : null,
    });
  } catch {
    /* click tracking must never block navigation */
  }
}
