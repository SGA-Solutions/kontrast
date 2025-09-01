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
    <aside className="hidden sm:flex flex-col pt-5 sticky top-0 h-screen w-fill">
      {/* Logo */}
      <Link href="/" aria-label="Kontrast" className="pt-2 mb-7 inline-block ml-1 md:ml-2">
        <Image
          src="/Kontrast-logo.png"
          alt="Kontrast logo"
          width={64}
          height={64}
          priority
          className="pl-4 w-14 h-14 md:w-16 md:h-16 lg:h-16 w-auto object-contain"
        />
      </Link>
      {/* Primary nav */}
      <nav className="flex flex-col gap-3 text-xs ml-5 tracking-[0.3em] text-neutral-600 dark:text-neutral-400">
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
      {/* <div className="flex-1" /> */}

      {/* Social links */}
      <div className="mt-4 ml-5 flex gap-4 text-neutral-500">
        <a
          href="https://www.instagram.com/"
          target="_blank"
          rel="noreferrer noopener"
          aria-label="Instagram"
          className="hover:text-neutral-900 dark:hover:text-neutral-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <rect x="3" y="3" width="18" height="18" rx="5" ry="5" />
            <path d="M16.5 7.5h.01" />
            <circle cx="12" cy="12" r="4" />
          </svg>
        </a>
        <a
          href="https://www.linkedin.com/"
          target="_blank"
          rel="noreferrer noopener"
          aria-label="LinkedIn"
          className="hover:text-neutral-900 dark:hover:text-neutral-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path d="M4.984 3.5A1.75 1.75 0 1 1 1.5 3.5a1.75 1.75 0 0 1 3.484 0ZM2 8h4v12H2V8Zm7 0h3.8v1.64h.05c.53-1 1.84-2.06 3.78-2.06 4.04 0 4.79 2.66 4.79 6.12V20H18v-5.2c0-1.24-.02-2.84-1.73-2.84-1.73 0-2 1.35-2 2.74V20h-4V8Z" />
          </svg>
        </a>
      </div>
    </aside>
  );
}
