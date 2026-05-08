"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingBag, Check, X, Ruler } from "lucide-react";
import {
  customizerColors,
  customizerProducts,
  productPrices,
  type CustomizerProduct,
} from "@/app/data/products";
import { addToCart, getCart, updateCartItem } from "@/app/data/cart";
import { getTextColor, productSVGs } from "./ProductSVGs";
import dynamic from "next/dynamic";

const ProductViewer3D = dynamic(
  () => import("./ProductViewer3D").then((mod) => ({ default: mod.ProductViewer3D })),
  { ssr: false }
);

const productLabels: Record<CustomizerProduct, string> = {
  cap: "Bucket Cap",
  tee: "Oversized Tee",
  tote: "Tote Bag",
};

export function Customizer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const productParam = searchParams.get("product") as CustomizerProduct | null;
  const inputRef = useRef<HTMLInputElement>(null);
  const cursorPosRef = useRef<number>(0);
  const [product, setProduct] = useState<CustomizerProduct>(
    productParam && ["cap", "tee", "tote"].includes(productParam) ? productParam : "cap"
  );
  const [size, setSize] = useState("M");
  const [toast, setToast] = useState("");
  const [sizeChartOpen, setSizeChartOpen] = useState(false);
  const [textError, setTextError] = useState(false);
  const [productState, setProductState] = useState<
    Record<CustomizerProduct, { color: string; text: string }>
  >({
    cap: { color: customizerColors[0].hex, text: "" },
    tee: { color: customizerColors[0].hex, text: "" },
    tote: { color: customizerColors[0].hex, text: "" },
  });

  useEffect(() => {
    if (editId) {
      const cart = getCart();
      const item = cart.find((i) => i.id === editId);
      if (item) {
        setProduct(item.product);
        setSize(item.size || "M");
        setProductState((prev) => ({
          ...prev,
          [item.product]: { color: item.color, text: item.text },
        }));
      }
    }
  }, [editId]);

  const color = productState[product].color;
  const text = productState[product].text;

  const setColor = (hex: string) =>
    setProductState((prev) => ({ ...prev, [product]: { ...prev[product], color: hex } }));
  const setText = (val: string | ((prev: string) => string)) =>
    setProductState((prev) => ({
      ...prev,
      [product]: {
        ...prev[product],
        text: typeof val === "function" ? val(prev[product].text) : val,
      },
    }));

  const textColor = getTextColor(color);
  const price = productPrices[product];

  const ProductSVG = productSVGs[product];

  return (
    <section id="customise" className="lg:min-h-[calc(100vh-4rem)] lg:flex lg:items-center bg-warm relative overflow-hidden" suppressHydrationWarning>
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)", backgroundSize: "40px 40px" }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20 w-full relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
          className="text-center mb-8 sm:mb-12"
        >
          <p className="text-[10px] tracking-[0.4em] uppercase text-foreground/50 mb-3">
            Made just for you
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight mb-4">
            Customise Yours
          </h2>
          <p className="text-sm text-foreground/60 max-w-md mx-auto leading-relaxed">
            Pick your product, choose a colour, add your initials — and see it come to life.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row items-stretch gap-5 sm:gap-8 lg:gap-10 max-w-6xl mx-auto">
          {/* 3D Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.33, 1, 0.68, 1] }}
            className="w-full lg:w-1/2 flex items-center justify-center bg-cream rounded-lg border border-foreground/8 h-[300px] sm:min-h-[520px] relative group"
            suppressHydrationWarning
          >
            {/* Corner hints */}
            <div className="absolute top-4 left-4 text-[9px] tracking-[0.15em] uppercase text-foreground/50">
              Drag to rotate
            </div>
            <div className="absolute bottom-4 right-4 flex items-center gap-1.5 text-[9px] tracking-[0.1em] text-foreground/50">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Live preview
            </div>
            <ProductViewer3D
              product={product}
              color={color}
              text={text}
              textColor={textColor}
              enableZoom
            />
          </motion.div>

          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.33, 1, 0.68, 1] }}
            className="w-full lg:w-1/2 flex flex-col gap-5 sm:gap-7 bg-cream rounded-lg border border-foreground/8 p-5 sm:p-8"
          >
            {/* Product picker */}
            <div>
              <label className="text-[10px] tracking-[0.2em] uppercase text-foreground/55 mb-3 block">
                Product
              </label>
              <div className="flex gap-2">
                {customizerProducts.map((p) => (
                  <motion.button
                    key={p}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setProduct(p)}
                    className={`flex-1 px-3 py-2.5 text-[10px] tracking-[0.1em] uppercase rounded-sm border transition-all duration-200 ${
                      product === p
                        ? "bg-foreground text-cream border-foreground shadow-sm"
                        : "bg-transparent text-foreground/60 border-foreground/15 hover:border-foreground/30"
                    }`}
                  >
                    {productLabels[p]}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Color picker */}
            <div>
              <label className="text-[10px] tracking-[0.2em] uppercase text-foreground/55 mb-3 block">
                Colour — {customizerColors.find(c => c.hex === color)?.name || ""}
              </label>
              <div className="flex gap-3">
                {customizerColors.map((c) => (
                  <motion.button
                    key={c.name}
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 1.1 }}
                    onClick={() => setColor(c.hex)}
                    title={c.name}
                    className={`relative w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                      color === c.hex
                        ? "border-foreground scale-110"
                        : "border-foreground/10 hover:border-foreground/25"
                    }`}
                    style={{ backgroundColor: c.hex }}
                  >
                    {color === c.hex && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <Check size={14} strokeWidth={2.5} className={textColor === "#F5F0E8" ? "text-white" : "text-foreground"} />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Text input */}
            <div>
              <label className="text-[10px] tracking-[0.2em] uppercase text-foreground/55 mb-3 block">
                Your Initials / Text
              </label>
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={text}
                  onChange={(e) => { setText(e.target.value.slice(0, 20)); setTextError(false); cursorPosRef.current = e.target.selectionStart ?? 0; }}
                  onSelect={(e) => { cursorPosRef.current = (e.target as HTMLInputElement).selectionStart ?? 0; }}
                  placeholder="e.g. A|K"
                  maxLength={20}
                  className={`w-full px-5 py-3.5 bg-warm border rounded-sm text-base placeholder:text-foreground/25 focus:outline-none transition-colors ${
                    textError ? "border-red-400 focus:border-red-400" : "border-foreground/10 focus:border-foreground/30"
                  }`}
                />
                {text && (
                  <button
                    onClick={() => setText("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/45 hover:text-foreground/60 transition-colors"
                  >
                    <X size={14} strokeWidth={1.5} />
                  </button>
                )}
              </div>
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-[9px] text-foreground/45">
                  {text.length}/20 characters
                </span>
                {textError && (
                  <span className="text-[9px] text-red-500">Please add text first</span>
                )}
              </div>
            </div>

            {/* Size picker (tee only) */}
            <AnimatePresence mode="wait">
              {product === "tee" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-[10px] tracking-[0.2em] uppercase text-foreground/55">
                      Size
                    </label>
                    <button
                      onClick={() => setSizeChartOpen(true)}
                      className="flex items-center gap-1 text-[9px] tracking-[0.1em] uppercase text-foreground/60 hover:text-foreground transition-colors"
                    >
                      <Ruler size={11} strokeWidth={1.5} />
                      Size Chart
                    </button>
                  </div>
                  <div className="flex gap-2">
                    {["S", "M", "L", "XL", "XXL"].map((s) => (
                      <motion.button
                        key={s}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSize(s)}
                        className={`flex-1 px-3 py-2.5 text-[10px] tracking-[0.1em] uppercase rounded-sm border transition-all duration-200 ${
                          size === s
                            ? "bg-foreground text-cream border-foreground shadow-sm"
                            : "bg-transparent text-foreground/60 border-foreground/15 hover:border-foreground/30"
                        }`}
                      >
                        {s}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Symbols */}
            <div>
              <label className="text-[10px] tracking-[0.2em] uppercase text-foreground/55 mb-3 block">
                Add Symbol
              </label>
              <div className="flex flex-wrap gap-2">
                {["♡", "♥", "★", "✦", "&", "|", "~", "∞", "☺", "✿", "♪", "→", "•", "☆", "♠", "♣", "☾", "☀", "✈", "♛"].map((symbol) => (
                  <motion.button
                    key={symbol}
                    whileTap={{ scale: 0.85 }}
                    whileHover={{ scale: 1.08 }}
                    onClick={() => {
                      const pos = cursorPosRef.current;
                      const newText = (text.slice(0, pos) + symbol + text.slice(pos)).slice(0, 20);
                      setText(newText);
                      setTextError(false);
                      const newPos = pos + symbol.length;
                      cursorPosRef.current = newPos;
                      setTimeout(() => {
                        inputRef.current?.focus();
                        inputRef.current?.setSelectionRange(newPos, newPos);
                      }, 0);
                    }}
                    className="w-10 h-10 flex items-center justify-center text-sm text-foreground/55 border border-foreground/10 rounded-sm hover:border-foreground/25 hover:text-foreground/80 hover:bg-warm/50 transition-all duration-200"
                  >
                    {symbol}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-foreground/8" />

            {/* Price & CTA */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] tracking-[0.15em] uppercase text-foreground/55">
                  Total
                </span>
                <span className="text-xl font-light">
                  ₹{price.toLocaleString("en-IN")}
                </span>
              </div>
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => {
                  if (!text.trim()) {
                    setTextError(true);
                    return;
                  }
                  setTextError(false);
                  if (editId) {
                    updateCartItem(editId, { product, color, text, size, price });
                    router.push("/cart");
                  } else {
                    addToCart({ product, color, text, size, quantity: 1, price });
                    setText("");
                    setToast("Added to cart!");
                    setTimeout(() => setToast(""), 3000);
                  }
                }}
                className="group w-full py-4 bg-foreground text-cream text-[12px] tracking-[0.15em] uppercase rounded-sm hover:bg-accent-dark transition-all duration-300 flex items-center justify-center gap-2.5 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.07] to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                <ShoppingBag size={15} strokeWidth={1.5} className="relative z-10" />
                <span className="relative z-10">
                  {editId ? "Save Changes" : `Add to Cart — ₹${price.toLocaleString("en-IN")}`}
                </span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Size Chart Modal */}
      <AnimatePresence>
        {sizeChartOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-foreground/50 backdrop-blur-sm"
              onClick={() => setSizeChartOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: [0.33, 1, 0.68, 1] }}
              className="relative bg-cream border border-foreground/10 rounded-lg p-6 sm:p-8 max-w-md w-full shadow-2xl"
            >
              <button
                onClick={() => setSizeChartOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full border border-foreground/10 flex items-center justify-center text-foreground/55 hover:text-foreground hover:border-foreground/30 transition-all"
              >
                <X size={14} strokeWidth={1.5} />
              </button>
              <h3 className="text-lg font-light tracking-tight mb-1">Size Chart</h3>
              <p className="text-[10px] tracking-[0.15em] uppercase text-foreground/50 mb-6">Oversized Fit (in cm)</p>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-foreground/10">
                    <th className="text-left py-2.5 text-[9px] tracking-[0.15em] uppercase text-foreground/50 font-normal">Size</th>
                    <th className="text-center py-2.5 text-[9px] tracking-[0.15em] uppercase text-foreground/50 font-normal">Chest</th>
                    <th className="text-center py-2.5 text-[9px] tracking-[0.15em] uppercase text-foreground/50 font-normal">Length</th>
                    <th className="text-center py-2.5 text-[9px] tracking-[0.15em] uppercase text-foreground/50 font-normal">Shoulder</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { size: "XS", chest: "106", length: "68", shoulder: "54" },
                    { size: "S", chest: "112", length: "70", shoulder: "56" },
                    { size: "M", chest: "118", length: "72", shoulder: "58" },
                    { size: "L", chest: "124", length: "74", shoulder: "60" },
                    { size: "XL", chest: "130", length: "76", shoulder: "62" },
                  ].map((row) => (
                    <tr key={row.size} className="border-b border-foreground/5 hover:bg-warm/30 transition-colors">
                      <td className="py-3 font-medium text-sm">{row.size}</td>
                      <td className="py-3 text-center text-foreground/60 text-sm">{row.chest}</td>
                      <td className="py-3 text-center text-foreground/60 text-sm">{row.length}</td>
                      <td className="py-3 text-center text-foreground/60 text-sm">{row.shoulder}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-[9px] text-foreground/50 mt-5">
                Measurements may vary by 1-2 cm. Oversized fit — size down for a less relaxed look.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3.5 bg-cream text-foreground text-xs tracking-[0.1em] uppercase rounded-lg shadow-xl flex items-center gap-3 border border-foreground/15"
          >
            <div className="w-5 h-5 rounded-full bg-foreground/10 flex items-center justify-center">
              <Check size={11} strokeWidth={2.5} className="text-foreground" />
            </div>
            {toast}
            <button
              onClick={() => router.push("/cart")}
              className="ml-2 px-3 py-1 bg-foreground text-cream rounded-sm transition-colors hover:bg-accent-dark"
            >
              View Cart
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
