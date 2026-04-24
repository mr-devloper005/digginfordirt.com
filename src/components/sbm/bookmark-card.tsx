'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight, ArrowUp, Bookmark, MessageSquare, Share2, Clock, Check, Globe2, Tag } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { Bookmark as BookmarkType } from '@/types'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import { useRouter } from 'next/navigation'
import { loadFromStorage, saveToStorage, storageKeys } from '@/lib/local-storage'
import { useToast } from '@/components/ui/use-toast'

import { defaultAuthorProfile } from '@/config/site.identity'


export function BookmarkCard({
  bookmark,
  compact = false,
  showActions = true,
}: {
  bookmark: BookmarkType
  compact?: boolean
  showActions?: boolean
}) {
  const [mounted, setMounted] = useState(false)
  const [isUpvoted, setIsUpvoted] = useState(bookmark.isUpvoted)
  const [savedIds, setSavedIds] = useState<string[]>([])
  const [isSaved, setIsSaved] = useState(bookmark.isSaved)
  const [upvotes, setUpvotes] = useState(bookmark.upvotes)
  const [saves, setSaves] = useState(bookmark.saves)
  const [shareLabel, setShareLabel] = useState('Share')
  const router = useRouter()
  const { toast } = useToast()
  const author = bookmark.author ?? defaultAuthorProfile

  useEffect(() => {
    setMounted(true)
    setSavedIds(loadFromStorage<string[]>(storageKeys.bookmarkSaves, []))
  }, [])

  useEffect(() => {
    setIsSaved(savedIds.includes(bookmark.id) || bookmark.isSaved)
  }, [bookmark.id, bookmark.isSaved, savedIds])

  const handleUpvote = () => {
    setIsUpvoted((prev) => !prev)
    setUpvotes((prev) => (isUpvoted ? prev - 1 : prev + 1))
    toast({
      title: isUpvoted ? 'Upvote removed' : 'Upvoted',
      description: isUpvoted ? 'Removed your vote.' : 'Thanks for voting!',
    })
  }

  const handleSave = () => {
    const next = !isSaved
    setIsSaved(next)
    const nextIds = next
      ? Array.from(new Set([...savedIds, bookmark.id]))
      : savedIds.filter((id) => id !== bookmark.id)
    setSavedIds(nextIds)
    saveToStorage(storageKeys.bookmarkSaves, nextIds)
    setSaves((current) => current + (next ? 1 : -1))
    toast({
      title: next ? 'Bookmark saved' : 'Bookmark removed',
      description: next ? 'Added to your saved bookmarks.' : 'Removed from saved bookmarks.',
    })
  }

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(bookmark.url)
      setShareLabel('Copied')
      setTimeout(() => setShareLabel('Share'), 1500)
    } catch {
      setShareLabel('Copy failed')
      setTimeout(() => setShareLabel('Share'), 1500)
    }
  }

  const handleComments = () => {
    router.push(`/sbm/${bookmark.slug}#comments`)
  }

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Card className="curation-note group h-full overflow-hidden border-[rgba(80,96,136,0.12)] bg-transparent transition-all hover:border-[rgba(80,96,136,0.2)]">
        <Link href={`/sbm/${bookmark.slug}`} className="block">
          <div className="archive-grid border-b border-[rgba(80,96,136,0.1)] p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 flex-wrap items-center gap-2">
                <Badge className="bg-[#2f3d63] text-white">
                  <Tag className="mr-1 h-3.5 w-3.5" />
                  {bookmark.category}
                </Badge>
                <Badge variant="secondary" className="border border-[rgba(80,96,136,0.12)] bg-white/70 text-[#53607f]">
                  <Globe2 className="mr-1 h-3.5 w-3.5" />
                  {bookmark.domain}
                </Badge>
              </div>
              <div className="rounded-full border border-[rgba(80,96,136,0.12)] bg-white/76 p-2 text-[#53607f] transition group-hover:bg-[#2f3d63] group-hover:text-white">
                <ArrowUpRight className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
              <div className="archive-panel-muted rounded-[1.3rem] p-4 text-sm leading-6 text-[#53607f]">
                {bookmark.description}
              </div>
              <div className="archive-panel-muted flex min-w-[100px] flex-col justify-between rounded-[1.3rem] p-4 text-right text-xs text-[#7380a0]">
                <span className="font-semibold uppercase tracking-[0.18em]">Saved</span>
                <span suppressHydrationWarning className="text-sm font-medium text-[#21283f]">
                  {mounted ? formatDistanceToNow(new Date(bookmark.createdAt), { addSuffix: true }) : 'Just now'}
                </span>
              </div>
            </div>
          </div>
        </Link>

        <CardContent className={cn('p-5', compact && 'p-4')}>
          <div className="mb-3 flex items-center gap-2">
            <Avatar className={cn('h-7 w-7', compact && 'h-6 w-6')}>
              <AvatarImage src={author.avatar} alt={author.name} />
              <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="text-sm text-[#53607f]">
              <span className="font-medium text-[#21283f]">{author.name}</span>
              <span className="mx-2">•</span>
              <span>{bookmark.domain}</span>
            </div>
          </div>

          <Link href={`/sbm/${bookmark.slug}`}>
            <h3 className={cn('mb-2 font-semibold leading-tight text-[#21283f]', compact ? 'text-base' : 'text-lg')}>
              {bookmark.title}
            </h3>
          </Link>
          <p className={cn('mb-4 text-sm text-[#53607f]', compact ? 'line-clamp-2' : 'line-clamp-3')}>
            {bookmark.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {bookmark.tags.slice(0, compact ? 2 : 4).map((tag) => (
              <Badge key={tag} variant="outline" className="border-[rgba(80,96,136,0.12)] bg-white/70 text-xs text-[#53607f]">
                {tag}
              </Badge>
            ))}
          </div>

          {showActions && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Button
                variant={isUpvoted ? 'secondary' : 'ghost'}
                size="sm"
                className="gap-2"
                onClick={handleUpvote}
              >
                <ArrowUp className="h-4 w-4" />
                {upvotes}
              </Button>
              <Button
                variant={isSaved ? 'secondary' : 'ghost'}
                size="sm"
                className="gap-2"
                onClick={handleSave}
              >
                <Bookmark className={cn('h-4 w-4', isSaved && 'fill-current')} />
                {saves}
              </Button>
              <Button variant="ghost" size="sm" className="gap-2" onClick={handleComments}>
                <MessageSquare className="h-4 w-4" />
                {bookmark.commentsCount}
              </Button>
              <Button variant="ghost" size="sm" className="gap-2" onClick={handleShare}>
                {shareLabel === 'Copied' ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
                {shareLabel}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
