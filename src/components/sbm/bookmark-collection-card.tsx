'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Folder, Lock, NotebookTabs } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { BookmarkCollection } from '@/types'
import { formatDistanceToNow } from 'date-fns'

export function BookmarkCollectionCard({ collection }: { collection: BookmarkCollection }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Link href={`/sbm/collections/${collection.id}`} className="block">
        <Card className="curation-note group h-full overflow-hidden border-[rgba(80,96,136,0.12)] bg-transparent transition-all hover:border-[rgba(80,96,136,0.2)]">
        <div className="archive-grid border-b border-[rgba(80,96,136,0.1)] p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="archive-chip">
                <NotebookTabs className="h-3.5 w-3.5" />
                Collection
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Folder className="h-4 w-4 text-[#3d4d77]" />
                <h3 className="text-lg font-semibold text-[#21283f]">{collection.name}</h3>
              </div>
            </div>
            {collection.isPrivate && (
              <Badge variant="secondary" className="gap-1 border border-[rgba(80,96,136,0.12)] bg-white/70 text-[#53607f]">
                <Lock className="h-3 w-3" />
                Private
              </Badge>
            )}
          </div>
        </div>
        <CardContent className="p-5">
          <p className="text-sm leading-7 text-[#53607f] line-clamp-3">
            {collection.description}
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="archive-panel-muted rounded-[1.2rem] p-3 text-xs text-[#53607f]">
              <p className="font-semibold uppercase tracking-[0.18em] text-[#7380a0]">Saved entries</p>
              <p className="mt-2 text-sm font-medium text-[#21283f]">{collection.bookmarks.length} bookmarks</p>
            </div>
            <div className="archive-panel-muted rounded-[1.2rem] p-3 text-xs text-[#53607f]">
              <p className="font-semibold uppercase tracking-[0.18em] text-[#7380a0]">Updated</p>
              <p className="mt-2 text-sm font-medium text-[#21283f]" suppressHydrationWarning>
                {mounted ? formatDistanceToNow(new Date(collection.updatedAt), { addSuffix: true }) : 'recently'}
              </p>
            </div>
          </div>
          <div className="mt-4 text-sm font-semibold text-[#3d4d77]">
            Open collection
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-[#7380a0]">
            <span>Archive folder</span>
            <span suppressHydrationWarning>
              {collection.coverImages.length} source marker{collection.coverImages.length === 1 ? '' : 's'}
            </span>
          </div>
        </CardContent>
      </Card>
      </Link>
    </motion.div>
  )
}



