"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { Heart, Star, Sun, Gift } from "lucide-react";
import heroImg from "@/app/assets/hero-cover.png";
import { heroBadges } from "@/app/data/products";
import { Particles } from "@/components/magicui/particles";

const badgeIcons = [
  <Heart key="heart" size={14} strokeWidth={1.5} />,
  <Star key="star" size={14} strokeWidth={1.5} />,
  <Sun key="sun" size={14} strokeWidth={1.5} />,
  <Gift key="gift" size={14} strokeWidth={1.5} />,
];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Subtle particles background */}
      <Particles className="opacity-[0.03]" quantity={20} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center min-h-[85vh] py-16 lg:py-0 gap-10 lg:gap-0">
          {/* Text content */}
          <div className="flex-1 flex flex-col justify-center z-10 text-center lg:text-left">
            <motion.p
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: [0.33, 1, 0.68, 1] }}
              className="text-[10px] tracking-[0.4em] uppercase text-foreground/55 mb-5"
            >
              Made for you. Made to last.
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.33, 1, 0.68, 1] }}
              className="text-5xl sm:text-6xl lg:text-[5.5rem] font-light leading-[1.02] tracking-tight mb-7"
            >
              <span className="block">Tiny details.</span>
              <span className="block bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Big vibe.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              className="text-base sm:text-lg text-foreground/55 max-w-md mb-9 mx-auto lg:mx-0 leading-relaxed"
            >
              Custom embroidered caps, tees & totes made just for you.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45, ease: "easeOut" }}
              className="flex flex-wrap gap-4 justify-center lg:justify-start mb-12"
            >
              <Link
                href="/customize"
                className="group relative px-8 py-4 bg-foreground text-cream text-[11px] tracking-[0.15em] uppercase rounded-sm overflow-hidden transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                <span className="relative">Customise Now</span>
              </Link>
              <Link
                href="/products"
                className="px-8 py-4 border border-foreground/20 text-foreground/80 text-[11px] tracking-[0.15em] uppercase rounded-sm hover:border-foreground/40 hover:text-foreground transition-all duration-300"
              >
                View Products
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap gap-6 justify-center lg:justify-start"
            >
              {heroBadges.map((badge, i) => (
                <motion.div
                  key={badge.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.7 + i * 0.08 }}
                  className="flex items-center gap-2 text-foreground/55 hover:text-foreground/60 transition-colors duration-300"
                >
                  {badgeIcons[i]}
                  <span className="text-[10px] tracking-[0.1em] uppercase">
                    {badge.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Hero image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.33, 1, 0.68, 1] }}
            className="flex-1 relative w-full lg:w-auto"
          >
            {/* Glow effect behind image */}
            <div className="absolute inset-0 bg-gradient-to-br from-warm/50 via-transparent to-warm/30 rounded-lg blur-3xl scale-110 opacity-60" />
            <Image
              src={heroImg}
              alt="Threadly custom embroidered caps, tees and totes"
              className="w-full h-auto object-cover rounded-sm relative z-10"
              priority
              placeholder="blur"
            />
            {/* Color dots */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="hidden lg:flex flex-col gap-3 absolute right-4 top-1/2 -translate-y-1/2 z-20"
            >
              {[
                { color: "#1A1A1A", label: "BLACK" },
                { color: "#D4C5A9", label: "BEIGE" },
              ].map((dot) => (
                <div key={dot.label} className="flex items-center gap-2 group cursor-pointer">
                  <div
                    className="w-3.5 h-3.5 rounded-full border border-foreground/20 group-hover:scale-125 transition-transform duration-200"
                    style={{ backgroundColor: dot.color }}
                  />
                  <span className="text-[8px] tracking-[0.15em] text-foreground/50 group-hover:text-foreground/80 transition-colors">
                    {dot.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
