"use client";

import { useParams } from "next/navigation";
import ChatBox from "../../../components/ChatBox";

export default function ChatRoomPage() {
  const params = useParams();
  const slug = String(params.slug || "global");

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "24px",
        background:
          "radial-gradient(circle at top left, rgba(255,210,92,0.12), transparent 20%), radial-gradient(circle at top right, rgba(138,99,255,0.12), transparent 18%), linear-gradient(180deg, #050507 0%, #09090d 40%, #050507 100%)",
      }}
    >
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>

        {/* 🔥 AI บนสุด */}
        <div
          style={{
            borderRadius: 28,
            padding: 2,
            marginBottom: 28,
            background: `
              radial-gradient(circle at 100% 0%, rgba(138,99,255,0.9) 0%, rgba(138,99,255,0.5) 20%, transparent 45%),
              linear-gradient(135deg,#fff3b0,#f1cc74 40%,#d4a62f 70%,#6f4a17)
            `,
            boxShadow: "0 0 16px rgba(241,204,116,0.2)",
          }}
        >
          <iframe
            src="https://script.google.com/macros/s/AKfycbzkYYwBvBryWEWCIMQpYanfeiRbta6geYhq2SlluadVGGiw3C2XsEPW-pT59PqcIF6C/exec"
            style={{
              width: "100%",
              height: "70svh",
              border: 0,
              display: "block",
              borderRadius: 26,
              background: "#000",
            }}
            loading="lazy"
            allow="clipboard-read; clipboard-write"
          />
        </div>

        {/* 🔥 ชื่อห้อง */}
        <div
          style={{
            fontSize: 20,
            color: "#f7d978",
            marginBottom: 12,
            fontWeight: 800,
          }}
        >
          ห้อง: {slug}
        </div>

        {/* 💬 แชทคนจริง */}
        <ChatBox />
      </div>
    </div>
  );
}