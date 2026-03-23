"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import ChatBox from "../../components/ChatBox";

export default function ChatRoomPage() {
  const params = useParams();
  const slug = String(params.slug || "global");

  return (
    <div style={pageStyle}>
      <div style={bgGlowLeft} />
      <div style={bgGlowRight} />
      <div style={gridOverlay} />

      <div style={shell}>
        {/* LEFT SIDEBAR */}
        <aside style={sidebar}>
          <div style={logoRow}>
            <div style={logoBadge}>N</div>
            <div>
              <div style={logoTop}>NEXORA</div>
              <div style={logoBottom}>DM ROOM</div>
            </div>
          </div>

          <div style={profileCard}>
            <div style={avatarBox}>{slug.charAt(0).toUpperCase()}</div>
            <div style={profileName}>Room {slug}</div>
            <div style={profileSub}>Secure channel active</div>

            <div style={profileStats}>
              <div style={statMini}>
                <div style={statMiniValue}>24/7</div>
                <div style={statMiniLabel}>Live</div>
              </div>
              <div style={statMini}>
                <div style={statMiniValue}>AI</div>
                <div style={statMiniLabel}>Assist</div>
              </div>
            </div>
          </div>

          <div style={navWrap}>
            <SidebarButton label="Live matches" active />
            <SidebarButton label="Live chat" />
            <SidebarButton label="DM rooms" />
            <SidebarButton label="AI channel" />
            <SidebarButton label="Analytics" />
            <SidebarButton label="Settings" />
          </div>

          <Link href="/" style={backHomeBtn}>
            ← กลับหน้าแรก
          </Link>
        </aside>

        {/* MAIN */}
        <main style={mainArea}>
          {/* TOP BAR */}
          <div style={topbar}>
            <div style={topbarLeft}>
              <div style={tokenInfo}>
                <span style={tokenDot} />
                <span style={tokenLabel}>Room status</span>
                <span style={tokenValue}>ONLINE</span>
              </div>
            </div>

            <div style={topbarRight}>
              <button style={iconBtn}>🔔</button>

              <div style={searchBox}>
                <span style={searchIcon}>⌕</span>
                <span style={searchText}>Search</span>
              </div>

              <div style={balanceBox}>
                <div style={balanceLabel}>room</div>
                <div style={balanceValue}>{slug}</div>
              </div>

              <button style={walletBtn}>✉</button>
            </div>
          </div>

          {/* CONTENT */}
          <div style={contentWrap}>
            {/* HERO / IFRAME */}
            <section style={heroCard}>
              <div style={heroInner}>
                <div style={heroLeft}>
                  <div style={badge}>NEXORA AI ROOM ASSISTANT</div>
                  <h1 style={heroTitle}>Premium DM Command Center</h1>
                  <p style={heroDesc}>
                    หน้าแชทโทนน้ำเงินเข้มแบบ futuristic gaming UI พร้อม
                    AI panel ด้านบนและกล่องข้อความจริงด้านล่างในโครงเดียวกัน
                    ให้ฟีลเหมือน dashboard ระดับ premium
                  </p>

                  <div style={heroStatsRow}>
                    <div style={heroStat}>
                      <div style={heroStatValue}>70svh</div>
                      <div style={heroStatLabel}>AI Panel</div>
                    </div>
                    <div style={heroStat}>
                      <div style={heroStatValue}>LIVE</div>
                      <div style={heroStatLabel}>Realtime Chat</div>
                    </div>
                    <div style={heroStat}>
                      <div style={heroStatValue}>DM</div>
                      <div style={heroStatLabel}>Secure Room</div>
                    </div>
                  </div>
                </div>

                <div style={heroRight}>
                  <div style={iframeFrame}>
                    <iframe
                      src="https://script.google.com/macros/s/AKfycbzkYYwBvBryWEWCIMQpYanfeiRbta6geYhq2SlluadVGGiw3C2XsEPW-pT59PqcIF6C/exec"
                      style={iframeStyle}
                      loading="lazy"
                      allow="clipboard-read; clipboard-write"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* ROOM HEADER */}
            <section style={roomBar}>
              <div style={roomBarLeft}>
                <div style={roomTitle}>ห้อง: {slug}</div>
                <div style={roomSub}>
                  Direct message room with integrated AI assistant
                </div>
              </div>

              <div style={roomActions}>
                <button style={smallActionBtn}>❤</button>
                <button style={smallActionBtn}>↗</button>
                <button style={smallActionBtn}>⋮</button>
              </div>
            </section>

            {/* CHAT PANEL */}
            <section style={chatShell}>
              <div style={chatShellHeader}>
                <div>
                  <div style={chatOverline}>LIVE CHAT PANEL</div>
                  <div style={chatHeading}>Real conversation</div>
                </div>

                <div style={membersCard}>
                  <span style={greenDot} />
                  <span style={membersText}>Room connected</span>
                </div>
              </div>

              <div style={chatPanel}>
                <ChatBox roomSlug={slug} />
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

function SidebarButton({
  label,
  active = false,
}: {
  label: string;
  active?: boolean;
}) {
  return (
    <button
      style={{
        ...sidebarBtn,
        ...(active ? sidebarBtnActive : {}),
      }}
    >
      <span style={sidebarBtnIcon}>{active ? "◉" : "○"}</span>
      <span>{label}</span>
    </button>
  );
}

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  position: "relative",
  overflow: "hidden",
  background:
    "linear-gradient(180deg, #060b18 0%, #07101e 35%, #050916 100%)",
  color: "#ffffff",
  fontFamily:
    "Inter, Tahoma, 'Noto Sans Thai', system-ui, -apple-system, sans-serif",
};

