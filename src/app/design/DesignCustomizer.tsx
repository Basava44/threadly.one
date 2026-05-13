"use client";

import { useState, useRef, Suspense, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Center, Environment } from "@react-three/drei";
import * as THREE from "three";
import { Type, ChevronRight, X, ZoomIn, ZoomOut, RotateCcw, Pencil } from "lucide-react";
import { addToCart } from "@/app/data/cart";
import type { CustomizerProduct } from "@/app/data/products";
import { customizerColors, productPrices } from "@/app/data/products";

// ─── Helpers ─────────────────────────────────────────────

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

// Thread color — auto contrast based on garment
function getThreadColor(garmentHex: string) {
  const r = parseInt(garmentHex.slice(1, 3), 16);
  const g = parseInt(garmentHex.slice(3, 5), 16);
  const b = parseInt(garmentHex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#1A1A1A" : "#FFFFFF";
}

// Font style presets
const FONT_STYLE_OPTIONS = [
  { label: "Serif", value: "serif", className: "font-serif italic font-light" },
  { label: "Sans", value: "sans", className: "font-sans font-semibold tracking-wide" },
  { label: "Script", value: "script", className: "font-[cursive] font-normal" },
];

// Fixed font size presets
const FONT_SIZE_OPTIONS = [
  { label: "Small", value: 16 },
  { label: "Medium", value: 24 },
  { label: "Large", value: 32 },
  { label: "XL", value: 40 },
];

// Standard placement positions per product and view
const PLACEMENT_OPTIONS: Record<string, Record<string, { label: string; x: number; y: number }[]>> = {
  tee: {
    front: [
      { label: "Center Chest", x: 45, y: 0 },
      { label: "Left Chest", x: 45, y: 30 },
      { label: "Right Chest", x: 55, y: 30 },
      { label: "Lower Front", x: 50, y: 55 },
    ],
    back: [
      { label: "Upper Back", x: 50, y: 28 },
      { label: "Center Back", x: 50, y: 42 },
    ],
  },
  tote: {
    front: [
      { label: "Top Center", x: 50, y: 30 },
      { label: "Center", x: 50, y: 45 },
      { label: "Bottom Center", x: 50, y: 60 },
    ],
    back: [
      { label: "Top Center", x: 50, y: 30 },
      { label: "Center", x: 50, y: 45 },
      { label: "Bottom Center", x: 50, y: 60 },
    ],
  },
  cap: {
    front: [
      { label: "Front Center", x: 50, y: 40 },
    ],
    back: [],
  },
};

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
  const [selectedFontSize, setSelectedFontSize] = useState(24);
  const [selectedFontStyle, setSelectedFontStyle] = useState(FONT_STYLE_OPTIONS[0]);
  const [selectedPlacement, setSelectedPlacement] = useState(PLACEMENT_OPTIONS.tee.front[0]);
  const [zoom, setZoom] = useState(1);
  const [showMobilePanel, setShowMobilePanel] = useState(false);

  // Texts per view
  const [texts, setTexts] = useState<Record<string, { text: string; x: number; y: number; fontSize: number; color: string; fontStyle: string; fontClassName: string }[]>>({ front: [], back: [] });
  const viewerRef = useRef<HTMLDivElement>(null);

  const viewAngle = activeView === "front" ? 0 : Math.PI;
  const price = productPrices[product];
  const currentTexts = texts[activeView] || [];
  const currentPlacements = PLACEMENT_OPTIONS[product]?.[activeView] || [];
  const threadColor = getThreadColor(color);

  // Reset placement when product or view changes
  const placementKey = `${product}-${activeView}`;
  const [lastPlacementKey, setLastPlacementKey] = useState(placementKey);
  if (placementKey !== lastPlacementKey) {
    setLastPlacementKey(placementKey);
    const placements = PLACEMENT_OPTIONS[product]?.[activeView] || [];
    if (placements.length > 0) setSelectedPlacement(placements[0]);
  }

  // Handlers
  const handleAddText = () => {
    if (textInput.trim()) {
      setTexts((prev) => ({
        ...prev,
        [activeView]: [...(prev[activeView] || []), {
          text: textInput.trim().slice(0, 20),
          x: selectedPlacement.x,
          y: selectedPlacement.y,
          fontSize: selectedFontSize,
          color: threadColor,
          fontStyle: selectedFontStyle.value,
          fontClassName: selectedFontStyle.className,
        }],
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

  // Capture screenshot
  const captureView = (viewTexts: { text: string; x: number; y: number; fontSize: number; color: string; fontStyle: string; fontClassName: string }[]): string | undefined => {
    const gl = glRef.current;
    const viewer = viewerRef.current;
    if (!gl || !viewer) return undefined;

    const threeCanvas = gl.domElement;
    const width = threeCanvas.width;
    const height = threeCanvas.height;

    const fullCanvas = document.createElement("canvas");
    fullCanvas.width = width;
    fullCanvas.height = height;
    const fullCtx = fullCanvas.getContext("2d");
    if (!fullCtx) return undefined;

    fullCtx.drawImage(threeCanvas, 0, 0);

    fullCtx.textAlign = "center";
    fullCtx.textBaseline = "middle";

    const viewerWidth = viewerRef.current?.clientWidth || width;
    const pixelRatio = width / viewerWidth;

    for (const item of viewTexts) {
      const scaledFontSize = item.fontSize * pixelRatio;
      const fontFamily = item.fontStyle === "sans" ? "sans-serif" : item.fontStyle === "script" ? "cursive" : "serif";
      const fontWeight = item.fontStyle === "sans" ? "600" : "400";
      const fontItalic = item.fontStyle === "serif" ? "italic " : "";
      fullCtx.font = `${fontItalic}${fontWeight} ${scaledFontSize}px ${fontFamily}`;
      fullCtx.fillStyle = item.color;
      const x = (item.x / 100) * width;
      const y = (item.y / 100) * height;
      fullCtx.fillText(item.text, x, y);
    }

    return fullCanvas.toDataURL("image/png", 0.8);
  };

  const handleSave = async () => {
    const allText = Object.values(texts).flat().map((t) => t.text).join(" | ");

    setActiveView("front");
    await new Promise((r) => setTimeout(r, 300));
    const frontImage = captureView(texts.front || []);

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
        className="flex-1 relative min-h-[280px] max-h-[50vh] lg:max-h-none lg:min-h-0 -mb-8 lg:mb-0"
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

        {/* Fixed-size print area — stays centered regardless of screen size */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-[300px] h-[400px]">
            {/* Live text preview while typing */}
            {isAddingText && textInput.trim() && (
              <div
                className="absolute select-none"
                style={{
                  left: `${selectedPlacement.x}%`,
                  top: `${selectedPlacement.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <span
                  className={`${selectedFontStyle.className} px-3 py-1 whitespace-nowrap opacity-70`}
                  style={{ color: threadColor, fontSize: `${selectedFontSize}px` }}
                >
                  {textInput}
                </span>
                <div className="absolute inset-0 border border-dashed border-white/40 -m-1 rounded" />
              </div>
            )}

            {/* Text overlays */}
            {currentTexts.map((item, index) => (
              <div
                key={index}
                className="absolute select-none"
                style={{
                  left: `${item.x}%`,
                  top: `${item.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <span
                  className={`${item.fontClassName} px-3 py-1 whitespace-nowrap`}
                  style={{ color: item.color, fontSize: `${item.fontSize}px` }}
                >
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>

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
      <div className="hidden lg:flex flex-col w-[26rem] bg-white/80 backdrop-blur-sm border-l border-gray-200 overflow-y-auto">
        <div className="flex-1 p-6 space-y-6">
          {/* Product selector */}
          <div>
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

          {/* Garment Color */}
          <div>
            <label className="text-[10px] uppercase tracking-wider text-gray-500 mb-1 block">Garment Color</label>
            <p className="text-[11px] text-gray-400 mb-2">Choose the base color of your {product === "cap" ? "hat" : product}</p>
            <div className="flex gap-3">
              {customizerColors.map((c) => (
                <button
                  key={c.hex}
                  onClick={() => setColor(c.hex)}
                  className={`flex flex-col items-center gap-1 ${
                    color === c.hex ? "scale-110" : "hover:scale-105"
                  } transition-all`}
                >
                  <div
                    className={`w-9 h-9 rounded-full border-2 ${
                      color === c.hex ? "border-gray-900" : "border-gray-200"
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                  <span className="text-[9px] text-gray-500">{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Font Style */}
          <div>
            <label className="text-[10px] uppercase tracking-wider text-gray-500 mb-2 block">Font Style</label>
            <div className="flex gap-2">
              {FONT_STYLE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSelectedFontStyle(opt)}
                  className={`flex-1 py-2 text-xs rounded-lg transition-all ${opt.className} ${
                    selectedFontStyle.value === opt.value ? "bg-gray-900 text-white" : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Text Size */}
          <div>
            <label className="text-[10px] uppercase tracking-wider text-gray-500 mb-2 block">Text Size</label>
            <div className="flex gap-2">
              {FONT_SIZE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSelectedFontSize(opt.value)}
                  className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${
                    selectedFontSize === opt.value ? "bg-gray-900 text-white" : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Placement */}
          {currentPlacements.length > 0 && (
            <div>
              <label className="text-[10px] uppercase tracking-wider text-gray-500 mb-2 block">Placement ({activeView})</label>
              <div className="grid grid-cols-2 gap-2">
                {currentPlacements.map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => setSelectedPlacement(opt)}
                    className={`py-2 px-3 text-xs font-medium rounded-lg transition-all ${
                      selectedPlacement.label === opt.label ? "bg-gray-900 text-white" : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

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
            <div className="p-4 bg-gray-50 rounded-lg">
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
            <div className="space-y-2">
              {currentTexts.map((item, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full border border-gray-200" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-gray-700 italic font-serif">&ldquo;{item.text}&rdquo;</span>
                  </div>
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
            <div>
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

      {/* ─── MOBILE: Bottom Bar + Popup ─── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40">
        <div className="bg-white border-t border-gray-200 px-4 py-3 flex items-center justify-between">
          <span className="text-lg font-bold">&#8377;{price}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowMobilePanel(true)}
              className="px-4 py-2.5 bg-gray-100 text-gray-900 font-medium rounded-full flex items-center gap-2 text-sm"
            >
              <Pencil size={14} />
              Customize
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2.5 bg-[#1A1A1A] text-[#F5F0E8] font-semibold rounded-full flex items-center gap-2 text-sm"
            >
              Save
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ─── MOBILE: Bottom Sheet (half-screen with live preview above) ─── */}
      {showMobilePanel && (
        <>
          {/* Backdrop — tap to close */}
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black/20"
            onClick={() => setShowMobilePanel(false)}
          />
          {/* Bottom sheet */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl max-h-[55vh] flex flex-col shadow-2xl">
            {/* Handle + Header */}
            <div className="flex flex-col items-center pt-2 pb-1 border-b border-gray-100">
              <div className="w-10 h-1 bg-gray-300 rounded-full mb-2" />
              <div className="flex items-center justify-between w-full px-4 pb-2">
                <h2 className="text-sm font-semibold">Customize Design</h2>
                <button
                  onClick={() => setShowMobilePanel(false)}
                  className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
              {/* Product selector */}
              <div>
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

              {/* View Toggle */}
              {product !== "cap" && (
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-gray-500 mb-2 block">View</label>
                  <div className="flex gap-2">
                    {(["front", "back"] as const).map((view) => (
                      <button
                        key={view}
                        onClick={() => setActiveView(view)}
                        className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all capitalize ${
                          activeView === view ? "bg-gray-900 text-white" : "bg-gray-100 hover:bg-gray-200"
                        }`}
                      >
                        {view}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Garment Color */}
              <div>
                <label className="text-[10px] uppercase tracking-wider text-gray-500 mb-1 block">Garment Color</label>
                <div className="flex gap-3">
                  {customizerColors.map((c) => (
                    <button
                      key={c.hex}
                      onClick={() => setColor(c.hex)}
                      className={`flex flex-col items-center gap-1 ${
                        color === c.hex ? "scale-110" : ""
                      } transition-all`}
                    >
                      <div
                        className={`w-9 h-9 rounded-full border-2 ${
                          color === c.hex ? "border-gray-900" : "border-gray-200"
                        }`}
                        style={{ backgroundColor: c.hex }}
                      />
                      <span className="text-[9px] text-gray-500">{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Style */}
              <div>
                <label className="text-[10px] uppercase tracking-wider text-gray-500 mb-2 block">Font Style</label>
                <div className="flex gap-2">
                  {FONT_STYLE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setSelectedFontStyle(opt)}
                      className={`flex-1 py-2 text-xs rounded-lg transition-all ${opt.className} ${
                        selectedFontStyle.value === opt.value ? "bg-gray-900 text-white" : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Size */}
              <div>
                <label className="text-[10px] uppercase tracking-wider text-gray-500 mb-2 block">Text Size</label>
                <div className="flex gap-2">
                  {FONT_SIZE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setSelectedFontSize(opt.value)}
                      className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${
                        selectedFontSize === opt.value ? "bg-gray-900 text-white" : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Placement */}
              {currentPlacements.length > 0 && (
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-gray-500 mb-2 block">Placement ({activeView})</label>
                  <div className="grid grid-cols-2 gap-2">
                    {currentPlacements.map((opt) => (
                      <button
                        key={opt.label}
                        onClick={() => setSelectedPlacement(opt)}
                        className={`py-2 px-3 text-xs font-medium rounded-lg transition-all ${
                          selectedPlacement.label === opt.label ? "bg-gray-900 text-white" : "bg-gray-100 hover:bg-gray-200"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size selector (tee only) */}
              {product === "tee" && (
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-gray-500 mb-2 block">Size</label>
                  <div className="flex gap-2">
                    {SIZES.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSize(s)}
                        className={`w-10 h-10 text-xs font-semibold rounded-full border-2 transition-all ${
                          size === s
                            ? "border-blue-500 bg-blue-50 text-blue-600 scale-105 shadow-sm"
                            : "border-gray-200 bg-white text-gray-600 hover:border-gray-400"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Add Text */}
              <div>
                <label className="text-[10px] uppercase tracking-wider text-gray-500 mb-2 block">Text</label>
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value.slice(0, 20))}
                  placeholder="Type your text here.."
                  className="w-full p-3 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                  rows={2}
                  maxLength={20}
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
                  onClick={() => { handleAddText(); }}
                  disabled={!textInput.trim()}
                  className="w-full mt-3 py-2.5 bg-blue-500 text-white text-sm font-semibold rounded-lg hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Add Text
                </button>
              </div>

              {/* Current texts */}
              {currentTexts.length > 0 && (
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-gray-500 mb-2 block">Added Texts</label>
                  <div className="space-y-2">
                    {currentTexts.map((item, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full border border-gray-200" style={{ backgroundColor: item.color }} />
                          <span className="text-sm text-gray-700 italic font-serif">&ldquo;{item.text}&rdquo;</span>
                        </div>
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
                </div>
              )}
            </div>

            {/* Bottom done button */}
            <div className="px-4 py-3 border-t border-gray-200">
              <button
                onClick={() => setShowMobilePanel(false)}
                className="w-full py-3 bg-[#1A1A1A] text-[#F5F0E8] font-semibold rounded-xl transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Preload models
Object.values(MODEL_PATHS).forEach((path) => useGLTF.preload(path));
