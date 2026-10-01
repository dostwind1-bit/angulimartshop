import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { PROMOTION_TYPES, collectSourceInfo, promotionTypeLabel } from "@/lib/site";
import { PageHero, WhatsAppButton } from "@/components/site";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/promote")({
  head: () => ({
    meta: [
      { title: "Promote Your Business — AnguliMart" },
      { name: "description", content: "Promote your business, products or brand on AnguliMart. Featured listings, sponsored articles and banner promotions." },
      { property: "og:title", content: "Promote Your Business — AnguliMart" },
      { property: "og:description", content: "Get discovered by more buyers with AnguliMart promotions." },
    ],
  }),
  component: Page,
});

const schema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(100),
  business_name: z.string().trim().max(150).optional(),
  email: z.string().trim().email("Invalid email").max(255).optional().or(z.literal("")),
  whatsapp: z.string().trim().regex(/^[0-9+\s-]{10,15}$/, "Enter a valid WhatsApp number"),
  city: z.string().trim().max(100).optional(),
  promotion_type: z.string(),
  website: z.string().trim().max(300).optional(),
  message: z.string().trim().max(1000).optional(),
});

function Page() {
  const [done, setDone] = useState<{ ref: string; name: string; type: string; biz: string; page: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const parsed = schema.safeParse(fd);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the form.");
      return;
    }
    setBusy(true);
    const src = collectSourceInfo();
    const ref = crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase();
    const { error } = await supabase.from("leads").insert({
      name: parsed.data.name,
      business_name: parsed.data.business_name || null,
      whatsapp: parsed.data.whatsapp,
      city: parsed.data.city || null,
      promotion_type: parsed.data.promotion_type,
      website: parsed.data.website || null,
      message: parsed.data.message || null,
      email: parsed.data.email || null,
      ref,
      form_name: "promote_with_us",
      page_url: src.page_url,
      referrer: src.referrer,
      source: src.utm["utm_source"] ?? src.utm["ref"] ?? (src.referrer ? "referral" : "direct"),
      utm: src.utm,
    });
    setBusy(false);
    if (error) {
      toast.error("Could not submit. Please try again.");
      return;
    }
    setDone({ ref, name: parsed.data.name, type: parsed.data.promotion_type, biz: parsed.data.business_name ?? "", page: src.page_url });
  }

  return (
    <>
      <PageHero eyebrow="Promote With Us" title="Put your brand in front of buyers" subtitle="Business listings, product promotions, sponsored articles and banners — simple pricing, paid via UPI/WhatsApp." />
      <div className="shell mt-12 grid gap-10 lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-2">
          {PROMOTION_TYPES.map((t) => (
            <div key={t.value} className="surface-card p-5">
              <p className="font-display font-semibold">{t.label}</p>
            </div>
          ))}
        </div>
        <div className="surface-card p-8 lg:col-span-3">
          {done ? (
            <div className="py-8 text-center">
              <CheckCircle2 className="mx-auto h-14 w-14 text-success" />
              <h2 className="mt-4 font-display text-2xl font-bold">Your request has been received.</h2>
              <p className="mt-2 text-muted-foreground">Reference ID: <span className="font-mono font-semibold text-foreground">{done.ref}</span></p>
              <WhatsAppButton
                className="mt-6"
                label="Continue on WhatsApp"
                message={`Hi AnguliMart! I just submitted a promotion request.\nLead ID: ${done.ref}\nName: ${done.name}${done.biz ? `\nBusiness: ${done.biz}` : ""}\nType: ${promotionTypeLabel(done.type)}\nSource page: ${done.page}`}
              />
            </div>
          ) : (
            <form onSubmit={submit} className="grid gap-5 sm:grid-cols-2">
              <F label="Your name *" name="name" />
              <F label="Business name" name="business_name" />
              <F label="WhatsApp number *" name="whatsapp" type="tel" />
              <F label="Email" name="email" type="email" />
              <F label="City" name="city" />
              <div className="space-y-2">
                <Label htmlFor="promotion_type">Promotion type</Label>
                <select id="promotion_type" name="promotion_type" className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                  {PROMOTION_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2"><F label="Website / Instagram" name="website" /></div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="message">Tell us about your goals</Label>
                <Textarea id="message" name="message" rows={4} maxLength={1000} />
              </div>
              <button disabled={busy} className="gradient-brand rounded-full px-6 py-3.5 font-semibold text-primary-foreground disabled:opacity-60 sm:col-span-2">
                {busy ? "Submitting…" : "Submit Request"}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}

function F({ label, name, type = "text" }: { label: string; name: string; type?: string }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} type={type} />
    </div>
  );
}
