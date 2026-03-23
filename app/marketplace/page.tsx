"use client";

import { useEffect, useMemo, useState } from "react";

type ProductItem = {
  id: number;
  title: string;
  subtitle: string;
  game: string;
  price: number;
  suggestedPrice: number;
  wear: string;
  wearValue: string;
  daysLeft?: string;
  isNew?: boolean;
  isLocked?: boolean;
  image: string;
};

type SoldItem = {
  id: number;
  title: string;
  ago: string;
  price: number;
  image: string;
};

const SOLD_ITEMS: SoldItem[] = [
  {
    id: 1,
    title: "M4A1-S",
    ago: "2 seconds ago",
    price: 15.25,
    image:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=900&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "M4A1-S",
    ago: "5 seconds ago",
    price: 15.25,
    image:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=900&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "M4A1-S",
    ago: "5 seconds ago",
    price: 15.25,
    image:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=900&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "M4A1-S",
    ago: "6 seconds ago",
    price: 15.25,
    image:
      "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?q=80&w=900&auto=format&fit=crop",
  },
  {
    id: 5,
    title: "M4A1-S",
    ago: "8 seconds ago",
    price: 15.25,
    image:
      "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?q=80&w=900&auto=format&fit=crop",
  },
  {
    id: 6,
    title: "M4A1-S",
    ago: "10 seconds ago",
    price: 15.25,
    image:
      "https://images.unsplash.com/photo-1511882150382-421056c89033?q=80&w=900&auto=format&fit=crop",
  },
];

const PRODUCTS: ProductItem[] = [
  {
    id: 1,
    title: "M4A1-S",
    subtitle: "Royal Legion",
    game: "BS",
    price: 1.256,
    suggestedPrice: 69.97,
    wear: "Battle-Scarred",
    wearValue: "0.031844",
    daysLeft: "5 days",
    isLocked: true,
    image:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=900&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "M4A1-S",
    subtitle: "Royal Legion",
    game: "BS",
    price: 1.256,
    suggestedPrice: 69.97,
    wear: "Battle-Scarred",
    wearValue: "0.031844",
    isNew: true,
    image:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=900&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "M4A1-S",
    subtitle: "Royal Legion",
    game: "BS",
    price: 1.256,
    suggestedPrice: 69.97,
    wear: "Battle-Scarred",
    wearValue: "0.031844",
    daysLeft: "5 days",
    image:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=900&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "M4A1-S",
    subtitle: "Royal Legion",
    game: "BS",
    price: 1.256,
    suggestedPrice: 69.97,
    wear: "Battle-Scarred",
    wearValue: "0.031844",
    daysLeft: "5 days",
    image:
      "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?q=80&w=900&auto=format&fit=crop",
  },
  {
    id: 5,
    title: "M4A1-S",
    subtitle: "Royal Legion",
    game: "BS",
    price: 1.256,
    suggestedPrice: 69.97,
    wear: "Battle-Scarred",
    wearValue: "0.031844",
    daysLeft: "5 days",
    image:
      "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?q=80&w=900&auto=format&fit=crop",
  },
  {
    id: 6,
    title: "M4A1-S",
    subtitle: "Royal Legion",
    game: "BS",
    price: 1.256,
    suggestedPrice: 69.97,
    wear: "Battle-Scarred",
    wearValue: "0.031844",
    isNew: true,
    image:
      "https://images.unsplash.com/photo-1511882150382-421056c89033?q=80&w=900&auto=format&fit=crop",
  },
  {
    id: 7,
    title: "M4A1-S",
    subtitle: "Royal Legion",
    game: "BS",
    price: 1.256,
    suggestedPrice: 69.97,
    wear: "Battle-Scarred",
    wearValue: "0.031844",
    daysLeft: "5 days",
    image:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=900&auto=format&fit=crop",
  },
  {
    id: 8,
    title: "M4A1-S",
    subtitle: "Royal Legion",
    game: "BS",
    price: 1.256,
    suggestedPrice: 69.97,
    wear: "Battle-Scarred",
    wearValue: "0.031844",
    daysLeft: "5 days",
    image:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=900&auto=format&fit=crop",
  },
];

