"use client";

import { useState, useEffect } from "react";
import { Activity, RotateCcw, Volume2, VolumeX } from "lucide-react";

export default function TesbihPage() {
    const [count, setCount] = useState(0);
    const [limit, setLimit] = useState(33);
    const [soundEnabled, setSoundEnabled] = useState(false);
    const [isTouching, setIsTouching] = useState(false);

    // Load settings
    useEffect(() => {
        const savedCount = localStorage.getItem("iftar-vakti-zikir");
        const savedLimit = localStorage.getItem("iftar-vakti-zikir-limit");
        const savedSound = localStorage.getItem("iftar-vakti-zikir-sound");

        if (savedCount) setCount(parseInt(savedCount));
        if (savedLimit) setLimit(parseInt(savedLimit));
        if (savedSound) setSoundEnabled(savedSound === "true");
    }, []);

    // Save settings
    useEffect(() => {
        localStorage.setItem("iftar-vakti-zikir", count.toString());
    }, [count]);

    useEffect(() => {
        localStorage.setItem("iftar-vakti-zikir-limit", limit.toString());
    }, [limit]);

    useEffect(() => {
        localStorage.setItem("iftar-vakti-zikir-sound", soundEnabled.toString());
    }, [soundEnabled]);

    const playSound = () => {
        if (!soundEnabled) return;
        // Simple click sound using Web Audio API or a tiny data URI would be better, 
        // but for now we'll just skip complex audio implementation.
        // A real app would load an Audio object.
    };

    const handleClick = () => {
        if (navigator.vibrate) navigator.vibrate(50);
        playSound();

        setCount((prev) => {
            if (limit > 0 && prev >= limit) {
                if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
                return 1; // Reset to 1 after reaching limit (or 0?) usually 1 is better for flow
            }
            return prev + 1;
        });
    };

    const handleReset = () => {
        if (confirm("Sayacı sıfırlamak istiyor musunuz?")) {
            setCount(0);
        }
    };

    const setTarget = (val: number) => {
        setLimit(val);
        setCount(0);
    };

    // Progress Ring Calculations
    const radius = 120;
    const circumference = 2 * Math.PI * radius;
    const progress = limit > 0 ? (count / limit) * 100 : 0;
    const strokeDashoffset = limit > 0 ? circumference - (progress / 100) * circumference : circumference;

    return (
        <div className="flex flex-col h-[calc(100vh-180px)] items-center justify-between pb-10">
            {/* Header / Top Controls */}
            <div className="w-full flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-poppins text-white flex items-center gap-2">
                        <Activity className="text-primary" />
                        Zikirmatik
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">Dijital Tesbih</p>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => setSoundEnabled(!soundEnabled)}
                        className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    >
                        {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                    </button>
                    <button
                        onClick={handleReset}
                        className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-red-400 hover:text-red-300 transition-colors"
                    >
                        <RotateCcw size={20} />
                    </button>
                </div>
            </div>

            {/* Main Interactive Circle */}
            <div className="relative flex-1 flex items-center justify-center w-full">
                <button
                    className={`relative group transition-transform duration-100 ${isTouching ? "scale-95" : "scale-100"}`}
                    onMouseDown={() => setIsTouching(true)}
                    onMouseUp={() => { setIsTouching(false); handleClick(); }}
                    onMouseLeave={() => setIsTouching(false)}
                    onTouchStart={() => setIsTouching(true)}
                    onTouchEnd={() => { setIsTouching(false); handleClick(); }}
                    style={{ WebkitTapHighlightColor: "transparent" }}
                >
                    {/* Ring SVG */}
                    <div className="relative w-80 h-80 filter drop-shadow-[0_0_50px_rgba(34,197,94,0.2)]">
                        <svg className="w-full h-full transform -rotate-90">
                            {/* Background Track */}
                            <circle
                                cx="50%"
                                cy="50%"
                                r={radius}
                                stroke="#1a1d27" // dark bg color
                                strokeWidth="24"
                                fill="transparent"
                                className="stroke-white/5"
                            />
                            {/* Animated Progress */}
                            {limit > 0 && (
                                <circle
                                    cx="50%"
                                    cy="50%"
                                    r={radius}
                                    stroke="currentColor"
                                    strokeWidth="24"
                                    fill="transparent"
                                    className="text-primary transition-all duration-300 ease-out"
                                    strokeDasharray={circumference}
                                    strokeDashoffset={strokeDashoffset}
                                    strokeLinecap="round"
                                />
                            )}
                        </svg>
                    </div>

                    {/* Center Text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-8xl md:text-9xl font-bold font-mono text-white tracking-tighter tabular-nums drop-shadow-2xl select-none">
                            {count}
                        </span>
                        {limit > 0 && (
                            <span className="text-gray-500 font-medium bg-black/40 px-3 py-1 rounded-full text-xs mt-4 backdrop-blur-md border border-white/5">
                                Hedef: {limit}
                            </span>
                        )}
                        {limit === 0 && (
                            <span className="text-primary font-medium bg-primary/10 px-3 py-1 rounded-full text-xs mt-4 backdrop-blur-md border border-primary/20">
                                ∞ Serbest
                            </span>
                        )}
                    </div>

                    {/* Pulse Effect on Click */}
                    <div className={`absolute inset-0 rounded-full border-4 border-primary/30 opacity-0 transition-opacity duration-300 ${isTouching ? "opacity-100 scale-105" : ""}`}></div>
                </button>
            </div>

            {/* Target Selectors */}
            <div className="flex gap-4 p-2 bg-black/20 rounded-2xl backdrop-blur-md border border-white/5">
                {[33, 99, 0].map((val) => (
                    <button
                        key={val}
                        onClick={() => setTarget(val)}
                        className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${limit === val
                                ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105"
                                : "bg-transparent text-gray-500 hover:text-gray-300 hover:bg-white/5"
                            }`}
                    >
                        {val === 0 ? "∞" : val}
                    </button>
                ))}
            </div>
        </div>
    );
}
