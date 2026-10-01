CREATE TABLE public.brands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  logo_url text,
  website text,
  description text,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.brands TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.brands TO authenticated;
GRANT ALL ON public.brands TO service_role;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
CREATE POLICY "brands public read" ON public.brands FOR SELECT TO anon, authenticated USING (is_active OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "brands admin write" ON public.brands FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

ALTER TABLE public.products ADD COLUMN brand_id uuid REFERENCES public.brands(id) ON DELETE SET NULL;
ALTER TABLE public.banners ADD COLUMN subtitle text, ADD COLUMN button_label text NOT NULL DEFAULT 'Learn more';

ALTER TABLE public.site_settings
  ADD COLUMN hero_title text NOT NULL DEFAULT 'Discover. Promote. Grow.',
  ADD COLUMN hero_subtitle text NOT NULL DEFAULT 'Find trending products, honest reviews and the best deals — and put your business in front of thousands of buyers.',
  ADD COLUMN hero_badge text NOT NULL DEFAULT 'Lucknow''s growth platform for brands & shoppers',
  ADD COLUMN hero_primary_label text NOT NULL DEFAULT 'Explore Products',
  ADD COLUMN hero_primary_url text NOT NULL DEFAULT '/products',
  ADD COLUMN hero_secondary_label text NOT NULL DEFAULT 'Promote Your Business',
  ADD COLUMN hero_secondary_url text NOT NULL DEFAULT '/promote',
  ADD COLUMN promo_title text NOT NULL DEFAULT 'Grow your business with AnguliMart',
  ADD COLUMN promo_subtitle text NOT NULL DEFAULT 'Business promotion, product promotion and sponsored articles.',
  ADD COLUMN promo_button_label text NOT NULL DEFAULT 'Get Started',
  ADD COLUMN promo_button_url text NOT NULL DEFAULT '/promote',
  ADD COLUMN show_featured boolean NOT NULL DEFAULT true,
  ADD COLUMN show_trending boolean NOT NULL DEFAULT true,
  ADD COLUMN show_deals boolean NOT NULL DEFAULT true,
  ADD COLUMN show_promo boolean NOT NULL DEFAULT true;