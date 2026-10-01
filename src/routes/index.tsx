import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, useQuery } from "@tanstack/react-query";
import { ArrowRight, Megaphone, Search, TrendingUp, Store, ShoppingBag, FileText, Flame, Newspaper, Rocket, Briefcase, Gift, Star, Sparkles } from "lucide-react";

const CATEGORY_ICONS: Record<string, typeof Store> = {
  "business-promotion": Store,
  "product-promotion": ShoppingBag,
  "deals-offers": Flame,
  "sponsored-articles": Newspaper,
  "new-launches": Rocket,
  services: Briefcase,
  "featured-products": Gift,
  trending: Star,
};
import hero from "@/assets/hero-bg.jpg";
import { categoriesQuery, productsQuery, businessesQuery, articlesQuery } from "@/lib/data";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard, BusinessCard, ArticleCard, SectionTitle, WhatsAppButton } from "@/components/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AnguliMart — Discover. Promote. Grow." },
      { name: "description", content: "Discover trending products, top deals and trusted local businesses. Promote your brand with AnguliMart, Lucknow." },
      { property: "og:title", content: "AnguliMart — Discover. Promote. Grow." },
      { property: "og:description", content: "Discover products & deals, and promote your business with AnguliMart." },
    ],
  }),
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(categoriesQuery),
      context.queryClient.ensureQueryData(productsQuery(8)),
      context.queryClient.ensureQueryData(businessesQuery(4)),
      context.queryClient.ensureQueryData(articlesQuery(3)),
    ]),
  component: Home,
});

function Home() {
  const { data: cats } = useSuspenseQuery(categoriesQuery);
  const { data: products } = useSuspenseQuery(productsQuery(8));
  const { data: businesses } = useSuspenseQuery(businessesQuery(4));
  const { data: articles } = useSuspenseQuery(articlesQuery(3));
  const { data: banner } = useQuery({
    queryKey: ["banner", "home_top"],
    queryFn: async () => (await supabase.from("banners").select("*").eq("placement", "home_top").eq("is_active", true).limit(1).maybeSingle()).data,
  });

  return (
    <>
      <section className="relative overflow-hidden bg-navy-deep text-navy-foreground">
        <img src={hero} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
        <div className="gradient-hero absolute inset-0 opacity-80" />
        <div className="shell relative py-24 md:py-32">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm backdrop-blur">
            <TrendingUp className="h-4 w-4" /> Lucknow's growth platform for brands & shoppers
          </p>
          <h1 className="mt-6 max-w-4xl font-display text-5xl font-extrabold leading-[1.05] tracking-tight md:text-7xl">
            Discover. Promote. <span className="text-gradient-brand">Grow.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg opacity-80 md:text-xl">
            Find trending products, honest reviews and the best deals — and put your business in front of thousands of buyers.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link to="/products" className="inline-flex items-center gap-2 rounded-full bg-background px-6 py-3.5 font-semibold text-foreground transition hover:opacity-90">
              <Search className="h-5 w-5" /> Explore Products
            </Link>
            <Link to="/promote" className="gradient-brand inline-flex items-center gap-2 rounded-full px-6 py-3.5 font-semibold text-primary-foreground shadow-xl transition hover:opacity-90">
              <Megaphone className="h-5 w-5" /> Promote Your Business
            </Link>
          </div>
        </div>
      </section>

      <section className="shell -mt-10 relative z-10">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {cats.slice(0, 8).map((c) => {
            const Icon = CATEGORY_ICONS[c.slug] ?? Sparkles;
            return (
              <Link key={c.id} to="/category/$slug" params={{ slug: c.slug }} className="surface-card surface-card-hover flex items-center gap-3 p-4">
                <span className="gradient-tile grid h-11 w-11 shrink-0 place-items-center rounded-xl"><Icon className="h-5 w-5 text-primary-foreground" /></span>
                <span className="text-sm font-semibold text-foreground">{c.name}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {banner?.image_url && (
        <section className="shell mt-16">
          <a href={banner.destination_url ?? "#"} target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-3xl">
            <img src={banner.image_url} alt={banner.title} className="h-48 w-full object-cover md:h-64" />
          </a>
        </section>
      )}

      <section className="shell mt-20">
        <SectionTitle title="Featured Products" subtitle="Hand-picked picks and deals worth your money." action={<Link to="/products" className="inline-flex items-center gap-1 text-sm font-semibold text-primary">View all <ArrowRight className="h-4 w-4" /></Link>} />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </section>

      <section className="shell mt-24">
        <div className="gradient-hero grid gap-10 overflow-hidden rounded-3xl p-10 text-navy-foreground md:grid-cols-3 md:p-14">
          {[
            { icon: Store, t: "Business Promotion", d: "Get a premium profile, featured placement and WhatsApp leads." },
            { icon: ShoppingBag, t: "Product Promotion", d: "Showcase your products to buyers actively looking to purchase." },
            { icon: FileText, t: "Sponsored Articles", d: "Tell your story with SEO-friendly articles that rank." },
          ].map(({ icon: I, t, d }) => (
            <div key={t}>
              <I className="h-8 w-8 opacity-90" />
              <h3 className="mt-4 font-display text-xl font-semibold">{t}</h3>
              <p className="mt-2 opacity-75">{d}</p>
            </div>
          ))}
          <div className="md:col-span-3 flex flex-wrap gap-3">
            <Link to="/promote" className="rounded-full bg-background px-6 py-3 font-semibold text-foreground">Get Started</Link>
            <WhatsAppButton message="Hi AnguliMart! I want to promote my business." label="Ask on WhatsApp" />
          </div>
        </div>
      </section>

      <section className="shell mt-24">
        <SectionTitle title="Featured Businesses" subtitle="Trusted local brands growing with AnguliMart." action={<Link to="/businesses" className="inline-flex items-center gap-1 text-sm font-semibold text-primary">View all <ArrowRight className="h-4 w-4" /></Link>} />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {businesses.map((b) => <BusinessCard key={b.id} b={b} />)}
        </div>
      </section>

      <section className="shell mt-24">
        <SectionTitle title="Latest Articles" subtitle="Buying guides, reviews and growth tips." action={<Link to="/articles" className="inline-flex items-center gap-1 text-sm font-semibold text-primary">Read more <ArrowRight className="h-4 w-4" /></Link>} />
        <div className="grid gap-6 md:grid-cols-3">
          {articles.map((a) => <ArticleCard key={a.id} a={a} />)}
        </div>
      </section>
    </>
  );
}
