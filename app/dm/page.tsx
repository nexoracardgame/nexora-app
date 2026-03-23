'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Room = {
  id: string
  user1: string
  user2: string
  created_at?: string | null
  user1_last_read_at?: string | null
  user2_last_read_at?: string | null
}

type Message = {
  id: string
  room_id: string
  sender_id: string
  content: string
  created_at: string
}

type UserLite = {
  id: string
  email?: string | null
}

export default function DMInboxPage() {
  const supabase = useMemo(() => createClient(), [])
  const [me, setMe] = useState<UserLite | null>(null)
  const [rooms, setRooms] = useState<Room[]>([])
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loadingRooms, setLoadingRooms] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [search, setSearch] = useState('')
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)
  const endRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    bootstrap()
  }, [])

  useEffect(() => {
    if (!selectedRoomId) {
      setMessages([])
      return
    }
    loadMessages(selectedRoomId)
  }, [selectedRoomId])

  useEffect(() => {
    const roomChannel = supabase
      .channel('dm-rooms-live')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'dm_rooms' },
        async () => {
          await loadRooms()
        }
      )
      .subscribe()

    const msgChannel = supabase
      .channel('dm-messages-live')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'dm_messages' },
        async (payload) => {
          const incoming = payload.new as Message | undefined
          if (!incoming?.room_id) return

          await loadRooms()

          if (incoming.room_id === selectedRoomId) {
            await loadMessages(incoming.room_id)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(roomChannel)
      supabase.removeChannel(msgChannel)
    }
  }, [supabase, selectedRoomId])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const bootstrap = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user?.id) {
      setLoadingRooms(false)
      return
    }

    setMe({
      id: user.id,
      email: user.email,
    })

    await loadRooms(user.id)
  }

  const loadRooms = async (forcedUserId?: string) => {
    try {
      setLoadingRooms(true)

      const userId =
        forcedUserId ||
        me?.id ||
        (await supabase.auth.getUser()).data.user?.id ||
        null

      if (!userId) {
        setRooms([])
        return
      }

      const { data, error } = await supabase
        .from('dm_rooms')
        .select('*')
        .or(`user1.eq.${userId},user2.eq.${userId}`)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('loadRooms error:', error)
        setRooms([])
        return
      }

      const nextRooms = (data || []) as Room[]
      setRooms(nextRooms)

      if (!selectedRoomId && nextRooms.length > 0) {
        setSelectedRoomId(nextRooms[0].id)
      } else if (
        selectedRoomId &&
        !nextRooms.some((room) => room.id === selectedRoomId)
      ) {
        setSelectedRoomId(nextRooms[0]?.id || null)
      }
    } finally {
      setLoadingRooms(false)
    }
  }

  const loadMessages = async (roomId: string) => {
    try {
      setLoadingMessages(true)

      const { data, error } = await supabase
        .from('dm_messages')
        .select('id, room_id, sender_id, content, created_at')
        .eq('room_id', roomId)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('loadMessages error:', error)
        setMessages([])
        return
      }

      setMessages((data || []) as Message[])
    } finally {
      setLoadingMessages(false)
    }
  }

  const sendMessage = async () => {
    const text = draft.trim()
    if (!text || !selectedRoomId || !me?.id || sending) return

    try {
      setSending(true)

      const { error } = await supabase.from('dm_messages').insert({
        room_id: selectedRoomId,
        sender_id: me.id,
        content: text,
      })

      if (error) {
        console.error('sendMessage error:', error)
        return
      }

      setDraft('')
      await loadMessages(selectedRoomId)
      await loadRooms()
    } finally {
      setSending(false)
    }
  }

  const selectedRoom = rooms.find((room) => room.id === selectedRoomId) || null

  const filteredRooms = rooms.filter((room) => {
    const peerLabel = getPeerDisplay(room, me?.id)
    return peerLabel.toLowerCase().includes(search.toLowerCase())
  })

  const tokenPrice = 'US$0.06042'
  const balance = '$2,879.00'

  return (
    <div className="min-h-screen bg-[#060b1a] text-white">
      <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(33,114,255,0.12),transparent_22%),radial-gradient(circle_at_left_center,rgba(0,190,255,0.08),transparent_26%),linear-gradient(180deg,#081023_0%,#060b18_100%)]">
        <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.25)_1px,transparent_1px)] [background-size:36px_36px]" />
        <div className="mx-auto flex min-h-screen w-full max-w-[1800px]">
          {/* SIDEBAR */}
          <aside className="hidden w-[280px] shrink-0 border-r border-white/8 bg-[#08101f]/90 xl:flex xl:flex-col">
            <div className="flex items-center gap-3 px-8 pb-7 pt-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.35)]">
                <span className="text-lg font-black">N</span>
              </div>
              <div>
                <div className="text-[15px] font-semibold tracking-[0.02em] text-white/80">
                  NEXORA
                </div>
                <div className="text-[24px] font-black leading-none text-cyan-400">
                  DM
                </div>
              </div>
            </div>

            <div className="px-6">
              <div className="rounded-[28px] border border-cyan-400/40 bg-gradient-to-b from-sky-500/15 to-sky-500/5 p-5 shadow-[0_0_45px_rgba(56,189,248,0.12)]">
                <div className="mx-auto mb-5 flex h-28 w-28 items-center justify-center rounded-[26px] border border-white/15 bg-gradient-to-b from-sky-400 to-blue-500 shadow-[0_18px_50px_rgba(59,130,246,0.28)]">
                  <div className="flex h-[104px] w-[104px] items-center justify-center rounded-[22px] bg-[#7dc7ff] text-4xl font-black text-slate-900">
                    {getAvatarLetter(me?.email || 'U')}
                  </div>
                </div>

                <div className="text-center text-[18px] font-bold">
                  {me?.email ? shortenEmail(me.email) : 'Your Account'}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 border-t border-white/8 pt-4">
                  <div className="rounded-2xl bg-white/5 p-3 text-center">
                    <div className="text-xl font-black text-cyan-300">
                      {rooms.length}
                    </div>
                    <div className="text-xs text-white/45">Rooms</div>
                  </div>
                  <div className="rounded-2xl bg-white/5 p-3 text-center">
                    <div className="text-xl font-black text-cyan-300">
                      {
                        rooms.filter((room) => getUnreadCount(room, me?.id) > 0)
                          .length
                      }
                    </div>
                    <div className="text-xs text-white/45">Unread</div>
                  </div>
                </div>
              </div>
            </div>

            <nav className="mt-8 flex-1 px-4">
              <SidebarItem label="Tournaments" />
              <SidebarItem label="Live matches" active />
              <SidebarItem label="Live chat" />
              <SidebarItem label="Leaderboard" />
              <SidebarItem label="Analytics" />
              <SidebarItem label="Your Team" />
              <SidebarItem label="Settings" />
            </nav>

            <div className="px-4 pb-8">
              <button className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-white/65 transition hover:bg-white/5 hover:text-white">
                <span className="text-lg">↩</span>
                <span className="font-medium">Log Out</span>
              </button>
            </div>
          </aside>

          {/* MAIN */}
          <main className="flex min-w-0 flex-1 flex-col">
            {/* TOP BAR */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/8 px-4 py-4 md:px-7 xl:px-10">
              <div className="flex items-center gap-5">
                <div className="text-sm text-white/55">Token price</div>
                <div className="flex items-center gap-2 text-lg font-semibold text-white/90">
                  <span className="inline-block h-5 w-5 rounded-full border border-cyan-400/50 bg-cyan-400/10" />
                  {tokenPrice}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/8 bg-white/5 text-white/75 transition hover:bg-white/10">
                  🔔
                </button>

                <div className="hidden h-12 w-[220px] items-center gap-3 rounded-2xl border border-white/8 bg-white/5 px-4 lg:flex">
                  <span className="text-white/45">⌕</span>
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search"
                    className="w-full bg-transparent text-[15px] text-white placeholder:text-white/35 focus:outline-none"
                  />
                </div>

                <div className="flex h-12 items-center gap-3 rounded-2xl border border-white/8 bg-white/5 px-4">
                  <div>
                    <div className="text-xs uppercase tracking-wide text-white/35">
                      balance
                    </div>
                    <div className="font-bold text-white/95">{balance}</div>
                  </div>
                </div>

                <button className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500 text-xl shadow-[0_0_30px_rgba(14,165,233,0.35)] transition hover:brightness-110">
                  ✉
                </button>
              </div>
            </div>

            {/* CONTENT */}
            <div className="grid min-h-0 flex-1 grid-cols-1 gap-5 p-4 md:p-7 xl:grid-cols-[420px_minmax(0,1fr)] xl:px-10">
              {/* LEFT PANEL / INBOX */}
              <section className="flex min-h-[700px] flex-col rounded-[34px] border border-white/8 bg-[linear-gradient(180deg,rgba(10,17,35,0.95)_0%,rgba(7,12,25,0.95)_100%)] shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
                <div className="border-b border-white/8 px-6 pb-5 pt-6">
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-medium text-cyan-300/90">
                        Direct Messages
                      </div>
                      <h1 className="mt-1 text-3xl font-black tracking-tight">
                        Live inbox
                      </h1>
                    </div>

                    <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-sm font-semibold text-cyan-300">
                      {filteredRooms.length} rooms
                    </div>
                  </div>

                  <div className="flex rounded-2xl border border-white/8 bg-white/5 px-4 py-3">
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search room or user..."
                      className="w-full bg-transparent text-[15px] text-white placeholder:text-white/35 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
                  {loadingRooms ? (
                    <div className="space-y-3">
                      {Array.from({ length: 7 }).map((_, i) => (
                        <div
                          key={i}
                          className="h-[84px] animate-pulse rounded-3xl bg-white/5"
                        />
                      ))}
                    </div>
                  ) : filteredRooms.length === 0 ? (
                    <div className="flex h-full min-h-[340px] items-center justify-center rounded-[28px] border border-dashed border-white/10 bg-white/[0.03] p-8 text-center text-white/45">
                      ยังไม่พบห้องแชท
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredRooms.map((room) => {
                        const active = room.id === selectedRoomId
                        const peer = getPeerDisplay(room, me?.id)
                        const unread = getUnreadCount(room, me?.id)
                        const preview = getMessagePreview(room.id, messages, room.id === selectedRoomId)

                        return (
                          <button
                            key={room.id}
                            onClick={() => setSelectedRoomId(room.id)}
                            className={[
                              'group w-full rounded-[26px] border p-4 text-left transition-all',
                              active
                                ? 'border-cyan-400/45 bg-[linear-gradient(90deg,rgba(14,165,233,0.16),rgba(255,255,255,0.04))] shadow-[0_0_35px_rgba(14,165,233,0.14)]'
                                : 'border-white/6 bg-white/[0.03] hover:border-white/12 hover:bg-white/[0.055]',
                            ].join(' ')}
                          >
                            <div className="flex items-center gap-4">
                              <div className="relative">
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 text-lg font-black text-white shadow-[0_10px_30px_rgba(59,130,246,0.22)]">
                                  {getAvatarLetter(peer)}
                                </div>
                                <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-[#09111f] bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.7)]" />
                              </div>

                              <div className="min-w-0 flex-1">
                                <div className="flex items-start justify-between gap-3">
                                  <div className="truncate text-[17px] font-bold text-white">
                                    {peer}
                                  </div>
                                  <div className="shrink-0 text-xs text-white/35">
                                    {formatRoomTime(room.created_at)}
                                  </div>
                                </div>

                                <div className="mt-1 truncate text-sm text-white/42">
                                  {preview}
                                </div>
                              </div>

                              {unread > 0 && (
                                <div className="ml-2 flex h-7 min-w-7 items-center justify-center rounded-full bg-cyan-400 px-2 text-xs font-black text-slate-950">
                                  {unread}
                                </div>
                              )}
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              </section>

              {/* RIGHT PANEL / CHAT */}
              <section className="flex min-h-[700px] min-w-0 flex-col rounded-[34px] border border-white/8 bg-[linear-gradient(180deg,rgba(11,18,38,0.96)_0%,rgba(7,11,23,0.98)_100%)] shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
                {selectedRoom ? (
                  <>
                    {/* CHAT HEADER */}
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/8 px-5 py-5 md:px-7">
                      <div className="flex min-w-0 items-center gap-4">
                        <div className="relative">
                          <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-gradient-to-br from-cyan-400 to-blue-600 text-2xl font-black shadow-[0_12px_35px_rgba(59,130,246,0.28)]">
                            {getAvatarLetter(getPeerDisplay(selectedRoom, me?.id))}
                          </div>
                          <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-[#09111f] bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.7)]" />
                        </div>

                        <div className="min-w-0">
                          <div className="truncate text-[28px] font-black tracking-tight">
                            {getPeerDisplay(selectedRoom, me?.id)}
                          </div>
                          <div className="mt-1 text-sm text-cyan-300/85">
                            Secure direct message channel
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <button className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/8 bg-white/5 text-white/80 transition hover:bg-white/10">
                          ❤
                        </button>
                        <button className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/8 bg-white/5 text-white/80 transition hover:bg-white/10">
                          ↗
                        </button>
                        <button className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/8 bg-white/5 text-white/80 transition hover:bg-white/10">
                          ⋮
                        </button>
                      </div>
                    </div>

                    {/* CHAT BODY */}
                    <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 md:px-7">
                      <div className="mb-5 rounded-[28px] border border-cyan-400/15 bg-[linear-gradient(135deg,rgba(14,165,233,0.12),rgba(255,255,255,0.02))] p-4 md:p-5">
                        <div className="text-xs uppercase tracking-[0.22em] text-cyan-300/65">
                          Live DM
                        </div>
                        <div className="mt-2 text-xl font-bold text-white/95">
                          Room ID: {selectedRoom.id}
                        </div>
                        <div className="mt-1 text-sm text-white/45">
                          Create a premium chat experience with real-time messaging,
                          unread states, and neon glass UI.
                        </div>
                      </div>

                      {loadingMessages ? (
                        <div className="space-y-4">
                          {Array.from({ length: 6 }).map((_, i) => (
                            <div
                              key={i}
                              className={`h-16 animate-pulse rounded-3xl bg-white/5 ${
                                i % 2 === 0 ? 'ml-auto max-w-[75%]' : 'max-w-[68%]'
                              }`}
                            />
                          ))}
                        </div>
                      ) : messages.length === 0 ? (
                        <div className="flex min-h-[360px] items-center justify-center rounded-[28px] border border-dashed border-white/10 bg-white/[0.03] p-8 text-center text-white/45">
                          ยังไม่มีข้อความในห้องนี้
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {messages.map((msg) => {
                            const mine = msg.sender_id === me?.id

                            return (
                              <div
                                key={msg.id}
                                className={`flex ${mine ? 'justify-end' : 'justify-start'}`}
                              >
                                <div
                                  className={[
                                    'max-w-[82%] rounded-[26px] px-4 py-3 md:max-w-[68%]',
                                    mine
                                      ? 'bg-[linear-gradient(135deg,#18a8ff,#3b82f6)] text-white shadow-[0_12px_35px_rgba(24,168,255,0.24)]'
                                      : 'border border-white/8 bg-white/[0.045] text-white/92',
                                  ].join(' ')}
                                >
                                  <div className="whitespace-pre-wrap break-words text-[15px] leading-7">
                                    {msg.content}
                                  </div>
                                  <div
                                    className={`mt-2 text-[11px] ${
                                      mine ? 'text-white/75' : 'text-white/38'
                                    }`}
                                  >
                                    {formatMessageTime(msg.created_at)}
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                          <div ref={endRef} />
                        </div>
                      )}
                    </div>

                    {/* COMPOSER */}
                    <div className="border-t border-white/8 px-4 py-4 md:px-7">
                      <div className="flex items-end gap-3">
                        <div className="flex min-h-[62px] flex-1 items-end rounded-[26px] border border-white/8 bg-white/[0.04] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                          <textarea
                            rows={1}
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault()
                                sendMessage()
                              }
                            }}
                            placeholder="Type your message..."
                            className="max-h-40 min-h-[28px] w-full resize-none bg-transparent text-[15px] leading-7 text-white placeholder:text-white/30 focus:outline-none"
                          />
                        </div>

                        <button
                          onClick={sendMessage}
                          disabled={sending || !draft.trim()}
                          className="h-[62px] rounded-[22px] bg-[linear-gradient(135deg,#1bb4ff,#3b82f6)] px-7 text-[15px] font-black text-white shadow-[0_14px_40px_rgba(24,168,255,0.35)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {sending ? 'Sending...' : 'Send'}
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex h-full min-h-[700px] items-center justify-center p-8">
                    <div className="max-w-md rounded-[30px] border border-white/8 bg-white/[0.03] p-8 text-center">
                      <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-[24px] bg-gradient-to-br from-cyan-400 to-blue-600 text-3xl font-black shadow-[0_12px_35px_rgba(59,130,246,0.28)]">
                        ✉
                      </div>
                      <div className="text-3xl font-black">Select a room</div>
                      <div className="mt-3 text-white/45">
                        เลือกห้องแชทจากฝั่งซ้ายเพื่อเริ่มดูข้อความหรือส่งข้อความใหม่
                      </div>
                    </div>
                  </div>
                )}
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

function SidebarItem({
  label,
  active = false,
}: {
  label: string
  active?: boolean
}) {
  return (
    <button
      className={[
        'mb-1 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition',
        active
          ? 'bg-[linear-gradient(90deg,rgba(14,165,233,0.16),rgba(14,165,233,0.04))] text-white shadow-[inset_0_0_0_1px_rgba(56,189,248,0.12)]'
          : 'text-white/45 hover:bg-white/5 hover:text-white/80',
      ].join(' ')}
    >
      <span className="text-lg">{active ? '◉' : '○'}</span>
      <span className="font-medium">{label}</span>
    </button>
  )
}

function getPeerDisplay(room: Room, meId?: string | null) {
  if (!meId) return `Room ${room.id.slice(0, 8)}`
  const otherId = room.user1 === meId ? room.user2 : room.user1
  return `User ${otherId.slice(0, 8)}`
}

function getAvatarLetter(text: string) {
  return (text || 'U').trim().charAt(0).toUpperCase()
}

function shortenEmail(email: string) {
  if (!email) return 'Account'
  const [name] = email.split('@')
  return name.length > 18 ? `${name.slice(0, 18)}...` : name
}

function formatRoomTime(date?: string | null) {
  if (!date) return '--'
  const d = new Date(date)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (hours < 1) return 'now'
  if (hours < 24) return `${hours}h`
  if (days < 7) return `${days}d`

  return d.toLocaleDateString()
}

function formatMessageTime(date: string) {
  if (!date) return '--'
  const d = new Date(date)
  return d.toLocaleString([], {
    hour: '2-digit',
    minute: '2-digit',
    month: 'short',
    day: 'numeric',
  })
}

function getUnreadCount(room: Room, meId?: string | null) {
  if (!meId) return 0

  const lastRead =
    room.user1 === meId ? room.user1_last_read_at : room.user2_last_read_at

  if (!lastRead) return 0

  return 0
}

function getMessagePreview(
  roomId: string,
  currentMessages: Message[],
  isSelected: boolean
) {
  if (isSelected && currentMessages.length > 0) {
    return currentMessages[currentMessages.length - 1]?.content || 'Open room'
  }
  return `Open room ${roomId.slice(0, 8)} to view conversation`
}