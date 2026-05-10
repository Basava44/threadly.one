"use client";

import { useState, useRef, Suspense, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Center, Environment } from "@react-three/drei";
import * as THREE from "three";
import { Palette, Type, ShoppingCart, ChevronRight, X, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { addToCart } from "@/app/data/cart";
import type { CustomizerProduct } from "@/app/data/products";
import { customizerColors, productPrices } from "@/app/data/products";

// ─── Helpers ─────────────────────────────────────────────

function getTextColor(bgHex: string) {
  const r = parseInt(bgHex.slice(1, 3), 16);
  const g = parseInt(bgHex.slice(3, 5), 16);
  const b = parseInt(bgHex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#1A1A1A" : "#F5F0E8";
}

const MODEL_PATHS: Record<CustomizerProduct, string> = {
  cap: "/models/bucket_hat.glb",
  tee: "/models/tee.glb",
  tote: "/models/tote.glb",
};


const PRODUCT_SCALE: Record<CustomizerProduct, number> = {
  cap: 2.2,
  tee: 2.5,
  tote: 0.28,
};

const SIZES = ["S", "M", "L", "XL", "XXL"];

// ─── 3D Components ──────────────────────────────────────

function ProductModel({ product, color, viewAngle }: {
  product: CustomizerProduct;
  color: string;
  viewAngle: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(MODEL_PATHS[product]);

  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child: THREE.Object3D) => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshStandardMaterial({
          color: new THREE.Color(color),
          roughness: 0.7,
          metalness: 0.05,
        });
      }
    });
    return clone;
  }, [scene, color]);

  // No useFrame rotation — rotation is set directly via the group's rotation prop below

  return (
    <group ref={groupRef} scale={PRODUCT_SCALE[product]} rotation={[0, viewAngle, 0]}>
      <Center>
        <primitive object={clonedScene} />
      </Center>
    </group>
  );
}

function LoadingSpinner() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => { if (ref.current) ref.current.rotation.z -= delta * 2; });
  return (
    <mesh ref={ref}>
      <torusGeometry args={[0.3, 0.05, 8, 32]} />
      <meshBasicMaterial color="#999" />
    </mesh>
  );
}

// Helper to expose the Three.js gl renderer
function SceneCapture({ onReady }: { onReady: (gl: THREE.WebGLRenderer) => void }) {
  const { gl } = useThree();
  useMemo(() => onReady(gl), [gl, onReady]);
  return null;
}

// ─── Main Component ─────────────────────────────────────

