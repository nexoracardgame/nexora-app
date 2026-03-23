'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type DMMessage = {
  id: string
  room_id: string
  sender_id: string
  content: string
  created_at: string
}

type Profile = {
  id: string
  display_name: string | null
  avatar_url: string | null
}

type Room = {
  id: string
  user1: string
  user2: string
  user1_last_read_at: string | null
  user2_last_read_at: string | null
}

export default function DMPage() {
  const supabase = useMemo(() => createClient(), [])
  const params = useParams()
  const roomId = params.roomId as string

  const [myId, setMyId] = useState<string | null>(null)
  const [messages, setMessages] = useState<DMMessage[]>([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [otherUser, setOtherUser] = useState<Profile | null>(null)

  const bottomRef = useRef<HTMLDivElement | null>(null)

  const scrollToBottom = (smooth = true) => {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' })
    }, 50)
  }

  const markAsRead = async (userId: string) => {
  const { data: room, error } = await supabase
    .from('dm_rooms')
    .select('id, user1, user2')
    .eq('id', roomId)
    .single()

  if (error || !room) return

  let updateError = null

  if (room.user1 === userId) {
    const { error } = await supabase
      .from('dm_rooms')
      .update({ user1_last_read_at: new Date().toISOString() })
      .eq('id', roomId)

    updateError = error
  } else if (room.user2 === userId) {
    const { error } = await supabase
      .from('dm_rooms')
      .update({ user2_last_read_at: new Date().toISOString() })
      .eq('id', roomId)

    updateError = error
  }

  if (!updateError) {
    window.dispatchEvent(new CustomEvent('dm-read-updated'))
  }
}

  const loadRoomAndUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user?.id) {
      setLoading(false)
      return
    }

    setMyId(user.id)

    const { data: room, error: roomError } = await supabase
      .from('dm_rooms')
      .select('id, user1, user2, user1_last_read_at, user2_last_read_at')
      .eq('id', roomId)
      .single()

    if (roomError || !room) {
      setLoading(false)
      return
    }

    const targetUserId = room.user1 === user.id ? room.user2 : room.user1

    const { data: profile } = await supabase
      .from('profiles')
      .select('id, display_name, avatar_url')
      .eq('id', targetUserId)
      .single()

    if (profile) {
      setOtherUser(profile)
    }

    await markAsRead(user.id)
  }

  const loadMessages = async () => {
    const { data, error } = await supabase
      .from('dm_messages')
      .select('*')
      .eq('room_id', roomId)
      .order('created_at', { ascending: true })

    if (!error) {
      setMessages((data || []) as DMMessage[])
    }

    setLoading(false)
    scrollToBottom(false)
  }

  useEffect(() => {
  const onFocus = async () => {
    if (myId) {
      await markAsRead(myId)
    }
  }

  window.addEventListener('focus', onFocus)

  return () => {
    window.removeEventListener('focus', onFocus)
  }
}, [myId, roomId])

  useEffect(() => {
    loadRoomAndUser()
    loadMessages()

    const channel = supabase
      .channel(`dm-room-${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'dm_messages',
          filter: `room_id=eq.${roomId}`,
        },
        async (payload) => {
          const newMsg = payload.new as DMMessage

          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev
            return [...prev, newMsg]
          })

          scrollToBottom(true)

          const {
            data: { user },
          } = await supabase.auth.getUser()

          if (user?.id) {
            await markAsRead(user.id)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [roomId, supabase])

  const sendMessage = async () => {
    const trimmed = text.trim()
    if (!trimmed || !myId || sending) return

    try {
      setSending(true)

      const { error } = await supabase.from('dm_messages').insert({
        room_id: roomId,
        sender_id: myId,
        content: trimmed,
      })

      if (!error) {
        setText('')
        await markAsRead(myId)
      }
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05070b] p-6 text-white">
        กำลังโหลดแชท...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#05070b_0%,#0a0e16_100%)] text-white">
      <div className="mx-auto flex h-screen max-w-6xl overflow-hidden">
        <aside className="hidden w-[320px] border-r border-white/10 bg-white/[0.03] lg:block">
          <div className="border-b border-white/10 px-5 py-5">
            <div className="text-xl font-extrabold text-[#f6d98d]">Messages</div>
            <div className="mt-1 text-sm text-white/45">NEXORA DM</div>
          </div>

          <div className="p-4">
            <div className="rounded-2xl border border-[#f0c66a]/15 bg-[#f0c66a]/8 p-4">
              <div className="text-sm font-bold text-[#f6d98d]">ห้องแชทปัจจุบัน</div>

              <div className="mt-3 flex items-center gap-3">
                <div className="h-12 w-12 overflow-hidden rounded-full bg-gradient-to-br from-[#ffb15c] to-[#7c4dff]">
                  {otherUser?.avatar_url ? (
                    <img
                      src={otherUser.avatar_url}
                      alt={otherUser.display_name || 'user'}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>

                <div>
                  <div className="font-bold text-white">
                    {otherUser?.display_name || 'เพื่อนของคุณ'}
                  </div>
                  <div className="text-xs text-white/45">Private DM Room</div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center gap-3 border-b border-white/10 bg-white/[0.04] px-4 py-4 md:px-6">
            <div className="h-11 w-11 overflow-hidden rounded-full bg-gradient-to-br from-[#ffb15c] to-[#7c4dff]">
              {otherUser?.avatar_url ? (
                <img
                  src={otherUser.avatar_url}
                  alt={otherUser.display_name || 'user'}
                  className="h-full w-full object-cover"
                />
              ) : null}
            </div>

            <div className="min-w-0">
              <div className="truncate text-base font-extrabold text-white">
                {otherUser?.display_name || 'ห้องแชท'}
              </div>
              <div className="text-xs text-white/45">Private message</div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-4 md:px-6">
            <div className="mx-auto flex max-w-3xl flex-col gap-3">
              {messages.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] px-4 py-8 text-center text-white/45">
                  ยังไม่มีข้อความ เริ่มทักได้เลย
                </div>
              ) : (
                messages.map((msg) => {
                  const isMine = msg.sender_id === myId

                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-7 shadow-lg ${
                          isMine
                            ? 'bg-gradient-to-r from-[#fff0b4] via-[#e6bb57] to-[#c88d27] text-[#17130a]'
                            : 'border border-white/10 bg-white/[0.06] text-white'
                        }`}
                      >
                        <div>{msg.content}</div>
                        <div
                          className={`mt-1 text-[11px] ${
                            isMine ? 'text-black/55' : 'text-white/35'
                          }`}
                        >
                          {new Date(msg.created_at).toLocaleString('th-TH', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>
                    </div>
                  )
                })
              )}

              <div ref={bottomRef} />
            </div>
          </div>

          <div className="border-t border-white/10 bg-[#0b1018] px-3 py-3 md:px-6">
            <div className="mx-auto flex max-w-3xl items-end gap-3">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                onFocus={() => {
                  if (myId) markAsRead(myId)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    sendMessage()
                  }
                }}
                placeholder="พิมพ์ข้อความ..."
                rows={1}
                className="max-h-40 min-h-[52px] flex-1 resize-none rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white outline-none placeholder:text-white/35"
              />

              <button
                onClick={sendMessage}
                disabled={sending}
                className="h-[52px] rounded-2xl bg-gradient-to-r from-[#fff0b4] via-[#e6bb57] to-[#c88d27] px-5 text-sm font-extrabold text-[#17130a] transition hover:brightness-105 disabled:opacity-60"
              >
                {sending ? 'ส่ง...' : 'ส่ง'}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}