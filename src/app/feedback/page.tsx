"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { Check, Loader2 } from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export default function FeedbackPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/send-feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Something went wrong. Please try again.");
      return;
    }

    setSent(true);
  };

  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-4rem)] bg-warm">
        <div className="max-w-xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          {sent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-20"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                className="w-16 h-16 mx-auto mb-6 rounded-full bg-foreground/5 flex items-center justify-center"
              >
                <Check size={28} strokeWidth={1.5} className="text-foreground/70" />
              </motion.div>
              <h1 className="text-2xl sm:text-3xl font-light tracking-tight mb-2">
                Thank you!
              </h1>
              <p className="text-sm text-foreground/50 mb-6">
                Your feedback has been sent. We appreciate it.
              </p>
              <Link
                href="/"
                className="inline-block px-8 py-3 bg-foreground text-cream text-[11px] tracking-[0.15em] uppercase rounded-sm hover:bg-accent-dark transition-colors"
              >
                Back to Home
              </Link>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h1 className="text-2xl sm:text-3xl font-light tracking-tight mb-2">
                Feedback
              </h1>
              <p className="text-sm text-foreground/50 mb-10">
                We&apos;d love to hear from you.
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div>
                  <label className="text-[11px] tracking-[0.2em] uppercase text-foreground/50 mb-2 block">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your name"
                    className="w-full px-5 py-3.5 bg-cream border border-foreground/15 rounded-sm text-sm placeholder:text-foreground/30 focus:outline-none focus:border-foreground/40 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-[11px] tracking-[0.2em] uppercase text-foreground/50 mb-2 block">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="your@email.com"
                    className="w-full px-5 py-3.5 bg-cream border border-foreground/15 rounded-sm text-sm placeholder:text-foreground/30 focus:outline-none focus:border-foreground/40 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-[11px] tracking-[0.2em] uppercase text-foreground/50 mb-2 block">
                    Message
                  </label>
                  <textarea
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Your feedback..."
                    rows={5}
                    className="w-full px-5 py-3.5 bg-cream border border-foreground/15 rounded-sm text-sm placeholder:text-foreground/30 focus:outline-none focus:border-foreground/40 transition-colors resize-none"
                  />
                </div>

                {error && (
                  <p className="text-[11px] text-red-500">{error}</p>
                )}

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-foreground text-cream text-[12px] tracking-[0.15em] uppercase rounded-sm hover:bg-accent-dark transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 size={16} className="animate-spin mx-auto" />
                  ) : (
                    "Send Feedback"
                  )}
                </motion.button>
              </form>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
