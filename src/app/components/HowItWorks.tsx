"use client";

import { motion } from "motion/react";
import { Hand, Pencil, Scissors, Truck } from "lucide-react";
import { howItWorks } from "@/app/data/products";

const stepIcons = [
  <Hand key="choose" size={22} strokeWidth={1.5} />,
  <Pencil key="customise" size={22} strokeWidth={1.5} />,
  <Scissors key="craft" size={22} strokeWidth={1.5} />,
  <Truck key="deliver" size={22} strokeWidth={1.5} />,
];

export function HowItWorks() {
  return (
    <section className="py-20 sm:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-[11px] tracking-[0.3em] uppercase text-foreground/55 text-center mb-14"
        >
          How It Works
        </motion.h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {howItWorks.map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.33, 1, 0.68, 1] }}
              className="text-center group"
            >
              <div className="relative mx-auto mb-5">
                {/* Connector line (hidden on first item) */}
                {i > 0 && (
                  <div className="hidden lg:block absolute top-1/2 -left-[calc(50%+12px)] w-[calc(100%-24px)] h-px bg-foreground/10" />
                )}
                <div className="w-14 h-14 mx-auto rounded-full border border-foreground/10 flex items-center justify-center text-foreground/50 group-hover:border-foreground/25 group-hover:text-foreground/60 group-hover:bg-warm/50 transition-all duration-300 relative z-10">
                  {stepIcons[i]}
                </div>
              </div>
              <div className="text-[10px] tracking-[0.2em] text-foreground/60 font-mono mb-1.5">
                0{item.step}
              </div>
              <h3 className="text-xs font-medium tracking-[0.15em] uppercase mb-2 text-foreground/80">
                {item.title}
              </h3>
              <p className="text-[11px] text-foreground/70 leading-relaxed max-w-[180px] mx-auto">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
