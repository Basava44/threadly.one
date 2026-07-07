import type { Metadata } from "next";
import AboutContent from "./AboutContent";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Two friends, one needle, zero clue - and somehow it worked. Learn how threadly.one started from a birthday gift idea and became a custom embroidery brand.",
  openGraph: {
    title: "About Us | threadly.one",
    description:
      "Two friends, one needle, zero clue - and somehow it worked. The story behind threadly.one.",
    url: "https://threadly.one/about",
  },
  alternates: {
    canonical: "https://threadly.one/about",
  },
};

export default function AboutPage() {
  return <AboutContent />;
}
