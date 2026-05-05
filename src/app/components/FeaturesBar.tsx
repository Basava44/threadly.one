import { ShieldCheck, Gem, Truck } from "lucide-react";
import { features } from "@/app/data/products";

const featureIcons = [
  <ShieldCheck key="shield" size={18} strokeWidth={1.5} />,
  <Gem key="gem" size={18} strokeWidth={1.5} />,
  <Truck key="truck" size={18} strokeWidth={1.5} />,
];

export function FeaturesBar() {
  return (
    <section className="py-8 bg-foreground text-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 justify-items-center">
          {features.map((f, i) => (
            <div key={f.label} className="flex items-center gap-3">
              <span className="text-cream/60">{featureIcons[i]}</span>
              <div>
                <p className="text-[11px] tracking-[0.1em] uppercase font-medium">
                  {f.label}
                </p>
                <p className="text-[10px] text-cream/50">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
