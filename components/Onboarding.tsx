"use client";

import { useState, useEffect } from "react";
import { useApp } from "@/lib/context";
import { CITIES } from "@/lib/data";
import { DISTRICTS } from "@/lib/districts";
import { ArrowRight, MapPin, User, Check } from "lucide-react";

export function Onboarding() {
    const { userName, setUserName, setCity, setDistrict } = useApp();
    const [step, setStep] = useState(1);
    const [nameInput, setNameInput] = useState("");
    const [selectedCityName, setSelectedCityName] = useState("İstanbul");
    const [districtInput, setDistrictInput] = useState("");
    const [isVisible, setIsVisible] = useState(false);

    // Eğer kullanıcı adı zaten varsa (veya yüklendiyse) onboarding'i gösterme
    useEffect(() => {
        // Sadece client-side render sonrası ve isim boşsa göster
        // Ancak localStorage'dan okuma biraz zaman alabilir, o yüzden
        // Context'in loading durumunu beklemek en doğrusu olurdu.
        // Şimdilik basit bir gecikme veya Context'in initialize olmasını bekliyoruz.
        const timer = setTimeout(() => {
            if (!userName) {
                setIsVisible(true);
            }
        }, 100);
        return () => clearTimeout(timer);
    }, [userName]);

    // Şehir değişince ilçeyi sıfırla
    useEffect(() => {
        setDistrictInput("");
    }, [selectedCityName]);

    if (userName || !isVisible) return null;

    const handleNext = () => {
        if (step === 1 && nameInput.trim().length > 0) {
            setStep(2);
        } else if (step === 2) {
            handleFinish();
        }
    };

    const handleFinish = () => {
        const city = CITIES.find(c => c.name === selectedCityName) || CITIES[34];
        setCity(city);
        // Eğer ilçe seçilmediyse veya "Merkez" ise boş bırakılabilir ama kullanıcı seçtiyse kaydet
        setDistrict(districtInput.trim());
        setUserName(nameInput.trim());

        // Admin Bildirimi (Sessiz)
        try {
            // Placeholder webhook - Gerçek bir endpoint olmadığı için hata vermesin diye try-catch
            fetch("https://example.com/api/log-user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: nameInput,
                    city: selectedCityName,
                    district: districtInput
                })
            }).catch(() => { }); // Hata yut
        } catch (e) { }

        setIsVisible(false);
    };

    const currentDistricts = DISTRICTS[selectedCityName] || [];

    return (
        <div className="fixed inset-0 z-[200] bg-[#0A0A0F] flex items-center justify-center p-4 selection:bg-[#6C63FF]/30">
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#6C63FF] rounded-full opacity-[0.15] blur-[100px]"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
            </div>

            <div className="w-full max-w-lg relative z-10">
                {step === 1 && (
                    <div className="flex flex-col items-center text-center animate-fade-in-up duration-700">
                        {/* Glowing Ring Avatar */}
                        <div className="relative mb-8 group">
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#6C63FF] to-[#A78BFA] rounded-full blur-md opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
                            <div className="relative w-24 h-24 rounded-full p-[2px] bg-gradient-to-tr from-[#6C63FF] to-[#A78BFA]">
                                <div className="w-full h-full bg-[#0A0A0F] rounded-full flex items-center justify-center">
                                    <User size={40} className="text-white/80" />
                                </div>
                            </div>
                        </div>

                        <h2 className="text-4xl font-bold text-white mb-3 tracking-tight font-poppins">Hoş Geldin</h2>
                        <p className="text-[#9CA3AF] text-sm leading-relaxed max-w-xs mx-auto mb-10">
                            Sana özel bir deneyim sunabilmemiz için hitap etmemizi istediğin ismi girer misin?
                        </p>

                        <div className="w-full max-w-sm space-y-6">
                            <input
                                type="text"
                                value={nameInput}
                                onChange={(e) => setNameInput(e.target.value)}
                                placeholder="Adın nedir?"
                                className="w-full bg-white/[0.05] border border-white/10 rounded-2xl px-6 py-4 text-white text-lg placeholder:text-[#6B7280] focus:outline-none focus:border-[#6C63FF] focus:ring-1 focus:ring-[#6C63FF] transition-all text-center"
                                autoFocus
                            />

                            <button
                                onClick={handleNext}
                                disabled={nameInput.trim().length === 0}
                                className="w-full bg-gradient-to-r from-[#6C63FF] to-[#8B5CF6] hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl transition-all transform active:scale-[0.98] shadow-[0_0_20px_rgba(108,99,255,0.4)] flex items-center justify-center gap-2"
                            >
                                Devam Et <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="flex flex-col items-center text-center animate-fade-in-up duration-700">
                        {/* Glowing Ring Avatar (Location) */}
                        <div className="relative mb-8 group">
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#6C63FF] to-[#A78BFA] rounded-full blur-md opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
                            <div className="relative w-24 h-24 rounded-full p-[2px] bg-gradient-to-tr from-[#6C63FF] to-[#A78BFA]">
                                <div className="w-full h-full bg-[#0A0A0F] rounded-full flex items-center justify-center">
                                    <MapPin size={40} className="text-white/80" />
                                </div>
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold text-white mb-3 tracking-tight font-poppins">Konum Seçimi</h2>
                        <p className="text-[#9CA3AF] text-sm leading-relaxed max-w-xs mx-auto mb-10">
                            Namaz vakitlerini doğru hesaplayabilmemiz için bulunduğun şehri ve ilçeyi seç.
                        </p>

                        <div className="w-full max-w-sm space-y-4 text-left">
                            <div className="group">
                                <label className="text-xs font-semibold text-[#6B7280] ml-1 mb-1.5 block uppercase tracking-wider">Şehir</label>
                                <div className="relative">
                                    <select
                                        value={selectedCityName}
                                        onChange={(e) => setSelectedCityName(e.target.value)}
                                        className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-5 py-4 text-white appearance-none focus:border-[#6C63FF] focus:ring-1 focus:ring-[#6C63FF] outline-none transition-all cursor-pointer hover:bg-white/[0.08]"
                                    >
                                        {CITIES.map(c => (
                                            <option key={c.id} value={c.name} className="bg-[#1a1a2e]">{c.name}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[#6B7280]">▼</div>
                                </div>
                            </div>

                            <div className="group">
                                <label className="text-xs font-semibold text-[#6B7280] ml-1 mb-1.5 block uppercase tracking-wider">İlçe</label>
                                <div className="relative">
                                    <select
                                        value={districtInput}
                                        onChange={(e) => setDistrictInput(e.target.value)}
                                        className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-5 py-4 text-white appearance-none focus:border-[#6C63FF] focus:ring-1 focus:ring-[#6C63FF] outline-none transition-all cursor-pointer hover:bg-white/[0.08] disabled:opacity-50"
                                        disabled={currentDistricts.length === 0}
                                    >
                                        <option value="" className="bg-[#1a1a2e]">Seçiniz ({currentDistricts.length})</option>
                                        {currentDistricts.map(d => (
                                            <option key={d} value={d} className="bg-[#1a1a2e]">{d}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[#6B7280]">▼</div>
                                </div>
                            </div>

                            <button
                                onClick={handleNext}
                                className="mt-6 w-full bg-gradient-to-r from-[#6C63FF] to-[#8B5CF6] hover:brightness-110 text-white font-bold py-4 rounded-2xl transition-all transform active:scale-[0.98] shadow-[0_0_20px_rgba(108,99,255,0.4)] flex items-center justify-center gap-2"
                            >
                                Başla <Check size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
