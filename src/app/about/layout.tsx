import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about threadly.one — our story, our craft, and our passion for custom embroidered accessories.",
  alternates: { canonical: "https://threadly.one/about" },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
