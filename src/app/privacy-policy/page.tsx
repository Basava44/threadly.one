import type { Metadata } from "next";
import { AnnouncementBar } from "../components/AnnouncementBar";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { PageTransition } from "../components/PageTransition";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how threadly.one collects, uses, and protects your personal information when you use our custom embroidery services.",
  alternates: { canonical: "https://threadly.one/privacy-policy" },
};

export default function PrivacyPolicy() {
  return (
    <PageTransition>
      <AnnouncementBar />
      <Header />
      <main className="py-16 sm:py-24 bg-cream">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-[11px] tracking-[0.3em] uppercase text-foreground/50 mb-2 text-center">
            Privacy Policy
          </h1>
          <p className="text-[11px] text-foreground/55 text-center mb-14">
            Last updated: May 4, 2026
          </p>

          <div className="space-y-10 text-sm text-foreground/70 leading-relaxed">
            <section>
              <h2 className="text-xs tracking-[0.15em] uppercase text-foreground/90 font-medium mb-3">
                Information We Collect
              </h2>
              <p>
                When you place an order on threadly.one, we collect the following information:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-foreground/60">
                <li>Full name and shipping address</li>
                <li>Email address and phone number</li>
                <li>Customisation details (initials, text, colour preferences)</li>
                <li>Payment information (processed securely via our payment gateway — we do not store card details)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xs tracking-[0.15em] uppercase text-foreground/90 font-medium mb-3">
                How We Use Your Information
              </h2>
              <ul className="list-disc list-inside space-y-1 text-foreground/60">
                <li>To process and fulfil your custom orders</li>
                <li>To communicate order updates via email or WhatsApp</li>
                <li>To send shipping and tracking information</li>
                <li>To respond to your queries and provide customer support</li>
                <li>To improve our products and website experience</li>
              </ul>
              <p className="mt-3">
                We will never sell, rent, or share your personal information with third parties for marketing purposes.
              </p>
            </section>

            <section>
              <h2 className="text-xs tracking-[0.15em] uppercase text-foreground/90 font-medium mb-3">
                Cookies
              </h2>
              <p>
                We use essential cookies to keep our website functional. We may also use analytics cookies to understand how visitors interact with our site. You can disable cookies through your browser settings at any time.
              </p>
            </section>

            <section>
              <h2 className="text-xs tracking-[0.15em] uppercase text-foreground/90 font-medium mb-3">
                Third-Party Services
              </h2>
              <p>
                We use trusted third-party services for payment processing and shipping. These providers only receive the information necessary to complete your transaction and are bound by their own privacy policies.
              </p>
            </section>

            <section>
              <h2 className="text-xs tracking-[0.15em] uppercase text-foreground/90 font-medium mb-3">
                Data Security
              </h2>
              <p>
                We take reasonable measures to protect your personal data. All transactions are encrypted using SSL. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-xs tracking-[0.15em] uppercase text-foreground/90 font-medium mb-3">
                Your Rights
              </h2>
              <p>
                You may request access to, correction of, or deletion of your personal data at any time by contacting us. We will respond to your request within a reasonable timeframe.
              </p>
            </section>

            <section>
              <h2 className="text-xs tracking-[0.15em] uppercase text-foreground/90 font-medium mb-3">
                Contact
              </h2>
              <p>
                If you have any questions about this privacy policy, reach out to us at{" "}
                <a href="mailto:threadly.one@gmail.com" className="underline underline-offset-2 hover:text-foreground transition-colors">
                  threadly.one@gmail.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </PageTransition>
  );
}
