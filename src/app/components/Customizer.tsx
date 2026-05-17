"use client";

import { useState, useRef, useEffect, useCallback } from "react";
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
import { getTextColor } from "./ProductSVGs";
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
    productParam && ["cap", "tee", "tote"].includes(productParam) ? productParam : "tee"
  );
  const [size, setSize] = useState("M");
  const [fontStyle, setFontStyle] = useState("serif");
  const [fontSize, setFontSize] = useState(1);
  const [activeView, setActiveView] = useState<"front" | "back">("front");
  const [textPos, setTextPos] = useState<Record<"front" | "back", { x: number; y: number }>>({
    front: { x: 50, y: 50 },
    back: { x: 50, y: 50 },
  });

  useEffect(() => {
    if (product === "tote" && window.innerWidth < 768) {
      setTextPos({ front: { x: 50, y: 55 }, back: { x: 50, y: 55 } });
    } else {
      setTextPos({ front: { x: 50, y: 50 }, back: { x: 50, y: 50 } });
    }
  }, [product]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const viewerRef = useRef<HTMLDivElement>(null);
  const glRef = useRef<any>(null);
  const handleGlReady = useCallback((gl: any) => { glRef.current = gl; }, []);
  const [toast, setToast] = useState("");
  const [sizeChartOpen, setSizeChartOpen] = useState(false);
  const [textError, setTextError] = useState(false);
  const [productState, setProductState] = useState<
    Record<CustomizerProduct, { color: string; frontText: string; backText: string }>
  >({
    cap: { color: customizerColors[0].hex, frontText: "", backText: "" },
    tee: { color: customizerColors[0].hex, frontText: "", backText: "" },
    tote: { color: customizerColors[0].hex, frontText: "", backText: "" },
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
          [item.product]: { color: item.color, frontText: item.text || "", backText: item.backText || "" },
        }));
      }
    }
  }, [editId]);

  const color = productState[product].color;
  const text = product === "cap" ? productState[product].frontText : (activeView === "front" ? productState[product].frontText : productState[product].backText);

  const setColor = (hex: string) =>
    setProductState((prev) => ({ ...prev, [product]: { ...prev[product], color: hex } }));
  const setText = (val: string | ((prev: string) => string)) => {
    const key = product === "cap" || activeView === "front" ? "frontText" : "backText";
    setProductState((prev) => ({
      ...prev,
      [product]: {
        ...prev[product],
        [key]: typeof val === "function" ? val(prev[product][key]) : val,
      },
    }));
  };

  const textColor = getTextColor(color);
  const price = productPrices[product];

  // Drag handlers for text overlay
  const currentPos = textPos[activeView];
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    const rect = viewerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setDragOffset({
      x: clientX - (rect.left + (currentPos.x / 100) * rect.width),
      y: clientY - (rect.top + (currentPos.y / 100) * rect.height),
    });
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !viewerRef.current) return;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    const rect = viewerRef.current.getBoundingClientRect();
    const x = ((clientX - dragOffset.x - rect.left) / rect.width) * 100;
    const y = ((clientY - dragOffset.y - rect.top) / rect.height) * 100;
    setTextPos((prev) => ({ ...prev, [activeView]: { x: Math.max(10, Math.min(90, x)), y: Math.max(10, Math.min(90, y)) } }));
  };

  const handleDragEnd = () => setIsDragging(false);

  // Capture screenshot of the 3D canvas + text overlay
  const captureScreenshot = (view: "front" | "back"): string | undefined => {
    const gl = glRef.current;
    if (!gl || !viewerRef.current) return undefined;
    const threeCanvas = gl.domElement;
    const width = threeCanvas.width;
    const height = threeCanvas.height;

    const fullCanvas = document.createElement("canvas");
    fullCanvas.width = width;
    fullCanvas.height = height;
    const fullCtx = fullCanvas.getContext("2d");
    if (!fullCtx) return undefined;

    fullCtx.drawImage(threeCanvas, 0, 0);

    // Draw text overlay for tee/tote
    const viewText = view === "front" ? productState[product].frontText : productState[product].backText;
    if (product !== "cap" && viewText) {
      const pos = textPos[view];
      // Calculate position relative to the canvas element (not the viewer div)
      const canvasRect = threeCanvas.getBoundingClientRect();
      const viewerRect = viewerRef.current.getBoundingClientRect();
      const offsetX = canvasRect.left - viewerRect.left;
      const offsetY = canvasRect.top - viewerRect.top;
      const pixelRatio = width / canvasRect.width;

      // Convert viewer-relative % to canvas pixel coords
      const xInViewer = (pos.x / 100) * viewerRect.width;
      const yInViewer = (pos.y / 100) * viewerRect.height;
      const xOnCanvas = (xInViewer - offsetX) * pixelRatio;
      const yOnCanvas = (yInViewer - offsetY) * pixelRatio;

      const scaledFontSize = Math.round(16 * fontSize) * pixelRatio;
      const fontFamily = fontStyle === "sans" ? "sans-serif" : fontStyle === "script" ? "cursive" : "serif";
      const fontWeight = fontStyle === "sans" ? "600" : "400";
      const fontItalic = fontStyle === "serif" ? "italic " : "";
      fullCtx.font = `${fontItalic}${fontWeight} ${scaledFontSize}px ${fontFamily}`;
      fullCtx.fillStyle = textColor;
      fullCtx.textAlign = "center";
      fullCtx.textBaseline = "middle";
      fullCtx.fillText(viewText, xOnCanvas, yOnCanvas);
    }

    return fullCanvas.toDataURL("image/png", 0.7);
  };


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
            ref={viewerRef}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.33, 1, 0.68, 1] }}
            className="w-full lg:w-1/2 flex items-center justify-center bg-cream rounded-lg border border-foreground/8 h-[300px] sm:min-h-[520px] relative group"
            suppressHydrationWarning
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchMove={handleDragMove}
            onTouchEnd={handleDragEnd}
          >
            <div className="absolute bottom-4 right-4 flex items-center gap-1.5 text-[9px] tracking-[0.1em] text-foreground/50">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Live preview
            </div>
            {/* Front/Back toggle */}
            {product !== "cap" && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
                <div className="flex bg-white/80 backdrop-blur-sm rounded-full p-1 shadow-sm border border-foreground/8">
                  {(["front", "back"] as const).map((view) => (
                    <button
                      key={view}
                      onClick={() => setActiveView(view)}
                      className={`px-4 py-1.5 text-[10px] tracking-[0.1em] uppercase font-medium rounded-full transition-all ${
                        activeView === view
                          ? "bg-foreground text-cream shadow-sm"
                          : "text-foreground/60 hover:text-foreground"
                      }`}
                    >
                      {view}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <ProductViewer3D
              product={product}
              color={color}
              text={product === "cap" ? text : ""}
              textColor={textColor}
              fontStyle={fontStyle}
              fontSize={fontSize}
              viewAngle={activeView === "back" ? Math.PI : 0}
              enableZoom
              onGlReady={handleGlReady}
            />
            {/* Draggable text overlay (tee & tote only) */}
            {text && !isDragging && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 bg-foreground/70 text-white text-xs px-3 py-1 rounded-full pointer-events-none">
                Drag text to reposition
              </div>
            )}
            {text && (
              <div
                className="absolute select-none z-10"
                style={{
                  left: `${currentPos.x}%`,
                  top: `${currentPos.y}%`,
                  transform: "translate(-50%, -50%)",
                  cursor: isDragging ? "grabbing" : "grab",
                }}
                onMouseDown={handleDragStart}
                onTouchStart={handleDragStart}
              >
                <div className="relative group">
                  <span
                    className={`px-2 py-1 whitespace-nowrap ${
                      fontStyle === "serif" ? "font-serif italic font-light" :
                      fontStyle === "script" ? "font-[cursive]" :
                      "font-sans font-semibold tracking-wide"
                    }`}
                    style={{ color: textColor, fontSize: `${Math.round((product === "cap" ? 12 : 16) * fontSize)}px` }}
                  >
                    {text}
                  </span>
                  <div className="absolute inset-0 border border-dashed border-foreground/30 -m-1 rounded opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            )}
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
              <div className="flex gap-1.5 md:gap-2">
                {(["tee", "tote", "cap"] as CustomizerProduct[]).map((p) => (
                  <motion.button
                    key={p}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setProduct(p)}
                    className={`flex-1 px-2 py-1.5 md:px-3 md:py-2.5 text-[9px] md:text-[10px] tracking-[0.1em] uppercase rounded-sm border transition-all duration-200 ${
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

            {/* Font style */}
            <div>
              <label className="text-[10px] tracking-[0.2em] uppercase text-foreground/55 mb-3 block">
                Font Style
              </label>
              <div className="flex gap-2">
                {([
                  { label: "Serif", value: "serif", cls: "font-serif italic" },
                  { label: "Sans", value: "sans", cls: "font-sans font-semibold tracking-wide" },
                  { label: "Script", value: "script", cls: "font-[cursive]" },
                ] as const).map((f) => (
                  <motion.button
                    key={f.value}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setFontStyle(f.value)}
                    className={`flex-1 px-3 py-2.5 text-[11px] rounded-sm border transition-all duration-200 ${f.cls} ${
                      fontStyle === f.value
                        ? "bg-foreground text-cream border-foreground shadow-sm"
                        : "bg-transparent text-foreground/60 border-foreground/15 hover:border-foreground/30"
                    }`}
                  >
                    {f.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Font size */}
            <div>
              <label className="text-[10px] tracking-[0.2em] uppercase text-foreground/55 mb-3 block">
                Text Size
              </label>
              <div className="flex gap-2">
                {([
                  { label: "Small", value: 0.8 },
                  { label: "Medium", value: 1 },
                  { label: "Large", value: 1.4 },
                  { label: "XL", value: 1.8 },
                ] as const).map((f) => (
                  <motion.button
                    key={f.label}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setFontSize(f.value)}
                    className={`flex-1 px-3 py-2.5 text-[10px] tracking-[0.1em] uppercase rounded-sm border transition-all duration-200 ${
                      fontSize === f.value
                        ? "bg-foreground text-cream border-foreground shadow-sm"
                        : "bg-transparent text-foreground/60 border-foreground/15 hover:border-foreground/30"
                    }`}
                  >
                    {f.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Text input */}
            <div>
              <label className="text-[10px] tracking-[0.2em] uppercase text-foreground/55 mb-3 block">
                {product === "cap" ? "Your Initials / Text" : `Text — ${activeView}`}
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
                  <span className="text-[9px] text-red-500">Please add text on at least one side</span>
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
                onClick={async () => {
                  const frontText = productState[product].frontText;
                  const backText = productState[product].backText;
                  if (!frontText.trim() && !backText.trim()) {
                    setTextError(true);
                    return;
                  }
                  setTextError(false);

                  // Capture front screenshot
                  setActiveView("front");
                  await new Promise((r) => setTimeout(r, 300));
                  const frontImage = captureScreenshot("front");

                  // Capture back screenshot if back text exists
                  let backImage: string | undefined;
                  if (backText.trim() && product !== "cap") {
                    setActiveView("back");
                    await new Promise((r) => setTimeout(r, 300));
                    backImage = captureScreenshot("back");
                  }

                  setActiveView("front");

                  const printSizeLabel = fontSize === 0.8 ? "Small" : fontSize === 1 ? "Medium" : fontSize === 1.4 ? "Large" : "XL";
                  const cartText = [frontText, backText].filter(Boolean).join(" / ");

                  if (editId) {
                    updateCartItem(editId, { product, color, text: cartText, backText, size, price, printSize: printSizeLabel, frontImage, backImage });
                    router.push("/cart");
                  } else {
                    addToCart({ product, color, text: cartText, backText, size, quantity: 1, price, printSize: printSizeLabel, frontImage, backImage });
                    setProductState((prev) => ({
                      ...prev,
                      [product]: { ...prev[product], frontText: "", backText: "" },
                    }));
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
