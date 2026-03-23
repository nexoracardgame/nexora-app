"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type WalletMap = {
  [key: string]: number;
};

export default function WalletPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [user, setUser] = useState("");
  const [nex, setNex] = useState(0);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getSession();
      const sessionUser = data.session?.user;

      if (!sessionUser) {
        router.push("/login");
        return;
      }

      const displayName = sessionUser.email || "User";
      setUser(displayName);
      setUserId(sessionUser.id);

      const walletData = localStorage.getItem("nexora_wallets");
      const wallets: WalletMap = walletData ? JSON.parse(walletData) : {};

      setNex(wallets[sessionUser.id] || 0);
    };

    loadUser();
  }, [router, supabase]);

  const incomeMonth = 1280;
  const spentMonth = 600;
  const estimatedUsd = nex * 0.06042;
  const rewardLevel =
    nex >= 10000 ? "Diamond" : nex >= 5000 ? "Gold" : nex >= 1000 ? "Silver" : "Bronze";

  const transactions = [
    {
      title: "Monthly Reward Injection",
      time: "Today • 14:25",
      amount: "+420 NEX",
      type: "in",
    },
    {
      title: "Tournament Participation Bonus",
      time: "Today • 10:08",
      amount: "+260 NEX",
      type: "in",
    },
    {
      title: "Reward Claim Redemption",
      time: "Yesterday • 19:42",
      amount: "-350 NEX",
      type: "out",
    },
    {
      title: "Referral Bonus",
      time: "Yesterday • 13:14",
      amount: "+600 NEX",
      type: "in",
    },
  ];

  const features = [
    {
      title: "Wallet Shield",
      desc: "Protected session wallet system with direct user mapping.",
    },
    {
      title: "Reward Sync",
      desc: "Track income, spending, and wallet growth in one premium dashboard.",
    },
    {
      title: "NEX Balance Engine",
      desc: "Designed to evolve into Supabase-backed production wallet later.",
    },
  ];

  return (
    <div className="min-h-screen overflow-hidden bg-[#050816] text-white">
      {/* background */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.16),transparent_26%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.18),transparent_30%),radial-gradient(circle_at_bottom_center,rgba(236,72,153,0.10),transparent_28%),linear-gradient(180deg,#070b17_0%,#040712_100%)]" />
      <div className="fixed inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,0.24)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:42px_42px]" />
      <div className="fixed left-[-120px] top-[160px] h-[420px] w-[420px] rounded-full bg-fuchsia-500/10 blur-3xl" />
      <div className="fixed right-[-120px] top-[60px] h-[420px] w-[420px] rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1700px]">
        {/* Sidebar */}
        <aside className="hidden w-[290px] shrink-0 border-r border-white/8 bg-black/20 backdrop-blur-xl xl:flex xl:flex-col">
          <div className="px-8 pb-8 pt-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500 to-cyan-400 shadow-[0_0_35px_rgba(59,130,246,0.25)]">
                <span className="text-lg font-black">N</span>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.35em] text-white/40">
                  Nexora
                </div>
                <div className="text-2xl font-black tracking-tight text-white">
                  Wallet
                </div>
              </div>
            </div>
          </div>

          <div className="px-6">
            <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl">
              <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-[26px] border border-white/15 bg-gradient-to-br from-fuchsia-500 via-violet-500 to-cyan-400 text-3xl font-black shadow-[0_18px_50px_rgba(168,85,247,0.28)]">
                {getAvatarLetter(user)}
              </div>

              <div className="truncate text-center text-[20px] font-bold">
                {shortenEmail(user)}
              </div>
              <div className="mt-1 truncate text-center text-sm text-white/40">
                {user || "Loading user..."}
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/8 bg-white/[0.04] p-3 text-center">
                  <div className="text-xl font-black text-cyan-300">{rewardLevel}</div>
                  <div className="text-xs text-white/40">Tier</div>
                </div>
                <div className="rounded-2xl border border-white/8 bg-white/[0.04] p-3 text-center">
                  <div className="text-xl font-black text-fuchsia-300">
                    {nex.toLocaleString()}
                  </div>
                  <div className="text-xs text-white/40">NEX</div>
                </div>
              </div>
            </div>
          </div>

          <nav className="mt-8 flex-1 px-4">
            <SidebarItem label="Overview" active />
            <SidebarItem label="Balance" />
            <SidebarItem label="Transactions" />
            <SidebarItem label="Rewards" />
            <SidebarItem label="Analytics" />
            <SidebarItem label="Security" />
            <SidebarItem label="Settings" />
          </nav>

          <div className="px-4 pb-8">
            <Link
              href="/"
              className="flex w-full items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-3 text-white/70 transition hover:bg-white/[0.08] hover:text-white"
            >
              <span className="text-lg">←</span>
              <span className="font-medium">กลับหน้าแรก</span>
            </Link>
          </div>
        </aside>

        {/* Main */}
        <main className="flex min-w-0 flex-1 flex-col">
          {/* Topbar */}
          <div className="border-b border-white/8 bg-black/10 px-4 py-4 backdrop-blur-xl md:px-8 xl:px-10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <div>
                  <div className="text-xs uppercase tracking-[0.28em] text-white/35">
                    NEXORA SYSTEM
                  </div>
                  <div className="text-xl font-black tracking-tight text-white">
                    Premium Wallet Interface
                  </div>
                </div>

                <div className="hidden items-center gap-2 rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-3 lg:flex">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.85)]" />
                  <span className="text-sm font-medium text-white/65">Wallet online</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/8 bg-white/[0.04] text-white/75 transition hover:bg-white/[0.08]">
                  🔔
                </button>
                <button className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/8 bg-white/[0.04] text-white/75 transition hover:bg-white/[0.08]">
                  ✦
                </button>
                <div className="rounded-2xl bg-gradient-to-r from-fuchsia-500 to-cyan-400 p-[1px] shadow-[0_0_32px_rgba(56,189,248,0.18)]">
                  <div className="flex items-center gap-3 rounded-2xl bg-[#0a1020] px-4 py-3">
                    <div>
                      <div className="text-[11px] uppercase tracking-[0.22em] text-white/35">
                        balance
                      </div>
                      <div className="text-lg font-black text-white">
                        {nex.toLocaleString()} NEX
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* content */}
          <div className="flex-1 p-4 md:p-8 xl:px-10">
            {/* Hero */}
            <section className="relative overflow-hidden rounded-[36px] border border-white/10 bg-[linear-gradient(135deg,rgba(11,17,35,0.95)_0%,rgba(8,10,24,0.98)_40%,rgba(18,10,35,0.96)_100%)] shadow-[0_30px_90px_rgba(0,0,0,0.35)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.20),transparent_22%),radial-gradient(circle_at_80%_25%,rgba(236,72,153,0.18),transparent_20%),radial-gradient(circle_at_60%_80%,rgba(168,85,247,0.14),transparent_25%)]" />
              <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.14)_1px,transparent_1px)] [background-size:32px_32px]" />

              <div className="relative grid gap-8 px-6 py-8 md:px-8 md:py-10 xl:grid-cols-[1.15fr_0.85fr] xl:px-10">
                <div>
                  <div className="mb-4 inline-flex rounded-full border border-fuchsia-400/25 bg-fuchsia-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.28em] text-fuchsia-200">
                    NEXORA DIGITAL ASSET VAULT
                  </div>

                  <h1 className="max-w-[840px] text-4xl font-black leading-[0.95] tracking-tight text-white md:text-6xl xl:text-7xl">
                    Best Premium
                    <br />
                    Wallet Experience
                  </h1>

                  <p className="mt-5 max-w-[760px] text-sm leading-7 text-white/58 md:text-base">
                    Centralize your NEX balance, monthly inflow, spending behavior,
                    and reward status in a futuristic control panel designed to feel
                    like a high-end gaming ecosystem. Dark glass. Neon gradients.
                    Premium motion-ready layout.
                  </p>

                  <div className="mt-7 flex flex-wrap gap-4">
                    <button className="rounded-2xl bg-gradient-to-r from-fuchsia-500 to-cyan-400 px-6 py-4 text-sm font-black text-white shadow-[0_14px_45px_rgba(168,85,247,0.32)] transition hover:scale-[1.02]">
                      Open Wallet Core
                    </button>

                    <Link
                      href="/"
                      className="rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-4 text-sm font-bold text-white/80 transition hover:bg-white/[0.08] hover:text-white"
                    >
                      Back to home
                    </Link>
                  </div>

                  <div className="mt-8 grid gap-4 md:grid-cols-3">
                    <StatCard
                      value={`${nex.toLocaleString()} NEX`}
                      label="Current Balance"
                      accent="cyan"
                    />
                    <StatCard
                      value={`+${incomeMonth.toLocaleString()} NEX`}
                      label="Monthly Income"
                      accent="pink"
                    />
                    <StatCard
                      value={`-${spentMonth.toLocaleString()} NEX`}
                      label="Monthly Spent"
                      accent="violet"
                    />
                  </div>
                </div>

                <div className="grid gap-5">
                  <div className="rounded-[30px] border border-white/10 bg-black/20 p-5 backdrop-blur-xl">
                    <div className="mb-3 text-xs uppercase tracking-[0.28em] text-white/35">
                      Live Summary
                    </div>

                    <div className="rounded-[28px] border border-cyan-400/20 bg-[linear-gradient(135deg,rgba(34,211,238,0.14),rgba(255,255,255,0.03))] p-5 shadow-[0_0_35px_rgba(34,211,238,0.10)]">
                      <div className="text-sm text-white/55">Available Balance</div>
                      <div className="mt-2 text-4xl font-black tracking-tight text-white">
                        {nex.toLocaleString()}
                      </div>
                      <div className="mt-1 text-sm font-semibold text-cyan-300">
                        NEX Tokens
                      </div>

                      <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 via-violet-400 to-cyan-400"
                          style={{
                            width: `${Math.max(12, Math.min((nex / 10000) * 100, 100))}%`,
                          }}
                        />
                      </div>

                      <div className="mt-3 flex items-center justify-between text-xs text-white/40">
                        <span>Wallet Growth</span>
                        <span>{Math.round(Math.max(12, Math.min((nex / 10000) * 100, 100)))}%</span>
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-4">
                      <MiniInfoCard title="Estimated Value" value={`$${estimatedUsd.toFixed(2)}`} />
                      <MiniInfoCard title="Reward Level" value={rewardLevel} />
                    </div>
                  </div>

                  <div className="rounded-[30px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-5 backdrop-blur-xl">
                    <div className="mb-4 text-xs uppercase tracking-[0.28em] text-white/35">
                      Account Mapping
                    </div>

                    <div className="space-y-3">
                      <InfoRow label="User" value={user || "Loading..."} />
                      <InfoRow label="User ID" value={userId || "Loading..."} />
                      <InfoRow label="Storage Mode" value="localStorage (temporary)" />
                      <InfoRow label="Wallet Engine" value="Client-Side Prototype" />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* lower sections */}
            <div className="mt-6 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
              {/* features */}
              <section className="rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(8,12,25,0.96),rgba(10,10,18,0.96))] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
                <div className="mb-5 flex items-end justify-between gap-4">
                  <div>
                    <div className="text-xs uppercase tracking-[0.28em] text-fuchsia-200/60">
                      Infrastructure
                    </div>
                    <h2 className="mt-2 text-3xl font-black tracking-tight">
                      Premium wallet modules
                    </h2>
                  </div>
                  <div className="text-sm text-white/35">Core system blocks</div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  {features.map((item) => (
                    <div
                      key={item.title}
                      className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5 transition hover:border-cyan-400/25 hover:bg-white/[0.05]"
                    >
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500/80 to-cyan-400/80 text-lg font-black shadow-[0_10px_25px_rgba(168,85,247,0.2)]">
                        ✦
                      </div>
                      <div className="text-lg font-bold text-white">{item.title}</div>
                      <p className="mt-2 text-sm leading-7 text-white/48">{item.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 overflow-hidden rounded-[30px] border border-white/8 bg-[linear-gradient(135deg,rgba(168,85,247,0.10),rgba(34,211,238,0.08),rgba(255,255,255,0.02))] p-6">
                  <div className="grid gap-5 md:grid-cols-[0.95fr_1.05fr] md:items-center">
                    <div>
                      <div className="text-xs uppercase tracking-[0.25em] text-white/40">
                        Upgrade path
                      </div>
                      <div className="mt-2 text-3xl font-black tracking-tight">
                        Ready to evolve into real backend wallet
                      </div>
                      <p className="mt-3 text-sm leading-7 text-white/50">
                        ตอนนี้ระบบใช้ localStorage เพื่อให้หน้า wallet ใช้งานได้เร็ว
                        แต่โครงสร้างนี้สามารถต่อเข้ากับ Supabase wallet table,
                        transaction history, reward logs และ analytics ได้ต่อทันที
                      </p>
                    </div>

                    <div className="grid gap-3">
                      <UpgradeRow text="Supabase wallet table" />
                      <UpgradeRow text="Real transaction history" />
                      <UpgradeRow text="Daily / monthly analytics" />
                      <UpgradeRow text="Reward claim system" />
                    </div>
                  </div>
                </div>
              </section>

              {/* transactions */}
              <section className="rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,12,27,0.96),rgba(7,10,18,0.98))] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
                <div className="mb-5 flex items-end justify-between gap-4">
                  <div>
                    <div className="text-xs uppercase tracking-[0.28em] text-cyan-200/60">
                      Recent Activity
                    </div>
                    <h2 className="mt-2 text-3xl font-black tracking-tight">
                      Wallet transactions
                    </h2>
                  </div>
                  <div className="rounded-full border border-white/8 bg-white/[0.04] px-4 py-2 text-sm text-white/45">
                    Live preview
                  </div>
                </div>

                <div className="space-y-3">
                  {transactions.map((item, index) => (
                    <div
                      key={`${item.title}-${index}`}
                      className="flex items-center justify-between gap-4 rounded-[26px] border border-white/8 bg-white/[0.03] px-4 py-4 transition hover:bg-white/[0.05]"
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        <div
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-lg font-black ${
                            item.type === "in"
                              ? "bg-emerald-400/15 text-emerald-300"
                              : "bg-rose-400/15 text-rose-300"
                          }`}
                        >
                          {item.type === "in" ? "+" : "−"}
                        </div>

                        <div className="min-w-0">
                          <div className="truncate text-[15px] font-bold text-white">
                            {item.title}
                          </div>
                          <div className="mt-1 text-sm text-white/40">{item.time}</div>
                        </div>
                      </div>

                      <div
                        className={`shrink-0 text-right text-[15px] font-black ${
                          item.type === "in" ? "text-emerald-300" : "text-rose-300"
                        }`}
                      >
                        {item.amount}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-[30px] border border-fuchsia-400/12 bg-[linear-gradient(135deg,rgba(168,85,247,0.12),rgba(34,211,238,0.04),rgba(255,255,255,0.02))] p-5">
                  <div className="text-xs uppercase tracking-[0.25em] text-white/40">
                    Quick Summary
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-3">
                    <SummaryBox label="Income" value={`+${incomeMonth}`} color="text-emerald-300" />
                    <SummaryBox label="Spent" value={`-${spentMonth}`} color="text-rose-300" />
                    <SummaryBox label="Net" value={`+${incomeMonth - spentMonth}`} color="text-cyan-300" />
                  </div>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function SidebarItem({
  label,
  active = false,
}: {
  label: string;
  active?: boolean;
}) {
  return (
    <button
      className={[
        "mb-1 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition",
        active
          ? "bg-[linear-gradient(90deg,rgba(168,85,247,0.18),rgba(34,211,238,0.12))] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"
          : "text-white/45 hover:bg-white/[0.05] hover:text-white/80",
      ].join(" ")}
    >
      <span className="text-lg">{active ? "◉" : "○"}</span>
      <span className="font-medium">{label}</span>
    </button>
  );
}

function StatCard({
  value,
  label,
  accent,
}: {
  value: string;
  label: string;
  accent: "cyan" | "pink" | "violet";
}) {
  const accentMap = {
    cyan: "from-cyan-400/20 to-cyan-300/5 border-cyan-300/20",
    pink: "from-fuchsia-500/20 to-fuchsia-300/5 border-fuchsia-300/20",
    violet: "from-violet-500/20 to-violet-300/5 border-violet-300/20",
  };

  return (
    <div
      className={`rounded-[28px] border bg-gradient-to-br ${accentMap[accent]} p-5 backdrop-blur-xl`}
    >
      <div className="text-2xl font-black tracking-tight text-white">{value}</div>
      <div className="mt-2 text-sm text-white/45">{label}</div>
    </div>
  );
}

function MiniInfoCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-[24px] border border-white/8 bg-white/[0.04] p-4">
      <div className="text-xs uppercase tracking-[0.22em] text-white/35">{title}</div>
      <div className="mt-2 text-xl font-black text-white">{value}</div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
      <div className="text-xs uppercase tracking-[0.22em] text-white/35">{label}</div>
      <div className="truncate text-sm font-semibold text-white/85">{value}</div>
    </div>
  );
}

function UpgradeRow({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
      <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_14px_rgba(34,211,238,0.8)]" />
      <span className="text-sm text-white/75">{text}</span>
    </div>
  );
}

function SummaryBox({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="rounded-[22px] border border-white/8 bg-white/[0.04] p-4">
      <div className="text-xs uppercase tracking-[0.22em] text-white/35">{label}</div>
      <div className={`mt-2 text-xl font-black ${color}`}>{value}</div>
    </div>
  );
}

function shortenEmail(email: string) {
  if (!email) return "User";
  const [name] = email.split("@");
  return name.length > 18 ? `${name.slice(0, 18)}...` : name;
}

function getAvatarLetter(text: string) {
  return (text || "U").trim().charAt(0).toUpperCase();
}