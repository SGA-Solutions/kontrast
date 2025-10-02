import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "../components/Header";
import { futuraBQMedium, futuraBQLight } from "./fonts";
import { PreloaderProvider } from "../components/PreloaderProvider";
import LottiePreloader from "../components/LottiePreloader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kontrast",
  description: "Arkitektur · Digitalisering · Projekteringsledning",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${futuraBQMedium.variable} ${futuraBQLight.variable} antialiased min-h-screen bg-white text-neutral-900 overflow-x-hidden sm:overflow-y-hidden overflow-y-auto hide-scrollbar font-smooth-cross-browser`}
      >
        <PreloaderProvider>
          <LottiePreloader />
          {/* Two-column layout on ≥sm; single column on mobile */}
          <div className="min-h-screen-safe grid grid-cols-1 sm:grid-cols-[100px_1fr] grid-fallback">
            {/* Left vertical navigation */}
            <Header />
            <main className="max-h-[80vh] overflow-x-hidden overflow-y-auto hide-scrollbar mt-8 sm:mt-8 pt-16 sm:pt-0 flex-1 no-overscroll">{children}</main>
            {/* <Footer /> */}        
          </div>
        </PreloaderProvider>
      </body>
    </html>
  );
}
