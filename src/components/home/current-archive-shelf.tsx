'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import { getLocalPostsForTask } from '@/lib/local-posts'

type Props = {
  initialPosts: SitePost[]
}

export function CurrentArchiveShelf({ initialPosts }: Props) {
  const localPosts = getLocalPostsForTask('sbm')

  const posts = useMemo(() => {
    const seen = new Set<string>()
    const merged: Array<SitePost & { localOnly?: boolean }> = []

    localPosts.forEach((post) => {
      if (post.slug) seen.add(post.slug)
      merged.push(post)
    })

    initialPosts.forEach((post) => {
      if (post.slug && seen.has(post.slug)) return
      merged.push(post)
    })

    return merged.slice(0, 4)
  }, [initialPosts, localPosts])

  if (!posts.length) {
    return (
      <div className="rounded-[1.6rem] border border-dashed border-[rgba(83,96,127,0.24)] bg-white/60 p-6 text-sm text-[#53607f]">
        No bookmarks yet. Add some links in <Link href="/sbm/submit" className="font-semibold text-[#21283f] underline">/sbm/submit</Link> and they will show here.
      </div>
    )
  }

  return (
    <div className="mt-6 grid gap-3">
      {posts.map((post, index) => {
        const localOnly = Boolean((post as { localOnly?: boolean }).localOnly)
        const href = localOnly ? `/local/sbm/${post.slug}` : `/sbm/${post.slug}`

        return (
          <Link
            key={post.id}
            href={href}
            className="rounded-[1.6rem] border border-[rgba(83,96,127,0.14)] bg-white/78 p-4 transition hover:-translate-y-0.5 hover:bg-white"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#7380a0]">Shelf card {index + 1}</p>
                <h3 className="mt-2 line-clamp-2 text-xl font-semibold text-[#21283f]">{post.title}</h3>
              </div>
              <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-[#53607f]" />
            </div>
            <p className="mt-3 line-clamp-3 text-sm leading-7 text-[#53607f]">
              {post.summary || 'A saved reference arranged for fast return visits and cleaner scanning.'}
            </p>
          </Link>
        )
      })}
    </div>
  )
}
