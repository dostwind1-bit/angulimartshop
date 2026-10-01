import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Eye, Pencil, Trash2, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { whatsappLink, formatPrice, discountPercent } from "@/lib/site";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin Dashboard — AnguliMart" }, { name: "description", content: "Manage AnguliMart content and leads." }, { property: "og:title", content: "Admin — AnguliMart" }, { property: "og:description", content: "Admin dashboard." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex" }] }),
  component: Admin,
});

type Table = "leads" | "promotions" | "products" | "businesses" | "articles" | "banners" | "categories" | "brands";
type FType = "text" | "area" | "number" | "bool" | "select" | "category" | "brand" | "date" | "url" | "image";
type Field = { key: string; label: string; type?: FType; required?: boolean; options?: string[] };
type Col = { key: string; label: string; kind?: "text" | "bool" | "date" | "money" | "image" | "status" };
type Cfg = { label: string; singular: string; table: Table; cols: Col[]; fields: Field[]; canAdd?: boolean; quick?: { label: string; patch: Record<string, unknown> }[] };

const PUB = ["pending", "approved", "published", "unpublished", "rejected", "expired"];
const DRAFT = ["draft", "published", "unpublished"];

const CFG: Cfg[] = [
  { label: "Products", singular: "Product", table: "products", canAdd: true,
    cols: [{ key: "image_url", label: "", kind: "image" }, { key: "name", label: "Name" }, { key: "price", label: "Price", kind: "money" }, { key: "merchant", label: "Merchant" }, { key: "status", label: "Status", kind: "status" }, { key: "is_featured", label: "Featured", kind: "bool" }, { key: "is_trending", label: "Trending", kind: "bool" }],
    fields: [
      { key: "name", label: "Name", required: true }, { key: "slug", label: "Slug (auto from name if empty)" },
      { key: "category_id", label: "Category", type: "category" }, { key: "brand_id", label: "Brand", type: "brand" },
      { key: "merchant", label: "Merchant (Amazon, Flipkart…)" }, { key: "cta_label", label: "Button text" },
      { key: "price", label: "Price (₹)", type: "number" }, { key: "original_price", label: "Original price (₹) — sets discount", type: "number" },
      { key: "image_url", label: "Image URL", type: "image" }, { key: "affiliate_url", label: "Affiliate URL", type: "url" },
      { key: "status", label: "Status", type: "select", options: DRAFT },
      { key: "is_featured", label: "Featured", type: "bool" }, { key: "is_trending", label: "Trending", type: "bool" }, { key: "is_new_launch", label: "New launch", type: "bool" },
      { key: "summary", label: "Summary", type: "area" }, { key: "description", label: "Description", type: "area" },
    ] },
  { label: "Categories", singular: "Category", table: "categories", canAdd: true,
    cols: [{ key: "name", label: "Name" }, { key: "slug", label: "Slug" }, { key: "sort_order", label: "Order" }, { key: "is_active", label: "Active", kind: "bool" }],
    fields: [{ key: "name", label: "Name", required: true }, { key: "slug", label: "Slug" }, { key: "icon", label: "Icon (emoji)" }, { key: "sort_order", label: "Sort order", type: "number" }, { key: "is_active", label: "Active", type: "bool" }, { key: "description", label: "Description", type: "area" }] },
  { label: "Brands", singular: "Brand", table: "brands", canAdd: true,
    cols: [{ key: "logo_url", label: "", kind: "image" }, { key: "name", label: "Name" }, { key: "website", label: "Website" }, { key: "is_active", label: "Active", kind: "bool" }],
    fields: [{ key: "name", label: "Name", required: true }, { key: "slug", label: "Slug" }, { key: "logo_url", label: "Logo URL", type: "image" }, { key: "website", label: "Website", type: "url" }, { key: "sort_order", label: "Sort order", type: "number" }, { key: "is_active", label: "Active", type: "bool" }, { key: "description", label: "Description", type: "area" }] },
  { label: "Banners", singular: "Banner", table: "banners", canAdd: true,
    cols: [{ key: "image_url", label: "", kind: "image" }, { key: "title", label: "Title" }, { key: "button_label", label: "Button" }, { key: "placement", label: "Placement" }, { key: "clicks", label: "Clicks" }, { key: "is_active", label: "Active", kind: "bool" }],
    fields: [{ key: "title", label: "Title", required: true }, { key: "subtitle", label: "Subtitle" }, { key: "button_label", label: "Button text" }, { key: "destination_url", label: "Destination URL", type: "url" }, { key: "image_url", label: "Image URL", type: "image" }, { key: "placement", label: "Placement", type: "select", options: ["home_top"] }, { key: "start_date", label: "Start date", type: "date" }, { key: "expiry_date", label: "Expiry date", type: "date" }, { key: "is_active", label: "Active", type: "bool" }] },
  { label: "Promotions", singular: "Promotion", table: "promotions", canAdd: true,
    cols: [{ key: "title", label: "Title" }, { key: "business_name", label: "Business" }, { key: "amount", label: "Amount", kind: "money" }, { key: "payment_status", label: "Payment", kind: "status" }, { key: "status", label: "Status", kind: "status" }],
    quick: [{ label: "Approve", patch: { status: "approved" } }, { label: "Reject", patch: { status: "rejected" } }, { label: "Publish", patch: { status: "published" } }, { label: "Unpublish", patch: { status: "unpublished" } }],
    fields: [{ key: "title", label: "Title", required: true }, { key: "promotion_type", label: "Type", type: "select", options: ["business", "product", "article", "banner", "featured", "other"] }, { key: "contact_name", label: "Contact name" }, { key: "business_name", label: "Business name" }, { key: "whatsapp", label: "WhatsApp" }, { key: "email", label: "Email" }, { key: "city", label: "City" }, { key: "category_id", label: "Category", type: "category" }, { key: "website", label: "Website", type: "url" }, { key: "target_url", label: "Target URL", type: "url" }, { key: "image_url", label: "Image URL", type: "image" }, { key: "amount", label: "Amount (₹)", type: "number" }, { key: "payment_status", label: "Payment", type: "select", options: ["payment_pending", "paid", "waived", "refunded"] }, { key: "status", label: "Status", type: "select", options: PUB }, { key: "start_date", label: "Start date", type: "date" }, { key: "expiry_date", label: "Expiry date", type: "date" }, { key: "is_featured", label: "Featured", type: "bool" }, { key: "notes", label: "Notes", type: "area" }] },
  { label: "Businesses", singular: "Business", table: "businesses", canAdd: true,
    cols: [{ key: "cover_url", label: "", kind: "image" }, { key: "name", label: "Name" }, { key: "city", label: "City" }, { key: "status", label: "Status", kind: "status" }, { key: "is_featured", label: "Featured", kind: "bool" }],
    quick: [{ label: "Approve", patch: { status: "approved" } }, { label: "Reject", patch: { status: "rejected" } }, { label: "Publish", patch: { status: "published" } }, { label: "Unpublish", patch: { status: "unpublished" } }],
    fields: [{ key: "name", label: "Name", required: true }, { key: "slug", label: "Slug" }, { key: "tagline", label: "Tagline" }, { key: "category_id", label: "Category", type: "category" }, { key: "city", label: "City" }, { key: "whatsapp", label: "WhatsApp" }, { key: "website", label: "Website", type: "url" }, { key: "instagram", label: "Instagram" }, { key: "logo_url", label: "Logo URL", type: "image" }, { key: "cover_url", label: "Cover image URL", type: "image" }, { key: "offer_text", label: "Offer" }, { key: "valid_until", label: "Offer valid until", type: "date" }, { key: "status", label: "Status", type: "select", options: PUB }, { key: "is_featured", label: "Featured", type: "bool" }, { key: "description", label: "Description", type: "area" }] },
  { label: "Articles", singular: "Article", table: "articles", canAdd: true,
    cols: [{ key: "image_url", label: "", kind: "image" }, { key: "title", label: "Title" }, { key: "status", label: "Status", kind: "status" }, { key: "is_sponsored", label: "Sponsored", kind: "bool" }, { key: "is_featured", label: "Featured", kind: "bool" }],
    quick: [{ label: "Publish", patch: { status: "published" } }, { label: "Unpublish", patch: { status: "unpublished" } }],
    fields: [{ key: "title", label: "Title", required: true }, { key: "slug", label: "Slug" }, { key: "category_id", label: "Category", type: "category" }, { key: "image_url", label: "Image URL", type: "image" }, { key: "author", label: "Author" }, { key: "seo_title", label: "SEO title" }, { key: "meta_description", label: "Meta description" }, { key: "status", label: "Status", type: "select", options: DRAFT }, { key: "is_sponsored", label: "Sponsored", type: "bool" }, { key: "is_featured", label: "Featured", type: "bool" }, { key: "excerpt", label: "Excerpt", type: "area" }, { key: "content", label: "Content", type: "area" }] },
  { label: "Leads", singular: "Lead", table: "leads",
    cols: [{ key: "created_at", label: "Date", kind: "date" }, { key: "ref", label: "Ref" }, { key: "name", label: "Name" }, { key: "business_name", label: "Business" }, { key: "whatsapp", label: "WhatsApp" }, { key: "source", label: "Source" }, { key: "status", label: "Status", kind: "status" }],
    fields: [{ key: "name", label: "Name", required: true }, { key: "business_name", label: "Business" }, { key: "whatsapp", label: "WhatsApp", required: true }, { key: "email", label: "Email" }, { key: "city", label: "City" }, { key: "promotion_type", label: "Type" }, { key: "status", label: "Status", type: "select", options: ["new", "contacted", "converted", "closed"] }, { key: "message", label: "Message", type: "area" }] },
];

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function Admin() {
  const nav = useNavigate();
  const { data: isAdmin, isLoading } = useQuery({
    queryKey: ["is-admin"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return false;
      const { data } = await supabase.rpc("has_role", { _user_id: u.user.id, _role: "admin" });
      return !!data;
    },
  });
  if (isLoading) return <div className="p-10 text-center text-muted-foreground">Loading…</div>;
  if (!isAdmin) return <div className="p-10 text-center"><p>You don't have admin access.</p><Link to="/" className="text-primary">Go home</Link></div>;
  return (
    <div className="min-h-screen bg-muted/40">
      <header className="bg-navy-deep text-navy-foreground">
        <div className="shell flex h-16 items-center justify-between">
          <span className="font-display text-lg font-bold">AnguliMart Admin</span>
          <div className="flex gap-4 text-sm"><Link to="/">View site</Link><button onClick={async () => { await supabase.auth.signOut(); nav({ to: "/auth" }); }}>Sign out</button></div>
        </div>
      </header>
      <div className="shell py-6 md:py-8">
        <Stats />
        <Tabs defaultValue="Products" className="mt-8">
          <TabsList className="flex h-auto flex-wrap justify-start">
            {[...CFG.map((c) => c.label), "Homepage", "Clicks", "Settings"].map((k) => <TabsTrigger key={k} value={k}>{k}</TabsTrigger>)}
          </TabsList>
          {CFG.map((c) => <TabsContent key={c.label} value={c.label}><Entity cfg={c} /></TabsContent>)}
          <TabsContent value="Homepage"><Homepage /></TabsContent>
          <TabsContent value="Clicks"><Clicks /></TabsContent>
          <TabsContent value="Settings"><Settings /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function Stats() {
  const { data } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const c = async (t: Table | "outbound_clicks", f?: [string, string]) => {
        let q = supabase.from(t).select("id", { count: "exact", head: true });
        if (f) q = q.eq(f[0], f[1]);
        return (await q).count ?? 0;
      };
      return { leads: await c("leads", ["status", "new"]), pending: await c("promotions", ["payment_status", "payment_pending"]), products: await c("products"), clicks: await c("outbound_clicks") };
    },
  });
  const items = [["New leads", data?.leads], ["Payment pending", data?.pending], ["Products", data?.products], ["Outbound clicks", data?.clicks]];
  return <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{items.map(([l, v]) => <div key={l as string} className="surface-card p-5"><p className="text-sm text-muted-foreground">{l}</p><p className="mt-1 font-display text-3xl font-bold">{v ?? "–"}</p></div>)}</div>;
}

