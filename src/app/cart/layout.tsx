import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Cart",
  description:
    "Review your custom embroidered items and complete your order at threadly.one.",
  alternates: { canonical: "https://threadly.one/cart" },
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
