"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type PresenceUser = {
  user_id: string;
  room_slug: string;
  last_seen: string;
};

const ROOMS = [
  { slug: "global", name: "Global Chat", desc: "ห้องคุยหลักของผู้เล่น" },
  { slug: "market", name: "Marketplace", desc: "ห้องซื้อขายและดีล" },
  { slug: "guild", name: "Guild Room", desc: "ห้องกิลด์และทีม" },
  { slug: "tournament", name: "Tournament", desc: "ห้องแข่งขันและกิจกรรม" },
];

export default function PlayerRooms() {
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    loadCounts();

    const channel = supabase
      .channel("rooms-online")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "chat_presence",
        },
        () => {
          loadCounts();
        }
      )
      .subscribe();

    const timer = setInterval(loadCounts, 15000);

    return () => {
      clearInterval(timer);
      supabase.removeChannel(channel);
    };
  }, []);

  async function loadCounts() {
    const now = Date.now();

    const { data } = await supabase
      .from("chat_presence")
      .select("user_id, room_slug, last_seen");

    const rows = (data || []) as PresenceUser[];

    const activeRows = rows.filter((u) => {
      const lastSeen = new Date(u.last_seen).getTime();
      return now - lastSeen <= 60000;
    });

    const map: Record<string, Set<string>> = {};

    for (const row of activeRows) {
      if (!map[row.room_slug]) map[row.room_slug] = new Set();
      map[row.room_slug].add(row.user_id);
    }

    const result: Record<string, number> = {};
    for (const room of ROOMS) {
      result[room.slug] = map[room.slug]?.size || 0;
    }

    setCounts(result);
  }

  function getDotColor(count: number) {
    if (count >= 5) return "#2dfc7b";
    if (count >= 1) return "#f7d978";
    return "#555";
  }

  return (
    <div style={{ marginTop: 28 }}>
      <div
        style={{
          fontFamily: '"Cinzel", "Noto Sans Thai", serif',
          fontSize: 30,
          fontWeight: 800,
          marginBottom: 16,
          background:
            "linear-gradient(180deg, #fff8dd 0%, #f7d978 35%, #dca347 70%, #7d4b16 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        ห้องแชทผู้เล่น
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 16,
        }}
      >
        {ROOMS.map((room) => {
          const count = counts[room.slug] || 0;

          return (
            <Link
              key={room.slug}
              href={`/chat/${room.slug}`}
              style={{
                borderRadius: 22,
                padding: 20,
                background:
                  "linear-gradient(180deg, rgba(20,20,24,0.96), rgba(10,10,14,0.96))",
                border: "1px solid rgba(255,221,135,0.10)",
                boxShadow: "0 12px 30px rgba(0,0,0,0.24)",
                display: "block",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 14,
                }}
              >
                <div
                  style={{
                    fontSize: 20,
                    fontWeight: 800,
                    color: "#f7e2a3",
                  }}
                >
                  {room.name}
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "6px 10px",
                    borderRadius: 999,
                    background: "rgba(255,255,255,0.04)",
                    color: "#e9d7a3",
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 999,
                      background: getDotColor(count),
                      boxShadow:
                        count > 0
                          ? `0 0 10px ${getDotColor(count)}`
                          : "none",
                    }}
                  />
                  {count} คน
                </div>
              </div>

              <div
                style={{
                  color: "#a99671",
                  fontSize: 14,
                  lineHeight: 1.7,
                  marginBottom: 16,
                }}
              >
                {room.desc}
              </div>

              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 42,
                  padding: "0 14px",
                  borderRadius: 14,
                  background:
                    "linear-gradient(135deg, #fff0b4 0%, #e6bb57 35%, #c88d27 65%, #7c4dff 135%)",
                  color: "#17130a",
                  fontWeight: 900,
                }}
              >
                เข้าห้อง
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}