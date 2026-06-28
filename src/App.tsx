import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { ContentProvider } from "./cms/ContentProvider";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import { routes } from "./data/content";

// Keep the home page in the main bundle (it's the LCP-critical entry point);
// lazy-load everything else so the booking/Stripe, admin, and secondary pages
// never weigh down the first paint of the home page.
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ServicesPage = lazy(() => import("./pages/ServicesPage"));
const ServiceDetailPage = lazy(() => import("./pages/ServiceDetailPage"));
const GalleryPage = lazy(() => import("./pages/GalleryPage"));
const ReviewsPage = lazy(() => import("./pages/ReviewsPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const BookPage = lazy(() => import("./pages/BookPage"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const AdminApp = lazy(() => import("./admin/AdminApp"));

export default function App() {
  return (
    <ContentProvider>
      <Suspense fallback={null}>
        <Routes>
          <Route path="/admin/*" element={<AdminApp />} />
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
      </Suspense>
    </ContentProvider>
  );
}
