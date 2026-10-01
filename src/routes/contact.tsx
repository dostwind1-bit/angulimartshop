import { createFileRoute } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { PageHero, WhatsAppButton, useSettings } from "@/components/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact AnguliMart on WhatsApp" },
      { name: "description", content: "Reach AnguliMart on WhatsApp for promotions, partnerships and support." },
      { property: "og:title", content: "Contact AnguliMart" },
      { property: "og:description", content: "Chat with us on WhatsApp." },
    ],
  }),
  component: Page,
});

function Page() {
  const s = useSettings();
  return (
    <>
      <PageHero eyebrow="Contact" title="Let's talk on WhatsApp" subtitle="The fastest way to reach us for promotions, partnerships and questions." />
      <div className="shell py-14">
        <div className="surface-card mx-auto max-w-xl p-10 text-center">
          <p className="text-muted-foreground">Message {s.owner} directly</p>
          <WhatsAppButton className="mt-6" message="Hi AnguliMart! I have a query." />
          <p className="mt-6 flex items-center justify-center gap-1.5 text-sm text-muted-foreground"><MapPin className="h-4 w-4" />{s.location}</p>
        </div>
      </div>
    </>
  );
}
