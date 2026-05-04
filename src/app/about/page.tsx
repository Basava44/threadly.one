"use client";

import { motion } from "motion/react";
import { AnnouncementBar } from "../components/AnnouncementBar";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { PageTransition } from "../components/PageTransition";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 } as const,
  whileInView: { opacity: 1, y: 0 } as const,
  viewport: { once: true } as const,
  transition: { duration: 0.6, delay, ease: "easeOut" as const },
});

export default function About() {
  return (
    <PageTransition>
      <AnnouncementBar />
      <Header />
      <main>
        {/* Hero */}
        <section className="min-h-[60vh] flex items-center justify-center bg-warm">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 text-center">
            <motion.p
              {...fadeUp(0)}
              className="text-[10px] tracking-[0.3em] uppercase text-foreground/40 mb-4"
            >
              Our Story
            </motion.p>
            <motion.h1
              {...fadeUp(0.1)}
              className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight leading-tight mb-6"
            >
              Two friends.
              <br />
              One needle.
              <br />
              Zero clue.
            </motion.h1>
            <motion.p
              {...fadeUp(0.25)}
              className="text-base text-foreground/50"
            >
              And somehow, it worked.
            </motion.p>
          </div>
        </section>

        {/* Story */}
        <section className="py-20 sm:py-28 bg-cream">
          <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-8 text-sm text-foreground/65 leading-[1.85]">
              <motion.p {...fadeUp(0)}>
                It started with a birthday gift we couldn&apos;t find.
              </motion.p>

              <motion.p {...fadeUp(0)}>
                We wanted something personal — not a mug with a stock photo, not a keychain from a gift shop. Something that actually felt like it was made for the person. Something with their initials, their vibe, their thing.
              </motion.p>

              <motion.p {...fadeUp(0)}>
                We couldn&apos;t find it. So we made it.
              </motion.p>

              <motion.p {...fadeUp(0)}>
                Bought a second-hand embroidery machine off the internet. Watched YouTube tutorials at 2AM. Broke three needles the first night. The first cap we made was crooked, the thread was wrong, and one of us accidentally embroidered &ldquo;AK&rdquo; upside down.
              </motion.p>

              <motion.p {...fadeUp(0)}>
                But when we finally got one right — held it up, saw the initials clean and tight on a black bucket hat — something clicked.
              </motion.p>

              <motion.p
                {...fadeUp(0)}
                className="text-lg text-foreground/80 font-light italic"
              >
                &ldquo;We should sell these.&rdquo;
              </motion.p>

              <motion.p {...fadeUp(0)}>
                That was the whole business plan. No pitch deck. No investor. Just a feeling.
              </motion.p>

              <motion.p {...fadeUp(0)}>
                We posted the first one on Instagram. A friend bought it. Then a friend of a friend. Then a stranger. Then ten strangers. Then we couldn&apos;t keep up.
              </motion.p>

              <motion.p {...fadeUp(0)}>
                Today, threadly.one is still just us — making custom embroidered caps, tees, and tote bags, one at a time, by hand. Every stitch is intentional. Every order is personal. We don&apos;t do mass production. We don&apos;t do generic.
              </motion.p>

              <motion.p {...fadeUp(0)}>
                We make things that mean something.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 sm:py-28 bg-warm">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2
              {...fadeUp(0)}
              className="text-[11px] tracking-[0.3em] uppercase text-foreground/40 text-center mb-14"
            >
              What We Believe
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 sm:gap-8 text-center">
              {[
                {
                  title: "Personal > Perfect",
                  desc: "A crooked heart embroidered with love beats a flawless factory print every time.",
                },
                {
                  title: "Less, But Better",
                  desc: "Three products. Two colours. One promise — it's made for you and no one else.",
                },
                {
                  title: "Tiny Details, Big Feelings",
                  desc: "Initials on a hat can make someone cry. We've seen it happen. That's why we do this.",
                },
              ].map((value, i) => (
                <motion.div key={value.title} {...fadeUp(i * 0.1)}>
                  <h3 className="text-xs tracking-[0.15em] uppercase text-foreground/80 font-medium mb-3">
                    {value.title}
                  </h3>
                  <p className="text-sm text-foreground/50 leading-relaxed">
                    {value.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 sm:py-28 bg-cream">
          <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.p
              {...fadeUp(0)}
              className="text-2xl sm:text-3xl font-light tracking-tight text-foreground/80 mb-8 leading-snug"
            >
              We don&apos;t know where this goes.
              <br />
              But we know it starts with you.
            </motion.p>
            <motion.a
              {...fadeUp(0.15)}
              href="/customize"
              className="inline-block px-10 py-4 bg-foreground text-cream text-[12px] tracking-[0.15em] uppercase rounded-sm hover:bg-accent-dark transition-colors"
            >
              Make Something Yours
            </motion.a>
          </div>
        </section>
      </main>
      <Footer />
    </PageTransition>
  );
}
