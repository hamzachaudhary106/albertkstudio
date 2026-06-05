import { business, workingHours } from "../data/content";
import BookingCalendar from "./BookingCalendar";
import ScrollReveal from "./ScrollReveal";
import SectionHeading from "./SectionHeading";

export default function WorkingHours() {
  return (
    <section id="booking" className="premium-section section-divide bg-premium-pearl">
      <div className="page-wrap">
        <div className="grid-2">
          <ScrollReveal variant="left" duration={0.75}>
            <div>
              <SectionHeading
                label="Appointments"
                title="Book Your Visit"
                description={`Open daily, 10AM to 6PM. Select a date and time to submit a request. ${business.bookingConfirmNote}`}
                align="left"
                className="mb-4 sm:mb-6"
                animate={false}
              />
              <ul>
                {workingHours.map((item) => (
                  <li
                    key={item.day}
                    className="flex items-center justify-between border-b border-curly-border py-3 sm:py-4 text-sm gap-3"
                  >
                    <span className="font-serif text-base sm:text-lg">{item.day}</span>
                    <span className="text-curly-body">{item.hours}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 sm:mt-8 pt-5 sm:pt-8 border-t border-curly-border">
                <p className="curly-label mb-2">Prefer to call?</p>
                <a href={business.phoneHref} className="curly-link">
                  {business.phone}
                </a>
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal variant="right" delay={0.15} duration={0.75}>
            <BookingCalendar />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
