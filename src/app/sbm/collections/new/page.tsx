'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PageShell } from '@/components/shared/page-shell'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/components/ui/use-toast'
import { loadFromStorage, saveToStorage, storageKeys } from '@/lib/local-storage'
import type { BookmarkCollection } from '@/types'

export default function NewCollectionPage() {
  const [isPrivate, setIsPrivate] = useState(false)
  const [saved, setSaved] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const { toast } = useToast()

  return (
    <PageShell
      title="New Collection"
      description="Create a new archive shelf for related links, long-tail references, or private research trails."
      actions={
        <Button variant="outline" asChild className="archive-button-soft rounded-full">
          <Link href="/sbm/collections">Back to Collections</Link>
        </Button>
      }
    >
      <Card className="archive-panel border-[rgba(83,96,127,0.14)] bg-transparent">
        <CardContent className="grid gap-8 p-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ['Use it for', 'Topic shelves and saved references'],
                ['Privacy', isPrivate ? 'Private to your account' : 'Visible in your collection space'],
                ['Structure', 'Fresh layout, same storage and route behavior'],
              ].map(([label, value]) => (
                <div key={label} className="archive-stat rounded-[1.2rem] p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7380a0]">{label}</p>
                  <p className="mt-2 text-sm text-[#21283f]">{value}</p>
                </div>
              ))}
            </div>
            <div>
              <label className="text-sm font-medium text-[#21283f]">Collection Name</label>
              <Input
                className="archive-input mt-2"
                placeholder="Design Systems"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#21283f]">Description</label>
              <Textarea
                className="archive-input mt-2 min-h-[160px]"
                placeholder="What belongs in this folder?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="archive-panel-muted flex items-center justify-between rounded-[1.6rem] p-4">
              <div>
                <p className="text-sm font-medium text-[#21283f]">Private Collection</p>
                <p className="text-xs text-[#53607f]">Only visible to you.</p>
              </div>
              <Switch checked={isPrivate} onCheckedChange={setIsPrivate} />
            </div>
            <Button
              className="w-full rounded-full bg-[#21283f] text-white hover:bg-[#334264]"
              onClick={() => {
                if (!name.trim()) {
                  toast({ title: 'Name required', description: 'Give your collection a name.' })
                  return
                }
                const newCollection: BookmarkCollection = {
                  id: `user-collection-${Date.now()}`,
                  name: name.trim(),
                  description: description.trim() || 'Personal collection',
                  updatedAt: new Date().toISOString(),
                  isPrivate,
                  bookmarks: [],
                  coverImages: ['/placeholder.svg?height=240&width=240'],
                }
                const stored = loadFromStorage<BookmarkCollection[]>(storageKeys.bookmarkCollections, [])
                saveToStorage(storageKeys.bookmarkCollections, [newCollection, ...stored])
                setSaved(true)
                toast({ title: 'Collection created', description: 'Your collection is ready.' })
              }}
            >
              Create Collection
            </Button>
            {saved && <p className="text-sm text-[#53607f]">Collection created.</p>}
          </div>

          <div className="space-y-4">
            <div className="curation-note rounded-[1.8rem] p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#7380a0]">How this will look</p>
              <h2 className="mt-3 text-2xl font-semibold text-[#21283f]">{name.trim() || 'Untitled collection'}</h2>
              <p className="mt-3 text-sm leading-7 text-[#53607f]">
                {description.trim() || 'A focused shelf for saved links, references, and revisit-worthy sources.'}
              </p>
            </div>
            <div className="archive-panel-muted rounded-[1.8rem] p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#7380a0]">Collection notes</p>
              <ul className="mt-3 space-y-2 text-sm text-[#53607f]">
                <li>Use short, specific names so folders stay easy to scan.</li>
                <li>Descriptions work best when they explain why the links belong together.</li>
                <li>Private shelves stay personal without changing underlying bookmark logic.</li>
              </ul>
            </div>
            <div className="archive-panel rounded-[1.8rem] p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#7380a0]">Starter ideas</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {['Design references', 'AI tools', 'Case studies', 'Competitor notes', 'Long reads'].map((item) => (
                  <span key={item} className="archive-chip">{item}</span>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </PageShell>
  )
}
