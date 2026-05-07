"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Minus } from "lucide-react";

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
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.33, 1, 0.68, 1] }}
      className={`border border-foreground/8 rounded-lg mb-3 overflow-hidden transition-colors duration-300 ${
        open ? "bg-warm/50 border-foreground/12" : "bg-cream hover:bg-warm/30"
      }`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 px-6 text-left gap-4"
      >
        <span className="text-sm sm:text-base text-foreground/80 font-light">{q}</span>
        <div
          className={`w-7 h-7 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300 ${
            open
              ? "border-foreground/30 bg-foreground text-cream rotate-0"
              : "border-foreground/15 text-foreground/40 rotate-0"
          }`}
        >
          {open ? <Minus size={12} strokeWidth={2} /> : <Plus size={12} strokeWidth={2} />}
        </div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
            className="overflow-hidden"
          >
            <p className="text-sm text-foreground/50 leading-relaxed px-6 pb-5">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FAQ() {
  return (
    <section id="faq" className="py-20 sm:py-28 bg-cream">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/40 mb-3">
            Got questions?
          </p>
          <h2 className="text-2xl sm:text-3xl font-light tracking-tight">
            Frequently Asked Questions
          </h2>
        </motion.div>
        <div>
          {faqs.map((faq, i) => (
            <FAQItem key={faq.q} q={faq.q} a={faq.a} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