const bgGlowLeft: React.CSSProperties = {
  position: "fixed",
  left: -120,
  top: 80,
  width: 420,
  height: 420,
  borderRadius: "999px",
  background: "radial-gradient(circle, rgba(0,136,210,0.18), transparent 68%)",
  filter: "blur(24px)",
  pointerEvents: "none",
};

const bgGlowRight: React.CSSProperties = {
  position: "fixed",
  right: -140,
  top: -40,
  width: 480,
  height: 480,
  borderRadius: "999px",
  background: "radial-gradient(circle, rgba(36,88,255,0.14), transparent 68%)",
  filter: "blur(30px)",
  pointerEvents: "none",
};

const gridOverlay: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  pointerEvents: "none",
  opacity: 0.05,
  backgroundImage:
    "linear-gradient(rgba(255,255,255,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.18) 1px, transparent 1px)",
  backgroundSize: "36px 36px",
};

const shell: React.CSSProperties = {
  position: "relative",
  zIndex: 2,
  maxWidth: 1800,
  margin: "0 auto",
  minHeight: "100vh",
  display: "flex",
};

const sidebar: React.CSSProperties = {
  width: 280,
  minWidth: 280,
  borderRight: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(6,10,22,0.78)",
  backdropFilter: "blur(16px)",
  padding: "28px 18px",
  display: "flex",
  flexDirection: "column",
  gap: 22,
};

const logoRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  padding: "4px 8px 12px",
};

const logoBadge: React.CSSProperties = {
  width: 46,
  height: 46,
  borderRadius: 16,
  display: "grid",
  placeItems: "center",
  fontWeight: 900,
  fontSize: 20,
  background: "linear-gradient(135deg,#0888d2,#39b7ff)",
  boxShadow: "0 0 30px rgba(8,136,210,0.28)",
};

const logoTop: React.CSSProperties = {
  fontSize: 11,
  letterSpacing: "0.28em",
  color: "rgba(255,255,255,0.4)",
  fontWeight: 700,
};

const logoBottom: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 900,
  color: "#ffffff",
  letterSpacing: "-0.02em",
};

const profileCard: React.CSSProperties = {
  borderRadius: 28,
  padding: 18,
  border: "1px solid rgba(255,255,255,0.08)",
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.025))",
  boxShadow: "0 20px 50px rgba(0,0,0,0.22)",
};

const avatarBox: React.CSSProperties = {
  width: 92,
  height: 92,
  borderRadius: 24,
  display: "grid",
  placeItems: "center",
  fontSize: 34,
  fontWeight: 900,
  color: "#fff",
  margin: "0 auto 14px",
  background: "linear-gradient(135deg,#0888d2,#4dbfff)",
  border: "2px solid rgba(255,255,255,0.18)",
  boxShadow: "0 16px 40px rgba(8,136,210,0.25)",
};

const profileName: React.CSSProperties = {
  textAlign: "center",
  fontWeight: 800,
  fontSize: 24,
  lineHeight: 1.1,
};

const profileSub: React.CSSProperties = {
  textAlign: "center",
  marginTop: 6,
  fontSize: 13,
  color: "rgba(255,255,255,0.48)",
};

