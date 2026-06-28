import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import { navLinks, pageMeta, routes } from "../data/content";

export default function NotFoundPage() {
  return (
    <>
      <Seo title={pageMeta.notFound.title} description={pageMeta.notFound.description} />
      <section className="relative bg-premium-dark text-white min-h-[100svh] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 25%, #d4bc8e 0, transparent 45%), radial-gradient(circle at 80% 70%, #b8956e 0, transparent 40%)",
          }}
          aria-hidden
        />
        <div className="absolute inset-0 grain-overlay opacity-[0.15]" aria-hidden />
        <div className="page-wrap relative text-center pt-[calc(var(--header-height)+var(--safe-top)+3rem)] pb-[calc(3rem+var(--bottom-nav-height))]">
          <p className="font-serif text-[clamp(5rem,22vw,11rem)] leading-none text-gold-gradient-light mb-2 float-soft">
            404
          </p>
          <p className="curly-label-gold mb-4 !text-curly-accent-light">{pageMeta.notFound.eyebrow}</p>
          <h1 className="curly-heading-lg text-white mb-5">{pageMeta.notFound.title}</h1>
          <div className="gold-rule-center mb-6" />
          <p className="text-on-dark text-[15px] leading-[1.75] max-w-md mx-auto mb-8">
            {pageMeta.notFound.description} Let's get you back to great hair.
          </p>

          <div className="mobile-btn-stack justify-center sm:inline-flex mb-12">
            <Link to={routes.home} className="curly-btn-gold btn-luxe">
              Back to Home
            </Link>
            <Link to={routes.book} className="curly-btn-outline-light">
              Request Appointment
            </Link>
          </div>

          <nav aria-label="Site pages">
            <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-[11px] tracking-[0.2em] uppercase text-white/60">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="hover:text-curly-accent-light transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>
    </>
  );
}
