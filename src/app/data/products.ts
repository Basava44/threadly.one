export const categories = [
  { name: "Bucket Caps", price: 899, slug: "caps", cta: "SHOP CAPS" },
  { name: "Oversized Tees", price: 999, slug: "tees", cta: "SHOP TEES" },
  { name: "Tote Bags", price: 599, slug: "totes", cta: "SHOP TOTE BAGS" },
];

export const howItWorks = [
  { step: 1, title: "CHOOSE", desc: "Pick your favourite product & colour" },
  { step: 2, title: "CUSTOMISE", desc: "Add your initials or design" },
  { step: 3, title: "WE CRAFT", desc: "We embroider it just for you" },
  { step: 4, title: "WE DELIVER", desc: "Delivered to your doorstep" },
];

export const customizerColors = [
  { name: "Black", hex: "#1A1A1A" },
  { name: "Beige", hex: "#D4C5A9" },
  { name: "Olive", hex: "#4A5D3A" },
];

export const customizerProducts = ["cap", "tee", "tote"] as const;
export type CustomizerProduct = (typeof customizerProducts)[number];

export const productPrices: Record<CustomizerProduct, number> = {
  cap: 899,
  tee: 999,
  tote: 599,
};

export const heroBadges = [
  { label: "Custom Embroidery" },
  { label: "Premium Quality" },
  { label: "All Day Comfort" },
  { label: "Perfect Gift" },
];

export const features = [
  { label: "Secure Payments", desc: "100% safe & secure" },
  { label: "Premium Materials", desc: "For the little extras" },
  { label: "Fast Shipping", desc: "Quick dispatch" },
];
