import Link from 'next/link'
import { ArrowUpRight, ExternalLink, FileText, Globe2, Mail, MapPin, Tag } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import type { TaskKey } from '@/lib/site-config'
import { SITE_THEME } from '@/config/site.theme'
import { getFactoryState } from '@/design/factory/get-factory-state'
import { TASK_POST_CARD_OVERRIDE_ENABLED, TaskPostCardOverride } from '@/overrides/task-post-card'

type ListingContent = {
  location?: string
  category?: string
  description?: string
  email?: string
}

const stripHtml = (value?: string | null) =>
  (value || '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<\/?[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const getExcerpt = (value?: string | null, maxLength = 140) => {
  const text = stripHtml(value)
  if (!text) return ''
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength).trimEnd()}…`
}

const getHostLabel = (value?: string | null) => {
  if (!value) return ''
  try {
    return new URL(value).hostname.replace(/^www\./, '')
  } catch {
    return ''
  }
}

const getContent = (post: SitePost): ListingContent => {
  const content = post.content && typeof post.content === 'object' ? post.content : {}
  return content as ListingContent
}

const cardStyles = {
  'listing-elevated': {
    frame: 'rounded-[1.9rem] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)] hover:-translate-y-1 hover:shadow-[0_28px_75px_rgba(15,23,42,0.14)]',
    muted: 'text-slate-600',
    title: 'text-slate-950',
    badge: 'bg-slate-950 text-white',
    panel: 'border-slate-200 bg-slate-50',
  },
  'editorial-feature': {
    frame: 'rounded-[1.8rem] border border-[rgba(125,83,45,0.12)] bg-[#fffaf3] shadow-[0_18px_55px_rgba(89,52,24,0.1)] hover:-translate-y-1 hover:shadow-[0_26px_75px_rgba(89,52,24,0.14)]',
    muted: 'text-[#71584b]',
    title: 'text-[#2b1d17]',
    badge: 'bg-[#2b1d17] text-[#fff3df]',
    panel: 'border-[rgba(125,83,45,0.12)] bg-[#fff4e5]',
  },
  'studio-panel': {
    frame: 'rounded-[1.9rem] border border-white/10 bg-[linear-gradient(180deg,rgba(7,17,31,0.96),rgba(12,23,43,0.96))] text-white shadow-[0_24px_80px_rgba(15,23,42,0.35)] hover:-translate-y-1 hover:shadow-[0_30px_90px_rgba(15,23,42,0.42)]',
    muted: 'text-slate-300',
    title: 'text-white',
    badge: 'bg-[#8df0c8] text-[#07111f]',
    panel: 'border-white/10 bg-white/6',
  },
  'catalog-grid': {
    frame: 'rounded-[1.8rem] border border-[rgba(67,78,41,0.14)] bg-[#f8faf1] shadow-[0_18px_58px_rgba(55,65,31,0.1)] hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(55,65,31,0.14)]',
    muted: 'text-[#5b664c]',
    title: 'text-[#1f2617]',
    badge: 'bg-[#1f2617] text-[#edf5dc]',
    panel: 'border-[rgba(67,78,41,0.14)] bg-[#eef3e2]',
  },
} as const

const getVariantForTask = (taskKey: TaskKey) => SITE_THEME.cards[taskKey] || 'listing-elevated'

export function TaskPostCard({
  post,
  href,
  taskKey,
  compact,
}: {
  post: SitePost
  href: string
  taskKey?: TaskKey
  compact?: boolean
}) {
  if (TASK_POST_CARD_OVERRIDE_ENABLED) {
    return <TaskPostCardOverride post={post} href={href} taskKey={taskKey} compact={compact} />
  }

  const content = getContent(post)
  const rawCategory = content.category || post.tags?.[0] || 'Post'
  const normalizedCategory = normalizeCategory(rawCategory)
  const category = CATEGORY_OPTIONS.find((item) => item.slug === normalizedCategory)?.name || rawCategory
  const variant = taskKey || 'listing'
  const visualVariant = cardStyles[getVariantForTask(variant)]
  const isBookmarkVariant = variant === 'sbm' || variant === 'social'
  const contentAny = content as Record<string, unknown>
  const website = typeof contentAny.website === 'string' ? contentAny.website : ''
  const hostLabel = getHostLabel(website)
  const isReadingVariant = variant === 'article' || variant === 'pdf' || variant === 'comment'
  const isVisualVariant = variant === 'image'
  const isProfileVariant = variant === 'profile' || variant === 'org'
  const ctaLabel = variant === 'classified'
    ? 'View notice'
    : isReadingVariant
      ? 'Read entry'
      : isProfileVariant
        ? 'Open profile'
        : isVisualVariant
          ? 'Open gallery'
          : 'Open entry'

  const { recipe } = getFactoryState()
  const isDirectoryProduct = recipe.homeLayout === 'listing-home' || recipe.homeLayout === 'classified-home'
  const isDirectorySurface = isDirectoryProduct && (variant === 'listing' || variant === 'classified' || variant === 'profile')

  if (isDirectorySurface) {
    const cardTone = recipe.brandPack === 'market-utility'
      ? {
          frame: 'rounded-[1.75rem] border border-[#d7deca] bg-white shadow-[0_18px_44px_rgba(64,76,34,0.08)] hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(64,76,34,0.14)]',
          badge: 'bg-[#1f2617] text-[#edf5dc]',
          muted: 'text-[#5b664c]',
          title: 'text-[#1f2617]',
          cta: 'text-[#1f2617]',
        }
      : {
          frame: 'rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_18px_44px_rgba(15,23,42,0.08)] hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(15,23,42,0.14)]',
          badge: 'bg-slate-950 text-white',
          muted: 'text-slate-600',
          title: 'text-slate-950',
          cta: 'text-slate-950',
        }

    return (
      <Link href={href} className={`group flex h-full flex-col overflow-hidden transition duration-300 ${cardTone.frame}`}>
        <div className="border-b border-current/10 p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${cardTone.badge}`}>
                <Tag className="h-3.5 w-3.5" />
                {category}
              </span>
              <span className="rounded-full bg-black/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-900">
                {variant === 'classified' ? 'Fast-moving' : 'Structured'}
              </span>
            </div>
            <ArrowUpRight className={`h-5 w-5 shrink-0 ${cardTone.muted}`} />
          </div>
          <div className="mt-4 grid grid-cols-[1fr_auto] gap-3">
            <div className="rounded-[1.4rem] border border-current/10 bg-black/5 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] opacity-70">Listing note</p>
              <p className={`mt-2 text-sm leading-6 ${cardTone.muted}`}>
                {hostLabel || content.location || 'Location, contact details, and offer summary stay visible before the click.'}
              </p>
            </div>
            <div className="flex min-w-[96px] items-center justify-center rounded-[1.4rem] border border-current/10 bg-white/70 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-900">
              {variant === 'classified' ? 'Board' : 'Ledger'}
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <h3 className={`line-clamp-2 text-xl font-semibold leading-snug ${cardTone.title}`}>{post.title}</h3>
          <p className={`mt-3 line-clamp-3 text-sm leading-7 ${cardTone.muted}`}>{getExcerpt(content.description || post.summary) || 'Explore this local listing.'}</p>
          <div className="mt-5 flex flex-wrap gap-3 text-xs">
            {hostLabel ? <span className={`inline-flex items-center gap-1 ${cardTone.muted}`}><Globe2 className="h-3.5 w-3.5" />{hostLabel}</span> : null}
            {content.location ? <span className={`inline-flex items-center gap-1 ${cardTone.muted}`}><MapPin className="h-3.5 w-3.5" />{content.location}</span> : null}
            {content.email ? <span className={`inline-flex items-center gap-1 ${cardTone.muted}`}><Mail className="h-3.5 w-3.5" />{content.email}</span> : null}
          </div>
          <div className={`mt-auto pt-5 text-sm font-semibold ${cardTone.cta}`}>{ctaLabel}</div>
        </div>
      </Link>
    )
  }

  if (isBookmarkVariant) {
    return (
      <Link
        href={href}
        className="curation-note group flex h-full flex-col overflow-hidden rounded-[2rem] p-5 transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_70px_rgba(40,49,77,0.12)]"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#2f3d63] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
              <Tag className="h-3.5 w-3.5" />
              {category}
            </span>
            {hostLabel ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-[rgba(80,96,136,0.12)] bg-white/72 px-2.5 py-1 text-[11px] font-medium text-[#5f6b8c]">
                {hostLabel}
              </span>
            ) : null}
          </div>
          <div className="rounded-full border border-[rgba(80,96,136,0.12)] bg-white/75 p-2 text-[#51607f] transition group-hover:bg-[#2f3d63] group-hover:text-white">
            <ExternalLink className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
          <div className="min-w-0">
            <h3 className="line-clamp-2 text-[1.2rem] font-semibold leading-snug text-[#28314d] group-hover:text-[#36446c]">
              {post.title}
            </h3>
            <p className="mt-3 line-clamp-4 text-sm leading-7 text-[#5f6b8c]">
              {getExcerpt(content.description || post.summary, compact ? 120 : 190) || 'Explore this bookmark.'}
            </p>
          </div>

          <div className="rounded-[1.4rem] border border-[rgba(80,96,136,0.12)] bg-white/76 px-4 py-3 text-right text-xs text-[#6a7697]">
            <div className="font-semibold uppercase tracking-[0.18em] text-[#51607f]">Archive card</div>
            <div className="mt-2">{compact ? 'Quick open' : 'Open entry'}</div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-[rgba(80,96,136,0.1)] pt-4 text-xs text-[#69779b]">
          {hostLabel ? <span className="inline-flex items-center gap-1"><Globe2 className="h-3.5 w-3.5" />{hostLabel}</span> : null}
          {content.location ? <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{content.location}</span> : null}
          {content.email ? <span className="inline-flex items-center gap-1"><Mail className="h-3.5 w-3.5" />{content.email}</span> : null}
          {post.authorName ? <span className="inline-flex items-center gap-1 uppercase tracking-[0.16em]">{post.authorName}</span> : null}
        </div>
      </Link>
    )
  }

  return (
    <Link href={href} className={`group flex h-full flex-col overflow-hidden transition duration-300 ${visualVariant.frame}`}>
      <div className={`border-b p-5 ${visualVariant.panel}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${visualVariant.badge}`}>
              <Tag className="h-3.5 w-3.5" />
              {category}
            </span>
            {variant === 'pdf' ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-white/88 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-950 shadow">
                <FileText className="h-3.5 w-3.5" />
                PDF
              </span>
            ) : null}
          </div>
          <ArrowUpRight className={`h-5 w-5 shrink-0 ${visualVariant.muted}`} />
        </div>
        <div className="mt-4 grid grid-cols-[1fr_auto] gap-3">
          <div className="rounded-[1.4rem] border border-current/10 bg-white/60 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] opacity-70">
              {isReadingVariant ? 'Reading sheet' : isVisualVariant ? 'Visual brief' : isProfileVariant ? 'Identity card' : 'Browse note'}
            </p>
            <p className={`mt-2 text-sm leading-6 ${visualVariant.muted}`}>
              {hostLabel || content.location || (isReadingVariant
                ? 'Typography-forward summary with a calmer reading cadence.'
                : isVisualVariant
                  ? 'Visual entries keep a distinct gallery-like tone without repeating the bookmark layout.'
                  : isProfileVariant
                    ? 'Trust, identity, and metadata lead the presentation.'
                    : 'Metadata and summary stay visible before opening the detail page.')}
            </p>
          </div>
          <div className="flex min-w-[96px] items-center justify-center rounded-[1.4rem] border border-current/10 bg-white/70 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em]">
            {isReadingVariant ? 'Read' : isVisualVariant ? 'View' : 'Open'}
          </div>
        </div>
      </div>
      <div className={`flex flex-1 flex-col p-5 ${compact ? 'py-4' : ''}`}>
        <h3 className={`line-clamp-2 font-semibold leading-snug ${variant === 'article' ? 'text-[1.35rem]' : 'text-lg'} ${visualVariant.title}`}>{post.title}</h3>
        <p className={`mt-3 text-sm leading-7 ${variant === 'article' ? 'line-clamp-4' : 'line-clamp-3'} ${visualVariant.muted}`}>{getExcerpt(content.description || post.summary) || 'Explore this post.'}</p>
        <div className="mt-auto pt-4">
          {hostLabel ? <div className={`inline-flex items-center gap-1 text-xs ${visualVariant.muted}`}><Globe2 className="h-3.5 w-3.5" />{hostLabel}</div> : null}
          {content.location ? <div className={`inline-flex items-center gap-1 text-xs ${visualVariant.muted}`}><MapPin className="h-3.5 w-3.5" />{content.location}</div> : null}
          {content.email ? <div className={`mt-2 inline-flex items-center gap-1 text-xs ${visualVariant.muted}`}><Mail className="h-3.5 w-3.5" />{content.email}</div> : null}
          <div className={`mt-4 text-sm font-semibold ${visualVariant.title}`}>{ctaLabel}</div>
        </div>
      </div>
    </Link>
  )
}
