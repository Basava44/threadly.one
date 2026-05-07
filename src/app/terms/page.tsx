import { AnnouncementBar } from "../components/AnnouncementBar";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { PageTransition } from "../components/PageTransition";

export default function Terms() {
  return (
    <PageTransition>
      <AnnouncementBar />
      <Header />
      <main className="py-16 sm:py-24 bg-cream">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-[11px] tracking-[0.3em] uppercase text-foreground/50 mb-2 text-center">
            Terms &amp; Conditions
          </h1>
          <p className="text-[11px] text-foreground/40 text-center mb-14">
            Last updated: May 4, 2026
          </p>

          <div className="space-y-10 text-sm text-foreground/70 leading-relaxed">
            <section>
              <h2 className="text-xs tracking-[0.15em] uppercase text-foreground/90 font-medium mb-3">
                General
              </h2>
              <p>
                By placing an order on threadly.one, you agree to the following
                terms and conditions. Please read them carefully before making a
                purchase.
              </p>
            </section>

            <section>
              <h2 className="text-xs tracking-[0.15em] uppercase text-foreground/90 font-medium mb-3">
                Products &amp; Customisation
              </h2>
              <p>
                All products are custom-made to order based on your selected
                options (product type, colour, and embroidery text). Colours may
                vary slightly from what you see on screen due to display
                settings. We do our best to ensure the final product matches
                your expectations.
              </p>
            </section>

            <section>
              <h2 className="text-xs tracking-[0.15em] uppercase text-foreground/90 font-medium mb-3">
                Pricing &amp; Payment
              </h2>
              <p>
                All prices are listed in Indian Rupees (INR) and include
                applicable taxes. Payment is collected at the time of order. We
                accept payments through our secure payment gateway — we never
                store your card details directly.
              </p>
            </section>

            <section>
              <h2 className="text-xs tracking-[0.15em] uppercase text-foreground/90 font-medium mb-3">
                Order Processing &amp; Shipping
              </h2>
              <p>
                Orders are typically dispatched within 3-5 business days.
                Delivery takes an additional 2-4 days depending on your
                location. You will receive a tracking link once your order is
                shipped. Delivery timelines are estimates and may vary due to
                factors beyond our control.
              </p>
            </section>

            <section>
              <h2 className="text-xs tracking-[0.15em] uppercase text-foreground/90 font-medium mb-3">
                No Returns or Exchanges
              </h2>
              <p>
                Since every item is personalised and crafted specifically for
                you, we do not accept returns or exchanges. Please review your
                customisation details carefully before confirming your order. If
                you receive a damaged or defective product, contact us within 48
                hours of delivery with photos and we will resolve it.
              </p>
            </section>

            <section>
              <h2 className="text-xs tracking-[0.15em] uppercase text-foreground/90 font-medium mb-3">
                Cancellations
              </h2>
              <p>
                Orders can only be cancelled within 12 hours of placement,
                provided production has not yet started. Once crafting has
                begun, the order cannot be cancelled or modified.
              </p>
            </section>

            <section>
              <h2 className="text-xs tracking-[0.15em] uppercase text-foreground/90 font-medium mb-3">
                Intellectual Property
              </h2>
              <p>
                All content on threadly.one — including images, designs, logos,
                and text — is owned by threadly.one and may not be reproduced,
                distributed, or used without our written permission.
              </p>
            </section>

            <section>
              <h2 className="text-xs tracking-[0.15em] uppercase text-foreground/90 font-medium mb-3">
                Limitation of Liability
              </h2>
              <p>
                threadly.one is not liable for any indirect, incidental, or
                consequential damages arising from the use of our products or
                website. Our total liability for any claim shall not exceed the
                amount you paid for the product in question.
              </p>
            </section>

            <section>
              <h2 className="text-xs tracking-[0.15em] uppercase text-foreground/90 font-medium mb-3">
                Changes to These Terms
              </h2>
              <p>
                We may update these terms from time to time. Any changes will be
                posted on this page with an updated date. Continued use of our
                website after changes constitutes acceptance of the revised
                terms.
              </p>
            </section>

            <section>
              <h2 className="text-xs tracking-[0.15em] uppercase text-foreground/90 font-medium mb-3">
                Contact
              </h2>
              <p>
                Questions about these terms? Reach out at{" "}
                <a
                  href="mailto:hello@threadly.one"
                  className="underline underline-offset-2 hover:text-foreground transition-colors"
                >
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
