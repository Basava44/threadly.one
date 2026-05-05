"use client";

import { motion } from "motion/react";
import { Hand, Pencil, Scissors, Truck } from "lucide-react";
import { howItWorks } from "@/app/data/products";

const stepIcons = [
  <Hand key="choose" size={24} strokeWidth={1.5} />,
  <Pencil key="customise" size={24} strokeWidth={1.5} />,
  <Scissors key="craft" size={24} strokeWidth={1.5} />,
  <Truck key="deliver" size={24} strokeWidth={1.5} />,
];

export function HowItWorks() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-[11px] tracking-[0.3em] uppercase text-foreground/50 text-center mb-12">
          How It Works
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {howItWorks.map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12, ease: "easeOut" }}
              className="text-center"
            >
              <div className="flex items-center justify-center mb-4 text-foreground/40">
                {stepIcons[i]}
              </div>
              <div className="text-[10px] tracking-[0.15em] text-foreground/40 mb-1">
                {item.step}.
              </div>
              <h3 className="text-xs font-medium tracking-[0.2em] uppercase mb-2">
                {item.title}
              </h3>
              <p className="text-[11px] text-foreground/50 leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
