"use client";

import { type ReactNode } from "react";

interface AnimatedGradientTextProps {
  children: ReactNode;
  className?: string;
}

export function AnimatedGradientText({ children, className = "" }: AnimatedGradientTextProps) {
  return (
    <span
      className={`inline-block bg-gradient-to-r from-foreground/80 via-foreground to-foreground/80 bg-clip-text text-transparent bg-[length:200%_auto] animate-shimmer ${className}`}
    >
      {children}
    </span>
  );
}
