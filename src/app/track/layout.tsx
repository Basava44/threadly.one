import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Track Your Order",
  description:
    "Track the status of your custom embroidered order from threadly.one. Enter your order ID to see real-time updates.",
  alternates: { canonical: "https://threadly.one/track" },
};

export default function TrackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
