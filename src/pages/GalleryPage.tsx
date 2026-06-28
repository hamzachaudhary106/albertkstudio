import Seo from "../components/Seo";
import PageHero from "../components/PageHero";
import Gallery from "../components/Gallery";
import CTABand from "../components/CTABand";
import { pageMeta } from "../data/content";

export default function GalleryPage() {
  return (
    <>
      <Seo title={pageMeta.gallery.title} description={pageMeta.gallery.description} />
      <PageHero
        eyebrow={pageMeta.gallery.eyebrow}
        title={pageMeta.gallery.title}
        description={pageMeta.gallery.description}
      />
      <Gallery variant="full" />
      <CTABand
        title="Love what you see?"
        description="Bring us your inspiration. We'll create a look that's unmistakably yours."
      />
    </>
  );
}
