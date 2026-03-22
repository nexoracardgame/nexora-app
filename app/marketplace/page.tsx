"use client";

import { useMemo, useState } from "react";

type MarketCard = {
  id: number;
  name: string;
  serial: string;
  rarity: "Bronze" | "Silver" | "Gold" | "Diamond" | "Legendary";
  element: "Fire" | "Water" | "Earth" | "Wood" | "Metal";
  price: number;
  seller: string;
  image: string;
  hot?: boolean;
  verified?: boolean;
};

const MOCK_CARDS: MarketCard[] = [
  {
    id: 1,
    name: "Infernal Flame",
    serial: "NX-FR-001932",
    rarity: "Legendary",
    element: "Fire",
    price: 18500,
    seller: "ArcaneDealer",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1200&auto=format&fit=crop",
    hot: true,
    verified: true,
  },
  {
    id: 2,
    name: "Tidal Wrath",
    serial: "NX-WT-000781",
    rarity: "Gold",
    element: "Water",
    price: 6200,
    seller: "WaveMaster",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop",
    hot: true,
  },
  {
    id: 3,
    name: "Stone Dominion",
    serial: "NX-ER-003210",
    rarity: "Silver",
    element: "Earth",
    price: 2800,
    seller: "TitanVault",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop",
    verified: true,
  },
  {
    id: 4,
    name: "Verdant Oath",
    serial: "NX-WD-001159",
    rarity: "Diamond",
    element: "Wood",
    price: 9100,
    seller: "ForestRune",
    image: "https://images.unsplash.com/photo-1547394765-185e1e68f34e?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 5,
    name: "Aurion Spear",
    serial: "NX-MT-000447",
    rarity: "Gold",
    element: "Metal",
    price: 7000,
    seller: "GoldenMint",
    image: "https://images.unsplash.com/photo-1511882150382-421056c89033?q=80&w=1200&auto=format&fit=crop",
    verified: true,
  },
  {
    id: 6,
    name: "Molten Crown",
    serial: "NX-FR-002844",
    rarity: "Bronze",
    element: "Fire",
    price: 950,
    seller: "NovaTrade",
    image: "https://images.unsplash.com/photo-1514986888952-8cd320577b68?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 7,
    name: "Abyss Whisper",
    serial: "NX-WT-001020",
    rarity: "Diamond",
    element: "Water",
    price: 11200,
    seller: "DeepBlueX",
    image: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?q=80&w=1200&auto=format&fit=crop",
    hot: true,
  },
  {
    id: 8,
    name: "Iron Eclipse",
    serial: "NX-MT-004111",
    rarity: "Silver",
    element: "Metal",
    price: 3400,
    seller: "ShieldCore",
    image: "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?q=80&w=1200&auto=format&fit=crop",
  },
];

function rarityColor(rarity: MarketCard["rarity"]) {
  switch (rarity) {
    case "Bronze":
      return "#c98a4a";
    case "Silver":
      return "#d7dee7";
    case "Gold":
      return "#ffd54a";
    case "Diamond":
      return "#6fe4ff";
    case "Legendary":
      return "#ff6ec7";
    default:
      return "#ffffff";
  }
}

function elementLabel(element: MarketCard["element"]) {
  switch (element) {
    case "Fire":
      return "ไฟ";
    case "Water":
      return "น้ำ";
    case "Earth":
      return "ดิน";
    case "Wood":
      return "ไม้";
    case "Metal":
      return "ทอง";
    default:
      return element;
  }
}

