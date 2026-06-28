import Seo from "../components/Seo";
import PageHero from "../components/PageHero";
import WorkingHours from "../components/WorkingHours";
import FAQ from "../components/FAQ";
import { pageMeta } from "../data/content";

export default function BookPage() {
  return (
    <>
      <Seo title={pageMeta.book.title} description={pageMeta.book.description} />
      <PageHero
        eyebrow={pageMeta.book.eyebrow}
        title={pageMeta.book.title}
        description={pageMeta.book.description}
      />
      <WorkingHours />
      <FAQ />
    </>
  );
}
