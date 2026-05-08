"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import logo from "@/app/assets/logo.png";

const helpLinks = [
  { label: "Shipping & Orders", href: "/terms" },
  { label: "FAQs", href: "/#faq" },
  { label: "Contact Us", href: "/contact" },
  { label: "Feedback", href: "/feedback" },
];

const companyLinks = [
  { label: "Our Story", href: "/about" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms" },
];

export function Footer() {
  return (
    <footer className="bg-foreground text-cream pt-16 pb-8 relative overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-block mb-4 group">
              <Image
                src={logo}
                alt="threadly.one"
                width={200}
                height={80}
                className="h-16 w-auto brightness-0 invert transition-opacity group-hover:opacity-80"
              />
            </Link>
            <p className="text-xs text-cream/50 leading-relaxed max-w-[240px]">
              Custom embroidered accessories made just for you. Tiny details.
              Big vibe.
            </p>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-[10px] tracking-[0.25em] uppercase font-medium mb-5 text-cream/70">
              Help
            </h4>
            <ul className="flex flex-col gap-3">
              {helpLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-xs text-cream/45 hover:text-cream transition-colors duration-200 hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[10px] tracking-[0.25em] uppercase font-medium mb-5 text-cream/70">
              Company
            </h4>
            <ul className="flex flex-col gap-3">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-xs text-cream/45 hover:text-cream transition-colors duration-200 hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="border-t border-cream/10 pt-8 pb-8"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-cream/40">
              Follow us on Instagram for daily inspiration
            </p>
            <a
              href="https://www.instagram.com/threadly.one/"
              target="_blank"
              className="text-[11px] tracking-[0.15em] uppercase text-cream/60 hover:text-cream border border-cream/20 hover:border-cream/40 px-5 py-2.5 rounded-sm transition-all duration-300"
            >
              @threadly.one
            </a>
          </div>
        </motion.div>

        <div className="border-t border-cream/10 pt-6 text-center">
          <p className="text-[10px] text-cream/30 tracking-[0.1em]">
            &copy; 2026 threadly.one. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
