"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

type UserProfile = {
  name: string;
  email: string;
  avatar: string;
};

type PresenceRow = {
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

const FRIENDS = [
  ["BlazeWarlock", "Join", "NEXORA AI"],
  ["Nexora_Trader", "Playing", "Marketplace"],
  ["ArcaneKnight", "Playing", "Guild Room"],
  ["CoinCollector", "Playing", "Rewards"],
  ["SerialHunter", "Join", "Global Chat"],
];

export default function Home() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    let mounted = true;

    const loadUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (!mounted) return;

      if (error || !data.user) {
        setUserProfile(null);
        setLoading(false);
        return;
      }

      const user = data.user;

      setUserProfile({
        name:
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.email ||
          "NEXORA Member",
        email: user.email || "-",
        avatar:
          user.user_metadata?.picture ||
          user.user_metadata?.avatar_url ||
          user.user_metadata?.photo_url ||
          "",
      });

      setLoading(false);
    };

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;

      if (!session?.user) {
        setUserProfile(null);
        setLoading(false);
        return;
      }

      const user = session.user;

      setUserProfile({
        name:
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.email ||
          "NEXORA Member",
        email: user.email || "-",
        avatar:
          user.user_metadata?.picture ||
          user.user_metadata?.avatar_url ||
          user.user_metadata?.photo_url ||
          "",
      });
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    loadRoomCounts();

    const channel = supabase
      .channel("home-room-counts-flat")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "chat_presence",
        },
        () => {
          loadRoomCounts();
        }
      )
      .subscribe();

    const timer = setInterval(loadRoomCounts, 15000);

    return () => {
      clearInterval(timer);
      supabase.removeChannel(channel);
    };
  }, []);

  async function loadRoomCounts() {
    const now = Date.now();

    const { data } = await supabase
      .from("chat_presence")
      .select("user_id, room_slug, last_seen");

    const rows = (data || []) as PresenceRow[];

    const activeRows = rows.filter((row) => {
      const lastSeen = new Date(row.last_seen).getTime();
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUserProfile(null);
    window.location.href = "/";
  };

  const initials = useMemo(() => {
    if (!userProfile?.name) return "N";
    return userProfile.name.trim().charAt(0).toUpperCase();
  }, [userProfile]);

  return (
    <>
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800;900&family=Inter:wght@400;500;600;700;800&family=Noto+Sans+Thai:wght@400;500;600;700;800;900&display=swap");

        html,
        body {
          margin: 0;
          padding: 0;
          background: #07080b;
          font-family: "Inter", "Noto Sans Thai", sans-serif;
        }

        * {
          box-sizing: border-box;
        }

        a {
          text-decoration: none;
        }

        .nex-scroll::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        .nex-scroll::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.04);
          border-radius: 999px;
        }

        .nex-scroll::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #f3d27a, #cfa04c, #7a4cff);
          border-radius: 999px;
        }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: `
            radial-gradient(circle at top left, rgba(255,185,90,0.10), transparent 16%),
            radial-gradient(circle at top right, rgba(138,99,255,0.10), transparent 18%),
            linear-gradient(180deg, #06070a 0%, #090b10 46%, #06070a 100%)
          `,
          color: "#f3efe6",
          padding: "18px 18px 24px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            opacity: 0.05,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: -120,
            left: -100,
            width: 340,
            height: 340,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,191,94,0.12), transparent 70%)",
            filter: "blur(64px)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: -140,
            right: -80,
            width: 360,
            height: 360,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(138,99,255,0.14), transparent 70%)",
            filter: "blur(72px)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            maxWidth: 1720,
            margin: "0 auto",
            minHeight: "calc(100vh - 36px)",
            display: "grid",
            gridTemplateColumns: "220px minmax(0, 1fr) 280px",
            gap: 24,
            position: "relative",
            zIndex: 2,
          }}
        >
          {/* LEFT */}
          <aside
            style={{
              padding: "6px 0",
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "6px 4px 10px",
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 12,
                  background:
                    "linear-gradient(135deg, rgba(255,96,82,0.96), rgba(255,154,82,0.96))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontWeight: 900,
                  boxShadow: "0 10px 18px rgba(255,120,82,0.16)",
                }}
              >
                N
              </div>

              <div>
                <div
                  style={{
                    fontWeight: 900,
                    fontSize: 18,
                    color: "#ffffff",
                    lineHeight: 1.05,
                  }}
                >
                  NEXORA
                </div>
                <div
                  style={{
                    color: "#8d7d5b",
                    fontSize: 11,
                    marginTop: 3,
                  }}
                >
                  fantasy card platform
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gap: 6 }}>
              <SidebarItem icon="⌂" label="Home" active />
              <SidebarItem icon="◫" label="Category" />
              <SidebarItem icon="☰" label="Library" />
              <SidebarItem icon="#" label="Community" badge="2" />
              <SidebarItem icon="◉" label="Friends" />
              <SidebarItem icon="♡" label="Wishlist" />
              <SidebarItem icon="↓" label="Downloads" />
            </div>

            <div style={{ flex: 1 }} />

            <div
              style={{
                padding: "18px 6px 0",
              }}
            >
              <div
                style={{
                  borderRadius: 22,
                  padding: 18,
                  background:
                    "linear-gradient(180deg, rgba(255,88,108,0.14), rgba(255,128,76,0.10))",
                  border: "1px solid rgba(255,128,76,0.08)",
                }}
              >
                <div
                  style={{
                    color: "#fff",
                    fontWeight: 900,
                    fontSize: 34,
                    lineHeight: 1,
                    marginBottom: 8,
                  }}
                >
                  50%
                </div>
                <div
                  style={{
                    color: "#ffdacf",
                    lineHeight: 1.7,
                    fontWeight: 600,
                    marginBottom: 14,
                    fontSize: 14,
                  }}
                >
                  พื้นที่โปรโมชันหรือแคมเปญพิเศษ
                </div>

                <Link
                  href="/library"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: 40,
                    padding: "0 14px",
                    borderRadius: 14,
                    background: "rgba(19,22,30,0.92)",
                    color: "#fff",
                    fontWeight: 800,
                  }}
                >
                  Go to library
                </Link>
              </div>
            </div>
          </aside>

          {/* CENTER */}
          <main
            style={{
              minWidth: 0,
              display: "grid",
              gap: 18,
            }}
          >
            {/* SEARCH */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1fr) auto",
                gap: 12,
                alignItems: "center",
              }}
            >
              <div
                style={{
                  height: 58,
                  borderRadius: 20,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.03)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0 18px",
                }}
              >
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search"
                  style={{
                    flex: 1,
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    color: "#f6f1e7",
                    fontSize: 20,
                    fontWeight: 500,
                    fontFamily: '"Inter", "Noto Sans Thai", sans-serif',
                  }}
                />
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 999,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ead6a4",
                    fontSize: 20,
                  }}
                >
                  ⌕
                </div>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <RoundButton>✉</RoundButton>
                <RoundButton>🔔</RoundButton>
              </div>
            </div>

            {/* MAIN HERO AI */}
            <section
              style={{
                position: "relative",
                minHeight: 360,
                borderRadius: 26,
                overflow: "hidden",
                background: `
                  linear-gradient(90deg, rgba(5,7,14,0.84) 0%, rgba(6,8,16,0.62) 46%, rgba(6,8,16,0.32) 100%),
                  linear-gradient(180deg, rgba(6,8,16,0.06), rgba(6,8,16,0.82)),
                  url("https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1600&auto=format&fit=crop")
                `,
                backgroundSize: "cover",
                backgroundPosition: "center",
                border: "1px solid rgba(255,255,255,0.03)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "radial-gradient(circle at 26% 18%, rgba(101,165,255,0.18), transparent 22%), radial-gradient(circle at 84% 16%, rgba(255,64,150,0.14), transparent 18%)",
                }}
              />

              <div
                style={{
                  position: "relative",
                  zIndex: 2,
                  height: "100%",
                  padding: 24,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {["AI", "Fantasy", "Cardgame", "Community"].map((tag) => (
                    <div
                      key={tag}
                      style={{
                        minHeight: 32,
                        padding: "0 14px",
                        borderRadius: 999,
                        display: "inline-flex",
                        alignItems: "center",
                        background: "rgba(255,255,255,0.12)",
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: 13,
                      }}
                    >
                      {tag}
                    </div>
                  ))}
                </div>

                <div style={{ maxWidth: 720 }}>
                  <div
                    style={{
                      fontFamily: '"Cinzel", "Noto Sans Thai", serif',
                      fontSize: "clamp(40px, 4vw, 68px)",
                      lineHeight: 0.95,
                      fontWeight: 900,
                      color: "#ffffff",
                      marginBottom: 10,
                      textShadow: "0 10px 24px rgba(0,0,0,0.20)",
                    }}
                  >
                    BLAZE WARLOCK •
                    <br />
                    NEXORA AI
                  </div>

                  <div
                    style={{
                      color: "rgba(255,255,255,0.92)",
                      fontSize: 16,
                      lineHeight: 1.8,
                      maxWidth: 620,
                    }}
                  >
                    ผู้ช่วยหลักของระบบ พร้อมคุย วิเคราะห์ และช่วยงานทันที
                    เข้าถึง AI ได้จากหน้าแรกแบบเนียนไปกับระบบทั้งหมด
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                    gap: 16,
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    style={{
                      padding: "18px 22px",
                      borderRadius: 22,
                      background:
                        "linear-gradient(135deg, rgba(255,78,104,0.96), rgba(255,142,58,0.96))",
                      boxShadow: "0 16px 28px rgba(255,102,72,0.20)",
                      minWidth: 220,
                    }}
                  >
                    <div
                      style={{
                        color: "#fff",
                        fontWeight: 900,
                        fontSize: 28,
                        lineHeight: 1,
                        marginBottom: 6,
                      }}
                    >
                      AI READY
                    </div>
                    <div
                      style={{
                        color: "rgba(255,255,255,0.90)",
                        fontSize: 14,
                      }}
                    >
                      พร้อมตอบทุกคำถาม ช่วยคิด และทำงานต่อได้ทันที
                    </div>
                  </div>

                  <div
                    style={{
                      width: 54,
                      height: 54,
                      borderRadius: 18,
                      background: "rgba(255,255,255,0.10)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontSize: 22,
                    }}
                  >
                    ☰
                  </div>
                </div>
              </div>
            </section>

            {/* LOWER */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.08fr 0.92fr",
                gap: 20,
                alignItems: "start",
              }}
            >
              {/* AI CONSOLE LIVE */}
              <section>
                <div
                  style={{
                    fontFamily: '"Cinzel", "Noto Sans Thai", serif',
                    fontSize: 18,
                    fontWeight: 800,
                    color: "#e2c06b",
                    marginBottom: 8,
                    letterSpacing: "0.02em",
                  }}
                >
                  Blaze Warlock Console
                </div>
                <div
                  style={{
                    color: "#9e8b67",
                    fontSize: 14,
                    marginBottom: 14,
                  }}
                >
                  คุยกับ AI ได้ทันทีจากหน้าแรก
                </div>

                <div
                  style={{
                    borderRadius: 24,
                    padding: 2,
                    background: `
                      radial-gradient(circle at 100% 0%, rgba(138,99,255,0.88) 0%, rgba(138,99,255,0.42) 20%, transparent 45%),
                      linear-gradient(135deg, #fff3b0, #f1cc74 40%, #d4a62f 70%, #6f4a17)
                    `,
                    boxShadow:
                      "0 0 16px rgba(241,204,116,0.14), 0 0 36px rgba(138,99,255,0.08)",
                  }}
                >
                  <iframe
                    src="https://script.google.com/macros/s/AKfycbzkYYwBvBryWEWCIMQpYanfeiRbta6geYhq2SlluadVGGiw3C2XsEPW-pT59PqcIF6C/exec"
                    style={{
                      width: "100%",
                      height: 620,
                      border: 0,
                      display: "block",
                      borderRadius: 22,
                      background: "#000",
                    }}
                    loading="lazy"
                    allow="clipboard-read; clipboard-write"
                  />
                </div>
              </section>

              {/* PLAYER ROOMS */}
              <section>
                <div
                  style={{
                    color: "#9e8b67",
                    fontSize: 14,
                    marginBottom: 12,
                  }}
                >
                  ห้องออนไลน์ในระบบ คุณเข้าห้องได้ทันที
                </div>

                <div
                  style={{
                    fontFamily: '"Cinzel", "Noto Sans Thai", serif',
                    fontSize: 28,
                    fontWeight: 800,
                    lineHeight: 1,
                    marginBottom: 18,
                    background:
                      "linear-gradient(180deg, #fff8dd 0%, #f7d978 35%, #dca347 70%, #7d4b16 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  ห้องแชทผู้เล่น
                </div>

                <div style={{ display: "grid", gap: 14 }}>
                  {ROOMS.map((room) => {
                    const count = counts[room.slug] || 0;
                    return (
                      <Link
                        key={room.slug}
                        href={`/chat/${room.slug}`}
                        style={{
                          borderRadius: 22,
                          padding: 18,
                          background: "rgba(255,255,255,0.02)",
                          border: "1px solid rgba(255,255,255,0.03)",
                          display: "grid",
                          gridTemplateColumns: "minmax(0, 1fr) auto",
                          gap: 12,
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontWeight: 800,
                              fontSize: 22,
                              color: "#f6f1e7",
                              marginBottom: 6,
                            }}
                          >
                            {room.name}
                          </div>
                          <div
                            style={{
                              color: "#9f8a62",
                              fontSize: 13,
                            }}
                          >
                            {room.desc}
                          </div>
                        </div>

                        <div
                          style={{
                            display: "grid",
                            justifyItems: "end",
                            gap: 10,
                          }}
                        >
                          <div
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 8,
                              minHeight: 30,
                              padding: "0 10px",
                              borderRadius: 999,
                              background: "rgba(255,255,255,0.05)",
                              color: "#f3d27a",
                              fontSize: 13,
                              fontWeight: 700,
                            }}
                          >
                            <span
                              style={{
                                width: 8,
                                height: 8,
                                borderRadius: 999,
                                background:
                                  count > 0 ? "#f7d978" : "rgba(255,255,255,0.24)",
                                boxShadow: count > 0 ? "0 0 10px rgba(247,217,120,0.54)" : "none",
                              }}
                            />
                            {count} คน
                          </div>

                          <div
                            style={{
                              minHeight: 36,
                              padding: "0 14px",
                              borderRadius: 14,
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              background:
                                "linear-gradient(135deg, #fff0b4 0%, #e6bb57 35%, #c88d27 65%, #7c4dff 135%)",
                              color: "#17130a",
                              fontWeight: 900,
                            }}
                          >
                            เข้าห้อง
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            </div>
          </main>

          {/* RIGHT */}
          <aside
            style={{
              padding: "6px 0 0 8px",
              display: "grid",
              gap: 24,
              alignContent: "start",
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.01), rgba(255,255,255,0.005))",
              borderLeft: "1px solid rgba(255,255,255,0.04)",
            }}
          >
            {/* USER TOP */}
            <div
              style={{
                padding: "2px 0 10px",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "54px minmax(0, 1fr)",
                  gap: 12,
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                {loading ? (
                  <>
                    <div
                      style={{
                        width: 54,
                        height: 54,
                        borderRadius: 999,
                        background:
                          "linear-gradient(180deg, rgba(255,221,135,0.20), rgba(88,56,16,0.36))",
                      }}
                    />
                    <div>
                      <div style={{ color: "#f7f1e3", fontWeight: 800 }}>Loading...</div>
                      <div style={{ color: "#a99671", fontSize: 13 }}>...</div>
                    </div>
                  </>
                ) : (
                  <>
                    {userProfile?.avatar ? (
                      <img
                        src={userProfile.avatar}
                        alt={userProfile.name}
                        referrerPolicy="no-referrer"
                        style={{
                          width: 54,
                          height: 54,
                          borderRadius: 999,
                          objectFit: "cover",
                          border: "2px solid rgba(255,221,135,0.14)",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 54,
                          height: 54,
                          borderRadius: 999,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background:
                            "linear-gradient(180deg, rgba(255,221,135,0.20), rgba(88,56,16,0.36))",
                          border: "2px solid rgba(255,221,135,0.14)",
                          color: "#ffe8b1",
                          fontWeight: 900,
                        }}
                      >
                        {initials}
                      </div>
                    )}
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          color: "#f7f1e3",
                          fontWeight: 900,
                          fontSize: 18,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {userProfile?.name || "Guest Mode"}
                      </div>
                      <div
                        style={{
                          color: "#a99671",
                          fontSize: 13,
                          marginTop: 4,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {userProfile?.email || "Please sign in"}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {userProfile ? (
                <button
                  onClick={handleLogout}
                  style={{
                    width: "100%",
                    minHeight: 40,
                    borderRadius: 999,
                    border: "1px solid rgba(255,255,255,0.05)",
                    background: "rgba(255,255,255,0.03)",
                    color: "#f4dfac",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  ออกจากระบบ
                </button>
              ) : (
                <Link
                  href="/login"
                  style={{
                    width: "100%",
                    minHeight: 40,
                    borderRadius: 999,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(255,255,255,0.05)",
                    color: "#f4dfac",
                    fontWeight: 700,
                  }}
                >
                  เข้าสู่ระบบ
                </Link>
              )}
            </div>

            {/* FRIENDS */}
            <div>
              <div
                style={{
                  color: "#f7f1e3",
                  fontWeight: 900,
                  fontSize: 18,
                  marginBottom: 18,
                }}
              >
                Friends online
              </div>

              {FRIENDS.map(([name, status, room], idx) => (
                <FlatFriendRow
                  key={name}
                  name={name}
                  status={status}
                  room={room}
                  index={idx}
                />
              ))}
            </div>

            {/* ACTIVE */}
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 18,
                }}
              >
                <div
                  style={{
                    color: "#f7f1e3",
                    fontWeight: 900,
                    fontSize: 18,
                  }}
                >
                  Recently played
                </div>

                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 999,
                    background: "rgba(255,255,255,0.05)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#d7c8a5",
                    fontSize: 18,
                  }}
                >
                  •••
                </div>
              </div>

              <FlatActiveRow title="Hitman World of Assass..." value={72} />
              <FlatActiveRow title="Forza Horizon 5" value={47} />
              <FlatActiveRow title="The Witcher 3 Wild Hunt" value={12} />
              <FlatActiveRow title="NBA 2K24" value={96} />
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}

function SidebarItem({
  icon,
  label,
  active,
  badge,
}: {
  icon: string;
  label: string;
  active?: boolean;
  badge?: string;
}) {
  return (
    <Link
      href="#"
      style={{
        minHeight: 48,
        padding: "0 12px",
        borderRadius: 14,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        color: active ? "#ff6f86" : "#e3dbcd",
        background: active
          ? "linear-gradient(90deg, rgba(255,92,112,0.08), rgba(255,255,255,0.01))"
          : "transparent",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 20, textAlign: "center", fontSize: 15 }}>{icon}</div>
        <div style={{ fontWeight: 700 }}>{label}</div>
      </div>
      {badge ? (
        <div
          style={{
            minWidth: 24,
            height: 24,
            padding: "0 8px",
            borderRadius: 999,
            background:
              "linear-gradient(135deg, rgba(255,84,120,0.95), rgba(255,125,75,0.95))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: 800,
            fontSize: 12,
          }}
        >
          {badge}
        </div>
      ) : null}
    </Link>
  );
}

function RoundButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      style={{
        width: 50,
        height: 50,
        borderRadius: 999,
        border: "1px solid rgba(255,255,255,0.04)",
        background: "rgba(255,255,255,0.04)",
        color: "#f3dfae",
        fontSize: 18,
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}

function FlatFriendRow({
  name,
  status,
  room,
  index,
}: {
  name: string;
  status: string;
  room: string;
  index: number;
}) {
  const palette = [
    "linear-gradient(135deg, #8f6bff, #ff6fa8)",
    "linear-gradient(135deg, #ff9f43, #ff6b6b)",
    "linear-gradient(135deg, #59c3ff, #7b61ff)",
    "linear-gradient(135deg, #ffd166, #ef476f)",
    "linear-gradient(135deg, #43e97b, #38f9d7)",
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "44px minmax(0, 1fr)",
        gap: 12,
        alignItems: "center",
        marginBottom: 18,
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 999,
          background: palette[index % palette.length],
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontWeight: 900,
          position: "relative",
        }}
      >
        {name.charAt(0)}
        <span
          style={{
            position: "absolute",
            right: 1,
            bottom: 1,
            width: 10,
            height: 10,
            borderRadius: 999,
            background: "#2dfc7b",
            border: "2px solid #17171d",
            boxShadow: "0 0 10px rgba(45,252,123,0.65)",
          }}
        />
      </div>

      <div style={{ minWidth: 0 }}>
        <div
          style={{
            color: "#f7f1e3",
            fontWeight: 800,
            fontSize: 15,
            lineHeight: 1.2,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {name}
        </div>

        <div
          style={{
            marginTop: 4,
            display: "flex",
            gap: 8,
            alignItems: "center",
            flexWrap: "wrap",
            color: "#b8ab90",
            fontSize: 13,
          }}
        >
          <span>{status}</span>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              minHeight: 22,
              padding: "0 8px",
              borderRadius: 8,
              background: "rgba(255,255,255,0.06)",
              color: "#d7c8a5",
              fontSize: 12,
            }}
          >
            {room}
          </span>
        </div>
      </div>
    </div>
  );
}

function FlatActiveRow({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: 12,
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
            border: "1px solid rgba(255,255,255,0.04)",
            flexShrink: 0,
          }}
        />
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              color: "#f7f1e3",
              fontWeight: 700,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {title}
          </div>
          <div
            style={{
              color: "#d8d0c2",
              fontSize: 13,
              marginTop: 4,
            }}
          >
            {value}%
          </div>
        </div>
      </div>

      <div
        style={{
          height: 5,
          borderRadius: 999,
          background: "rgba(255,255,255,0.08)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${value}%`,
            height: "100%",
            borderRadius: 999,
            background: "#f0eef5",
          }}
        />
      </div>
    </div>
  );
}