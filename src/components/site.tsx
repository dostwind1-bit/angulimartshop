import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Menu, X, MessageCircle, ArrowUpRight, MapPin, BadgeCheck, Home, ShoppingBag, Store, Newspaper, Gift } from "lucide-react";
import logo from "@/assets/angulimart-logo.png";
import { SITE, whatsappLink, formatPrice, discountPercent } from "@/lib/site";
import { settingsQuery, trackOutboundClick, type Product, type Business, type Article } from "@/lib/data";

export function useSettings() {
  const { data } = useQuery(settingsQuery);
  return {
    whatsapp: data?.whatsapp_number ?? SITE.whatsapp,
    owner: data?.owner_name ?? SITE.owner,
    location: data?.location ?? SITE.location,
    disclosure: data?.affiliate_disclosure ?? SITE.affiliateDisclosure,
    tagline: data?.tagline ?? SITE.tagline,
  };
}

const NAV = [
  { to: "/products", label: "Products" },
  { to: "/businesses", label: "Businesses" },
  { to: "/articles", label: "Articles" },
  { to: "/about", label: "About" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="shell flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2.5">
          <img src={logo} alt="AnguliMart logo" className="h-9 w-9 rounded-xl" />
          <span className="font-display text-lg font-bold tracking-tight text-foreground">
            Anguli<span className="text-gradient-brand">Mart</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground" activeProps={{ className: "text-foreground bg-muted" }}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:block">
          <Link to="/promote" className="gradient-brand inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg transition hover:opacity-90">
            Promote With Us <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="shell flex flex-col gap-1 py-3">
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 font-medium">
                {n.label}
              </Link>
            ))}
            <Link to="/promote" onClick={() => setOpen(false)} className="gradient-brand mt-2 rounded-full px-5 py-3 text-center font-semibold text-primary-foreground">
              Promote With Us
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  const s = useSettings();
  return (
    <footer className="mt-24 bg-navy-deep text-navy-foreground">
      <div className="shell grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5">
            <img src={logo} alt="" className="h-10 w-10 rounded-xl" />
            <span className="font-display text-xl font-bold">AnguliMart</span>
          </div>
          <p className="mt-3 text-sm opacity-70">{s.tagline}</p>
          <p className="mt-4 max-w-md text-sm opacity-60">{s.disclosure}</p>
        </div>
        <div className="space-y-2 text-sm">
          <p className="font-semibold">Explore</p>
          <Link to="/products" className="block opacity-70 hover:opacity-100">Products</Link>
          <Link to="/businesses" className="block opacity-70 hover:opacity-100">Businesses</Link>
          <Link to="/articles" className="block opacity-70 hover:opacity-100">Articles</Link>
          <Link to="/promote" className="block opacity-70 hover:opacity-100">Promote With Us</Link>
        </div>
        <div className="space-y-2 text-sm">
          <p className="font-semibold">Company</p>
          <Link to="/about" className="block opacity-70 hover:opacity-100">About</Link>
          <Link to="/contact" className="block opacity-70 hover:opacity-100">Contact</Link>
          <Link to="/privacy" className="block opacity-70 hover:opacity-100">Privacy & Disclosure</Link>
          <p className="flex items-center gap-1.5 pt-2 opacity-70"><MapPin className="h-4 w-4" />{s.location}</p>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs opacity-50">
        © {new Date().getFullYear()} AnguliMart.shop · Run by {s.owner}
      </div>
    </footer>
  );
}

