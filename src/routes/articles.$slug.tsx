import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { articleQuery } from "@/lib/data";

export const Route = createFileRoute("/articles/$slug")({
  loader: async ({ context, params }) => ({ a: await context.queryClient.ensureQueryData(articleQuery(params.slug)) }),
  head: ({ loaderData }) => {
    const a = loaderData?.a;
    if (!a) return { meta: [{ title: "Article not found — AnguliMart" }, { name: "robots", content: "noindex" }] };
    const t = a.seo_title ?? a.title;
    const d = a.meta_description ?? a.excerpt ?? a.title;
    return { meta: [{ title: `${t} — AnguliMart` }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "article" }] };
  },
  component: Page,
});

function Page() {
  const { slug } = Route.useParams();
  const { data: a } = useSuspenseQuery(articleQuery(slug));
  if (!a) return <div className="shell py-24 text-center"><h1 className="font-display text-2xl font-bold">Article not found</h1><Link to="/articles" className="mt-4 inline-block text-primary">Back</Link></div>;
  return (
    <article className="mx-auto max-w-3xl px-5 py-12">
      <Link to="/articles" className="text-sm text-muted-foreground hover:text-foreground">← All articles</Link>
      {a.is_sponsored && <p className="mt-6 text-xs font-bold uppercase tracking-widest text-violet">Sponsored</p>}
      <h1 className="mt-2 font-display text-3xl font-bold leading-tight tracking-tight md:text-5xl">{a.title}</h1>
      <p className="mt-4 text-sm text-muted-foreground">By {a.author}{a.published_at ? ` · ${new Date(a.published_at).toLocaleDateString("en-IN", { dateStyle: "long" })}` : ""}</p>
      {a.image_url && <img src={a.image_url} alt={a.title} className="mt-8 aspect-[16/9] w-full rounded-3xl object-cover" />}
      {a.excerpt && <p className="mt-8 text-xl text-muted-foreground">{a.excerpt}</p>}
      <div className="mt-8 whitespace-pre-line text-lg leading-relaxed text-foreground/90">{a.content}</div>
      {a.tags.length > 0 && <div className="mt-10 flex flex-wrap gap-2">{a.tags.map((t) => <span key={t} className="rounded-full bg-muted px-3 py-1 text-xs">#{t}</span>)}</div>}
    </article>
  );
}
