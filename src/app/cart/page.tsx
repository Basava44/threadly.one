"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { Minus, Plus, Trash2, ArrowLeft, Check, Loader2 } from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { CartItem, getCart, removeFromCart, updateCartItem, clearCart } from "../data/cart";
import { customizerColors } from "../data/products";
import { supabase } from "@/lib/supabase";

const productLabels: Record<string, string> = {
  cap: "Bucket Cap",
  tee: "Oversized Tee",
  tote: "Tote Bag",
};

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [step, setStep] = useState<"review" | "checkout" | "done">("review");
  const [form, setForm] = useState({ name: "", phone: "", address: "", city: "", pincode: "" });
  const [orderId, setOrderId] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setCart(getCart());
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleRemove = (id: string) => {
    removeFromCart(id);
    setCart(getCart());
  };

  const handleQuantity = (id: string, delta: number) => {
    const item = cart.find((i) => i.id === id);
    if (!item) return;
    const newQty = Math.max(1, item.quantity + delta);
    updateCartItem(id, { quantity: newQty });
    setCart(getCart());
  };

  const handleSizeChange = (id: string, newSize: string) => {
    updateCartItem(id, { size: newSize });
    setCart(getCart());
  };

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

  const handleSendOtp = async () => {
    if (!/^[0-9]{10}$/.test(form.phone)) return;
    setAuthLoading(true);
    setAuthError("");
    const { error } = await supabase.auth.signInWithOtp({
      phone: "+91" + form.phone,
    });
    setAuthLoading(false);
    if (error) {
      setAuthError(error.message);
    } else {
      setOtpSent(true);
      startResendTimer();
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) return;
    setAuthLoading(true);
    setAuthError("");
    const { error } = await supabase.auth.verifyOtp({
      phone: "+91" + form.phone,
      token: otp,
      type: "sms",
    });
    setAuthLoading(false);
    if (error) {
      setAuthError(error.message);
    } else {
      setPhoneVerified(true);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneVerified) return;
    setAuthLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setAuthLoading(false); return; }

    const orderIds: string[] = [];
    for (const item of cart) {
      const oid = `TH${Math.floor(1000 + Math.random() * 9000)}`;
      orderIds.push(oid);
      await supabase.from("orders").insert({
        order_id: oid,
        user_id: user.id,
        product: item.product,
        color: item.color,
        initials: item.text || "",
        size: item.size || null,
        quantity: item.quantity,
        price: item.price,
        status: "confirmed",
        shipping_name: form.name,
        shipping_phone: form.phone,
        shipping_address: form.address,
        shipping_city: form.city,
        shipping_pincode: form.pincode,
      });
    }

    setAuthLoading(false);
    setOrderId(orderIds[0]);
    clearCart();
    setStep("done");
  };

  const getColorName = (hex: string) =>
    customizerColors.find((c) => c.hex === hex)?.name || hex;

  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-4rem)] bg-warm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <AnimatePresence mode="wait">
            {step === "review" && (
              <motion.div
                key="review"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <motion.h1
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-2xl sm:text-3xl font-light tracking-tight mb-2"
                >
                  Your Order
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="text-sm text-foreground/50 mb-10"
                >
                  Review what you&apos;ve customised
                </motion.p>

                {cart.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="text-center py-20"
                  >
                    <p className="text-foreground/40 mb-6">Nothing here yet.</p>
                    <Link
                      href="/customize"
                      className="inline-block px-8 py-3 bg-foreground text-cream text-[11px] tracking-[0.15em] uppercase rounded-sm hover:bg-accent-dark transition-colors"
                    >
                      Start Customising
                    </Link>
                  </motion.div>
                ) : (
                  <>
                    <div className="flex flex-col gap-4">
                      <AnimatePresence>
                        {cart.map((item, index) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.08 }}
                            layout
                            className="bg-cream border border-foreground/8 rounded-sm p-4 sm:p-5"
                          >
                            {/* Item number */}
                            <div className="flex items-center gap-2 mb-3">
                              <span className="w-6 h-6 rounded-full bg-foreground text-cream text-[10px] flex items-center justify-center font-medium">
                                {index + 1}
                              </span>
                              <span className="text-[10px] tracking-[0.2em] uppercase text-foreground/40">
                                Item {index + 1} of {cart.length}
                              </span>
                            </div>

                            <div className="flex items-center gap-4 sm:gap-6">
                              {/* Color swatch */}
                              <div
                                className="w-12 h-12 rounded-full border border-foreground/10 shrink-0"
                                style={{ backgroundColor: item.color }}
                              />

                              {/* Details */}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium">
                                  {productLabels[item.product]}
                                </p>
                                <p className="text-xs text-foreground/50 mt-0.5">
                                  {getColorName(item.color)} · &ldquo;{item.text || "No text"}&rdquo;
                                </p>

                                {/* Size selector (tee only) */}
                                {item.product === "tee" && (
                                  <div className="flex items-center gap-1.5 mt-2">
                                    <span className="text-[9px] tracking-[0.15em] uppercase text-foreground/40">Size:</span>
                                    {["S", "M", "L", "XL", "XXL"].map((s) => (
                                      <button
                                        key={s}
                                        onClick={() => handleSizeChange(item.id, s)}
                                        className={`w-7 h-7 text-[9px] rounded-sm border transition-colors ${
                                          item.size === s
                                            ? "bg-foreground text-cream border-foreground"
                                            : "border-foreground/15 text-foreground/60 hover:border-foreground/40"
                                        }`}
                                      >
                                        {s}
                                      </button>
                                    ))}
                                  </div>
                                )}

                                {/* Quantity + actions */}
                                <div className="flex items-center gap-3 mt-3">
                                  {/* Quantity */}
                                  <div className="flex items-center border border-foreground/15 rounded-sm">
                                    <button
                                      onClick={() => handleQuantity(item.id, -1)}
                                      className="w-7 h-7 flex items-center justify-center text-foreground/50 hover:text-foreground transition-colors"
                                    >
                                      <Minus size={12} />
                                    </button>
                                    <span className="w-8 text-center text-xs font-medium">{item.quantity}</span>
                                    <button
                                      onClick={() => handleQuantity(item.id, 1)}
                                      className="w-7 h-7 flex items-center justify-center text-foreground/50 hover:text-foreground transition-colors"
                                    >
                                      <Plus size={12} />
                                    </button>
                                  </div>

                                  {/* Edit */}
                                  <Link
                                    href={`/customize?edit=${item.id}`}
                                    className="text-[10px] tracking-[0.1em] uppercase text-foreground/50 hover:text-foreground transition-colors border border-foreground/15 px-2.5 py-1.5 rounded-sm hover:border-foreground/40"
                                  >
                                    Edit
                                  </Link>

                                </div>
                              </div>

                              {/* Price + Delete */}
                              <div className="flex flex-col items-end gap-3 self-center shrink-0">
                                <p className="text-sm font-medium whitespace-nowrap">
                                  ₹{(item.price * item.quantity).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                </p>
                                <button
                                  onClick={() => handleRemove(item.id)}
                                  className="text-red-500/60 hover:text-red-500 transition-colors"
                                  aria-label="Delete item"
                                >
                                  <Trash2 size={16} strokeWidth={1.5} />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>

                    {/* Total + Proceed */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.3 }}
                      className="mt-8 pt-6 border-t border-foreground/10 flex items-center justify-between"
                    >
                      <div>
                        <p className="text-[10px] tracking-[0.15em] uppercase text-foreground/40 mb-1">
                          {cart.reduce((sum, i) => sum + i.quantity, 0)} item{cart.reduce((sum, i) => sum + i.quantity, 0) > 1 ? "s" : ""}
                        </p>
                        <p className="text-xl font-light">
                          ₹{total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setStep("checkout")}
                        className="px-8 py-3.5 bg-foreground text-cream text-[11px] tracking-[0.15em] uppercase rounded-sm hover:bg-accent-dark transition-colors"
                      >
                        Proceed to Checkout
                      </motion.button>
                    </motion.div>
                  </>
                )}
              </motion.div>
            )}

            {step === "checkout" && (
              <motion.div
                key="checkout"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  onClick={() => setStep("review")}
                  className="text-xs text-foreground/50 hover:text-foreground transition-colors mb-6 flex items-center gap-1"
                >
                  <ArrowLeft size={14} strokeWidth={1.5} />
                  Back to order
                </motion.button>

                <motion.h1
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-2xl sm:text-3xl font-light tracking-tight mb-2"
                >
                  Shipping Details
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="text-sm text-foreground/50 mb-10"
                >
                  Where should we deliver your order?
                </motion.p>

                <motion.form
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  onSubmit={handlePlaceOrder}
                  className="flex flex-col gap-5"
                >
                  <div>
                    <label className="text-[11px] tracking-[0.2em] uppercase text-foreground/50 mb-2 block">Name</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Your full name"
                      className="w-full px-5 py-3.5 bg-cream border border-foreground/15 rounded-sm text-sm placeholder:text-foreground/30 focus:outline-none focus:border-foreground/40 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] tracking-[0.2em] uppercase text-foreground/50 mb-2 block">Phone</label>
                    <div className="flex gap-2">
                      <input
                        type="tel"
                        required
                        value={form.phone}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                          setForm({ ...form, phone: val });
                          if (phoneVerified) { setPhoneVerified(false); setOtpSent(false); setOtp(""); }
                        }}
                        placeholder="10-digit mobile number"
                        maxLength={10}
                        disabled={phoneVerified}
                        className="flex-1 px-5 py-3.5 bg-cream border border-foreground/15 rounded-sm text-sm placeholder:text-foreground/30 focus:outline-none focus:border-foreground/40 transition-colors disabled:opacity-50"
                      />
                      {!phoneVerified && !otpSent && (
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          disabled={authLoading}
                          className="px-4 py-3.5 bg-foreground text-cream text-[10px] tracking-[0.1em] uppercase rounded-sm hover:bg-accent-dark transition-colors whitespace-nowrap disabled:opacity-50"
                        >
                          {authLoading ? <Loader2 size={14} className="animate-spin" /> : "Send OTP"}
                        </button>
                      )}
                      {phoneVerified && (
                        <div className="flex items-center px-3 text-green-600">
                          <Check size={16} strokeWidth={2} />
                        </div>
                      )}
                    </div>
                    {otpSent && !phoneVerified && (
                      <div className="mt-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                            placeholder="Enter 6-digit OTP"
                            maxLength={6}
                            className="flex-1 px-5 py-3 bg-cream border border-foreground/15 rounded-sm text-sm placeholder:text-foreground/30 focus:outline-none focus:border-foreground/40 transition-colors"
                          />
                          <button
                            type="button"
                            onClick={handleVerifyOtp}
                            disabled={authLoading}
                            className="px-4 py-3 bg-foreground text-cream text-[10px] tracking-[0.1em] uppercase rounded-sm hover:bg-accent-dark transition-colors disabled:opacity-50"
                          >
                            {authLoading ? <Loader2 size={14} className="animate-spin" /> : "Verify"}
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          disabled={resendTimer > 0 || authLoading}
                          className="text-[10px] text-foreground/50 hover:text-foreground mt-2 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                          {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
                        </button>
                      </div>
                    )}
                    <span className="text-[9px] text-foreground/40 mt-1 block">
                      {phoneVerified ? "Phone verified" : "We\u2019ll send order updates here"}
                    </span>
                    {authError && (
                      <span className="text-[10px] text-red-500 mt-1 block">{authError}</span>
                    )}
                  </div>

                  <div>
                    <label className="text-[11px] tracking-[0.2em] uppercase text-foreground/50 mb-2 block">Address</label>
                    <textarea
                      required
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      placeholder="House/flat no., street, landmark"
                      rows={3}
                      className="w-full px-5 py-3.5 bg-cream border border-foreground/15 rounded-sm text-sm placeholder:text-foreground/30 focus:outline-none focus:border-foreground/40 transition-colors resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] tracking-[0.2em] uppercase text-foreground/50 mb-2 block">City</label>
                      <input
                        type="text"
                        required
                        value={form.city}
                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                        placeholder="City"
                        className="w-full px-5 py-3.5 bg-cream border border-foreground/15 rounded-sm text-sm placeholder:text-foreground/30 focus:outline-none focus:border-foreground/40 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] tracking-[0.2em] uppercase text-foreground/50 mb-2 block">Pincode</label>
                      <input
                        type="text"
                        required
                        value={form.pincode}
                        onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                        placeholder="6-digit pincode"
                        pattern="[0-9]{6}"
                        className="w-full px-5 py-3.5 bg-cream border border-foreground/15 rounded-sm text-sm placeholder:text-foreground/30 focus:outline-none focus:border-foreground/40 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Order summary */}
                  <div className="mt-4 pt-6 border-t border-foreground/10">
                    <div className="flex justify-between text-sm mb-4">
                      <span className="text-foreground/60">{cart.reduce((sum, i) => sum + i.quantity, 0)} item{cart.reduce((sum, i) => sum + i.quantity, 0) > 1 ? "s" : ""}</span>
                      <span className="font-medium">₹{total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                    </div>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-4 bg-foreground text-cream text-[12px] tracking-[0.15em] uppercase rounded-sm hover:bg-accent-dark transition-colors"
                    >
                      Place Order — ₹{total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </motion.button>
                  </div>
                </motion.form>
              </motion.div>
            )}

            {step === "done" && (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
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
                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl sm:text-3xl font-light tracking-tight mb-2"
                >
                  Order Placed!
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-sm text-foreground/50 mb-2"
                >
                  Your order ID is <span className="font-mono font-medium text-foreground">{orderId}</span>
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-sm text-foreground/50 mb-10"
                >
                  We&apos;ll send updates to your phone number.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-col sm:flex-row justify-center items-center gap-3 "
                >
                  <Link
                    href="/"
                    className="inline-block px-8 py-3 border border-foreground/20 text-foreground text-[11px] tracking-[0.15em] uppercase rounded-sm hover:border-foreground/40 transition-colors"
                  >
                    Back to Home
                  </Link>
                  <Link
                    href="/track"
                    className="inline-block px-8 py-3 bg-foreground text-cream text-[11px] tracking-[0.15em] uppercase rounded-sm hover:bg-accent-dark transition-colors"
                  >
                    Track Order
                  </Link>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </>
  );
}
