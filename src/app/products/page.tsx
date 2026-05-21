"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { ArrowRight, Check, ShoppingBag, Truck } from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { BlurFade } from "@/components/magicui/blur-fade";
import { Particles } from "@/components/magicui/particles";
import { addToCart } from "../data/cart";
import { customizerColors, type CustomizerProduct } from "../data/products";

const products = [
  {
    name: "Bucket Cap",
    slug: "cap",
    price: 899,
    description:
      "Our signature bucket cap features premium cotton twill with custom embroidered initials. The structured crown holds its shape while the soft inner lining keeps you comfortable all day. Perfect for casual outings, beach days, or gifting someone special.",
    details: [
      "100% premium cotton twill",
      "Structured crown with reinforced panels",
      "Custom embroidered initials (up to 20 characters)",
      "One size fits most (adjustable inner band)",
      "Available in Black, Beige, and Olive",
    ],
    highlight: "Most Popular",
  },
  {
    name: "Oversized Tee",
    slug: "tee",
    price: 999,
    description:
      "Our oversized tee is crafted from 240 GSM heavyweight cotton for that perfect drop-shoulder silhouette. The relaxed fit and premium feel make it ideal for everyday wear. Custom embroidery is placed on the chest for a minimal, elevated look.",
    details: [
      "240 GSM heavyweight cotton",
      "Oversized drop-shoulder fit",
      "Ribbed crew neck",
      "Custom chest embroidery (up to 20 characters)",
      "Sizes: XS to XL",
      "Available in Black, Beige, and Olive",
    ],
    highlight: "Best Seller",
  },
  {
    name: "Tote Bag",
    slug: "tote",
    price: 599,
    description:
      "A sturdy everyday tote made from thick canvas with reinforced stitching. Spacious enough for books, groceries, or daily essentials. Your custom embroidered text adds a personal touch to this practical accessory.",
    details: [
      "12 oz heavy-duty canvas",
      "Reinforced handles and base",
      "Interior pocket for small items",
      "Custom embroidered text (up to 20 characters)",
      "Dimensions: 38cm x 42cm x 12cm",
      "Available in Black, Beige, and Olive",
    ],
    highlight: "Great Value",
  },
];

function QuickAdd({ product }: { product: typeof products[number] }) {
  const [added, setAdded] = useState(false);
  const [selectedColor, setSelectedColor] = useState(customizerColors[0].name);

  const handleAdd = () => {
    addToCart({
      product: product.slug as CustomizerProduct,
      color: selectedColor,
      text: "",
      size: product.slug === "cap" ? "One Size" : "M",
      quantity: 1,
      price: product.price,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="flex items-center gap-2">
        {customizerColors.map((c) => (
          <button
            key={c.name}
            onClick={() => setSelectedColor(c.name)}
            className={`w-5 h-5 rounded-full border-2 transition-all duration-200 ${
              selectedColor === c.name ? "border-foreground/60 scale-110" : "border-foreground/15"
            }`}
            style={{ backgroundColor: c.hex }}
            title={c.name}
          />
        ))}
      </div>
      <button
        onClick={handleAdd}
        className={`inline-flex items-center gap-2 px-5 py-3 text-[11px] tracking-[0.15em] uppercase rounded-sm transition-all duration-300 ${
          added
            ? "bg-green-800 text-cream"
            : "bg-foreground/10 text-foreground/70 hover:bg-foreground/15"
        }`}
      >
        {added ? (
          <>
            <Check size={14} strokeWidth={2} />
            Added
          </>
        ) : (
          <>
            <ShoppingBag size={14} strokeWidth={1.5} />
            Quick Add
          </>
        )}
      </button>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-4rem)] bg-warm">
        {/* Hero */}
        <section className="relative overflow-hidden py-20 sm:py-24">
          <Particles className="opacity-[0.02]" quantity={15} />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
            <BlurFade>
              <p className="text-[10px] tracking-[0.4em] uppercase text-foreground/50 mb-3">
                What we make
              </p>
            </BlurFade>
            <BlurFade delay={0.1}>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight mb-5">
                Our Products
              </h1>
            </BlurFade>
            <BlurFade delay={0.2}>
              <p className="text-base text-foreground/60 max-w-md mx-auto leading-relaxed">
                Each piece is made to order with premium materials and custom embroidery — just for you.
              </p>
            </BlurFade>
          </div>
        </section>

        {/* Products */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-20">
          <div className="flex flex-col gap-6">
            {products.map((product, i) => (
              <motion.div
                key={product.slug}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.33, 1, 0.68, 1] }}
                className="group bg-cream border border-foreground/8 rounded-lg p-5 sm:p-9 hover:border-foreground/15 hover:shadow-md transition-all duration-500"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-5 gap-2 sm:gap-0">
                  <div>
                    <div className="flex items-center gap-2 sm:gap-3 mb-1 flex-wrap">
                      <h2 className="text-lg sm:text-2xl font-light tracking-tight">{product.name}</h2>
                      <span className="text-[9px] tracking-[0.15em] uppercase text-foreground/50 px-2.5 py-1 bg-warm rounded-full border border-foreground/8">
                        {product.highlight}
                      </span>
                    </div>
                    <p className="text-[10px] tracking-[0.15em] uppercase text-foreground/50">
                      Starting at
                    </p>
                  </div>
                  <p className="text-xl sm:text-2xl font-light text-foreground/80">
                    &#8377;{product.price.toLocaleString("en-IN")}
                  </p>
                </div>

                <p className="text-sm text-foreground/60 leading-relaxed mb-7">
                  {product.description}
                </p>

                {/* Details */}
                <div className="mb-7">
                  <p className="text-[10px] tracking-[0.15em] uppercase text-foreground/50 mb-4">
                    What&apos;s included
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {product.details.map((detail, j) => (
                      <li key={j} className="text-xs text-foreground/55 flex items-start gap-2.5">
                        <Check size={13} strokeWidth={2} className="text-foreground/45 mt-0.5 shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Delivery estimate */}
                <div className="flex items-center gap-2 mb-5 text-foreground/45">
                  <Truck size={14} strokeWidth={1.5} />
                  <span className="text-[10px] tracking-[0.1em]">Dispatched in 3-5 business days</span>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <Link
                    href={`/customize?product=${product.slug}`}
                    className="group/btn inline-flex items-center gap-2 px-7 py-3.5 bg-foreground text-cream text-[11px] tracking-[0.15em] uppercase rounded-sm hover:bg-accent-dark transition-all duration-300"
                  >
                    Customise {product.name}
                    <ArrowRight size={14} strokeWidth={1.5} className="group-hover/btn:translate-x-1 transition-transform duration-200" />
                  </Link>
                  <QuickAdd product={product} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
