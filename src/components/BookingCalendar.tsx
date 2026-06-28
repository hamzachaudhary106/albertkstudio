import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Elements } from "@stripe/react-stripe-js";
import type { Appearance } from "@stripe/stripe-js";
import { ChevronLeft, ChevronRight, Check, Clock, Phone } from "lucide-react";
import { useContent } from "../cms/ContentProvider";
import {
  canNavigateMonth,
  formatDisplayDate,
  formatMonthYear,
  getCalendarCells,
  isDateBookable,
} from "../lib/booking";
import {
  createBooking,
  fetchAvailability,
  fetchServices,
  getStripe,
  isStripeReady,
  type BookableService,
} from "../lib/bookingApi";
import { isBookingConfigured } from "../lib/supabase";
import { getPreferredService } from "../lib/service";
import PaymentStep from "./booking/PaymentStep";

type Step = "service" | "date" | "time" | "details" | "payment" | "confirmed";

const STEP_ORDER: Step[] = ["service", "date", "time", "details", "payment"];

function formatSlot(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "America/New_York",
  });
}

function depositLabel(cents: number): string {
  return `$${Math.round(cents / 100)}`;
}

const stripeAppearance: Appearance = {
  theme: "flat",
  variables: {
    colorPrimary: "#b8956e",
    colorText: "#3a3a3a",
    colorDanger: "#b91c1c",
    fontFamily: "Lato, system-ui, sans-serif",
    borderRadius: "8px",
    spacingUnit: "4px",
  },
};

function FallbackCard() {
  const { business } = useContent();
  return (
    <div className="premium-card mobile-card lg:rounded-none lg:shadow-none card-pad text-center">
      <p className="curly-label-gold mb-3">Book an Appointment</p>
      <h3 className="font-serif text-2xl mb-3">Reserve Your Visit</h3>
      <p className="prose-body-sm max-w-sm mx-auto mb-6">
        Online booking is just a tap away. Call or text the studio and we'll get you scheduled
        right away.
      </p>
      <a href={business.phoneHref} className="curly-btn-gold w-full sm:w-auto gap-2.5">
        <Phone size={15} strokeWidth={1.5} />
        {business.phone}
      </a>
    </div>
  );
}

export default function BookingCalendar() {
  if (!isBookingConfigured) return <FallbackCard />;
  return <LiveBooking />;
}

