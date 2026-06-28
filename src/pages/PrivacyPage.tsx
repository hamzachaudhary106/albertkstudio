import LegalPage from "../components/LegalPage";
import { pageMeta, privacyPolicy } from "../data/content";

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow={pageMeta.privacy.eyebrow}
      title={pageMeta.privacy.title}
      description={pageMeta.privacy.description}
      sections={privacyPolicy}
    />
  );
}
