"use client";

import React from "react";
import Image from "next/image";

export default function KontaktPage() {
  return (
    <section className="pl-10 mt-14 space-y-6">
      {/* Page title */}
      <div className="grid gap-4 mr-auto sm:gap-8 lg:grid-cols-[40%_40%_20%]">
        {/* Left column: Title, Map, Hours, Address */}
        <div className="space-y-6">
          <span className="text-sm font-light tracking-[0.45em]">KONTAKT</span>
          {/* Map */}
          <div className="relative mt-2 h-[300px] sm:h-[400px] lg:h-[500px] bg-gray-100 overflow-hidden">
            {/* Google Maps Embed with grayscale styling */}
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
          <div className="text-sm leading-relaxed space-y-2">
            {/* Business hours */}
            <div className="text-neutral-600">
              <p>🕘 09:00-18:00</p>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <div className="text-neutral-600">
                <p><span className="filter grayscale">🏠</span> Hammarby allé 51B, 120 30 Stockholm, Sweden</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Company name, email, phone, logo */}
        <div className="mt-2 space-y-6">
          <span className="text-sm font-light tracking-[0.45em]">&nbsp;</span>
          <Image
            src="/Kontrast-logo-4.png"
            alt="Kontrast logo"
            width={300}
            height={80}
            className="object-contain"
          />
          {/* Logo */}
          <div className="flex grid grid-cols-[40%_40%_20%]">
          {/* Company info */}
          <div className="text-sm leading-relaxed space-y-4">
            <div>
              <h3 className="font-semibold tracking-[0.2em] text-neutral-900 mb-2">Kontrast AB</h3>
              <div className="text-neutral-600 space-y-1">
                <p>📧 info@kontrastarkitekter.se</p>
                <p>📞 +46 76 XXX XX XX</p>
              </div>
            </div>
          </div>
          <div className="flex justify-start">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">K</span>
            </div>
          </div>

          </div>

        </div>
        <div></div>
      </div>
    </section>
  );
}
