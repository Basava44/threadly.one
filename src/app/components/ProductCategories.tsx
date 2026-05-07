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
          <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/40 mb-3">
            Shop by category
          </p>
          <h2 className="text-2xl sm:text-3xl font-light tracking-tight">
            What we make
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: [0.33, 1, 0.68, 1] }}
              className="group relative overflow-hidden rounded-lg bg-cream border border-foreground/5 hover:border-foreground/10 hover:shadow-lg transition-all duration-500"
            >
              <div className="aspect-[4/3] relative overflow-hidden">
                <Image
                  src={categoryImages[i]}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-500" />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-medium tracking-wide uppercase">
                    {cat.name}
                  </h3>
                  <ArrowUpRight
                    size={16}
                    strokeWidth={1.5}
                    className="text-foreground/30 group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300"
                  />
                </div>
                <p className="text-xs text-foreground/45 mt-1 mb-5">
                  Custom embroidery starting at ₹{cat.price}
                </p>
                <Link
                  href={`/customize?product=${cat.slug === "caps" ? "cap" : cat.slug === "tees" ? "tee" : "tote"}`}
                  className="inline-block px-5 py-2.5 bg-foreground text-cream text-[10px] tracking-[0.15em] uppercase rounded-sm hover:bg-accent-dark transition-colors duration-300"
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