export default function DesignCustomizer() {
  const router = useRouter();
  const orbitRef = useRef<any>(null);
  const glRef = useRef<THREE.WebGLRenderer | null>(null);
  const handleGlReady = useCallback((gl: THREE.WebGLRenderer) => { glRef.current = gl; }, []);

  // State
  const [product, setProduct] = useState<CustomizerProduct>("tee");
  const [color, setColor] = useState(customizerColors[0].hex);
  const [size, setSize] = useState("M");
  const [activeView, setActiveView] = useState<"front" | "back">("front");
  const [isAddingText, setIsAddingText] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [showColors, setShowColors] = useState(false);
  const [zoom, setZoom] = useState(1);

  // Multiple texts per view: { front: [{text, x, y, fontSize}, ...], back: [...] }
  const [texts, setTexts] = useState<Record<string, { text: string; x: number; y: number; fontSize: number }[]>>({ front: [], back: [] });
  const [isDragging, setIsDragging] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const viewerRef = useRef<HTMLDivElement>(null);

  const textColor = getTextColor(color);
  const viewAngle = activeView === "front" ? 0 : Math.PI;
  const price = productPrices[product];
  const currentTexts = texts[activeView] || [];

  // Handlers
  const handleAddText = () => {
    if (textInput.trim()) {
      setTexts((prev) => ({
        ...prev,
        [activeView]: [...(prev[activeView] || []), { text: textInput.trim().slice(0, 20), x: 50, y: 30 + (prev[activeView]?.length || 0) * 15, fontSize: 24 }],
      }));
      setIsAddingText(false);
      setTextInput("");
    }
  };

  const handleDeleteText = (index: number) => {
    setTexts((prev) => ({
      ...prev,
      [activeView]: prev[activeView].filter((_, i) => i !== index),
    }));
  };

  const handleResizeText = (index: number, delta: number) => {
    setTexts((prev) => ({
      ...prev,
      [activeView]: prev[activeView].map((t, i) =>
        i === index ? { ...t, fontSize: Math.max(12, Math.min(48, t.fontSize + delta)) } : t
      ),
    }));
  };

  // Drag handlers
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent, index: number) => {
    e.preventDefault();
    setIsDragging(true);
    setDragIndex(index);
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    const rect = viewerRef.current?.getBoundingClientRect();
    const item = currentTexts[index];
    if (!rect || !item) return;
    setDragOffset({
      x: clientX - (rect.left + (item.x / 100) * rect.width),
      y: clientY - (rect.top + (item.y / 100) * rect.height),
    });
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || dragIndex === null || !viewerRef.current) return;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    const rect = viewerRef.current.getBoundingClientRect();
    const x = ((clientX - dragOffset.x - rect.left) / rect.width) * 100;
    const y = ((clientY - dragOffset.y - rect.top) / rect.height) * 100;
    setTexts((prev) => ({
      ...prev,
      [activeView]: prev[activeView].map((t, i) =>
        i === dragIndex ? { ...t, x: Math.max(10, Math.min(90, x)), y: Math.max(10, Math.min(90, y)) } : t
      ),
    }));
  };

  const handleDragEnd = () => { setIsDragging(false); setDragIndex(null); };

  // Capture a cropped screenshot of the 3D canvas + text overlays for a given view
  const captureView = (viewTexts: { text: string; x: number; y: number; fontSize: number }[]): string | undefined => {
    const gl = glRef.current;
    const viewer = viewerRef.current;
    if (!gl || !viewer) return undefined;

    const threeCanvas = gl.domElement;
    const width = threeCanvas.width;
    const height = threeCanvas.height;

    // First draw full composite
    const fullCanvas = document.createElement("canvas");
    fullCanvas.width = width;
    fullCanvas.height = height;
    const fullCtx = fullCanvas.getContext("2d");
    if (!fullCtx) return undefined;

    fullCtx.drawImage(threeCanvas, 0, 0);

    // Draw text overlays
    const computedTextColor = getTextColor(color);
    fullCtx.textAlign = "center";
    fullCtx.textBaseline = "middle";
    fullCtx.fillStyle = computedTextColor;

    // Scale font size from CSS pixels to canvas pixels
    const viewerWidth = viewerRef.current?.clientWidth || width;
    const pixelRatio = width / viewerWidth;

    for (const item of viewTexts) {
      const scaledFontSize = item.fontSize * pixelRatio;
      fullCtx.font = `italic 300 ${scaledFontSize}px serif`;
      const x = (item.x / 100) * width;
      const y = (item.y / 100) * height;
      fullCtx.fillText(item.text, x, y);
    }

    return fullCanvas.toDataURL("image/png", 0.8);
  };

  const handleSave = async () => {
    const allText = Object.values(texts).flat().map((t) => t.text).join(" | ");

    // Capture front view
    setActiveView("front");
    await new Promise((r) => setTimeout(r, 300));
    const frontImage = captureView(texts.front || []);

    // Only capture back if there's text on the back
    let backImage: string | undefined;
    if (texts.back && texts.back.length > 0) {
      setActiveView("back");
      await new Promise((r) => setTimeout(r, 300));
      backImage = captureView(texts.back);
    }

    setActiveView("front");

    addToCart({
      product,
      color,
      text: allText || "",
      size: product === "tee" ? size : "ONE SIZE",
      quantity: 1,
      price,
      frontImage,
      backImage,
    });
    router.push("/cart");
  };

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.2, 2));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.2, 0.6));
  const handleReset = () => { setZoom(1); setActiveView("front"); };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] bg-[#E8E8E8] relative">

      {/* ─── CENTER: 3D Product Viewer ─── */}
      <div
        ref={viewerRef}
        className="flex-1 relative min-h-[400px] lg:min-h-0"
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
      >
        <Canvas
          camera={{ position: [0, 0.3, 3], fov: 45 }}
          gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
          style={{ width: "100%", height: "100%" }}
        >
          <SceneCapture onReady={handleGlReady} />
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} />
          <directionalLight position={[-3, 2, -2]} intensity={0.3} />

          <Suspense fallback={<LoadingSpinner />}>
            <group scale={zoom}>
              <ProductModel
                key={product}
                product={product}
                color={color}
                viewAngle={viewAngle}
              />
            </group>
            <Environment preset="studio" environmentIntensity={0.4} />
          </Suspense>

          <OrbitControls
            ref={orbitRef}
            enablePan={false}
            enableZoom={false}
            enableRotate={false}
            minPolarAngle={Math.PI / 2.5}
            maxPolarAngle={Math.PI / 1.8}
            enabled={!isDragging}
          />
        </Canvas>

        {/* View Toggle Pill (hidden for cap) */}
        {product !== "cap" && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
            <div className="flex bg-white/80 backdrop-blur-sm rounded-full p-1 shadow-sm">
              {(["front", "back"] as const).map((view) => (
                <button
                  key={view}
                  onClick={() => setActiveView(view)}
                  className={`px-5 py-1.5 text-xs font-medium capitalize rounded-full transition-all ${
                    activeView === view
                      ? "bg-gray-900 text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {view}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Live text preview while typing */}
        {isAddingText && textInput.trim() && (
          <div
            className="absolute select-none pointer-events-none"
            style={{
              left: "50%",
              top: `${30 + (currentTexts.length) * 15}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <span
              className="font-serif italic font-light px-3 py-1 whitespace-nowrap opacity-70"
              style={{ color: textColor, fontSize: "24px" }}
            >
              {textInput}
            </span>
            <div className="absolute inset-0 border border-dashed border-white/40 -m-1 rounded pointer-events-none" />
          </div>
        )}

        {/* Draggable text overlays */}
        {currentTexts.map((item, index) => (
          <div
            key={index}
            className="absolute select-none"
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              transform: "translate(-50%, -50%)",
              cursor: isDragging && dragIndex === index ? "grabbing" : "grab",
            }}
            onMouseDown={(e) => handleDragStart(e, index)}
            onTouchStart={(e) => handleDragStart(e, index)}
          >
            <div className="relative group">
              <span
                className="font-serif italic font-light px-3 py-1 whitespace-nowrap"
                style={{ color: textColor, fontSize: `${item.fontSize}px` }}
              >
                {item.text}
              </span>
              <div className="absolute inset-0 border border-dashed border-white/60 -m-1 rounded pointer-events-none group-hover:border-white" />
              {/* Delete */}
              <button
                onClick={(e) => { e.stopPropagation(); handleDeleteText(index); }}
                className="absolute -top-3 -right-3 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                onMouseDown={(e) => e.stopPropagation()}
                aria-label="Delete text"
              >
                <X size={10} />
              </button>
              {/* Resize controls */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => { e.stopPropagation(); handleResizeText(index, -4); }}
                  onMouseDown={(e) => e.stopPropagation()}
                  className="w-5 h-5 bg-white rounded shadow text-[10px] font-bold flex items-center justify-center hover:bg-gray-100"
                  aria-label="Decrease text size"
                >
                  A
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleResizeText(index, 4); }}
                  onMouseDown={(e) => e.stopPropagation()}
                  className="w-6 h-5 bg-white rounded shadow text-sm font-bold flex items-center justify-center hover:bg-gray-100"
                  aria-label="Increase text size"
                >
                  A
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Zoom controls */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-1">
          <button onClick={handleZoomIn} className="w-9 h-9 bg-white rounded-lg shadow flex items-center justify-center hover:bg-gray-50">
            <ZoomIn size={16} />
          </button>
          <button onClick={handleZoomOut} className="w-9 h-9 bg-white rounded-lg shadow flex items-center justify-center hover:bg-gray-50">
            <ZoomOut size={16} />
          </button>
          <button onClick={handleReset} className="w-9 h-9 bg-white rounded-lg shadow flex items-center justify-center hover:bg-gray-50 text-[9px] font-bold">
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* ─── RIGHT: Action Panel (Desktop) ─── */}
      <div className="hidden lg:flex flex-col w-[22rem] bg-white/80 backdrop-blur-sm border-l border-gray-200">
        <div className="flex-1 p-6">
          {/* Product selector */}
          <div className="mb-6">
            <label className="text-[10px] uppercase tracking-wider text-gray-500 mb-2 block">Product</label>
            <div className="flex gap-2">
              {(["tee", "cap", "tote"] as CustomizerProduct[]).map((p) => (
                <button
                  key={p}
                  onClick={() => { setProduct(p); if (p === "cap") setActiveView("front"); }}
                  className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all capitalize ${
                    product === p ? "bg-gray-900 text-white" : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {p === "cap" ? "Hat" : p}
                </button>
              ))}
            </div>
          </div>

          {/* Color selection */}
          <div className="mb-4">
            <label className="text-[10px] uppercase tracking-wider text-gray-500 mb-2 block">Color</label>
            <div className="flex gap-2">
              {customizerColors.map((c) => (
                <button
                  key={c.hex}
                  onClick={() => setColor(c.hex)}
                  className={`w-9 h-9 rounded-full border-2 transition-all ${
                    color === c.hex ? "border-gray-900 scale-110" : "border-gray-200 hover:scale-105"
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* Add Text */}
          <button
            onClick={() => { setIsAddingText(true); setTextInput(""); }}
            className="w-full flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <Type size={18} />
            <span className="text-xs font-medium">Add Text</span>
          </button>

          {/* Text input */}
          {isAddingText && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium">Add Text</span>
                <button onClick={() => setIsAddingText(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={14} />
                </button>
              </div>
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value.slice(0, 20))}
                placeholder="Type your text here.."
                className="w-full p-3 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                rows={2}
                maxLength={20}
                autoFocus
              />
              <p className="text-[10px] text-gray-400 mt-1 text-right">{textInput.length}/20</p>
              {/* Symbols */}
              <div className="mt-2">
                <span className="text-[10px] text-gray-500 mb-1 block">Symbols</span>
                <div className="flex flex-wrap gap-1">
                  {["♡", "♥", "★", "✦", "&", "~", "∞", "☺", "✿", "♪", "→", "•", "☆", "☾", "☀", "♛"].map((symbol) => (
                    <button
                      key={symbol}
                      type="button"
                      onClick={() => setTextInput((prev) => (prev + symbol).slice(0, 20))}
                      className="w-7 h-7 text-sm bg-white border border-gray-200 rounded hover:bg-gray-100 flex items-center justify-center"
                    >
                      {symbol}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={handleAddText}
                disabled={!textInput.trim()}
                className="w-full mt-2 py-2.5 bg-blue-500 text-white text-sm font-semibold rounded-lg hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Done
              </button>
            </div>
          )}

          {/* Current texts display */}
          {currentTexts.length > 0 && !isAddingText && (
            <div className="mt-4 space-y-2">
              {currentTexts.map((item, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                  <span className="text-sm text-gray-700 italic font-serif">&ldquo;{item.text}&rdquo;</span>
                  <button
                    onClick={() => handleDeleteText(index)}
                    className="text-red-400 hover:text-red-600"
                    aria-label="Delete text"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Size selector (tee only) */}
          {product === "tee" && (
            <div className="mt-6">
              <label className="text-[10px] uppercase tracking-wider text-gray-500 mb-2 block">Size</label>
              <div className="flex gap-2">
                {SIZES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`w-10 h-10 text-xs font-semibold rounded-full border-2 transition-all ${
                      size === s
                        ? "border-blue-500 bg-blue-50 text-blue-600 scale-105 shadow-sm"
                        : "border-gray-200 bg-white text-gray-600 hover:border-gray-400 hover:scale-105"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom CTA */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-lg font-bold">&#8377;{price}</span>
            <span className="text-xs text-gray-400">incl. customization</span>
          </div>
          <button
            onClick={handleSave}
            className="w-full py-3 bg-[#1A1A1A] text-[#F5F0E8] font-semibold rounded-xl hover:bg-[#333] transition-colors flex items-center justify-center gap-2"
          >
            Save & Proceed
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* ─── MOBILE: Bottom Toolbar + CTA ─── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40">
        {/* Product selector row */}
        <div className="bg-white border-t border-gray-200 px-4 py-2 flex items-center justify-center gap-2">
          {(["tee", "cap", "tote"] as CustomizerProduct[]).map((p) => (
            <button
              key={p}
              onClick={() => { setProduct(p); if (p === "cap") setActiveView("front"); }}
              className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all capitalize ${
                product === p ? "bg-gray-900 text-white" : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {p === "cap" ? "Hat" : p}
            </button>
          ))}
          {product === "tee" && (
            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="ml-2 px-2 py-1.5 text-xs bg-gray-100 rounded-full border-none"
            >
              {SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          )}
        </div>

        {/* Action toolbar */}
        <div className="bg-white border-t border-gray-100 px-4 py-3 flex items-center justify-around">
          <button
            onClick={() => { setShowColors(!showColors); setIsAddingText(false); }}
            className="flex flex-col items-center gap-1"
          >
            <Palette size={20} />
            <span className="text-[10px]">Change Color</span>
          </button>
          <button
            onClick={() => { setIsAddingText(!isAddingText); setShowColors(false); setTextInput(""); }}
            className="flex flex-col items-center gap-1"
          >
            <Type size={20} />
            <span className="text-[10px]">Add Text</span>
          </button>
        </div>

        {/* Mobile color picker */}
        {showColors && (
          <div className="bg-white border-t border-gray-100 px-4 py-3 flex gap-4 justify-center">
            {customizerColors.map((c) => (
              <button
                key={c.hex}
                onClick={() => { setColor(c.hex); setShowColors(false); }}
                className={`w-11 h-11 rounded-full border-3 transition-all ${
                  color === c.hex ? "border-blue-500 scale-110" : "border-gray-300"
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        )}

        {/* Mobile text input */}
        {isAddingText && (
          <div className="bg-white border-t border-gray-100 px-4 py-3">
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value.slice(0, 20))}
              placeholder="Type your text here.."
              className="w-full p-3 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows={2}
              maxLength={20}
              autoFocus
            />
            <button
              onClick={handleAddText}
              disabled={!textInput.trim()}
              className="w-full mt-2 py-2.5 bg-blue-500 text-white text-sm font-semibold rounded-lg disabled:opacity-40 transition-colors"
            >
              Done
            </button>
          </div>
        )}

        {/* CTA bar */}
        <div className="bg-white border-t border-gray-200 px-4 py-3 flex items-center justify-between">
          <span className="text-lg font-bold">&#8377;{price}</span>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-[#1A1A1A] text-[#F5F0E8] font-semibold rounded-full hover:bg-[#333] transition-colors flex items-center gap-2"
          >
            Save & Proceed
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

// Preload models
Object.values(MODEL_PATHS).forEach((path) => useGLTF.preload(path));
