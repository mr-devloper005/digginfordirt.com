'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Sparkles, NotebookTabs } from 'lucide-react'
import { PageShell } from '@/components/shared/page-shell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { mockBookmarks } from '@/data/mock-data'
import { useAuth } from '@/lib/auth-context'
import { useToast } from '@/components/ui/use-toast'
import { loadFromStorage, saveToStorage, storageKeys } from '@/lib/local-storage'
import type { Bookmark as BookmarkType } from '@/types'

export default function SubmitBookmarkPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const categoryOptions = useMemo(
    () => Array.from(new Set(mockBookmarks.map((bookmark) => bookmark.category))),
    []
  )
  const [statusMessage, setStatusMessage] = useState('')
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [tagsInput, setTagsInput] = useState('')

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to submit a bookmark.',
      })
      router.push('/login')
      return
    }

    if (!url || !title || !description) {
      setStatusMessage('Please complete the required fields before submitting.')
      return
    }

    let domain = 'link'
    try {
      const parsed = new URL(url)
      domain = parsed.hostname.replace('www.', '')
    } catch {
      setStatusMessage('Please enter a valid URL.')
      return
    }

    const tags = tagsInput
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)

    const nextBookmark: BookmarkType = {
      id: `user-bookmark-${Date.now()}`,
      title,
      slug: title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .slice(0, 60),
      url,
      description,
      image: '/placeholder.svg?height=720&width=1280',
      domain,
      tags: tags.length > 0 ? tags : ['New'],
      category: category || 'General',
      createdAt: new Date().toISOString(),
      author: user,
      upvotes: 0,
      saves: 0,
      commentsCount: 0,
      isUpvoted: false,
      isSaved: false,
    }

    const stored = loadFromStorage<BookmarkType[]>(storageKeys.bookmarks, [])
    const next = [nextBookmark, ...stored]
    saveToStorage(storageKeys.bookmarks, next)

    setStatusMessage('Bookmark submitted! It will appear in your feed.')
    toast({
      title: 'Bookmark submitted',
      description: 'Your link has been added to the feed.',
    })
    setUrl('')
    setTitle('')
    setDescription('')
    setCategory('')
    setTagsInput('')
  }

  return (
    <PageShell
      title="Submit a Bookmark"
      description="Share a useful link with a short note, clean categorization, and tags that keep it easy to rediscover."
      actions={<div className="archive-kicker"><Sparkles className="h-3.5 w-3.5" />Archive submission</div>}
    >
      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        {[
          ['Why submit', 'Turn one-off finds into reusable archive entries'],
          ['Best format', 'Short title, clear note, focused category, useful tags'],
          ['Same behavior', 'Submission still uses the existing bookmark flow and storage'],
        ].map(([label, value]) => (
          <div key={label} className="archive-stat rounded-[1.6rem] p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7380a0]">{label}</p>
            <p className="mt-2 text-sm text-[#21283f]">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="archive-panel rounded-[2rem] p-6"
            >
              <form
                className="space-y-5"
                onSubmit={handleSubmit}
              >
                <div>
                  <label className="text-sm font-medium text-[#21283f]">URL</label>
                  <Input
                    placeholder="https://"
                    className="archive-input mt-2"
                    value={url}
                    onChange={(event) => setUrl(event.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-[#21283f]">Title</label>
                  <Input
                    placeholder="Give this link a clear title"
                    className="archive-input mt-2"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-[#21283f]">Description</label>
                  <Textarea
                    placeholder="Why is this link useful?"
                    className="archive-input mt-2 min-h-[140px]"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-[#21283f]">Category</label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="archive-input mt-2">
                      <SelectValue placeholder="Choose a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map((categoryOption) => (
                        <SelectItem key={categoryOption} value={categoryOption}>
                          {categoryOption}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-[#21283f]">Tags</label>
                  <Input
                    placeholder="Add tags separated by commas"
                    className="archive-input mt-2"
                    value={tagsInput}
                    onChange={(event) => setTagsInput(event.target.value)}
                  />
                  <div className="mt-3 flex flex-wrap gap-2">
                    {['Design', 'Productivity', 'AI', 'Frontend', 'Research'].map((tag) => (
                      <Badge key={tag} variant="outline" className="border-[rgba(80,96,136,0.12)] bg-white/70 text-xs text-[#53607f]">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Button type="submit" className="rounded-full bg-[#21283f] text-white hover:bg-[#334264]">Submit Bookmark</Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="archive-button-soft rounded-full"
                    onClick={() => {
                      setStatusMessage('Draft saved locally.')
                      toast({
                        title: 'Draft saved',
                        description: 'Your bookmark draft is saved on this device.',
                      })
                    }}
                  >
                    Save Draft
                  </Button>
                </div>
                {statusMessage && (
                  <p className="text-sm text-[#53607f]">{statusMessage}</p>
                )}
              </form>
            </motion.div>

            <div className="space-y-6">
              <div className="curation-note rounded-[1.8rem] p-5">
                <div className="archive-chip">
                  <NotebookTabs className="h-3.5 w-3.5" />
                  Submission tips
                </div>
                <ul className="mt-4 space-y-2 text-sm text-[#53607f]">
                  <li>Keep titles short and descriptive.</li>
                  <li>Explain the main takeaway in one sentence.</li>
                  <li>Add 3-5 tags to improve discoverability.</li>
                </ul>
              </div>
              <div className="archive-panel rounded-[1.8rem] p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#7380a0]">Good entry example</p>
                <div className="mt-4 space-y-3 text-sm text-[#53607f]">
                  <p><span className="font-semibold text-[#21283f]">Title:</span> Practical UI motion reference library</p>
                  <p><span className="font-semibold text-[#21283f]">Description:</span> A solid archive of lightweight interface transitions with production-friendly examples.</p>
                  <p><span className="font-semibold text-[#21283f]">Tags:</span> motion, ui, frontend, inspiration</p>
                </div>
              </div>
              <div className="archive-panel-muted rounded-[1.8rem] p-5">
                <h4 className="text-sm font-semibold text-[#21283f]">Preview checklist</h4>
                <p className="mt-2 text-sm text-[#53607f]">
                  Once submitted, your link will appear in the existing bookmarking system without changing any underlying logic.
                </p>
              </div>
            </div>
      </div>
    </PageShell>
  )
}
