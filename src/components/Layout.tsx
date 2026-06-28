import { Outlet } from "react-router-dom";
import { MobileNavProvider } from "../context/MobileNavContext";
import LocalSeo from "./LocalSeo";
import SiteHeader from "./SiteHeader";
import MobileBottomNav from "./MobileBottomNav";
import ScrollToTop from "./ScrollToTop";
import Footer from "./Footer";

export default function Layout() {
  return (
    <MobileNavProvider>
      <LocalSeo />
      <ScrollToTop />
      <SiteHeader />
      <main>
        <Outlet />
      </main>
      <Footer />
      <MobileBottomNav />
    </MobileNavProvider>
  );
}
