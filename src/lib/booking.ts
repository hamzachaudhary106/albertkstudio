export const BOOKING_CONFIG = {
  openDays: [0, 1, 2, 3, 4, 5, 6],
  openHour: 10,
  closeHour: 18,
  slotMinutes: 30,
  maxMonthsAhead: 3,
  minLeadHours: 2,
} as const;

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export type TimeSlot = {
  value: string;
  label: string;
  available: boolean;
};

export type BookingSelection = {
  date: Date;
  time: string;
  timeValue: string;
  serviceId: string;
  serviceTitle: string;
  stylistId: string;
  stylistName: string;
  name: string;
  phone: string;
  email: string;
};

export type BookingSubmitResult = {
  ok: boolean;
  method: "formsubmit" | "mailto";
};

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isOpenDay(date: Date) {
  return (BOOKING_CONFIG.openDays as readonly number[]).includes(date.getDay());
}

export function isDateBookable(date: Date, now = new Date()) {
  const today = startOfDay(now);
  const target = startOfDay(date);

  if (target < today) return false;
  if (!isOpenDay(date)) return false;

  const maxDate = new Date(today);
  maxDate.setMonth(maxDate.getMonth() + BOOKING_CONFIG.maxMonthsAhead);
  if (target > maxDate) return false;

  return true;
}

export function formatMonthYear(date: Date) {
  return date.toLocaleString("en-US", { month: "long", year: "numeric" });
}

export function formatDisplayDate(date: Date) {
  return date.toLocaleString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function getCalendarCells(viewDate: Date) {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const offset = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

  const cells: (Date | null)[] = [
    ...Array(offset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
  ];

  return { cells, dayLabels: DAY_LABELS.slice(1).concat(DAY_LABELS[0]) };
}

export function canNavigateMonth(viewDate: Date, direction: -1 | 1, now = new Date()) {
  const next = new Date(viewDate.getFullYear(), viewDate.getMonth() + direction, 1);
  const today = new Date(now.getFullYear(), now.getMonth(), 1);
  const max = new Date(today.getFullYear(), today.getMonth() + BOOKING_CONFIG.maxMonthsAhead, 1);

  if (direction < 0) return next >= today;
  return next <= max;
}

export function getTimeSlots(date: Date, now = new Date()) {
  const slots: TimeSlot[] = [];
  const { openHour, closeHour, slotMinutes, minLeadHours } = BOOKING_CONFIG;

  for (let hour = openHour; hour < closeHour; hour++) {
    for (const minute of [0, 30]) {
      if (hour === closeHour - 1 && minute === 30) continue;

      const slotDate = new Date(date);
      slotDate.setHours(hour, minute, 0, 0);

      const endMinutes = hour * 60 + minute + slotMinutes;
      if (endMinutes > closeHour * 60) continue;

      const label = slotDate.toLocaleString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

      const value = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;

      let available = true;

      if (isSameDay(date, now)) {
        const lead = new Date(now.getTime() + minLeadHours * 60 * 60 * 1000);
        if (slotDate <= lead) available = false;
      }

      slots.push({ value, label, available });
    }
  }

  return slots;
}

export function hasAvailableSlots(date: Date, now = new Date()) {
  return getTimeSlots(date, now).some((slot) => slot.available);
}

function bookingDetails(selection: BookingSelection) {
  return [
    `Date: ${formatDisplayDate(selection.date)}`,
    `Time: ${selection.time}`,
    `Service: ${selection.serviceTitle}`,
    `Preferred Stylist: ${selection.stylistName}`,
    `Name: ${selection.name}`,
    `Phone: ${selection.phone}`,
    selection.email ? `Email: ${selection.email}` : "",
  ].filter(Boolean);
}

export function buildBookingMailto(selection: BookingSelection, salonEmail: string) {
  const subject = encodeURIComponent(`Appointment Request: ${selection.serviceTitle}`);
  const body = encodeURIComponent(
    ["Hello Albert K Studio,", "", "I would like to request an appointment:", "", ...bookingDetails(selection), "", "Please confirm availability. Thank you!"].join("\n")
  );

  return `mailto:${salonEmail}?subject=${subject}&body=${body}`;
}

export async function submitBookingRequest(
  selection: BookingSelection,
  salonEmail: string
): Promise<BookingSubmitResult> {
  const payload = {
    _subject: `New Booking Request: ${selection.serviceTitle}`,
    _template: "table",
    _captcha: "false",
    date: formatDisplayDate(selection.date),
    time: selection.time,
    service: selection.serviceTitle,
    stylist: selection.stylistName,
    name: selection.name,
    phone: selection.phone,
    email: selection.email || "Not provided",
    message: bookingDetails(selection).join("\n"),
  };

  try {
    const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(salonEmail)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      return { ok: true, method: "formsubmit" };
    }
  } catch {
    // Fall through to mailto
  }

  window.location.href = buildBookingMailto(selection, salonEmail);
  return { ok: true, method: "mailto" };
}

export function buildCalendarEvent(selection: BookingSelection) {
  const [hours, minutes] = selection.timeValue.split(":").map(Number);
  const start = new Date(selection.date);
  start.setHours(hours, minutes, 0, 0);

  const end = new Date(start);
  end.setMinutes(end.getMinutes() + 60);

  const formatICS = (d: Date) => {
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
  };

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Albert K Studio//Booking//EN",
    "BEGIN:VEVENT",
    `UID:aks-${start.getTime()}@albertkstudio.com`,
    `DTSTAMP:${formatICS(new Date())}`,
    `DTSTART:${formatICS(start)}`,
    `DTEND:${formatICS(end)}`,
    `SUMMARY:${selection.serviceTitle} with ${selection.stylistName}, Albert K Studio`,
    "LOCATION:19020 NE 29th Ave, Aventura, FL 33180",
    `DESCRIPTION:Unconfirmed appointment request with ${selection.stylistName}. Call (917) 657-8170 to confirm.`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function downloadCalendarEvent(selection: BookingSelection) {
  const ics = buildCalendarEvent(selection);
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "albert-k-studio-appointment.ics";
  link.click();
  URL.revokeObjectURL(url);
}
