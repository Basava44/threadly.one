"use client";

import { useState, useRef } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { Search, Package, Scissors, Truck, CheckCircle2, ArrowLeft, Loader2 } from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { supabase } from "@/lib/supabase";

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
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [orders, setOrders] = useState<OrderResult[]>([]);
  const [order, setOrder] = useState<OrderResult | null>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startResendTimer = () => {
    setResendTimer(45);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleReset = () => {
    setPhone("");
    setOtp("");
    setOtpSent(false);
    setSearched(false);
    setOrders([]);
    setOrder(null);
    setError("");
    setResendTimer(0);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleSendOtp = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!/^[0-9]{10}$/.test(phone)) return;
    setLoading(true);
    setError("");
    const { error: err } = await supabase.auth.signInWithOtp({
      phone: "+91" + phone,
    });
    setLoading(false);
    if (err) {
      setError(err.message);
    } else {
      setOtpSent(true);
      startResendTimer();
    }
  };

  const handleVerifyAndFetch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return;
    setLoading(true);
    setError("");
    const { error: err } = await supabase.auth.verifyOtp({
      phone: "+91" + phone,
      token: otp,
      type: "sms",
    });
    if (err) {
      setLoading(false);
      setError(err.message);
      return;
    }

    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    setLoading(false);
    setSearched(true);

    if (data && data.length > 0) {
      const mapped: OrderResult[] = data.map((row) => ({
        id: row.order_id,
        status: row.status as OrderStatus,
        items: [`${row.product} — ${row.color} — "${row.initials}"`],
        date: new Date(row.created_at).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
      }));
      setOrders(mapped);
      setOrder(mapped[0]);
    } else {
      setOrders([]);
      setOrder(null);
    }
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

            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="flex flex-col gap-3 mb-12">
                <div className="flex gap-3">
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    className="flex-1 px-5 py-3.5 bg-cream border border-foreground/15 rounded-sm text-sm placeholder:text-foreground/30 focus:outline-none focus:border-foreground/40 transition-colors"
                  />
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3.5 bg-foreground text-cream text-[11px] tracking-[0.15em] uppercase rounded-sm hover:bg-accent-dark transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    {loading ? <Loader2 size={14} className="animate-spin" /> : <><Search size={14} strokeWidth={1.5} />Send OTP</>}
                  </motion.button>
                </div>
                {error && <p className="text-[10px] text-red-500">{error}</p>}
              </form>
            ) : !searched ? (
              <form onSubmit={handleVerifyAndFetch} className="flex flex-col gap-3 mb-12">
                <p className="text-xs text-foreground/50">OTP sent to +91{phone}</p>
                <div className="flex gap-3">
                  <input
                    type="text"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    className="flex-1 px-5 py-3.5 bg-cream border border-foreground/15 rounded-sm text-sm placeholder:text-foreground/30 focus:outline-none focus:border-foreground/40 transition-colors"
                  />
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3.5 bg-foreground text-cream text-[11px] tracking-[0.15em] uppercase rounded-sm hover:bg-accent-dark transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    {loading ? <Loader2 size={14} className="animate-spin" /> : "Verify & Track"}
                  </motion.button>
                </div>
                {error && <p className="text-[10px] text-red-500">{error}</p>}
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => handleSendOtp()}
                    disabled={resendTimer > 0 || loading}
                    className="text-[10px] text-foreground/50 hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-[10px] text-foreground/50 hover:text-foreground transition-colors"
                  >
                    Wrong number?
                  </button>
                </div>
              </form>
            ) : null}

            {searched && order && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                {/* Order selector */}
                {orders.length > 1 && (
                  <div className="flex gap-2 mb-6 flex-wrap">
                    {orders.map((o) => (
                      <button
                        key={o.id}
                        onClick={() => setOrder(o)}
                        className={`px-3 py-1.5 text-[10px] tracking-[0.1em] uppercase rounded-sm border transition-colors ${
                          order.id === o.id
                            ? "bg-foreground text-cream border-foreground"
                            : "border-foreground/15 text-foreground/60 hover:border-foreground/40"
                        }`}
                      >
                        {o.id}
                      </button>
                    ))}
                  </div>
                )}

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

            <div className="mt-12 pt-6 border-t border-foreground/10 flex items-center justify-between">
              <Link
                href="/"
                className="text-xs text-foreground/50 hover:text-foreground transition-colors flex items-center gap-1"
              >
                <ArrowLeft size={14} strokeWidth={1.5} />
                Back to home
              </Link>
              {searched && (
                <button
                  onClick={handleReset}
                  className="text-xs text-foreground/50 hover:text-foreground transition-colors"
                >
                  Check another number
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
