import LegalPage from "../components/LegalPage";
import { pageMeta, termsOfService } from "../data/content";

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow={pageMeta.terms.eyebrow}
      title={pageMeta.terms.title}
      description={pageMeta.terms.description}
      sections={termsOfService}
    />
  );
}
