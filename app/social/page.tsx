"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import CreatePost from "@/components/social/CreatePost";
import Feed from "@/components/social/Feed";

type UserType = any;

const STORIES = [
  { title: "Blaze Warlock", subtitle: "AI Console", accent: "orange" },
  { title: "Guild Arena", subtitle: "Live now", accent: "purple" },
  { title: "Marketplace", subtitle: "Hot trades", accent: "gold" },
  { title: "Infernal Flame", subtitle: "New set", accent: "red" },
  { title: "Tidal Wrath", subtitle: "Collection", accent: "blue" },
  { title: "Vault of Origin", subtitle: "Legend rumor", accent: "gold" },
];

const TRENDING = [
  "#InfernalFlame",
  "#NexoraMarketplace",
  "#GuildRoom",
  "#SerialHunter",
  "#TournamentSeason",
  "#VaultOfOrigin",
];

const FRIENDS_ONLINE = [
  { name: "BlazeWarlock", place: "NEXORA AI", color: "#d36bff" },
  { name: "Nexora_Trader", place: "Marketplace", color: "#ff9a57" },
  { name: "ArcaneKnight", place: "Guild Room", color: "#6ea7ff" },
  { name: "CoinCollector", place: "Rewards", color: "#ffb86c" },
  { name: "SerialHunter", place: "Global Chat", color: "#55f0a5" },
];

const ROOMS = [
  { title: "Global Chat", desc: "ห้องคุยสดทั้งระบบ", count: "2.4K ออนไลน์" },
  { title: "Marketplace", desc: "ห้องซื้อขายและตามหา", count: "842 ออนไลน์" },
  { title: "Guild Room", desc: "ห้องกิลด์และทีมแข่ง", count: "617 ออนไลน์" },
];

const SUGGESTED = [
  { name: "CoinCollector", role: "Collector Rank S" },
  { name: "SerialHunter", role: "Rare Card Hunter" },
  { name: "PyreLord", role: "Fire Region Duelist" },
  { name: "VerdeloreX", role: "Wood Set Master" },
];

