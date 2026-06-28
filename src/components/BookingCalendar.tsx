import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { bookingStylists, business, services } from "../data/content";
import {
  buildBookingMailto,
  canNavigateMonth,
  formatDisplayDate,
  formatMonthYear,
  getCalendarCells,
  getTimeSlots,
  hasAvailableSlots,
  isDateBookable,
  submitBookingRequest,
  type BookingSelection,
} from "../lib/booking";
import { getPreferredStylist } from "../lib/stylist";
import { getPreferredService } from "../lib/service";

type Step = "date" | "time" | "details" | "confirmed";

function formatTimeLabel(value: string) {
  const [h, m] = value.split(":").map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d.toLocaleString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}

function resolveStylist(id: string) {
  return bookingStylists.find((s) => s.id === id) ?? bookingStylists[0];
}

export default function BookingCalendar() {
  const now = useMemo(() => new Date(), []);
  const [viewDate, setViewDate] = useState(() => new Date(now.getFullYear(), now.getMonth(), 1));
  const [step, setStep] = useState<Step>("date");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState(services[0]?.id ?? "");
  const [selectedStylistId, setSelectedStylistId] = useState(bookingStylists[0]?.id ?? "albert");
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const preferred = getPreferredStylist();
    if (preferred && bookingStylists.some((s) => s.id === preferred)) {
      setSelectedStylistId(preferred);
    }
    const preferredService = getPreferredService();
    if (preferredService && services.some((s) => s.id === preferredService)) {
      setSelectedServiceId(preferredService);
    }
  }, []);

  const { cells, dayLabels } = getCalendarCells(viewDate);
  const timeSlots = selectedDate ? getTimeSlots(selectedDate, now) : [];
  const selectedService = services.find((s) => s.id === selectedServiceId);
  const selectedStylist = resolveStylist(selectedStylistId);

  const selection: BookingSelection | null =
    selectedDate && selectedTime && selectedService
      ? {
          date: selectedDate,
          time: formatTimeLabel(selectedTime),
          timeValue: selectedTime,
          serviceId: selectedService.id,
          serviceTitle: selectedService.title,
          stylistId: selectedStylist.id,
          stylistName: selectedStylist.name,
          name,
          phone,
          email,
        }
      : null;

  const handleDateSelect = (date: Date) => {
    if (!isDateBookable(date, now) || !hasAvailableSlots(date, now)) return;

    setSelectedDate(date);
    setSelectedTime("");
    setStep("time");
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, "").length < 10) {
      setError("Please enter a valid phone number.");
      return;
    }
    if (!selectedDate || !selectedTime || !selectedService) return;

    const booking: BookingSelection = {
      date: selectedDate,
      time: formatTimeLabel(selectedTime),
      timeValue: selectedTime,
      serviceId: selectedService.id,
      serviceTitle: selectedService.title,
      stylistId: selectedStylist.id,
      stylistName: selectedStylist.name,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
    };

    setSubmitting(true);
    try {
      await submitBookingRequest(booking, business.email);
      setStep("confirmed");
    } catch {
      setError("Something went wrong. Please call us to book.");
    } finally {
      setSubmitting(false);
    }
  };

  const resetBooking = () => {
    setStep("date");
    setSelectedDate(null);
    setSelectedTime("");
    setSelectedStylistId(bookingStylists[0]?.id ?? "albert");
    setName("");
    setPhone("");
    setEmail("");
    setError("");
  };

  if (step === "confirmed" && selection) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="premium-card mobile-card lg:rounded-none lg:shadow-none card-pad"
      >
        <div className="w-14 h-14 border border-curly-accent/40 flex items-center justify-center mb-8 mx-auto">
          <Check size={24} className="text-curly-accent-dark" strokeWidth={1.5} />
        </div>
        <h3 className="font-serif text-3xl text-center mb-3">Request Submitted</h3>
        <p className="prose-body-sm text-center mb-4 max-w-sm mx-auto">
          Your preferred date and time have been sent. This is not a confirmed appointment yet.
        </p>
        <p className="text-sm text-curly-accent-dark text-center font-medium mb-10 max-w-sm mx-auto">
          {business.bookingConfirmNote}
        </p>

        <div className="bg-premium-ivory border border-curly-border/80 p-6 mb-8 space-y-4">
          <div className="flex justify-between gap-4 text-sm">
            <span className="text-curly-muted">Date</span>
            <span className="text-curly-body text-right">{formatDisplayDate(selection.date)}</span>
          </div>
          <div className="flex justify-between gap-4 text-sm">
            <span className="text-curly-muted">Time</span>
            <span className="text-curly-body">{selection.time}</span>
          </div>
          <div className="flex justify-between gap-4 text-sm">
            <span className="text-curly-muted">Service</span>
            <span className="text-curly-body text-right">{selection.serviceTitle}</span>
          </div>
          <div className="flex justify-between gap-4 text-sm">
            <span className="text-curly-muted">Stylist</span>
            <span className="text-curly-body text-right">{selection.stylistName}</span>
          </div>
          <div className="flex justify-between gap-4 text-sm">
            <span className="text-curly-muted">Name</span>
            <span className="text-curly-body">{selection.name}</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <a
            href={buildBookingMailto(selection, business.email)}
            className="curly-btn-gold w-full text-center"
          >
            Email Request Copy
          </a>
          <a href={business.phoneHref} className="curly-link justify-center w-full mt-2">
            Or Call {business.phone}
          </a>
          <button
            type="button"
            onClick={resetBooking}
            className="text-[11px] tracking-[0.22em] uppercase text-curly-muted hover:text-curly-accent-dark transition-colors mt-4"
          >
            Submit Another Request
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="premium-card mobile-card lg:rounded-none lg:shadow-none card-pad">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="curly-label-gold mb-2">Request Appointment</p>
          <h3 className="font-serif text-2xl">
            {step === "date" && "Preferred Date"}
            {step === "time" && "Preferred Time"}
            {step === "details" && "Your Details"}
          </h3>
        </div>
        {step !== "date" && (
          <button
            type="button"
            onClick={() => setStep(step === "details" ? "time" : "date")}
            className="text-[11px] tracking-[0.2em] uppercase text-curly-muted hover:text-curly-accent-dark transition-colors"
          >
            Back
          </button>
        )}
      </div>

      <div className="flex gap-2 mb-6">
        {(["date", "time", "details"] as const).map((s, i) => (
          <div
            key={s}
            className={`h-1 flex-1 transition-colors duration-500 ${
              (step === "date" && i === 0) ||
              (step === "time" && i <= 1) ||
              (step === "details" && i <= 2)
                ? "bg-curly-accent"
                : "bg-curly-border"
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === "date" && (
          <motion.div
            key="date"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-6">
              <button
                type="button"
                onClick={() =>
                  setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))
                }
                disabled={!canNavigateMonth(viewDate, -1, now)}
                className="h-10 w-10 inline-flex items-center justify-center border border-curly-border hover:border-curly-accent/40 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                aria-label="Previous month"
              >
                <ChevronLeft size={18} strokeWidth={1.5} />
              </button>
              <p className="font-serif text-xl">{formatMonthYear(viewDate)}</p>
              <button
                type="button"
                onClick={() =>
                  setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))
                }
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
                const hasSlots = bookable && hasAvailableSlots(date, now);
                const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
                const isToday = date.toDateString() === now.toDateString();

                return (
                  <button
                    key={date.toISOString()}
                    type="button"
                    disabled={!hasSlots}
                    onClick={() => handleDateSelect(date)}
                    className={`h-11 sm:h-10 flex items-center justify-center text-sm transition-colors rounded-lg sm:rounded-none ${
                      isSelected
                        ? "bg-premium-dark text-curly-accent-light font-medium"
                        : hasSlots
                          ? "text-curly-body hover:bg-premium-champagne hover:text-curly-accent-dark cursor-pointer"
                          : "text-curly-border cursor-not-allowed"
                    } ${isToday && !isSelected ? "ring-1 ring-curly-accent/50" : ""}`}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>

            <p className="text-[11px] text-curly-muted mt-6 leading-relaxed">
              Open daily, 10AM to 6PM. Past dates are unavailable.{" "}
              {business.bookingConfirmNote}
            </p>
          </motion.div>
        )}

        {step === "time" && selectedDate && (
          <motion.div
            key="time"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.3 }}
          >
            <p className="prose-body-sm mb-6 pb-6 border-b border-curly-border/80">
              {formatDisplayDate(selectedDate)}
            </p>

            <p className="curly-label mb-4">Select Service</p>
            <div className="card-grid-equal grid grid-cols-1 sm:grid-cols-2 gap-2 mb-8">
              {services.map((service) => (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => setSelectedServiceId(service.id)}
                  className={`card-equal text-left p-4 border transition-all duration-300 ${
                    selectedServiceId === service.id
                      ? "border-curly-accent bg-premium-champagne"
                      : "border-curly-border hover:border-curly-accent/40"
                  }`}
                >
                  <p className="font-serif text-lg mb-1 shrink-0">{service.title}</p>
                  <p className="text-[11px] text-curly-muted leading-relaxed card-equal-label flex-1 mb-2">
                    {service.tagline}
                  </p>
                  <p className="text-[10px] tracking-[0.16em] uppercase text-curly-accent-dark mt-auto shrink-0">
                    {service.duration} · {service.priceNote}
                  </p>
                </button>
              ))}
            </div>

            <p className="curly-label mb-2">Preferred Time</p>
            <p className="text-[11px] text-curly-muted mb-4 leading-relaxed">
              Subject to confirmation — we'll reach out to finalize your appointment.
            </p>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-6">
              {timeSlots.map((slot) => (
                <button
                  key={slot.value}
                  type="button"
                  disabled={!slot.available}
                  onClick={() => {
                    setSelectedTime(slot.value);
                    setStep("details");
                  }}
                  className={`h-12 sm:h-11 text-sm border transition-colors rounded-xl sm:rounded-none active:scale-[0.98] ${
                    selectedTime === slot.value
                      ? "bg-premium-dark text-curly-accent-light border-premium-dark"
                      : slot.available
                        ? "border-curly-border text-curly-body hover:border-curly-accent hover:bg-premium-champagne"
                        : "border-curly-border/50 text-curly-border line-through cursor-not-allowed"
                  }`}
                >
                  {slot.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === "details" && selectedDate && selectedTime && (
          <motion.form
            key="details"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleConfirm}
          >
            <div className="bg-premium-ivory border border-curly-border/80 p-5 mb-8 space-y-3">
              <div className="flex justify-between gap-4 text-sm">
                <span className="text-curly-muted">Date</span>
                <span className="text-curly-body text-right">
                  {selectedDate.toLocaleString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                </span>
              </div>
              <div className="flex justify-between gap-4 text-sm">
                <span className="text-curly-muted">Time</span>
                <span className="text-curly-body">{formatTimeLabel(selectedTime)}</span>
              </div>
              <div className="flex justify-between gap-4 text-sm">
                <span className="text-curly-muted">Service</span>
                <span className="text-curly-body text-right">{selectedService?.title}</span>
              </div>
            </div>

            <div className="space-y-4 mb-6 sm:mb-8">
              <div>
                <label htmlFor="booking-name" className="curly-label block mb-2">
                  Full Name *
                </label>
                <input
                  id="booking-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full border border-curly-border bg-white px-4 py-3 text-curly-body text-sm focus:outline-none focus:border-curly-accent transition-colors"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="booking-phone" className="curly-label block mb-2">
                  Phone *
                </label>
                <input
                  id="booking-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full border border-curly-border bg-white px-4 py-3 text-curly-body text-sm focus:outline-none focus:border-curly-accent transition-colors"
                  placeholder="(917) 555-0123"
                />
              </div>
              <div>
                <label htmlFor="booking-email" className="curly-label block mb-2">
                  Email (optional)
                </label>
                <input
                  id="booking-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-curly-border bg-white px-4 py-3 text-curly-body text-sm focus:outline-none focus:border-curly-accent transition-colors"
                  placeholder="you@email.com"
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-700 mb-4" role="alert">
                {error}
              </p>
            )}

            <button type="submit" disabled={submitting} className="curly-btn-gold w-full">
              {submitting ? "Submitting…" : "Submit Request"}
            </button>
            <p className="text-[11px] text-curly-muted text-center mt-4 leading-relaxed">
              {business.bookingConfirmNote} Need help now? Call {business.phone}.
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
