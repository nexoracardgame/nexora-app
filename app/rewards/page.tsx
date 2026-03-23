import Link from "next/link";

export default function RewardsPage() {
  const rewards = [
    {
      title: "Bronze Pack",
      price: "100 NEX",
      desc: "Starter reward pack for beginner collectors.",
      badge: "Basic",
      glow: "#ff4d8d",
    },
    {
      title: "Silver Pack",
      price: "350 NEX",
      desc: "Mid-tier pack with elevated drop potential.",
      badge: "Advanced",
      glow: "#7c8cff",
    },
    {
      title: "Gold Pack",
      price: "900 NEX",
      desc: "Premium reward pack for high-value claims.",
      badge: "Elite",
      glow: "#ffb347",
    },
  ];

  const transactions = [
    { name: "Bronze Reward Claimed", time: "Today • 14:25", amount: "-100 NEX" },
    { name: "Tournament Bonus", time: "Today • 09:10", amount: "+250 NEX" },
    { name: "Referral Reward", time: "Yesterday • 20:41", amount: "+120 NEX" },
    { name: "Silver Reward Claimed", time: "Yesterday • 18:02", amount: "-350 NEX" },
  ];

  return (
    <div style={pageStyle}>
      <div style={noiseOverlay} />
      <div style={topGlowLeft} />
      <div style={topGlowRight} />

      {/* Top bar */}
      <header style={topbar}>
        <div style={brandWrap}>
          <div style={brandIconWrap}>
            <span style={brandDotSmall} />
            <span style={brandDotSmall} />
            <span style={brandDotLarge} />
          </div>
          <span style={brandText}>NEXORA</span>
        </div>

        <div style={searchWrap}>
          <span style={searchIcon}>⌕</span>
          <input
            type="text"
            placeholder="Search rewards, transactions, packs..."
            style={searchInput}
          />
        </div>

        <div style={topRightWrap}>
          <div style={statusPill}>
            <div style={avatarMini}>N</div>
            <div>
              <div style={statusTitle}>Arcane Wallet</div>
              <div style={statusSub}>Quantum balance sync active</div>
            </div>
          </div>

          <button style={iconButton}>🔔</button>
          <button style={iconButton}>💼</button>

          <div style={profileWrap}>
            <div style={profileRing}>
              <div style={profileInner}>B</div>
            </div>
          </div>
        </div>
      </header>

      <div style={mainShell}>
        {/* Sidebar */}
        <aside style={sidebar}>
          <div style={sidebarInner}>
            <div style={{ ...sideIcon, ...sideIconActive }}>⌂</div>
            <div style={sideIcon}>◫</div>
            <div style={sideIcon}>▣</div>
            <div style={sideIcon}>▤</div>
            <div style={sideIcon}>⌘</div>
            <div style={sideIcon}>◈</div>
            <div style={sideIcon}>⚙</div>
            <div style={{ ...sideIcon, marginTop: "auto" }}>⇦</div>
          </div>
        </aside>

        {/* Main content */}
        <main style={content}>
          {/* Hero */}
          <section style={heroCard}>
            <div style={heroLeft}>
              <div style={heroLabel}>NEXORA WALLET CORE</div>
              <h1 style={heroTitle}>CYBER REWARDS VAULT</h1>
              <div style={heroDivider} />

              <p style={heroDesc}>
                Manage your NEX balance, claim premium reward packs, and monitor
                real-time vault activity through the next-generation NEXORA
                reward interface.
              </p>

              <div style={heroBottom}>
                <button style={claimButton}>Open Wallet</button>

                <div style={balanceWrap}>
                  <div style={balanceMain}>12,850 NEX</div>
                  <div style={balanceSub}>Available Balance</div>
                </div>
              </div>

              <div style={friendsRow}>
                <span style={onlineDot} />
                <span>45 collectors currently active in the rewards system</span>
              </div>
            </div>

            <div style={heroRight}>
              <div style={helmetGlow} />
              <img
                src="https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1600&auto=format&fit=crop"
                alt="Sci-fi artwork"
                style={heroImage}
              />
              <div style={heroImageOverlay} />
            </div>
          </section>

          {/* Lower grid */}
          <section style={lowerGrid}>
            {/* Rewards list */}
            <div style={panelLeft}>
              <div style={panelTopLine} />
              <h2 style={panelTitle}>Top Rewards This Cycle</h2>

              <div style={rewardList}>
                {rewards.map((item, index) => (
                  <div key={item.title} style={rewardItem}>
                    <div style={rewardNumber}>{index + 1}.</div>

                    <div style={rewardTextWrap}>
                      <div style={rewardName}>{item.title}</div>
                      <div style={rewardMeta}>{item.desc}</div>
                      <div style={rewardSubMeta}>
                        Reward Tier • Claimable • Wallet Linked
                      </div>
                    </div>

                    <div
                      style={{
                        ...rewardThumb,
                        boxShadow: `0 0 30px ${item.glow}33 inset, 0 0 25px ${item.glow}22`,
                        border: `1px solid ${item.glow}55`,
                      }}
                    >
                      <div style={{ ...thumbBadge, background: item.glow }}>
                        {item.badge}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Wallet cards */}
            <div style={panelRight}>
              <div style={walletHeaderRow}>
                <h2 style={panelTitleRight}>Wallet Channels</h2>
                <button style={filterButton}>Popular ▾</button>
              </div>

              <div style={walletCards}>
                <div style={walletCard}>
                  <div style={walletCardTop}>
                    <span style={greenStatus} />
                    <span>Primary Vault</span>
                  </div>
                  <div style={walletAmount}>8,430 NEX</div>
                  <div style={walletGame}>Main Reserve Balance</div>
                  <div style={walletUserRow}>
                    <div style={walletAvatar}>B</div>
                    <div>
                      <div style={walletUser}>Boss Account</div>
                      <div style={walletHandle}>@wallet.main</div>
                    </div>
                  </div>
                </div>

                <div style={walletCard}>
                  <div style={walletCardTop}>
                    <span style={greenStatus} />
                    <span>Reward Pool</span>
                  </div>
                  <div style={walletAmount}>2,910 NEX</div>
                  <div style={walletGame}>Auto-redeem Reserve</div>
                  <div style={walletUserRow}>
                    <div style={walletAvatar}>R</div>
                    <div>
                      <div style={walletUser}>Rewards Core</div>
                      <div style={walletHandle}>@reward.pool</div>
                    </div>
                  </div>
                </div>

                <div style={walletCard}>
                  <div style={walletCardTop}>
                    <span style={greenStatus} />
                    <span>Bonus Stack</span>
                  </div>
                  <div style={walletAmount}>1,510 NEX</div>
                  <div style={walletGame}>Event Bonus Storage</div>
                  <div style={walletUserRow}>
                    <div style={walletAvatar}>E</div>
                    <div>
                      <div style={walletUser}>Event Rewards</div>
                      <div style={walletHandle}>@bonus.stack</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Transactions */}
          <section style={transactionsPanel}>
            <div style={transactionsHeader}>
              <div>
                <div style={sectionMiniLabel}>SYSTEM LOG</div>
                <h2 style={transactionsTitle}>Recent Wallet Transactions</h2>
              </div>

              <Link href="/" style={backButton}>
                ← กลับหน้าแรก
              </Link>
            </div>

            <div style={txTable}>
              {transactions.map((tx) => (
                <div key={`${tx.name}-${tx.time}`} style={txRow}>
                  <div style={txLeft}>
                    <div style={txIcon}>◉</div>
                    <div>
                      <div style={txName}>{tx.name}</div>
                      <div style={txTime}>{tx.time}</div>
                    </div>
                  </div>
                  <div
                    style={{
                      ...txAmount,
                      color: tx.amount.startsWith("+") ? "#6effb2" : "#ff7ca8",
                    }}
                  >
                    {tx.amount}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

const pageStyle = {
  minHeight: "100vh",
  background:
    "radial-gradient(circle at top left, rgba(255,255,255,0.07), transparent 20%), linear-gradient(135deg, #1c1c1f 0%, #262629 28%, #19191b 54%, #101012 100%)",
  color: "#ffffff",
  padding: "22px",
  fontFamily:
    "Inter, Tahoma, 'Noto Sans Thai', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  position: "relative",
  overflow: "hidden",
};

const noiseOverlay = {
  position: "absolute",
  inset: 0,
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.008) 30%, rgba(0,0,0,0.12) 100%)",
  pointerEvents: "none",
};

const topGlowLeft = {
  position: "absolute",
  top: -120,
  left: -100,
  width: 420,
  height: 420,
  borderRadius: "999px",
  background: "radial-gradient(circle, rgba(255,70,140,0.22), transparent 68%)",
  filter: "blur(30px)",
  pointerEvents: "none",
};

const topGlowRight = {
  position: "absolute",
  top: -80,
  right: -60,
  width: 320,
  height: 320,
  borderRadius: "999px",
  background: "radial-gradient(circle, rgba(86,185,255,0.18), transparent 68%)",
  filter: "blur(28px)",
  pointerEvents: "none",
};

const topbar = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "18px",
  marginBottom: "24px",
  position: "relative",
  zIndex: 2,
  flexWrap: "wrap",
};

const brandWrap = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  minWidth: "180px",
};

const brandIconWrap = {
  display: "grid",
  gridTemplateColumns: "10px 10px",
  gridTemplateRows: "10px 10px",
  gap: "5px",
  alignItems: "center",
};

const brandDotSmall = {
  width: "10px",
  height: "10px",
  borderRadius: "999px",
  background: "rgba(255,255,255,0.92)",
};

const brandDotLarge = {
  width: "25px",
  height: "10px",
  borderRadius: "999px",
  background: "rgba(255,255,255,0.92)",
  gridColumn: "span 2",
};

const brandText = {
  fontSize: "26px",
  fontWeight: 800,
  letterSpacing: "0.04em",
};

const searchWrap = {
  flex: 1,
  minWidth: "280px",
  maxWidth: "520px",
  height: "56px",
  borderRadius: "999px",
  background: "rgba(8,8,10,0.72)",
  border: "1px solid rgba(255,255,255,0.08)",
  display: "flex",
  alignItems: "center",
  padding: "0 18px",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03)",
};

const searchIcon = {
  fontSize: "18px",
  opacity: 0.7,
  marginRight: "10px",
};

const searchInput = {
  flex: 1,
  background: "transparent",
  border: "none",
  outline: "none",
  color: "#fff",
  fontSize: "15px",
};

const topRightWrap = {
  display: "flex",
  alignItems: "center",
  gap: "14px",
  flexWrap: "wrap",
  justifyContent: "flex-end",
};

const statusPill = {
  minWidth: "290px",
  maxWidth: "420px",
  padding: "10px 16px",
  borderRadius: "999px",
  background: "rgba(10,10,12,0.76)",
  border: "1px solid rgba(255,255,255,0.08)",
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const avatarMini = {
  width: "42px",
  height: "42px",
  borderRadius: "999px",
  display: "grid",
  placeItems: "center",
  fontWeight: 800,
  background:
    "linear-gradient(135deg, rgba(255,77,141,0.9), rgba(90,116,255,0.9))",
  boxShadow: "0 0 18px rgba(255,77,141,0.28)",
};

const statusTitle = {
  fontWeight: 700,
  fontSize: "14px",
};

const statusSub = {
  fontSize: "12px",
  opacity: 0.65,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const iconButton = {
  width: "52px",
  height: "52px",
  borderRadius: "999px",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(10,10,12,0.76)",
  color: "#fff",
  cursor: "pointer",
  fontSize: "18px",
};

const profileWrap = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const profileRing = {
  width: "58px",
  height: "58px",
  borderRadius: "999px",
  background:
    "linear-gradient(135deg, rgba(86,185,255,0.9), rgba(255,77,141,0.7))",
  padding: "2px",
};

const profileInner = {
  width: "100%",
  height: "100%",
  borderRadius: "999px",
  background: "#111114",
  display: "grid",
  placeItems: "center",
  fontWeight: 800,
};

const mainShell = {
  display: "flex",
  gap: "22px",
  position: "relative",
  zIndex: 2,
};

const sidebar = {
  width: "100px",
  minWidth: "100px",
};

const sidebarInner = {
  height: "calc(100vh - 130px)",
  minHeight: "760px",
  borderRadius: "40px",
  background: "linear-gradient(180deg, rgba(8,8,10,0.84), rgba(18,18,22,0.95))",
  border: "1px solid rgba(255,255,255,0.06)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03)",
  padding: "20px 0",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "18px",
};

const sideIcon = {
  width: "54px",
  height: "54px",
  borderRadius: "18px",
  display: "grid",
  placeItems: "center",
  color: "rgba(255,255,255,0.68)",
  fontSize: "22px",
  transition: "all .2s ease",
};

const sideIconActive = {
  background: "rgba(255,255,255,0.03)",
  color: "#ff4d8d",
  boxShadow:
    "inset 0 0 0 1px rgba(255,255,255,0.05), 0 0 24px rgba(255,77,141,0.25)",
  position: "relative",
};

const content = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  gap: "22px",
};

const heroCard = {
  minHeight: "460px",
  borderRadius: "32px",
  overflow: "hidden",
  background:
    "linear-gradient(135deg, rgba(228,228,228,0.98) 0%, rgba(202,202,202,0.92) 38%, rgba(30,30,34,0.96) 38%, rgba(12,12,15,1) 100%)",
  display: "grid",
  gridTemplateColumns: "1.1fr 1fr",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow:
    "0 20px 60px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.04)",
  position: "relative",
};

const heroLeft = {
  padding: "54px 42px 38px",
  color: "#141414",
  position: "relative",
};

const heroLabel = {
  fontSize: "13px",
  fontWeight: 800,
  letterSpacing: "0.14em",
  opacity: 0.75,
  marginBottom: "12px",
};

const heroTitle = {
  fontSize: "64px",
  lineHeight: 0.95,
  fontWeight: 900,
  letterSpacing: "-0.04em",
  margin: 0,
  maxWidth: "720px",
};

const heroDivider = {
  width: "330px",
  maxWidth: "100%",
  height: "16px",
  background: "#232323",
  marginTop: "18px",
  marginBottom: "20px",
};

const heroDesc = {
  fontSize: "18px",
  lineHeight: 1.55,
  maxWidth: "640px",
  color: "rgba(10,10,10,0.78)",
  marginBottom: "32px",
};

const heroBottom = {
  display: "flex",
  alignItems: "center",
  gap: "26px",
  flexWrap: "wrap",
};

const claimButton = {
  width: "190px",
  height: "190px",
  borderRadius: "999px",
  border: "none",
  background: "linear-gradient(180deg, #3a3a3f, #202125)",
  color: "#fff",
  fontSize: "38px",
  fontWeight: 800,
  boxShadow:
    "inset 0 4px 14px rgba(255,255,255,0.06), 0 20px 40px rgba(0,0,0,0.18)",
  cursor: "pointer",
};

const balanceWrap = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
};

const balanceMain = {
  fontSize: "54px",
  fontWeight: 900,
  color: "#232323",
  letterSpacing: "-0.04em",
};

const balanceSub = {
  fontSize: "18px",
  fontWeight: 700,
  color: "rgba(0,0,0,0.65)",
};

const friendsRow = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginTop: "18px",
  color: "rgba(10,10,10,0.68)",
  fontWeight: 600,
};

