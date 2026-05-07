"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

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
  },
];

export default function ProductsPage() {
  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-4rem)] bg-warm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/40 text-center mb-2">
              What we make
            </p>
            <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-center mb-4">
              Our Products
            </h1>
            <p className="text-sm text-foreground/50 text-center mb-16 max-w-md mx-auto">
              Each piece is made to order with premium materials and custom embroidery — just for you.
            </p>
          </motion.div>

          <div className="flex flex-col gap-12">
            {products.map((product, i) => (
              <motion.div
                key={product.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-cream border border-foreground/8 rounded-sm p-6 sm:p-8"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-light tracking-tight">{product.name}</h2>
                    <p className="text-[10px] tracking-[0.15em] uppercase text-foreground/40 mt-1">
                      Starting at
                    </p>
                  </div>
                  <p className="text-lg font-light">
                    &#8377;{product.price.toLocaleString("en-IN")}
                  </p>
                </div>

                <p className="text-sm text-foreground/70 leading-relaxed mb-6">
                  {product.description}
                </p>

                <div className="mb-6">
                  <p className="text-[10px] tracking-[0.15em] uppercase text-foreground/40 mb-3">
                    Details
                  </p>
                  <ul className="flex flex-col gap-1.5">
                    {product.details.map((detail, j) => (
                      <li key={j} className="text-xs text-foreground/60 flex items-start gap-2">
                        <span className="w-1 h-1 rounded-full bg-foreground/30 mt-1.5 shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={`/customize?product=${product.slug}`}
                  className="inline-block px-6 py-3 bg-foreground text-cream text-[11px] tracking-[0.15em] uppercase rounded-sm hover:bg-accent-dark transition-colors"
                >
                  Customise {product.name}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
