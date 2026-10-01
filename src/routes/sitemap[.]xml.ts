import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = new URL(request.url).origin;
        const sb = createClient(process.env["SUPABASE_URL"]!, process.env["SUPABASE_PUBLISHABLE_KEY"]!, {
          auth: { persistSession: false, autoRefreshToken: false },
        });
        const paths = ["/", "/products", "/businesses", "/articles", "/promote", "/about", "/contact", "/privacy"];
        const [p, b, a, c] = await Promise.all([
          sb.from("products").select("slug").eq("status", "published"),
          sb.from("businesses").select("slug").eq("status", "published"),
          sb.from("articles").select("slug").eq("status", "published"),
          sb.from("categories").select("slug").eq("is_active", true),
        ]);
        p.data?.forEach((r) => paths.push(`/products/${r.slug}`));
        b.data?.forEach((r) => paths.push(`/businesses/${r.slug}`));
        a.data?.forEach((r) => paths.push(`/articles/${r.slug}`));
        c.data?.forEach((r) => paths.push(`/category/${r.slug}`));
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths
          .map((x) => `<url><loc>${origin}${x}</loc></url>`)
          .join("")}</urlset>`;
        return new Response(xml, { headers: { "content-type": "application/xml" } });
      },
    },
  },
});
