import { AnnouncementBar } from "../components/AnnouncementBar";
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
        <Customizer />
      </main>
      <Footer />
    </PageTransition>
  );
}