const onlineDot = {
  width: "12px",
  height: "12px",
  borderRadius: "999px",
  background: "#40ff87",
  boxShadow: "0 0 14px rgba(64,255,135,0.9)",
};

const heroRight = {
  position: "relative",
  minHeight: "460px",
  overflow: "hidden",
  clipPath: "polygon(8% 0, 100% 0, 100% 84%, 80% 84%, 72% 100%, 0 100%, 0 12%)",
  background: "linear-gradient(180deg, #1d1e25, #09090b)",
};

const helmetGlow = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background:
    "radial-gradient(circle at 34% 42%, rgba(255,185,50,0.30), transparent 10%), radial-gradient(circle at 68% 26%, rgba(170,120,255,0.25), transparent 22%), radial-gradient(circle at 82% 30%, rgba(255,255,255,0.18), transparent 10%)",
  zIndex: 1,
  pointerEvents: "none",
};

const heroImage = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
  filter: "grayscale(15%) contrast(1.06) brightness(0.7)",
};

const heroImageOverlay = {
  position: "absolute",
  inset: 0,
  background:
    "linear-gradient(90deg, rgba(12,12,14,0.06) 0%, rgba(12,12,14,0.25) 30%, rgba(10,10,12,0.5) 100%)",
};

const lowerGrid = {
  display: "grid",
  gridTemplateColumns: "1.1fr 1fr",
  gap: "22px",
};