export default function SocialPage() {
  const supabase = useMemo(() => createClient(), []);

  const [userId, setUserId] = useState<string | null>(null);
  const [user, setUser] = useState<UserType | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadUser = async () => {
      setLoadingUser(true);
      const { data, error } = await supabase.auth.getUser();
      if (!mounted) return;

      if (error) {
        console.error("getUser error:", error);
        setUser(null);
        setUserId(null);
        setLoadingUser(false);
        return;
      }

      setUser(data.user ?? null);
      setUserId(data.user?.id ?? null);
      setLoadingUser(false);
    };

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setUser(session?.user ?? null);
      setUserId(session?.user?.id ?? null);
      setLoadingUser(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <>
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800;900&family=Inter:wght@400;500;600;700;800;900&family=Noto+Sans+Thai:wght@400;500;600;700;800;900&display=swap");

        :root {
          --nx-bg: #06070a;
          --nx-panel: rgba(255, 255, 255, 0.04);
          --nx-panel-strong: rgba(255, 255, 255, 0.06);
          --nx-line: rgba(255, 255, 255, 0.06);
          --nx-text: #f6efe2;
          --nx-muted: #9f8a62;
          --nx-gold-1: #fff0b4;
          --nx-gold-2: #e4b958;
          --nx-gold-3: #bf8227;
          --nx-purple: #7c4dff;
          --nx-orange: #ff8a4d;
          --nx-shadow: 0 20px 48px rgba(0, 0, 0, 0.26);
          --nx-radius-xl: 28px;
          --nx-radius-lg: 22px;
          --nx-radius-md: 18px;
        }

        * {
          box-sizing: border-box;
        }

        html,
        body {
          margin: 0;
          padding: 0;
          background: var(--nx-bg);
          color: var(--nx-text);
          font-family: "Inter", "Noto Sans Thai", sans-serif;
        }

        body {
          overflow-x: hidden;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .nex-shell {
          color: var(--nx-text);
        }

        .nex-shell button,
        .nex-shell input,
        .nex-shell textarea {
          font-family: inherit;
        }

        .nex-shell ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        .nex-shell ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.04);
          border-radius: 999px;
        }

        .nex-shell ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #f3d27a, #c88d27, #7c4dff);
          border-radius: 999px;
        }

        .nex-shell input::placeholder,
        .nex-shell textarea::placeholder {
          color: rgba(255, 255, 255, 0.42);
        }

        .nex-layout {
          max-width: 1760px;
          margin: 0 auto;
          padding: 18px;
          display: grid;
          grid-template-columns: 220px minmax(0, 1fr) 330px;
          gap: 22px;
          min-height: 100vh;
          position: relative;
          z-index: 2;
        }

        .nex-main {
          min-width: 0;
          display: grid;
          gap: 18px;
        }

        .nex-feed-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 320px;
          gap: 18px;
          align-items: start;
        }

        .nex-glass {
          background: linear-gradient(180deg, rgba(255,255,255,0.045), rgba(7,9,15,0.96));
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: var(--nx-radius-lg);
          box-shadow: var(--nx-shadow);
        }

        .nex-soft {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: var(--nx-radius-lg);
        }

        .nex-shell :global(.create-post-card),
        .nex-shell :global(.feed-card),
        .nex-shell :global(.post-card),
        .nex-shell :global(.comment-card) {
          background: linear-gradient(180deg, rgba(255,255,255,0.045), rgba(7,9,15,0.96));
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 24px;
          box-shadow: var(--nx-shadow);
          color: var(--nx-text);
        }

        .nex-shell :global(.create-post-card),
        .nex-shell :global(.feed-card) {
          overflow: hidden;
        }

        .nex-shell :global(.create-post-card textarea),
        .nex-shell :global(.create-post-card input[type="text"]),
        .nex-shell :global(.feed-card textarea),
        .nex-shell :global(.feed-card input[type="text"]),
        .nex-shell :global(.post-card textarea),
        .nex-shell :global(.post-card input[type="text"]) {
          background: rgba(255,255,255,0.035) !important;
          color: #fff !important;
          border: 1px solid rgba(255,255,255,0.06) !important;
          border-radius: 16px !important;
        }

        .nex-shell :global(.create-post-card button),
        .nex-shell :global(.feed-card button),
        .nex-shell :global(.post-card button) {
          border-radius: 14px;
        }

        @media (max-width: 1540px) {
          .nex-layout {
            grid-template-columns: 94px minmax(0, 1fr) 310px;
          }

          .nex-brand-copy,
          .nex-menu-label,
          .nex-left-promo {
            display: none !important;
          }

          .nex-left {
            align-items: center;
          }
        }

        @media (max-width: 1320px) {
          .nex-layout {
            grid-template-columns: 94px minmax(0, 1fr);
          }

          .nex-right {
            display: none !important;
          }
        }

        @media (max-width: 940px) {
          .nex-layout {
            grid-template-columns: minmax(0, 1fr);
            padding: 12px;
          }

          .nex-left {
            display: none !important;
          }

          .nex-feed-grid,
          .nex-topbar,
          .nex-hero-bottom {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <div
        className="nex-shell"
        style={{
          minHeight: "100vh",
          background: `
            radial-gradient(circle at top left, rgba(255,172,76,0.10), transparent 18%),
            radial-gradient(circle at top right, rgba(124,77,255,0.12), transparent 20%),
            linear-gradient(180deg, #050609 0%, #080b11 48%, #050609 100%)
          `,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <GlowOrb top={-120} left={-60} size={320} color="rgba(255,174,76,0.14)" blur={70} />
        <GlowOrb top={-100} right={-40} size={360} color="rgba(124,77,255,0.14)" blur={78} />

        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            opacity: 0.05,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "38px 38px",
          }}
        />

        <div className="nex-layout">
          <aside className="nex-left" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "6px 4px 10px" }}>
              <LogoBox />
              <div className="nex-brand-copy">
                <div style={{ fontWeight: 900, fontSize: 19, color: "#fff" }}>NEXORA</div>
                <div style={{ color: "#8d7d5b", fontSize: 11, marginTop: 3 }}>social fantasy realm</div>
              </div>
            </div>

            <div style={{ display: "grid", gap: 8 }}>
              <SidebarItem label="Home" icon="⌂" />
              <SidebarItem label="Social" icon="✦" active />
              <SidebarItem label="Explore" icon="⌕" />
              <SidebarItem label="Marketplace" icon="◈" />
              <SidebarItem label="Guilds" icon="⚔" />
              <SidebarItem label="Notifications" icon="🔔" badge="9" />
              <SidebarItem label="Messages" icon="✉" badge="3" />
              <SidebarItem label="Profile" icon="◉" />
            </div>

            <div style={{ flex: 1 }} />

            <div
              className="nex-left-promo nex-glass"
              style={{ padding: 18 }}
            >
              <div
                style={{
                  fontFamily: '"Cinzel", "Noto Sans Thai", serif',
                  fontSize: 24,
                  fontWeight: 800,
                  color: "#fff4d0",
                  lineHeight: 1.08,
                  marginBottom: 8,
                }}
              >
                Social
                <br />
                Ascension
              </div>
              <div style={{ color: "#ebd4c3", fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>
                หน้าฟีดจริงของ NEXORA ที่พร้อมต่อระบบโพสต์ รูป คอมเมนต์ และห้องคุยแบบเต็มตัว
              </div>
              <ActionButton label="Create Post" variant="gold" full />
            </div>
          </aside>

          <main className="nex-main">
            <div
              className="nex-topbar"
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0,1fr) auto",
                gap: 12,
                alignItems: "center",
              }}
            >
              <div
                className="nex-soft"
                style={{
                  height: 58,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0 18px",
                }}
              >
                <input
                  placeholder="ค้นหาโพสต์ การ์ด ผู้เล่น หรือห้องคอมมูนิตี้"
                  style={{
                    flex: 1,
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    color: "#f6f1e7",
                    fontSize: 18,
                    fontWeight: 500,
                  }}
                />
                <div style={{ width: 38, textAlign: "center", color: "#ead6a4", fontSize: 20 }}>⌕</div>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <RoundButton>✉</RoundButton>
                <RoundButton>🔔</RoundButton>
                <RoundButton>⚡</RoundButton>
              </div>
            </div>

            <section
              style={{
                position: "relative",
                minHeight: 310,
                borderRadius: 28,
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.04)",
                background: `
                  linear-gradient(90deg, rgba(5,7,14,0.90) 0%, rgba(6,8,16,0.60) 46%, rgba(6,8,16,0.24) 100%),
                  linear-gradient(180deg, rgba(6,8,16,0.08), rgba(6,8,16,0.82)),
                  url("https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1600&auto=format&fit=crop")
                `,
                backgroundSize: "cover",
                backgroundPosition: "center",
                boxShadow: "var(--nx-shadow)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "radial-gradient(circle at 18% 20%, rgba(255,155,66,0.16), transparent 20%), radial-gradient(circle at 85% 18%, rgba(124,77,255,0.14), transparent 18%)",
                }}
              />

              <div
                style={{
                  position: "relative",
                  zIndex: 2,
                  padding: 24,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: 16,
                }}
              >
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {["Social Realm", "Community", "Guilds", "Marketplace"].map((tag) => (
                    <Chip key={tag} label={tag} glass />
                  ))}
                </div>

                <div style={{ maxWidth: 820 }}>
                  <div
                    style={{
                      fontFamily: '"Cinzel", "Noto Sans Thai", serif',
                      fontSize: "clamp(34px, 4vw, 62px)",
                      lineHeight: 0.94,
                      fontWeight: 900,
                      color: "#ffffff",
                      marginBottom: 12,
                      textShadow: "0 10px 24px rgba(0,0,0,0.24)",
                    }}
                  >
                    NEXORA SOCIAL
                    <br />
                    REALM
                  </div>

                  <div style={{ color: "rgba(255,255,255,0.92)", fontSize: 16, lineHeight: 1.8, maxWidth: 650 }}>
                    ฟีดจริงของผู้เล่นในระบบที่ออกแบบให้สวยและใช้ง่ายในธีมหน้าแรก พร้อมโครงสำหรับรูป คอมเมนต์ และ interaction ต่อได้ทันที
                  </div>
                </div>

                <div
                  className="nex-hero-bottom"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto",
                    gap: 16,
                    alignItems: "end",
                  }}
                >
                  <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                    <ActionButton label={userId ? "เริ่มโพสต์ทันที" : "เข้าสู่ระบบก่อนโพสต์"} variant="orange" />
                    <ActionButton label="เข้าสู่ Guild Room" variant="glass" />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(88px, 1fr))", gap: 10 }}>
                    <StatPill label="โพสต์วันนี้" value="12.8K" />
                    <StatPill label="เทรดเปิดอยู่" value="3.1K" />
                    <StatPill label="ผู้เล่นออนไลน์" value="28.4K" />
                    <StatPill label="Guild Active" value="944" />
                  </div>
                </div>
              </div>
            </section>

            <section className="nex-soft" style={{ padding: 18 }}>
              <SectionHeader title="Realm Stories" subtitle="ไฮไลต์เร็วในโลกโซเชี่ยลของ NEXORA" />
              <div style={{ display: "grid", gridAutoFlow: "column", gridAutoColumns: "190px", gap: 14, overflowX: "auto", paddingBottom: 6 }}>
                {STORIES.map((story) => (
                  <StoryCard key={story.title} {...story} />
                ))}
              </div>
            </section>

            <section className="nex-feed-grid">
              <div style={{ minWidth: 0, display: "grid", gap: 18 }}>
                <section className="nex-glass" style={{ padding: 18 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 12,
                      marginBottom: 14,
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <div style={{ fontFamily: '"Cinzel", "Noto Sans Thai", serif', color: "#f0d486", fontWeight: 800, fontSize: 22 }}>
                        Create Post
                      </div>
                      <div style={{ color: "#9f8a62", fontSize: 13, marginTop: 4 }}>
                        กล่องโพสต์หลักของระบบ อยู่เด่น อ่านง่าย และพร้อมต่อรูป/อีโมจิ/คอมเมนต์จริง
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <MiniPill label="Image Ready" />
                      <MiniPill label="Comment Ready" />
                      <MiniPill label="Social UI" />
                    </div>
                  </div>

                  {loadingUser ? (
                    <div style={{ color: "#f4dfac", fontWeight: 700 }}>กำลังโหลด user...</div>
                  ) : (
                    <CreatePost userId={userId} user={user} onCreated={() => setRefreshKey((v) => v + 1)} />
                  )}
                </section>

                <section className="nex-glass" style={{ padding: 18 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 16,
                      flexWrap: "wrap",
                      marginBottom: 14,
                    }}
                  >
                    <div>
                      <div style={{ fontFamily: '"Cinzel", "Noto Sans Thai", serif', color: "#f0d486", fontWeight: 800, fontSize: 22 }}>
                        Social Feed
                      </div>
                      <div style={{ color: "#9f8a62", fontSize: 13, marginTop: 4 }}>
                        ฟีดโพสต์จริงของระบบ แสดงจาก Feed component เดิมของคุณโดยตรง
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <TabPill active>For You</TabPill>
                      <TabPill>Following</TabPill>
                      <TabPill>Guilds</TabPill>
                    </div>
                  </div>

                  <Feed currentUserId={userId} refreshKey={refreshKey} user={user} />
                </section>
              </div>

              <div style={{ minWidth: 0, display: "grid", gap: 16 }}>
                <PanelCard title="ห้องแชทผู้เล่น" subtitle="เข้าได้ทันทีจากหน้านี้">
                  <div style={{ display: "grid", gap: 12 }}>
                    {ROOMS.map((room) => (
                      <RoomCard key={room.title} {...room} />
                    ))}
                  </div>
                </PanelCard>

                <PanelCard title="Trending" subtitle="หัวข้อที่กำลังแรงตอนนี้">
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    {TRENDING.map((item) => (
                      <Chip key={item} label={item} />
                    ))}
                  </div>
                </PanelCard>

                <PanelCard title="Suggested players" subtitle="น่าติดตามสำหรับสายสะสมและสายแข่ง">
                  <div style={{ display: "grid", gap: 12 }}>
                    {SUGGESTED.map((player) => (
                      <SuggestedRow key={player.name} {...player} />
                    ))}
                  </div>
                </PanelCard>
              </div>
            </section>
          </main>

          <aside className="nex-right" style={{ display: "grid", alignContent: "start", gap: 16, minWidth: 0 }}>
            <div className="nex-glass" style={{ padding: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <AvatarCircle text={user?.email?.[0]?.toUpperCase?.() || "N"} small />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 800, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {user ? user.email || "Logged in" : "Guest"}
                  </div>
                  <div style={{ color: "#9f8a62", fontSize: 12 }}>{userId ? "เข้าสู่ระบบแล้ว" : "เข้าสู่ระบบเพื่อใช้งานเต็มระบบ"}</div>
                </div>
              </div>
              <ActionButton label={userId ? "พร้อมใช้งาน" : "เข้าสู่ระบบ"} variant="glass" full />
            </div>

            <PanelCard title="Friends online" subtitle="ผู้เล่นที่พร้อมคุยหรือเข้าห้องได้เลย">
              <div style={{ display: "grid", gap: 14 }}>
                {FRIENDS_ONLINE.map((friend) => (
                  <FriendRow key={friend.name} {...friend} />
                ))}
              </div>
            </PanelCard>
          </aside>
        </div>
      </div>
    </>
  );
}

function GlowOrb({ top, left, right, size, color, blur }: { top: number; left?: number; right?: number; size: number; color: string; blur: number }) {
  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        right,
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color}, transparent 70%)`,
        filter: `blur(${blur}px)`,
        pointerEvents: "none",
      }}
    />
  );
}

function LogoBox() {
  return (
    <div
      style={{
        width: 42,
        height: 42,
        borderRadius: 14,
        background: "linear-gradient(135deg, rgba(255,96,82,0.96), rgba(255,154,82,0.96))",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontWeight: 900,
        boxShadow: "0 12px 24px rgba(255,120,82,0.16)",
      }}
    >
      N
    </div>
  );
}

function SidebarItem({ label, icon, active, badge }: { label: string; icon: string; active?: boolean; badge?: string }) {
  return (
    <div
      style={{
        minHeight: 52,
        borderRadius: 16,
        padding: "0 14px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
        background: active ? "linear-gradient(90deg, rgba(255,92,92,0.16), rgba(255,122,82,0.08))" : "transparent",
        border: active ? "1px solid rgba(255,120,82,0.10)" : "1px solid transparent",
        color: active ? "#ff8c83" : "#efe0c2",
        fontWeight: 700,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ width: 20, textAlign: "center", fontSize: 16 }}>{icon}</span>
        <span className="nex-menu-label">{label}</span>
      </div>
      {badge ? (
        <span
          style={{
            minWidth: 22,
            height: 22,
            padding: "0 7px",
            borderRadius: 999,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #ff7b75, #ff9c66)",
            color: "#fff",
            fontSize: 12,
            fontWeight: 900,
          }}
        >
          {badge}
        </span>
      ) : null}
    </div>
  );
}

function RoundButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      style={{
        width: 52,
        height: 52,
        borderRadius: 18,
        border: "1px solid rgba(255,255,255,0.05)",
        background: "rgba(255,255,255,0.04)",
        color: "#f7ddb3",
        fontSize: 20,
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontFamily: '"Cinzel", "Noto Sans Thai", serif', color: "#f0d486", fontWeight: 800, fontSize: 20 }}>{title}</div>
      <div style={{ color: "#9f8a62", fontSize: 13, marginTop: 4 }}>{subtitle}</div>
    </div>
  );
}

function StoryCard({ title, subtitle, accent }: { title: string; subtitle: string; accent: string }) {
  const glowMap: Record<string, string> = {
    orange: "rgba(255,140,80,0.34)",
    purple: "rgba(124,77,255,0.30)",
    gold: "rgba(230,185,87,0.30)",
    red: "rgba(255,88,88,0.26)",
    blue: "rgba(84,154,255,0.28)",
  };

  return (
    <div
      className="nex-glass"
      style={{
        position: "relative",
        minHeight: 240,
        overflow: "hidden",
        padding: 14,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at top left, ${glowMap[accent] || glowMap.gold}, transparent 42%)`,
          pointerEvents: "none",
        }}
      />
      <div style={{ position: "relative", zIndex: 1 }}>
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 18,
            background: "rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff4d0",
            fontSize: 22,
            fontWeight: 800,
            marginBottom: 14,
          }}
        >
          ✦
        </div>
        <div style={{ fontWeight: 800, fontSize: 20, color: "#fff" }}>{title}</div>
        <div style={{ color: "#d3bd90", fontSize: 14, marginTop: 4 }}>{subtitle}</div>
      </div>
      <div style={{ position: "relative", zIndex: 1 }}>
        <ActionButton label="Open" variant="glass" full />
      </div>
    </div>
  );
}

