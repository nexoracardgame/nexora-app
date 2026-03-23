'use client'

import { useEffect, useRef, useState } from 'react'
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

export default function Feed({ currentUserId, refreshKey = 0, user }: Props) {
  const supabase = createClient()
  const [posts, setPosts] = useState<FeedPost[]>([])
  const [loading, setLoading] = useState(true)
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const fetchPosts = async () => {
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
      console.error('fetchPosts error:', error)
      return null
    }

    return (data || []) as FeedPost[]
  }

  const loadPosts = async () => {
    setLoading(true)
    const nextPosts = await fetchPosts()

    if (nextPosts) {
      setPosts(nextPosts)
    } else {
      setPosts([])
    }

    setLoading(false)
  }

  const silentRefreshPosts = async () => {
    const nextPosts = await fetchPosts()
    if (!nextPosts) return

    setPosts((prev) => {
      const prevJson = JSON.stringify(prev)
      const nextJson = JSON.stringify(nextPosts)
      if (prevJson === nextJson) return prev
      return nextPosts
    })
  }

  const fetchFullPost = async (postId: string) => {
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
      .eq('id', postId)
      .single()

    if (error || !data) {
      console.error('fetchFullPost error:', error)
      return null
    }

    return data as FeedPost
  }

  useEffect(() => {
    loadPosts()

    const handleNewPost = (event: Event) => {
      const customEvent = event as CustomEvent<FeedPost>
      const newPost = customEvent.detail
      if (!newPost?.id) return

      setPosts((prev) => {
        const exists = prev.some((p) => p.id === newPost.id)
        if (exists) {
          return prev.map((p) => (p.id === newPost.id ? newPost : p))
        }
        return [newPost, ...prev]
      })
    }

    const channel = supabase
      .channel('social-feed-realtime')

      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'posts',
        },
        async (payload) => {
          const postId = payload.new.id as string
          if (!postId) return

          const fullPost = await fetchFullPost(postId)
          if (!fullPost) return

          setPosts((prev) => {
            const exists = prev.some((p) => p.id === fullPost.id)
            if (exists) {
              return prev.map((p) => (p.id === fullPost.id ? fullPost : p))
            }
            return [fullPost, ...prev]
          })
        }
      )

      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'post_images',
        },
        async (payload) => {
          const postId = payload.new.post_id as string
          if (!postId) return

          const fullPost = await fetchFullPost(postId)
          if (!fullPost) return

          setPosts((prev) => {
            const exists = prev.some((p) => p.id === fullPost.id)
            if (!exists) return [fullPost, ...prev]
            return prev.map((p) => (p.id === fullPost.id ? fullPost : p))
          })
        }
      )

      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'post_likes',
        },
        (payload) => {
          const postId = payload.new.post_id as string
          const likerId = payload.new.user_id as string

          setPosts((prev) =>
            prev.map((p) =>
              p.id === postId
                ? {
                    ...p,
                    post_likes: p.post_likes.some((x) => x.user_id === likerId)
                      ? p.post_likes
                      : [...p.post_likes, { user_id: likerId }],
                  }
                : p
            )
          )
        }
      )

      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'post_likes',
        },
        (payload) => {
          const postId = payload.old.post_id as string
          const likerId = payload.old.user_id as string

          setPosts((prev) =>
            prev.map((p) =>
              p.id === postId
                ? {
                    ...p,
                    post_likes: p.post_likes.filter((x) => x.user_id !== likerId),
                  }
                : p
            )
          )
        }
      )

      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'comments',
        },
        (payload) => {
          const postId = payload.new.post_id as string
          const commentId = payload.new.id as string

          setPosts((prev) =>
            prev.map((p) =>
              p.id === postId
                ? {
                    ...p,
                    comments: p.comments.some((c) => c.id === commentId)
                      ? p.comments
                      : [...p.comments, { id: commentId }],
                  }
                : p
            )
          )
        }
      )

      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'comments',
        },
        (payload) => {
          const postId = payload.old.post_id as string
          const commentId = payload.old.id as string

          setPosts((prev) =>
            prev.map((p) =>
              p.id === postId
                ? {
                    ...p,
                    comments: p.comments.filter((c) => c.id !== commentId),
                  }
                : p
            )
          )
        }
      )

      .subscribe((status) => {
        console.log('social-feed-realtime:', status)
      })

    // กันพลาด: โหลดใหม่ทุก 3 วิ
    pollingRef.current = setInterval(() => {
      silentRefreshPosts()
    }, 3000)

    window.addEventListener('new-post', handleNewPost as EventListener)

    return () => {
      window.removeEventListener('new-post', handleNewPost as EventListener)
      if (pollingRef.current) clearInterval(pollingRef.current)
      supabase.removeChannel(channel)
    }
  }, [refreshKey])

  if (loading) {
    return (
      <div className="rounded-[28px] border border-white/10 bg-white/[0.03] px-5 py-10 text-center text-white/45">
        กำลังโหลดโพสต์...
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="rounded-[28px] border border-dashed border-white/10 bg-white/[0.03] px-5 py-10 text-center text-white/45">
        ยังไม่มีโพสต์ในระบบ
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {posts.map((post, index) => (
        <div key={post.id}>
          {index === 0 && (
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#f0c66a]/20 bg-[#f0c66a]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#f6d98d]">
              <span>Latest Drop</span>
            </div>
          )}

          <PostCard
            post={post}
            currentUserId={currentUserId}
            user={user}
          />
        </div>
      ))}
    </div>
  )
}