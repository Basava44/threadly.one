"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

const StudioLayout = dynamic(() => import("./components/StudioLayout"), { ssr: false });

function StudioLoadingSkeleton() {
  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
        <p className="text-sm text-foreground/60 uppercase tracking-wider">Loading Studio</p>
      </div>
    </div>
  );
}

export default function StudioPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream">
        <Suspense fallback={<StudioLoadingSkeleton />}>
          <StudioLayout />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
