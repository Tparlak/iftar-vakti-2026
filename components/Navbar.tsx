"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Moon, House, Calendar, Compass, BookOpen, Settings, Download, Activity, User } from "lucide-react";
import { useApp } from "@/lib/context";

const navItems = [
    { href: "/", label: "Ana Sayfa", icon: House },
    { href: "/imsakiye", label: "İmsakiye", icon: Calendar },
    { href: "/tesbih", label: "Tesbih", icon: Activity },
    { href: "/dua", label: "Dualar", icon: BookOpen },
    { href: "/hadis", label: "Hadisler", icon: BookOpen },
    { href: "/ayarlar", label: "Ayarlar", icon: Settings },
];

export function Navbar() {
    const pathname = usePathname();
    const { userName, city } = useApp();
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showInstallBtn, setShowInstallBtn] = useState(false);

    useEffect(() => {
        const handler = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowInstallBtn(true);
        };
        window.addEventListener("beforeinstallprompt", handler);
        return () => window.removeEventListener("beforeinstallprompt", handler);
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === "accepted") {
            setShowInstallBtn(false);
        }
        setDeferredPrompt(null);
    };

    return (
        <>
            {/* Desktop & Mobile Header */}
            <nav className="fixed top-0 left-0 right-0 z-[1000] h-16 border-b border-white/10 bg-[#1a1a2e]/80 backdrop-blur-xl transition-all duration-300 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300 shadow-lg shadow-primary/20 overflow-hidden"
                            style={{ background: "rgba(30,126,52,0.1)" }}>
                            <img src="/logo.svg" alt="İftar Vakti Logo" className="w-8 h-8 object-contain transform group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="font-bold text-xl tracking-tight text-white" style={{ fontFamily: "Poppins, sans-serif" }}>
                                İftar<span style={{ color: "var(--primary)" }}>Vakti</span>
                            </span>
                            {userName ? (
                                <span className="text-[10px] text-green-400 font-medium tracking-wide uppercase opacity-90 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                    {userName} • {city.name}
                                </span>
                            ) : (
                                <span className="text-[10px] text-gray-400 font-medium tracking-widest uppercase opacity-60 group-hover:opacity-100 transition-opacity">
                                    Ramazan 2026
                                </span>
                            )}
                        </div>
                    </Link>

                    <div className="flex items-center gap-4">
                        {/* Desktop Nav Links */}
                        <div className="hidden md:flex items-center gap-1">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                                            ? "text-primary shadow-sm bg-primary/10"
                                            : "text-gray-400 hover:text-white hover:bg-white/5"
                                            }`}
                                        style={isActive ? { color: "var(--primary)" } : {}}
                                    >
                                        <item.icon size={18} />
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Install Button - Visible on Mobile & Desktop */}
                        {showInstallBtn && (
                            <button
                                onClick={handleInstall}
                                className="flex items-center gap-2 bg-primary text-white hover:bg-green-700 px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-[10px] md:text-xs font-bold transition-all shadow-lg hover:shadow-primary/30 animate-pulse"
                            >
                                <Download size={14} className="md:w-4 md:h-4" />
                                <span>Yükle</span>
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            {/* Mobile Bottom Nav */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[1000] bg-[#0f1117]/95 backdrop-blur-2xl border-t border-white/10 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
                <div className="flex items-center justify-around h-16 sm:h-20">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex flex-col items-center justify-center w-full h-full py-2 transition-all duration-300 ${isActive ? "text-primary scale-105" : "text-gray-500 hover:text-gray-300"
                                    }`}
                                style={isActive ? { color: "var(--primary)" } : {}}
                            >
                                <div className={`p-2 rounded-2xl transition-all duration-500 ${isActive ? "shadow-[0_0_20px_rgba(30,126,52,0.3)] bg-primary/20" : ""}`}>
                                    <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                                </div>
                                <span className={`text-[9px] font-bold tracking-tighter transition-colors mt-1 ${isActive ? "opacity-100" : "opacity-60"}`}
                                    style={isActive ? { color: "var(--primary)" } : {}}>
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </>
    );
}
