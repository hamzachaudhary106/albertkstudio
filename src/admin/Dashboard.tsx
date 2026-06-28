import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "./adminClient";
import { PageTitle, cls } from "./ui";

type Stat = { label: string; value: number | string; to: string };

function fmt(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    timeZone: "America/New_York",
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [upcoming, setUpcoming] = useState<Record<string, unknown>[]>([]);
  const [messages, setMessages] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    (async () => {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const [confirmed, pending, newMsgs, up, msgs] = await Promise.all([
        supabase.from("appointments").select("*", { count: "exact", head: true }).eq("status", "confirmed").gte("starts_at", todayStart.toISOString()),
        supabase.from("appointments").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("contact_submissions").select("*", { count: "exact", head: true }).eq("status", "new"),
        supabase.from("appointments").select("id,starts_at,customer_name,status,services(title)").eq("status", "confirmed").gte("starts_at", todayStart.toISOString()).order("starts_at").limit(6),
        supabase.from("contact_submissions").select("id,name,topic,created_at,status").order("created_at", { ascending: false }).limit(6),
      ]);

      setStats([
        { label: "Upcoming confirmed", value: confirmed.count ?? 0, to: "/admin/bookings" },
        { label: "Pending (awaiting payment)", value: pending.count ?? 0, to: "/admin/bookings" },
        { label: "New messages", value: newMsgs.count ?? 0, to: "/admin/contact" },
      ]);
      setUpcoming(up.data ?? []);
      setMessages(msgs.data ?? []);
    })();
  }, []);

  return (
    <div>
      <PageTitle title="Dashboard" subtitle="Overview of bookings and messages" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Link key={s.label} to={s.to} className={`${cls.card} p-5 transition hover:border-[#b8956e]/50`}>
            <p className="text-3xl font-semibold text-neutral-900">{s.value}</p>
            <p className="mt-1 text-sm text-neutral-500">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className={`${cls.card} p-5`}>
          <h2 className="mb-4 font-serif text-lg">Upcoming appointments</h2>
          {upcoming.length === 0 && <p className="text-sm text-neutral-400">No upcoming confirmed bookings.</p>}
          <ul className="space-y-3">
            {upcoming.map((a) => (
              <li key={String(a.id)} className="flex items-center justify-between gap-3 text-sm">
                <span>
                  <span className="font-medium">{String(a.customer_name)}</span>
                  <span className="text-neutral-400"> · {(a.services as { title?: string } | null)?.title ?? "—"}</span>
                </span>
                <span className="shrink-0 text-neutral-500">{fmt(String(a.starts_at))}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={`${cls.card} p-5`}>
          <h2 className="mb-4 font-serif text-lg">Recent messages</h2>
          {messages.length === 0 && <p className="text-sm text-neutral-400">No messages yet.</p>}
          <ul className="space-y-3">
            {messages.map((m) => (
              <li key={String(m.id)} className="flex items-center justify-between gap-3 text-sm">
                <span>
                  <span className="font-medium">{String(m.name)}</span>
                  <span className="text-neutral-400"> · {String(m.topic ?? "")}</span>
                </span>
                <span className="shrink-0 text-neutral-500">
                  {String(m.status) === "new" ? <span className="rounded-full bg-[#b8956e]/15 px-2 py-0.5 text-xs text-[#a6845d]">new</span> : ""}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
