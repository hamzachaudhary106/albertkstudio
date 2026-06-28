// Creates a booking. If Stripe is configured, holds the slot and returns a
// deposit PaymentIntent (confirmed later by the webhook). If Stripe is NOT
// configured, the booking is confirmed immediately (no deposit) and the
// confirmation emails are sent here.
// Deploy: `supabase functions deploy create-booking`
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";
import { corsHeaders, json } from "../_shared/cors.ts";

const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY") ?? "";
const stripeConfigured = STRIPE_SECRET_KEY.startsWith("sk_") && !STRIPE_SECRET_KEY.includes("PLACEHOLDER");

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
  httpClient: Stripe.createFetchHttpClient(),
});

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
);

const SALON_TZ = "America/New_York";
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const SALON_EMAIL = Deno.env.get("SALON_EMAIL") ?? "info@albertkstudio.com";
const FROM_EMAIL = Deno.env.get("FROM_EMAIL") ?? "Albert K Studio <onboarding@resend.dev>";

function salonDate(iso: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: SALON_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(iso));
}

function formatWhen(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: SALON_TZ,
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

async function sendEmail(to: string, subject: string, html: string) {
  if (!RESEND_API_KEY) return;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
    });
    if (!res.ok) console.error("Resend error:", res.status, await res.text());
  } catch (e) {
    console.error("Email send failed:", e);
  }
}

async function sendConfirmation(opts: {
  serviceTitle: string;
  stylistName: string;
  startsAt: string;
  name: string;
  phone: string;
  email: string;
}) {
  const when = formatWhen(opts.startsAt);
  if (opts.email) {
    await sendEmail(
      opts.email,
      `Your appointment is confirmed — ${opts.serviceTitle}`,
      `<div style="font-family:Helvetica,Arial,sans-serif;color:#1a1a1a;line-height:1.6">
        <h2 style="font-weight:600">You're booked, ${opts.name}!</h2>
        <p>Thank you for booking with <strong>Albert K Studio</strong>.</p>
        <table style="border-collapse:collapse">
          <tr><td style="padding:4px 16px 4px 0;color:#777">Service</td><td><strong>${opts.serviceTitle}</strong></td></tr>
          <tr><td style="padding:4px 16px 4px 0;color:#777">Stylist</td><td>${opts.stylistName}</td></tr>
          <tr><td style="padding:4px 16px 4px 0;color:#777">When</td><td>${when}</td></tr>
        </table>
        <p style="color:#777;font-size:13px">Need to change it? Call (917) 657-8170.</p>
      </div>`,
    );
  }
  await sendEmail(
    SALON_EMAIL,
    `New booking: ${opts.serviceTitle} — ${when}`,
    `<div style="font-family:Helvetica,Arial,sans-serif;color:#1a1a1a;line-height:1.6">
      <h2 style="font-weight:600">New booking</h2>
      <table style="border-collapse:collapse">
        <tr><td style="padding:4px 16px 4px 0;color:#777">Service</td><td><strong>${opts.serviceTitle}</strong></td></tr>
        <tr><td style="padding:4px 16px 4px 0;color:#777">When</td><td>${when}</td></tr>
        <tr><td style="padding:4px 16px 4px 0;color:#777">Client</td><td>${opts.name}</td></tr>
        <tr><td style="padding:4px 16px 4px 0;color:#777">Phone</td><td>${opts.phone}</td></tr>
        <tr><td style="padding:4px 16px 4px 0;color:#777">Email</td><td>${opts.email || "—"}</td></tr>
      </table>
    </div>`,
  );
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const { serviceSlug, staffSlug = "albert", startsAt, customer } = await req.json();

    if (!serviceSlug || !startsAt || !customer?.name?.trim() || !customer?.phone?.trim()) {
      return json({ error: "Missing required booking details." }, 400);
    }

    const startDate = new Date(startsAt);
    if (Number.isNaN(startDate.getTime()) || startDate.getTime() < Date.now()) {
      return json({ error: "Please choose a valid future time." }, 400);
    }

    // Clear out stale holds so abandoned checkouts free their slot.
    await supabase
      .from("appointments")
      .update({ status: "expired" })
      .eq("status", "pending")
      .lt("created_at", new Date(Date.now() - 15 * 60 * 1000).toISOString());

    const { data: service } = await supabase
      .from("services")
      .select("id, title, duration_min, buffer_min, deposit_cents")
      .eq("slug", serviceSlug)
      .eq("active", true)
      .single();
    if (!service) return json({ error: "Service not found." }, 404);

    const { data: staff } = await supabase
      .from("staff")
      .select("id, name")
      .eq("slug", staffSlug)
      .eq("active", true)
      .single();
    if (!staff) return json({ error: "Stylist not found." }, 404);

    const { data: slots, error: slotErr } = await supabase.rpc("available_slots", {
      p_date: salonDate(startsAt),
      p_service_slug: serviceSlug,
      p_staff_slug: staffSlug,
    });
    if (slotErr) throw slotErr;

    const isOpen = (slots ?? []).some(
      (s: { slot: string }) => new Date(s.slot).getTime() === startDate.getTime(),
    );
    if (!isOpen) return json({ error: "That time was just taken. Please pick another." }, 409);

    const endsAt = new Date(
      startDate.getTime() + (service.duration_min + service.buffer_min) * 60 * 1000,
    ).toISOString();

    const { data: appointment, error: insertErr } = await supabase
      .from("appointments")
      .insert({
        service_id: service.id,
        staff_id: staff.id,
        starts_at: startDate.toISOString(),
        ends_at: endsAt,
        customer_name: customer.name.trim(),
        customer_phone: customer.phone.trim(),
        customer_email: customer.email?.trim() || null,
        status: stripeConfigured ? "pending" : "confirmed",
        deposit_cents: stripeConfigured ? service.deposit_cents : 0,
      })
      .select("id")
      .single();

    if (insertErr) {
      const status = insertErr.code === "23P01" ? 409 : 500;
      return json(
        { error: status === 409 ? "That time was just taken. Please pick another." : "Could not create booking." },
        status,
      );
    }

    // ----- No-deposit mode: confirm now and email -----
    if (!stripeConfigured) {
      await sendConfirmation({
        serviceTitle: service.title,
        stylistName: staff.name,
        startsAt: startDate.toISOString(),
        name: customer.name.trim(),
        phone: customer.phone.trim(),
        email: customer.email?.trim() || "",
      });
      return json({ appointmentId: appointment.id, confirmed: true });
    }

    // ----- Deposit mode: create a Stripe PaymentIntent -----
    const paymentIntent = await stripe.paymentIntents.create({
      amount: service.deposit_cents,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      description: `Deposit — ${service.title} at Albert K Studio`,
      receipt_email: customer.email?.trim() || undefined,
      metadata: {
        appointment_id: appointment.id,
        service: service.title,
        stylist: staff.name,
        customer_name: customer.name.trim(),
      },
    });

    await supabase
      .from("appointments")
      .update({ stripe_payment_intent_id: paymentIntent.id })
      .eq("id", appointment.id);

    return json({
      appointmentId: appointment.id,
      clientSecret: paymentIntent.client_secret,
      depositCents: service.deposit_cents,
      currency: "usd",
    });
  } catch (err) {
    console.error("create-booking error:", err);
    return json({ error: "Something went wrong. Please try again or call us." }, 500);
  }
});
