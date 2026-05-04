"use client";

import { motion } from "motion/react";
import { howItWorks } from "@/app/data/products";

const stepIcons = [
  <svg key="choose" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v0M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8" /><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" /></svg>,
  <svg key="customise" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" /></svg>,
  <svg key="craft" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m18.5 2.5-15 15" /><path d="M12 12H3.5a2.5 2.5 0 0 1 0-5H5" /><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L7 20l-4 1 1-4Z" /></svg>,
  <svg key="deliver" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" /><path d="M15 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 13.52 9H14" /><circle cx="17" cy="18" r="2" /><circle cx="7" cy="18" r="2" /></svg>,
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
