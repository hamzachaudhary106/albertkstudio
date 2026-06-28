import { Outlet, useLocation } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { MobileNavProvider } from "../context/MobileNavContext";
import { useSmoothScroll } from "../hooks/useLenis";
import LocalSeo from "./LocalSeo";
import SiteHeader from "./SiteHeader";
import MobileBottomNav from "./MobileBottomNav";
import ScrollToTop from "./ScrollToTop";
import Footer from "./Footer";
import IntroLoader from "./IntroLoader";
import CustomCursor from "./CustomCursor";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Layout() {
  const { pathname } = useLocation();
  const reduced = useReducedMotion();
  useSmoothScroll();

  return (
    <MobileNavProvider>
      <IntroLoader />
      <CustomCursor />
      <LocalSeo />
      <ScrollToTop />
      <SiteHeader />
      <main>
        <motion.div
          key={pathname}
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduced ? 0.25 : 0.5, ease: EASE }}
        >
          <Outlet />
        </motion.div>
      </main>
      <Footer />
      <MobileBottomNav />
    </MobileNavProvider>
  );
}
