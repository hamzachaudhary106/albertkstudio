import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ServicesPage from "./pages/ServicesPage";
import ServiceDetailPage from "./pages/ServiceDetailPage";
import GalleryPage from "./pages/GalleryPage";
import ReviewsPage from "./pages/ReviewsPage";
import ContactPage from "./pages/ContactPage";
import BookPage from "./pages/BookPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import NotFoundPage from "./pages/NotFoundPage";
import { routes } from "./data/content";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path={routes.home} element={<HomePage />} />
        <Route path={routes.about} element={<AboutPage />} />
        <Route path={routes.services} element={<ServicesPage />} />
        <Route path={`${routes.services}/:serviceId`} element={<ServiceDetailPage />} />
        <Route path={routes.gallery} element={<GalleryPage />} />
        <Route path={routes.reviews} element={<ReviewsPage />} />
        <Route path={routes.contact} element={<ContactPage />} />
        <Route path={routes.book} element={<BookPage />} />
        <Route path={routes.privacy} element={<PrivacyPage />} />
        <Route path={routes.terms} element={<TermsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
