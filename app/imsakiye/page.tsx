"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/lib/context";
import { fetchMonthlyPrayerTimes, RAMAZAN_START } from "@/lib/data";
import { Calendar, Download, Share2, Loader2 } from "lucide-react";

export default function ImsakiyePage() {
    const { city } = useApp();
    const [ramadanDays, setRamadanDays] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadImsakiye = async () => {
            setLoading(true);
            // Ramazan 2026: Şubat ve Mart aylarını kapsıyor
            const feb = await fetchMonthlyPrayerTimes(city.name, 2026, 2);
            const mar = await fetchMonthlyPrayerTimes(city.name, 2026, 3);

            const allDays = [...feb, ...mar];
            const startDay = RAMAZAN_START.getDate();

            // Ramazan 17 Şubat'ta başlıyor, 18 Mart'ta bitiyor
            // Şubat'tan 17. günden itibaren al
            const ramadanFeb = feb.filter((d: any) => parseInt(d.date.gregorian.day) >= 17);
            // Mart'tan 18. güne kadar al
            const ramadanMar = mar.filter((d: any) => parseInt(d.date.gregorian.day) <= 18);

            const combined = [...ramadanFeb, ...ramadanMar].slice(0, 30);

            const today = new Date();
            const formatted = combined.map((d: any, index: number) => {
                const dateObj = new Date(d.date.gregorian.year, d.date.gregorian.month.number - 1, d.date.gregorian.day);
                const isToday = dateObj.toDateString() === today.toDateString();

                return {
                    day: index + 1,
                    date: dateObj,
                    times: {
                        imsak: d.timings.Fajr.split(" ")[0],
                        gunes: d.timings.Sunrise.split(" ")[0],
                        ogle: d.timings.Dhuhr.split(" ")[0],
                        ikindi: d.timings.Asr.split(" ")[0],
                        aksam: d.timings.Maghrib.split(" ")[0],
                        yatsi: d.timings.Isha.split(" ")[0],
                    },
                    isToday
                };
            });

            setRamadanDays(formatted);
            setLoading(false);
        };

        loadImsakiye();
    }, [city]);

    const formatDate = (date: Date) => {
        return date.toLocaleDateString("tr-TR", { day: "numeric", month: "long", weekday: "long" });
    };

    return (
        <div className="page-container space-y-6">
            <div className="animate-fade-in-up">
                <h1 className="text-2xl font-bold flex items-center gap-2 font-poppins text-primary">
                    <Calendar size={24} className="text-primary" />
                    Ramazan İmsakiyesi 2026
                </h1>
                <p className="text-sm mt-1 text-muted-foreground">
                    {city.name} için Diyanet uyumlu 30 günlük vakitler
                </p>
            </div>

            <div className="glass-card p-4 overflow-hidden animate-fade-in-up stagger-1 min-h-[400px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-64 text-primary">
                        <Loader2 size={40} className="animate-spin mb-4" />
                        <p className="font-medium">Vakitler güncelleniyor...</p>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-end gap-2 mb-4">
                            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                                <Download size={14} />
                                PDF İndir
                            </button>
                            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                                <Share2 size={14} />
                                Paylaş
                            </button>
                        </div>

                        <div className="overflow-x-auto rounded-xl border border-border-color">
                            <table className="imsakiye-table w-full text-sm">
                                <thead>
                                    <tr>
                                        <th className="rounded-tl-xl text-center">Gün</th>
                                        <th className="text-center">Tarih</th>
                                        <th className="text-center">İmsak</th>
                                        <th className="text-center">Güneş</th>
                                        <th className="text-center">Öğle</th>
                                        <th className="text-center">İkindi</th>
                                        <th className="text-center">Akşam (İftar)</th>
                                        <th className="rounded-tr-xl text-center">Yatsı</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ramadanDays.map((day) => (
                                        <tr key={day.day} className={`transition-colors ${day.isToday ? "today bg-primary/10" : "hover:bg-muted/5"}`}>
                                            <td className="font-bold text-primary text-center whitespace-nowrap px-4">{day.day}. Gün</td>
                                            <td className="text-xs text-muted-foreground px-4 whitespace-nowrap text-center">{formatDate(day.date)}</td>
                                            <td className="px-4 text-center font-mono font-medium">{day.times.imsak}</td>
                                            <td className="px-4 text-center text-muted-foreground font-mono">{day.times.gunes}</td>
                                            <td className="px-4 text-center font-mono">{day.times.ogle}</td>
                                            <td className="px-4 text-center font-mono">{day.times.ikindi}</td>
                                            <td className="px-4 text-center font-bold text-primary font-mono">{day.times.aksam}</td>
                                            <td className="px-4 text-center text-muted-foreground font-mono">{day.times.yatsi}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>

            <div className="text-center text-xs text-muted-foreground mt-4 animate-fade-in-up stagger-2">
                * Vakitler Aladhan API (Diyanet Metodu) üzerinden anlık çekilmektedir.
            </div>
        </div>
    );
}
