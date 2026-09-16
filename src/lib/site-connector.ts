export type SitePost = {
  id: string;
  title: string;
  slug: string;
  summary?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  content?: Record<string, unknown> | null;
  media?: Array<{ url: string; type?: string }>;
  tags?: string[];
  authorName?: string | null;
  publishedAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type SiteBootstrap = {
  site: {
    id: string;
    code: string;
    name: string;
    config?: Record<string, unknown>;
  };
  blueprint?: Record<string, unknown>;
};

export type SiteFeed<TPost = SitePost> = {
  site: SiteBootstrap["site"];
  posts: TPost[];
};

const API_BASE =
  process.env.NEXT_PUBLIC_MASTER_PANEL_URL ||
  process.env.NEXT_PUBLIC_MASTER_API_URL;
const SITE_CODE = process.env.NEXT_PUBLIC_SITE_CODE;
const FEED_REVALIDATE_SECONDS = (() => {
  const parsed = Number(process.env.NEXT_PUBLIC_FEED_REVALIDATE_SECONDS ?? 300);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 300;
})();
const REQUEST_TIMEOUT_MS = (() => {
  const parsed = Number(process.env.NEXT_PUBLIC_PUBLIC_API_TIMEOUT_MS ?? 8000);
  return Number.isFinite(parsed) && parsed >= 1000 ? parsed : 8000;
})();

const getPublicUrl = (path: string) => {
  if (!API_BASE || !SITE_CODE) return null;
  return `${API_BASE.replace(/\/$/, "")}/api/v1/public/${SITE_CODE}${path}`;
};

const STALE_FALLBACK_SECONDS = (() => {
  const parsed = Number(process.env.NEXT_PUBLIC_STALE_FALLBACK_SECONDS ?? 86400);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 86400;
})();

const memoryFallback = new Map<string, { data: unknown; savedAt: number }>();

const saveMemoryFallback = (key: string, data: unknown) => {
  memoryFallback.set(key, { data, savedAt: Date.now() });
};

const readMemoryFallback = <T>(key: string): T | null => {
  const cached = memoryFallback.get(key);
  if (!cached) return null;
  const ageSeconds = (Date.now() - cached.savedAt) / 1000;
  if (ageSeconds > STALE_FALLBACK_SECONDS) return null;
  return cached.data as T;
};

// Returns the payload AND the upstream HTTP status. The in-memory fallback is an
// OUTAGE-resilience feature (keep serving last-known-good while the master blips) and
// must NEVER resurrect content the master has deliberately removed: on a 404/410 we
// drop any held fallback and report the resource as gone; the fallback is served only
// for transient failures (5xx/429/network error/timeout) so backlinks don't 404 when
// the master panel hiccups.
async function fetchPublicJsonEx<T>(
  path: string,
  options?: { fresh?: boolean; timeoutMs?: number }
): Promise<{ data: T | null; status: number | null }> {
  const target = getPublicUrl(path);
  if (!target) return { data: null, status: null };

  try {
    const signal =
      typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout === "function"
        ? AbortSignal.timeout(options?.timeoutMs || REQUEST_TIMEOUT_MS)
        : undefined;
    const response = await fetch(target, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      signal,
      ...(options?.fresh ? { cache: "no-store" } : { next: { revalidate: FEED_REVALIDATE_SECONDS } }),
    });

    if (!response.ok) {
      if (response.status === 404 || response.status === 410) {
        memoryFallback.delete(target);
        return { data: null, status: response.status };
      }
      if (process.env.NODE_ENV !== "production") {
        console.warn(`Public connector request failed (${response.status}) for ${target}`);
      }
      return { data: readMemoryFallback<T>(target), status: response.status };
    }

    const json = (await response.json()) as { success: boolean; data?: T };
    const data = json.data || null;
    if (data) saveMemoryFallback(target, data);
    return { data, status: response.status };
  } catch (error) {
    if (process.env.NODE_ENV !== "production" && !(error instanceof DOMException && error.name === "TimeoutError")) {
      console.warn("Public connector request failed", error);
    }
    return { data: readMemoryFallback<T>(target), status: null };
  }
}

async function fetchPublicJson<T>(path: string, options?: { fresh?: boolean; timeoutMs?: number }): Promise<T | null> {
  return (await fetchPublicJsonEx<T>(path, options)).data;
}

export async function fetchSiteBootstrap(options?: { fresh?: boolean }): Promise<SiteBootstrap | null> {
  return fetchPublicJson<SiteBootstrap>("/bootstrap", options);
}

export async function fetchSitePostBySlug<TPost = SitePost>(
  slug: string,
  options?: { fresh?: boolean; task?: string }
): Promise<(SiteFeed<TPost> & { post?: TPost | null }) | null> {
  const params = new URLSearchParams();
  if (typeof options?.task === "string" && options.task.trim()) {
    params.set("task", options.task.trim().toLowerCase());
  }
  const suffix = params.toString() ? `?${params.toString()}` : "";
  return fetchPublicJson<SiteFeed<TPost> & { post?: TPost | null }>(
    `/post/${encodeURIComponent(slug)}${suffix}`,
    options
  );
}

export async function fetchSiteFeed<TPost = SitePost>(
  limit = 50,
  options?: { fresh?: boolean; category?: string; task?: string }
): Promise<SiteFeed<TPost> | null> {
  const params = new URLSearchParams();
  params.set("limit", String(limit));
  if (typeof options?.category === "string" && options.category.trim()) {
    params.set("category", options.category.trim().toLowerCase());
  }
  if (typeof options?.task === "string" && options.task.trim()) {
    params.set("task", options.task.trim().toLowerCase());
  }
  return fetchPublicJson<SiteFeed<TPost>>(`/feed?${params.toString()}`, options);
}
