"use client";

import { useState } from "react";

export function SlidingBanner() {
    const [isPaused, setIsPaused] = useState(false);

    return (
        <div
            className="fixed bottom-[calc(4rem+env(safe-area-inset-bottom,0px))] md:bottom-0 left-0 w-full z-[190] h-8 bg-emerald-950/90 backdrop-blur-md border-t border-emerald-800 flex items-center overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes scrollText {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .scrolling-banner {
                    display: flex;
                    width: max-content;
                    animation: scrollText 40s linear infinite;
                    will-change: transform;
                }
            `}} />

            <div
                className="whitespace-nowrap scrolling-banner flex items-center"
                style={{ animationPlayState: isPaused ? "paused" : "running" }}
            >
                {/* Content duplicated for seamless loop */}
                <BannerText />
                <BannerText />
                <BannerText />
                <BannerText />
            </div>
        </div>
    );
}

function BannerText() {
    return (
        <span className="text-emerald-50 text-sm font-medium px-4 opacity-90 tracking-wide flex items-center gap-4">
            <span className="text-yellow-400">🌙</span> Hoş geldin Ya Şehr-i Ramazan!
            <span className="w-1 h-1 bg-white/40 rounded-full"></span>
            BU UYGULAMA TANER PARLAK TARAFINDAN YAPILMISTIR Uygulamamızdaki hataları bildirmek için ayarlardan iletişime geçebilirsiniz.
            <span className="w-1 h-1 bg-white/40 rounded-full"></span>
            İftar Vakti 2026 Hayırlı Ramazanlar Diler...
            <span className="w-1 h-1 bg-white/40 rounded-full"></span>
            <span className="text-yellow-400">⚡</span> Yeni Özellik: Zikirmatik artık dokunsal geri bildirim destekliyor!
            <span className="inline-block w-20"></span> {/* Spacer */}
        </span>
    );
}
