'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { FolderPlus, NotebookTabs } from 'lucide-react'
import { PageShell } from '@/components/shared/page-shell'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { BookmarkCollectionCard } from '@/components/sbm/bookmark-collection-card'
import { mockBookmarkCollections } from '@/data/mock-data'
import type { BookmarkCollection } from '@/types'
import { loadFromStorage, storageKeys } from '@/lib/local-storage'

export default function BookmarkCollectionsPage() {
  const [storedCollections, setStoredCollections] = useState<BookmarkCollection[]>([])
  const collections = useMemo(() => {
    const map = new Map<string, BookmarkCollection>()
    storedCollections.forEach((collection) => map.set(collection.id, collection))
    mockBookmarkCollections.forEach((collection) => {
      if (!map.has(collection.id)) {
        map.set(collection.id, collection)
      }
    })
    return Array.from(map.values())
  }, [storedCollections])

  useEffect(() => {
    setStoredCollections(loadFromStorage<BookmarkCollection[]>(storageKeys.bookmarkCollections, []))
  }, [])

  return (
    <PageShell
      title="Bookmark Collections"
      description="Organize saved links into archive folders, topic shelves, and private research groupings."
      actions={
        <Button className="gap-2 rounded-full bg-[#21283f] text-white hover:bg-[#334264]" asChild>
          <Link href="/sbm/collections/new">
            <FolderPlus className="h-4 w-4" />
            New Collection
          </Link>
        </Button>
      }
    >
      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        {[
          ['Collection count', `${collections.length} folder${collections.length === 1 ? '' : 's'} ready`],
          ['Primary use', 'Group related bookmarks into revisit-friendly shelves'],
          ['Visual mode', 'Paper notes and archive cards instead of image tiles'],
        ].map(([label, value]) => (
          <div key={label} className="archive-stat rounded-[1.6rem] p-4">
            <div className="archive-chip">
              <NotebookTabs className="h-3.5 w-3.5" />
              {label}
            </div>
            <p className="mt-3 text-sm text-[#21283f]">{value}</p>
          </div>
        ))}
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="archive-panel rounded-[2rem] p-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#7380a0]">Collection desk</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-[#21283f]">
            Build focused shelves for topics, clients, tools, or ongoing research trails.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#53607f]">
            Collections keep the bookmarking experience calm and intentional. Instead of a flat feed, each folder acts like a curated drawer with a clearer reason to revisit.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {['Research sources', 'Tool stacks', 'Client references', 'Reading queues'].map((item) => (
              <span key={item} className="archive-chip">{item}</span>
            ))}
          </div>
        </section>

        <section className="grid gap-4">
          <div className="curation-note rounded-[1.8rem] p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#7380a0]">Best use cases</p>
            <ul className="mt-4 space-y-3 text-sm text-[#53607f]">
              <li>Keep repeat-visit links grouped by goal instead of by publish date.</li>
              <li>Separate private background research from public-facing saved finds.</li>
              <li>Make stronger discovery surfaces without changing any bookmark logic.</li>
            </ul>
          </div>
          <div className="archive-panel-muted rounded-[1.8rem] p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#7380a0]">Quick start</p>
            <p className="mt-3 text-sm leading-7 text-[#53607f]">
              Start with one broad collection for active work, then split out narrower topic shelves once patterns emerge in what you save most often.
            </p>
          </div>
        </section>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {collections.map((collection) => (
          <BookmarkCollectionCard key={collection.id} collection={collection} />
        ))}
      </motion.div>
    </PageShell>
  )
}
