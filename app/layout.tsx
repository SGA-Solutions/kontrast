import type { Metadata } from "next";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

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
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-white text-neutral-900`}
      >
        {/* Two-column layout: left sidebar (navigation) and main content */}
        <div className="min-h-screen grid grid-cols-[160px_1fr]">
          {/* Left vertical navigation */}
          <Header />

          {/* Main content area */}
          <div className="px-6 sm:px-8 lg:px-12 py-8 flex flex-col">
            {/* Wordmark and subtext (align with sidebar 'K') */}
            <div className="flex items-start gap-6">
              {/* Wordmark: full text on mobile, image on ≥sm to pair with sidebar 'K' */}
              <div className="select-none whitespace-nowrap -ml-6 sm:-ml-8 lg:-ml-12">
                <div className="leading-none">
                  <span className="sm:hidden text-5xl sm:text-6xl md:text-7xl font-light tracking-[0.6em]">KONTRAST</span>
                  <span className="hidden sm:inline">
                    <Image
                      src="/Kontrast-logo-2.png"
                      alt="Kontrast wordmark"
                      width={700}
                      height={120}
                      priority
                      className="h-14 sm:h-16 md:h-20 w-auto object-contain"
                    />
                  </span>
                </div>
              </div>
              {/* Subtext */}
              <div className="text-left text-[10px] sm:text-xs tracking-[0.35em] leading-5">
                ARKITEKTUR
                <br />
                DIGITALISERING
                <br />
                PROJEKTLEDNING
              </div>
            </div>

            {/* Page content */}
            <main className="mt-8 flex-1">{children}</main>

            {/*<Footer />*/}
          </div>
        </div>
      </body>
    </html>
  );
}
