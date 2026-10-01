import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero, useSettings } from "@/components/site";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About AnguliMart — Promote • Discover • Grow" },
      { name: "description", content: "AnguliMart is a Lucknow-based platform helping businesses grow and shoppers discover great products." },
      { property: "og:title", content: "About AnguliMart" },
      { property: "og:description", content: "Our mission: help businesses grow and shoppers discover." },
    ],
  }),
  component: Page,
});

function Page() {
  const s = useSettings();
  return (
    <>
      <PageHero eyebrow="About" title="Built to help brands grow" subtitle="Discover. Promote. Grow." />
      <div className="mx-auto max-w-3xl space-y-6 px-5 py-14 text-lg leading-relaxed">
        <p>AnguliMart is a business promotion and product discovery platform founded by <strong>{s.owner}</strong> in {s.location}.</p>
        <p>We help local businesses, creators and brands reach new customers through featured listings, product promotions, sponsored articles and banners — while shoppers get curated picks and honest buying guides.</p>
        <Link to="/promote" className="gradient-brand inline-block rounded-full px-6 py-3 font-semibold text-primary-foreground">Promote With Us</Link>
      </div>
    </>
  );
}
