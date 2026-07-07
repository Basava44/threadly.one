import type { Metadata } from "next";
import ContactContent from "./ContactContent";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with threadly.one. Call, email, or WhatsApp us for custom orders, questions, or just to say hi.",
  openGraph: {
    title: "Contact Us | threadly.one",
    description:
      "Get in touch with threadly.one for custom embroidery orders and questions.",
    url: "https://threadly.one/contact",
  },
  alternates: {
    canonical: "https://threadly.one/contact",
  },
};

export default function ContactPage() {
  return <ContactContent />;
}
