// Confirms appointments when their deposit is paid, and emails customer + salon.
// Deploy: `supabase functions deploy stripe-webhook --no-verify-jwt`
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", {
  apiVersion: "2024-06-20",
  httpClient: Stripe.createFetchHttpClient(),
});
const cryptoProvider = Stripe.createSubtleCryptoProvider();

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
);

const WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET") ?? "";
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const SALON_EMAIL = Deno.env.get("SALON_EMAIL") ?? "info@albertkstudio.com";
const FROM_EMAIL = Deno.env.get("FROM_EMAIL") ?? "Albert K Studio <bookings@albertkstudio.com>";
const SALON_TZ = "America/New_York";

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

function money(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

async function sendEmail(to: string, subject: string, html: string) {
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

type AppointmentRow = {
  id: string;
  starts_at: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  deposit_cents: number;
  services: { title: string } | null;
  staff: { name: string } | null;
};

async function notify(appointment: AppointmentRow) {
  const when = formatWhen(appointment.starts_at);
  const service = appointment.services?.title ?? "Appointment";
  const stylist = appointment.staff?.name ?? "Albert K";
  const deposit = money(appointment.deposit_cents);

  if (appointment.customer_email) {
    await sendEmail(
      appointment.customer_email,
      `Your appointment is confirmed — ${service}`,
      `<div style="font-family:Helvetica,Arial,sans-serif;color:#1a1a1a;line-height:1.6">
        <h2 style="font-weight:600">You're booked, ${appointment.customer_name}!</h2>
        <p>Thank you for booking with <strong>Albert K Studio</strong>. Here are your details:</p>
        <table style="border-collapse:collapse">
          <tr><td style="padding:4px 16px 4px 0;color:#777">Service</td><td><strong>${service}</strong></td></tr>
          <tr><td style="padding:4px 16px 4px 0;color:#777">Stylist</td><td>${stylist}</td></tr>
          <tr><td style="padding:4px 16px 4px 0;color:#777">When</td><td>${when}</td></tr>
          <tr><td style="padding:4px 16px 4px 0;color:#777">Deposit paid</td><td>${deposit}</td></tr>
        </table>
        <p style="color:#777;font-size:13px">Your deposit is applied to your final bill. Need to change your appointment? Call us at (917) 657-8170.</p>
        <p style="color:#777;font-size:13px">19020 NE 29th Ave, Aventura, FL 33180</p>
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
        <tr><td style="padding:4px 16px 4px 0;color:#777">Client</td><td>${appointment.customer_name}</td></tr>
        <tr><td style="padding:4px 16px 4px 0;color:#777">Phone</td><td>${appointment.customer_phone}</td></tr>
        <tr><td style="padding:4px 16px 4px 0;color:#777">Email</td><td>${appointment.customer_email ?? "—"}</td></tr>
        <tr><td style="padding:4px 16px 4px 0;color:#777">Deposit</td><td>${deposit}</td></tr>
      </table>
    </div>`,
  );
}

Deno.serve(async (req) => {
  const signature = req.headers.get("stripe-signature");
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature!,
      WEBHOOK_SECRET,
      undefined,
      cryptoProvider,
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return new Response("Bad signature", { status: 400 });
  }

  try {
    const pi = event.data.object as Stripe.PaymentIntent;
    const appointmentId = pi.metadata?.appointment_id;

    if (event.type === "payment_intent.succeeded" && appointmentId) {
      const { data: appointment } = await supabase
        .from("appointments")
        .update({ status: "confirmed" })
        .eq("id", appointmentId)
        .neq("status", "confirmed")
        .select("id, starts_at, customer_name, customer_phone, customer_email, deposit_cents, services(title), staff(name)")
        .single();

      if (appointment) await notify(appointment as unknown as AppointmentRow);
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
    // Still 200 so Stripe doesn't hammer retries for non-signature errors.
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
