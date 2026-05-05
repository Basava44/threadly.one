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
          <section className="py-24 sm:py-32 bg-warm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-[12px] tracking-[0.3em] uppercase text-foreground/50 mb-5">
                Make It Yours
              </h2>
              <p className="text-2xl sm:text-3xl font-light text-foreground/80 mb-4 max-w-lg mx-auto leading-snug">
                Design something that&apos;s uniquely you.
              </p>
              <p className="text-base text-foreground/50 mb-10 max-w-md mx-auto">
                Pick your product, choose a colour, add your initials — and we&apos;ll craft it just for you.
              </p>
              <Link
                href="/customize"
                className="inline-block px-10 py-4 bg-foreground text-cream text-[12px] tracking-[0.15em] uppercase rounded-sm hover:bg-accent-dark transition-colors"
              >
                Start Customising
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