function AvatarCircle({ text, small }: { text: string; small?: boolean }) {
  const size = small ? 44 : 56;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #ff9c5f, #7c4dff)",
        color: "#fff",
        fontWeight: 900,
        boxShadow: "0 12px 24px rgba(124,77,255,0.18)",
        flexShrink: 0,
      }}
    >
      {text}
    </div>
  );
}

function PanelCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <section className="nex-soft" style={{ padding: 18 }}>
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontFamily: '"Cinzel", "Noto Sans Thai", serif', color: "#fff3d1", fontSize: 21, fontWeight: 800 }}>{title}</div>
        <div style={{ color: "#9f8a62", fontSize: 13, marginTop: 4 }}>{subtitle}</div>
      </div>
      {children}
    </section>
  );
}

function RoomCard({ title, desc, count }: { title: string; desc: string; count: string }) {
  return (
    <div
      style={{
        borderRadius: 18,
        padding: 14,
        background: "linear-gradient(135deg, rgba(255,229,142,0.12), rgba(200,141,39,0.08))",
        border: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
        <div>
          <div style={{ fontWeight: 800, color: "#fff", fontSize: 18 }}>{title}</div>
          <div style={{ color: "#b89e71", fontSize: 13, marginTop: 4 }}>{desc}</div>
        </div>
        <ActionButton label="เข้าห้อง" variant="gold" />
      </div>
      <div style={{ color: "#f1d997", fontSize: 12, marginTop: 12, fontWeight: 700 }}>{count}</div>
    </div>
  );
}

function FriendRow({ name, place, color }: { name: string; place: string; color: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${color}, #ffffff22)`,
            display: "grid",
            placeItems: "center",
            color: "#fff",
            fontWeight: 900,
            position: "relative",
            flexShrink: 0,
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
              borderRadius: "50%",
              background: "#29ff8a",
              border: "2px solid #0f1220",
            }}
          />
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 800, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</div>
          <div style={{ color: "#c3ac80", fontSize: 12, marginTop: 4 }}>{place}</div>
        </div>
      </div>
      <button
        style={{
          minHeight: 34,
          padding: "0 12px",
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.05)",
          background: "rgba(255,255,255,0.03)",
          color: "#f0dcaa",
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        Open
      </button>
    </div>
  );
}

function SuggestedRow({ name, role }: { name: string; role: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
        <AvatarCircle text={name.charAt(0)} small />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 800, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</div>
          <div style={{ color: "#b89e71", fontSize: 12, marginTop: 4 }}>{role}</div>
        </div>
      </div>
      <ActionButton label="Follow" variant="glass" />
    </div>
  );
}

function Chip({ label, glass }: { label: string; glass?: boolean }) {
  return (
    <span
      style={{
        minHeight: 32,
        padding: "0 14px",
        borderRadius: 999,
        display: "inline-flex",
        alignItems: "center",
        background: glass ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.05)",
        color: "#f4e5c8",
        fontWeight: 700,
        fontSize: 13,
        border: "1px solid rgba(255,255,255,0.05)",
        backdropFilter: glass ? "blur(8px)" : undefined,
      }}
    >
      {label}
    </span>
  );
}

