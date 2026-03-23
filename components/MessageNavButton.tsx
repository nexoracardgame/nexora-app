'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Room = {
  id: string
  user1: string
  user2: string
  user1_last_read_at: string | null
  user2_last_read_at: string | null
}

type LastMessage = {
  id: string
  room_id: string
  sender_id: string
  created_at: string
}

export default function MessageNavButton() {
  const supabase = useMemo(() => createClient(), [])
  const pathname = usePathname()

  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const mountedRef = useRef(true)
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    mountedRef.current = true

    const loadUnreadRoomCount = async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError || !user?.id) {
          if (mountedRef.current) {
            setCount(0)
            setLoading(false)
          }
          return
        }

        const { data: rooms, error: roomsError } = await supabase
          .from('dm_rooms')
          .select('id, user1, user2, user1_last_read_at, user2_last_read_at')
          .or(`user1.eq.${user.id},user2.eq.${user.id}`)

        if (roomsError) {
          console.error('load rooms error:', roomsError)
          if (mountedRef.current) {
            setCount(0)
            setLoading(false)
          }
          return
        }

        const roomList = (rooms || []) as Room[]

        if (roomList.length === 0) {
          if (mountedRef.current) {
            setCount(0)
            setLoading(false)
          }
          return
        }

        const checks = await Promise.all(
          roomList.map(async (room) => {
            const myLastReadAt =
              room.user1 === user.id
                ? room.user1_last_read_at
                : room.user2_last_read_at

            const { data: lastMessage, error: msgError } = await supabase
              .from('dm_messages')
              .select('id, room_id, sender_id, created_at')
              .eq('room_id', room.id)
              .order('created_at', { ascending: false })
              .limit(1)
              .maybeSingle()

            if (msgError) {
              console.error(`load last message error in room ${room.id}:`, msgError)
              return false
            }

            const msg = lastMessage as LastMessage | null

            if (!msg) return false
            if (msg.sender_id === user.id) return false
            if (!myLastReadAt) return true

            return new Date(msg.created_at).getTime() > new Date(myLastReadAt).getTime()
          })
        )

        const unreadRooms = checks.filter(Boolean).length

        if (mountedRef.current) {
          setCount(unreadRooms)
          setLoading(false)
        }
      } catch (error) {
        console.error('loadUnreadRoomCount error:', error)
        if (mountedRef.current) {
          setCount(0)
          setLoading(false)
        }
      }
    }

    loadUnreadRoomCount()

    pollingRef.current = setInterval(() => {
      loadUnreadRoomCount()
    }, 5000)

    const handleReadUpdated = () => {
      loadUnreadRoomCount()
    }

    window.addEventListener('dm-read-updated', handleReadUpdated)

    return () => {
      mountedRef.current = false
      if (pollingRef.current) clearInterval(pollingRef.current)
      window.removeEventListener('dm-read-updated', handleReadUpdated)
    }
  }, [supabase])

  const isActive = pathname?.startsWith('/dm')

  return (
    <Link
      href="/dm"
      className={`group relative flex items-center gap-3 rounded-2xl px-4 py-3 text-[15px] font-semibold transition-all duration-200 ${
        isActive
          ? 'bg-[#f47c57]/18 text-[#ff9c7a] shadow-[0_0_0_1px_rgba(244,124,87,0.22)]'
          : 'text-white/78 hover:bg-white/[0.06] hover:text-white'
      }`}
    >
      <div
  className={`flex h-9 w-9 items-center justify-center rounded-xl transition ${
    isActive
      ? 'bg-[#ff8a65]/20 text-[#ff9c7a]'
      : 'bg-white/[0.04] text-white/75 group-hover:bg-white/[0.08] group-hover:text-white'
  }`}
>
  💬
</div>

      <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
        <span className="truncate">Messages</span>

        {!loading && count > 0 && (
          <span className="inline-flex min-w-[22px] items-center justify-center rounded-full bg-gradient-to-r from-[#ff6a6a] to-[#ff3d3d] px-2 py-[2px] text-[11px] font-extrabold leading-5 text-white shadow-lg shadow-red-500/20">
            {count > 99 ? '99+' : count}
          </span>
        )}
      </div>
    </Link>
  )
}