"use client";

import { useState } from "react";
import { DUAS, HADISLER } from "@/lib/duas";
import { BookOpen, Share2 } from "lucide-react";

export default function DuaPage() {
    const [activeTab, setActiveTab] = useState<"dua" | "hadis" | "tesbih">("dua");
    const [tesbihCount, setTesbihCount] = useState(0);

    const resetTesbih = () => setTesbihCount(0);
    const incrementTesbih = () => {
        if (navigator.vibrate) navigator.vibrate(15);
        setTesbihCount((prev) => prev + 1);
    };

    return (
        <div className="page-container space-y-6">
            <div className="animate-fade-in-up">
                <h1 className="text-2xl font-bold flex items-center gap-2 font-poppins text-primary">
                    <BookOpen size={24} className="text-primary" />
                    Dua & Hadisler
                </h1>
                <p className="text-sm mt-1 text-muted-foreground">
                    Günlük dualar, hadis-i şerifler ve dijital tesbih
                </p>
            </div>

            <div className="flex gap-2 p-1 bg-muted/10 rounded-2xl animate-fade-in-up stagger-1 border border-border-color">
                {["dua", "hadis", "tesbih"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${activeTab === tab
                                ? "bg-primary text-white shadow-md"
                                : "text-muted-foreground hover:bg-muted/5 hover:text-foreground"
                            }`}
                    >
                        {tab === "dua" && "🤲"}
                        {tab === "hadis" && "📖"}
                        {tab === "tesbih" && "📿"}
                        <span className="capitalize">{tab === "tesbih" ? "Tesbih" : tab + "lar"}</span>
                    </button>
                ))}
            </div>

            <div className="space-y-4">
                {activeTab === "dua" && (
                    <div className="grid gap-4 animate-fade-in-up">
                        {DUAS.map((dua) => (
                            <div key={dua.id} className="glass-card p-5 hover:border-primary/30 transition-colors group relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                                <div className="flex items-center justify-between mb-3 relative z-10">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-semibold uppercase tracking-wide">
                                            {dua.category}
                                        </span>
                                        <h3 className="text-sm font-bold font-poppins">{dua.title}</h3>
                                    </div>
                                    <button className="text-muted-foreground hover:text-primary transition-colors opacity-0 group-hover:opacity-100">
                                        <Share2 size={16} />
                                    </button>
                                </div>

                                <div className="bg-primary/5 p-4 rounded-xl mb-3 text-right font-amiri text-xl leading-loose text-primary/90" dir="rtl">
                                    {dua.arabic}
                                </div>

                                <p className="text-sm text-foreground/80 leading-relaxed italic">
                                    "{dua.turkish}"
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === "hadis" && (
                    <div className="grid gap-4 animate-fade-in-up">
                        {HADISLER.map((hadis, index) => (
                            <div key={hadis.id} className="glass-card p-5 border-l-4 border-yellow-500 hover:shadow-lg transition-all">
                                <div className="flex items-start gap-3">
                                    <span className="text-4xl text-yellow-500/20 font-serif leading-none">"</span>
                                    <div className="flex-1 pt-1">
                                        <p className="text-base font-medium text-foreground/90 mb-3 leading-relaxed">
                                            {hadis.text}
                                        </p>
                                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-border-color/50">
                                            <span className="text-xs text-muted-foreground font-mono">Hadis #{index + 1}</span>
                                            <span className="text-xs font-bold text-yellow-600 uppercase tracking-wider">{hadis.kaynak}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === "tesbih" && (
                    <div className="flex flex-col items-center justify-center py-12 animate-fade-in-up">
                        <div className="relative mb-8">
                            <div className="tasbih-btn" onClick={incrementTesbih}>
                                {tesbihCount}
                            </div>
                            <div className="absolute -z-10 bg-primary/20 blur-2xl rounded-full w-full h-full scale-125 animate-pulse-glow"></div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={resetTesbih}
                                className="px-6 py-2 rounded-full border border-border-color text-sm text-muted-foreground hover:bg-muted/10 hover:text-foreground transition-colors"
                            >
                                Sıfırla
                            </button>
                            <button
                                className="px-6 py-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm font-medium"
                            >
                                Kaydet
                            </button>
                        </div>

                        <p className="text-xs text-muted-foreground mt-8 max-w-xs text-center">
                            Ekrana dokunarak veya boşluk tuşuna basarak sayacı artırabilirsiniz.
                            Cihazınız destekliyorsa titreşim geri bildirimi alırsınız.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
