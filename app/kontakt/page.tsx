"use client";

import React from "react";
import Image from "next/image";

export default function KontaktPage() {
  return (
    <section className="px-4 sm:pl-10 mt-4 sm:mt-14 space-y-6 pb-8">
      {/* Page title */}
      <div className="space-y-8">
        <span className="text-sm font-light tracking-[0.45em]">KONTAKT</span>
        {/* Mobile-first layout: stack vertically on mobile, side-by-side on larger screens */}
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left column: Map, Hours, Address */}
          <div className="space-y-6 order-2 lg:order-1">
            {/* Map */}
            <div className="relative h-[250px] sm:h-[300px] lg:h-[400px] bg-gray-100 overflow-hidden rounded-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2034.8234567890123!2d18.0876543!3d59.3123456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x465f77e2f7654321%3A0x1234567890abcdef!2sHammarby%20all%C3%A9%2051B%2C%20120%2030%20Stockholm%2C%20Sweden!5e0!3m2!1sen!2sse!4v1234567890123!5m2!1sen!2sse&style=feature:all|saturation:-100|lightness:20"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'grayscale(100%)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
              />
            </div>

            {/* Business hours and Address */}
            <div className="text-sm leading-relaxed space-y-4">
              {/* Business hours */}
              <div className="text-neutral-600">
                <p className="flex items-center gap-2">
                  <span>🕘</span>
                  <span>09:00-18:00</span>
                </p>
              </div>

              {/* Address */}
              <div className="text-neutral-600">
                <p className="flex items-start gap-2">
                  <span className="filter grayscale mt-0.5">🏠</span>
                  <span>Hammarby allé 51B<br />120 30 Stockholm Sweden</span>
                </p>
              </div>
            </div>
          </div>

          {/* Right column: Company info and logo */}
          <div className="space-y-6 order-1 lg:order-2">
            {/* Company logo */}
            <div className="flex justify-center h-0 sm:h-10 justify-end sm:justify-start">
              <img
                src="/kontrast-logo-4.png"
                alt="Kontrast logo"
                width={700}
                height={120}
                className="h-0 sm:h-10 w-auto object-contain"
              />
            </div>

            {/* Company info */}
            <div className="flex grid grid-cols-[30%_70%]">
              <div className="text-center lg:text-left">
                <h3 className="font-semibold tracking-[0.2em] text-neutral-900 mb-4 text-lg">
                  Kontrast AB
                </h3>
                <div className="text-neutral-600 space-y-3 text-sm">
                  <p className="flex items-center justify-center lg:justify-start gap-2">
                    <span>📧</span>
                    <a 
                      href="mailto:info@kontrastarkitekter.se"
                      className="hover:text-neutral-900 transition-colors touch-manipulation"
                    >
                      info@kontrastarkitekter.se
                    </a>
                  </p>
                  <p className="flex items-center justify-center lg:justify-start gap-2">
                    <span>📞</span>
                    <a 
                      href="tel:+4676XXXXXXX"
                      className="hover:text-neutral-900 transition-colors touch-manipulation"
                    >
                      +46 76 XXX XX XX
                    </a>
                  </p>
                </div>
              </div>
              {/* Logo circle */}
              <div className="flex justify-start">
                <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center">
                  <Image
                    src="/Kontrast-logo.png"
                    alt="Kontrast logo"
                    width={32}
                    height={32}
                    priority
                    className="w-16 h-16 object-contain filter brightness-0 invert"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
