'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Props = {
  userId: string | null
  user?: any
  onCreated?: () => void
}

export default function CreatePost({ userId, user, onCreated }: Props) {
  const supabase = createClient()
  const [content, setContent] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const previewUrls = useMemo(() => {
    return files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }))
  }, [files])

  useEffect(() => {
    return () => {
      previewUrls.forEach((item) => URL.revokeObjectURL(item.url))
    }
  }, [previewUrls])

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email ||
    'NEXORA User'

  const avatarText = String(displayName).charAt(0).toUpperCase()

  const handleSelectFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || [])
    setFiles(selected.slice(0, 4))
  }

  const removeFileAt = (index: number) => {
    setFiles((prev) => {
      const next = prev.filter((_, i) => i !== index)
      if (next.length === 0 && inputRef.current) {
        inputRef.current.value = ''
      }
      return next
    })
  }

  const handleSubmit = async () => {
    const trimmed = content.trim()

    if (!userId) {
      alert('ยังโหลด user อยู่ รอสักครู่')
      return
    }

    if (!trimmed && files.length === 0) {
      alert('กรุณาใส่ข้อความหรือเลือกรูปอย่างน้อย 1 รูป')
      return
    }

    try {
      setLoading(true)

      const { data: authData } = await supabase.auth.getUser()
      const authUser = authData.user

      const { data: post, error: postError } = await supabase
        .from('posts')
        .insert({
          user_id: userId,
          user_name:
            authUser?.user_metadata?.full_name ||
            authUser?.user_metadata?.name ||
            authUser?.email ||
            'User',
          content: trimmed || null,
        })
        .select('id')
        .single()

      if (postError) throw postError

      if (files.length > 0) {
        const uploadedRows: {
          post_id: string
          image_url: string
          sort_order: number
        }[] = []

        for (let i = 0; i < files.length; i++) {
          const file = files[i]
          const ext = file.name.split('.').pop()
          const path = `posts/${userId}/${Date.now()}-${i}.${ext}`

          const { error: uploadError } = await supabase.storage
            .from('post-images')
            .upload(path, file, { upsert: false })

          if (uploadError) throw uploadError

          const { data: publicUrlData } = supabase.storage
            .from('post-images')
            .getPublicUrl(path)

          uploadedRows.push({
            post_id: post.id,
            image_url: publicUrlData.publicUrl,
            sort_order: i,
          })
        }

        const { error: imageInsertError } = await supabase
          .from('post_images')
          .insert(uploadedRows)

        if (imageInsertError) throw imageInsertError
      }

      setContent('')
      setFiles([])
      if (inputRef.current) inputRef.current.value = ''
      onCreated?.()
    } catch (error) {
      console.error(error)
      alert('สร้างโพสต์ไม่สำเร็จ')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        overflow: 'hidden',
        borderRadius: 30,
        border: '1px solid rgba(255,255,255,0.10)',
        background:
          'linear-gradient(180deg, rgba(18,22,35,0.98), rgba(8,10,16,0.98))',
        boxShadow: '0 24px 70px rgba(0,0,0,0.34)',
      }}
    >
      <div
        style={{
          height: 2,
          width: '100%',
          background:
            'linear-gradient(90deg, transparent, rgba(240,198,106,0.9), transparent)',
        }}
      />

      <div style={{ padding: 24 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 16,
            marginBottom: 18,
          }}
        >
          <div
            style={{
              width: 50,
              height: 50,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background:
                'linear-gradient(135deg, #ffb15c 0%, #d58a41 45%, #7c4dff 100%)',
              color: '#fff',
              fontSize: 20,
              fontWeight: 900,
              flexShrink: 0,
              boxShadow: '0 12px 30px rgba(124,77,255,0.22)',
            }}
          >
            {avatarText}
          </div>

          <div style={{ minWidth: 0, flex: 1 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                flexWrap: 'wrap',
              }}
            >
              <div
                style={{
                  color: '#fff',
                  fontSize: 22,
                  fontWeight: 800,
                  lineHeight: 1,
                }}
              >
                {displayName}
              </div>

              <span
                style={{
                  minHeight: 28,
                  padding: '0 12px',
                  borderRadius: 999,
                  display: 'inline-flex',
                  alignItems: 'center',
                  background: 'rgba(240,198,106,0.10)',
                  border: '1px solid rgba(240,198,106,0.20)',
                  color: '#f6d98d',
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                }}
              >
                Create Post
              </span>
            </div>

            <div
              style={{
                marginTop: 8,
                color: 'rgba(255,255,255,0.50)',
                fontSize: 13,
                lineHeight: 1.7,
              }}
            >
              แชร์เรื่องราว รูปภาพ หรืออัปเดตในโลก NEXORA ให้ดูพรีเมียมและน่าอ่าน
            </div>
          </div>
        </div>

        <div
          style={{
            borderRadius: 24,
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(255,255,255,0.03)',
            padding: 16,
          }}
        >
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="กำลังคิดอะไรอยู่ในโลก NEXORA..."
            style={{
              width: '100%',
              minHeight: 160,
              resize: 'vertical',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#fff',
              fontSize: 16,
              lineHeight: 1.9,
              fontFamily: 'inherit',
            }}
          />

          {files.length > 0 && (
            <div
              style={{
                marginTop: 16,
                display: 'grid',
                gridTemplateColumns:
                  files.length === 1 ? '1fr' : 'repeat(2, minmax(0, 1fr))',
                gap: 12,
              }}
            >
              {previewUrls.map((item, index) => (
                <div
                  key={`${item.file.name}-${index}`}
                  style={{
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: 22,
                    border: '1px solid rgba(255,255,255,0.10)',
                    background: 'rgba(0,0,0,0.30)',
                  }}
                >
                  <img
                    src={item.url}
                    alt={`preview ${index + 1}`}
                    style={{
                      width: '100%',
                      height: 240,
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />

                  <button
                    type="button"
                    onClick={() => removeFileAt(index)}
                    style={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      border: '1px solid rgba(255,255,255,0.15)',
                      background: 'rgba(0,0,0,0.60)',
                      color: '#fff',
                      fontSize: 14,
                      fontWeight: 800,
                      cursor: 'pointer',
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    ✕
                  </button>

                  <div
                    style={{
                      position: 'absolute',
                      left: 12,
                      bottom: 12,
                      minHeight: 28,
                      padding: '0 12px',
                      borderRadius: 999,
                      display: 'inline-flex',
                      alignItems: 'center',
                      background: 'rgba(0,0,0,0.55)',
                      border: '1px solid rgba(255,255,255,0.10)',
                      color: 'rgba(255,255,255,0.90)',
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    รูปที่ {index + 1}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div
          style={{
            marginTop: 16,
            borderRadius: 22,
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(255,255,255,0.02)',
            padding: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            flexWrap: 'wrap',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              flexWrap: 'wrap',
            }}
          >
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              style={{
                height: 46,
                padding: '0 18px',
                borderRadius: 16,
                border: '1px solid rgba(255,255,255,0.10)',
                background: 'rgba(255,255,255,0.05)',
                color: '#fff',
                fontSize: 14,
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <span style={{ fontSize: 16 }}>🖼</span>
              <span>เพิ่มรูปภาพ</span>
            </button>

            <div
              style={{
                height: 46,
                padding: '0 16px',
                borderRadius: 16,
                border: '1px solid rgba(255,255,255,0.10)',
                background: 'rgba(255,255,255,0.05)',
                color: 'rgba(255,255,255,0.65)',
                fontSize: 14,
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              สูงสุด 4 รูป
            </div>

            {files.length > 0 && (
              <div
                style={{
                  height: 46,
                  padding: '0 16px',
                  borderRadius: 16,
                  border: '1px solid rgba(240,198,106,0.20)',
                  background: 'rgba(240,198,106,0.10)',
                  color: '#f6d98d',
                  fontSize: 14,
                  fontWeight: 800,
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                เลือกแล้ว {files.length} รูป
              </div>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              height: 46,
              padding: '0 22px',
              borderRadius: 16,
              border: 'none',
              background:
                'linear-gradient(90deg, #fff0b4 0%, #e6bb57 48%, #c88d27 100%)',
              color: '#17130a',
              fontSize: 14,
              fontWeight: 900,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.65 : 1,
              boxShadow: '0 10px 24px rgba(230,187,87,0.16)',
            }}
          >
            {loading ? 'กำลังโพสต์...' : 'โพสต์ทันที'}
          </button>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleSelectFiles}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  )
}