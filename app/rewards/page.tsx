import Link from "next/link";

export default function RewardsPage() {
  return (
    <div style={pageStyle}>
      <h1>🎁 Rewards</h1>
      <p>Bronze Pack - 100 NEX</p>
      <p>Silver Pack - 350 NEX</p>
      <p>Gold Pack - 900 NEX</p>
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