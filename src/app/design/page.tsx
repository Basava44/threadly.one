"use client";

import dynamic from "next/dynamic";
import { Header } from "../components/Header";

const DesignCustomizer = dynamic(() => import("./DesignCustomizer"), { ssr: false });

export default function DesignPage() {
  return (
    <>
      <Header />
      <DesignCustomizer />
    </>
  );
}
