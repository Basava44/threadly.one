"use client";

import { useState, useEffect } from "react";
import { Loader2, LogOut, Search } from "lucide-react";

type OrderStatus = "confirmed" | "crafting" | "shipped" | "delivered";

interface Order {
  id: string;
  order_id: string;
  product: string;
  color: string;
  initials: string;
  quantity: number;
  price: number;
  status: OrderStatus;
  shipping_name: string;
  shipping_phone: string;
  shipping_city: string;
  created_at: string;
}

const statuses: OrderStatus[] = ["confirmed", "crafting", "shipped", "delivered"];

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);

  const getPassword = () => sessionStorage.getItem("threadly_admin_pw") || "";

  const fetchOrders = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: getPassword() }),
    });
    const json = await res.json();
    setLoading(false);
    if (json.orders) setOrders(json.orders as Order[]);
  };

  useEffect(() => {
    if (
      sessionStorage.getItem("threadly_admin") === "true" &&
      sessionStorage.getItem("threadly_admin_pw")
    ) {
      setAuthed(true);
    } else {
      sessionStorage.removeItem("threadly_admin");
      sessionStorage.removeItem("threadly_admin_pw");
    }
  }, []);

  useEffect(() => {
    if (authed) fetchOrders();
  }, [authed]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      sessionStorage.setItem("threadly_admin", "true");
      sessionStorage.setItem("threadly_admin_pw", password);
      setAuthed(true);
      setAuthError("");
    } else {
      setAuthError("Incorrect password");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("threadly_admin");
    sessionStorage.removeItem("threadly_admin_pw");
    setAuthed(false);
    setOrders([]);
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setUpdating(orderId);
    await fetch("/api/admin/update-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, status: newStatus, password: getPassword() }),
    });
    setOrders((prev) =>
      prev.map((o) => (o.order_id === orderId ? { ...o, status: newStatus } : o))
    );
    setUpdating(null);
  };

  const filtered = orders.filter((o) => {
    if (!filter) return true;
    const q = filter.toLowerCase();
    return (
      o.order_id.toLowerCase().includes(q) ||
      o.shipping_phone.includes(q) ||
      o.shipping_name.toLowerCase().includes(q)
    );
  });

  if (!authed) {
    return (
      <div className="min-h-screen bg-warm flex items-center justify-center px-4">
        <form onSubmit={handleLogin} className="w-full max-w-xs">
          <h1 className="text-lg font-light tracking-tight mb-6 text-center">Admin Access</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full px-5 py-3.5 bg-cream border border-foreground/15 rounded-sm text-sm placeholder:text-foreground/30 focus:outline-none focus:border-foreground/40 transition-colors mb-3"
          />
          {authError && <p className="text-[10px] text-red-500 mb-3">{authError}</p>}
          <button
            type="submit"
            className="w-full py-3.5 bg-foreground text-cream text-[11px] tracking-[0.15em] uppercase rounded-sm hover:bg-accent-dark transition-colors"
          >
            Enter
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-light tracking-tight">Order Management</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-[10px] tracking-[0.1em] uppercase text-foreground/50 hover:text-foreground transition-colors"
          >
            <LogOut size={14} strokeWidth={1.5} />
            Logout
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search size={14} strokeWidth={1.5} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30" />
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search by order ID, phone, or name..."
            className="w-full pl-10 pr-5 py-3 bg-cream border border-foreground/15 rounded-sm text-sm placeholder:text-foreground/30 focus:outline-none focus:border-foreground/40 transition-colors"
          />
        </div>

        {/* Status Overview */}
        {!loading && orders.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-3">
            {statuses.map((s) => {
              const count = orders.filter((o) => o.status === s).length;
              return (
                <div key={s} className="bg-cream border border-foreground/10 rounded-sm px-4 py-2.5 flex items-center gap-2">
                  <span className="text-[10px] tracking-[0.1em] uppercase text-foreground/40">{s}</span>
                  <span className="text-sm font-light">{count}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Product-wise Sales */}
        {!loading && orders.length > 0 && (
          <div className="mb-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {Object.entries(
              orders.reduce<Record<string, { qty: number; revenue: number }>>((acc, o) => {
                const key = o.product;
                if (!acc[key]) acc[key] = { qty: 0, revenue: 0 };
                acc[key].qty += o.quantity;
                acc[key].revenue += o.price * o.quantity;
                return acc;
              }, {})
            ).sort((a, b) => b[1].revenue - a[1].revenue).map(([product, data]) => (
              <div key={product} className="bg-cream border border-foreground/10 rounded-sm p-4">
                <p className="text-[10px] tracking-[0.1em] uppercase text-foreground/40 mb-1">{product}</p>
                <p className="text-lg font-light">&#8377;{data.revenue.toLocaleString("en-IN")}</p>
                <p className="text-[10px] text-foreground/40 mt-0.5">{data.qty} sold</p>
              </div>
            ))}
            <div className="bg-foreground text-cream border border-foreground/10 rounded-sm p-4">
              <p className="text-[10px] tracking-[0.1em] uppercase text-cream/50 mb-1">Total Revenue</p>
              <p className="text-lg font-light">&#8377;{orders.reduce((sum, o) => sum + o.price * o.quantity, 0).toLocaleString("en-IN")}</p>
              <p className="text-[10px] text-cream/50 mt-0.5">{orders.reduce((sum, o) => sum + o.quantity, 0)} items</p>
            </div>
          </div>
        )}

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={20} className="animate-spin text-foreground/30" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-foreground/40 py-20 text-sm">No orders found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-foreground/10">
                  <th className="text-left py-3 px-2 text-[10px] tracking-[0.1em] uppercase text-foreground/40 font-normal">Order ID</th>
                  <th className="text-left py-3 px-2 text-[10px] tracking-[0.1em] uppercase text-foreground/40 font-normal">Product</th>
                  <th className="text-left py-3 px-2 text-[10px] tracking-[0.1em] uppercase text-foreground/40 font-normal">Initials</th>
                  <th className="text-left py-3 px-2 text-[10px] tracking-[0.1em] uppercase text-foreground/40 font-normal">Customer</th>
                  <th className="text-left py-3 px-2 text-[10px] tracking-[0.1em] uppercase text-foreground/40 font-normal">Phone</th>
                  <th className="text-left py-3 px-2 text-[10px] tracking-[0.1em] uppercase text-foreground/40 font-normal">City</th>
                  <th className="text-left py-3 px-2 text-[10px] tracking-[0.1em] uppercase text-foreground/40 font-normal">Status</th>
                  <th className="text-left py-3 px-2 text-[10px] tracking-[0.1em] uppercase text-foreground/40 font-normal">Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => (
                  <tr key={order.order_id} className="border-b border-foreground/5 hover:bg-cream/50 transition-colors">
                    <td className="py-3 px-2 font-mono text-xs">{order.order_id}</td>
                    <td className="py-3 px-2 capitalize">{order.product}</td>
                    <td className="py-3 px-2">{order.initials || "—"}</td>
                    <td className="py-3 px-2">{order.shipping_name}</td>
                    <td className="py-3 px-2 font-mono text-xs">{order.shipping_phone}</td>
                    <td className="py-3 px-2">{order.shipping_city}</td>
                    <td className="py-3 px-2">
                      <div className="relative">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.order_id, e.target.value as OrderStatus)}
                          disabled={updating === order.order_id}
                          className="appearance-none bg-cream border border-foreground/15 rounded-sm px-3 py-1.5 text-[10px] tracking-[0.1em] uppercase pr-6 focus:outline-none focus:border-foreground/40 transition-colors disabled:opacity-50 cursor-pointer"
                        >
                          {statuses.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        {updating === order.order_id && (
                          <Loader2 size={10} className="absolute right-2 top-1/2 -translate-y-1/2 animate-spin" />
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-2 text-xs text-foreground/50">
                      {new Date(order.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Order count */}
        <p className="text-[10px] text-foreground/30 mt-4">
          {filtered.length} order{filtered.length !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
}
