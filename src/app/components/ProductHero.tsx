"use client";

import Image, { type StaticImageData } from "next/image";
import { motion } from "motion/react";

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
    <section className="py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`flex flex-col ${
            reverse ? "lg:flex-row-reverse" : "lg:flex-row"
          } items-center gap-10 lg:gap-16`}
        >
          {/* Image */}
          <motion.div
            initial={{ scale: 1.08, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="flex-1 w-full overflow-hidden rounded-sm"
          >
            <Image
              src={image}
              alt={imageAlt}
              className="w-full h-auto object-cover"
              placeholder="blur"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </motion.div>

          {/* Text */}
          <div className="flex-1 text-center lg:text-left">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-3xl sm:text-4xl lg:text-5xl font-light leading-tight tracking-tight mb-4"
            >
              {headline}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              className="text-sm text-foreground/60 max-w-md mb-6 mx-auto lg:mx-0"
            >
              {description}
            </motion.p>
            <motion.a
              href={ctaHref}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="inline-block px-6 py-3 bg-foreground text-cream text-[11px] tracking-[0.15em] uppercase rounded-sm hover:bg-accent-dark transition-colors mb-8"
            >
              {ctaText}
            </motion.a>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              className="flex flex-wrap gap-4 justify-center lg:justify-start"
            >
              {badges.map((badge) => (
                <span
                  key={badge}
                  className="text-[10px] tracking-[0.1em] uppercase text-foreground/40"
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
