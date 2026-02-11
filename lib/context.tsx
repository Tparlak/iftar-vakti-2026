"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { CITIES, fetchPrayerTimes, PrayerTimes } from "@/lib/data";

interface AppState {
    city: typeof CITIES[0];
    setCity: (city: typeof CITIES[0]) => void;
    district: string;
    setDistrict: (district: string) => void;
    userName: string;
    setUserName: (name: string) => void;
    theme: "light" | "dark" | "auto";
    setTheme: (theme: "light" | "dark" | "auto") => void;
    notifications: boolean;
    setNotifications: (v: boolean) => void;
    ezanSound: boolean;
    setEzanSound: (v: boolean) => void;
    prayerTimes: PrayerTimes;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
    const [city, setCityState] = useState(CITIES[34]); // İstanbul default (index 34)
    const [district, setDistrictState] = useState("");
    const [userName, setUserNameState] = useState("");
    const [theme, setThemeState] = useState<"light" | "dark" | "auto">("dark");
    const [notifications, setNotifications] = useState(false);
    const [ezanSound, setEzanSound] = useState(false);
    const [prayerTimes, setPrayerTimes] = useState<PrayerTimes>({
        imsak: "--:--",
        gunes: "--:--",
        ogle: "--:--",
        ikindi: "--:--",
        aksam: "--:--",
        yatsi: "--:--",
    });

    // Load from localStorage
    useEffect(() => {
        const savedCity = localStorage.getItem("iftar-vakti-city");
        const savedDistrict = localStorage.getItem("iftar-vakti-district");
        const savedName = localStorage.getItem("iftar-vakti-username");
        const savedTheme = localStorage.getItem("iftar-vakti-theme");
        const savedNotif = localStorage.getItem("iftar-vakti-notifications");
        const savedEzan = localStorage.getItem("iftar-vakti-ezan");

        if (savedCity) {
            const found = CITIES.find((c) => c.name === savedCity);
            if (found) setCityState(found);
        }
        if (savedDistrict) setDistrictState(savedDistrict);
        if (savedName) setUserNameState(savedName);
        if (savedTheme) setThemeState(savedTheme as "light" | "dark" | "auto");
        if (savedNotif) setNotifications(savedNotif === "true");
        if (savedEzan) setEzanSound(savedEzan === "true");
    }, []);

    // Apply theme
    useEffect(() => {
        const root = document.documentElement;
        if (theme === "dark" || (theme === "auto" && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
    }, [theme]);

    // Calculate prayer times from API
    useEffect(() => {
        const loadTimes = async () => {
            // Şehir + İlçe (Opsiyonel) birleşimini dene, yoksa sadece şehir
            // Not: Aladhan API 'city' parametresine ilçe de alabilir, şansımızı deneriz.
            // Ancak en garantisi Şehir adıdır.
            const queryLocation = district ? district : city.name;
            let times = await fetchPrayerTimes(queryLocation);

            // Eğer ilçe ile bulamazsa (fallback mekanizması data.ts içinde var ama burada da check edebiliriz)
            // fetchPrayerTimes zaten hata durumunda İstanbul veya şehir merkezine dönüyor.
            setPrayerTimes(times);
        };

        loadTimes();

        // Update every 5 minutes from API
        const interval = setInterval(loadTimes, 300000);

        return () => clearInterval(interval);
    }, [city, district]); // İlçe veya şehir değişince yenile

    const setCity = (c: typeof CITIES[0]) => {
        setCityState(c);
        localStorage.setItem("iftar-vakti-city", c.name);
        // Şehir değişince ilçeyi sıfırla
        setDistrictState("");
        localStorage.removeItem("iftar-vakti-district");
    };

    const setDistrict = (d: string) => {
        setDistrictState(d);
        if (d) localStorage.setItem("iftar-vakti-district", d);
        else localStorage.removeItem("iftar-vakti-district");
    };

    const setUserName = (n: string) => {
        setUserNameState(n);
        localStorage.setItem("iftar-vakti-username", n);
    };

    const setTheme = (t: "light" | "dark" | "auto") => {
        setThemeState(t);
        localStorage.setItem("iftar-vakti-theme", t);
    };

    const setNotificationsWrapper = (v: boolean) => {
        setNotifications(v);
        localStorage.setItem("iftar-vakti-notifications", String(v));
    };

    const setEzanSoundWrapper = (v: boolean) => {
        setEzanSound(v);
        localStorage.setItem("iftar-vakti-ezan", String(v));
    };

    return (
        <AppContext.Provider
            value={{
                city,
                setCity,
                district,
                setDistrict,
                userName,
                setUserName,
                theme,
                setTheme,
                notifications,
                setNotifications: setNotificationsWrapper,
                ezanSound,
                setEzanSound: setEzanSoundWrapper,
                prayerTimes,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error("useApp must be used within AppProvider");
    return ctx;
}
