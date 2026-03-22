import Link from "next/link";

export default function TournamentPage() {
  return (
    <div style={pageStyle}>
      <h1>🏆 Tournament</h1>
      <p>การแข่งขัน NEXORA กำลังจะเปิดเร็วๆ นี้</p>
      <p>ติดตามรอบแข่ง กติกา และของรางวัลได้ที่หน้านี้</p>
      <br />
      <Link href="/" style={linkStyle}>← กลับหน้าแรก</Link>
    </div>
  );
}

const pageStyle = {
  minHeight: "100vh",
  background: "#0f172a",
  color: "white",
  padding: "30px",
  fontFamily: "sans-serif",
};

const linkStyle = {
  color: "#facc15",
  textDecoration: "none",
};