function useLookups() {
  const cats = useQuery({ queryKey: ["admin", "lookup-cats"], queryFn: async () => (await supabase.from("categories").select("id,name").order("sort_order")).data ?? [] });
  const brands = useQuery({ queryKey: ["admin", "lookup-brands"], queryFn: async () => (await supabase.from("brands").select("id,name").order("name")).data ?? [] });
  return { cats: cats.data ?? [], brands: brands.data ?? [] };
}

function Entity({ cfg }: { cfg: Cfg }) {
  const qc = useQueryClient();
  const key = ["admin", cfg.table];
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const [viewing, setViewing] = useState<Record<string, unknown> | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const { data = [], isLoading } = useQuery({
    queryKey: key,
    queryFn: async () => {
      const { data, error } = await supabase.from(cfg.table).select("*").order("created_at", { ascending: false }).limit(500);
      if (error) throw error;
      return (data ?? []) as Record<string, unknown>[];
    },
  });
  const refresh = () => qc.invalidateQueries();

  async function patch(id: string, p: Record<string, unknown>, msg = `${cfg.singular} updated successfully`) {
    const { error } = await supabase.from(cfg.table).update(p as never).eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success(msg); refresh();
  }
  async function confirmDelete() {
    if (!deleting) return;
    const { error } = await supabase.from(cfg.table).delete().eq("id", deleting);
    setDeleting(null);
    if (error) { toast.error(error.message); return; }
    toast.success(`${cfg.singular} deleted`); refresh();
  }

  const activeKey = cfg.fields.find((f) => f.key === "is_active") ? "is_active" : null;

  return (
    <div className="surface-card mt-4 overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
        <h2 className="font-display text-lg font-semibold">{cfg.label} <span className="text-sm font-normal text-muted-foreground">({data.length})</span></h2>
        {cfg.canAdd && <button onClick={() => setEditing({})} className="gradient-brand inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold text-primary-foreground"><Plus className="h-4 w-4" /> Add {cfg.singular}</button>}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left"><tr>{cfg.cols.map((c) => <th key={c.key} className="whitespace-nowrap px-4 py-3 font-semibold">{c.label}</th>)}<th className="px-4 py-3 text-right font-semibold">Actions</th></tr></thead>
          <tbody>
            {data.map((r) => {
              const id = r["id"] as string;
              return (
                <tr key={id} className="border-t border-border align-middle">
                  {cfg.cols.map((c) => {
                    const v = r[c.key];
                    if (c.kind === "image") return <td key={c.key} className="px-4 py-2">{v ? <img src={String(v)} alt="" className="h-10 w-10 rounded-lg object-cover" /> : <div className="h-10 w-10 rounded-lg bg-muted" />}</td>;
                    if (c.kind === "bool") return <td key={c.key} className="px-4 py-2"><input type="checkbox" aria-label={c.label} checked={!!v} onChange={(e) => patch(id, { [c.key]: e.target.checked })} /></td>;
                    if (c.kind === "status") return <td key={c.key} className="px-4 py-2"><span className="whitespace-nowrap rounded-full bg-muted px-2.5 py-1 text-xs font-medium">{String(v ?? "—")}</span></td>;
                    if (c.kind === "date") return <td key={c.key} className="whitespace-nowrap px-4 py-2">{new Date(String(v)).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })}</td>;
                    if (c.key === "whatsapp" && v) return <td key={c.key} className="px-4 py-2"><a className="text-primary" target="_blank" rel="noopener noreferrer" href={whatsappLink(`Hi ${r["name"] ?? ""}, this is AnguliMart regarding your request ${r["ref"] ?? ""}.`, String(v))}>{String(v)}</a></td>;
                    return <td key={c.key} className="max-w-[220px] truncate px-4 py-2">{v == null || v === "" ? "—" : c.kind === "money" ? formatPrice(Number(v)) : String(v)}</td>;
                  })}
                  <td className="px-4 py-2">
                    <div className="flex flex-wrap justify-end gap-1.5">
                      {cfg.quick?.map((q) => <button key={q.label} onClick={() => patch(id, q.patch, `${cfg.singular} ${q.label.toLowerCase()}${q.label.endsWith("e") ? "d" : "ed"}`)} className="rounded-md border border-border px-2 py-1 text-xs hover:bg-muted">{q.label}</button>)}
                      {activeKey && <button onClick={() => patch(id, { is_active: !r["is_active"] }, r["is_active"] ? "Deactivated" : "Activated")} className="rounded-md border border-border px-2 py-1 text-xs hover:bg-muted">{r["is_active"] ? "Deactivate" : "Activate"}</button>}
                      {cfg.table === "products" && <button onClick={() => patch(id, { status: r["status"] === "published" ? "unpublished" : "published" }, r["status"] === "published" ? "Product deactivated" : "Product activated")} className="rounded-md border border-border px-2 py-1 text-xs hover:bg-muted">{r["status"] === "published" ? "Deactivate" : "Activate"}</button>}
                      <button aria-label="View" onClick={() => setViewing(r)} className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs hover:bg-muted"><Eye className="h-3.5 w-3.5" />View</button>
                      <button aria-label="Edit" onClick={() => setEditing(r)} className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs hover:bg-muted"><Pencil className="h-3.5 w-3.5" />Edit</button>
                      <button aria-label="Delete" onClick={() => setDeleting(id)} className="inline-flex items-center gap-1 rounded-md border border-destructive/40 px-2 py-1 text-xs text-destructive hover:bg-destructive/10"><Trash2 className="h-3.5 w-3.5" />Delete</button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {!data.length && <tr><td colSpan={cfg.cols.length + 1} className="px-4 py-10 text-center text-muted-foreground">{isLoading ? "Loading…" : "Nothing yet."}</td></tr>}
          </tbody>
        </table>
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader><DialogTitle>{editing?.["id"] ? `Edit ${cfg.singular}` : `Add ${cfg.singular}`}</DialogTitle></DialogHeader>
          {editing && <EditForm cfg={cfg} row={editing} onDone={() => { setEditing(null); refresh(); }} />}
        </DialogContent>
      </Dialog>

      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader><DialogTitle>{cfg.singular} details</DialogTitle></DialogHeader>
          {viewing && <ViewRow cfg={cfg} row={viewing} />}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this item?</AlertDialogTitle>
            <AlertDialogDescription>This permanently removes it from the database and the website.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function ViewRow({ cfg, row }: { cfg: Cfg; row: Record<string, unknown> }) {
  const { cats, brands } = useLookups();
  const disc = cfg.table === "products" ? discountPercent(row["price"] as number, row["original_price"] as number) : null;
  return (
    <dl className="grid gap-3 text-sm sm:grid-cols-2">
      {cfg.fields.map((f) => {
        let v = row[f.key];
        if (f.type === "category") v = cats.find((c) => c.id === v)?.name;
        if (f.type === "brand") v = brands.find((c) => c.id === v)?.name;
        if (f.type === "bool") v = v ? "Yes" : "No";
        return (
          <div key={f.key} className={f.type === "area" || f.type === "image" ? "sm:col-span-2" : ""}>
            <dt className="text-xs font-medium text-muted-foreground">{f.label}</dt>
            <dd className="mt-0.5 whitespace-pre-wrap break-words">{f.type === "image" && v ? <img src={String(v)} alt="" className="mt-1 max-h-48 rounded-lg" /> : v == null || v === "" ? "—" : String(v)}</dd>
          </div>
        );
      })}
      {disc && <div><dt className="text-xs font-medium text-muted-foreground">Discount</dt><dd>{disc}% off</dd></div>}
    </dl>
  );
}

function EditForm({ cfg, row, onDone }: { cfg: Cfg; row: Record<string, unknown>; onDone: () => void }) {
  const { cats, brands } = useLookups();
  const [vals, setVals] = useState<Record<string, unknown>>(() => {
    const v: Record<string, unknown> = {};
    for (const f of cfg.fields) v[f.key] = row[f.key] ?? (f.type === "bool" ? (f.key === "is_active" && !row["id"] ? true : false) : f.type === "select" ? f.options?.[0] : "");
    return v;
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const set = (k: string, v: unknown) => setVals((s) => ({ ...s, [k]: v }));
  const isEdit = !!row["id"];

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    const out: Record<string, unknown> = {};
    for (const f of cfg.fields) {
      const raw = vals[f.key];
      if (f.type === "bool") { out[f.key] = !!raw; continue; }
      const s = String(raw ?? "").trim();
      if (f.required && !s) { errs[f.key] = `${f.label} is required`; continue; }
      if (!s) { out[f.key] = f.key === "slug" ? undefined : null; continue; }
      if (f.type === "number") { const n = Number(s); if (Number.isNaN(n) || n < 0) errs[f.key] = "Enter a valid number"; else out[f.key] = n; continue; }
      if ((f.type === "url" || f.type === "image") && !/^(https?:\/\/|\/)/.test(s)) { errs[f.key] = "Must start with https:// or /"; continue; }
      out[f.key] = f.key === "slug" ? slugify(s) : s;
    }
    if (cfg.fields.some((f) => f.key === "slug") && !out["slug"]) {
      const base = String(out["name"] ?? out["title"] ?? "");
      out["slug"] = (row["slug"] as string) || slugify(base) || undefined;
    }
    if (out["price"] != null && out["original_price"] != null && Number(out["original_price"]) < Number(out["price"])) errs["original_price"] = "Original price should be higher than price";
    setErrors(errs);
    if (Object.keys(errs).length) { toast.error("Please fix the highlighted fields"); return; }
    for (const k of Object.keys(out)) if (out[k] === undefined) delete out[k];
    setSaving(true);
    const { error } = isEdit
      ? await supabase.from(cfg.table).update(out as never).eq("id", row["id"] as string)
      : await supabase.from(cfg.table).insert(out as never);
    setSaving(false);
    if (error) { toast.error(error.message.includes("duplicate") ? "That slug is already used — choose another" : error.message); return; }
    toast.success(`${cfg.singular} ${isEdit ? "updated" : "added"} successfully`);
    onDone();
  }

  return (
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
      {cfg.fields.map((f) => {
        const v = vals[f.key];
        const wide = f.type === "area" || f.type === "image";
        const cls = "w-full rounded-md border border-input bg-background px-3 py-2 text-sm";
        return (
          <div key={f.key} className={`space-y-1 ${wide ? "sm:col-span-2" : ""}`}>
            {f.type === "bool" ? (
              <label className="flex items-center gap-2 pt-6 text-sm font-medium"><input type="checkbox" checked={!!v} onChange={(e) => set(f.key, e.target.checked)} />{f.label}</label>
            ) : (
              <>
                <Label htmlFor={`f-${f.key}`}>{f.label}{f.required && " *"}</Label>
                {f.type === "area" ? <Textarea id={`f-${f.key}`} value={String(v ?? "")} onChange={(e) => set(f.key, e.target.value)} rows={4} />
                  : f.type === "select" ? <select id={`f-${f.key}`} className={cls} value={String(v ?? "")} onChange={(e) => set(f.key, e.target.value)}>{f.options?.map((o) => <option key={o} value={o}>{o}</option>)}</select>
                  : f.type === "category" || f.type === "brand" ? <select id={`f-${f.key}`} className={cls} value={String(v ?? "")} onChange={(e) => set(f.key, e.target.value)}><option value="">— None —</option>{(f.type === "category" ? cats : brands).map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}</select>
                  : <Input id={`f-${f.key}`} type={f.type === "number" ? "number" : f.type === "date" ? "date" : "text"} step="any" value={String(v ?? "")} onChange={(e) => set(f.key, e.target.value)} />}
                {f.type === "image" && v ? <img src={String(v)} alt="" className="mt-2 h-24 rounded-lg object-cover" /> : null}
                {errors[f.key] && <p className="text-xs text-destructive">{errors[f.key]}</p>}
              </>
            )}
          </div>
        );
      })}
      <div className="flex gap-2 sm:col-span-2">
        <button disabled={saving} className="gradient-brand rounded-full px-6 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60">{saving ? "Saving…" : isEdit ? "Update" : "Save"}</button>
      </div>
    </form>
  );
}

function Homepage() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["admin", "settings"], queryFn: async () => (await supabase.from("site_settings").select("*").maybeSingle()).data });
  const { data: products = [] } = useQuery({ queryKey: ["admin", "products"], queryFn: async () => ((await supabase.from("products").select("*").order("created_at", { ascending: false }).limit(500)).data ?? []) as Record<string, unknown>[] });
  if (!data) return null;
  const d = data as unknown as Record<string, unknown>;
  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const patch: Record<string, unknown> = {};
    for (const [k] of TEXT) patch[k] = String(fd.get(k) ?? "").trim();
    for (const [k] of TOGGLES) patch[k] = fd.get(k) === "on";
    if (!patch["hero_title"]) { toast.error("Hero title is required"); return; }
    const { error } = await supabase.from("site_settings").update(patch as never).eq("id", true);
    if (error) toast.error(error.message); else { toast.success("Homepage updated successfully"); qc.invalidateQueries(); }
  }
  async function toggle(id: string, k: string, v: boolean) {
    const { error } = await supabase.from("products").update({ [k]: v } as never).eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Product updated successfully"); qc.invalidateQueries(); }
  }
  return (
    <div className="mt-4 grid gap-6 lg:grid-cols-2">
      <form onSubmit={save} className="surface-card grid gap-4 p-6">
        <h2 className="font-display text-lg font-semibold">Hero & promo sections</h2>
        {TEXT.map(([k, l, area]) => <div key={k} className="space-y-1"><Label htmlFor={k}>{l}</Label>{area ? <Textarea id={k} name={k} defaultValue={String(d[k] ?? "")} /> : <Input id={k} name={k} defaultValue={String(d[k] ?? "")} />}</div>)}
        <div className="grid grid-cols-2 gap-2">{TOGGLES.map(([k, l]) => <label key={k} className="flex items-center gap-2 text-sm"><input type="checkbox" name={k} defaultChecked={!!d[k]} />{l}</label>)}</div>
        <button className="gradient-brand justify-self-start rounded-full px-6 py-2.5 font-semibold text-primary-foreground">Save homepage</button>
      </form>
      <div className="surface-card overflow-hidden">
        <div className="border-b border-border p-4"><h2 className="font-display text-lg font-semibold">Featured, trending & deals</h2><p className="text-xs text-muted-foreground">Deals show products with an original price higher than the price.</p></div>
        <div className="max-h-[640px] overflow-y-auto">
          {products.map((p) => (
            <div key={p["id"] as string} className="flex items-center gap-3 border-b border-border px-4 py-2 text-sm">
              {p["image_url"] ? <img src={String(p["image_url"])} alt="" className="h-9 w-9 rounded object-cover" /> : <div className="h-9 w-9 rounded bg-muted" />}
              <span className="flex-1 truncate">{String(p["name"])}{discountPercent(p["price"] as number, p["original_price"] as number) ? <span className="ml-2 text-xs text-primary">deal</span> : null}</span>
              <label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={!!p["is_featured"]} onChange={(e) => toggle(p["id"] as string, "is_featured", e.target.checked)} />Featured</label>
              <label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={!!p["is_trending"]} onChange={(e) => toggle(p["id"] as string, "is_trending", e.target.checked)} />Trending</label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
const TEXT: [string, string, boolean?][] = [["hero_badge", "Hero badge"], ["hero_title", "Hero title"], ["hero_subtitle", "Hero subtitle", true], ["hero_primary_label", "Primary button text"], ["hero_primary_url", "Primary button link"], ["hero_secondary_label", "Second button text"], ["hero_secondary_url", "Second button link"], ["promo_title", "Promo section title"], ["promo_subtitle", "Promo section subtitle", true], ["promo_button_label", "Promo button text"], ["promo_button_url", "Promo button link"]];
const TOGGLES: [string, string][] = [["show_featured", "Show featured"], ["show_trending", "Show trending"], ["show_deals", "Show deals"], ["show_promo", "Show promo section"]];

function Clicks() {
  const { data = [] } = useQuery({ queryKey: ["admin", "clicks"], queryFn: async () => (await supabase.from("outbound_clicks").select("*").order("created_at", { ascending: false }).limit(200)).data ?? [] });
  return (
    <div className="surface-card mt-4 overflow-x-auto">
      <table className="w-full text-sm"><thead className="bg-muted text-left"><tr><th className="px-4 py-3">Date</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Item</th><th className="px-4 py-3">From page</th></tr></thead>
        <tbody>{data.map((c) => <tr key={c.id} className="border-t border-border"><td className="whitespace-nowrap px-4 py-2">{new Date(c.created_at).toLocaleString("en-IN")}</td><td className="px-4 py-2">{c.target_type}</td><td className="px-4 py-2">{c.target_label}</td><td className="max-w-xs truncate px-4 py-2 text-muted-foreground">{c.page_url}</td></tr>)}</tbody>
      </table>
    </div>
  );
}

function Settings() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["admin", "settings"], queryFn: async () => (await supabase.from("site_settings").select("*").maybeSingle()).data });
  if (!data) return null;
  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const { error } = await supabase.from("site_settings").update({ ...fd, whatsapp_number: String(fd["whatsapp_number"] ?? "").replace(/\D/g, "") }).eq("id", true);
    if (error) toast.error(error.message); else { toast.success("Settings saved"); qc.invalidateQueries(); }
  }
  const fields: [string, string][] = [["site_name", "Site name"], ["tagline", "Tagline"], ["whatsapp_number", "WhatsApp number (with country code)"], ["owner_name", "Owner"], ["location", "Location"]];
  return (
    <form onSubmit={save} className="surface-card mt-4 grid max-w-2xl gap-4 p-6">
      {fields.map(([k, l]) => <div key={k} className="space-y-1"><Label htmlFor={k}>{l}</Label><Input id={k} name={k} defaultValue={String((data as Record<string, unknown>)[k] ?? "")} /></div>)}
      <div className="space-y-1"><Label htmlFor="affiliate_disclosure">Affiliate disclosure</Label><Textarea id="affiliate_disclosure" name="affiliate_disclosure" defaultValue={data.affiliate_disclosure} /></div>
      <button className="gradient-brand justify-self-start rounded-full px-6 py-2.5 font-semibold text-primary-foreground">Save settings</button>
    </form>
  );
}
