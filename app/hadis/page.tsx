"use client";

import { HADISLER } from "@/lib/duas";
import { Quote, Share2, Heart, BookOpen } from "lucide-react";

export default function HadisPage() {
    return (
        <div className="page-container space-y-8 pb-20">
            <div className="animate-fade-in-up">
                <h1 className="text-3xl font-bold flex items-center gap-3 font-poppins text-primary">
                    <Quote size={28} className="text-primary fill-primary/10" />
                    Hadis-i Şerifler
                </h1>
                <p className="text-sm mt-2 text-muted-foreground max-w-md">
                    Sevgili Peygamberimiz'den (s.a.v.) günümüze ışık tutan, hayatımıza rehberlik eden kıymetli hadisler.
                </p>
            </div>

            <div className="grid gap-6 animate-fade-in-up stagger-1">
                {HADISLER.map((hadis, index) => (
                    <div
                        key={hadis.id}
                        className="glass-card p-6 border-l-4 border-primary/40 hover:border-primary transition-all group relative overflow-hidden shadow-xl"
                    >
                        {/* Decorative background number */}
                        <div className="absolute -right-4 -bottom-4 text-8xl font-serif font-bold text-primary/5 select-none transition-transform group-hover:scale-110">
                            {index + 1}
                        </div>

                        <div className="flex flex-col gap-4 relative z-10">
                            <div className="flex items-start justify-between">
                                <Quote size={24} className="text-primary/20 rotate-180" />
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-2 rounded-full hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors">
                                        <Heart size={18} />
                                    </button>
                                    <button className="p-2 rounded-full hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors">
                                        <Share2 size={18} />
                                    </button>
                                </div>
                            </div>

                            <p className="text-lg md:text-xl font-medium text-foreground/90 leading-relaxed font-outfit px-4 italic">
                                "{hadis.text}"
                            </p>

                            <div className="flex items-center justify-end mt-4 pt-4 border-t border-white/5">
                                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest">
                                    <BookOpen size={12} />
                                    {hadis.kaynak}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="glass-card p-8 text-center animate-fade-in-up stagger-3 bg-gradient-to-br from-primary/5 to-transparent border-primary/10">
                <p className="text-sm text-muted-foreground italic max-w-sm mx-auto">
                    "Sizin en hayırlınız Kur’an’ı öğrenen ve öğretendir."
                </p>
                <p className="text-[10px] mt-4 uppercase tracking-[0.2em] font-bold text-primary/60">Buhârî, Fedâilü’l-Kur’ân 21</p>
            </div>
        </div>
    );
}
