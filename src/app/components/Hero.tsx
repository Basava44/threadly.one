"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import heroImg from "@/app/assets/hero-cover.png";
import { heroBadges } from "@/app/data/products";

const badgeIcons = [
  <svg key="heart" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>,
  <svg key="star" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>,
  <svg key="sun" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" /></svg>,
  <svg key="gift" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="8" width="18" height="4" rx="1" /><path d="M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" /><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" /></svg>,
];

const fadeSlide = (delay: number) => ({
  initial: { opacity: 0, x: -30 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.7, delay, ease: "easeOut" as const },
});

const fadeIn = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: "easeOut" as const },
});

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center min-h-[80vh] py-12 lg:py-0 gap-8 lg:gap-0">
          {/* Text content */}
          <div className="flex-1 flex flex-col justify-center z-10 text-center lg:text-left">
            <motion.p
              {...fadeSlide(0)}
              className="text-[10px] tracking-[0.3em] uppercase text-foreground/50 mb-4"
            >
              Made for you. Made to last.
            </motion.p>

            <motion.h1
              {...fadeSlide(0.15)}
              className="text-5xl sm:text-6xl lg:text-7xl font-light leading-[1.05] tracking-tight mb-6"
            >
              Tiny details.
              <br />
              Big vibe.
            </motion.h1>

            <motion.p
              {...fadeIn(0.35)}
              className="text-base text-foreground/60 max-w-md mb-8 mx-auto lg:mx-0"
            >
              Custom embroidered caps, tees & totes made just for you.
            </motion.p>

            <motion.div
              {...fadeIn(0.5)}
              className="flex flex-wrap gap-3 justify-center lg:justify-start mb-10"
            >
              <Link
                href="/customize"
                className="px-6 py-3 bg-foreground text-cream text-[11px] tracking-[0.15em] uppercase rounded-sm hover:bg-accent-dark transition-colors"
              >
                Customise Now
              </Link>
            </motion.div>

            <motion.div
              {...fadeIn(0.65)}
              className="flex flex-wrap gap-6 justify-center lg:justify-start"
            >
              {heroBadges.map((badge, i) => (
                <div key={badge.label} className="flex items-center gap-2 text-foreground/50">
                  {badgeIcons[i]}
                  <span className="text-[10px] tracking-[0.1em] uppercase">
                    {badge.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Hero image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="flex-1 relative w-full lg:w-auto"
          >
            <Image
              src={heroImg}
              alt="Threadly custom embroidered caps, tees and totes"
              className="w-full h-auto object-cover rounded-sm"
              priority
              placeholder="blur"
            />
            {/* Color dots */}
            <div className="hidden lg:flex flex-col gap-3 absolute right-4 top-1/2 -translate-y-1/2">
              {[
                { color: "#1A1A1A", label: "BLACK" },
                { color: "#D4C5A9", label: "BEIGE" },
              ].map((dot) => (
                <div key={dot.label} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full border border-foreground/20"
                    style={{ backgroundColor: dot.color }}
                  />
                  <span className="text-[8px] tracking-[0.15em] text-foreground/50">
                    {dot.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