const profileStats: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 10,
  marginTop: 16,
};

const statMini: React.CSSProperties = {
  borderRadius: 18,
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.07)",
  padding: "12px 10px",
  textAlign: "center",
};

const statMiniValue: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 900,
  color: "#61c9ff",
};

const statMiniLabel: React.CSSProperties = {
  fontSize: 11,
  color: "rgba(255,255,255,0.42)",
  marginTop: 4,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
};

const navWrap: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 8,
};

const sidebarBtn: React.CSSProperties = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  gap: 12,
  borderRadius: 18,
  padding: "14px 14px",
  color: "rgba(255,255,255,0.52)",
  background: "transparent",
  border: "1px solid transparent",
  cursor: "pointer",
  fontSize: 16,
  fontWeight: 600,
  textAlign: "left",
};

const sidebarBtnActive: React.CSSProperties = {
  color: "#ffffff",
  background:
    "linear-gradient(90deg, rgba(8,136,210,0.22), rgba(8,136,210,0.08))",
  border: "1px solid rgba(97,201,255,0.12)",
  boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.03)",
};

const sidebarBtnIcon: React.CSSProperties = {
  fontSize: 18,
};

const backHomeBtn: React.CSSProperties = {
  marginTop: "auto",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 52,
  borderRadius: 18,
  textDecoration: "none",
  color: "#fff",
  fontWeight: 700,
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
};

const mainArea: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
  display: "flex",
  flexDirection: "column",
};

const topbar: React.CSSProperties = {
  borderBottom: "1px solid rgba(255,255,255,0.08)",
  padding: "22px 28px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 16,
  flexWrap: "wrap",
  background: "rgba(5,9,22,0.36)",
  backdropFilter: "blur(14px)",
};

const topbarLeft: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 18,
};

const tokenInfo: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  borderRadius: 18,
  padding: "12px 16px",
  background: "rgba(255,255,255,0.035)",
  border: "1px solid rgba(255,255,255,0.07)",
};

const tokenDot: React.CSSProperties = {
  width: 10,
  height: 10,
  borderRadius: "999px",
  background: "#34d399",
  boxShadow: "0 0 14px rgba(52,211,153,0.85)",
};

const tokenLabel: React.CSSProperties = {
  fontSize: 14,
  color: "rgba(255,255,255,0.5)",
  fontWeight: 600,
};

const tokenValue: React.CSSProperties = {
  fontSize: 16,
  color: "#fff",
  fontWeight: 800,
};

const topbarRight: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  flexWrap: "wrap",
};

const iconBtn: React.CSSProperties = {
  width: 52,
  height: 52,
  borderRadius: 18,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.04)",
  color: "#fff",
  fontSize: 18,
  cursor: "pointer",
};

const searchBox: React.CSSProperties = {
  minWidth: 220,
  height: 52,
  borderRadius: 18,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.04)",
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "0 16px",
};

const searchIcon: React.CSSProperties = {
  color: "rgba(255,255,255,0.38)",
  fontSize: 18,
};

const searchText: React.CSSProperties = {
  color: "rgba(255,255,255,0.38)",
  fontWeight: 600,
};

const balanceBox: React.CSSProperties = {
  minHeight: 52,
  borderRadius: 18,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.04)",
  padding: "8px 14px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
};

const balanceLabel: React.CSSProperties = {
  fontSize: 11,
  textTransform: "uppercase",
  letterSpacing: "0.14em",
  color: "rgba(255,255,255,0.34)",
};

const balanceValue: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 900,
  color: "#fff",
};

const walletBtn: React.CSSProperties = {
  width: 52,
  height: 52,
  borderRadius: 18,
  border: "none",
  background: "linear-gradient(135deg,#0888d2,#47b9ff)",
  color: "#fff",
  fontSize: 20,
  cursor: "pointer",
  boxShadow: "0 0 30px rgba(8,136,210,0.24)",
};

const contentWrap: React.CSSProperties = {
  padding: 28,
  display: "flex",
  flexDirection: "column",
  gap: 22,
};

const heroCard: React.CSSProperties = {
  borderRadius: 34,
  border: "1px solid rgba(255,255,255,0.08)",
  background:
    "linear-gradient(180deg, rgba(11,17,38,0.96), rgba(7,11,23,0.98))",
  boxShadow: "0 28px 70px rgba(0,0,0,0.34)",
  overflow: "hidden",
};