export default function MarketplacePage() {
  const [search, setSearch] = useState("");
  const [rarity, setRarity] = useState("All");
  const [sortBy, setSortBy] = useState("latest");

  const filteredCards = useMemo(() => {
    let items = [...MOCK_CARDS];

    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(
        (card) =>
          card.name.toLowerCase().includes(q) ||
          card.serial.toLowerCase().includes(q) ||
          card.seller.toLowerCase().includes(q)
      );
    }

    if (rarity !== "All") {
      items = items.filter((card) => card.rarity === rarity);
    }

    if (sortBy === "price-low") {
      items.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      items.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rarity") {
      const order = {
        Bronze: 1,
        Silver: 2,
        Gold: 3,
        Diamond: 4,
        Legendary: 5,
      };
      items.sort((a, b) => order[b.rarity] - order[a.rarity]);
    }

    return items;
  }, [search, rarity, sortBy]);

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(255,200,80,0.14), transparent 16%), linear-gradient(180deg, #060a14 0%, #071225 42%, #040711 100%)",
        color: "white",
        fontFamily: "Arial, sans-serif",
        padding: "24px",
      }}
    >
      <div
        style={{
          maxWidth: 1480,
          margin: "0 auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            borderRadius: 28,
            padding: 28,
            marginBottom: 24,
            background:
              "radial-gradient(circle at top right, rgba(255,214,74,0.16), transparent 24%), linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.03))",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.28)",
          }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "8px 14px",
              borderRadius: 999,
              background: "rgba(255,214,74,0.08)",
              border: "1px solid rgba(255,214,74,0.2)",
              color: "#ffe08a",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 1,
              marginBottom: 16,
            }}
          >
            ARCANE GRAND EXCHANGE
          </div>

          <div
            style={{
              fontSize: "clamp(30px, 5vw, 60px)",
              fontWeight: 900,
              lineHeight: 1,
            }}
          >
            ตลาดซื้อขายการ์ด <span style={{ color: "#ffd54a" }}>NEXORA</span>
          </div>

          <div
            style={{
              marginTop: 14,
              color: "rgba(255,255,255,0.74)",
              fontSize: 16,
              lineHeight: 1.8,
              maxWidth: 900,
            }}
          >
            ศูนย์กลางการซื้อขาย แลกเปลี่ยน และประเมินมูลค่าการ์ดสะสมแบบมืออาชีพ
            ดีไซน์แฟนตาซี พรีเมียม และพร้อมต่อยอดสู่ระบบตลาดจริง
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 14,
              marginTop: 22,
            }}
          >
            <TopStat title="Listings" value="128" />
            <TopStat title="Live Buyers" value="47" />
            <TopStat title="Hot Auctions" value="9" />
            <TopStat title="Verified Sellers" value="18" />
          </div>
        </div>

        {/* Filter bar */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 0.7fr 0.7fr",
            gap: 14,
            marginBottom: 24,
          }}
        >
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหาชื่อการ์ด / Serial / ผู้ขาย"
            style={{
              width: "100%",
              padding: "16px 18px",
              borderRadius: 18,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.05)",
              color: "white",
              fontSize: 16,
              outline: "none",
            }}
          />

          <select
            value={rarity}
            onChange={(e) => setRarity(e.target.value)}
            style={{
              width: "100%",
              padding: "16px 18px",
              borderRadius: 18,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "#121b2c",
              color: "white",
              fontSize: 16,
              outline: "none",
            }}
          >
            <option value="All">ทุกระดับ</option>
            <option value="Bronze">Bronze</option>
            <option value="Silver">Silver</option>
            <option value="Gold">Gold</option>
            <option value="Diamond">Diamond</option>
            <option value="Legendary">Legendary</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              width: "100%",
              padding: "16px 18px",
              borderRadius: 18,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "#121b2c",
              color: "white",
              fontSize: 16,
              outline: "none",
            }}
          >
            <option value="latest">ล่าสุด</option>
            <option value="price-low">ราคาต่ำสุด</option>
            <option value="price-high">ราคาสูงสุด</option>
            <option value="rarity">หายากสุด</option>
          </select>
        </div>

        {/* Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 18,
          }}
        >
          {filteredCards.map((card) => (
            <div
              key={card.id}
              style={{
                borderRadius: 24,
                overflow: "hidden",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 18px 50px rgba(0,0,0,0.22)",
              }}
            >
              <div style={{ position: "relative", height: 240 }}>
                <img
                  src={card.image}
                  alt={card.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />

                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0.55))",
                  }}
                />

                <div
                  style={{
                    position: "absolute",
                    top: 12,
                    left: 12,
                    display: "flex",
                    gap: 8,
                    flexWrap: "wrap",
                  }}
                >
                  <Badge text={card.rarity} color={rarityColor(card.rarity)} dark />
                  <Badge text={elementLabel(card.element)} color="#8ab4ff" dark />
                  {card.hot && <Badge text="HOT" color="#ff7a59" dark />}
                </div>

                {card.verified && (
                  <div
                    style={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      padding: "8px 10px",
                      borderRadius: 999,
                      background: "rgba(0,0,0,0.55)",
                      border: "1px solid rgba(255,255,255,0.14)",
                      fontSize: 12,
                      fontWeight: 800,
                    }}
                  >
                    ✔ Verified
                  </div>
                )}
              </div>

              <div style={{ padding: 18 }}>
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 900,
                    color: "#fff3bf",
                    lineHeight: 1.1,
                  }}
                >
                  {card.name}
                </div>

                <div
                  style={{
                    marginTop: 8,
                    fontSize: 13,
                    color: "rgba(255,255,255,0.62)",
                  }}
                >
                  Serial: {card.serial}
                </div>

                <div
                  style={{
                    marginTop: 10,
                    color: "rgba(255,255,255,0.7)",
                    fontSize: 14,
                  }}
                >
                  ผู้ขาย: <span style={{ color: "#ffffff", fontWeight: 700 }}>{card.seller}</span>
                </div>

                <div
                  style={{
                    marginTop: 16,
                    padding: "14px 16px",
                    borderRadius: 18,
                    background: "rgba(255,214,74,0.08)",
                    border: "1px solid rgba(255,214,74,0.18)",
                  }}
                >
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.62)" }}>
                    ราคาเสนอขาย
                  </div>
                  <div
                    style={{
                      marginTop: 6,
                      fontSize: 28,
                      fontWeight: 900,
                      color: "#ffd54a",
                    }}
                  >
                    {card.price.toLocaleString()} NEX
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 10,
                    marginTop: 16,
                  }}
                >
                  <button
                    style={{
                      padding: "14px 16px",
                      borderRadius: 16,
                      border: "none",
                      background: "linear-gradient(180deg, #ffd34d 0%, #bf8209 100%)",
                      color: "#1f1603",
                      fontWeight: 900,
                      cursor: "pointer",
                    }}
                  >
                    ซื้อทันที
                  </button>

                  <button
                    style={{
                      padding: "14px 16px",
                      borderRadius: 16,
                      border: "1px solid rgba(255,255,255,0.1)",
                      background: "rgba(255,255,255,0.05)",
                      color: "white",
                      fontWeight: 800,
                      cursor: "pointer",
                    }}
                  >
                    ดูรายละเอียด
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCards.length === 0 && (
          <div
            style={{
              marginTop: 24,
              padding: 30,
              borderRadius: 22,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              textAlign: "center",
              color: "rgba(255,255,255,0.72)",
            }}
          >
            ไม่พบการ์ดที่ตรงกับการค้นหา
          </div>
        )}
      </div>
    </main>
  );
}

function TopStat({ title, value }: { title: string; value: string }) {
  return (
    <div
      style={{
        borderRadius: 18,
        padding: 16,
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.58)", marginBottom: 8 }}>
        {title}
      </div>
      <div style={{ fontSize: 28, fontWeight: 900, color: "#fff3bf" }}>{value}</div>
    </div>
  );
}

function Badge({
  text,
  color,
  dark = false,
}: {
  text: string;
  color: string;
  dark?: boolean;
}) {
  return (
    <div
      style={{
        padding: "7px 10px",
        borderRadius: 999,
        background: dark ? "rgba(0,0,0,0.55)" : `${color}20`,
        color,
        border: `1px solid ${color}50`,
        fontSize: 12,
        fontWeight: 800,
      }}
    >
      {text}
    </div>
  );
}