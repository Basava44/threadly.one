"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import capsImg from "@/app/assets/product-hats-display.png";
import teesImg from "@/app/assets/product-tee-dsiplay.png";
import totesImg from "@/app/assets/product-tote-display.png";
import { categories } from "@/app/data/products";

const categoryImages = [capsImg, teesImg, totesImg];

export function ProductCategories() {
  return (
    <section id="shop" className="py-16 bg-warm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15, ease: "easeOut" }}
              className="group relative overflow-hidden rounded-sm bg-cream"
            >
              <div className="aspect-[4/3] relative overflow-hidden">
                <Image
                  src={categoryImages[i]}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
              </div>
              <div className="p-5">
                <h3 className="text-sm font-medium tracking-wide uppercase">
                  {cat.name}
                </h3>
                <p className="text-xs text-foreground/50 mt-1">
                  Custom embroidery starting at ₹{cat.price}
                </p>
                <Link
                  href={`/customize?product=${cat.slug === "caps" ? "cap" : cat.slug === "tees" ? "tee" : "tote"}`}
                  className="inline-block mt-4 px-5 py-2.5 bg-foreground text-cream text-[10px] tracking-[0.15em] uppercase rounded-sm hover:bg-accent-dark transition-colors"
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
