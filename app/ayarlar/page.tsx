"use client";

import { useState } from "react";
import { useApp } from "@/lib/context";
import { CITIES } from "@/lib/data";
import {
    Settings, Moon, Sun, Monitor, MapPin, Bell, Info,
    Volume2, VolumeX, Heart, ChevronRight, Search, X, Check,
    Trash2
} from "lucide-react";

export default function SettingsPage() {
    const { city, setCity, theme, setTheme, notifications, setNotifications, ezanSound, setEzanSound } = useApp();
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    const filteredCities = CITIES.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleNotificationToggle = () => {
        if (!notifications && "Notification" in window) {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    setNotifications(true);
                    new Notification("İftar Vakti", { body: "Bildirimler başarıyla açıldı." });
                } else {
                    alert("Bildirim izni reddedildi. Ayarlardan izin verin.");
                }
            });
        } else {
            setNotifications(!notifications);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8 pb-20 pt-6">
            {/* Header */}
            <div className="animate-fade-in-up">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3 font-poppins">
                    <Settings className="text-primary" size={32} />
                    Ayarlar
                </h1>
                <p className="text-gray-400 mt-2">Uygulama tercihlerinizi kişiselleştirin.</p>
            </div>

            {/* Appearance Card */}
            <section className="animate-fade-in-up stagger-1 space-y-3">
                <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Görünüm</h2>
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-1.5 flex relative">
                    {/* Segmented Control */}
                    {['light', 'dark', 'auto'].map((t) => (
                        <button
                            key={t}
                            onClick={() => setTheme(t as any)}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${theme === t ? 'bg-gradient-to-r from-[#6C63FF] to-[#8B5CF6] text-white shadow-lg shadow-purple-900/20' : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {t === 'light' && <Sun size={18} />}
                            {t === 'dark' && <Moon size={18} />}
                            {t === 'auto' && <Monitor size={18} />}
                            <span className="capitalize hidden sm:inline">{t === 'auto' ? 'Otomatik' : t === 'light' ? 'Açık' : 'Koyu'}</span>
                        </button>
                    ))}
                </div>
            </section>

            {/* Region/Location Card */}
            <section className="animate-fade-in-up stagger-2 space-y-3 relative z-30">
                <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Konum</h2>
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 relative">
                    {/* Search Input */}
                    <div className="relative z-30">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                        <input
                            type="text"
                            placeholder="Şehir ara..."
                            value={searchQuery}
                            onFocus={() => setIsSearchFocused(true)}
                            // Delay blur slightly to allow clicking on results
                            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-black/20 border border-white/10 rounded-xl h-12 pl-12 pr-10 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#6C63FF]/50 focus:ring-1 focus:ring-[#6C63FF]/50 transition-all backdrop-blur-sm"
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white p-1">
                                <X size={16} />
                            </button>
                        )}

                        {/* Dropdown Results */}
                        {(isSearchFocused || searchQuery.length > 0) && (
                            <div className="absolute top-full left-0 right-0 mt-3 bg-[#1a1a2e] border border-white/10 rounded-xl shadow-2xl max-h-60 overflow-y-auto z-50 custom-scrollbar ring-1 ring-black/50">
                                {filteredCities.length > 0 ? filteredCities.map(c => (
                                    <button
                                        key={c.id}
                                        onMouseDown={(e) => { e.preventDefault(); setCity(c); setSearchQuery(""); setIsSearchFocused(false); }}
                                        className={`w-full flex items-center justify-between px-4 py-3.5 text-left border-b border-white/5 last:border-none hover:bg-white/5 transition-colors ${city.id === c.id ? "bg-[#6C63FF]/10 text-[#6C63FF]" : "text-gray-300"}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <MapPin size={16} className={city.id === c.id ? "text-[#6C63FF]" : "text-gray-500"} />
                                            <span className="font-medium text-sm">{c.name}</span>
                                        </div>
                                        {city.id === c.id && <Check size={16} />}
                                    </button>
                                )) : (
                                    <div className="p-6 text-center text-gray-500 text-sm">Şehir bulunamadı</div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Current Selection Display (Visual Only) */}
                    <div className="mt-4 flex items-center gap-3 text-sm text-gray-400 bg-white/[0.02] p-3 rounded-xl border border-white/[0.05]">
                        <div className="w-2 h-2 rounded-full bg-[#10B981] shadow-[0_0_10px_#10B981]"></div>
                        <span>Seçili Konum: <span className="text-white font-medium ml-1">{city.name}</span></span>
                    </div>
                </div>
            </section>

            {/* Preferences (Notifications, Sound) */}
            <section className="animate-fade-in-up stagger-3 space-y-3">
                <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Tercihler</h2>
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl overflow-hidden divide-y divide-white/[0.06]">
                    {/* Notification Row */}
                    <div className="p-4 sm:p-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 ring-1 ring-orange-500/20">
                                <Bell size={20} />
                            </div>
                            <div>
                                <h3 className="text-white font-medium text-sm sm:text-base">Bildirimler</h3>
                                <p className="text-xs text-gray-400 mt-0.5">Vakit geldiğinde uyarı al</p>
                            </div>
                        </div>
                        <ToggleButton checked={notifications} onChange={handleNotificationToggle} activeColor="bg-[#6C63FF]" />
                    </div>

                    {/* Sound Row */}
                    <div className="p-4 sm:p-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-500 ring-1 ring-cyan-500/20">
                                {ezanSound ? <Volume2 size={20} /> : <VolumeX size={20} />}
                            </div>
                            <div>
                                <h3 className="text-white font-medium text-sm sm:text-base">Ezan Sesi</h3>
                                <p className="text-xs text-gray-400 mt-0.5">Vakitlerde ezan oku</p>
                            </div>
                        </div>
                        <ToggleButton checked={ezanSound} onChange={() => setEzanSound(!ezanSound)} activeColor="bg-[#6C63FF]" />
                    </div>
                </div>
            </section>

            {/* Info & Reset */}
            <section className="animate-fade-in-up stagger-4 space-y-3">
                <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Hakkında</h2>
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl overflow-hidden p-5 space-y-4">
                    <InfoRow label="Sürüm" value="1.2.0 (Premium)" />
                    <InfoRow label="Geliştirici" value="Next.js & Tailwind" />
                    <InfoRow label="Veri Kaynağı" value="Aladhan API" />

                    <div className="pt-4 mt-2 border-t border-white/[0.06]">
                        <button
                            onClick={() => {
                                if (confirm("Tüm kişisel verileriniz (isim, konum, tercihler) silinecek. Onaylıyor musunuz?")) {
                                    localStorage.clear();
                                    window.location.href = "/";
                                }
                            }}
                            className="w-full group flex items-center justify-center gap-2 py-3 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50 transition-all text-sm font-medium"
                        >
                            <Trash2 size={16} />
                            Uygulamayı Sıfırla
                        </button>
                    </div>
                </div>

                <p className="text-center text-[10px] text-gray-600 pt-6 flex items-center justify-center gap-1 uppercase tracking-widest">
                    Made with <Heart size={10} className="text-red-900 fill-current" /> by İftar Vakti
                </p>
            </section>
        </div>
    );
}

// Helper Components
function ToggleButton({ checked, onChange, activeColor = "bg-[#10B981]" }: { checked: boolean; onChange: () => void, activeColor?: string }) {
    return (
        <button
            onClick={onChange}
            className={`w-[50px] h-[28px] rounded-full relative transition-all duration-300 focus:outline-none ${checked ? activeColor : "bg-gray-700"
                }`}
        >
            <div className={`absolute top-[2px] w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 ${checked ? "translate-x-[24px]" : "translate-x-[2px]"
                }`} />
        </button>
    );
}

function InfoRow({ label, value }: { label: string, value: string }) {
    return (
        <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 font-medium">{label}</span>
            <span className="text-gray-300 font-medium font-mono text-xs">{value}</span>
        </div>
    );
}
