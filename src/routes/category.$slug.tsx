import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { categoriesQuery, productsQuery, businessesQuery, articlesQuery } from "@/lib/data";
import { PageHero, ProductCard, BusinessCard, ArticleCard, Empty } from "@/components/site";

export const Route = createFileRoute("/category/$slug")({
  loader: async ({ context }) => {
    const [cats] = await Promise.all([
      context.queryClient.ensureQueryData(categoriesQuery),
      context.queryClient.ensureQueryData(productsQuery(100)),
      context.queryClient.ensureQueryData(businessesQuery(100)),
      context.queryClient.ensureQueryData(articlesQuery(100)),
    ]);
    return { cats };
  },
  head: ({ loaderData, params }) => {
    const c = loaderData?.cats.find((x) => x.slug === params.slug);
    const name = c?.name ?? "Category";
    const d = c?.description ?? `Explore ${name} on AnguliMart.`;
    return { meta: [{ title: `${name} — AnguliMart` }, { name: "description", content: d }, { property: "og:title", content: `${name} — AnguliMart` }, { property: "og:description", content: d }] };
  },
  component: Page,
});

function Page() {
  const { slug } = Route.useParams();
  const { data: cats } = useSuspenseQuery(categoriesQuery);
  const { data: products } = useSuspenseQuery(productsQuery(100));
  const { data: businesses } = useSuspenseQuery(businessesQuery(100));
  const { data: articles } = useSuspenseQuery(articlesQuery(100));
  const c = cats.find((x) => x.slug === slug);
  const id = c?.id;
  let ps = products.filter((p) => p.category_id === id);
  if (slug === "trending") ps = products.filter((p) => p.is_trending);
  if (slug === "new-launches") ps = products.filter((p) => p.is_new_launch);
  if (slug === "featured-products") ps = products.filter((p) => p.is_featured);
  if (slug === "deals-offers") ps = products.filter((p) => p.original_price && p.price && p.original_price > p.price);
  const bs = businesses.filter((b) => b.category_id === id || (slug === "business-promotion"));
  const as = articles.filter((a) => a.category_id === id || (slug === "sponsored-articles" && a.is_sponsored));
  return (
    <>
      <PageHero eyebrow="Category" title={c?.name ?? "Category"} subtitle={c?.description ?? undefined} />
      <div className="shell mt-10 space-y-14">
        {ps.length > 0 && <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{ps.map((p) => <ProductCard key={p.id} p={p} />)}</div>}
        {bs.length > 0 && <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{bs.map((b) => <BusinessCard key={b.id} b={b} />)}</div>}
        {as.length > 0 && <div className="grid gap-6 md:grid-cols-3">{as.map((a) => <ArticleCard key={a.id} a={a} />)}</div>}
        {!ps.length && !bs.length && !as.length && <Empty text="Nothing here yet — check back soon." />}
      </div>
    </>
  );
}
