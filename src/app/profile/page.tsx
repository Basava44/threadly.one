"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";

const user = {
  name: "Alex Rivers",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
  phone: "+1 (555) 123-4567",
  email: "alex.rivers@example.com",
  address: {
    street: "123 Serene Lane",
    city: "Quiet Valley, CA 94000",
    country: "United States",
  },
};

const orders = [
  { id: "#SH-9842", date: "Oct 12, 2023", status: "Delivered", total: "$142.00" },
  { id: "#SH-9731", date: "Sep 28, 2023", status: "Shipped", total: "$89.50" },
  { id: "#SH-9604", date: "Aug 15, 2023", status: "Delivered", total: "$210.25" },
];

function StatusBadge({ status }: { status: string }) {
  const isDelivered = status === "Delivered";
  return (
    <span
      className={`text-xs font-medium px-3 py-1 rounded border ${
        isDelivered
          ? "border-[#8B7D3C]/30 bg-[#8B7D3C]/5 text-[#8B7D3C]"
          : "border-foreground/20 bg-foreground/5 text-foreground/70"
      }`}
    >
      {status.toUpperCase()}
    </span>
  );
}

export default function ProfilePage() {
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("threadly_logged_in") !== "true") {
      router.replace("/login");
    }
  }, [router]);

  function handleLogout() {
    localStorage.removeItem("threadly_logged_in");
    router.push("/login");
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <Header />

      <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-10">
        {/* Avatar & Name */}
        <div className="flex flex-col items-center mb-12">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-24 h-24 rounded-md object-cover mb-4"
          />
          <h2 className="text-xl font-semibold">{user.name}</h2>
        </div>

        {/* Contact & Address */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <h3 className="text-lg font-semibold">Contact & Address</h3>
            <div className="flex-1 h-px bg-foreground/10" />
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <p className="text-xs font-medium tracking-wider text-[#8B7D3C] mb-1">PHONE</p>
              <p className="text-sm">{user.phone}</p>
            </div>
            <div>
              <p className="text-xs font-medium tracking-wider text-[#8B7D3C] mb-1">EMAIL</p>
              <p className="text-sm">{user.email}</p>
            </div>
          </div>

          <div>
            <p className="text-xs font-medium tracking-wider text-[#8B7D3C] mb-1">SHIPPING ADDRESS</p>
            <p className="text-sm leading-relaxed">
              {user.address.street}<br />
              {user.address.city}<br />
              {user.address.country}
            </p>
          </div>
        </section>

        {/* Recent Orders */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Recent Orders</h3>
            <button className="text-xs font-medium tracking-wider text-foreground/50 hover:text-foreground transition-colors">
              VIEW ALL
            </button>
          </div>

          <div className="border-t border-foreground/10">
            <div className="grid grid-cols-4 py-3 border-b border-foreground/10">
              <span className="text-xs font-medium tracking-wider text-[#8B7D3C]">ORDER ID</span>
              <span className="text-xs font-medium tracking-wider text-[#8B7D3C]">DATE</span>
              <span className="text-xs font-medium tracking-wider text-[#8B7D3C]">STATUS</span>
              <span className="text-xs font-medium tracking-wider text-[#8B7D3C] text-right">TOTAL</span>
            </div>

            {orders.map((order) => (
              <div key={order.id} className="grid grid-cols-4 items-center py-4 border-b border-foreground/5">
                <span className="text-sm">{order.id}</span>
                <span className="text-sm text-foreground/60">{order.date}</span>
                <StatusBadge status={order.status} />
                <span className="text-sm font-semibold text-right">{order.total}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Actions */}
        <div className="flex gap-4 pt-4">
          <button
            onClick={() => alert("Password reset link sent to your email!")}
            className="flex items-center gap-2 px-5 py-2.5 border border-foreground/15 rounded text-sm font-medium hover:border-foreground/30 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.78 7.78 5.5 5.5 0 0 1 7.78-7.78zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
            </svg>
            RESET PASSWORD
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2.5 border border-foreground/15 rounded text-sm font-medium hover:border-foreground/30 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            LOGOUT
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
