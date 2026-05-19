import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with threadly.one. Reach out for custom orders, questions, or collaborations.",
  alternates: { canonical: "https://threadly.one/contact" },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
