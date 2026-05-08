"use client";

import { Phone, Mail, MessageCircle, MessageSquare } from "lucide-react";
import Link from "next/link";
import { AnnouncementBar } from "../components/AnnouncementBar";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { PageTransition } from "../components/PageTransition";
import { BlurFade } from "@/components/magicui/blur-fade";
import { Particles } from "@/components/magicui/particles";

export default function Contact() {
  return (
    <PageTransition>
      <AnnouncementBar />
      <Header />
      <main>
        {/* Hero */}
        <section className="min-h-[60vh] flex items-center justify-center bg-warm relative overflow-hidden">
          <Particles className="opacity-[0.025]" quantity={25} />
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 text-center relative z-10">
            <BlurFade delay={0}>
              <p className="text-[10px] tracking-[0.4em] uppercase text-foreground/35 mb-5">
                Get In Touch
              </p>
            </BlurFade>
            <BlurFade delay={0.1}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight leading-tight mb-7">
                <span className="block">We&apos;d love to</span>
                <span className="block bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">hear from you.</span>
              </h1>
            </BlurFade>
            <BlurFade delay={0.25}>
              <p className="text-lg text-foreground/45 font-light">
                Questions, custom orders, or just want to say hi — reach out anytime.
              </p>
            </BlurFade>
          </div>
        </section>

        {/* Contact Info */}
        <section className="py-24 sm:py-32 bg-cream">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-8">
              <BlurFade delay={0}>
                <div className="text-center group">
                  <div className="w-14 h-14 mx-auto mb-5 rounded-full border border-foreground/10 flex items-center justify-center text-foreground/30 group-hover:border-foreground/20 group-hover:text-foreground/50 transition-all duration-300">
                    <Phone size={20} />
                  </div>
                  <h3 className="text-xs tracking-[0.15em] uppercase text-foreground/80 font-medium mb-3">
                    Call Us
                  </h3>
                  <div className="space-y-1.5">
                    <a href="tel:+918073967470" className="block text-sm text-foreground/50 hover:text-foreground/80 transition-colors">
                      +91 8073967470
                    </a>
                    <a href="tel:+917619377577" className="block text-sm text-foreground/50 hover:text-foreground/80 transition-colors">
                      +91 7619377577
                    </a>
                  </div>
                </div>
              </BlurFade>

              <BlurFade delay={0.1}>
                <div className="text-center group">
                  <div className="w-14 h-14 mx-auto mb-5 rounded-full border border-foreground/10 flex items-center justify-center text-foreground/30 group-hover:border-foreground/20 group-hover:text-foreground/50 transition-all duration-300">
                    <Mail size={20} />
                  </div>
                  <h3 className="text-xs tracking-[0.15em] uppercase text-foreground/80 font-medium mb-3">
                    Email Us
                  </h3>
                  <a href="mailto:threadly.one@gmail.com" className="text-sm text-foreground/50 hover:text-foreground/80 transition-colors">
                    threadly.one@gmail.com
                  </a>
                </div>
              </BlurFade>

              <BlurFade delay={0.2}>
                <div className="text-center group">
                  <div className="w-14 h-14 mx-auto mb-5 rounded-full border border-foreground/10 flex items-center justify-center text-foreground/30 group-hover:border-foreground/20 group-hover:text-foreground/50 transition-all duration-300">
                    <MessageCircle size={20} />
                  </div>
                  <h3 className="text-xs tracking-[0.15em] uppercase text-foreground/80 font-medium mb-3">
                    WhatsApp
                  </h3>
                  <div className="space-y-1.5">
                    <a
                      href="https://wa.me/918073967470"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm text-foreground/50 hover:text-foreground/80 transition-colors"
                    >
                      +91 8073967470
                    </a>
                    <a
                      href="https://wa.me/917619377577"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm text-foreground/50 hover:text-foreground/80 transition-colors"
                    >
                      +91 7619377577
                    </a>
                  </div>
                </div>
              </BlurFade>

              <BlurFade delay={0.3}>
                <div className="text-center group">
                  <div className="w-14 h-14 mx-auto mb-5 rounded-full border border-foreground/10 flex items-center justify-center text-foreground/30 group-hover:border-foreground/20 group-hover:text-foreground/50 transition-all duration-300">
                    <MessageSquare size={20} />
                  </div>
                  <h3 className="text-xs tracking-[0.15em] uppercase text-foreground/80 font-medium mb-3">
                    Feedback
                  </h3>
                  <Link
                    href="/feedback"
                    className="text-sm text-foreground/50 hover:text-foreground/80 transition-colors"
                  >
                    Share your experience
                  </Link>
                </div>
              </BlurFade>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 sm:py-32 bg-warm relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-transparent to-foreground/10" />
          <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <BlurFade>
              <p className="text-2xl sm:text-3xl font-light tracking-tight text-foreground/80 mb-9 leading-snug">
                Have a custom idea in mind?
                <br />
                Let&apos;s bring it to life.
              </p>
            </BlurFade>
            <BlurFade delay={0.15}>
              <a
                href="/customize"
                className="inline-flex items-center gap-2 px-10 py-4 bg-foreground text-cream text-[12px] tracking-[0.15em] uppercase rounded-sm hover:bg-accent-dark transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                Start Customizing
              </a>
            </BlurFade>
          </div>
        </section>
      </main>
      <Footer />
    </PageTransition>
  );
}
