import Link from "next/link";
import { AnnouncementBar } from "./components/AnnouncementBar";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { ProductCategories } from "./components/ProductCategories";
import { HowItWorks } from "./components/HowItWorks";
import { ProductHero } from "./components/ProductHero";
import { FAQ } from "./components/FAQ";
import { FeaturesBar } from "./components/FeaturesBar";
import { Footer } from "./components/Footer";
import { ScrollReveal } from "./components/ScrollReveal";
import { PageTransition } from "./components/PageTransition";

import heroTeesTotes from "@/app/assets/hero-tees-totes.png";
import heroBucketHats from "@/app/assets/hero-bucket-hats.png";
import lifestyleCollage from "@/app/assets/lifestyle-hats-collage.png";

export default function Home() {
  return (
    <PageTransition>
      <AnnouncementBar />
      <Header />
      <main>
        <Hero />

        <ScrollReveal>
          <ProductCategories />
        </ScrollReveal>

        <ScrollReveal>
          <HowItWorks />
        </ScrollReveal>

        <ScrollReveal>
          <section className="py-28 sm:py-36 bg-warm relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-transparent to-foreground/10" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/40 mb-5">
                Make It Yours
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-foreground/85 mb-5 max-w-lg mx-auto leading-tight tracking-tight">
                Design something that&apos;s uniquely you.
              </h2>
              <p className="text-base text-foreground/45 mb-10 max-w-md mx-auto leading-relaxed">
                Pick your product, choose a colour, add your initials — and we&apos;ll craft it just for you.
              </p>
              <Link
                href="/customize"
                className="group inline-flex items-center gap-2 px-10 py-4 bg-foreground text-cream text-[12px] tracking-[0.15em] uppercase rounded-sm hover:bg-accent-dark transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                Start Customising
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  className="group-hover:translate-x-1 transition-transform duration-200"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <ProductHero
            headline={"Your style.\nYour initials."}
            description="Premium oversized T-shirts customised just for you. Soft cotton, relaxed fit, personalised embroidery."
            ctaText="Shop T-Shirts"
            ctaHref="/customize?product=tee"
            badges={["Custom Embroidery", "Premium Cotton", "All Day Comfort", "Perfect Gift"]}
            image={heroTeesTotes}
            imageAlt="Custom embroidered oversized t-shirts and tote bags"
          />
        </ScrollReveal>

        <ScrollReveal>
          <ProductHero
            headline={"Made Personal.\nMade for you."}
            description="Bucket hats with initials, hearts, and little things that matter. For you or someone special."
            ctaText="Shop Bucket Hats"
            ctaHref="/customize?product=cap"
            badges={["Personalised Embroidery", "Made for Special Moments", "All Day Comfort", "The Perfect Gift"]}
            image={heroBucketHats}
            imageAlt="Custom embroidered bucket hats for couples"
            reverse
          />
        </ScrollReveal>

        <ScrollReveal>
          <ProductHero
            headline={"Carry what\nmatters."}
            description="Custom embroidered tote bags for everyday, everywhere. Durable, spacious, and uniquely yours."
            ctaText="Shop Tote Bags"
            ctaHref="/customize?product=tote"
            badges={["Custom Embroidery", "Durable & Reusable", "Spacious & Practical", "Perfect Gift"]}
            image={lifestyleCollage}
            imageAlt="Custom embroidered bucket hats lifestyle"
          />
        </ScrollReveal>
      </main>

      <ScrollReveal>
        <FAQ />
      </ScrollReveal>

      <FeaturesBar />
      <Footer />
    </PageTransition>
  );
}
