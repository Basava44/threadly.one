import { Metadata } from "next";
import { Suspense } from "react";
import { AnnouncementBar } from "../components/AnnouncementBar";

export const metadata: Metadata = {
  title: "Customize Your Embroidered Accessory",
  description:
    "Design your own custom embroidered cap, tee, or tote with our interactive 3D customizer. Choose colors, fonts, and placement.",
  alternates: { canonical: "https://threadly.one/customize" },
};
import { Header } from "../components/Header";
import { Customizer } from "../components/Customizer";
import { Footer } from "../components/Footer";
import { PageTransition } from "../components/PageTransition";

export default function CustomizePage() {
  return (
    <PageTransition>
      <AnnouncementBar />
      <Header />
      <main>
        <Suspense>
          <Customizer />
        </Suspense>
      </main>
      <Footer />
    </PageTransition>
  );
}
