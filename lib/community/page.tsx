"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Message = {
  id: number;
  user: string;
  room: string;
  text: string;
  time: string;
};

const initialMessages: Message[] = [
  { id: 1, user: "Boss", room: "ทั่วไป", text: "ยินดีต้อนรับสู่คอมมูนิตี้ NEXORA", time: "12:10" },
  { id: 2, user: "Mint", room: "ทั่วไป", text: "มีใครเปิด Gold Pack วันนี้บ้าง", time: "12:11" },
  { id: 3, user: "Aum", room: "ซื้อขาย", text: "กำลังหาการ์ดธาตุไฟเลขสวย", time: "12:13" },
  { id: 4, user: "Top", room: "แข่งขัน", text: "คืนนี้มีคนซ้อมทัวร์นาเมนต์ไหม", time: "12:15" },
];

const rooms = ["ทั่วไป", "ซื้อขาย", "แข่งขัน", "ประกาศ", "หาเพื่อน"];

export default function CommunityPage() {
  const [user, setUser] = useState("Guest");
  const [activeRoom, setActiveRoom] = useState("ทั่วไป");
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");

  useEffect(() => {
  }, []);

  const filteredMessages = useMemo(() => {
    return messages.filter((m) => m.room === activeRoom);
  }, [messages, activeRoom]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;

    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;

    const newMessage: Message = {
      id: Date.now(),
      user,
      room: activeRoom,
      text,
      time,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(255,200,80,0.14), transparent 18%), linear-gradient(180deg, #070b14 0%, #091224 45%, #050814 100%)",
        color: "white",
        fontFamily: "Arial, sans-serif",
        padding: "24px",
      }}
    >
      <div style={{ maxWidth: 1450, margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
            flexWrap: "wrap",
            marginBottom: 24,
          }}
        >
          <div>
            <div
              style={{
                display: "inline-block",
                padding: "8px 14px",
                borderRadius: 999,
                background: "rgba(255,214,74,0.08)",
                border: "1px solid rgba(255,214,74,0.24)",
                color: "#ffe08a",
                fontSize: 12,
                letterSpacing: 1,
                marginBottom: 10,
              }}
            >
              NEXORA COMMUNITY
            </div>
            <div
              style={{
                fontSize: "clamp(34px, 6vw, 70px)",
                fontWeight: 900,
                lineHeight: 0.95,
                color: "#ffd54a",
              }}
            >
              COMMUNITY CHAT
            </div>
            <div style={{ marginTop: 8, color: "rgba(255,255,255,0.72)" }}>
              ศูนย์กลางพูดคุยของผู้เล่น NEXORA
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <div
              style={{
                padding: "12px 16px",
                borderRadius: 14,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              👤 {user}
            </div>
            <Link
              href="/"
              style={{
                padding: "12px 18px",
                borderRadius: 14,
                background: "linear-gradient(180deg, #ffd34d 0%, #bf8209 100%)",
                color: "#1e1303",
                fontWeight: 800,
              }}
            >
              กลับหน้าแรก
            </Link>
          </div>
        </div>

        {/* Layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "280px 1fr",
            gap: 18,
          }}
        >
          {/* Sidebar */}
          <aside
            style={{
              borderRadius: 24,
              padding: 18,
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 18px 50px rgba(0,0,0,0.22)",
              alignSelf: "start",
            }}
          >
            <div
              style={{
                fontSize: 20,
                fontWeight: 800,
                color: "#fff3bf",
                marginBottom: 14,
              }}
            >
              Rooms
            </div>

            <div style={{ display: "grid", gap: 10 }}>
              {rooms.map((room) => {
                const active = activeRoom === room;
                return (
                  <button
                    key={room}
                    onClick={() => setActiveRoom(room)}
                    style={{
                      textAlign: "left",
                      padding: "14px 14px",
                      borderRadius: 14,
                      border: active
                        ? "1px solid rgba(255,214,74,0.35)"
                        : "1px solid rgba(255,255,255,0.08)",
                      background: active
                        ? "linear-gradient(180deg, rgba(255,214,74,0.14), rgba(255,214,74,0.05))"
                        : "rgba(255,255,255,0.04)",
                      color: active ? "#ffe08a" : "white",
                      cursor: "pointer",
                      fontWeight: 700,
                    }}
                  >
                    #{room}
                  </button>
                );
              })}
            </div>

            <div
              style={{
                marginTop: 20,
                borderRadius: 18,
                padding: 14,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div style={{ fontWeight: 800, color: "#fff3bf", marginBottom: 8 }}>
                Community Status
              </div>
              <div style={{ color: "rgba(255,255,255,0.68)", fontSize: 14, lineHeight: 1.7 }}>
                ออนไลน์ 128 คน<br />
                ห้องยอดนิยม: #{activeRoom}
              </div>
            </div>
          </aside>

          {/* Chat area */}
          <section
            style={{
              borderRadius: 24,
              padding: 18,
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 18px 50px rgba(0,0,0,0.22)",
              minHeight: "70vh",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                padding: "8px 4px 16px",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                marginBottom: 14,
              }}
            >
              <div style={{ fontSize: 24, fontWeight: 900, color: "#ffd54a" }}>
                #{activeRoom}
              </div>
              <div style={{ color: "rgba(255,255,255,0.66)", marginTop: 6 }}>
                พื้นที่สนทนาสำหรับสมาชิก NEXORA
              </div>
            </div>

            <div
              style={{
                flex: 1,
                overflowY: "auto",
                display: "grid",
                gap: 12,
                paddingRight: 4,
              }}
            >
              {filteredMessages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    borderRadius: 18,
                    padding: 14,
                    background:
                      msg.user === user
                        ? "linear-gradient(180deg, rgba(255,214,74,0.12), rgba(255,214,74,0.04))"
                        : "rgba(255,255,255,0.04)",
                    border:
                      msg.user === user
                        ? "1px solid rgba(255,214,74,0.22)"
                        : "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 12,
                      marginBottom: 8,
                    }}
                  >
                    <strong style={{ color: msg.user === user ? "#ffe08a" : "#fff3bf" }}>
                      {msg.user}
                    </strong>
                    <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>
                      {msg.time}
                    </span>
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.84)", lineHeight: 1.7 }}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: 16,
                display: "grid",
                gridTemplateColumns: "1fr 160px",
                gap: 12,
              }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSend();
                }}
                placeholder={`พิมพ์ข้อความใน #${activeRoom}`}
                style={{
                  width: "100%",
                  padding: "16px 18px",
                  borderRadius: 16,
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.06)",
                  color: "white",
                  fontSize: 16,
                  outline: "none",
                }}
              />

              <button
                onClick={handleSend}
                style={{
                  border: "none",
                  borderRadius: 16,
                  background: "linear-gradient(180deg, #ffd34d 0%, #bf8209 100%)",
                  color: "#1f1603",
                  fontWeight: 900,
                  fontSize: 16,
                  cursor: "pointer",
                  boxShadow: "0 14px 28px rgba(255,211,77,0.18)",
                }}
              >
                ส่งข้อความ
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}