const heroInner: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "0.9fr 1.1fr",
  gap: 24,
  padding: 24,
  alignItems: "stretch",
};

const heroLeft: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  padding: "8px 4px",
};

const badge: React.CSSProperties = {
  display: "inline-flex",
  alignSelf: "flex-start",
  padding: "10px 14px",
  borderRadius: 999,
  background: "rgba(8,136,210,0.12)",
  border: "1px solid rgba(97,201,255,0.18)",
  color: "#74d4ff",
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  marginBottom: 16,
};

const heroTitle: React.CSSProperties = {
  fontSize: 54,
  lineHeight: 0.96,
  fontWeight: 900,
  letterSpacing: "-0.04em",
  margin: 0,
};

const heroDesc: React.CSSProperties = {
  marginTop: 18,
  fontSize: 16,
  lineHeight: 1.8,
  color: "rgba(255,255,255,0.58)",
  maxWidth: 620,
};

const heroStatsRow: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: 14,
  marginTop: 24,
};

const heroStat: React.CSSProperties = {
  borderRadius: 22,
  padding: "16px 16px",
  background: "rgba(255,255,255,0.035)",
  border: "1px solid rgba(255,255,255,0.07)",
};

const heroStatValue: React.CSSProperties = {
  fontSize: 24,
  fontWeight: 900,
  color: "#ffffff",
};

const heroStatLabel: React.CSSProperties = {
  fontSize: 12,
  marginTop: 6,
  color: "rgba(255,255,255,0.42)",
  textTransform: "uppercase",
  letterSpacing: "0.1em",
};

const heroRight: React.CSSProperties = {
  minWidth: 0,
};

const iframeFrame: React.CSSProperties = {
  borderRadius: 28,
  padding: 2,
  background:
    "linear-gradient(135deg, rgba(97,201,255,0.75), rgba(8,136,210,0.22), rgba(255,255,255,0.05))",
  boxShadow: "0 0 18px rgba(8,136,210,0.16)",
  height: "100%",
};

const iframeStyle: React.CSSProperties = {
  width: "100%",
  height: "70svh",
  border: 0,
  display: "block",
  borderRadius: 26,
  background: "#050916",
};

const roomBar: React.CSSProperties = {
  borderRadius: 28,
  border: "1px solid rgba(255,255,255,0.08)",
  background:
    "linear-gradient(180deg, rgba(12,18,38,0.94), rgba(8,12,24,0.96))",
  padding: "18px 22px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 16,
  flexWrap: "wrap",
};

const roomBarLeft: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 4,
};

const roomTitle: React.CSSProperties = {
  fontSize: 28,
  fontWeight: 900,
  letterSpacing: "-0.03em",
  color: "#ffffff",
};

const roomSub: React.CSSProperties = {
  fontSize: 14,
  color: "rgba(255,255,255,0.42)",
};

const roomActions: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
};

const smallActionBtn: React.CSSProperties = {
  width: 44,
  height: 44,
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.04)",
  color: "#fff",
  fontSize: 16,
  cursor: "pointer",
};

const chatShell: React.CSSProperties = {
  borderRadius: 32,
  border: "1px solid rgba(255,255,255,0.08)",
  background:
    "linear-gradient(180deg, rgba(10,15,31,0.98), rgba(7,10,20,0.98))",
  boxShadow: "0 26px 60px rgba(0,0,0,0.3)",
  overflow: "hidden",
};

const chatShellHeader: React.CSSProperties = {
  padding: "22px 24px",
  borderBottom: "1px solid rgba(255,255,255,0.08)",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  flexWrap: "wrap",
};

const chatOverline: React.CSSProperties = {
  fontSize: 11,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.36)",
  fontWeight: 700,
};

const chatHeading: React.CSSProperties = {
  fontSize: 30,
  fontWeight: 900,
  marginTop: 6,
  letterSpacing: "-0.03em",
};

const membersCard: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  borderRadius: 999,
  padding: "10px 14px",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
};

const greenDot: React.CSSProperties = {
  width: 10,
  height: 10,
  borderRadius: "999px",
  background: "#34d399",
  boxShadow: "0 0 12px rgba(52,211,153,0.8)",
};

const membersText: React.CSSProperties = {
  fontWeight: 700,
  color: "rgba(255,255,255,0.82)",
  fontSize: 14,
};

const chatPanel: React.CSSProperties = {
  padding: 18,
};