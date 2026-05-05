import { Truck } from "lucide-react";

export function AnnouncementBar() {
  return (
    <div className="bg-foreground text-white text-[11px] tracking-[0.2em] uppercase py-2.5 text-center">
      <span className="inline-flex items-center gap-2">
        <Truck size={14} strokeWidth={1.5} />
        Free shipping on orders above ₹999
      </span>
    </div>
  );
}
