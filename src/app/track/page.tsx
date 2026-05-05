"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { Search, Package, Scissors, Truck, CheckCircle2, ArrowLeft } from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

type OrderStatus = "confirmed" | "crafting" | "shipped" | "delivered";

interface OrderResult {
  id: string;
  status: OrderStatus;
  items: string[];
  date: string;
}

const statusSteps: { key: OrderStatus; label: string; icon: React.ReactNode }[] = [
  { key: "confirmed", label: "Order Confirmed", icon: <Package size={18} strokeWidth={1.5} /> },
  { key: "crafting", label: "Being Crafted", icon: <Scissors size={18} strokeWidth={1.5} /> },
  { key: "shipped", label: "Shipped", icon: <Truck size={18} strokeWidth={1.5} /> },
  { key: "delivered", label: "Delivered", icon: <CheckCircle2 size={18} strokeWidth={1.5} /> },
];

const statusIndex: Record<OrderStatus, number> = {
  confirmed: 0,
  crafting: 1,
  shipped: 2,
  delivered: 3,
};

export default function TrackPage() {
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState<OrderResult | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Dummy order data for now
    setOrder({
      id: "TH-M4X7K9",
      status: "crafting",
      items: ["Bucket Cap — Black — \"A|K\"", "Oversized Tee (M) — Olive — \"VIBES\""],
      date: "3 May 2026",
    });
    setSearched(true);
  };

  const currentStep = order ? statusIndex[order.status] : -1;

  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-4rem)] bg-warm">
        <div className="max-w-xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-2xl sm:text-3xl font-light tracking-tight mb-2">Track Your Order</h1>
            <p className="text-sm text-foreground/50 mb-10">
              Enter the phone number you used while placing the order.
            </p>

            <form onSubmit={handleSearch} className="flex gap-3 mb-12">
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="10-digit mobile number"
                pattern="[0-9]{10}"
                className="flex-1 px-5 py-3.5 bg-cream border border-foreground/15 rounded-sm text-sm placeholder:text-foreground/30 focus:outline-none focus:border-foreground/40 transition-colors"
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3.5 bg-foreground text-cream text-[11px] tracking-[0.15em] uppercase rounded-sm hover:bg-accent-dark transition-colors flex items-center gap-2"
              >
                <Search size={14} strokeWidth={1.5} />
                Track
              </motion.button>
            </form>

            {searched && order && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                {/* Order info */}
                <div className="bg-cream border border-foreground/8 rounded-sm p-5 mb-8">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs text-foreground/50">Order ID</p>
                    <p className="font-mono text-sm font-medium">{order.id}</p>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs text-foreground/50">Placed on</p>
                    <p className="text-sm">{order.date}</p>
                  </div>
                  <div className="border-t border-foreground/8 pt-3">
                    <p className="text-[10px] tracking-[0.15em] uppercase text-foreground/40 mb-2">Items</p>
                    {order.items.map((item, i) => (
                      <p key={i} className="text-xs text-foreground/70 mb-1">{item}</p>
                    ))}
                  </div>
                </div>

                {/* Status tracker */}
                <div className="relative">
                  {statusSteps.map((step, i) => {
                    const isComplete = i <= currentStep;
                    const isCurrent = i === currentStep;
                    return (
                      <motion.div
                        key={step.key}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.1 }}
                        className="flex items-center gap-4 mb-6 last:mb-0"
                      >
                        {/* Icon circle */}
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                            isComplete
                              ? "bg-foreground text-cream"
                              : "bg-foreground/5 text-foreground/30"
                          } ${isCurrent ? "ring-2 ring-foreground/20 ring-offset-2 ring-offset-warm" : ""}`}
                        >
                          {step.icon}
                        </div>
                        {/* Label */}
                        <div>
                          <p className={`text-sm ${isComplete ? "font-medium" : "text-foreground/40"}`}>
                            {step.label}
                          </p>
                          {isCurrent && (
                            <p className="text-[10px] text-foreground/50 mt-0.5">Current status</p>
                          )}
                        </div>
                        {/* Connector line */}
                        {i < statusSteps.length - 1 && (
                          <div className="absolute left-5 w-px h-6 bg-foreground/10" style={{ top: `${i * 56 + 40}px` }} />
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {searched && !order && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <p className="text-foreground/40 mb-4">No order found for this number.</p>
                <Link
                  href="/customize"
                  className="text-[10px] tracking-[0.15em] uppercase text-foreground/50 hover:text-foreground transition-colors underline underline-offset-4"
                >
                  Start Customising
                </Link>
              </motion.div>
            )}

            <div className="mt-12 pt-6 border-t border-foreground/10">
              <Link
                href="/"
                className="text-xs text-foreground/50 hover:text-foreground transition-colors flex items-center gap-1"
              >
                <ArrowLeft size={14} strokeWidth={1.5} />
                Back to home
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
