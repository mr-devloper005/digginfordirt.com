'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, NotebookTabs } from 'lucide-react'
import Link from 'next/link'
import { PageShell } from '@/components/shared/page-shell'
import { BookmarkCard } from '@/components/sbm/bookmark-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { mockBookmarkCollections } from '@/data/mock-data'
import type { BookmarkCollection } from '@/types'
import { loadFromStorage, saveToStorage, storageKeys } from '@/lib/local-storage'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'

export default function BookmarkCollectionDetailPage() {
  const params = useParams()
  const id = params?.id as string
  const [storedCollections, setStoredCollections] = useState<BookmarkCollection[]>([])
  const [confirmDelete, setConfirmDelete] = useState(false)
  const { toast } = useToast()
  const collection = useMemo(() => {
    const map = new Map<string, BookmarkCollection>()
    storedCollections.forEach((item) => map.set(item.id, item))
    mockBookmarkCollections.forEach((item) => {
      if (!map.has(item.id)) map.set(item.id, item)
    })
    return map.get(id)
  }, [id, storedCollections])

  useEffect(() => {
    setStoredCollections(loadFromStorage<BookmarkCollection[]>(storageKeys.bookmarkCollections, []))
  }, [])

  if (!collection) {
    return (
      <div className="archive-shell min-h-screen">
        <main className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
          <Card className="border-border bg-card">
            <CardContent className="p-10 text-center">
              <h1 className="text-2xl font-semibold text-foreground">Collection not found</h1>
              <p className="mt-2 text-muted-foreground">Try exploring other bookmark collections.</p>
              <Button className="mt-6" asChild>
                <Link href="/sbm/collections">Back to collections</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <>
      <PageShell
      title={collection.name}
      description={collection.description}
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" asChild className="archive-button-soft rounded-full">
            <Link href="/sbm/collections">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to collections
            </Link>
          </Button>
          {collection.isPrivate && <Badge variant="secondary" className="border border-[rgba(80,96,136,0.12)] bg-white/70 text-[#53607f]">Private</Badge>}
          <Badge variant="outline" className="border-[rgba(80,96,136,0.12)] bg-white/70 text-[#53607f]">{collection.bookmarks.length} bookmarks</Badge>
          {collection.id.startsWith('user-') && (
            <Button variant="destructive" size="sm" className="rounded-full" onClick={() => setConfirmDelete(true)}>
              Delete Collection
            </Button>
          )}
        </div>
      }
    >
      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        {[
          ['Collection type', collection.isPrivate ? 'Private archive shelf' : 'Shared archive shelf'],
          ['Saved entries', `${collection.bookmarks.length} bookmarks in this folder`],
          ['Presentation', 'Image-light note cards built for revisiting sources'],
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
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#7380a0]">Shelf overview</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-[#21283f]">
            A working folder for links that belong together, not just links that arrived at the same time.
          </h2>
          <p className="mt-4 text-sm leading-7 text-[#53607f]">
            This page keeps the same bookmark behavior underneath, but the layout now frames the collection like an archive shelf with clearer context, less noise, and stronger revisit cues.
          </p>
        </section>
        <section className="grid gap-4">
          <div className="curation-note rounded-[1.8rem] p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#7380a0]">Collection rhythm</p>
            <ul className="mt-4 space-y-3 text-sm text-[#53607f]">
              <li>Save practical links you return to repeatedly.</li>
              <li>Keep each shelf focused enough to scan in one pass.</li>
              <li>Use tags inside bookmarks to add a second level of organization.</li>
            </ul>
          </div>
          <div className="archive-panel-muted rounded-[1.8rem] p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#7380a0]">Access rule</p>
            <p className="mt-3 text-sm leading-7 text-[#53607f]">
              This collection stays fully compatible with the existing bookmarking flow, saved-state behavior, and local storage structure.
            </p>
          </div>
        </section>
      </div>

      {collection.bookmarks.length === 0 ? (
        <Card className="archive-panel border-[rgba(83,96,127,0.14)] bg-transparent">
          <CardContent className="p-8 text-center">
            <h2 className="text-lg font-semibold text-[#21283f]">No bookmarks yet</h2>
            <p className="mt-2 text-sm text-[#53607f]">
              Start saving links to populate this collection.
            </p>
            <Button className="mt-6 rounded-full bg-[#21283f] text-white hover:bg-[#334264]" asChild>
              <Link href="/sbm">Explore bookmarks</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-6 md:grid-cols-2"
        >
          {collection.bookmarks.map((bookmark) => (
            <BookmarkCard key={bookmark.id} bookmark={bookmark} />
          ))}
        </motion.div>
      )}
      </PageShell>
      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this collection?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This will remove the collection from your saved folders.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(false)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={() => {
                const next = storedCollections.filter((item) => item.id !== collection.id)
                saveToStorage(storageKeys.bookmarkCollections, next)
                setStoredCollections(next)
                setConfirmDelete(false)
                toast({ title: 'Collection deleted', description: 'The collection was removed.' })
              }}
            >
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
