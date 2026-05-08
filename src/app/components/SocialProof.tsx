"use client";

import { motion } from "motion/react";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { Marquee } from "@/components/magicui/marquee";
import { Star } from "lucide-react";

const reviews = [
  { name: "Priya S.", text: "The quality is insane. My boyfriend loved the hat!", rating: 5 },
  { name: "Arjun K.", text: "Ordered for our anniversary. She cried. Worth it.", rating: 5 },
  { name: "Meera R.", text: "Got matching totes for my squad. Obsessed!", rating: 5 },
  { name: "Rohan M.", text: "The tee fits perfectly. Embroidery is so clean.", rating: 5 },
  { name: "Ananya D.", text: "Best gift I've ever given. Period.", rating: 5 },
  { name: "Karthik V.", text: "Ordered 3 more after the first one. Addicted.", rating: 5 },
];

function ReviewCard({ name, text, rating }: { name: string; text: string; rating: number }) {
  return (
    <div className="w-[280px] shrink-0 bg-cream border border-foreground/8 rounded-lg p-5 mx-2">
      <div className="flex gap-0.5 mb-3">
        {Array.from({ length: rating }).map((_, i) => (
          <Star key={i} size={12} fill="currentColor" className="text-foreground/70" />
        ))}
      </div>
      <p className="text-sm text-foreground/65 leading-relaxed mb-3">&ldquo;{text}&rdquo;</p>
      <p className="text-[10px] tracking-[0.15em] uppercase text-foreground/55">{name}</p>
    </div>
  );
}

export function SocialProof() {
  return (
    <section className="py-20 sm:py-24 bg-cream overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-3 gap-8 max-w-lg mx-auto mb-16 text-center"
        >
          <div>
            <div className="text-2xl sm:text-3xl font-light tracking-tight">
              <NumberTicker value={500} suffix="+" />
            </div>
            <p className="text-[10px] tracking-[0.15em] uppercase text-foreground/55 mt-1">
              Happy customers
            </p>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-light tracking-tight">
              <NumberTicker value={1200} suffix="+" delay={0.2} />
            </div>
            <p className="text-[10px] tracking-[0.15em] uppercase text-foreground/55 mt-1">
              Items crafted
            </p>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-light tracking-tight">
              <NumberTicker value={4} prefix="" suffix=".9" delay={0.4} />
            </div>
            <p className="text-[10px] tracking-[0.15em] uppercase text-foreground/55 mt-1">
              Avg rating
            </p>
          </div>
        </motion.div>

        {/* Review marquee */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Marquee pauseOnHover duration="35s">
            {reviews.map((review, i) => (
              <ReviewCard key={i} {...review} />
            ))}
          </Marquee>
        </motion.div>
      </div>
    </section>
  );
}
