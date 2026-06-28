import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { routes } from "../data/content";
import { useContent } from "../cms/ContentProvider";
import ScrollReveal, { StaggerItem, StaggerReveal } from "./ScrollReveal";
import SectionHeading from "./SectionHeading";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function FAQ() {
  const { faqs, business } = useContent();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="premium-section section-divide bg-premium-ivory relative overflow-hidden">
      <div
        className="glow-blob -left-24 top-1/4 h-72 w-72 opacity-50"
        style={{ background: "radial-gradient(circle, rgba(184,149,110,0.12), transparent 70%)" }}
        aria-hidden
      />
      <div className="page-wrap relative">
        <div className="content-narrow">
          <SectionHeading
            label="FAQ"
            title="Before Your Visit"
            description="Appointments, location, services, and what to expect at our Aventura salon."
          />

          <StaggerReveal stagger={0.07} className="space-y-3">
            {faqs.map((faq, i) => {
              const isOpen = open === i;
              return (
                <StaggerItem key={faq.question} variant={i % 2 === 0 ? "left" : "right"}>
                  <div
                    className={`group relative overflow-hidden rounded-xl border bg-white transition-all duration-300 ${
                      isOpen
                        ? "border-curly-accent/50 shadow-[0_18px_44px_-28px_rgba(20,14,6,0.4)]"
                        : "border-curly-border hover:border-curly-accent/35"
                    }`}
                  >
                    <span
                      className={`absolute left-0 top-0 bottom-0 w-[3px] bg-curly-accent transition-transform duration-300 origin-top ${
                        isOpen ? "scale-y-100" : "scale-y-0"
                      }`}
                      aria-hidden
                    />
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left min-h-[3.75rem] sm:min-h-[4.25rem]"
                      aria-expanded={isOpen}
                    >
                      <span className="flex items-baseline gap-3.5 sm:gap-4 min-w-0">
                        <span
                          className={`shrink-0 font-serif text-sm transition-colors ${
                            isOpen ? "text-curly-accent-dark" : "text-curly-accent/50"
                          }`}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="font-serif text-lg leading-snug pr-2">{faq.question}</span>
                      </span>
                      <span
                        className={`shrink-0 inline-flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-300 ${
                          isOpen
                            ? "rotate-45 border-curly-accent bg-curly-accent text-white"
                            : "border-curly-border text-curly-accent group-hover:border-curly-accent/50"
                        }`}
                      >
                        <Plus size={16} strokeWidth={1.5} />
                      </span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.32, ease: EASE }}
                          className="overflow-hidden"
                        >
                          <p className="px-6 pb-6 pl-[3.6rem] sm:pl-[3.9rem] prose-body-sm">
                            {faq.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerReveal>

          <ScrollReveal variant="fade" delay={0.1}>
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 rounded-2xl border border-curly-border bg-white px-6 py-5 text-center sm:text-left">
              <p className="prose-body-sm">
                Still have questions? We're happy to help.
              </p>
              <div className="flex items-center gap-4">
                <a href={business.phoneHref} className="curly-link !min-h-0 pb-1">
                  Call {business.phone}
                </a>
                <span className="h-4 w-px bg-curly-border" aria-hidden />
                <Link to={routes.contact} className="curly-link !min-h-0 pb-1">
                  Contact
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
