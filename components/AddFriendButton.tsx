'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AddFriendButton({ targetUserId }: { targetUserId: string }) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)

  const handleAddFriend = async () => {
    if (loading) return

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user?.id) {
      alert('กรุณาเข้าสู่ระบบก่อน')
      return
    }

    if (user.id === targetUserId) {
      alert('แอดตัวเองไม่ได้')
      return
    }

    try {
      setLoading(true)

      const { data: existing, error: existingError } = await supabase
        .from('friend_requests')
        .select('id, status')
        .eq('sender_id', user.id)
        .eq('receiver_id', targetUserId)
        .maybeSingle()

      if (existingError) {
        console.error(existingError)
        alert('ตรวจสอบคำขอเดิมไม่สำเร็จ')
        return
      }

      if (existing?.status === 'pending') {
        alert('ส่งคำขอไปแล้ว')
        return
      }

      if (existing?.status === 'accepted') {
        alert('เป็นเพื่อนกันแล้ว')
        return
      }

      if (existing?.status === 'declined') {
        const { error: updateError } = await supabase
          .from('friend_requests')
          .update({
            status: 'pending',
          })
          .eq('id', existing.id)

        if (updateError) {
          console.error(updateError)
          alert('ส่งคำขอใหม่ไม่สำเร็จ')
          return
        }

        alert('ส่งคำขอใหม่แล้ว')
        return
      }

      const { error: insertError } = await supabase
        .from('friend_requests')
        .insert({
          sender_id: user.id,
          receiver_id: targetUserId,
          status: 'pending',
        })

      if (insertError) {
        console.error(insertError)
        alert(insertError.message)
        return
      }

      alert('ส่งคำขอเพื่อนแล้ว')
    } catch (err) {
      console.error(err)
      alert('เกิดข้อผิดพลาด')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleAddFriend}
      disabled={loading}
      className="group relative overflow-hidden rounded-2xl px-5 py-2.5 font-bold text-sm text-black transition-all duration-300 disabled:opacity-60"
      style={{
        background: 'linear-gradient(135deg,#f0c66a,#ffd97a,#e6b85c)',
      }}
    >
      <span className="relative flex items-center gap-2">
        {loading ? '...' : '👑 Add Friend'}
      </span>
    </button>
  )
}