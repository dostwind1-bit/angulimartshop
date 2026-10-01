-- ROLES ---------------------------------------------------------------
create type public.app_role as enum ('admin','editor','user');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  created_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "own profile read" on public.profiles for select to authenticated using (auth.uid() = id);
create policy "own profile update" on public.profiles for update to authenticated using (auth.uid() = id);

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "read own roles" on public.user_roles for select to authenticated using (auth.uid() = user_id);
create policy "admins manage roles" on public.user_roles for all to authenticated using (public.has_role(auth.uid(),'admin'));

-- first user becomes admin, everyone gets a profile
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name',''))
  on conflict (id) do nothing;

  if not exists (select 1 from public.user_roles where role = 'admin') then
    insert into public.user_roles (user_id, role) values (new.id, 'admin');
  else
    insert into public.user_roles (user_id, role) values (new.id, 'user') on conflict do nothing;
  end if;
  return new;
end;
$$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

-- SETTINGS ------------------------------------------------------------
create table public.site_settings (
  id boolean primary key default true check (id),
  site_name text not null default 'AnguliMart',
  tagline text not null default 'Promote • Discover • Grow',
  whatsapp_number text not null default '918957629511',
  owner_name text not null default 'Ankit Maurya',
  location text not null default 'Lucknow, Uttar Pradesh, India',
  affiliate_disclosure text not null default 'Some links on AnguliMart may be affiliate links. We may earn a commission when eligible purchases are made through these links, at no additional cost to you.',
  updated_at timestamptz not null default now()
);
grant select on public.site_settings to anon, authenticated;
grant all on public.site_settings to service_role;
grant insert, update on public.site_settings to authenticated;
alter table public.site_settings enable row level security;
create policy "settings public read" on public.site_settings for select to anon, authenticated using (true);
create policy "settings admin write" on public.site_settings for all to authenticated using (public.has_role(auth.uid(),'admin'));
insert into public.site_settings (id) values (true);

-- CATEGORIES ----------------------------------------------------------
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  icon text,
  description text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
grant select on public.categories to anon, authenticated;
grant insert, update, delete on public.categories to authenticated;
grant all on public.categories to service_role;
alter table public.categories enable row level security;
create policy "categories public read" on public.categories for select to anon, authenticated using (is_active or public.has_role(auth.uid(),'admin'));
create policy "categories admin write" on public.categories for all to authenticated using (public.has_role(auth.uid(),'admin'));

-- BUSINESSES ----------------------------------------------------------
create table public.businesses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category_id uuid references public.categories(id) on delete set null,
  tagline text,
  description text,
  logo_url text,
  cover_url text,
  gallery jsonb not null default '[]'::jsonb,
  city text,
  website text,
  instagram text,
  whatsapp text,
  offer_text text,
  valid_until date,
  status text not null default 'pending' check (status in ('pending','approved','published','unpublished','rejected')),
  is_featured boolean not null default false,
  views int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger businesses_touch before update on public.businesses for each row execute function public.touch_updated_at();
grant select on public.businesses to anon, authenticated;
grant insert, update, delete on public.businesses to authenticated;
grant all on public.businesses to service_role;
alter table public.businesses enable row level security;
create policy "businesses public read" on public.businesses for select to anon, authenticated using (status = 'published' or public.has_role(auth.uid(),'admin'));
create policy "businesses admin write" on public.businesses for all to authenticated using (public.has_role(auth.uid(),'admin'));

-- PRODUCTS ------------------------------------------------------------
create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category_id uuid references public.categories(id) on delete set null,
  business_id uuid references public.businesses(id) on delete set null,
  summary text,
  description text,
  pros text[] not null default '{}',
  cons text[] not null default '{}',
  image_url text,
  gallery jsonb not null default '[]'::jsonb,
  price numeric(12,2),
  original_price numeric(12,2),
  currency text not null default 'INR',
  merchant text,
  affiliate_url text,
  cta_label text not null default 'Buy Now',
  is_affiliate boolean not null default true,
  is_featured boolean not null default false,
  is_trending boolean not null default false,
  is_new_launch boolean not null default false,
  status text not null default 'published' check (status in ('draft','published','unpublished')),
  views int not null default 0,
  clicks int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger products_touch before update on public.products for each row execute function public.touch_updated_at();
grant select on public.products to anon, authenticated;
grant insert, update, delete on public.products to authenticated;
grant all on public.products to service_role;
alter table public.products enable row level security;
create policy "products public read" on public.products for select to anon, authenticated using (status = 'published' or public.has_role(auth.uid(),'admin'));
create policy "products admin write" on public.products for all to authenticated using (public.has_role(auth.uid(),'admin'));

