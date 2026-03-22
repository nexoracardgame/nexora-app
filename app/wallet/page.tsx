"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type WalletMap = {
  [key: string]: number;
};

export default function WalletPage() {
  const router = useRouter();
  const [user, setUser] = useState("");
  const [nex, setNex] = useState(0);

  useEffect(() => {
    const savedUser = localStorage.getItem("nexora_user");

    if (!savedUser) {
      router.push("/login");
      return;
    }

    setUser(savedUser);

    const walletData = localStorage.getItem("nexora_wallets");
    const wallets: WalletMap = walletData ? JSON.parse(walletData) : {};

    setNex(wallets[savedUser] || 0);
  }, [router]);

  return (
    <div style={pageStyle}>
      <h1>💰 NEX Wallet</h1>
      <p>ผู้ใช้งาน: {user}</p>
      <p>ยอดคงเหลือ: {nex.toLocaleString()} NEX</p>
      <p>แต้มเข้าเดือนนี้: +1,280 NEX</p>
      <p>แต้มใช้ไป: -600 NEX</p>
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