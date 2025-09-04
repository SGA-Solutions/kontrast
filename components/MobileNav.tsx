"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "Hem" },
  { href: "/tjanster", label: "Tjänster" },
  { href: "/projekt", label: "Projekt" },
  { href: "/om-oss", label: "Om Oss" },
  { href: "/nyheter", label: "Nyheter" },
  { href: "/kontakt", label: "Kontakt" },
];

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="sm:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-neutral-200 px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" onClick={closeMenu} className="flex items-center">
          <img
            src="/kontrast-logo-4.png"
            alt="Kontrast logo"
            width={700}
            height={120}
            className="w-50 h-auto object-contain"
          />
        </Link>

        {/* Hamburger Menu Button */}
        <button
          onClick={toggleMenu}
          className="p-2 rounded-md hover:bg-neutral-100 transition-colors touch-manipulation"
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          <div className="w-6 h-6 flex flex-col justify-center items-center">
            <span
              className={`block h-0.5 w-6 bg-neutral-900 transition-all duration-300 ${
                isOpen ? "rotate-45 translate-y-1" : "-translate-y-1"
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-neutral-900 transition-all duration-300 ${
                isOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-neutral-900 transition-all duration-300 ${
                isOpen ? "-rotate-45 -translate-y-1" : "translate-y-1"
              }`}
            />
          </div>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="sm:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={closeMenu}
        />
      )}

      {/* Mobile Menu Panel */}
      <div
        className={`sm:hidden fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 pt-20">
          {/* Navigation Links */}
          <nav className="space-y-6">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className={`block text-lg tracking-[0.2em] transition-colors py-2 touch-manipulation ${
                  pathname === item.href
                    ? "font-semibold text-neutral-900 border-l-2 border-neutral-900 pl-4"
                    : "text-neutral-600 hover:text-neutral-900 pl-4"
                }`}
              >
                {item.label.toUpperCase()}
              </Link>
            ))}
          </nav>

          {/* Social Links */}
          <div className="mt-12 pt-8 border-t border-neutral-200">
            <div className="flex gap-6">
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Instagram"
                className="p-3 hover:bg-neutral-100 rounded-full transition-colors touch-manipulation"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="h-6 w-6"
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
                className="p-3 hover:bg-neutral-100 rounded-full transition-colors touch-manipulation"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-6 w-6"
                  aria-hidden="true"
                >
                  <path d="M4.984 3.5A1.75 1.75 0 1 1 1.5 3.5a1.75 1.75 0 0 1 3.484 0ZM2 8h4v12H2V8Zm7 0h3.8v1.64h.05c.53-1 1.84-2.06 3.78-2.06 4.04 0 4.79 2.66 4.79 6.12V20H18v-5.2c0-1.24-.02-2.84-1.73-2.84-1.73 0-2 1.35-2 2.74V20h-4V8Z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
