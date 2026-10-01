import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import logo from "@/assets/angulimart-logo.png";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Admin Sign In — AnguliMart" }, { name: "description", content: "AnguliMart admin sign in." }, { property: "og:title", content: "Admin Sign In — AnguliMart" }, { property: "og:description", content: "AnguliMart admin sign in." }, { name: "robots", content: "noindex" }] }),
  component: Page,
});

function Page() {
  const nav = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    const ref = new URLSearchParams(window.location.search).get("ref");
    if (ref) { localStorage.setItem("am_ref", ref.toUpperCase()); setMode("up"); }
  }, []);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email"));
    const password = String(fd.get("password"));
    setBusy(true);
    const res = mode === "in"
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/refer` } });
    setBusy(false);
    if (res.error) {
      toast.error(res.error.message);
      return;
    }
    if (mode === "up" && !res.data.session) {
      toast.success("Check your email to confirm your account.");
      return;
    }
    const uid = res.data.user?.id;
    const { data: isAdmin } = uid ? await supabase.rpc("has_role", { _user_id: uid, _role: "admin" }) : { data: false };
    nav({ to: isAdmin ? "/admin" : "/refer" });
  }
  return (
    <div className="gradient-hero flex min-h-screen items-center justify-center px-4">
      <form onSubmit={submit} className="w-full max-w-sm space-y-5 rounded-3xl bg-card p-8 shadow-2xl">
        <Link to="/" className="flex items-center gap-2"><img src={logo} alt="" className="h-9 w-9 rounded-xl" /><span className="font-display text-lg font-bold">AnguliMart Admin</span></Link>
        <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" required /></div>
        <div className="space-y-2"><Label htmlFor="password">Password</Label><Input id="password" name="password" type="password" minLength={6} required /></div>
        <button disabled={busy} className="gradient-brand w-full rounded-full py-3 font-semibold text-primary-foreground disabled:opacity-60">{mode === "in" ? "Sign in" : "Create account"}</button>
        <button type="button" onClick={() => setMode(mode === "in" ? "up" : "in")} className="w-full text-sm text-muted-foreground">
          {mode === "in" ? "No account? Create one" : "Have an account? Sign in"}
        </button>
      </form>
    </div>
  );
}
