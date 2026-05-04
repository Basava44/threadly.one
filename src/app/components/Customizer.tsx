"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  customizerColors,
  customizerProducts,
  productPrices,
  type CustomizerProduct,
} from "@/app/data/products";

function getTextColor(bgHex: string) {
  const r = parseInt(bgHex.slice(1, 3), 16);
  const g = parseInt(bgHex.slice(3, 5), 16);
  const b = parseInt(bgHex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#1A1A1A" : "#F5F0E8";
}

function CapSVG({ color, text, textColor }: { color: string; text: string; textColor: string }) {
  return (
    <svg viewBox="0 0 200 180" className="w-full max-w-[340px]">
      <ellipse cx="100" cy="140" rx="85" ry="20" fill={color} opacity="0.3" />
      <path d="M40 100 C40 55, 160 55, 160 100 L155 115 C155 120, 145 130, 100 130 C55 130, 45 120, 45 115 Z" fill={color} stroke={color} strokeWidth="1" />
      <path d="M35 105 C35 105, 30 115, 35 120 C40 125, 55 132, 100 132 C145 132, 160 125, 165 120 C170 115, 165 105, 165 105" fill={color} stroke={color === "#1A1A1A" ? "#333" : "#00000015"} strokeWidth="0.5" />
      <text x="100" y="98" textAnchor="middle" fill={textColor} fontSize="18" fontFamily="var(--font-geist-sans)" fontStyle="italic" fontWeight="300" letterSpacing="1">
        {text || "A|K"}
      </text>
    </svg>
  );
}

function TeeSVG({ color, text, textColor }: { color: string; text: string; textColor: string }) {
  return (
    <svg viewBox="0 0 200 220" className="w-full max-w-[340px]">
      <ellipse cx="100" cy="200" rx="60" ry="10" fill={color} opacity="0.2" />
      <path d="M70 40 L50 40 L25 70 L45 80 L55 65 L55 185 L145 185 L145 65 L155 80 L175 70 L150 40 L130 40 C130 40, 125 55, 100 55 C75 55, 70 40, 70 40 Z" fill={color} stroke={color === "#1A1A1A" ? "#333" : "#00000010"} strokeWidth="0.5" />
      <text x="100" y="120" textAnchor="middle" fill={textColor} fontSize="16" fontFamily="var(--font-geist-sans)" fontStyle="italic" fontWeight="300" letterSpacing="1">
        {text || "A|K"}
      </text>
    </svg>
  );
}

function ToteSVG({ color, text, textColor }: { color: string; text: string; textColor: string }) {
  return (
    <svg viewBox="0 0 200 220" className="w-full max-w-[340px]">
      <ellipse cx="100" cy="205" rx="55" ry="8" fill={color} opacity="0.2" />
      <path d="M65 60 C65 30, 135 30, 135 60" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" />
      <rect x="45" y="60" width="110" height="140" rx="3" fill={color} stroke={color === "#1A1A1A" ? "#333" : "#00000010"} strokeWidth="0.5" />
      <text x="100" y="140" textAnchor="middle" fill={textColor} fontSize="16" fontFamily="var(--font-geist-sans)" fontStyle="italic" fontWeight="300" letterSpacing="1">
        {text || "R|S"}
      </text>
    </svg>
  );
}

const productLabels: Record<CustomizerProduct, string> = {
  cap: "Bucket Cap",
  tee: "Oversized Tee",
  tote: "Tote Bag",
};

const productSVGs = { cap: CapSVG, tee: TeeSVG, tote: ToteSVG };

export function Customizer() {
  const [product, setProduct] = useState<CustomizerProduct>("cap");
  const [color, setColor] = useState(customizerColors[0].hex);
  const [text, setText] = useState("");

  const textColor = getTextColor(color);
  const price = productPrices[product];

  const ProductSVG = productSVGs[product];

  return (
    <section id="customise" className="min-h-[calc(100vh-4rem)] flex items-center bg-warm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 w-full">
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-[10px] tracking-[0.3em] uppercase text-foreground/40 text-center mb-2"
        >
          Made just for you
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-center mb-4"
        >
          Customise Yours
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="text-sm text-foreground/50 text-center mb-14 max-w-md mx-auto"
        >
          Pick your product, choose a colour, add your initials — and see it come to life.
        </motion.p>

        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 max-w-5xl mx-auto">
          {/* Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex-1 flex items-center justify-center p-12 sm:p-16 bg-cream rounded-sm min-h-[380px] sm:min-h-[440px]"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={product + color}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <ProductSVG color={color} text={text} textColor={textColor} />
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex-1 flex flex-col gap-8 w-full lg:w-auto"
          >
            {/* Product picker */}
            <div>
              <label className="text-[11px] tracking-[0.2em] uppercase text-foreground/50 mb-3 block">
                Product
              </label>
              <div className="flex gap-2.5">
                {customizerProducts.map((p) => (
                  <motion.button
                    key={p}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setProduct(p)}
                    className={`px-5 py-2.5 text-[11px] tracking-[0.1em] uppercase rounded-sm border transition-colors ${
                      product === p
                        ? "bg-foreground text-cream border-foreground"
                        : "bg-transparent text-foreground/70 border-foreground/20 hover:border-foreground/40"
                    }`}
                  >
                    {productLabels[p]}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Color picker */}
            <div>
              <label className="text-[11px] tracking-[0.2em] uppercase text-foreground/50 mb-3 block">
                Colour
              </label>
              <div className="flex gap-3.5">
                {customizerColors.map((c) => (
                  <motion.button
                    key={c.name}
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 1.1 }}
                    onClick={() => setColor(c.hex)}
                    title={c.name}
                    className={`w-10 h-10 rounded-full border-2 transition-colors ${
                      color === c.hex
                        ? "border-foreground"
                        : "border-foreground/15 hover:border-foreground/30"
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </div>

            {/* Text input */}
            <div>
              <label className="text-[11px] tracking-[0.2em] uppercase text-foreground/50 mb-3 block">
                Your Initials / Text
              </label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value.slice(0, 12))}
                placeholder="e.g. A|K"
                maxLength={12}
                className="w-full px-5 py-3.5 bg-cream border border-foreground/15 rounded-sm text-base placeholder:text-foreground/30 focus:outline-none focus:border-foreground/40 transition-colors"
              />
              <span className="text-[9px] text-foreground/40 mt-1 block">
                {text.length}/12 characters
              </span>
            </div>

            {/* Symbols */}
            <div>
              <label className="text-[11px] tracking-[0.2em] uppercase text-foreground/50 mb-3 block">
                Add Symbol
              </label>
              <div className="flex gap-2">
                {["♡", "★", "&", "✦", "|", "~"].map((symbol) => (
                  <motion.button
                    key={symbol}
                    whileTap={{ scale: 0.85 }}
                    onClick={() => setText((prev) => (prev + symbol).slice(0, 12))}
                    className="w-10 h-10 flex items-center justify-center text-sm text-foreground/60 border border-foreground/15 rounded-sm hover:border-foreground/40 hover:text-foreground transition-colors bg-cream"
                  >
                    {symbol}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* CTA */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-foreground text-cream text-[12px] tracking-[0.15em] uppercase rounded-sm hover:bg-accent-dark transition-colors mt-2"
            >
              Add to Cart — ₹{price.toLocaleString("en-IN")}
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
