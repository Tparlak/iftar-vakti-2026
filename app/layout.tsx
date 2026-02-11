import type { Metadata } from "next";
import { Inter, Poppins, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import { AppProvider } from "@/lib/context";
import { InstallPrompt } from "@/components/InstallPrompt";
import { Onboarding } from "@/components/Onboarding";
import { SlidingBanner } from "@/components/SlidingBanner";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
});

const poppins = Poppins({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "İftar Vakti 2026",
  description: "Namaz vakitleri, iftar sayacı ve Ramazan rehberi",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/icon-192.svg" },
      { url: "/favicon.ico", sizes: "256x256", type: "image/x-icon" },
    ],
    apple: "/icons/icon-192.svg",
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "theme-color": "#1e7e34",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icons/icon-192.svg" type="image/svg+xml" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#1e7e34" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body
        className={`${inter.variable} ${poppins.variable} ${jetbrainsMono.variable} font-sans antialiased bg-background text-foreground`}
      >
        <AppProvider>
          <ServiceWorkerRegister />
          <div className="islamic-pattern"></div>
          <Navbar />
          <Onboarding />
          <InstallPrompt />
          <SlidingBanner />
          <main className="min-h-screen pt-32 md:pt-44 pb-72 md:pb-60 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </main>
        </AppProvider>
      </body>
    </html>
  );
}
