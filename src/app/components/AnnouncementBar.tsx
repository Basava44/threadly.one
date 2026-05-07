"use client";

import { Marquee } from "@/components/magicui/marquee";
import { Truck, Sparkles, Heart } from "lucide-react";

const announcements = [
  { icon: <Truck size={13} strokeWidth={1.5} />, text: "Free shipping on orders above ₹999" },
  { icon: <Sparkles size={13} strokeWidth={1.5} />, text: "Handcrafted with love, just for you" },
  { icon: <Heart size={13} strokeWidth={1.5} />, text: "Custom embroidery in 3-5 days" },
];

export function AnnouncementBar() {
  return (
    <div className="bg-foreground text-cream py-2.5 overflow-hidden">
      <Marquee duration="25s" pauseOnHover>
        {announcements.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-2 mx-8 text-[11px] tracking-[0.2em] uppercase whitespace-nowrap"
          >
            <span className="text-cream/70">{item.icon}</span>
            {item.text}
          </span>
        ))}
      </Marquee>
    </div>
  );
}
