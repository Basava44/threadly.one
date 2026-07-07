import type { Metadata } from "next";
import ProductsContent from "./ProductsContent";

export const metadata: Metadata = {
  title: "Our Products",
  description:
    "Custom embroidered bucket caps, oversized tees, and tote bags. Premium materials, made to order with personalised embroidery starting at Rs. 599.",
  openGraph: {
    title: "Our Products | threadly.one",
    description:
      "Custom embroidered bucket caps, oversized tees, and tote bags. Made to order with personalised embroidery.",
    url: "https://threadly.one/products",
  },
  alternates: {
    canonical: "https://threadly.one/products",
  },
};

export default function ProductsPage() {
  return <ProductsContent />;
}
