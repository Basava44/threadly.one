"use client";

import { motion } from "motion/react";
import { ShieldCheck, Gem, Truck } from "lucide-react";
import { features } from "@/app/data/products";

const featureIcons = [
  <ShieldCheck key="shield" size={20} strokeWidth={1.5} />,
  <Gem key="gem" size={20} strokeWidth={1.5} />,
  <Truck key="truck" size={20} strokeWidth={1.5} />,
];

export function FeaturesBar() {
  return (
    <section className="py-12 bg-foreground text-cream relative overflow-hidden">
      {/* Subtle gradient accent */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 justify-items-center">
          {features.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex items-center gap-4 group"
            >
              <div className="w-10 h-10 rounded-full border border-cream/15 flex items-center justify-center text-cream/60 group-hover:border-cream/30 group-hover:text-cream/80 transition-all duration-300">
                {featureIcons[i]}
              </div>
              <div>
                <p className="text-[11px] tracking-[0.1em] uppercase font-medium">
                  {f.label}
                </p>
                <p className="text-[10px] text-cream/45 mt-0.5">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
