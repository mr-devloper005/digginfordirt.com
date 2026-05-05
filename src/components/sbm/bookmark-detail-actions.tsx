'use client'

import { useState } from 'react'
import { Share2, UserPlus, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'

export function BookmarkDetailActions({ url }: { url: string }) {
  const [shareLabel, setShareLabel] = useState('Share')
  const { toast } = useToast()
  const router = useRouter()

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setShareLabel('URL copied')
      toast({
        title: 'Link copied',
        description: 'URL copied to clipboard',
      })
      setTimeout(() => setShareLabel('Share'), 2000)
    } catch {
      toast({
        title: 'Failed to copy',
        description: 'Could not copy URL to clipboard',
        variant: 'destructive',
      })
    }
  }

  const handleFollow = () => {
    router.push('/login')
  }

  return (
    <div className="flex flex-wrap gap-3">
      <Button
        variant="outline"
        className="rounded-full border-[rgba(80,96,136,0.14)] bg-white/78 px-5 py-2.5 text-sm text-[#51607f] hover:bg-[#e8ecf5] hover:text-[#21283f]"
        onClick={handleShare}
      >
        {shareLabel === 'Copied' ? <Check className="mr-2 h-4 w-4" /> : <Share2 className="mr-2 h-4 w-4" />}
        {shareLabel}
      </Button>
      <Button
        variant="outline"
        className="rounded-full border-[rgba(80,96,136,0.14)] bg-white/78 px-5 py-2.5 text-sm text-[#51607f] hover:bg-[#e8ecf5] hover:text-[#21283f]"
        onClick={handleFollow}
      >
        <UserPlus className="mr-2 h-4 w-4" />
        Follow
      </Button>
    </div>
  )
}
