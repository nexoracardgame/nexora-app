"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "../lib/supabase";

type Channel = {
  id: string;
  slug: string;
  name: string;
};

type ChatMessage = {
  id: string;
  channel_id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string | null;
  message?: string | null;
  image_url?: string | null;
  created_at: string;
};

type PresenceUser = {
  user_id: string;
  user_name: string;
  user_avatar?: string | null;
  room_slug: string;
  last_seen: string;
};

const EMOJIS = [
  "😀",
  "😆",
  "🤣",
  "😍",
  "🥰",
  "😎",
  "🤩",
  "🔥",
  "✨",
  "💎",
  "⚡",
  "🎉",
  "❤️",
  "💛",
  "🖤",
  "👑",
  "🚀",
  "🎮",
  "🏆",
  "💬",
  "😈",
  "🤝",
  "👏",
  "🥳",
];

export default function ChatBox({ roomSlug = "global" }: { roomSlug?: string }) {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [channelSlug, setChannelSlug] = useState(roomSlug);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<PresenceUser[]>([]);
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
  const getUser = async () => {
    const { data } = await supabase.auth.getUser()
    setUser(data.user) // 🔥 เพิ่มบรรทัดนี้
  }
  getUser()
}, [])
  const [text, setText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [typingGlow, setTypingGlow] = useState(false);

  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const presenceIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const activeChannel = useMemo(
    () => channels.find((c) => c.slug === channelSlug) || null,
    [channels, channelSlug]
  );

  useEffect(() => {
  setChannelSlug(roomSlug);
}, [roomSlug]);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      setUser(data.user || null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setUser(session?.user || null);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    loadChannels();
  }, []);

  useEffect(() => {
    if (!user) return;

    updatePresence();
    loadOnlineUsers();

    if (presenceIntervalRef.current) {
      clearInterval(presenceIntervalRef.current);
    }

    presenceIntervalRef.current = setInterval(() => {
      updatePresence();
      loadOnlineUsers();
    }, 15000);

    return () => {
      if (presenceIntervalRef.current) {
        clearInterval(presenceIntervalRef.current);
      }
    };
  }, [user, channelSlug]);

  useEffect(() => {
    if (!activeChannel?.id) return;

    let alive = true;
    let pollingId: ReturnType<typeof setInterval> | null = null;

    const refreshMessages = async () => {
      if (!alive) return;

      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("channel_id", activeChannel.id)
        .order("created_at", { ascending: true });

      if (!alive || error) return;

      setMessages((prev) => {
        const next = (data || []) as ChatMessage[];

        if (prev.length === next.length) {
          const prevLast = prev[prev.length - 1]?.id;
          const nextLast = next[next.length - 1]?.id;
          if (prevLast && prevLast === nextLast) return prev;
        }

        return next;
      });

      queueMicrotask(() => scrollToBottom());
    };

    refreshMessages();
    setTimeout(() => scrollToBottom(true), 100);
    loadOnlineUsers();

    const realtimeChannel = supabase
      .channel(`room-${activeChannel.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "chat_messages",
          filter: `channel_id=eq.${activeChannel.id}`,
        },
        async () => {
          await refreshMessages();
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          refreshMessages();
        }
      });

    pollingId = setInterval(() => {
      refreshMessages();
    }, 1000);

    return () => {
      alive = false;
      if (pollingId) clearInterval(pollingId);
      supabase.removeChannel(realtimeChannel);
    };
  }, [activeChannel?.id]);

  useEffect(() => {
    if (!activeChannel?.id) return;

    const presenceChannel = supabase
      .channel(`presence-${channelSlug}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "chat_presence",
          filter: `room_slug=eq.${channelSlug}`,
        },
        () => {
          loadOnlineUsers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(presenceChannel);
    };
  }, [channelSlug, activeChannel?.id]);

  async function loadChannels() {
    const { data } = await supabase
      .from("chat_channels")
      .select("*")
      .order("created_at", { ascending: true });

    if (data?.length) {
      setChannels(data as Channel[]);
    }
  }

  async function loadOnlineUsers() {
    const now = Date.now();

    const { data } = await supabase
      .from("chat_presence")
      .select("*")
      .eq("room_slug", channelSlug)
      .order("last_seen", { ascending: false });

    const filtered = ((data || []) as PresenceUser[]).filter((u) => {
      const lastSeen = new Date(u.last_seen).getTime();
      return now - lastSeen <= 60000;
    });

    const uniqueUsers = filtered.filter(
      (u, index, arr) => arr.findIndex((x) => x.user_id === u.user_id) === index
    );

    setOnlineUsers(uniqueUsers);
  }

  async function updatePresence() {
    if (!user) return;

    await supabase.from("chat_presence").upsert({
      user_id: user.id,
      user_name:
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.email ||
        "NEXORA Member",
      user_avatar:
        user.user_metadata?.picture ||
        user.user_metadata?.avatar_url ||
        user.user_metadata?.photo_url ||
        null,
      room_slug: channelSlug,
      last_seen: new Date().toISOString(),
    });
  }

  function scrollToBottom(force = false) {
  const el = scrollerRef.current;
  if (!el) return;

  const nearBottom =
    el.scrollHeight - el.scrollTop - el.clientHeight < 120;

  if (!force && !nearBottom) return;

  el.scrollTo({
    top: el.scrollHeight,
    behavior: "smooth",
  });
}

  function appendEmoji(emoji: string) {
    setText((prev) => prev + emoji);
    setShowEmoji(false);
  }

  async function sendMessage() {
    if (!user || !activeChannel) return;
    if (!text.trim()) return;
    if (sending) return;

    setSending(true);

    try {
      const messageText = text.trim();

      const { error } = await supabase.from("chat_messages").insert({
        channel_id: activeChannel.id,
        user_id: user.id,
        user_name:
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.email ||
          "NEXORA Member",
        user_avatar:
          user.user_metadata?.picture ||
          user.user_metadata?.avatar_url ||
          user.user_metadata?.photo_url ||
          null,
        message: messageText,
      });

      if (!error) {
        setText("");
        setShowEmoji(false);

        const { data } = await supabase
          .from("chat_messages")
          .select("*")
          .eq("channel_id", activeChannel.id)
          .order("created_at", { ascending: true });

        setMessages((data || []) as ChatMessage[]);
        queueMicrotask(() => scrollToBottom(true));
      }
    } finally {
      setSending(false);
    }
  }

  async function uploadImage(file: File) {
    if (!user || !activeChannel) return;
    if (!file) return;

    setUploading(true);

    try {
      const ext = file.name.split(".").pop() || "jpg";
      const fileName = `${user.id}/${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("chat-images")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        alert(uploadError.message);
        return;
      }

      const { data: publicData } = supabase.storage
        .from("chat-images")
        .getPublicUrl(fileName);

      const publicUrl = publicData.publicUrl;

      const { error: insertError } = await supabase.from("chat_messages").insert({
        channel_id: activeChannel.id,
        user_id: user.id,
        user_name:
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.email ||
          "NEXORA Member",
        user_avatar:
          user.user_metadata?.picture ||
          user.user_metadata?.avatar_url ||
          user.user_metadata?.photo_url ||
          null,
        message: "",
        image_url: publicUrl,
      });

      if (insertError) {
        alert(insertError.message);
      } else {
        const { data } = await supabase
          .from("chat_messages")
          .select("*")
          .eq("channel_id", activeChannel.id)
          .order("created_at", { ascending: true });

        setMessages((data || []) as ChatMessage[]);
        queueMicrotask(() => scrollToBottom());
      }
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function formatTime(dateString: string) {
    const d = new Date(dateString);
    return d.toLocaleTimeString("th-TH", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div style={{ marginTop: 60 }}>
      <div
        style={{
          fontFamily: '"Cinzel", "Noto Sans Thai", serif',
          fontSize: 32,
          fontWeight: 800,
          marginBottom: 16,
          background:
            "linear-gradient(180deg, #fff8dd 0%, #f7d978 35%, #dca347 70%, #7d4b16 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          textShadow: "0 0 24px rgba(255, 214, 102, 0.10)",
        }}
      >
        NEXORA CHAT
      </div>

      <div
        style={{
          borderRadius: 30,
          padding: 2,
          background: `
            radial-gradient(circle at 100% 0%, rgba(138,99,255,0.85) 0%, rgba(138,99,255,0.35) 20%, transparent 42%),
            linear-gradient(135deg, #fff3b0 0%, #f1cc74 35%, #d4a62f 68%, #6f4a17 100%)
          `,
          boxShadow:
            "0 0 18px rgba(241,204,116,0.16), 0 0 40px rgba(138,99,255,0.08)",
        }}
      >
        <div
          style={{
            borderRadius: 28,
            background: `
              radial-gradient(circle at top right, rgba(138,99,255,0.12), transparent 20%),
              linear-gradient(180deg, rgba(8,8,10,0.98), rgba(11,11,14,0.98))
            `,
            border: "1px solid rgba(255,221,135,0.08)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 14,
              flexWrap: "wrap",
              padding: "18px 18px 14px",
              borderBottom: "1px solid rgba(255,221,135,0.08)",
              background:
                "linear-gradient(180deg, rgba(18,18,22,0.92), rgba(10,10,14,0.86))",
            }}
          >
            <div>
              <div
                style={{
                  color: "#fff0bd",
                  fontWeight: 800,
                  fontSize: 18,
                }}
              >
                ห้องสนทนาออนไลน์
              </div>
              <div
                style={{
                  color: "#a99671",
                  fontSize: 12,
                  marginTop: 4,
                }}
              >
                {user
                  ? "ล็อกอินแล้ว สามารถพิมพ์ ส่งรูป และคุยสดได้"
                  : "กรุณาเข้าสู่ระบบก่อนจึงจะพิมพ์ข้อความได้"}
              </div>
            </div>
            <div
  style={{
    display: "flex",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
  }}
>
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      minHeight: 40,
      padding: "0 14px",
      borderRadius: 999,
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,221,135,0.10)",
      color: "#f4dfac",
      fontWeight: 700,
      fontSize: 13,
    }}
  >
    ห้องปัจจุบัน: #{activeChannel?.name || "Global Chat"}
  </div>
</div>
          </div>

          <div
            style={{
              padding: "12px 18px",
              borderBottom: "1px solid rgba(255,221,135,0.08)",
              background:
                "linear-gradient(180deg, rgba(14,14,18,0.95), rgba(10,10,14,0.95))",
            }}
          >
            <div
              style={{
                color: "#fff0bd",
                fontWeight: 700,
                marginBottom: 10,
                fontSize: 14,
              }}
            >
              ออนไลน์ตอนนี้ {onlineUsers.length} คน
            </div>

            <div
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              {onlineUsers.length === 0 ? (
                <div style={{ color: "#8f7a56", fontSize: 13 }}>
                  ยังไม่มีคนออนไลน์ในห้องนี้
                </div>
              ) : (
                onlineUsers.map((u) => (
                  <div
                    key={u.user_id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "8px 12px",
                      borderRadius: 999,
                      background:
                        "linear-gradient(180deg, rgba(20,20,24,0.95), rgba(12,12,16,0.95))",
                      border: "1px solid rgba(255,221,135,0.10)",
                    }}
                  >
                    <div style={{ position: "relative" }}>
                      {u.user_avatar ? (
                        <img
                          src={u.user_avatar}
                          alt={u.user_name}
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: 999,
                            objectFit: "cover",
                            border: "1px solid rgba(255,221,135,0.14)",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: 999,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background:
                              "linear-gradient(180deg, rgba(255,221,135,0.18), rgba(88,56,16,0.36))",
                            border: "1px solid rgba(255,221,135,0.14)",
                            color: "#ffe8b1",
                            fontWeight: 900,
                            fontSize: 12,
                          }}
                        >
                          {u.user_name?.charAt(0)?.toUpperCase() || "N"}
                        </div>
                      )}

                      <span
                        style={{
                          position: "absolute",
                          right: -1,
                          bottom: -1,
                          width: 10,
                          height: 10,
                          borderRadius: 999,
                          background: "#2dfc7b",
                          border: "2px solid #0b0b0f",
                          boxShadow: "0 0 10px rgba(45,252,123,0.65)",
                        }}
                      />
                    </div>

                    <div
                      style={{
                        color: "#e9d7a3",
                        fontSize: 13,
                        fontWeight: 700,
                      }}
                    >
                      {u.user_name}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div
            ref={scrollerRef}
            style={{
              height: 460,
              overflowY: "auto",
              padding: 18,
              background:
                "linear-gradient(180deg, rgba(8,8,10,0.92), rgba(12,12,15,0.94))",
              scrollbarWidth: "thin",
              scrollbarColor: "#d4a62f #17171d",
            }}
          >
            <style jsx>{`
              div::-webkit-scrollbar {
                width: 10px;
              }
              div::-webkit-scrollbar-track {
                background: #17171d;
                border-radius: 999px;
              }
              div::-webkit-scrollbar-thumb {
                background: linear-gradient(180deg, #f1cc74, #d4a62f, #7d4b16);
                border-radius: 999px;
                border: 2px solid #17171d;
              }
            `}</style>

            {messages.length === 0 ? (
              <div
                style={{
                  minHeight: 420,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  color: "#9f8a62",
                  padding: 20,
                }}
              >
                ยังไม่มีข้อความในห้องนี้
              </div>
            ) : (
              messages.map((m) => {
                const mine = user?.id === m.user_id;

                return (
                  <div
                    key={m.id}
                    style={{
                      display: "flex",
                      justifyContent: mine ? "flex-end" : "flex-start",
                      marginBottom: 14,
                    }}
                  >
                    <div
                      style={{
                        maxWidth: "78%",
                        display: "flex",
                        flexDirection: mine ? "row-reverse" : "row",
                        gap: 10,
                        alignItems: "flex-end",
                      }}
                    >
                      {m.user_avatar ? (
                        <img
                          src={m.user_avatar}
                          alt={m.user_name}
                          style={{
                            width: 38,
                            height: 38,
                            borderRadius: 999,
                            objectFit: "cover",
                            border: "1px solid rgba(255,221,135,0.14)",
                            flexShrink: 0,
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: 38,
                            height: 38,
                            borderRadius: 999,
                            flexShrink: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background:
                              "linear-gradient(180deg, rgba(255,221,135,0.18), rgba(88,56,16,0.36))",
                            border: "1px solid rgba(255,221,135,0.14)",
                            color: "#ffe8b1",
                            fontWeight: 900,
                          }}
                        >
                          {m.user_name?.charAt(0)?.toUpperCase() || "N"}
                        </div>
                      )}

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: mine ? "flex-end" : "flex-start",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            gap: 8,
                            alignItems: "center",
                            marginBottom: 6,
                            flexWrap: "wrap",
                            justifyContent: mine ? "flex-end" : "flex-start",
                          }}
                        >
                          <span
                            style={{
                              color: mine ? "#fff3bf" : "#f1d48c",
                              fontSize: 13,
                              fontWeight: 800,
                            }}
                          >
                            {m.user_name}
                          </span>
                          <span
                            style={{
                              color: "#8e7b57",
                              fontSize: 11,
                            }}
                          >
                            {formatTime(m.created_at)}
                          </span>
                        </div>

                        <div
                          style={{
                            borderRadius: 20,
                            padding:
                              m.message && m.image_url
                                ? "12px 12px 10px"
                                : m.image_url
                                ? "10px"
                                : "12px 14px",
                            background: mine
                              ? "linear-gradient(135deg, rgba(255,240,180,0.20), rgba(124,77,255,0.18))"
                              : "linear-gradient(180deg, rgba(22,22,28,0.96), rgba(14,14,18,0.96))",
                            border: mine
                              ? "1px solid rgba(255,221,135,0.24)"
                              : "1px solid rgba(255,221,135,0.10)",
                            color: "#f7f1e3",
                            boxShadow: mine
                              ? "0 0 18px rgba(241,204,116,0.08)"
                              : "0 8px 20px rgba(0,0,0,0.18)",
                            wordBreak: "break-word",
                          }}
                        >
                          {m.image_url ? (
                            <div style={{ marginBottom: m.message ? 10 : 0 }}>
                              <img
                                src={m.image_url}
                                alt="chat"
                                style={{
                                  width: "100%",
                                  maxWidth: 320,
                                  borderRadius: 16,
                                  display: "block",
                                  border: "1px solid rgba(255,221,135,0.16)",
                                }}
                              />
                            </div>
                          ) : null}

                          {m.message ? (
                            <div
                              style={{
                                fontSize: 14,
                                lineHeight: 1.7,
                                whiteSpace: "pre-wrap",
                              }}
                            >
                              {m.message}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div
            style={{
              position: "relative",
              padding: 16,
              borderTop: "1px solid rgba(255,221,135,0.08)",
              background:
                "linear-gradient(180deg, rgba(16,16,20,0.98), rgba(10,10,14,0.98))",
            }}
          >
            {showEmoji && (
              <div
                style={{
                  position: "absolute",
                  left: 16,
                  bottom: 86,
                  width: 300,
                  maxWidth: "calc(100% - 32px)",
                  borderRadius: 20,
                  padding: 14,
                  background:
                    "linear-gradient(180deg, rgba(18,18,22,0.98), rgba(10,10,14,0.98))",
                  border: "1px solid rgba(255,221,135,0.16)",
                  boxShadow: "0 18px 50px rgba(0,0,0,0.32)",
                  zIndex: 20,
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(5, 1fr)",
                    gap: 10,
                  }}
                >
                  {EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => appendEmoji(emoji)}
                      style={{
                        height: 42,
                        borderRadius: 12,
                        border: "1px solid rgba(255,221,135,0.10)",
                        background:
                          "linear-gradient(180deg, rgba(24,24,28,0.96), rgba(13,13,17,0.96))",
                        color: "#fff0bd",
                        cursor: "pointer",
                        fontSize: 20,
                      }}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div
              style={{
                display: "flex",
                gap: 12,
                alignItems: "flex-end",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() => setShowEmoji((prev) => !prev)}
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 14,
                  border: "1px solid rgba(255,221,135,0.12)",
                  background:
                    "linear-gradient(180deg, rgba(20,20,24,0.95), rgba(12,12,16,0.95))",
                  color: "#fff0bd",
                  cursor: "pointer",
                  fontSize: 20,
                  flexShrink: 0,
                }}
              >
                😊
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={!user || uploading}
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 14,
                  border: "1px solid rgba(255,221,135,0.12)",
                  background:
                    "linear-gradient(180deg, rgba(20,20,24,0.95), rgba(12,12,16,0.95))",
                  color: uploading ? "#8d7a55" : "#fff0bd",
                  cursor: !user || uploading ? "not-allowed" : "pointer",
                  fontSize: 18,
                  flexShrink: 0,
                  opacity: !user ? 0.6 : 1,
                }}
              >
                📷
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) uploadImage(file);
                }}
              />

              <div
                style={{
                  flex: 1,
                  minWidth: 240,
                  borderRadius: 20,
                  padding: 2,
                  background: typingGlow
                    ? `
                      radial-gradient(circle at 0% 50%, rgba(138,99,255,0.95), transparent 35%),
                      linear-gradient(135deg, #fff3b0, #f1cc74, #d4a62f, #6f4a17)
                    `
                    : "linear-gradient(135deg, rgba(255,221,135,0.18), rgba(124,77,255,0.18))",
                  transition: "all 0.22s ease",
                }}
              >
                <div
                  style={{
                    borderRadius: 18,
                    background: "#0b0b0f",
                    padding: "8px 12px",
                  }}
                >
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onFocus={() => setTypingGlow(true)}
                    onBlur={() => setTypingGlow(false)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    placeholder={
                      user
                        ? `พิมพ์ข้อความใน #${activeChannel?.name || "chat"}`
                        : "กรุณาเข้าสู่ระบบก่อนจึงจะพิมพ์ได้"
                    }
                    disabled={!user || sending}
                    rows={1}
                    style={{
                      width: "100%",
                      minHeight: 30,
                      maxHeight: 120,
                      resize: "none",
                      overflowY: "auto",
                      border: "none",
                      outline: "none",
                      background: "transparent",
                      color: "#f7f1e3",
                      fontSize: 14,
                      lineHeight: 1.7,
                      fontFamily: '"Noto Sans Thai", sans-serif',
                    }}
                  />
                </div>
              </div>

              <button
                onClick={sendMessage}
                disabled={!user || !text.trim() || sending}
                style={{
                  minWidth: 96,
                  height: 46,
                  borderRadius: 14,
                  border: "none",
                  background:
                    !user || !text.trim() || sending
                      ? "linear-gradient(135deg, #4c432b, #2a2316)"
                      : "linear-gradient(135deg, #fff0b4 0%, #e6bb57 35%, #c88d27 65%, #7c4dff 135%)",
                  color: !user || !text.trim() || sending ? "#a08d66" : "#17130a",
                  fontWeight: 900,
                  cursor:
                    !user || !text.trim() || sending ? "not-allowed" : "pointer",
                  boxShadow:
                    !user || !text.trim() || sending
                      ? "none"
                      : "0 10px 24px rgba(255,204,92,0.18), 0 8px 24px rgba(138,99,255,0.14)",
                }}
              >
                {sending ? "..." : "ส่ง"}
              </button>
            </div>

            <div
              style={{
                marginTop: 10,
                color: "#8e7b57",
                fontSize: 12,
              }}
            >
              Enter = ส่งข้อความ / Shift + Enter = ขึ้นบรรทัดใหม่
              {uploading ? " / กำลังอัปโหลดรูป..." : ""}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}