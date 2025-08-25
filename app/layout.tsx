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
        {/* Two-column layout on ≥sm; single column on mobile */}
        <div className="min-h-screen grid grid-cols-1 sm:grid-cols-[160px_1fr]">
          {/* Left vertical navigation */}
          <Header />
          <main className="mt-8 flex-1">{children}</main>
          {/*<Footer />*/}         
        </div>
      </body>
    </html>
  );
}
