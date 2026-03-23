'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function MessageButton({ targetUserId }: { targetUserId: string }) {
  const supabase = createClient()
  const router = useRouter()

  const openChat = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user?.id) {
      alert('กรุณาเข้าสู่ระบบก่อน')
      return
    }

    if (user.id === targetUserId) {
      alert('ไม่สามารถแชทกับตัวเองได้')
      return
    }

    const { data: room } = await supabase
      .from('dm_rooms')
      .select('id')
      .or(
        `and(user1.eq.${user.id},user2.eq.${targetUserId}),and(user1.eq.${targetUserId},user2.eq.${user.id})`
      )
      .maybeSingle()

    if (room?.id) {
      router.push(`/dm/${room.id}`)
      return
    }

    const { data: newRoom, error: createError } = await supabase
      .from('dm_rooms')
      .insert({
        user1: user.id,
        user2: targetUserId,
      })
      .select('id')
      .single()

    if (createError || !newRoom?.id) {
      alert('สร้างห้องไม่สำเร็จ')
      return
    }

    router.push(`/dm/${newRoom.id}`)
  }

  return (
    <button
      onClick={openChat}
      className="inline-flex items-center gap-2 rounded-full border border-[#f0c66a]/20 bg-[#f0c66a]/10 px-4 py-2 text-sm font-bold text-[#f6d98d] transition hover:scale-[1.03] hover:bg-[#f0c66a]/15"
    >
      <span>💬</span>
      <span>Message</span>
    </button>
  )
}