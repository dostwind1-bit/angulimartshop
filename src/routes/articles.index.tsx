import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { articlesQuery } from "@/lib/data";
import { PageHero, ArticleCard, Empty } from "@/components/site";

export const Route = createFileRoute("/articles/")({
  head: () => ({
    meta: [
      { title: "Articles & Buying Guides — AnguliMart" },
      { name: "description", content: "Buying guides, product reviews and small business growth tips from AnguliMart." },
      { property: "og:title", content: "Articles & Buying Guides — AnguliMart" },
      { property: "og:description", content: "Buying guides, reviews and growth tips." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(articlesQuery(100)),
  component: Page,
});

function Page() {
  const { data } = useSuspenseQuery(articlesQuery(100));
  return (
    <>
      <PageHero eyebrow="Blog" title="Articles & Guides" subtitle="Smart reads for shoppers and business owners." />
      <div className="shell mt-10">
        {data.length ? <div className="grid gap-6 md:grid-cols-3">{data.map((a) => <ArticleCard key={a.id} a={a} />)}</div> : <Empty text="No articles yet." />}
      </div>
    </>
  );
}
