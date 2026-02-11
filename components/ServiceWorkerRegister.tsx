"use client";

import { useEffect } from "react";

export function ServiceWorkerRegister() {
    useEffect(() => {
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker
                .register("/sw.js")
                .then((registration) => console.log("SW Tescil Edildi: ", registration.scope))
                .catch((err) => console.log("SW Hatası: ", err));
        }
    }, []);

    return null;
}
