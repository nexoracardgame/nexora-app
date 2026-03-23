'use client'

import MessageButton from '@/components/MessageButton'
import React, { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import AddFriendButton from '@/components/AddFriendButton'
import type { FeedPost } from './Feed'

type Props = {
  post: FeedPost
  currentUserId?: string | null
  user?: any
}

type PostComment = {
  id: string
  content: string | null
  created_at: string
  user_id: string
}

type ProfileMap = Record<
  string,
  {
    display_name: string | null
    avatar_url: string | null
  }
>

function PostCard({
  post,
  currentUserId,
  user,
}: Props) {
  const supabase = createClient()

  const [commentText, setCommentText] = useState('')
  const [comments, setComments] = useState<PostComment[]>([])
  const [profiles, setProfiles] = useState<ProfileMap>({})
  const [loadingComments, setLoadingComments] = useState(true)

  const [submittingComment, setSubmittingComment] = useState(false)
  const [togglingLike, setTogglingLike] = useState(false)

  const [localLikes, setLocalLikes] = useState(post.post_likes || [])

  const liked = localLikes.some((like) => like.user_id === currentUserId)
  const likeCount = localLikes.length

  const sortedImages = useMemo(() => {
    return [...(post.post_images || [])].sort((a, b) => a.sort_order - b.sort_order)
  }, [post.post_images])

  const loadProfiles = async (userIds: string[]) => {
    const uniqueIds = Array.from(new Set(userIds.filter(Boolean)))
    if (uniqueIds.length === 0) return

    const { data, error } = await supabase
      .from('profiles')
      .select('id, display_name, avatar_url')
      .in('id', uniqueIds)

    if (error) {
      console.log('profiles พัง แต่ข้ามไปก่อน')
      setProfiles({})
      return
    }

    const nextMap: ProfileMap = {}
    ;(data || []).forEach((item: any) => {
      nextMap[item.id] = {
        display_name: item.display_name,
        avatar_url: item.avatar_url,
      }
    })

    setProfiles((prev) => ({ ...prev, ...nextMap }))
  }

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
      setLoadingComments(false)
      return
    }

    const nextComments = (data || []) as PostComment[]
    setComments(nextComments)

    const commentUserIds = nextComments.map((c) => c.user_id)
    await loadProfiles([post.user_id, ...commentUserIds])

    setLoadingComments(false)
  }

  useEffect(() => {
    setLocalLikes(post.post_likes || [])
  }, [post.post_likes])

  useEffect(() => {
    loadComments()
  }, [post.id])

  useEffect(() => {
    const channel = supabase
      .channel('post-like-' + post.id)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'post_likes',
          filter: `post_id=eq.${post.id}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setLocalLikes((prev) => {
              if (prev.some((l) => l.user_id === payload.new.user_id)) return prev
              return [...prev, { user_id: payload.new.user_id }]
            })
          }

          if (payload.eventType === 'DELETE') {
            setLocalLikes((prev) =>
              prev.filter((l) => l.user_id !== payload.old.user_id)
            )
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [post.id, supabase])

  useEffect(() => {
    const channel = supabase
      .channel('post-comment-' + post.id)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comments',
          filter: `post_id=eq.${post.id}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setComments((prev) => {
              if (prev.some((c) => c.id === payload.new.id)) return prev
              return [...prev, payload.new as PostComment]
            })

            loadProfiles([payload.new.user_id])
          }

          if (payload.eventType === 'DELETE') {
            setComments((prev) =>
              prev.filter((c) => c.id !== payload.old.id)
            )
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [post.id, supabase])

  const handleToggleLike = async () => {
    if (!currentUserId) {
      alert('กรุณาเข้าสู่ระบบก่อน')
      return
    }

    if (togglingLike) return

    const isLiked = localLikes.some((l) => l.user_id === currentUserId)

    if (isLiked) {
      setLocalLikes((prev) => prev.filter((l) => l.user_id !== currentUserId))
    } else {
      setLocalLikes((prev) => [...prev, { user_id: currentUserId }])
    }

    try {
      setTogglingLike(true)

      if (isLiked) {
        await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', post.id)
          .eq('user_id', currentUserId)
      } else {
        await supabase
          .from('post_likes')
          .insert({
            post_id: post.id,
            user_id: currentUserId,
          })
      }
    } catch (error) {
      console.error(error)

      if (isLiked) {
        setLocalLikes((prev) => [...prev, { user_id: currentUserId }])
      } else {
        setLocalLikes((prev) => prev.filter((l) => l.user_id !== currentUserId))
      }
    } finally {
      setTogglingLike(false)
    }
  }

  const handleComment = async () => {
    const trimmed = commentText.trim()
    if (!trimmed || submittingComment) return

    try {
      setSubmittingComment(true)

      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()

      if (!authUser?.id) return

      setCommentText('')

      const { error } = await supabase.from('comments').insert({
        post_id: post.id,
        user_id: authUser.id,
        content: trimmed,
      })

      if (error) {
        console.error(error)
        setCommentText(trimmed)
      }
    } catch (error) {
      console.error(error)
      setCommentText(trimmed)
    } finally {
      setSubmittingComment(false)
    }
  }

  const commentCount = comments.length

  const postProfile = profiles[post.user_id]
  const postDisplayName =
    postProfile?.display_name ||
    post.user_name?.trim() ||
    'NEXORA User'

  const postAvatarUrl = postProfile?.avatar_url || null
  const postAvatarText = postDisplayName.charAt(0).toUpperCase()

  const currentUserAvatarUrl =
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.picture ||
    null

  return (
    <article className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,20,31,0.98),rgba(7,9,15,0.98))] text-white shadow-[0_24px_80px_rgba(0,0,0,0.42)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(124,77,255,0.14),transparent_24%),radial-gradient(circle_at_top_left,rgba(240,198,106,0.12),transparent_22%)]" />
      <div className="pointer-events-none h-[2px] w-full bg-gradient-to-r from-transparent via-[#f0c66a]/80 to-transparent" />

      <div className="relative p-5 md:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full ring-2 ring-white/10">
              {postAvatarUrl ? (
                <img
                  src={postAvatarUrl || '/default-avatar.png'}
                  alt={postDisplayName}
                  onError={(e) => {
                    e.currentTarget.src = '/default-avatar.png'
                  }}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#ffb15c] via-[#d58a41] to-[#7c4dff] text-lg font-extrabold text-white">
                  {postAvatarText}
                </div>
              )}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="truncate text-[20px] font-extrabold leading-none text-white">
                  {postDisplayName}
                </h3>

                <span className="rounded-full border border-[#f0c66a]/20 bg-[#f0c66a]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#f6d98d]">
                  Live Feed
                </span>
              </div>

              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-white/45">
                <span>{formatThaiDate(post.created_at)}</span>
                <span className="text-white/20">•</span>
                <span>{timeAgo(post.created_at)}</span>
              </div>
            </div>
          </div>
        </div>

        {post.content ? (
          <div className="mt-5 rounded-[22px] border border-white/6 bg-white/[0.03] px-4 py-4 text-[15px] leading-8 text-white/90">
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
                <div className="flex items-center justify-center bg-black/30">
                  <img
                    src={img.image_url}
                    alt={`post image ${index + 1}`}
                    className="block h-auto max-h-[720px] w-full object-contain"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-5 rounded-[22px] border border-white/8 bg-white/[0.03] px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <button
                onClick={handleToggleLike}
                disabled={togglingLike}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 transition-all duration-300 ${
                  liked
                    ? 'border-[#ff6aa2]/40 bg-[#ff4d8d]/10 text-[#ff9fc4] shadow-[0_0_22px_rgba(255,77,141,0.28)]'
                    : 'border-white/10 bg-white/[0.04] text-white/75 hover:border-white/20 hover:bg-white/[0.07]'
                }`}
              >
                <span className="text-[15px] leading-none">{liked ? '❤️' : '🤍'}</span>
                <span className="font-bold">{likeCount}</span>
              </button>

              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-white/75 backdrop-blur-md">
                <span className="text-[#f0c66a]">💬</span>
                <span className="font-bold">{commentCount}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <AddFriendButton targetUserId={post.user_id} />
              <MessageButton targetUserId={post.user_id} />
            </div>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01))] px-5 py-5 md:px-6">
        <div className="mb-4 rounded-[22px] border border-white/8 bg-white/[0.03] p-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2 ring-white/10">
              {currentUserAvatarUrl ? (
                <img
                  src={currentUserAvatarUrl || '/default-avatar.png'}
                  alt="your avatar"
                  onError={(e) => {
                    e.currentTarget.src = '/default-avatar.png'
                  }}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#ffb15c] to-[#7c4dff] text-sm font-extrabold text-white">
                  {(user?.email?.[0] || 'N').toUpperCase()}
                </div>
              )}
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
                  type="button"
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
            comments.map((comment) => {
              const isMe = comment.user_id === currentUserId
              const commentProfile = profiles[comment.user_id]
              const commentDisplayName =
                isMe ? 'คุณ' : commentProfile?.display_name || 'สมาชิก NEXORA'
              const commentAvatarUrl =
                isMe ? currentUserAvatarUrl : commentProfile?.avatar_url || null
              const commentAvatarText =
                (commentDisplayName?.charAt(0) || 'N').toUpperCase()

              return (
                <div
                  key={comment.id}
                  className="rounded-[22px] border border-white/8 bg-white/[0.035] p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full ring-2 ring-white/10">
                      {commentAvatarUrl ? (
                        <img
                          src={commentAvatarUrl || '/default-avatar.png'}
                          alt={commentDisplayName}
                          onError={(e) => {
                            e.currentTarget.src = '/default-avatar.png'
                          }}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#6f7cff] to-[#7c4dff] text-xs font-extrabold text-white">
                          {commentAvatarText}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="text-sm font-bold text-white">
                          {commentDisplayName}
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
              )
            })
          )}
        </div>
      </div>
    </article>
  )
}

export default React.memo(PostCard)

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