import { PageShell } from "@/components/shared/page-shell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { fetchSiteFeed } from "@/lib/site-connector";
import { buildPostUrl, getPostTaskKey } from "@/lib/task-data";
import { getMockPostsForTask } from "@/lib/mock-posts";
import { SITE_CONFIG } from "@/lib/site-config";
import { TaskPostCard } from "@/components/shared/task-post-card";

export const revalidate = 3;

const matchText = (value: string, query: string) =>
  value.toLowerCase().includes(query);

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, " ");

const compactText = (value: unknown) => {
  if (typeof value !== "string") return "";
  return stripHtml(value).replace(/\s+/g, " ").trim().toLowerCase();
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string; category?: string; task?: string; master?: string }>;
}) {
  const resolved = (await searchParams) || {};
  const query = (resolved.q || "").trim();
  const normalized = query.toLowerCase();
  const category = (resolved.category || "").trim().toLowerCase();
  const task = (resolved.task || "").trim().toLowerCase();
  const useMaster = resolved.master !== "0";
  const feed = await fetchSiteFeed(
    useMaster ? 1000 : 300,
    useMaster
      ? { fresh: true, category: category || undefined, task: task || undefined }
      : undefined
  );
  const posts =
    feed?.posts?.length
      ? feed.posts
      : useMaster
        ? []
        : SITE_CONFIG.tasks.flatMap((task) => getMockPostsForTask(task.key));

  const filtered = posts.filter((post) => {
    const content = post.content && typeof post.content === "object" ? post.content : {};
    const typeText = compactText((content as any).type);
    if (typeText === "comment") return false;
    const description = compactText((content as any).description);
    const body = compactText((content as any).body);
    const excerpt = compactText((content as any).excerpt);
    const categoryText = compactText((content as any).category);
    const tags = Array.isArray(post.tags) ? post.tags.join(" ") : "";
    const tagsText = compactText(tags);
    const derivedCategory = categoryText || tagsText;
    if (category && !derivedCategory.includes(category)) return false;
    if (task && typeText && typeText !== task) return false;
    if (!normalized.length) return true;
    return (
      matchText(compactText(post.title || ""), normalized) ||
      matchText(compactText(post.summary || ""), normalized) ||
      matchText(description, normalized) ||
      matchText(body, normalized) ||
      matchText(excerpt, normalized) ||
      matchText(tagsText, normalized)
    );
  });

  const results = normalized.length > 0 ? filtered : filtered.slice(0, 24);

  return (
    <PageShell
      title="Search"
      description={
        query
          ? `Results for "${query}"`
          : "Search across every route while keeping the bookmark archive front and center."
      }
      actions={
        <form action="/search" className="flex w-full gap-2 sm:w-auto">
          <input type="hidden" name="master" value="1" />
          {category ? <input type="hidden" name="category" value={category} /> : null}
          {task ? <input type="hidden" name="task" value={task} /> : null}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7380a0]" />
            <Input
              name="q"
              defaultValue={query}
              placeholder="Search links, tags, and saved references..."
              className="archive-input h-11 rounded-full pl-9"
            />
          </div>
          <Button type="submit" className="h-11 rounded-full bg-[#21283f] px-5 text-white hover:bg-[#334264]">
            Search
          </Button>
        </form>
      }
    >
      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        {[
          ['Archive scan', `${results.length} result${results.length === 1 ? '' : 's'} surfaced`],
          ['Search scope', task || category ? 'Filtered across matching routes' : 'All enabled routes remain searchable'],
          ['Discovery rule', 'Bookmarking stays visually primary while every task remains accessible'],
        ].map(([label, value]) => (
          <div key={label} className="archive-stat rounded-[1.6rem] p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#7380a0]">{label}</p>
            <p className="mt-2 text-sm text-[#21283f]">{value}</p>
          </div>
        ))}
      </div>
      <div className="mb-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="archive-panel rounded-[2rem] p-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#7380a0]">Search desk</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-[#21283f]">
            Search the archive like an index, not like a noisy all-content feed.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#53607f]">
            Results stay route-aware, but the presentation now feels more curated and deliberate, with clearer scanning cues and bookmark-first visual framing.
          </p>
        </section>
        <section className="grid gap-4">
          <div className="curation-note rounded-[1.8rem] p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#7380a0]">Try searching for</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {['design systems', 'frontend tools', 'research', 'collections', 'ai prompts'].map((item) => (
                <span key={item} className="archive-chip">{item}</span>
              ))}
            </div>
          </div>
          <div className="archive-panel-muted rounded-[1.8rem] p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#7380a0]">Search behavior</p>
            <p className="mt-3 text-sm leading-7 text-[#53607f]">
              Filtering, routing, and result matching stay exactly the same. Only the visual organization and content framing have changed.
            </p>
          </div>
        </section>
      </div>
      {results.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((post) => {
            const task = getPostTaskKey(post);
            const href = task ? buildPostUrl(task, post.slug) : `/posts/${post.slug}`;
            return <TaskPostCard key={post.id} post={post} href={href} taskKey={task ?? undefined} />;
          })}
        </div>
      ) : (
        <div className="curation-panel rounded-[2rem] border border-dashed p-10 text-center text-[#53607f]">
          No matching posts yet.
        </div>
      )}
    </PageShell>
  );
}
