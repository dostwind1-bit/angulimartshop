import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { productsQuery } from "@/lib/data";
import { PageHero, ProductCard, Empty } from "@/components/site";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/products/")({
  head: () => ({
    meta: [
      { title: "Products & Deals — AnguliMart" },
      { name: "description", content: "Browse trending products, new launches and the best deals curated by AnguliMart." },
      { property: "og:title", content: "Products & Deals — AnguliMart" },
      { property: "og:description", content: "Trending products, new launches and top deals." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQuery(100)),
  component: Page,
});

function Page() {
  const { data } = useSuspenseQuery(productsQuery(100));
  const [q, setQ] = useState("");
  const [f, setF] = useState<"all" | "trending" | "new" | "deals">("all");
  const list = data.filter((p) => {
    if (q && !`${p.name} ${p.merchant ?? ""} ${p.summary ?? ""}`.toLowerCase().includes(q.toLowerCase())) return false;
    if (f === "trending") return p.is_trending;
    if (f === "new") return p.is_new_launch;
    if (f === "deals") return !!p.original_price && !!p.price && p.original_price > p.price;
    return true;
  });
  return (
    <>
      <PageHero eyebrow="Shop smarter" title="Products & Deals" subtitle="Curated picks, honest pros & cons and the best prices we can find." />
      <div className="shell mt-10">
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <Input placeholder="Search products…" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-sm rounded-full" />
          {(["all", "trending", "new", "deals"] as const).map((k) => (
            <button key={k} onClick={() => setF(k)} className={`rounded-full px-4 py-2 text-sm font-medium capitalize transition ${f === k ? "bg-navy text-navy-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
              {k === "new" ? "New launches" : k}
            </button>
          ))}
        </div>
        {list.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{list.map((p) => <ProductCard key={p.id} p={p} />)}</div>
        ) : (
          <Empty text="No products match your search." />
        )}
      </div>
    </>
  );
}
