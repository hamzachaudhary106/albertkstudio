import SiteHeader from "./components/SiteHeader";
import MobileBottomNav from "./components/MobileBottomNav";
import LocalSeo from "./components/LocalSeo";
import Hero from "./components/Hero";
import OurStory from "./components/OurStory";
import Services from "./components/Services";
import Gallery from "./components/Gallery";
import Team from "./components/Team";
import WorkingHours from "./components/WorkingHours";
import Reviews from "./components/Reviews";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import { MobileNavProvider } from "./context/MobileNavContext";

export default function App() {
  return (
    <MobileNavProvider>
      <LocalSeo />
      <SiteHeader />
      <main>
        <Hero />
        <OurStory />
        <Services />
        <Gallery />
        <Team />
        <WorkingHours />
        <Reviews />
        <FAQ />
      </main>
      <Footer />
      <MobileBottomNav />
    </MobileNavProvider>
  );
}