function LiveBooking() {
  const { business } = useContent();
  const stripeReady = isStripeReady();
  const now = useMemo(() => new Date(), []);
  const [services, setServices] = useState<BookableService[]>([]);
  const [step, setStep] = useState<Step>("service");

  const [viewDate, setViewDate] = useState(() => new Date(now.getFullYear(), now.getMonth(), 1));
  const [selectedServiceSlug, setSelectedServiceSlug] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [slots, setSlots] = useState<Date[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Date | null>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [clientSecret, setClientSecret] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const selectedService = services.find((s) => s.slug === selectedServiceSlug);

  // Load services and any preselected service (from a service detail page).
  useEffect(() => {
    let active = true;
    fetchServices()
      .then((rows) => {
        if (!active) return;
        setServices(rows);
        const preferred = getPreferredService();
        if (preferred && rows.some((r) => r.slug === preferred)) {
          setSelectedServiceSlug(preferred);
          setStep("date");
        }
      })
      .catch(() => setError("Couldn't load services. Please refresh or call us."));
    return () => {
      active = false;
    };
  }, []);

  // If Stripe redirected back after an off-session payment method, show success.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("redirect_status") === "succeeded") {
      setStep("confirmed");
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  const loadSlots = async (date: Date) => {
    setLoadingSlots(true);
    setError("");
    try {
      const open = await fetchAvailability(date, selectedServiceSlug);
      setSlots(open);
    } catch {
      setError("Couldn't load times. Please try another day or call us.");
      setSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleSelectService = (slug: string) => {
    setSelectedServiceSlug(slug);
    setStep("date");
  };

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    setStep("time");
    loadSlots(date);
  };

  const handleSubmitDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) return setError("Please enter your name.");
    if (!phone.trim() || phone.replace(/\D/g, "").length < 10) {
      return setError("Please enter a valid phone number.");
    }
    if (!selectedService || !selectedSlot) return;

    setSubmitting(true);
    try {
      const result = await createBooking({
        serviceSlug: selectedService.slug,
        startsAt: selectedSlot.toISOString(),
        customer: { name: name.trim(), phone: phone.trim(), email: email.trim() },
      });
      if (result.clientSecret) {
        setClientSecret(result.clientSecret);
        setStep("payment");
      } else {
        // No-deposit mode: the booking is already confirmed.
        setStep("confirmed");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start booking.");
    } finally {
      setSubmitting(false);
    }
  };

  const resetBooking = () => {
    setStep("service");
    setSelectedServiceSlug("");
    setSelectedDate(null);
    setSelectedSlot(null);
    setSlots([]);
    setClientSecret("");
    setName("");
    setPhone("");
    setEmail("");
    setError("");
  };

  const goBack = () => {
    if (step === "date") setStep("service");
    else if (step === "time") setStep("date");
    else if (step === "details") setStep("time");
  };

  const { cells, dayLabels } = getCalendarCells(viewDate);

  if (step === "confirmed") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="premium-card mobile-card lg:rounded-none lg:shadow-none card-pad"
      >
        <div className="w-14 h-14 border border-curly-accent/40 flex items-center justify-center mb-8 mx-auto">
          <Check size={24} className="text-curly-accent-dark" strokeWidth={1.5} />
        </div>
        <h3 className="font-serif text-3xl text-center mb-3">Appointment Confirmed</h3>
        <p className="prose-body-sm text-center mb-8 max-w-sm mx-auto">
          {stripeReady
            ? "Your deposit is paid and your spot is reserved. A confirmation email is on its way. We can't wait to see you!"
            : "Your spot is reserved and a confirmation is on its way. We can't wait to see you!"}
        </p>

        {selectedService && selectedSlot && (
          <div className="bg-premium-ivory border border-curly-border/80 p-6 mb-8 space-y-4">
            <Row label="Service" value={selectedService.title} />
            <Row label="When" value={`${formatDisplayDate(selectedSlot)} · ${formatSlot(selectedSlot)}`} />
            <Row label="Name" value={name} />
            {stripeReady && <Row label="Deposit paid" value={depositLabel(selectedService.deposit_cents)} />}
          </div>
        )}

        <a href={business.phoneHref} className="curly-link justify-center w-full">
          Questions? Call {business.phone}
        </a>
        <button
          type="button"
          onClick={resetBooking}
          className="block mx-auto text-[11px] tracking-[0.22em] uppercase text-curly-muted hover:text-curly-accent-dark transition-colors mt-6"
        >
          Book Another Appointment
        </button>
      </motion.div>
    );
  }

  return (
    <div className="premium-card mobile-card lg:rounded-none lg:shadow-none card-pad">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="curly-label-gold mb-2">Book Appointment</p>
          <h3 className="font-serif text-2xl">
            {step === "service" && "Choose a Service"}
            {step === "date" && "Pick a Date"}
            {step === "time" && "Pick a Time"}
            {step === "details" && "Your Details"}
            {step === "payment" && "Secure Your Spot"}
          </h3>
        </div>
        {step !== "service" && step !== "payment" && (
          <button
            type="button"
            onClick={goBack}
            className="text-[11px] tracking-[0.2em] uppercase text-curly-muted hover:text-curly-accent-dark transition-colors"
          >
            Back
          </button>
        )}
      </div>

      <div className="flex gap-2 mb-6">
        {STEP_ORDER.map((s, i) => {
          const currentIndex = STEP_ORDER.indexOf(step);
          return (
            <div
              key={s}
              className={`h-1 flex-1 transition-colors duration-500 ${
                i <= currentIndex ? "bg-curly-accent" : "bg-curly-border"
              }`}
            />
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {step === "service" && (
          <motion.div key="service" {...stepMotion}>
            {services.length === 0 && !error && (
              <p className="prose-body-sm text-curly-muted">Loading services…</p>
            )}
            <div className="space-y-2">
              {services.map((service) => (
                <button
                  key={service.slug}
                  type="button"
                  onClick={() => handleSelectService(service.slug)}
                  className="w-full text-left p-4 border border-curly-border hover:border-curly-accent hover:bg-premium-champagne transition-all duration-300 flex items-center justify-between gap-3"
                >
                  <span>
                    <span className="block font-serif text-lg leading-tight">{service.title}</span>
                    <span className="block text-[11px] tracking-[0.16em] uppercase text-curly-muted mt-1">
                      <Clock size={11} strokeWidth={1.5} className="inline -mt-0.5 mr-1" />
                      {Math.round(service.duration_min / 60 * 10) / 10} hrs
                      {service.price_label ? ` · ${service.price_label}` : ""}
                    </span>
                  </span>
                  {stripeReady && (
                    <span className="shrink-0 text-[10px] tracking-[0.16em] uppercase text-curly-accent-dark font-semibold">
                      {depositLabel(service.deposit_cents)} deposit
                    </span>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === "date" && (
          <motion.div key="date" {...stepMotion}>
            <div className="flex items-center justify-between mb-6">
              <button
                type="button"
                onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))}
                disabled={!canNavigateMonth(viewDate, -1, now)}
                className="h-10 w-10 inline-flex items-center justify-center border border-curly-border hover:border-curly-accent/40 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                aria-label="Previous month"
              >
                <ChevronLeft size={18} strokeWidth={1.5} />
              </button>
              <p className="font-serif text-xl">{formatMonthYear(viewDate)}</p>
              <button
                type="button"
                onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))}
                disabled={!canNavigateMonth(viewDate, 1, now)}
                className="h-10 w-10 inline-flex items-center justify-center border border-curly-border hover:border-curly-accent/40 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                aria-label="Next month"
              >
                <ChevronRight size={18} strokeWidth={1.5} />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-[10px] tracking-[0.18em] uppercase text-curly-muted mb-3">
              {dayLabels.map((d) => (
                <span key={d} className="py-2">
                  {d}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {cells.map((date, i) => {
                if (!date) return <span key={`empty-${i}`} />;
                const bookable = isDateBookable(date, now);
                const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
                const isToday = date.toDateString() === now.toDateString();
                return (
                  <button
                    key={date.toISOString()}
                    type="button"
                    disabled={!bookable}
                    onClick={() => handleSelectDate(date)}
                    className={`h-11 sm:h-10 flex items-center justify-center text-sm transition-colors rounded-lg sm:rounded-none ${
                      isSelected
                        ? "bg-premium-dark text-curly-accent-light font-medium"
                        : bookable
                          ? "text-curly-body hover:bg-premium-champagne hover:text-curly-accent-dark cursor-pointer"
                          : "text-curly-border cursor-not-allowed"
                    } ${isToday && !isSelected ? "ring-1 ring-curly-accent/50" : ""}`}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>

            {selectedService && (
              <p className="text-[11px] text-curly-muted mt-6 leading-relaxed">
                Booking <span className="text-curly-accent-dark font-medium">{selectedService.title}</span> ·
                about {Math.round(selectedService.duration_min / 60 * 10) / 10} hrs. Open daily, 10AM to 6PM.
              </p>
            )}
          </motion.div>
        )}

        {step === "time" && selectedDate && (
          <motion.div key="time" {...stepMotion}>
            <p className="prose-body-sm mb-6 pb-6 border-b border-curly-border/80">
              {formatDisplayDate(selectedDate)}
            </p>

            {loadingSlots ? (
              <p className="prose-body-sm text-curly-muted py-8 text-center">Loading available times…</p>
            ) : slots.length === 0 ? (
              <div className="py-6 text-center">
                <p className="prose-body-sm text-curly-muted mb-4">
                  No times available on this day. Please choose another date.
                </p>
                <button type="button" onClick={() => setStep("date")} className="curly-link justify-center w-full">
                  Choose Another Date
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {slots.map((slot) => {
                  const value = slot.toISOString();
                  const active = selectedSlot?.toISOString() === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => {
                        setSelectedSlot(slot);
                        setStep("details");
                      }}
                      className={`h-12 sm:h-11 text-sm border transition-colors rounded-xl sm:rounded-none active:scale-[0.98] ${
                        active
                          ? "bg-premium-dark text-curly-accent-light border-premium-dark"
                          : "border-curly-border text-curly-body hover:border-curly-accent hover:bg-premium-champagne"
                      }`}
                    >
                      {formatSlot(slot)}
                    </button>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {step === "details" && selectedService && selectedSlot && (
          <motion.form key="details" {...stepMotion} onSubmit={handleSubmitDetails}>
            <div className="bg-premium-ivory border border-curly-border/80 p-5 mb-6 space-y-3">
              <Row label="Service" value={selectedService.title} />
              <Row label="When" value={`${formatDisplayDate(selectedSlot)} · ${formatSlot(selectedSlot)}`} />
              {stripeReady && (
                <Row label="Deposit" value={`${depositLabel(selectedService.deposit_cents)} (applied to final bill)`} />
              )}
            </div>

            <div className="space-y-4 mb-6">
              <Field id="bk-name" label="Full Name *" value={name} onChange={setName} placeholder="Your name" />
              <Field id="bk-phone" label="Phone *" type="tel" value={phone} onChange={setPhone} placeholder="(917) 555-0123" />
              <Field id="bk-email" label="Email (for confirmation)" type="email" value={email} onChange={setEmail} placeholder="you@email.com" />
            </div>

            {error && (
              <p className="text-sm text-red-700 mb-4" role="alert">
                {error}
              </p>
            )}

            <button type="submit" disabled={submitting} className="curly-btn-gold w-full">
              {submitting ? "Booking…" : stripeReady ? "Continue to Deposit" : "Confirm Booking"}
            </button>
            <p className="text-[11px] text-curly-muted text-center mt-4 leading-relaxed">
              {stripeReady
                ? business.depositNote
                : "You'll receive a confirmation right away. Need help? Call " + business.phone + "."}
            </p>
          </motion.form>
        )}

        {step === "payment" && clientSecret && selectedService && (
          <motion.div key="payment" {...stepMotion}>
            <Elements
              key={clientSecret}
              stripe={getStripe()}
              options={{ clientSecret, appearance: stripeAppearance }}
            >
              <PaymentStep
                depositLabel={depositLabel(selectedService.deposit_cents)}
                onSuccess={() => setStep("confirmed")}
                onBack={() => setStep("details")}
              />
            </Elements>
          </motion.div>
        )}
      </AnimatePresence>

      {error && step !== "details" && (
        <p className="text-sm text-red-700 mt-4" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

const stepMotion = {
  initial: { opacity: 0, x: 16 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -16 },
  transition: { duration: 0.3 },
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className="text-curly-muted shrink-0">{label}</span>
      <span className="text-curly-body text-right">{value}</span>
    </div>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="curly-label block mb-2">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="field-premium"
        required={label.includes("*")}
      />
    </div>
  );
}
