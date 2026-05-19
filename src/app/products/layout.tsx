import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Browse our collection of custom embroidered caps, tees, bucket hats, and tote bags. Handcrafted with care.",
  alternates: { canonical: "https://threadly.one/products" },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
