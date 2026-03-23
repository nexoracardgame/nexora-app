'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function CallbackPage() {
  const supabase = createClient()

  useEffect(() => {
    const handleAuth = async () => {
      const url = new URL(window.location.href)
      const code = url.searchParams.get('code')

      if (code) {
        await supabase.auth.exchangeCodeForSession(code)
      }

      window.location.href = '/'
    }

    handleAuth()
  }, [])

  return <div style={{ color: 'white' }}>กำลังเข้าสู่ระบบ...</div>
}