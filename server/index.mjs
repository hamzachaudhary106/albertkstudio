// Standalone booking API for self-hosted (VPS) deployments.
//
// This is a drop-in alternative to the Supabase Edge Functions in
// ../supabase/functions, with identical behaviour. Use it if you'd rather
// not deploy functions into the self-hosted edge-runtime container.
//
// It exposes the SAME paths the frontend calls:
//   POST /functions/v1/create-booking
//   POST /functions/v1/stripe-webhook
// so you only need to route /functions/v1/* to this service in Nginx.

import express from "express";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const PORT = process.env.PORT || 8787;
const SALON_TZ = "America/New_York";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2024-06-20",
});

// Talk to the local Supabase REST gateway with the service-role key.
const supabase = createClient(
  process.env.SUPABASE_URL ?? "http://localhost:8000",
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
);

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET ?? "";
const RESEND_API_KEY = process.env.RESEND_API_KEY ?? "";
const SALON_EMAIL = process.env.SALON_EMAIL ?? "info@albertkstudio.com";
const FROM_EMAIL = process.env.FROM_EMAIL ?? "Albert K Studio <bookings@albertkstudio.com>";

const app = express();

// --- CORS (the create-booking call comes from the browser) ----------------
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", process.env.CORS_ORIGIN ?? "*");
  res.header("Access-Control-Allow-Headers", "authorization, apikey, content-type");
  res.header("Access-Control-Allow-Methods", "POST, OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

// --- helpers ---------------------------------------------------------------
function salonDate(iso) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: SALON_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(iso));
}

function formatWhen(iso) {
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

const money = (cents) => `$${(cents / 100).toFixed(2)}`;

async function sendEmail(to, subject, html) {
  if (!RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not set — skipping email to", to);
    return;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
  });
  if (!res.ok) console.error("Resend error:", res.status, await res.text());
}

async function notify(appt) {
  const when = formatWhen(appt.starts_at);
  const service = appt.services?.title ?? "Appointment";
  const stylist = appt.staff?.name ?? "Albert K";
  const deposit = money(appt.deposit_cents);

  if (appt.customer_email) {
    await sendEmail(
      appt.customer_email,
      `Your appointment is confirmed — ${service}`,
      `<div style="font-family:Helvetica,Arial,sans-serif;color:#1a1a1a;line-height:1.6">
        <h2 style="font-weight:600">You're booked, ${appt.customer_name}!</h2>
        <p>Thank you for booking with <strong>Albert K Studio</strong>.</p>
        <table style="border-collapse:collapse">
          <tr><td style="padding:4px 16px 4px 0;color:#777">Service</td><td><strong>${service}</strong></td></tr>
          <tr><td style="padding:4px 16px 4px 0;color:#777">Stylist</td><td>${stylist}</td></tr>
          <tr><td style="padding:4px 16px 4px 0;color:#777">When</td><td>${when}</td></tr>
          <tr><td style="padding:4px 16px 4px 0;color:#777">Deposit paid</td><td>${deposit}</td></tr>
        </table>
        <p style="color:#777;font-size:13px">Your deposit is applied to your final bill. Need to change it? Call (917) 657-8170.</p>
      </div>`,
    );
  }

  await sendEmail(
    SALON_EMAIL,
    `New booking: ${service} — ${when}`,
    `<div style="font-family:Helvetica,Arial,sans-serif;color:#1a1a1a;line-height:1.6">
      <h2 style="font-weight:600">New confirmed booking</h2>
      <table style="border-collapse:collapse">
        <tr><td style="padding:4px 16px 4px 0;color:#777">Service</td><td><strong>${service}</strong></td></tr>
        <tr><td style="padding:4px 16px 4px 0;color:#777">Stylist</td><td>${stylist}</td></tr>
        <tr><td style="padding:4px 16px 4px 0;color:#777">When</td><td>${when}</td></tr>
        <tr><td style="padding:4px 16px 4px 0;color:#777">Client</td><td>${appt.customer_name}</td></tr>
        <tr><td style="padding:4px 16px 4px 0;color:#777">Phone</td><td>${appt.customer_phone}</td></tr>
        <tr><td style="padding:4px 16px 4px 0;color:#777">Email</td><td>${appt.customer_email ?? "—"}</td></tr>
        <tr><td style="padding:4px 16px 4px 0;color:#777">Deposit</td><td>${deposit}</td></tr>
      </table>
    </div>`,
  );
}

// --- Stripe webhook (raw body required for signature verification) ---------
app.post(
  "/functions/v1/stripe-webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        req.headers["stripe-signature"],
        WEBHOOK_SECRET,
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).send("Bad signature");
    }

    try {
      const pi = event.data.object;
      const appointmentId = pi.metadata?.appointment_id;

      if (event.type === "payment_intent.succeeded" && appointmentId) {
        const { data: appt } = await supabase
          .from("appointments")
          .update({ status: "confirmed" })
          .eq("id", appointmentId)
          .neq("status", "confirmed")
          .select(
            "id, starts_at, customer_name, customer_phone, customer_email, deposit_cents, services(title), staff(name)",
          )
          .single();
        if (appt) await notify(appt);
      }

      if (event.type === "payment_intent.canceled" && appointmentId) {
        await supabase
          .from("appointments")
          .update({ status: "cancelled" })
          .eq("id", appointmentId)
          .eq("status", "pending");
      }
    } catch (err) {
      console.error("Webhook handling error:", err);
    }

    res.json({ received: true });
  },
);

// --- create booking + deposit PaymentIntent --------------------------------
app.post("/functions/v1/create-booking", express.json(), async (req, res) => {
  try {
    const { serviceSlug, staffSlug = "albert", startsAt, customer } = req.body ?? {};

    if (!serviceSlug || !startsAt || !customer?.name?.trim() || !customer?.phone?.trim()) {
      return res.status(400).json({ error: "Missing required booking details." });
    }

    const startDate = new Date(startsAt);
    if (Number.isNaN(startDate.getTime()) || startDate.getTime() < Date.now()) {
      return res.status(400).json({ error: "Please choose a valid future time." });
    }

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
    if (!service) return res.status(404).json({ error: "Service not found." });

    const { data: staff } = await supabase
      .from("staff")
      .select("id, name")
      .eq("slug", staffSlug)
      .eq("active", true)
      .single();
    if (!staff) return res.status(404).json({ error: "Stylist not found." });

    const { data: slots, error: slotErr } = await supabase.rpc("available_slots", {
      p_date: salonDate(startsAt),
      p_service_slug: serviceSlug,
      p_staff_slug: staffSlug,
    });
    if (slotErr) throw slotErr;

    const isOpen = (slots ?? []).some(
      (s) => new Date(s.slot).getTime() === startDate.getTime(),
    );
    if (!isOpen) {
      return res.status(409).json({ error: "That time was just taken. Please pick another." });
    }

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
        status: "pending",
        deposit_cents: service.deposit_cents,
      })
      .select("id")
      .single();

    if (insertErr) {
      const status = insertErr.code === "23P01" ? 409 : 500;
      return res.status(status).json({
        error:
          status === 409
            ? "That time was just taken. Please pick another."
            : "Could not create booking.",
      });
    }

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

    res.json({
      appointmentId: appointment.id,
      clientSecret: paymentIntent.client_secret,
      depositCents: service.deposit_cents,
      currency: "usd",
    });
  } catch (err) {
    console.error("create-booking error:", err);
    res.status(500).json({ error: "Something went wrong. Please try again or call us." });
  }
});

app.get("/health", (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => console.log(`Booking server listening on :${PORT}`));
