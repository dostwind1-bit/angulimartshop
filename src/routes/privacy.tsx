import { createFileRoute } from "@tanstack/react-router";
import { PageHero, useSettings } from "@/components/site";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy & Affiliate Disclosure — AnguliMart" },
      { name: "description", content: "How AnguliMart handles your data, and our affiliate link disclosure." },
      { property: "og:title", content: "Privacy & Affiliate Disclosure — AnguliMart" },
      { property: "og:description", content: "Our privacy policy and affiliate disclosure." },
    ],
  }),
  component: Page,
});

function Page() {
  const s = useSettings();
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy & Disclosure" />
      <div className="mx-auto max-w-3xl space-y-8 px-5 py-14 leading-relaxed">
        <section><h2 className="font-display text-2xl font-bold">Affiliate disclosure</h2><p className="mt-3">{s.disclosure}</p></section>
        <section><h2 className="font-display text-2xl font-bold">Information we collect</h2><p className="mt-3">When you submit a form we collect the details you provide (such as name, business, WhatsApp number, email and city), along with the page you came from, so we can respond to your request. We also count clicks on outbound links to measure performance.</p></section>
        <section><h2 className="font-display text-2xl font-bold">How we use it</h2><p className="mt-3">Your information is used only to contact you about your request and improve our service. We never sell your data.</p></section>
        <section><h2 className="font-display text-2xl font-bold">Contact</h2><p className="mt-3">For any privacy questions, message {s.owner} on WhatsApp via our Contact page.</p></section>
      </div>
    </>
  );
}