function useCountdown(targetDate: Date | null) {
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    if (!targetDate) return;

    const update = () => {
      setTimeLeft(getTimeLeft(targetDate));
    };

    update();
    const timer = setInterval(update, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
}

function getTimeLeft(targetDate: Date) {
  const now = Date.now();
  const distance = targetDate.getTime() - now;

  if (distance <= 0) {
    return { days: "00", hours: "00", minutes: "00", seconds: "00" };
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((distance / (1000 * 60)) % 60);
  const seconds = Math.floor((distance / 1000) % 60);

  return {
    days: String(days).padStart(2, "0"),
    hours: String(hours).padStart(2, "0"),
    minutes: String(minutes).padStart(2, "0"),
    seconds: String(seconds).padStart(2, "0"),
  };
}

function money(value: number) {
  return `$${value.toFixed(3)}`;
}

export default function MarketplacePage() {
  const [search, setSearch] = useState("");
  const [selectedGame, setSelectedGame] = useState("All");
  const [mounted, setMounted] = useState(false);
  const [targetDate, setTargetDate] = useState<Date | null>(null);

  useEffect(() => {
    setMounted(true);

    const d = new Date();
    d.setDate(d.getDate() + 5);
    d.setHours(d.getHours() + 8);
    d.setMinutes(d.getMinutes() + 52);
    d.setSeconds(d.getSeconds() + 26);

    setTargetDate(d);
  }, []);

  const countdown = useCountdown(targetDate);

  const filteredProducts = useMemo(() => {
    let items = [...PRODUCTS];

    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.subtitle.toLowerCase().includes(q) ||
          item.wear.toLowerCase().includes(q)
      );
    }

    if (selectedGame !== "All") {
      items = items.filter((item) => item.game === selectedGame);
    }

    return items;
  }, [search, selectedGame]);

  return (
    <main className="min-h-screen bg-[#07090d] text-white">
      <div className="mx-auto max-w-[1600px]">
        <TopNav />
        <TrustBar />
        <PromoStrip />

        <section className="relative overflow-hidden border-b border-white/5 bg-[#0a0d12]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_35%,rgba(255,50,70,0.18),transparent_18%),radial-gradient(circle_at_35%_45%,rgba(255,255,255,0.04),transparent_22%),linear-gradient(180deg,#07090d_0%,#0a0d12_100%)]" />
          <div className="absolute inset-0 opacity-[0.18] [background-image:linear-gradient(to_right,transparent,rgba(255,255,255,.04),transparent)]" />

          <div className="relative grid min-h-[420px] grid-cols-1 gap-8 px-6 py-10 lg:grid-cols-[1.02fr_1fr] lg:px-12 xl:px-16">
            <div className="flex flex-col justify-center">
              <h1 className="text-[38px] font-black uppercase tracking-[-0.03em] text-white sm:text-[52px]">
                New Daily Giveaway
              </h1>

              <div className="mt-5 flex flex-wrap gap-2 sm:gap-3">
                <TimeBox value={mounted ? countdown.days : "00"} label="Days" />
                <TimeBox value={mounted ? countdown.hours : "00"} label="Hours" />
                <TimeBox value={mounted ? countdown.minutes : "00"} label="Minutes" />
                <TimeBox value={mounted ? countdown.seconds : "00"} label="Seconds" />
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-4">
                <button className="rounded-md bg-[#ff2d45] px-6 py-3 text-sm font-extrabold text-white transition hover:bg-[#ff3f56]">
                  Enter the giveaway
                </button>

                <div className="flex -space-x-2">
                  {["#4c6fff", "#9557ff", "#00d084", "#ffbf00", "#ff7a00"].map(
                    (color, i) => (
                      <div
                        key={i}
                        className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#0a0d12] text-[11px] font-bold text-white"
                        style={{ backgroundColor: color }}
                      >
                        {i === 4 ? "+32" : ""}
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            <div className="relative hidden items-center justify-center lg:flex">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent_55%)]" />
              <div className="absolute left-[8%] top-[18%] h-[220px] w-[220px] rounded-full bg-[#ff2d45]/10 blur-3xl" />
              <div className="absolute right-[8%] bottom-[10%] h-[180px] w-[180px] rounded-full bg-[#ff2d45]/10 blur-3xl" />

              <img
                src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1400&auto=format&fit=crop"
                alt="Featured item"
                className="relative z-10 max-h-[300px] w-auto rounded-xl object-contain shadow-[0_30px_80px_rgba(0,0,0,0.55)]"
              />

              <div className="absolute left-[12%] top-[22%] text-right">
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#ff4c61]">
                  M4A1-S
                </div>
                <div className="mt-1 text-[26px] font-black text-white">$15.25</div>
              </div>

              <div className="absolute bottom-[20%] left-[20%]">
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#ff4c61]">
                  M4A1-S
                </div>
                <div className="mt-1 text-[24px] font-black uppercase text-white">
                  Royal Legion
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-10 lg:px-12 xl:px-16">
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 className="text-[26px] font-black uppercase tracking-[-0.02em] text-white">
              Recently Sold
            </h2>

            <div className="hidden text-xs font-bold uppercase tracking-[0.18em] text-white/45 sm:block">
              Live marketplace activity
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
            {SOLD_ITEMS.map((item) => (
              <div
                key={item.id}
                className="group overflow-hidden rounded-md border border-white/10 bg-[linear-gradient(180deg,#12161d_0%,#0b0e13_100%)] transition hover:border-white/20 hover:bg-[linear-gradient(180deg,#151a23_0%,#0d1117_100%)]"
              >
                <div className="relative h-[120px] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover opacity-90 transition duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                  <div className="absolute left-3 top-3 text-[13px] font-bold text-white">
                    ${item.price.toFixed(2)}
                  </div>
                  <div className="absolute right-3 top-3 text-[11px] font-bold uppercase text-white/60">
                    BS
                  </div>
                </div>

                <div className="px-3 pb-3 pt-2">
                  <div className="text-sm font-bold text-white">{item.title}</div>
                  <div className="mt-1 text-xs text-white/55">{item.ago}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="px-6 pb-12 lg:px-12 xl:px-16">
          <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search items"
                className="h-11 w-full rounded-md border border-white/10 bg-[#10141b] px-4 text-sm text-white outline-none placeholder:text-white/35 focus:border-[#ff2d45] sm:w-[260px]"
              />

              <select
                value={selectedGame}
                onChange={(e) => setSelectedGame(e.target.value)}
                className="h-11 rounded-md border border-white/10 bg-[#10141b] px-4 text-sm text-white outline-none focus:border-[#ff2d45]"
              >
                <option value="All">All games</option>
                <option value="BS">BS</option>
              </select>
            </div>

            <div className="text-xs font-bold uppercase tracking-[0.18em] text-white/40">
              {filteredProducts.length} items listed
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[380px_minmax(0,1fr)]">
            <PromoMarketplaceCard />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
              {filteredProducts.map((item) => (
                <ProductCard key={item.id} item={item} />
              ))}
            </div>
          </div>

          {filteredProducts.length === 0 && (
            <div className="mt-6 rounded-md border border-white/10 bg-[#0f1319] px-5 py-6 text-sm text-white/60">
              No items found.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function TopNav() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-[#0b0d11]/95 backdrop-blur">
      <div className="flex min-h-[74px] items-center justify-between px-6 lg:px-12 xl:px-16">
        <div className="flex items-center gap-10">
          <div className="text-[20px] font-black lowercase tracking-[-0.03em] text-white">
            <span className="text-[#ff3148]">ad</span>urite
          </div>

          <nav className="hidden items-center gap-10 md:flex">
            {["Market", "Support", "History", "Affiliate", "Claims"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-[15px] font-medium text-white/80 transition hover:text-white"
              >
                {item}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button className="hidden rounded-md border border-[#ff3148]/70 px-4 py-2 text-sm font-bold text-white transition hover:bg-[#ff3148]/10 md:block">
            Join Discord
          </button>
          <button className="rounded-md bg-[#ff3148] px-5 py-2 text-sm font-extrabold text-white transition hover:bg-[#ff4258]">
            Log in
          </button>
        </div>
      </div>
    </header>
  );
}

function TrustBar() {
  return (
    <div className="border-b border-white/5 bg-[#12161d] px-6 py-3 text-center text-sm text-white/75 lg:px-12 xl:px-16">
      <span className="font-semibold text-white/90">Our customers say</span>
      <span className="mx-3 inline-flex gap-1 align-middle">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className="inline-flex h-5 w-5 items-center justify-center rounded-sm bg-[#ff3148] text-[11px] font-black text-white"
          >
            ★
          </span>
        ))}
      </span>
      <span className="font-semibold text-white">5.0 out of 5</span>
      <span className="mx-2 text-white/45">based on 4,546 reviews</span>
      <span className="font-semibold text-[#00d084]">Trustpilot</span>
    </div>
  );
}

function PromoStrip() {
  return (
    <div className="bg-[#ff2740] px-6 py-2 text-center text-[12px] font-black uppercase tracking-[0.12em] text-white lg:px-12 xl:px-16">
      Sell your limiteds & rs for gift cards from Amazon, Roblox, Chipotle &
      more by selling on Adurite!
    </div>
  );
}

function TimeBox({ value, label }: { value: string; label: string }) {
  return (
    <div className="min-w-[78px] rounded-md border border-[#ff6275]/40 bg-[#ff2d45] px-3 py-3 text-center shadow-[0_8px_30px_rgba(255,45,69,0.22)]">
      <div className="text-[34px] font-black leading-none tracking-[-0.05em] text-white">
        {value}
      </div>
      <div className="mt-2 text-[11px] font-medium text-white/80">{label}</div>
    </div>
  );
}

function PromoMarketplaceCard() {
  return (
    <div className="relative overflow-hidden rounded-md border border-[#ff5063]/20 bg-[linear-gradient(180deg,#ff2b45_0%,#db1738_100%)] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.3)]">
      <div className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute -right-10 top-8 h-48 w-48 rounded-full bg-black/15 blur-3xl" />

      <div className="relative z-10 flex h-full min-h-[370px] flex-col justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-white">
            CS:GO
          </div>

          <div className="mt-8 max-w-[220px] text-[42px] font-black uppercase leading-[0.95] tracking-[-0.04em] text-white/20">
            CSGO
          </div>
        </div>

        <div className="relative mt-4">
          <img
            src="https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=900&auto=format&fit=crop"
            alt="Promo"
            className="mx-auto h-[180px] w-[180px] rounded-xl object-cover shadow-[0_18px_40px_rgba(0,0,0,0.35)]"
          />
        </div>

        <div>
          <div className="max-w-[240px] text-[18px] font-extrabold leading-tight text-white">
            Special CS:GO skins for you
          </div>

          <button className="mt-5 rounded-md bg-[#11141b] px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[#171c24]">
            Go to Marketplace →
          </button>
        </div>
      </div>
    </div>
  );
}

function ProductCard({ item }: { item: ProductItem }) {
  return (
    <div className="group overflow-hidden rounded-md border border-white/10 bg-[linear-gradient(180deg,#141920_0%,#0c0f14_100%)] transition hover:-translate-y-[2px] hover:border-white/20">
      <div className="flex items-center justify-between px-3 pt-3 text-[11px] font-bold uppercase tracking-[0.12em] text-white/45">
        <div className="flex items-center gap-2">
          {item.isLocked ? (
            <span className="inline-flex items-center gap-1 text-white/45">🔒 {item.daysLeft}</span>
          ) : item.isNew ? (
            <span className="inline-flex items-center gap-1 text-[#00d084]">🟢 New</span>
          ) : (
            <span>{item.daysLeft}</span>
          )}
        </div>

        <div className="text-[#ff7a8a]">◔</div>
      </div>

      <div className="relative mt-2 h-[170px] overflow-hidden px-3">
        <img
          src={item.image}
          alt={item.title}
          className="h-full w-full rounded-md object-cover transition duration-300 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-x-3 bottom-0 h-16 rounded-b-md bg-gradient-to-t from-black/35 to-transparent" />
      </div>

      <div className="px-3 pb-3 pt-4">
        <div className="text-[34px] font-black leading-none tracking-[-0.05em] text-white">
          {money(item.price)}
        </div>

        <div className="mt-1 text-sm text-white/35">
          Suggested price: ${item.suggestedPrice.toFixed(2)}
        </div>

        <div className="mt-4 flex items-start justify-between gap-3">
          <div>
            <div className="text-[22px] font-black leading-none text-white">
              {item.title}
            </div>
            <div className="mt-1 text-[15px] font-medium text-white/78">
              {item.subtitle}
            </div>
          </div>

          <div className="pt-1 text-[12px] font-black uppercase text-white/55">
            {item.game}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <div className="h-[4px] flex-1 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-[42%] rounded-full bg-[#34d399]" />
          </div>
          <div className="h-[4px] flex-1 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-[58%] rounded-full bg-[#ff6b6b]" />
          </div>
          <div className="text-[11px] text-white/55">{item.wearValue}</div>
        </div>

        <div className="mt-3 text-sm text-white/68">{item.wear}</div>

        <button className="mt-4 h-11 w-full rounded-md border border-white/20 bg-transparent text-sm font-extrabold text-white transition hover:border-white/35 hover:bg-white/5">
          Add to Cart
        </button>
      </div>
    </div>
  );
}