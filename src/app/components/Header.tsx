"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, X, Menu } from "lucide-react";
import logo from "@/app/assets/logo.png";

const navLinks = [
  { label: "HOME", href: "/" },
  { label: "PRODUCTS", href: "/products" },
  { label: "CUSTOMISE", href: "/customize" },
  { label: "TRACK ORDER", href: "/track" },
  { label: "ABOUT US", href: "/about" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur-sm border-b border-foreground/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/">
          <Image src={logo} alt="threadly.one" width={240} height={96} className="h-22 w-auto" priority />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-[11px] tracking-[0.2em] text-foreground/70 hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Icons */}
        <div className="flex items-center gap-4">

          {/* Cart */}
          <Link href="/cart" aria-label="Cart" className="relative text-foreground/70 hover:text-foreground transition-colors">
            <ShoppingBag size={18} strokeWidth={1.5} />
          </Link>

          {/* Mobile hamburger */}
          <button
            aria-label="Menu"
            className="md:hidden text-foreground/70 hover:text-foreground transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="md:hidden border-t border-foreground/5 bg-cream px-4 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-[12px] tracking-[0.2em] text-foreground/70 hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
