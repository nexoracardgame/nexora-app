'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type RequestItem = {
  id: string
  sender_id: string
  receiver_id: string
  status: string
  created_at?: string
}

type ProfileMap = Record<
  string,
  {
    display_name: string | null
    avatar_url: string | null
  }
>

export default function FriendRequestsPanel({ userId }: { userId: string | null }) {
  const supabase = useMemo(() => createClient(), [])
  const router = useRouter()
  const [requests, setRequests] = useState<RequestItem[]>([])
  const [profiles, setProfiles] = useState<ProfileMap>({})
  const [loading, setLoading] = useState(true)

  const loadProfiles = async (ids: string[]) => {
    const uniqueIds = Array.from(new Set(ids.filter(Boolean)))
    if (uniqueIds.length === 0) return

    const { data, error } = await supabase
      .from('profiles')
      .select('id, display_name, avatar_url')
      .in('id', uniqueIds)

    if (error) {
      console.error('loadProfiles error:', error)
      return
    }

    const next: ProfileMap = {}
    ;(data || []).forEach((item: any) => {
      next[item.id] = {
        display_name: item.display_name,
        avatar_url: item.avatar_url,
      }
    })

    setProfiles((prev) => ({ ...prev, ...next }))
  }

  const loadRequests = async () => {
    if (!userId) return

    setLoading(true)

    const { data, error } = await supabase
      .from('friend_requests')
      .select('id, sender_id, receiver_id, status, created_at')
      .eq('receiver_id', userId)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('loadRequests error:', error)
      setRequests([])
      setLoading(false)
      return
    }

    const next = (data || []) as RequestItem[]
    setRequests(next)
    await loadProfiles(next.map((r) => r.sender_id))
    setLoading(false)
  }

  useEffect(() => {
    loadRequests()
  }, [userId])

  useEffect(() => {
    if (!userId) return

    const channel = supabase
      .channel(`friend-requests-${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'friend_requests',
          filter: `receiver_id=eq.${userId}`,
        },
        async (payload) => {
          const newReq = payload.new as RequestItem
          if (newReq.status !== 'pending') return

          setRequests((prev) => {
            if (prev.some((r) => r.id === newReq.id)) return prev
            return [newReq, ...prev]
          })

          await loadProfiles([newReq.sender_id])
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'friend_requests',
          filter: `receiver_id=eq.${userId}`,
        },
        async (payload) => {
          const updated = payload.new as RequestItem

          if (updated.status === 'pending') {
            setRequests((prev) => {
              const exists = prev.some((r) => r.id === updated.id)
              if (exists) {
                return prev.map((r) => (r.id === updated.id ? updated : r))
              }
              return [updated, ...prev]
            })

            await loadProfiles([updated.sender_id])
            return
          }

          setRequests((prev) => prev.filter((r) => r.id !== updated.id))
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId])

  const acceptRequest = async (requestId: string) => {
    const { data: roomId, error } = await supabase.rpc('accept_friend_request', {
      p_request_id: requestId,
    })

    if (error) {
      console.error('acceptRequest error:', error)
      alert(error.message || 'รับคำขอไม่สำเร็จ')
      return
    }

    router.push(`/dm/${roomId}`)
  }

  const declineRequest = async (requestId: string) => {
    const { error } = await supabase.rpc('decline_friend_request', {
      p_request_id: requestId,
    })

    if (error) {
      console.error('declineRequest error:', error)
      alert(error.message || 'ปฏิเสธไม่สำเร็จ')
      return
    }

    setRequests((prev) => prev.filter((r) => r.id !== requestId))
  }

  if (!userId || loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/45">
        กำลังโหลด...
      </div>
    )
  }

  if (requests.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/45">
        ยังไม่มีคำขอเพื่อน
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {requests.map((req) => {
        const profile = profiles[req.sender_id]
        const name = profile?.display_name || 'สมาชิก NEXORA'

        return (
          <div
            key={req.id}
            className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4 gap-3"
          >
            <div className="min-w-0">
              <div className="text-sm text-white/60">คำขอจาก:</div>
              <div className="font-bold text-white truncate">{name}</div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => acceptRequest(req.id)}
                className="rounded-xl bg-green-500 px-4 py-2 text-sm font-bold text-white"
              >
                Accept
              </button>

              <button
                onClick={() => declineRequest(req.id)}
                className="rounded-xl bg-red-500 px-4 py-2 text-sm font-bold text-white"
              >
                Decline
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}