-- ARTICLES ------------------------------------------------------------
create table public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text,
  content text,
  image_url text,
  author text not null default 'Ankit Maurya',
  category_id uuid references public.categories(id) on delete set null,
  tags text[] not null default '{}',
  seo_title text,
  meta_description text,
  is_sponsored boolean not null default false,
  is_featured boolean not null default false,
  status text not null default 'draft' check (status in ('draft','published','unpublished')),
  published_at timestamptz,
  views int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger articles_touch before update on public.articles for each row execute function public.touch_updated_at();
grant select on public.articles to anon, authenticated;
grant insert, update, delete on public.articles to authenticated;
grant all on public.articles to service_role;
alter table public.articles enable row level security;
create policy "articles public read" on public.articles for select to anon, authenticated using (status = 'published' or public.has_role(auth.uid(),'admin'));
create policy "articles admin write" on public.articles for all to authenticated using (public.has_role(auth.uid(),'admin'));

-- PROMOTIONS ----------------------------------------------------------
create table public.promotions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  promotion_type text not null default 'business' check (promotion_type in ('business','product','article','banner','featured')),
  contact_name text,
  business_name text,
  whatsapp text,
  email text,
  city text,
  category_id uuid references public.categories(id) on delete set null,
  website text,
  notes text,
  image_url text,
  target_url text,
  amount numeric(12,2),
  payment_status text not null default 'payment_pending' check (payment_status in ('payment_pending','paid','waived','refunded')),
  status text not null default 'pending' check (status in ('pending','approved','published','expired','rejected','unpublished')),
  is_featured boolean not null default false,
  start_date date,
  expiry_date date,
  clicks int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger promotions_touch before update on public.promotions for each row execute function public.touch_updated_at();
grant select on public.promotions to anon, authenticated;
grant insert, update, delete on public.promotions to authenticated;
grant all on public.promotions to service_role;
alter table public.promotions enable row level security;
create policy "promotions public read" on public.promotions for select to anon, authenticated using (status = 'published' or public.has_role(auth.uid(),'admin'));
create policy "promotions admin write" on public.promotions for all to authenticated using (public.has_role(auth.uid(),'admin'));

-- BANNERS -------------------------------------------------------------
create table public.banners (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  image_url text,
  destination_url text,
  placement text not null default 'home_top',
  start_date date,
  expiry_date date,
  is_active boolean not null default true,
  clicks int not null default 0,
  created_at timestamptz not null default now()
);
grant select on public.banners to anon, authenticated;
grant insert, update, delete on public.banners to authenticated;
grant all on public.banners to service_role;
alter table public.banners enable row level security;
create policy "banners public read" on public.banners for select to anon, authenticated using (is_active or public.has_role(auth.uid(),'admin'));
create policy "banners admin write" on public.banners for all to authenticated using (public.has_role(auth.uid(),'admin'));

-- LEADS ---------------------------------------------------------------
create table public.leads (
  id uuid primary key default gen_random_uuid(),
  ref text not null default upper(substr(replace(gen_random_uuid()::text,'-',''),1,8)),
  form_name text not null,
  name text not null,
  business_name text,
  email text,
  whatsapp text not null,
  city text,
  promotion_type text,
  category text,
  website text,
  message text,
  page_url text,
  source text,
  referrer text,
  utm jsonb not null default '{}'::jsonb,
  status text not null default 'new' check (status in ('new','contacted','converted','closed')),
  created_at timestamptz not null default now()
);
grant insert on public.leads to anon, authenticated;
grant select, update, delete on public.leads to authenticated;
grant all on public.leads to service_role;
alter table public.leads enable row level security;
create policy "leads public insert" on public.leads for insert to anon, authenticated with check (true);
create policy "leads admin read" on public.leads for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "leads admin write" on public.leads for all to authenticated using (public.has_role(auth.uid(),'admin'));

-- OUTBOUND CLICKS -----------------------------------------------------
create table public.outbound_clicks (
  id uuid primary key default gen_random_uuid(),
  target_type text not null,
  target_id uuid,
  target_label text,
  url text,
  page_url text,
  created_at timestamptz not null default now()
);
grant insert on public.outbound_clicks to anon, authenticated;
grant select, delete on public.outbound_clicks to authenticated;
grant all on public.outbound_clicks to service_role;
alter table public.outbound_clicks enable row level security;
create policy "clicks public insert" on public.outbound_clicks for insert to anon, authenticated with check (true);
create policy "clicks admin read" on public.outbound_clicks for select to authenticated using (public.has_role(auth.uid(),'admin'));

create index on public.products (status, is_featured);
create index on public.articles (status, published_at desc);
create index on public.leads (created_at desc);