function MiniPill({ label }: { label: string }) {
  return (
    <span
      style={{
        minHeight: 30,
        padding: "0 12px",
        borderRadius: 999,
        display: "inline-flex",
        alignItems: "center",
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.05)",
        color: "#f2dfb8",
        fontWeight: 700,
        fontSize: 12,
      }}
    >
      {label}
    </span>
  );
}

function TabPill({ children, active }: { children: React.ReactNode; active?: boolean }) {
  return (
    <span
      style={{
        minHeight: 38,
        padding: "0 14px",
        borderRadius: 14,
        display: "inline-flex",
        alignItems: "center",
        background: active
          ? "linear-gradient(135deg, rgba(255,240,180,0.14), rgba(200,141,39,0.12), rgba(124,77,255,0.08))"
          : "rgba(255,255,255,0.03)",
        border: active ? "1px solid rgba(255,196,92,0.18)" : "1px solid rgba(255,255,255,0.05)",
        color: active ? "#fff0b4" : "#e9dcc7",
        fontWeight: 800,
        fontSize: 13,
      }}
    >
      {children}
    </span>
  );
}

function ActionButton({ label, variant, full }: { label: string; variant: "gold" | "orange" | "glass"; full?: boolean }) {
  const styleMap = {
    gold: {
      background: "linear-gradient(135deg, #fff0b4 0%, #e6bb57 35%, #c88d27 68%, #7c4dff 135%)",
      color: "#17130a",
      border: "0",
    },
    orange: {
      background: "linear-gradient(135deg, rgba(255,78,104,0.96), rgba(255,142,58,0.96))",
      color: "#fff",
      border: "0",
    },
    glass: {
      background: "rgba(255,255,255,0.08)",
      color: "#fff3d0",
      border: "1px solid rgba(255,255,255,0.10)",
    },
  } as const;

  return (
    <button
      style={{
        width: full ? "100%" : undefined,
        minHeight: 44,
        padding: "0 18px",
        borderRadius: 16,
        cursor: "pointer",
        fontWeight: 900,
        ...styleMap[variant],
      }}
    >
      {label}
    </button>
  );
}

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        borderRadius: 16,
        padding: "10px 12px",
        background: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div style={{ color: "#f9e5b0", fontWeight: 900, fontSize: 18 }}>{value}</div>
      <div style={{ color: "rgba(255,255,255,0.68)", fontSize: 11, marginTop: 4 }}>{label}</div>
    </div>
  );
}
