"use client";

import { type ReactNode } from "react";

interface ShimmerButtonProps {
  children: ReactNode;
  className?: string;
  shimmerColor?: string;
  onClick?: () => void;
}

export function ShimmerButton({
  children,
  className = "",
  shimmerColor = "rgba(255,255,255,0.1)",
  onClick,
}: ShimmerButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`group relative overflow-hidden rounded-sm bg-foreground text-cream transition-all hover:scale-[1.02] active:scale-[0.98] ${className}`}
    >
      <div
        className="absolute inset-0 animate-shimmer"
        style={{
          background: `linear-gradient(110deg, transparent 33%, ${shimmerColor} 50%, transparent 67%)`,
          backgroundSize: "200% 100%",
        }}
      />
      <span className="relative z-10">{children}</span>
    </button>
  );
}