const panelLeft = {
  background: "linear-gradient(180deg, rgba(11,11,14,0.92), rgba(22,22,26,0.95))",
  borderRadius: "0 0 28px 28px",
  border: "1px solid rgba(255,255,255,0.06)",
  padding: "0 28px 24px",
  position: "relative",
  overflow: "hidden",
};

const panelTopLine = {
  height: "8px",
  margin: "0 -28px 22px",
  background:
    "linear-gradient(90deg, rgba(255,77,141,1) 0%, rgba(255,77,141,0.82) 35%, rgba(255,77,141,0.05) 100%)",
  boxShadow: "0 0 24px rgba(255,77,141,0.45)",
};

const panelTitle = {
  margin: 0,
  fontSize: "28px",
  fontWeight: 900,
  letterSpacing: "-0.03em",
  marginBottom: "18px",
};

const rewardList = {
  display: "flex",
  flexDirection: "column",
  gap: "18px",
};

const rewardItem = {
  display: "grid",
  gridTemplateColumns: "40px 1fr 120px",
  gap: "16px",
  alignItems: "center",
};

const rewardNumber = {
  fontSize: "22px",
  fontWeight: 900,
  color: "#ffffff",
  opacity: 0.95,
};

const rewardTextWrap = {
  minWidth: 0,
};

