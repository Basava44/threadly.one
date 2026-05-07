"use client";

import { type ReactNode } from "react";

interface MarqueeProps {
  children: ReactNode;
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  duration?: string;
}

export function Marquee({
  children,
  className = "",
  reverse = false,
  pauseOnHover = false,
  duration = "30s",
}: MarqueeProps) {
  return (
    <div
      className={`group flex overflow-hidden [--duration:${duration}] ${className}`}
      style={{ "--duration": duration } as React.CSSProperties}
    >
      <div
        className={`flex shrink-0 items-center justify-around gap-4 animate-marquee ${
          reverse ? "[animation-direction:reverse]" : ""
        } ${pauseOnHover ? "group-hover:[animation-play-state:paused]" : ""}`}
      >
        {children}
        {children}
      </div>
    </div>
  );
}
