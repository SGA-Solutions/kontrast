import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { futuraBQMedium, futuraBQLight } from "./fonts";
import { PreloaderProvider } from "../components/PreloaderProvider";
import LottiePreloader from "../components/LottiePreloader";
import { MobileProvider } from "../contexts/MobileContext";
import { LayoutContent } from "../components/LayoutContent";

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
          <MobileProvider>
            <LayoutContent>{children}</LayoutContent>
          </MobileProvider>
        </PreloaderProvider>
      </body>
    </html>
  );
}
