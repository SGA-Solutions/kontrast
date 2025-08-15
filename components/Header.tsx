"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
// Simple className merge helper
function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const NAV = [
  { href: "/", label: "Hem" },
  { href: "/tjanster", label: "Tjänster" },
  { href: "/projekt", label: "Projekt" },
  { href: "/om-oss", label: "Om Oss" },
  { href: "/nyheter", label: "Nyheter" },
  { href: "/kontakt", label: "Kontakt" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <aside className="hidden sm:flex flex-col p-4 md:p-5 sticky top-0 h-screen">
      {/* Logo */}
      <Link href="/" aria-label="Kontrast" className="mb-8 inline-block ml-1 md:ml-2">
        <Image
          src="/Kontrast-logo.png"
          alt="Kontrast logo"
          width={64}
          height={64}
          priority
          className="w-14 h-14 md:w-18 md:h-18 lg:w-22 lg:h-22 object-contain"
        />
      </Link>

      {/* Primary nav */}
      <nav className="flex flex-col gap-3 text-sm tracking-[0.3em] text-neutral-600 dark:text-neutral-400">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors",
              pathname === item.href && "font-semibold text-neutral-900 dark:text-neutral-100"
            )}
          >
            {item.label.toUpperCase()}
          </Link>
        ))}
      </nav>

      {/* Spacer to push socials to bottom */}
      <div className="flex-1" />

      {/* Social links */}
      <div className="flex gap-3 text-neutral-500">
        <a
          href="https://www.instagram.com/"
          target="_blank"
          rel="noreferrer noopener"
          aria-label="Instagram"
          className="hover:text-neutral-900 dark:hover:text-neutral-100"
        >
          ig
        </a>
        <a
          href="https://www.linkedin.com/"
          target="_blank"
          rel="noreferrer noopener"
          aria-label="LinkedIn"
          className="hover:text-neutral-900 dark:hover:text-neutral-100"
        >
          in
        </a>
      </div>
    </aside>
  );
}
