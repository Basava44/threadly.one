"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";

interface NumberTickerProps {
  value: number;
  className?: string;
  delay?: number;
  prefix?: string;
  suffix?: string;
}

export function NumberTicker({
  value,
  className = "",
  delay = 0,
  prefix = "",
  suffix = "",
}: NumberTickerProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const timeout = setTimeout(() => {
      const duration = 1500;
      const startTime = Date.now();

      const tick = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.floor(eased * value));
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
    }, delay * 1000);

    return () => clearTimeout(timeout);
  }, [isInView, value, delay]);

  return (
    <span ref={ref} className={className}>
      {prefix}{count.toLocaleString("en-IN")}{suffix}
    </span>
  );
}