export function WhatsAppButton({ message, label = "Chat on WhatsApp", className = "" }: { message: string; label?: string; className?: string }) {
  const s = useSettings();
  return (
    <a href={whatsappLink(message, s.whatsapp)} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center justify-center gap-2 rounded-full bg-whatsapp px-5 py-3 font-semibold text-whatsapp-foreground shadow-lg transition hover:opacity-90 ${className}`}>
      <MessageCircle className="h-5 w-5" /> {label}
    </a>
  );
}

export function WhatsAppFab() {
  const s = useSettings();
  return (
    <a href={whatsappLink("Hi AnguliMart! I'd like to know more.", s.whatsapp)} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp" className="fixed bottom-20 right-4 z-50 grid h-14 w-14 place-items-center rounded-full bg-whatsapp text-whatsapp-foreground shadow-2xl transition hover:scale-105 md:bottom-5 md:right-5">
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}

const TABS = [
  { to: "/", label: "Home", icon: Home },
  { to: "/products", label: "Products", icon: ShoppingBag },
  { to: "/businesses", label: "Business", icon: Store },
  { to: "/articles", label: "Articles", icon: Newspaper },
  { to: "/refer", label: "Refer", icon: Gift },
] as const;

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden">
      <div className="grid grid-cols-5">
        {TABS.map((t) => (
          <Link key={t.to} to={t.to} activeOptions={{ exact: t.to === "/" }} className="group flex flex-col items-center gap-0.5 py-1.5 text-[11px] font-medium text-muted-foreground" activeProps={{ className: "text-primary" }}>
            <span className="grid h-8 w-14 place-items-center rounded-full transition group-data-[status=active]:bg-primary/10">
              <t.icon className="h-5 w-5" />
            </span>
            {t.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

export function BuyButton({ p, className = "" }: { p: Product; className?: string }) {
  if (!p.affiliate_url) return null;
  return (
    <a
      href={p.affiliate_url}
      target="_blank"
      rel="nofollow sponsored noopener noreferrer"
      onClick={() => void trackOutboundClick({ target_type: "product", target_id: p.id, target_label: p.name, url: p.affiliate_url })}
      className={`gradient-brand inline-flex items-center justify-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 ${className}`}
    >
      {p.cta_label || "Buy Now"} <ArrowUpRight className="h-4 w-4" />
    </a>
  );
}

function Img({ src, alt, className }: { src: string | null; alt: string; className?: string }) {
  if (!src) return <div className={`gradient-tile ${className}`} />;
  return <img src={src} alt={alt} loading="lazy" className={`object-cover ${className}`} />;
}

export function ProductCard({ p }: { p: Product }) {
  const off = discountPercent(p.price, p.original_price);
  return (
    <div className="surface-card surface-card-hover group flex flex-col overflow-hidden">
      <Link to="/products/$slug" params={{ slug: p.slug }} className="relative block aspect-[4/3] overflow-hidden bg-muted">
        <Img src={p.image_url} alt={p.name} className="h-full w-full transition duration-500 group-hover:scale-105" />
        {off && <span className="absolute left-3 top-3 rounded-full bg-success px-2.5 py-1 text-xs font-bold text-success-foreground">{off}% OFF</span>}
        {p.is_trending && <span className="absolute right-3 top-3 rounded-full bg-navy/90 px-2.5 py-1 text-xs font-semibold text-navy-foreground">Trending</span>}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        {p.merchant && <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{p.merchant}</p>}
        <Link to="/products/$slug" params={{ slug: p.slug }} className="mt-1 font-display text-base font-semibold leading-snug text-foreground hover:text-primary">{p.name}</Link>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-bold text-foreground">{formatPrice(p.price)}</span>
          {off && <span className="text-sm text-muted-foreground line-through">{formatPrice(p.original_price)}</span>}
        </div>
        <div className="mt-auto pt-4"><BuyButton p={p} className="w-full" /></div>
      </div>
    </div>
  );
}

export function BusinessCard({ b }: { b: Business }) {
  return (
    <Link to="/businesses/$slug" params={{ slug: b.slug }} className="surface-card surface-card-hover group block overflow-hidden">
      <div className="aspect-[16/9] overflow-hidden bg-muted">
        <Img src={b.cover_url ?? b.logo_url} alt={b.name} className="h-full w-full transition duration-500 group-hover:scale-105" />
      </div>
      <div className="p-5">
        <div className="flex items-center gap-1.5">
          <h3 className="font-display font-semibold text-foreground">{b.name}</h3>
          {b.is_featured && <BadgeCheck className="h-4 w-4 text-primary" />}
        </div>
        {b.tagline && <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{b.tagline}</p>}
        {b.offer_text && <p className="mt-3 inline-block rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">{b.offer_text}</p>}
        {b.city && <p className="mt-3 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3.5 w-3.5" />{b.city}</p>}
      </div>
    </Link>
  );
}

export function ArticleCard({ a }: { a: Article }) {
  return (
    <Link to="/articles/$slug" params={{ slug: a.slug }} className="surface-card surface-card-hover group block overflow-hidden">
      <div className="aspect-[16/9] overflow-hidden bg-muted">
        <Img src={a.image_url} alt={a.title} className="h-full w-full transition duration-500 group-hover:scale-105" />
      </div>
      <div className="p-5">
        {a.is_sponsored && <span className="text-xs font-semibold uppercase tracking-wider text-violet">Sponsored</span>}
        <h3 className="mt-1 font-display font-semibold leading-snug text-foreground group-hover:text-primary">{a.title}</h3>
        {a.excerpt && <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{a.excerpt}</p>}
        <p className="mt-3 text-xs text-muted-foreground">By {a.author}{a.published_at ? ` · ${new Date(a.published_at).toLocaleDateString("en-IN", { dateStyle: "medium" })}` : ""}</p>
      </div>
    </Link>
  );
}

export function PageHero({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string | undefined }) {
  return (
    <section className="gradient-hero text-navy-foreground">
      <div className="shell py-16 md:py-20">
        {eyebrow && <p className="text-sm font-semibold uppercase tracking-widest opacity-70">{eyebrow}</p>}
        <h1 className="mt-2 max-w-3xl font-display text-4xl font-bold tracking-tight md:text-5xl">{title}</h1>
        {subtitle && <p className="mt-4 max-w-2xl text-lg opacity-75">{subtitle}</p>}
      </div>
    </section>
  );
}

export function SectionTitle({ title, subtitle, action }: { title: string; subtitle?: string | undefined; action?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 className="font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl">{title}</h2>
        {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Empty({ text }: { text: string }) {
  return <div className="surface-card p-10 text-center text-muted-foreground">{text}</div>;
}