const rewardName = {
  fontSize: "22px",
  fontWeight: 800,
  marginBottom: "6px",
};

const rewardMeta = {
  fontSize: "14px",
  color: "rgba(255,255,255,0.68)",
  marginBottom: "6px",
};

const rewardSubMeta = {
  fontSize: "13px",
  color: "rgba(255,255,255,0.52)",
};

const rewardThumb = {
  width: "110px",
  height: "86px",
  borderRadius: "14px",
  background:
    "linear-gradient(135deg, rgba(255,255,255,0.10), rgba(255,255,255,0.02))",
  position: "relative",
};

const thumbBadge = {
  position: "absolute",
  right: "10px",
  top: "10px",
  fontSize: "11px",
  fontWeight: 800,
  color: "#0a0a0d",
  padding: "6px 10px",
  borderRadius: "999px",
};

const panelRight = {
  background: "linear-gradient(180deg, rgba(14,14,17,0.95), rgba(23,23,28,0.96))",
  borderRadius: "28px",
  border: "1px solid rgba(255,255,255,0.06)",
  padding: "24px",
  position: "relative",
  overflow: "hidden",
};

const walletHeaderRow = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "14px",
  marginBottom: "18px",
  flexWrap: "wrap",
};

const panelTitleRight = {
  margin: 0,
  fontSize: "26px",
  fontWeight: 900,
  letterSpacing: "-0.03em",
};

