"use client";

import { useState, useEffect } from "react";
import { Download, X } from "lucide-react";

export function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handler = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);

            const hasClosed = localStorage.getItem("install-prompt-closed");
            if (!hasClosed) {
                setIsVisible(true);
            }
        };

        window.addEventListener("beforeinstallprompt", handler);

        return () => window.removeEventListener("beforeinstallprompt", handler);
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === "accepted") {
            setIsVisible(false);
        }
        setDeferredPrompt(null);
    };

    const handleClose = () => {
        setIsVisible(false);
        localStorage.setItem("install-prompt-closed", "true");
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-32 md:bottom-14 left-4 right-4 md:left-auto md:right-4 md:w-96 z-[120] animate-fade-in-up">
            <div className="glass-card p-0 overflow-hidden shadow-2xl border-primary/30">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>

                <div className="p-5 flex items-start gap-4">
                    {/* İkon */}
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-green-800 flex items-center justify-center text-white shadow-lg shadow-green-900/20">
                        <Download size={24} />
                    </div>

                    {/* İçerik */}
                    <div className="flex-1 pt-0.5">
                        <h3 className="text-foreground font-bold text-base font-poppins mb-1">
                            Uygulamayı Yükle
                        </h3>
                        <p className="text-muted-foreground text-xs leading-relaxed mb-3">
                            Daha hızlı erişim ve çevrimdışı kullanım için İftar Vakti'ni cihazına indir.
                        </p>

                        <div className="flex gap-2">
                            <button
                                onClick={handleInstall}
                                className="flex-1 bg-primary hover:bg-green-700 text-white py-2 px-3 rounded-lg text-xs font-bold transition-all shadow-md hover:shadow-primary/25 flex items-center justify-center gap-2"
                            >
                                <Download size={14} />
                                Yükle
                            </button>
                            <button
                                onClick={handleClose}
                                className="px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:bg-muted/10 transition-colors"
                            >
                                Daha Sonra
                            </button>
                        </div>
                    </div>

                    {/* Kapat Butonu */}
                    <button
                        onClick={handleClose}
                        className="absolute top-2 right-2 p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/10 rounded-full transition-colors"
                    >
                        <X size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
}
