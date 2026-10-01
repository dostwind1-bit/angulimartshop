import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Copy, Gift, Trophy, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageHero, WhatsAppButton } from "@/components/site";

export const Route = createFileRoute("/refer")({
  head: () => ({
    meta: [
      { title: "Refer & Earn Points — AnguliMart" },
      { name: "description", content: "Invite friends to AnguliMart and earn 10 points for every successful referral." },
      { property: "og:title", content: "Refer & Earn Points — AnguliMart" },
      { property: "og:description", content: "Invite friends to AnguliMart and earn 10 points for every referral." },
    ],
  }),
  component: ReferPage,
});

type Profile = { referral_code: string | null; points: number };

function ReferPage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      if (!user) { setLoading(false); return; }
      const pending = localStorage.getItem("am_ref");
      if (pending) {
        const { data: r } = await supabase.rpc("claim_referral", { _code: pending });
        localStorage.removeItem("am_ref");
        const res = r as { ok?: boolean; message?: string } | null;
        if (res?.ok) toast.success("Referral applied!");
      }
      const { data: p } = await supabase.from("profiles").select("referral_code, points").eq("id", user.id).maybeSingle();
      const { count: c } = await supabase.from("referrals").select("id", { count: "exact", head: true }).eq("referrer_id", user.id);
      setProfile(p ?? { referral_code: null, points: 0 });
      setCount(c ?? 0);
      setLoading(false);
    })();
  }, []);

  const link = profile?.referral_code && typeof window !== "undefined" ? `${window.location.origin}/auth?ref=${profile.referral_code}` : "";

  return (
    <div>
      <PageHero eyebrow="Refer & Earn" title="Invite friends, earn points" subtitle="Har successful referral par 10 points paayein." />
      <div className="shell -mt-8 max-w-2xl pb-10">
        {loading ? (
          <div className="surface-card p-10 text-center text-muted-foreground">Loading…</div>
        ) : !profile ? (
          <div className="surface-card space-y-4 p-8 text-center">
            <Gift className="mx-auto h-10 w-10 text-primary" />
            <h2 className="font-display text-xl font-bold">Sign in to get your referral code</h2>
            <p className="text-sm text-muted-foreground">Account banaiye aur apna code share karke points kamaiye.</p>
            <Link to="/auth" className="gradient-brand inline-flex rounded-full px-6 py-3 font-semibold text-primary-foreground">Sign in / Sign up</Link>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="surface-card p-5"><Trophy className="h-5 w-5 text-primary" /><p className="mt-2 font-display text-3xl font-bold">{profile.points}</p><p className="text-sm text-muted-foreground">Points</p></div>
              <div className="surface-card p-5"><Users className="h-5 w-5 text-primary" /><p className="mt-2 font-display text-3xl font-bold">{count}</p><p className="text-sm text-muted-foreground">Referrals</p></div>
            </div>
            <div className="surface-card space-y-4 p-6">
              <p className="text-sm font-semibold text-muted-foreground">Your referral code</p>
              <p className="font-display text-3xl font-bold tracking-widest text-gradient-brand">{profile.referral_code ?? "—"}</p>
              <button onClick={() => { void navigator.clipboard.writeText(link); toast.success("Link copied"); }} className="flex w-full items-center justify-center gap-2 rounded-full border border-input py-3 text-sm font-semibold">
                <Copy className="h-4 w-4" /> Copy invite link
              </button>
              <WhatsAppButton className="w-full" label="Share on WhatsApp" message={`AnguliMart par best deals aur businesses dekho! Mera code ${profile.referral_code} use karke join karo: ${link}`} />
            </div>
            <div className="surface-card p-6 text-sm text-muted-foreground">
              <p className="font-semibold text-foreground">Kaise kaam karta hai</p>
              <ol className="mt-2 list-decimal space-y-1 pl-5"><li>Apna link share karein</li><li>Dost us link se sign up kare</li><li>Aapko 10 points milenge</li></ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
