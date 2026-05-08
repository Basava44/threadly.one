"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import capsImg from "@/app/assets/product-hats-display.png";
import teesImg from "@/app/assets/product-tee-dsiplay.png";
import totesImg from "@/app/assets/product-tote-display.png";
import { categories } from "@/app/data/products";

const categoryImages = [capsImg, teesImg, totesImg];

export function ProductCategories() {
  return (
    <section id="shop" className="py-20 bg-warm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/55 mb-3">
            Shop by category
          </p>
          <h2 className="text-2xl sm:text-3xl font-light tracking-tight">
            What we make
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: [0.33, 1, 0.68, 1] }}
              className={`group relative overflow-hidden rounded-lg bg-cream border border-foreground/5 hover:border-foreground/10 hover:shadow-lg transition-all duration-500 ${i === 1 ? "col-span-2 sm:col-span-1 order-first sm:order-none" : ""}`}
            >
              <div className={`relative overflow-hidden ${i === 1 ? "aspect-[2/1] sm:aspect-[4/3]" : "aspect-square sm:aspect-[4/3]"}`}>
                <Image
                  src={categoryImages[i]}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  sizes="(max-width: 640px) 50vw, 33vw"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-500" />
              </div>
              <div className="p-3 sm:p-6">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-xs sm:text-sm font-medium tracking-wide uppercase">
                    {cat.name}
                  </h3>
                  <ArrowUpRight
                    size={14}
                    strokeWidth={1.5}
                    className="text-foreground/45 group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 hidden sm:block"
                  />
                </div>
                <p className="text-[10px] sm:text-xs text-foreground/60 mt-1 mb-3 sm:mb-5">
                  Starting at ₹{cat.price}
                </p>
                <Link
                  href={`/customize?product=${cat.slug === "caps" ? "cap" : cat.slug === "tees" ? "tee" : "tote"}`}
                  className="inline-block px-3 sm:px-5 py-2 sm:py-2.5 bg-foreground text-cream text-[9px] sm:text-[10px] tracking-[0.15em] uppercase rounded-sm hover:bg-accent-dark transition-colors duration-300"
                >
                  {cat.cta}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
