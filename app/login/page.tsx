"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function LoginPage() {
  const [name, setName] = useState("");
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const checkCurrentUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (data.user) {
        window.location.href = "/";
        return;
      }

      setCheckingSession(false);
    };

    checkCurrentUser();
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
          redirectTo: window.location.origin,
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

  if (checkingSession) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(circle at top, rgba(255,200,80,0.16), transparent 18%), linear-gradient(180deg, #070b14 0%, #091224 45%, #050814 100%)",
          color: "white",
          fontFamily: "Arial, sans-serif",
        }}
      >
        กำลังตรวจสอบ session...
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(255,200,80,0.16), transparent 18%), linear-gradient(180deg, #070b14 0%, #091224 45%, #050814 100%)",
        color: "white",
        fontFamily: "Arial, sans-serif",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "38px 38px",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          width: "300px",
          height: "300px",
          borderRadius: "999px",
          background: "rgba(255, 213, 74, 0.18)",
          filter: "blur(80px)",
          top: "-60px",
          left: "-40px",
        }}
      />

      <div
        style={{
          position: "absolute",
          width: "240px",
          height: "240px",
          borderRadius: "999px",
          background: "rgba(79, 70, 229, 0.18)",
          filter: "blur(80px)",
          bottom: "-40px",
          right: "-20px",
        }}
      />

      <div
        style={{
          width: "100%",
          maxWidth: "1100px",
          display: "grid",
          gridTemplateColumns: "1.15fr 0.85fr",
          gap: "24px",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          style={{
            borderRadius: "28px",
            padding: "34px",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 18px 60px rgba(0,0,0,0.28)",
          }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "8px 14px",
              borderRadius: "999px",
              background: "rgba(255,214,74,0.08)",
              border: "1px solid rgba(255,214,74,0.22)",
              color: "#ffe08a",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "1px",
              marginBottom: "18px",
            }}
          >
            NEXORA ACCESS PORTAL
          </div>

          <div
            style={{
              fontSize: "clamp(34px, 5vw, 70px)",
              fontWeight: 900,
              lineHeight: 0.95,
              color: "#ffd54a",
              textShadow: "0 0 24px rgba(255,213,74,0.16)",
            }}
          >
            ENTER
            <br />
            NEXORA
          </div>

          <div
            style={{
              marginTop: "18px",
              color: "rgba(255,255,255,0.75)",
              fontSize: "16px",
              lineHeight: 1.8,
              maxWidth: "640px",
            }}
          >
            เข้าสู่โลกแห่งการ์ดสะสม ระบบสมาชิก แต้ม NEX
            และแพลตฟอร์มเกมที่พร้อมเติบโตเป็น ecosystem เต็มรูปแบบ
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "12px",
              marginTop: "26px",
            }}
          >
            <InfoBox title="Wallet" desc="NEX Balance" />
            <InfoBox title="Rewards" desc="Redeem System" />
            <InfoBox title="Market" desc="Trade Zone" />
          </div>
        </div>

        <div
          style={{
            borderRadius: "28px",
            padding: "30px",
            background:
              "radial-gradient(circle at top right, rgba(255,214,74,0.18), transparent 26%), linear-gradient(180deg, rgba(17,24,39,0.96), rgba(8,12,22,0.96))",
            border: "1px solid rgba(255,214,74,0.14)",
            boxShadow: "0 18px 60px rgba(0,0,0,0.28)",
            alignSelf: "center",
          }}
        >
          <div
            style={{
              color: "rgba(255,255,255,0.64)",
              fontSize: "13px",
              letterSpacing: "1px",
            }}
          >
            MEMBER LOGIN
          </div>

          <div
            style={{
              marginTop: "10px",
              fontSize: "36px",
              fontWeight: 900,
              color: "#fff3bf",
            }}
          >
            เข้าสู่ระบบ
          </div>

          <div
            style={{
              marginTop: "10px",
              color: "rgba(255,255,255,0.7)",
              lineHeight: 1.7,
            }}
          >
            ใส่ชื่อผู้เล่นเพื่อเข้าสู่ระบบ NEXORA เวอร์ชันปัจจุบัน
            หรือเข้าสู่ระบบด้วย Google
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={loadingGoogle}
            style={{
              marginTop: "22px",
              width: "100%",
              padding: "16px 18px",
              borderRadius: "16px",
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.06)",
              color: "white",
              fontWeight: 900,
              fontSize: "16px",
              cursor: loadingGoogle ? "not-allowed" : "pointer",
              opacity: loadingGoogle ? 0.7 : 1,
            }}
          >
            {loadingGoogle ? "กำลังเชื่อมต่อ Google..." : "🔴 เข้าสู่ระบบด้วย Google"}
          </button>

          <div
            style={{
              marginTop: "16px",
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              color: "rgba(255,255,255,0.4)",
              fontSize: "13px",
            }}
          >
            <div
              style={{
                flex: 1,
                height: 1,
                background: "rgba(255,255,255,0.1)",
              }}
            />
            หรือ
            <div
              style={{
                flex: 1,
                height: 1,
                background: "rgba(255,255,255,0.1)",
              }}
            />
          </div>

          <div style={{ marginTop: "22px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "rgba(255,255,255,0.76)",
                fontSize: "14px",
              }}
            >
              Player Name
            </label>

            <input
              placeholder="กรอกชื่อผู้เล่น"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleLogin();
              }}
              style={{
                width: "100%",
                padding: "16px 18px",
                borderRadius: "16px",
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.06)",
                color: "white",
                fontSize: "16px",
                outline: "none",
              }}
            />
          </div>

          <button
            onClick={handleLogin}
            style={{
              marginTop: "20px",
              width: "100%",
              padding: "16px 18px",
              borderRadius: "16px",
              border: "none",
              background: "linear-gradient(180deg, #ffd34d 0%, #bf8209 100%)",
              color: "#1f1603",
              fontWeight: 900,
              fontSize: "16px",
              cursor: "pointer",
              boxShadow: "0 14px 28px rgba(255,211,77,0.18)",
            }}
          >
            เข้าสู่โลก NEXORA
          </button>

          <div
            style={{
              marginTop: "16px",
              textAlign: "center",
              color: "rgba(255,255,255,0.5)",
              fontSize: "13px",
            }}
          >
            Current Access: Google OAuth + Local Member Session
          </div>
        </div>
      </div>
    </main>
  );
}

function InfoBox({ title, desc }: { title: string; desc: string }) {
  return (
    <div
      style={{
        borderRadius: "16px",
        padding: "16px",
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div
        style={{
          color: "#fff3bf",
          fontWeight: 800,
          marginBottom: "6px",
        }}
      >
        {title}
      </div>
      <div
        style={{
          color: "rgba(255,255,255,0.62)",
          fontSize: "13px",
        }}
      >
        {desc}
      </div>
    </div>
  );
}