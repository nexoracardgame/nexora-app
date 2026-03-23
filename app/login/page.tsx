"use client";

import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

// ใส่ YouTube video id ตรงนี้
const YOUTUBE_VIDEO_ID = "UAn0Rh5kLkc"

export default function LoginPage() {
  const [name, setName] = useState("");
  const [loadingGoogle, setLoadingGoogle] = useState(false);

  const youtubeSrc = useMemo(() => {
    const params = new URLSearchParams({
      autoplay: "1",
      mute: "1",
      controls: "0",
      disablekb: "1",
      fs: "0",
      modestbranding: "1",
      rel: "0",
      loop: "1",
      playlist: YOUTUBE_VIDEO_ID,
      playsinline: "1",
      iv_load_policy: "3",
    });

    return `https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?${params.toString()}`;
  }, []);

  const handleLogin = () => {
    if (!name.trim()) {
      alert("กรอกชื่อก่อน");
      return;
    }

    localStorage.setItem("nexora_user", name.trim());
    window.location.href = "/";
  };

  const handleGoogleLogin = async () => {
    try {
      setLoadingGoogle(true);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin + "/auth/callback",
        },
      });

      if (error) {
        alert("Google login error: " + error.message);
        setLoadingGoogle(false);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unknown Google login error";
      alert("Google login error: " + message);
      setLoadingGoogle(false);
    }
  };

  return (
    <main style={styles.page}>
      {/* background video */}
      <div style={styles.videoStage}>
        <div style={styles.videoScale}>
          <iframe
            src={youtubeSrc}
            title="NEXORA Background"
            allow="autoplay; encrypted-media; picture-in-picture"
            style={styles.iframe}
          />
        </div>
      </div>

      {/* overlays */}
      <div style={styles.overlayDark} />
      <div style={styles.overlayBlue} />
      <div style={styles.vignette} />
      <div style={styles.grid} />
      <div style={styles.centerGlow} />

      {/* top helper bar */}
      <div style={styles.topBar}>
        หากต้องการออกจากโหมดเต็มหน้าจอ ให้กด Esc ที่แป้น
      </div>

      {/* big backdrop word */}
      <div style={styles.backdropWord}>NEXORA</div>
      <div style={styles.backdropSub}>www.nexoracardgame.com</div>

      {/* center stage */}
      <div style={styles.centerWrap}>
        <div style={styles.outerFrame}>
          <div style={styles.sideTag}>NEXORA ACCESS PORTAL</div>

          <div style={styles.contentRow}>
            <div style={styles.leftVisual}>
              <div style={styles.leftMini}>ENTER THE WORLD OF</div>
              <div style={styles.leftTitle}>NEXORA</div>
              <div style={styles.leftDesc}>
                เข้าสู่ระบบสมาชิก เพื่อใช้งานระบบ NEXORA, Google Login และ Session ผู้เล่น
              </div>

              <div style={styles.featureRow}>
                <MiniBox title="Portal" desc="Member Access" />
                <MiniBox title="Account" desc="Google OAuth" />
                <MiniBox title="Session" desc="Local Login" />
              </div>
            </div>

            <div style={styles.card}>
              <div style={styles.badge}>MEMBER LOGIN</div>

              <div style={styles.title}>เข้าสู่ระบบ</div>

              <div style={styles.desc}>
                ใช้ชื่อผู้เล่นของคุณ หรือเข้าสู่ระบบด้วย Google เพื่อเปิดประตูเข้าสู่โลก NEXORA
              </div>

              <button
                onClick={handleGoogleLogin}
                disabled={loadingGoogle}
                style={{
                  ...styles.google,
                  opacity: loadingGoogle ? 0.75 : 1,
                  cursor: loadingGoogle ? "not-allowed" : "pointer",
                }}
              >
                <span style={styles.googleDot} />
                {loadingGoogle ? "กำลังเชื่อมต่อ Google..." : "เข้าสู่ระบบด้วย Google"}
              </button>

              <div style={styles.dividerWrap}>
                <div style={styles.dividerLine} />
                <div style={styles.dividerText}>หรือ</div>
                <div style={styles.dividerLine} />
              </div>

              <label style={styles.label}>Player Name</label>

              <input
                placeholder="กรอกชื่อผู้เล่น"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleLogin();
                }}
                style={styles.input}
              />

              <button onClick={handleLogin} style={styles.button}>
                เข้าสู่โลก NEXORA
              </button>

              <div style={styles.foot}>
                Current Access: Google OAuth + Local Member Session
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function MiniBox({ title, desc }: { title: string; desc: string }) {
  return (
    <div style={styles.miniBox}>
      <div style={styles.miniTitle}>{title}</div>
      <div style={styles.miniDesc}>{desc}</div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    position: "relative",
    minHeight: "100vh",
    width: "100%",
    overflow: "hidden",
    background: "#040714",
    color: "#fff",
    fontFamily: "Arial, sans-serif",
  },

  videoStage: {
    position: "absolute",
    inset: 0,
    overflow: "hidden",
    zIndex: 0,
    background: "#03050d",
  },

  videoScale: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "177.77777778vh",
    minWidth: "100%",
    height: "56.25vw",
    minHeight: "100%",
    transform: "translate(-50%, -50%) scale(1.14)",
    pointerEvents: "none",
  },

  iframe: {
    width: "100%",
    height: "100%",
    border: "none",
    pointerEvents: "none",
  },

  overlayDark: {
    position: "absolute",
    inset: 0,
    zIndex: 1,
    background:
      "linear-gradient(180deg, rgba(2,4,12,0.68) 0%, rgba(2,4,12,0.84) 100%)",
  },

  overlayBlue: {
    position: "absolute",
    inset: 0,
    zIndex: 2,
    background:
      "radial-gradient(circle at 50% 45%, rgba(235, 74, 122, 0.16), transparent 18%), radial-gradient(circle at 50% 45%, rgba(87, 102, 255, 0.12), transparent 34%)",
  },

  vignette: {
    position: "absolute",
    inset: 0,
    zIndex: 3,
    boxShadow: "inset 0 0 180px rgba(0,0,0,0.92)",
    pointerEvents: "none",
  },

  grid: {
    position: "absolute",
    inset: 0,
    zIndex: 3,
    backgroundImage:
      "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
    backgroundSize: "42px 42px",
    pointerEvents: "none",
  },

  centerGlow: {
    position: "absolute",
    top: "52%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "920px",
    height: "920px",
    borderRadius: "50%",
    zIndex: 4,
    background:
      "radial-gradient(circle, rgba(236,79,124,0.18) 0%, rgba(88,107,255,0.12) 28%, transparent 62%)",
    filter: "blur(100px)",
    pointerEvents: "none",
  },

  topBar: {
    position: "absolute",
    top: "28px",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 8,
    padding: "10px 18px",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.14)",
    color: "rgba(255,255,255,0.92)",
    fontSize: "12px",
    backdropFilter: "blur(10px)",
  },

  backdropWord: {
    position: "absolute",
    left: "50%",
    top: "53%",
    transform: "translate(-50%, -50%)",
    zIndex: 4,
    fontSize: "clamp(120px, 18vw, 320px)",
    fontWeight: 900,
    letterSpacing: "-8px",
    color: "rgba(255,255,255,0.07)",
    textShadow: "0 0 30px rgba(255,255,255,0.03)",
    whiteSpace: "nowrap",
    pointerEvents: "none",
    userSelect: "none",
  },

  backdropSub: {
    position: "absolute",
    left: "50%",
    bottom: "14%",
    transform: "translateX(-50%)",
    zIndex: 4,
    fontSize: "clamp(22px, 2.7vw, 46px)",
    fontWeight: 700,
    color: "rgba(255,255,255,0.08)",
    pointerEvents: "none",
    userSelect: "none",
  },

  centerWrap: {
    position: "relative",
    zIndex: 7,
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "32px",
  },

  outerFrame: {
    width: "100%",
    maxWidth: "1180px",
    minHeight: "620px",
    borderRadius: "34px",
    border: "1px solid rgba(255,255,255,0.10)",
    background:
      "linear-gradient(180deg, rgba(8, 11, 28, 0.42) 0%, rgba(5, 8, 20, 0.50) 100%)",
    boxShadow: "0 30px 100px rgba(0,0,0,0.35)",
    backdropFilter: "blur(12px)",
    position: "relative",
    padding: "42px",
  },

  sideTag: {
    position: "absolute",
    top: "24px",
    left: "24px",
    padding: "10px 16px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.10)",
    color: "rgba(255,255,255,0.84)",
    fontSize: "12px",
    fontWeight: 800,
    letterSpacing: "1px",
  },

  contentRow: {
    height: "100%",
    minHeight: "536px",
    display: "grid",
    gridTemplateColumns: "1.05fr 0.95fr",
    alignItems: "center",
    gap: "28px",
  },

  leftVisual: {
    padding: "30px 10px 20px 8px",
  },

  leftMini: {
    color: "rgba(255,255,255,0.68)",
    fontSize: "14px",
    fontWeight: 700,
    letterSpacing: "2px",
    marginBottom: "12px",
  },

  leftTitle: {
    fontSize: "clamp(56px, 7vw, 112px)",
    lineHeight: 0.92,
    fontWeight: 900,
    color: "#ffffff",
    letterSpacing: "-3px",
    textShadow: "0 8px 30px rgba(0,0,0,0.35)",
  },

  leftDesc: {
    marginTop: "18px",
    maxWidth: "500px",
    fontSize: "17px",
    lineHeight: 1.9,
    color: "rgba(255,255,255,0.72)",
  },

  featureRow: {
    marginTop: "28px",
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "12px",
    maxWidth: "560px",
  },

  miniBox: {
    padding: "16px",
    borderRadius: "18px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    backdropFilter: "blur(8px)",
  },

  miniTitle: {
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: 800,
    marginBottom: "6px",
  },

  miniDesc: {
    color: "rgba(255,255,255,0.62)",
    fontSize: "13px",
  },

  card: {
    width: "100%",
    maxWidth: "470px",
    justifySelf: "center",
    padding: "34px",
    borderRadius: "28px",
    background:
      "linear-gradient(180deg, rgba(18, 20, 36, 0.80) 0%, rgba(10, 11, 23, 0.88) 100%)",
    border: "1px solid rgba(255,255,255,0.12)",
    boxShadow: "0 24px 80px rgba(0,0,0,0.42), 0 0 48px rgba(235,74,122,0.10)",
    backdropFilter: "blur(18px)",
  },

  badge: {
    display: "inline-flex",
    alignItems: "center",
    minHeight: "34px",
    padding: "0 14px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.10)",
    color: "rgba(255,255,255,0.76)",
    fontSize: "12px",
    fontWeight: 800,
    letterSpacing: "1px",
  },

  title: {
    marginTop: "18px",
    fontSize: "54px",
    lineHeight: 1,
    fontWeight: 900,
    color: "#ffffff",
  },

  desc: {
    marginTop: "14px",
    fontSize: "17px",
    lineHeight: 1.8,
    color: "rgba(255,255,255,0.72)",
  },

  google: {
    marginTop: "24px",
    width: "100%",
    height: "60px",
    borderRadius: "18px",
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.06)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    fontSize: "17px",
    fontWeight: 800,
  },

  googleDot: {
    width: "14px",
    height: "14px",
    borderRadius: "50%",
    background: "#ff4f77",
    boxShadow: "0 0 18px rgba(255,79,119,0.9)",
    flexShrink: 0,
  },

  dividerWrap: {
    marginTop: "18px",
    marginBottom: "18px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  dividerLine: {
    flex: 1,
    height: "1px",
    background: "rgba(255,255,255,0.12)",
  },

  dividerText: {
    color: "rgba(255,255,255,0.42)",
    fontSize: "13px",
    fontWeight: 700,
  },

  label: {
    display: "block",
    marginBottom: "10px",
    color: "rgba(255,255,255,0.82)",
    fontSize: "15px",
    fontWeight: 700,
  },

  input: {
    width: "100%",
    height: "60px",
    padding: "0 18px",
    borderRadius: "18px",
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.06)",
    color: "#fff",
    fontSize: "16px",
    outline: "none",
  },

  button: {
    marginTop: "18px",
    width: "100%",
    height: "62px",
    borderRadius: "18px",
    border: "none",
    background: "linear-gradient(180deg, #f36f92 0%, #d54f76 100%)",
    color: "#fff",
    fontSize: "18px",
    fontWeight: 900,
    boxShadow: "0 16px 36px rgba(243,111,146,0.24)",
    cursor: "pointer",
  },

  foot: {
    marginTop: "16px",
    textAlign: "center",
    color: "rgba(255,255,255,0.46)",
    fontSize: "12px",
  },
};