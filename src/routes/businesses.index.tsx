import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { businessesQuery } from "@/lib/data";
import { PageHero, BusinessCard, Empty } from "@/components/site";

export const Route = createFileRoute("/businesses/")({
  head: () => ({
    meta: [
      { title: "Local Businesses — AnguliMart" },
      { name: "description", content: "Discover trusted businesses, shops and services promoted on AnguliMart." },
      { property: "og:title", content: "Local Businesses — AnguliMart" },
      { property: "og:description", content: "Trusted businesses, shops and services." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(businessesQuery(100)),
  component: Page,
});

function Page() {
  const { data } = useSuspenseQuery(businessesQuery(100));
  return (
    <>
      <PageHero eyebrow="Directory" title="Featured Businesses" subtitle="Brands and services growing with AnguliMart." />
      <div className="shell mt-10">
        {data.length ? <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{data.map((b) => <BusinessCard key={b.id} b={b} />)}</div> : <Empty text="No businesses listed yet." />}
      </div>
    </>
  );
}