const filterButton = {
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(8,8,10,0.75)",
  color: "#fff",
  borderRadius: "999px",
  padding: "12px 18px",
  cursor: "pointer",
  fontWeight: 700,
};

const walletCards = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "16px",
};

const walletCard = {
  background: "linear-gradient(180deg, rgba(7,7,10,0.92), rgba(12,12,15,0.98))",
  borderRadius: "22px",
  padding: "18px",
  border: "1px solid rgba(255,255,255,0.06)",
  minHeight: "230px",
  display: "flex",
  flexDirection: "column",
};

const walletCardTop = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  fontSize: "13px",
  color: "rgba(255,255,255,0.72)",
  marginBottom: "18px",
};

const greenStatus = {
  width: "10px",
  height: "10px",
  borderRadius: "999px",
  background: "#41ff88",
  boxShadow: "0 0 12px rgba(65,255,136,0.9)",
};

const walletAmount = {
  fontSize: "34px",
  fontWeight: 900,
  letterSpacing: "-0.04em",
  marginBottom: "6px",
};

const walletGame = {
  fontSize: "15px",
  color: "rgba(255,255,255,0.62)",
  marginBottom: "auto",
};

const walletUserRow = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  marginTop: "22px",
};

const walletAvatar = {
  width: "42px",
  height: "42px",
  borderRadius: "999px",
  background:
    "linear-gradient(135deg, rgba(0,195,255,0.8), rgba(255,77,141,0.8))",
  display: "grid",
  placeItems: "center",
  fontWeight: 800,
};

const walletUser = {
  fontWeight: 700,
};

const walletHandle = {
  fontSize: "13px",
  opacity: 0.55,
};

const transactionsPanel = {
  background: "linear-gradient(180deg, rgba(12,12,15,0.96), rgba(20,20,24,0.98))",
  borderRadius: "28px",
  border: "1px solid rgba(255,255,255,0.06)",
  padding: "24px",
};

const transactionsHeader = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "16px",
  flexWrap: "wrap",
  marginBottom: "18px",
};

const sectionMiniLabel = {
  fontSize: "12px",
  letterSpacing: "0.16em",
  fontWeight: 800,
  color: "rgba(255,255,255,0.48)",
  marginBottom: "6px",
};

const transactionsTitle = {
  margin: 0,
  fontSize: "30px",
  fontWeight: 900,
  letterSpacing: "-0.03em",
};

const backButton = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "12px 18px",
  borderRadius: "999px",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  color: "#fff",
  textDecoration: "none",
  fontWeight: 700,
};

const txTable = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};

const txRow = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "16px",
  padding: "16px 18px",
  borderRadius: "18px",
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.05)",
  flexWrap: "wrap",
};

const txLeft = {
  display: "flex",
  alignItems: "center",
  gap: "14px",
};

const txIcon = {
  width: "42px",
  height: "42px",
  borderRadius: "999px",
  display: "grid",
  placeItems: "center",
  background: "rgba(255,255,255,0.05)",
};

const txName = {
  fontWeight: 800,
};

const txTime = {
  fontSize: "13px",
  color: "rgba(255,255,255,0.56)",
  marginTop: "3px",
};

const txAmount = {
  fontSize: "18px",
  fontWeight: 900,
};