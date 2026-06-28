import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { supabase, supabaseUrl, supabaseAnonKey } from "./supabase";

export type BookableService = {
  slug: string;
  title: string;
  duration_min: number;
  deposit_cents: number;
  price_label: string | null;
};

export type CreateBookingInput = {
  serviceSlug: string;
  staffSlug?: string;
  startsAt: string; // ISO instant
  customer: { name: string; phone: string; email: string };
};

export type CreateBookingResult = {
  appointmentId: string;
  clientSecret?: string; // present only in deposit mode
  depositCents?: number;
  currency?: string;
  confirmed?: boolean; // true when booked without a deposit
};

/** Whether a real Stripe publishable key is configured (deposit mode). */
export function isStripeReady(): boolean {
  const key = (import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ?? "") as string;
  return key.startsWith("pk_") && !key.includes("PLACEHOLDER");
}

/** YYYY-MM-DD from a Date's local calendar fields (the day the user picked). */
function toDateParam(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export async function fetchServices(): Promise<BookableService[]> {
  const { data, error } = await supabase
    .from("services")
    .select("slug, title, duration_min, deposit_cents, price_label")
    .eq("active", true)
    .order("sort");
  if (error) throw error;
  return data ?? [];
}

/** Available appointment start times for a day, as Date instants. */
export async function fetchAvailability(
  date: Date,
  serviceSlug: string,
  staffSlug = "albert",
): Promise<Date[]> {
  const { data, error } = await supabase.rpc("available_slots", {
    p_date: toDateParam(date),
    p_service_slug: serviceSlug,
    p_staff_slug: staffSlug,
  });
  if (error) throw error;
  return (data ?? []).map((row: { slot: string }) => new Date(row.slot));
}

export async function createBooking(
  input: CreateBookingInput,
): Promise<CreateBookingResult> {
  const res = await fetch(`${supabaseUrl}/functions/v1/create-booking`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
    },
    body: JSON.stringify(input),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body?.error ?? "Could not create booking.");
  }
  return body as CreateBookingResult;
}

let stripePromise: Promise<Stripe | null> | null = null;

/** Lazily load Stripe.js with the publishable key. */
export function getStripe(): Promise<Stripe | null> {
  if (!stripePromise) {
    const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined;
    stripePromise = loadStripe(key ?? "");
  }
  return stripePromise;
}
