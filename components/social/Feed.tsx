'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import PostCard from './PostCard'

export type FeedPost = {
  id: string
  content: string | null
  created_at: string
  user_id: string
  user_name: string | null
  post_images: {
    id: string
    image_url: string
    sort_order: number
  }[]
  post_likes: { user_id: string }[]
  comments: { id: string }[]
}

type Props = {
  currentUserId?: string | null
  refreshKey?: number
  user?: any
}

export default function Feed({
  currentUserId,
  refreshKey = 0,
  user,
}: Props) {
  const supabase = useMemo(() => createClient(), [])
  const [posts, setPosts] = useState<FeedPost[]>([])
  const [loading, setLoading] = useState(true)

  const loadPosts = async () => {
    setLoading(true)

    const { data, error } = await supabase
      .from('posts')
      .select(`
        id,
        content,
        created_at,
        user_id,
        user_name,
        post_images (
          id,
          image_url,
          sort_order
        ),
        post_likes (
          user_id
        ),
        comments (
          id
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('loadPosts error:', error)
      setPosts([])
    } else {
      setPosts((data || []) as FeedPost[])
    }

    setLoading(false)
  }

  useEffect(() => {
    loadPosts()
  }, [refreshKey])

  if (loading) {
    return (
      <div className="space-y-4">
        <FeedTopBar countText="กำลังโหลดโพสต์..." />
        <FeedSkeleton />
        <FeedSkeleton />
        <FeedSkeleton />
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <FeedTopBar countText={`${posts.length} โพสต์ในฟีด`} />

      {posts.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center shadow-[0_20px_60px_rgba(0,0,0,0.28)]">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-[#ffb15c] to-[#7c4dff] text-2xl font-extrabold text-white">
            N
          </div>

          <h3 className="text-xl font-extrabold text-white">
            ยังไม่มีโพสต์ในระบบ
          </h3>

          <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-white/60">
            เริ่มโพสต์แรกของคอมมูนิตี้ NEXORA ได้เลย ระบบฟีดนี้พร้อมแสดงโพสต์
            รูปภาพ คอมเมนต์ และกิจกรรมของผู้เล่นทั้งหมด
          </p>
        </div>
      ) : (
        posts.map((post, index) => (
          <div
            key={post.id}
            className="group relative overflow-hidden rounded-[28px]"
          >
            <div className="pointer-events-none absolute inset-0 rounded-[28px] bg-gradient-to-br from-[#f0c66a]/8 via-transparent to-[#7c4dff]/8 opacity-70" />
            <div className="relative">
              <PostCard
                post={post}
                currentUserId={currentUserId}
                onRefresh={loadPosts}
                user={user}
              />
            </div>

            {index === 0 && (
              <div className="pointer-events-none absolute right-4 top-4 rounded-full border border-[#f0c66a]/20 bg-[#f0c66a]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#f6d98d]">
                Latest
              </div>
            )}
          </div>
        ))
      )}
    </div>
  )
}

function FeedTopBar({ countText }: { countText: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
      <div>
        <div className="text-xs font-bold uppercase tracking-[0.22em] text-[#f0c66a]">
          NEXORA SOCIAL FEED
        </div>
        <div className="mt-1 text-sm text-white/60">{countText}</div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-[#f0c66a]/20 bg-[#f0c66a]/10 px-3 py-1 text-xs font-bold text-[#f6d98d]">
          โพสต์ล่าสุด
        </span>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/70">
          รูปภาพ
        </span>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/70">
          คอมเมนต์
        </span>
      </div>
    </div>
  )
}

function FeedSkeleton() {
  return (
    <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(7,9,15,0.96))] shadow-[0_20px_60px_rgba(0,0,0,0.28)]">
      <div className="animate-pulse p-5">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-white/10" />
          <div className="flex-1">
            <div className="h-4 w-40 rounded bg-white/10" />
            <div className="mt-2 h-3 w-28 rounded bg-white/10" />
          </div>
        </div>

        <div className="mt-5 space-y-3">
          <div className="h-4 w-full rounded bg-white/10" />
          <div className="h-4 w-11/12 rounded bg-white/10" />
          <div className="h-4 w-8/12 rounded bg-white/10" />
        </div>

        <div className="mt-5 h-72 rounded-3xl bg-white/10" />

        <div className="mt-5 flex gap-3">
          <div className="h-10 flex-1 rounded-2xl bg-white/10" />
          <div className="h-10 flex-1 rounded-2xl bg-white/10" />
          <div className="h-10 flex-1 rounded-2xl bg-white/10" />
        </div>
      </div>
    </div>
  )
}