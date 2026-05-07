"use client";

import { motion } from "motion/react";
import { AnnouncementBar } from "../components/AnnouncementBar";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { PageTransition } from "../components/PageTransition";
import { BlurFade } from "@/components/magicui/blur-fade";
import { Particles } from "@/components/magicui/particles";

export default function About() {
  return (
    <PageTransition>
      <AnnouncementBar />
      <Header />
      <main>
        {/* Hero */}
        <section className="min-h-[70vh] flex items-center justify-center bg-warm relative overflow-hidden">
          <Particles className="opacity-[0.025]" quantity={25} />
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 text-center relative z-10">
            <BlurFade delay={0}>
              <p className="text-[10px] tracking-[0.4em] uppercase text-foreground/35 mb-5">
                Our Story
              </p>
            </BlurFade>
            <BlurFade delay={0.1}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight leading-tight mb-7">
                <span className="block">Two friends.</span>
                <span className="block">One needle.</span>
                <span className="block bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">Zero clue.</span>
              </h1>
            </BlurFade>
            <BlurFade delay={0.25}>
              <p className="text-lg text-foreground/45 font-light">
                And somehow, it worked.
              </p>
            </BlurFade>
          </div>
        </section>

        {/* Story */}
        <section className="py-24 sm:py-32 bg-cream">
          <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-8 text-[15px] text-foreground/60 leading-[1.9]">
              <BlurFade delay={0}>
                <p>It started with a birthday gift we couldn&apos;t find.</p>
              </BlurFade>

              <BlurFade delay={0.05}>
                <p>
                  We wanted something personal — not a mug with a stock photo, not a keychain from a gift shop. Something that actually felt like it was made for the person. Something with their initials, their vibe, their thing.
                </p>
              </BlurFade>

              <BlurFade delay={0.05}>
                <p className="text-foreground/75 font-medium">We couldn&apos;t find it. So we made it.</p>
              </BlurFade>

              <BlurFade delay={0.05}>
                <p>
                  Bought a second-hand embroidery machine off the internet. Watched YouTube tutorials at 2AM. Broke three needles the first night. The first cap we made was crooked, the thread was wrong, and one of us accidentally embroidered &ldquo;AK&rdquo; upside down.
                </p>
              </BlurFade>

              <BlurFade delay={0.05}>
                <p>
                  But when we finally got one right — held it up, saw the initials clean and tight on a black bucket hat — something clicked.
                </p>
              </BlurFade>

              <BlurFade delay={0.05}>
                <blockquote className="border-l-2 border-foreground/15 pl-6 py-2">
                  <p className="text-xl text-foreground/75 font-light italic">
                    &ldquo;We should sell these.&rdquo;
                  </p>
                </blockquote>
              </BlurFade>

              <BlurFade delay={0.05}>
                <p>
                  That was the whole business plan. No pitch deck. No investor. Just a feeling.
                </p>
              </BlurFade>

              <BlurFade delay={0.05}>
                <p>
                  We posted the first one on Instagram. A friend bought it. Then a friend of a friend. Then a stranger. Then ten strangers. Then we couldn&apos;t keep up.
                </p>
              </BlurFade>

              <BlurFade delay={0.05}>
                <p>
                  Today, threadly.one is still just us — making custom embroidered caps, tees, and tote bags, one at a time, by hand. Every stitch is intentional. Every order is personal. We don&apos;t do mass production. We don&apos;t do generic.
                </p>
              </BlurFade>

              <BlurFade delay={0.05}>
                <p className="text-foreground/75 font-medium text-lg">We make things that mean something.</p>
              </BlurFade>
            </div>
          </div>
        </section>


        {/* Values */}
        <section className="py-24 sm:py-32 bg-warm">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <BlurFade>
              <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/35 text-center mb-3">
                What drives us
              </p>
              <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-center mb-16">
                What We Believe
              </h2>
            </BlurFade>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 sm:gap-8">
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
                <BlurFade key={value.title} delay={i * 0.1}>
                  <div className="text-center group">
                    <div className="w-12 h-12 mx-auto mb-5 rounded-full border border-foreground/10 flex items-center justify-center text-foreground/30 group-hover:border-foreground/20 group-hover:text-foreground/50 transition-all duration-300">
                      <span className="text-lg font-light">{i + 1}</span>
                    </div>
                    <h3 className="text-xs tracking-[0.15em] uppercase text-foreground/80 font-medium mb-3">
                      {value.title}
                    </h3>
                    <p className="text-sm text-foreground/45 leading-relaxed">
                      {value.desc}
                    </p>
                  </div>
                </BlurFade>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 sm:py-32 bg-cream relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-transparent to-foreground/10" />
          <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <BlurFade>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-light tracking-tight text-foreground/80 mb-9 leading-snug">
                We don&apos;t know where this goes.
                <br />
                But we know it starts with you.
              </p>
            </BlurFade>
            <BlurFade delay={0.15}>
              <a
                href="/customize"
                className="inline-flex items-center gap-2 px-10 py-4 bg-foreground text-cream text-[12px] tracking-[0.15em] uppercase rounded-sm hover:bg-accent-dark transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                Make Something Yours
              </a>
            </BlurFade>
          </div>
        </section>
      </main>
      <Footer />
    </PageTransition>
  );
}
