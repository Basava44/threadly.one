"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { Search, Package, Scissors, Truck, CheckCircle2, ArrowLeft, Loader2, Phone, Download } from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { supabase } from "@/lib/supabase";
import { generateReceipt } from "@/lib/generateReceipt";

type OrderStatus = "confirmed" | "crafting" | "shipped" | "delivered";

interface OrderResult {
  id: string;
  status: OrderStatus;
  items: string[];
  date: string;
  price: number;
  quantity: number;
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
        price: row.price || 0,
        quantity: row.quantity || 1,
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
            transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
          >
            {/* Header section */}
            <div className="mb-10">
              <div className="w-12 h-12 rounded-full bg-cream border border-foreground/10 flex items-center justify-center mb-5">
                <Package size={20} strokeWidth={1.5} className="text-foreground/50" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-light tracking-tight mb-2">Track Your Order</h1>
              <p className="text-sm text-foreground/45">
                Enter the phone number you used while placing the order.
              </p>
            </div>

            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="mb-12">
                <div className="bg-cream border border-foreground/10 rounded-lg p-6">
                  <label className="text-[10px] tracking-[0.2em] uppercase text-foreground/40 mb-3 block">
                    Phone Number
                  </label>
                  <div className="flex gap-3">
                    <div className="flex items-center gap-2 px-4 py-3.5 bg-warm border border-foreground/10 rounded-sm">
                      <Phone size={14} strokeWidth={1.5} className="text-foreground/40" />
                      <span className="text-sm text-foreground/60">+91</span>
                    </div>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      placeholder="10-digit mobile number"
                      maxLength={10}
                      className="flex-1 px-5 py-3.5 bg-warm border border-foreground/10 rounded-sm text-sm placeholder:text-foreground/25 focus:outline-none focus:border-foreground/30 transition-colors"
                    />
                  </div>
                  {error && (
                    <p className="text-[11px] text-red-500 mt-3">{error}</p>
                  )}
                  <motion.button
                    type="submit"
                    disabled={loading || phone.length !== 10}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full mt-4 px-6 py-3.5 bg-foreground text-cream text-[11px] tracking-[0.15em] uppercase rounded-sm hover:bg-accent-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-40"
                  >
                    {loading ? <Loader2 size={14} className="animate-spin" /> : <><Search size={14} strokeWidth={1.5} />Send OTP</>}
                  </motion.button>
                </div>
              </form>
            ) : !searched ? (
              <form onSubmit={handleVerifyAndFetch} className="mb-12">
                <div className="bg-cream border border-foreground/10 rounded-lg p-6">
                  <p className="text-xs text-foreground/50 mb-4">
                    OTP sent to <span className="font-mono font-medium">+91 {phone}</span>
                  </p>
                  <label className="text-[10px] tracking-[0.2em] uppercase text-foreground/40 mb-3 block">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    className="w-full px-5 py-3.5 bg-warm border border-foreground/10 rounded-sm text-sm font-mono tracking-widest placeholder:text-foreground/25 placeholder:tracking-normal placeholder:font-sans focus:outline-none focus:border-foreground/30 transition-colors"
                  />
                  {error && (
                    <p className="text-[11px] text-red-500 mt-3">{error}</p>
                  )}
                  <motion.button
                    type="submit"
                    disabled={loading || otp.length !== 6}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full mt-4 px-6 py-3.5 bg-foreground text-cream text-[11px] tracking-[0.15em] uppercase rounded-sm hover:bg-accent-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-40"
                  >
                    {loading ? <Loader2 size={14} className="animate-spin" /> : "Verify & Track"}
                  </motion.button>
                  <div className="flex items-center gap-4 mt-4">
                    <button
                      type="button"
                      onClick={() => handleSendOtp()}
                      disabled={resendTimer > 0 || loading}
                      className="text-[10px] text-foreground/50 hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
                    </button>
                    <span className="w-px h-3 bg-foreground/15" />
                    <button
                      type="button"
                      onClick={handleReset}
                      className="text-[10px] text-foreground/50 hover:text-foreground transition-colors"
                    >
                      Wrong number?
                    </button>
                  </div>
                </div>
              </form>
            ) : null}

            <AnimatePresence mode="wait">
              {searched && order && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
                >
                  {/* Order selector */}
                  {orders.length > 1 && (
                    <div className="flex gap-2 mb-6 flex-wrap">
                      {orders.map((o) => (
                        <button
                          key={o.id}
                          onClick={() => setOrder(o)}
                          className={`px-3.5 py-2 text-[10px] tracking-[0.1em] uppercase rounded-sm border transition-all duration-200 ${
                            order.id === o.id
                              ? "bg-foreground text-cream border-foreground shadow-sm"
                              : "border-foreground/12 text-foreground/60 hover:border-foreground/30 bg-cream"
                          }`}
                        >
                          {o.id}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Order info card */}
                  <div className="bg-cream border border-foreground/10 rounded-lg p-6 mb-8">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[10px] tracking-[0.15em] uppercase text-foreground/40">Order ID</p>
                      <p className="font-mono text-sm font-medium">{order.id}</p>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-[10px] tracking-[0.15em] uppercase text-foreground/40">Placed on</p>
                      <p className="text-sm">{order.date}</p>
                    </div>
                    <div className="border-t border-foreground/8 pt-4">
                      <p className="text-[10px] tracking-[0.15em] uppercase text-foreground/40 mb-2">Items</p>
                      {order.items.map((item, i) => (
                        <p key={i} className="text-xs text-foreground/65 mb-1">{item}</p>
                      ))}
                    </div>
                  </div>

                  {/* Download Receipt */}
                  <button
                    onClick={() =>
                      generateReceipt({
                        orderId: order.id,
                        date: order.date,
                        items: order.items.map((item) => ({ name: item, quantity: order.quantity, price: order.price })),
                        total: order.price * order.quantity,
                        status: order.status,
                      })
                    }
                    className="w-full mb-8 px-5 py-3.5 bg-cream border border-foreground/10 rounded-lg text-[11px] tracking-[0.15em] uppercase text-foreground/60 hover:text-foreground hover:border-foreground/25 transition-all flex items-center justify-center gap-2"
                  >
                    <Download size={14} strokeWidth={1.5} />
                    Download Receipt
                  </button>

                  {/* Status tracker */}
                  <div className="bg-cream border border-foreground/10 rounded-lg p-6">
                    <p className="text-[10px] tracking-[0.15em] uppercase text-foreground/40 mb-6">
                      Order Progress
                    </p>
                    <div className="relative">
                      {/* Vertical connector line */}
                      <div className="absolute left-[20px] top-[20px] bottom-[20px] w-px bg-foreground/10" />
                      <div
                        className="absolute left-[20px] top-[20px] w-px bg-foreground transition-all duration-700"
                        style={{ height: `calc(${(currentStep / (statusSteps.length - 1)) * 100}% - ${(currentStep / (statusSteps.length - 1)) * 40}px)` }}
                      />

                      {statusSteps.map((step, i) => {
                        const isComplete = i <= currentStep;
                        const isCurrent = i === currentStep;
                        return (
                          <motion.div
                            key={step.key}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: i * 0.1 }}
                            className="relative flex items-center gap-4 mb-8 last:mb-0"
                          >
                            <div
                              className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 ${
                                isComplete
                                  ? "bg-foreground text-cream shadow-sm"
                                  : "bg-warm border border-foreground/12 text-foreground/25"
                              } ${isCurrent ? "ring-[3px] ring-foreground/10 ring-offset-2 ring-offset-cream" : ""}`}
                            >
                              {step.icon}
                            </div>
                            <div>
                              <p className={`text-sm transition-colors duration-300 ${isComplete ? "font-medium text-foreground" : "text-foreground/35"}`}>
                                {step.label}
                              </p>
                              {isCurrent && (
                                <motion.p
                                  initial={{ opacity: 0, y: 4 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="text-[10px] text-foreground/45 mt-0.5"
                                >
                                  Current status
                                </motion.p>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}

              {searched && !order && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16 bg-cream border border-foreground/8 rounded-lg"
                >
                  <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-warm flex items-center justify-center">
                    <Package size={22} strokeWidth={1.5} className="text-foreground/30" />
                  </div>
                  <p className="text-foreground/40 mb-4">No order found for this number.</p>
                  <Link
                    href="/customize"
                    className="text-[11px] tracking-[0.15em] uppercase text-foreground/60 hover:text-foreground transition-colors underline underline-offset-4"
                  >
                    Start Customising
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-12 pt-6 border-t border-foreground/8 flex items-center justify-between">
              <Link
                href="/"
                className="text-xs text-foreground/45 hover:text-foreground transition-colors flex items-center gap-1.5 group"
              >
                <ArrowLeft size={14} strokeWidth={1.5} className="group-hover:-translate-x-0.5 transition-transform" />
                Back to home
              </Link>
              {searched && (
                <button
                  onClick={handleReset}
                  className="text-xs text-foreground/45 hover:text-foreground transition-colors"
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
