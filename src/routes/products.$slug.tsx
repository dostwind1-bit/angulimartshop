import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Check, X } from "lucide-react";
import { productQuery } from "@/lib/data";
import { formatPrice, discountPercent } from "@/lib/site";
import { BuyButton, WhatsAppButton, useSettings } from "@/components/site";

export const Route = createFileRoute("/products/$slug")({
  loader: async ({ context, params }) => ({ product: await context.queryClient.ensureQueryData(productQuery(params.slug)) }),
  head: ({ loaderData }) => {
    const p = loaderData?.product;
    if (!p) return { meta: [{ title: "Product not found — AnguliMart" }, { name: "robots", content: "noindex" }] };
    const d = p.summary ?? `${p.name} on AnguliMart`;
    return {
      meta: [
        { title: `${p.name} — AnguliMart` },
        { name: "description", content: d },
        { property: "og:title", content: p.name },
        { property: "og:description", content: d },
        { property: "og:type", content: "product" },
      ],
    };
  },
  component: Page,
});

function Page() {
  const { slug } = Route.useParams();
  const { data: p } = useSuspenseQuery(productQuery(slug));
  const s = useSettings();
  if (!p) return <div className="shell py-24 text-center"><h1 className="font-display text-2xl font-bold">Product not found</h1><Link to="/products" className="mt-4 inline-block text-primary">Back to products</Link></div>;
  const off = discountPercent(p.price, p.original_price);
  return (
    <div className="shell py-12">
      <Link to="/products" className="text-sm text-muted-foreground hover:text-foreground">← All products</Link>
      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="surface-card overflow-hidden">
          {p.image_url ? <img src={p.image_url} alt={p.name} className="aspect-square w-full object-cover" /> : <div className="gradient-tile aspect-square" />}
        </div>
        <div>
          {p.merchant && <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{p.merchant}</p>}
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">{p.name}</h1>
          {p.summary && <p className="mt-4 text-lg text-muted-foreground">{p.summary}</p>}
          <div className="mt-6 flex items-baseline gap-3">
            <span className="font-display text-3xl font-bold">{formatPrice(p.price)}</span>
            {off && <><span className="text-lg text-muted-foreground line-through">{formatPrice(p.original_price)}</span><span className="rounded-full bg-success px-2.5 py-1 text-sm font-bold text-success-foreground">{off}% OFF</span></>}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <BuyButton p={p} className="px-8 py-3.5 text-base" />
            <WhatsAppButton message={`Hi AnguliMart, I have a question about ${p.name}.`} label="Ask on WhatsApp" />
          </div>
          {p.affiliate_url && <p className="mt-4 rounded-xl bg-muted p-3 text-xs text-muted-foreground">{s.disclosure}</p>}
          {(p.pros.length > 0 || p.cons.length > 0) && (
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="surface-card p-5">
                <p className="font-semibold text-success">Pros</p>
                <ul className="mt-3 space-y-2 text-sm">{p.pros.map((x) => <li key={x} className="flex gap-2"><Check className="h-4 w-4 shrink-0 text-success" />{x}</li>)}</ul>
              </div>
              <div className="surface-card p-5">
                <p className="font-semibold text-destructive">Cons</p>
                <ul className="mt-3 space-y-2 text-sm">{p.cons.map((x) => <li key={x} className="flex gap-2"><X className="h-4 w-4 shrink-0 text-destructive" />{x}</li>)}</ul>
              </div>
            </div>
          )}
          {p.description && <div className="mt-8 whitespace-pre-line leading-relaxed text-foreground/90">{p.description}</div>}
        </div>
      </div>
    </div>
  );
}
