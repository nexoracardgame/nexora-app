'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { FeedPost } from './Feed'

type Props = {
  post: FeedPost
  currentUserId?: string | null
  onRefresh?: () => void
  user?: any
}

type PostComment = {
  id: string
  content: string | null
  created_at: string
  user_id: string
}

export default function PostCard({
  post,
  currentUserId,
  onRefresh,
  user,
}: Props) {
  const supabase = createClient()
  const [commentText, setCommentText] = useState('')
  const [comments, setComments] = useState<PostComment[]>([])
  const [loadingComments, setLoadingComments] = useState(true)
  const [submittingComment, setSubmittingComment] = useState(false)
  const [togglingLike, setTogglingLike] = useState(false)

  const liked = !!post.post_likes?.some((like) => like.user_id === currentUserId)
  const likeCount = post.post_likes?.length || 0

  const sortedImages = useMemo(() => {
    return [...(post.post_images || [])].sort((a, b) => a.sort_order - b.sort_order)
  }, [post.post_images])

  const avatarText = useMemo(() => {
    const name = post.user_name?.trim() || 'NEXORA User'
    return name.charAt(0).toUpperCase()
  }, [post.user_name])

  const displayName = post.user_name?.trim() || 'NEXORA User'

  const loadComments = async () => {
    setLoadingComments(true)

    const { data, error } = await supabase
      .from('comments')
      .select('id, content, created_at, user_id')
      .eq('post_id', post.id)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('loadComments error:', error)
      setComments([])
    } else {
      setComments((data || []) as PostComment[])
    }

    setLoadingComments(false)
  }

  useEffect(() => {
    loadComments()
  }, [post.id])

  const handleToggleLike = async () => {
    if (!currentUserId) {
      alert('กรุณาเข้าสู่ระบบก่อน')
      return
    }

    try {
      setTogglingLike(true)

      if (liked) {
        const { error } = await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', post.id)
          .eq('user_id', currentUserId)

        if (error) throw error
      } else {
        const { error } = await supabase.from('post_likes').insert({
          post_id: post.id,
          user_id: currentUserId,
        })

        if (error) throw error
      }

      onRefresh?.()
    } catch (error) {
      console.error(error)
      alert('อัปเดตไลก์ไม่สำเร็จ')
    } finally {
      setTogglingLike(false)
    }
  }

  const handleComment = async () => {
    if (!currentUserId) {
      alert('กรุณาเข้าสู่ระบบก่อน')
      return
    }

    const trimmed = commentText.trim()
    if (!trimmed) return

    try {
      setSubmittingComment(true)

      const { error } = await supabase.from('comments').insert({
        post_id: post.id,
        user_id: currentUserId,
        content: trimmed,
      })

      if (error) throw error

      setCommentText('')
      await loadComments()
      onRefresh?.()
    } catch (error) {
      console.error(error)
      alert('คอมเมนต์ไม่สำเร็จ')
    } finally {
      setSubmittingComment(false)
    }
  }

  const commentCount = comments.length

  return (
    <article className="mb-6 overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(18,22,35,0.96),rgba(8,10,16,0.98))] text-white shadow-[0_24px_70px_rgba(0,0,0,0.34)] ring-1 ring-[#f0c66a]/6">
      <div className="pointer-events-none h-[2px] w-full bg-gradient-to-r from-transparent via-[#f0c66a]/70 to-transparent" />

      <div className="p-5 md:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#ffb15c] via-[#d58a41] to-[#7c4dff] text-lg font-extrabold text-white shadow-[0_12px_30px_rgba(124,77,255,0.22)]">
              {avatarText}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="truncate text-[20px] font-extrabold leading-none text-white">
                  {displayName}
                </h3>

                <span className="rounded-full border border-[#f0c66a]/20 bg-[#f0c66a]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#f6d98d]">
                  Social Post
                </span>
              </div>

              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-white/50">
                <span>{formatThaiDate(post.created_at)}</span>
                <span className="text-white/20">•</span>
                <span>{timeAgo(post.created_at)}</span>
              </div>
            </div>
          </div>

          <button className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-lg text-white/70 transition hover:bg-white/10 hover:text-white">
            ⋯
          </button>
        </div>

        {post.content ? (
          <div className="mt-5 rounded-[22px] border border-white/6 bg-white/[0.025] px-4 py-4 text-[15px] leading-8 text-white/90">
            {post.content}
          </div>
        ) : null}

        {sortedImages.length > 0 && (
          <div
            className={`mt-5 grid gap-3 ${
              sortedImages.length === 1 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'
            }`}
          >
            {sortedImages.map((img, index) => (
              <div
                key={img.id}
                className={`overflow-hidden rounded-[24px] border border-white/10 bg-black/30 ${
                  sortedImages.length === 3 && index === 0 ? 'md:col-span-2' : ''
                }`}
              >
                <img
                  src={img.image_url}
                  alt={`post image ${index + 1}`}
                  className="h-full max-h-[520px] w-full object-cover transition duration-300 hover:scale-[1.02]"
                />
              </div>
            ))}
          </div>
        )}

        <div className="mt-5 rounded-[20px] border border-white/8 bg-white/[0.025] px-4 py-3">
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-white/80">
              <span className="text-[#ff8f8f]">♥</span>
              <span className="font-semibold">{likeCount} ไลก์</span>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-white/80">
              <span className="text-[#f0c66a]">💬</span>
              <span className="font-semibold">{commentCount} คอมเมนต์</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
            <button
              onClick={handleToggleLike}
              disabled={togglingLike}
              className={`inline-flex h-12 items-center justify-center gap-2 rounded-2xl border font-bold transition ${
                liked
                  ? 'border-[#f0c66a]/20 bg-[#f0c66a]/12 text-[#f6d98d]'
                  : 'border-white/10 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span>{liked ? '♥' : '♡'}</span>
              <span>{liked ? 'ยกเลิกไลก์' : 'ไลก์โพสต์'}</span>
            </button>

            <button className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 font-bold text-white/80 transition hover:bg-white/10 hover:text-white">
              <span>💬</span>
              <span>คอมเมนต์</span>
            </button>

            <button className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 font-bold text-white/80 transition hover:bg-white/10 hover:text-white max-md:col-span-2">
              <span>↗</span>
              <span>แชร์</span>
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01))] px-5 py-5 md:px-6">
        <div className="mb-4 rounded-[22px] border border-white/8 bg-white/[0.03] p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#ffb15c] to-[#7c4dff] text-sm font-extrabold text-white">
              {(user?.email?.[0] || 'N').toUpperCase()}
            </div>

            <div className="flex-1">
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleComment()
                    }
                  }}
                  placeholder="เขียนคอมเมนต์ในโพสต์นี้..."
                  className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none placeholder:text-white/40 focus:border-[#f0c66a]/30 focus:bg-white/[0.07]"
                />

                <button
                  onClick={handleComment}
                  disabled={submittingComment}
                  className="h-12 shrink-0 rounded-2xl bg-gradient-to-r from-[#fff0b4] via-[#e6bb57] to-[#c88d27] px-5 font-extrabold text-[#17130a] transition hover:brightness-105 disabled:opacity-70"
                >
                  {submittingComment ? 'กำลังส่ง...' : 'ส่ง'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {loadingComments ? (
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/50">
              กำลังโหลดคอมเมนต์...
            </div>
          ) : comments.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-4 text-sm text-white/45">
              ยังไม่มีคอมเมนต์ในโพสต์นี้
            </div>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="rounded-[22px] border border-white/8 bg-white/[0.035] p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#6f7cff] to-[#7c4dff] text-xs font-extrabold text-white">
                    {comment.user_id === currentUserId ? 'Y' : 'N'}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="text-sm font-bold text-white">
                        {comment.user_id === currentUserId ? 'คุณ' : 'สมาชิก NEXORA'}
                      </div>
                      <div className="text-[11px] text-white/40">
                        {formatThaiDate(comment.created_at)}
                      </div>
                    </div>

                    <div className="mt-1 whitespace-pre-wrap text-sm leading-7 text-white/80">
                      {comment.content}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </article>
  )
}

function formatThaiDate(dateString: string) {
  try {
    return new Date(dateString).toLocaleString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return dateString
  }
}

function timeAgo(dateString: string) {
  const now = new Date().getTime()
  const then = new Date(dateString).getTime()
  const diff = Math.max(0, now - then)

  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour

  if (diff < hour) {
    const m = Math.max(1, Math.floor(diff / minute))
    return `${m} นาทีที่แล้ว`
  }

  if (diff < day) {
    const h = Math.floor(diff / hour)
    return `${h} ชั่วโมงที่แล้ว`
  }

  const d = Math.floor(diff / day)
  return `${d} วันที่แล้ว`
}