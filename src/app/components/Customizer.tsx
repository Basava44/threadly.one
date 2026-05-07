"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
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
    <section id="customise" className="min-h-[calc(100vh-4rem)] flex items-center bg-warm" suppressHydrationWarning>
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
          {/* 3D Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex-1 flex items-center justify-center bg-cream rounded-sm h-[440px] sm:h-[500px] w-full"
            suppressHydrationWarning
          >
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
                ref={inputRef}
                type="text"
                value={text}
                onChange={(e) => { setText(e.target.value.slice(0, 20)); setTextError(false); cursorPosRef.current = e.target.selectionStart ?? 0; }}
                onSelect={(e) => { cursorPosRef.current = (e.target as HTMLInputElement).selectionStart ?? 0; }}
                placeholder="e.g. A|K"
                maxLength={20}
                className="w-full px-5 py-3.5 bg-cream border border-foreground/15 rounded-sm text-base placeholder:text-foreground/30 focus:outline-none focus:border-foreground/40 transition-colors"
              />
              <span className="text-[9px] text-foreground/40 mt-1 block">
                {text.length}/20 characters
              </span>
            </div>

            {/* Size picker (tee only) */}
            {product === "tee" && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-[11px] tracking-[0.2em] uppercase text-foreground/50">
                    Size
                  </label>
                  <button
                    onClick={() => setSizeChartOpen(true)}
                    className="text-[10px] tracking-[0.1em] uppercase text-foreground/50 underline underline-offset-2 hover:text-foreground transition-colors"
                  >
                    Size Chart
                  </button>
                </div>
                <div className="flex gap-2.5">
                  {["S", "M", "L", "XL", "XXL"].map((s) => (
                    <motion.button
                      key={s}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSize(s)}
                      className={`px-4 py-2.5 text-[11px] tracking-[0.1em] uppercase rounded-sm border transition-colors ${
                        size === s
                          ? "bg-foreground text-cream border-foreground"
                          : "bg-transparent text-foreground/70 border-foreground/20 hover:border-foreground/40"
                      }`}
                    >
                      {s}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

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
                    className="w-10 h-10 flex items-center justify-center text-sm text-foreground/60 border border-foreground/15 rounded-sm hover:border-foreground/40 hover:text-foreground transition-colors bg-cream"
                  >
                    {symbol}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* CTA */}
            {textError && (
              <p className="text-[10px] text-red-500/70 mt-1">Please add your initials or text before adding to cart.</p>
            )}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
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
              className="w-full py-4 bg-foreground text-cream text-[12px] tracking-[0.15em] uppercase rounded-sm hover:bg-accent-dark transition-colors mt-2"
            >
              {editId ? "Save Changes" : `Add to Cart — ₹${price.toLocaleString("en-IN")}`}
            </motion.button>
          </motion.div>
        </div>
      </div>
      {/* Size Chart Modal */}
      {sizeChartOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={() => setSizeChartOpen(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-cream border border-foreground/10 rounded-sm p-6 sm:p-8 max-w-md w-full shadow-xl"
          >
            <button
              onClick={() => setSizeChartOpen(false)}
              className="absolute top-4 right-4 text-foreground/40 hover:text-foreground transition-colors text-lg"
            >
              &times;
            </button>
            <h3 className="text-lg font-light tracking-tight mb-1">Size Chart</h3>
            <p className="text-[10px] tracking-[0.15em] uppercase text-foreground/40 mb-5">Oversized Fit (in cm)</p>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-foreground/10">
                  <th className="text-left py-2 text-[10px] tracking-[0.1em] uppercase text-foreground/40 font-normal">Size</th>
                  <th className="text-center py-2 text-[10px] tracking-[0.1em] uppercase text-foreground/40 font-normal">Chest</th>
                  <th className="text-center py-2 text-[10px] tracking-[0.1em] uppercase text-foreground/40 font-normal">Length</th>
                  <th className="text-center py-2 text-[10px] tracking-[0.1em] uppercase text-foreground/40 font-normal">Shoulder</th>
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
                  <tr key={row.size} className="border-b border-foreground/5">
                    <td className="py-2.5 font-medium">{row.size}</td>
                    <td className="py-2.5 text-center text-foreground/70">{row.chest}</td>
                    <td className="py-2.5 text-center text-foreground/70">{row.length}</td>
                    <td className="py-2.5 text-center text-foreground/70">{row.shoulder}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-[9px] text-foreground/40 mt-4">Measurements may vary by 1-2 cm. Oversized fit — size down for a less relaxed look.</p>
          </motion.div>
        </div>
      )}

      {/* Toast notification */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-foreground text-cream text-xs tracking-[0.1em] uppercase rounded-sm shadow-lg flex items-center gap-3"
        >
          {toast}
          <button
            onClick={() => router.push("/cart")}
            className="underline underline-offset-2 text-cream/70 hover:text-cream transition-colors"
          >
            View Cart
          </button>
        </motion.div>
      )}
    </section>
  );
}
