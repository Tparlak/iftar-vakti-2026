"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/lib/context";
import { calculateQibla } from "@/lib/data";
import { Compass, Navigation, AlertTriangle, ArrowUp } from "lucide-react";

export default function KiblePage() {
    const { city } = useApp();
    const [qiblaAngle, setQiblaAngle] = useState(0);
    const [deviceAlpha, setDeviceAlpha] = useState<number | null>(null);
    const [permissionGranted, setPermissionGranted] = useState(false);
    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
        // Şehrin kıble açısını hesapla (Kuzey'den saat yönünde)
        const angle = calculateQibla(city.lat, city.lng);
        setQiblaAngle(angle);

        // iOS Tespiti
        const isIOSDevice =
            typeof navigator !== "undefined" &&
            (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
                (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1));
        setIsIOS(isIOSDevice);

        // Eğer iOS değilse veya Android ise direkt dinlemeyi dene
        if (!isIOSDevice && window.DeviceOrientationEvent) {
            window.addEventListener("deviceorientationabsolute", handleOrientation);
            window.addEventListener("deviceorientation", handleOrientation);
            setPermissionGranted(true);
        }
    }, [city]);

    const handleOrientation = (event: any) => {
        // Android: alpha (0-360) where 0 is North
        // iOS: webkitCompassHeading
        let alpha = event.alpha;

        if (event.webkitCompassHeading) {
            // iOS
            alpha = event.webkitCompassHeading;
        } else if (event.absolute && event.alpha !== null) {
            // Android absolute
            alpha = 360 - event.alpha;
        }

        setDeviceAlpha(alpha);
    };

    const requestPermission = async () => {
        if (typeof (DeviceOrientationEvent as any).requestPermission === "function") {
            try {
                const response = await (DeviceOrientationEvent as any).requestPermission();
                if (response === "granted") {
                    setPermissionGranted(true);
                    window.addEventListener("deviceorientation", handleOrientation);
                } else {
                    alert("Pusula için sensör izni reddedildi.");
                }
            } catch (error) {
                console.error(error);
            }
        } else {
            // Fonksiyon yoksa zaten izin gerekmiyordur veya desteklenmiyordur
            setPermissionGranted(true);
            window.addEventListener("deviceorientation", handleOrientation);
        }
    };

    // İbre dönüş açısı: (Kıble Açısı - Cihazın Yönü)
    // Örn: Kıble 180 (Güney), Cihaz 0 (Kuzey) -> İbre 180 derece dönmeli (Arkada)
    // Cihaz 90 (Doğu) -> İbre 90 derece dönmeli (Sağda)
    const rotation = deviceAlpha !== null ? qiblaAngle - deviceAlpha : 0;

    return (
        <div className="page-container space-y-6">
            <div className="animate-fade-in-up">
                <h1 className="text-2xl font-bold flex items-center gap-2 font-poppins text-primary">
                    <Compass size={24} className="text-primary" />
                    Kıble Pusulası
                </h1>
                <p className="text-sm mt-1 text-muted-foreground">
                    {city.name} için Kıble Yönü: <span className="text-primary font-bold">{qiblaAngle.toFixed(1)}°</span>
                </p>
            </div>

            <div className="glass-card p-8 flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden animate-fade-in-up stagger-1">

                {/* Arka plan dekor */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/5 pointer-events-none"></div>

                {!permissionGranted && isIOS ? (
                    <div className="text-center z-10">
                        <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-yellow-500">
                            <Navigation size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Pusula İzni Gerekli</h3>
                        <p className="text-gray-400 text-sm mb-6 max-w-xs mx-auto">
                            Kıble yönünü göstermek için cihazının pusula sensörüne erişmemiz gerekiyor.
                        </p>
                        <button
                            onClick={requestPermission}
                            className="bg-primary hover:bg-green-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg active:scale-95"
                        >
                            Sensöre İzin Ver
                        </button>
                    </div>
                ) : deviceAlpha === null && permissionGranted ? (
                    <div className="text-center z-10">
                        <div className="animate-spin mb-4 text-primary">
                            <Compass size={48} />
                        </div>
                        <p className="text-gray-400 text-sm">Pusula verisi bekleniyor...</p>
                        <p className="text-xs text-gray-600 mt-2">Cihazınızı 8 çizerek kalibre edin.</p>
                    </div>
                ) : (
                    <div className="relative w-72 h-72 z-10">
                        {/* Pusula Gövdesi */}
                        <div
                            className="absolute inset-0 rounded-full border-4 border-white/10 shadow-2xl bg-[#1a1a2e]"
                            style={{
                                transform: `rotate(${- (deviceAlpha || 0)}deg)`,
                                transition: "transform 0.1s ease-out"
                            }}
                        >
                            {/* Kuzey İşareti */}
                            <div className="absolute top-2 left-1/2 -translate-x-1/2 text-center">
                                <span className="text-red-500 font-bold text-xl block">N</span>
                                <div className="w-1 h-3 bg-red-500 mx-auto"></div>
                            </div>
                            {/* Doğu */}
                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                <span className="text-gray-500 font-bold text-sm">E</span>
                            </div>
                            {/* Güney */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                                <span className="text-gray-500 font-bold text-sm">S</span>
                            </div>
                            {/* Batı */}
                            <div className="absolute left-4 top-1/2 -translate-y-1/2">
                                <span className="text-gray-500 font-bold text-sm">W</span>
                            </div>

                            {/* Dereceler */}
                            <div className="absolute inset-4 rounded-full border border-dashed border-white/5 opacity-50"></div>
                        </div>

                        {/* Kabe İbresi (Sabit değil, pusula ile döner) */}
                        {/* Aslında ibre: Cihazın açısına ters dönmeli ki hep Kabe'ye baksın */}
                        <div
                            className="absolute inset-0 flex items-center justify-center pointer-events-none"
                            style={{
                                transform: `rotate(${rotation}deg)`,
                                transition: "transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)"
                            }}
                        >
                            <div className="relative h-full w-full">
                                {/* İbre oku */}
                                <div className="absolute top-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
                                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center animate-pulse-glow">
                                        <ArrowUp size={32} className="text-green-400 drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]" strokeWidth={3} />
                                    </div>
                                    {/* Kabe İkonu */}
                                    <div className="mt-2 bg-black w-8 h-8 rounded border border-yellow-500/50 shadow-lg flex items-center justify-center">
                                        <div className="w-6 h-6 border border-yellow-500/30"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Merkez Nokta */}
                        <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 shadow-lg border-2 border-gray-800 z-20"></div>
                    </div>
                )}

                {/* Bilgi Kutusu */}
                <div className="mt-8 text-center max-w-sm mx-auto glass-card p-4 border-none bg-black/20">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <AlertTriangle size={16} className="text-yellow-500" />
                        <span className="text-xs font-bold text-yellow-500 uppercase tracking-wide">Kalibrasyon</span>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">
                        Pusulanın doğru çalışması için cihazınızı metal eşyalardan uzak tutun ve havada '8' çizer gibi hareket ettirin.
                    </p>
                    {deviceAlpha !== null && (
                        <div className="mt-2 text-xs font-mono text-primary">
                            Cihaz Yönü: {Math.round(deviceAlpha)}°
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
