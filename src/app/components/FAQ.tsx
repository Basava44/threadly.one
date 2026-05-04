"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const faqs = [
  {
    q: "How long does it take to receive my order?",
    a: "Every piece is made to order. We typically dispatch within 3-5 business days, and delivery takes an additional 2-4 days depending on your location.",
  },
  {
    q: "Can I wash my embroidered product?",
    a: "Yes! We recommend a gentle machine wash or hand wash in cold water. Turn the product inside out to protect the embroidery. Avoid bleach and tumble drying.",
  },
  {
    q: "What embroidery styles can I choose from?",
    a: "You can add initials, short text, or symbols like hearts and ampersands. We embroider in a clean, minimal italic style that complements every product.",
  },
  {
    q: "Do you offer returns or exchanges?",
    a: "Since every item is custom-made and personalised just for you, we do not offer returns or exchanges. Please double-check your customisation details before placing your order.",
  },
  {
    q: "What materials do you use?",
    a: "Our oversized tees are premium 240 GSM cotton, bucket hats are durable cotton twill, and tote bags are heavy-duty canvas. All products are built to last.",
  },
  {
    q: "Can I order in bulk for events or gifting?",
    a: "Absolutely! We love doing bulk orders for weddings, birthdays, and corporate gifting. Reach out to us via Instagram or email and we'll sort you out with a custom quote.",
  },
  {
    q: "How do I track my order?",
    a: "Once your order is dispatched, you'll receive a tracking link via email or WhatsApp. You can use it to follow your package in real time.",
  },
];

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: "easeOut" }}
      className="border-b border-foreground/10"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left gap-4"
      >
        <span className="text-sm sm:text-base text-foreground/80">{q}</span>
        <motion.svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="shrink-0 text-foreground/40"
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <path d="M12 5v14" />
          <path d="M5 12h14" />
        </motion.svg>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="text-sm text-foreground/50 leading-relaxed pb-5">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FAQ() {
  return (
    <section id="faq" className="py-20 sm:py-24 bg-cream">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-[11px] tracking-[0.3em] uppercase text-foreground/50 text-center mb-12">
          Frequently Asked Questions
        </h2>
        <div>
          {faqs.map((faq, i) => (
            <FAQItem key={faq.q} q={faq.q} a={faq.a} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
