import Seo from "../components/Seo";
import Hero from "../components/Hero";
import OurStory from "../components/OurStory";
import Services from "../components/Services";
import Gallery from "../components/Gallery";
import Team from "../components/Team";
import Reviews from "../components/Reviews";
import FAQ from "../components/FAQ";
import CTABand from "../components/CTABand";
import { meta } from "../data/seo";

export default function HomePage() {
  return (
    <>
      <Seo title={meta.title} description={meta.description} brandSuffix={false} />
      <Hero />
      <OurStory />
      <Services showAllCta />
      <Gallery variant="teaser" />
      <Team />
      <Reviews />
      <FAQ />
      <CTABand />
    </>
  );
}
