"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/lib/context";
import { getDaysUntilRamazan, getNextPrayer, getDayProgress } from "@/lib/data";
import { getDailyHadis, getDailyIfterDua, getSahurDua } from "@/lib/duas";
import { Calendar, MapPin, Clock, ArrowRight, Quote, BookOpen, Loader2 } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const { city, district, userName, prayerTimes } = useApp();
  const [daysLeft, setDaysLeft] = useState(0);
  const [nextPrayer, setNextPrayer] = useState({ name: "", time: "", remaining: "" });
  const [countdown, setCountdown] = useState("00:00:00");
  const [progress, setProgress] = useState(0);
  const [dailyHadis, setDailyHadis] = useState<{ id: number; text: string; kaynak: string } | null>(null);
  const [activeDua, setActiveDua] = useState<{ title: string; arabic: string; turkish: string } | null>(null);
  const [mounted, setMounted] = useState(false);

  const isLoading = !prayerTimes || prayerTimes.imsak === "--:--";

  useEffect(() => {
    setMounted(true);
    setDaysLeft(getDaysUntilRamazan(new Date()));
    setDailyHadis(getDailyHadis());
  }, []);

  // Saniye bazlı geri sayım ve veri güncelleme
  useEffect(() => {
    const updateTimer = () => {
      if (!prayerTimes || prayerTimes.imsak === "--:--") return;

      const next = getNextPrayer(prayerTimes);
      setNextPrayer(next);
      setProgress(getDayProgress(prayerTimes));

      // Dua Logic
      if (next.name === "İmsak") {
        setActiveDua(getSahurDua());
      } else {
        setActiveDua(getDailyIfterDua());
      }

      // Saniye Hesabı (Countdown)
      const now = new Date();
      const [targetH, targetM] = next.time.split(":").map(Number);
      let targetTime = new Date();
      targetTime.setHours(targetH, targetM, 0, 0);

      // Eğer hedef zaman geçmişteyse (örn: yatsıdan sonra imsak ertesi gün)
      if (targetTime < now) {
        targetTime.setDate(targetTime.getDate() + 1);
      }

      const diff = targetTime.getTime() - now.getTime();
      if (diff > 0) {
        const h = Math.floor(diff / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);
        setCountdown(
          `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
        );
      } else {
        setCountdown("00:00:00");
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [prayerTimes]);

  if (!mounted) return null;

  // Kişiselleştirilmiş Selamlama
  const getGreeting = () => {
    const hour = new Date().getHours();
    let timeGreeting = "Hayırlı Günler";
    if (hour >= 5 && hour < 12) timeGreeting = "Hayırlı Sabahlar";
    else if (hour >= 12 && hour < 17) timeGreeting = "Tünaydın";
    else if (hour >= 17 && hour < 22) timeGreeting = "Hayırlı Akşamlar";
    else timeGreeting = "Hayırlı Geceler";

    if (userName) return `Merhaba ${userName}`;
    return "Hoş Geldin";
  };

  const locationDisplay = district ? `${district}, ${city.name}` : city.name;

  return (
    <div className="space-y-12 pb-10">
      {/* Hero Section */}
      <section className="relative rounded-[2rem] overflow-hidden p-8 md:p-12 hero-gradient animate-fade-in-up shadow-2xl shadow-primary/20">
        {/* Background Decorations */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, rgba(255,215,0,0.3) 0%, transparent 70%)", transform: "translate(30%, -30%)" }}></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)", transform: "translate(-20%, 20%)" }}></div>

        <div className="relative z-10 w-full pt-4 md:pt-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 md:mb-10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20 shadow-xl overflow-hidden animate-pulse">
                  <img src="/logo.svg" alt="Logo" className="w-10 h-10 object-contain" />
                </div>
                <h2 className="text-white text-2xl md:text-4xl font-bold font-poppins tracking-tight">
                  {getGreeting()}
                </h2>
              </div>
              <p className="text-green-100 text-base font-medium opacity-90 pl-1">Allah kabul etsin</p>
            </div>

            <Link href="/ayarlar" className="self-start md:self-auto">
              <button className="flex items-center gap-3 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all hover:bg-white/20 hover:scale-105 active:scale-95"
                style={{ background: "rgba(255, 255, 255, 0.15)", border: "1px solid rgba(255, 255, 255, 0.2)", color: "white", backdropFilter: "blur(10px)" }}>
                <MapPin size={16} />
                <span className="uppercase tracking-wide">{locationDisplay}</span>
              </button>
            </Link>
          </div>

          <div className="flex flex-col items-center justify-center text-center py-6">
            {isLoading ? (
              <div className="flex flex-col items-center gap-4 text-white/80 py-10">
                <Loader2 size={40} className="animate-spin text-yellow-300" />
                <span className="text-sm font-medium tracking-[0.2em] uppercase">Vakitler Hesaplanıyor...</span>
              </div>
            ) : (
              <>
                <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 mb-6 animate-fade-in-up">
                  <Clock size={14} className="text-yellow-300" />
                  <span className="text-green-50 text-xs font-bold uppercase tracking-[0.15em]">
                    {nextPrayer.name} Vaktine Kalan
                  </span>
                </div>

                <div className="relative mb-8 group cursor-default">
                  <div className="absolute -inset-8 bg-primary/30 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  <p className="relative text-white text-6xl md:text-8xl lg:text-9xl font-bold font-mono tracking-tighter tabular-nums leading-none select-none text-shadow-xl drop-shadow-2xl">
                    {countdown}
                  </p>
                </div>

                <p className="text-green-200/90 text-sm md:text-base font-medium mt-2 animate-fade-in-up stagger-1">
                  {locationDisplay} için {nextPrayer.name} Vakti: <span className="text-white font-bold text-lg ml-1">{nextPrayer.time}</span>
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Prayer Times Section */}
      <section className="animate-fade-in-up stagger-2">
        <div className="flex items-center justify-between mb-6 px-1">
          <h2 className="text-xl font-bold flex items-center gap-3 font-poppins text-primary">
            <Clock size={22} className="text-primary" />
            Namaz Vakitleri
          </h2>
          <Link href="/imsakiye" className="flex items-center gap-1 text-sm font-semibold text-primary/80 hover:text-primary transition-colors hover:underline decoration-2 underline-offset-4">
            İmsakiye
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {isLoading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="prayer-card flex flex-col items-center justify-center py-6 bg-muted/5 animate-pulse rounded-2xl h-32">
                <div className="h-4 w-16 bg-muted rounded mb-3"></div>
                <div className="h-8 w-24 bg-muted rounded"></div>
              </div>
            ))
          ) : (
            Object.entries(prayerTimes).map(([key, time], index) => {
              const keyMap: Record<string, string> = {
                "İmsak": "imsak", "Güneş": "gunes", "Öğle": "ogle",
                "İkindi": "ikindi", "Akşam": "aksam", "Yatsı": "yatsi"
              };
              const activeKey = keyMap[nextPrayer.name] || "";
              const isActive = key === activeKey;

              const labels: Record<string, string> = { imsak: "İmsak", gunes: "Güneş", ogle: "Öğle", ikindi: "İkindi", aksam: "Akşam", yatsi: "Yatsı" };

              return (
                <div key={key} className={`prayer-card flex flex-col items-center justify-center p-6 rounded-2xl transition-all duration-300 ${isActive ? "active scale-[1.03] ring-2 ring-primary bg-primary/5 shadow-xl shadow-primary/10 z-10" : "hover:bg-muted/5"}`}>
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">{labels[key]}</span>
                  <span className={`text-2xl md:text-3xl font-bold font-mono tracking-tight ${isActive ? "text-primary" : "text-foreground"}`}>{time}</span>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Daily Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Progress Card */}
        <div className="animate-fade-in-up stagger-3">
          <div className="glass-card p-6 md:p-8 rounded-2xl border border-white/5 shadow-xl hover:shadow-2xl transition-all space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold font-poppins text-foreground mb-1">Oruç İlerlemesi</h3>
                <p className="text-sm text-muted-foreground font-medium">İmsak - Akşam Arası</p>
              </div>
              <div className="text-right bg-primary/10 px-4 py-2 rounded-xl flex-shrink-0 ml-4">
                <span className="text-2xl md:text-3xl font-bold font-mono text-primary">%{progress}</span>
              </div>
            </div>

            <div>
              <div className="progress-bar h-4 rounded-full bg-muted/30 overflow-hidden shadow-inner mb-6">
                <div className="progress-bar-fill h-full bg-gradient-to-r from-green-600 to-green-400 transition-all duration-1000 ease-out relative shadow-[0_0_20px_rgba(34,197,94,0.4)]" style={{ width: `${progress}%` }}>
                  <div className="absolute top-0 right-0 bottom-0 w-[2px] bg-white opacity-50 shadow-[0_0_10px_white]"></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col p-3 rounded-xl bg-muted/5 border border-white/5">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-muted-foreground text-[10px] uppercase tracking-wider font-bold">Başlangıç</span>
                  </div>
                  <span className="font-mono font-bold text-xl text-foreground">{prayerTimes.imsak}</span>
                  <span className="text-[10px] text-muted-foreground">İmsak</span>
                </div>
                <div className="flex flex-col p-3 rounded-xl bg-muted/5 border border-white/5 items-end text-right">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-muted-foreground text-[10px] uppercase tracking-wider font-bold">Bitiş</span>
                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  </div>
                  <span className="font-mono font-bold text-xl text-foreground">{prayerTimes.aksam}</span>
                  <span className="text-[10px] text-muted-foreground">Akşam</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dua & Hadis */}
        <div className="animate-fade-in-up stagger-4 space-y-6">
          {activeDua && (
            <div className="glass-card p-6 md:p-8 border-l-[6px] border-l-green-500 relative overflow-hidden group rounded-2xl shadow-lg hover:translate-y-[-2px] transition-transform">
              <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity rotate-12 scale-150 pointer-events-none">
                <BookOpen size={120} />
              </div>
              <div className="flex items-center gap-3 mb-4 text-green-500 relative z-10">
                <div className="bg-green-500/10 p-2 rounded-lg">
                  <BookOpen size={20} />
                </div>
                <h3 className="font-bold text-base uppercase tracking-wider">{activeDua.title}</h3>
              </div>
              <p className="text-xl md:text-2xl font-medium leading-relaxed italic text-foreground/90 relative z-10 font-serif border-l-2 border-green-500/20 pl-4 my-2">
                "{activeDua.turkish}"
              </p>
            </div>
          )}

          {dailyHadis && (
            <div className="glass-card p-6 md:p-8 border-l-[6px] border-l-yellow-500 relative overflow-hidden group rounded-2xl shadow-lg hover:translate-y-[-2px] transition-transform">
              <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity rotate-12 scale-150 pointer-events-none">
                <Quote size={120} />
              </div>
              <div className="flex items-center gap-3 mb-4 text-yellow-500 relative z-10">
                <div className="bg-yellow-500/10 p-2 rounded-lg">
                  <Quote size={20} />
                </div>
                <h3 className="font-bold text-base uppercase tracking-wider">Günün Hadisi</h3>
              </div>
              <p className="text-lg text-foreground/80 relative z-10 leading-relaxed">"{dailyHadis.text}"</p>
              <div className="mt-4 text-sm text-muted-foreground font-bold text-right relative z-10 flex items-center justify-end gap-2">
                <span className="w-8 h-[2px] bg-border/50 inline-block rounded-full"></span>
                {dailyHadis.kaynak}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Links */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 animate-fade-in-up stagger-5">
        <Link href="/tesbih" className="no-underline group">
          <div className="prayer-card text-center py-6 cursor-pointer hover:bg-primary/5 transition-all group-hover:-translate-y-2 group-hover:shadow-primary/20">
            <span className="text-3xl mb-3 block group-hover:scale-110 transition-transform">📿</span>
            <h3 className="text-sm font-bold mb-1 font-poppins text-primary">Tesbih</h3>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Zikirmatik</p>
          </div>
        </Link>
        <Link href="/dua" className="no-underline group">
          <div className="prayer-card text-center py-6 cursor-pointer hover:bg-primary/5 transition-all group-hover:-translate-y-2 group-hover:shadow-primary/20">
            <span className="text-3xl mb-3 block group-hover:scale-110 transition-transform">📖</span>
            <h3 className="text-sm font-bold mb-1 font-poppins text-primary">Dualar</h3>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">İftar & Sahur</p>
          </div>
        </Link>
        <Link href="/hadis" className="no-underline group">
          <div className="prayer-card text-center py-6 cursor-pointer hover:bg-primary/5 transition-all group-hover:-translate-y-2 group-hover:shadow-primary/20">
            <span className="text-3xl mb-3 block group-hover:scale-110 transition-transform">📜</span>
            <h3 className="text-sm font-bold mb-1 font-poppins text-primary">Hadisler</h3>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Günün Sözü</p>
          </div>
        </Link>
        <Link href="/imsakiye" className="no-underline group">
          <div className="prayer-card text-center py-6 cursor-pointer hover:bg-primary/5 transition-all group-hover:-translate-y-2 group-hover:shadow-primary/20">
            <span className="text-3xl mb-3 block group-hover:scale-110 transition-transform">📅</span>
            <h3 className="text-sm font-bold mb-1 font-poppins text-primary">İmsakiye</h3>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Aylık Takvim</p>
          </div>
        </Link>
      </section>
    </div>
  );
}
