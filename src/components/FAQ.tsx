import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { faqs } from "../data/content";
import { StaggerItem, StaggerReveal } from "./ScrollReveal";
import SectionHeading from "./SectionHeading";

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="premium-section section-divide bg-premium-ivory">
      <div className="page-wrap">
        <div className="content-narrow">
          <SectionHeading
            label="FAQ"
            title="Before Your Visit"
            description="Appointments, location, services, and what to expect at our Aventura salon."
          />

          <StaggerReveal stagger={0.08} className="mobile-card lg:rounded-none lg:shadow-none">
            {faqs.map((faq, i) => (
              <StaggerItem key={faq.question} variant={i % 2 === 0 ? "left" : "right"}>
                <div className="border-b border-curly-border last:border-b-0">
                    <button
                      type="button"
                      onClick={() => setOpen(open === i ? null : i)}
                      className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left min-h-[3.75rem] sm:min-h-[4.5rem] active:bg-premium-champagne/40"
                      aria-expanded={open === i}
                    >
                      <h3 className="font-serif text-lg pr-4">{faq.question}</h3>
                      <span className="shrink-0 h-8 w-8 inline-flex items-center justify-center text-curly-accent">
                        {open === i ? <Minus size={16} strokeWidth={1.5} /> : <Plus size={16} strokeWidth={1.5} />}
                      </span>
                    </button>
                    <AnimatePresence initial={false}>
                      {open === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <p className="px-6 pb-6 prose-body-sm">{faq.answer}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
              </StaggerItem>
            ))}
          </StaggerReveal>
        </div>
      </div>
    </section>
  );
}
