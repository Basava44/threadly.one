"use client";

import Image, { type StaticImageData } from "next/image";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

interface ProductHeroProps {
  headline: string;
  description: string;
  ctaText: string;
  ctaHref: string;
  badges: string[];
  image: StaticImageData;
  imageAlt: string;
  reverse?: boolean;
}

export function ProductHero({
  headline,
  description,
  ctaText,
  ctaHref,
  badges,
  image,
  imageAlt,
  reverse = false,
}: ProductHeroProps) {
  return (
    <section className="py-20 sm:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`flex flex-col ${
            reverse ? "lg:flex-row-reverse" : "lg:flex-row"
          } items-center gap-12 lg:gap-20`}
        >
          {/* Image */}
          <motion.div
            initial={{ scale: 1.05, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1, ease: [0.33, 1, 0.68, 1] }}
            className="flex-1 w-full overflow-hidden rounded-lg relative group"
          >
            {/* Subtle border glow */}
            <div className="absolute -inset-px rounded-lg bg-gradient-to-br from-foreground/5 via-transparent to-foreground/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <Image
              src={image}
              alt={imageAlt}
              className="w-full h-auto object-cover rounded-lg group-hover:scale-[1.02] transition-transform duration-700"
              placeholder="blur"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </motion.div>

          {/* Text */}
          <div className="flex-1 text-center lg:text-left">
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
              className="text-3xl sm:text-4xl lg:text-5xl font-light leading-tight tracking-tight mb-5"
            >
              {headline.split("\n").map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              className="text-sm sm:text-base text-foreground/55 max-w-md mb-7 mx-auto lg:mx-0 leading-relaxed"
            >
              {description}
            </motion.p>
            <motion.a
              href={ctaHref}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="group/btn inline-flex items-center gap-2 px-7 py-3.5 bg-foreground text-cream text-[11px] tracking-[0.15em] uppercase rounded-sm hover:bg-accent-dark transition-all duration-300 mb-8"
            >
              {ctaText}
              <ArrowRight size={14} strokeWidth={1.5} className="group-hover/btn:translate-x-1 transition-transform duration-200" />
            </motion.a>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              className="flex flex-wrap gap-3 justify-center lg:justify-start"
            >
              {badges.map((badge) => (
                <span
                  key={badge}
                  className="text-[10px] tracking-[0.1em] uppercase text-foreground/35 px-3 py-1.5 border border-foreground/8 rounded-full"
                >
                  {badge}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
