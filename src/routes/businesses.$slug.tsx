import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Globe, Instagram, MapPin } from "lucide-react";
import { businessQuery, trackOutboundClick } from "@/lib/data";
import { whatsappLink } from "@/lib/site";

export const Route = createFileRoute("/businesses/$slug")({
  loader: async ({ context, params }) => ({ b: await context.queryClient.ensureQueryData(businessQuery(params.slug)) }),
  head: ({ loaderData }) => {
    const b = loaderData?.b;
    if (!b) return { meta: [{ title: "Business not found — AnguliMart" }, { name: "robots", content: "noindex" }] };
    const d = b.tagline ?? `${b.name} on AnguliMart`;
    return { meta: [{ title: `${b.name} — AnguliMart` }, { name: "description", content: d }, { property: "og:title", content: b.name }, { property: "og:description", content: d }] };
  },
  component: Page,
});

function Page() {
  const { slug } = Route.useParams();
  const { data: b } = useSuspenseQuery(businessQuery(slug));
  if (!b) return <div className="shell py-24 text-center"><h1 className="font-display text-2xl font-bold">Business not found</h1><Link to="/businesses" className="mt-4 inline-block text-primary">Back</Link></div>;
  const ext = (type: string, url: string) => () => void trackOutboundClick({ target_type: type, target_id: b.id, target_label: b.name, url });
  return (
    <>
      <div className="relative h-64 bg-navy-deep md:h-80">
        {b.cover_url && <img src={b.cover_url} alt={b.name} className="h-full w-full object-cover opacity-70" />}
      </div>
      <div className="shell -mt-16 relative">
        <div className="surface-card p-8">
          <div className="flex flex-wrap items-center gap-4">
            {b.logo_url && <img src={b.logo_url} alt="" className="h-16 w-16 rounded-2xl object-cover" />}
            <div>
              <h1 className="font-display text-3xl font-bold">{b.name}</h1>
              {b.tagline && <p className="text-muted-foreground">{b.tagline}</p>}
            </div>
          </div>
          {b.offer_text && <p className="gradient-tile mt-6 rounded-2xl p-4 font-semibold text-foreground">🎁 {b.offer_text}{b.valid_until ? ` · valid till ${new Date(b.valid_until).toLocaleDateString("en-IN")}` : ""}</p>}
          {b.description && <p className="mt-6 whitespace-pre-line leading-relaxed">{b.description}</p>}
          <div className="mt-8 flex flex-wrap gap-3">
            {b.whatsapp && (
              <a href={whatsappLink(`Hi ${b.name}, I found you on AnguliMart.`, b.whatsapp)} onClick={ext("business_whatsapp", b.whatsapp)} target="_blank" rel="noopener noreferrer" className="rounded-full bg-whatsapp px-5 py-3 font-semibold text-whatsapp-foreground">WhatsApp {b.name}</a>
            )}
            {b.website && <a href={b.website} onClick={ext("business_website", b.website)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 font-semibold"><Globe className="h-4 w-4" />Website</a>}
            {b.instagram && <a href={b.instagram} onClick={ext("business_instagram", b.instagram)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 font-semibold"><Instagram className="h-4 w-4" />Instagram</a>}
          </div>
          {b.city && <p className="mt-6 flex items-center gap-1.5 text-sm text-muted-foreground"><MapPin className="h-4 w-4" />{b.city}</p>}
        </div>
      </div>
    </>
  );
}
