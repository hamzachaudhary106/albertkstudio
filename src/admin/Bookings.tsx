import { useEffect, useState } from "react";
import { supabase } from "./adminClient";
import { PageTitle, cls } from "./ui";

type Appt = {
  id: string;
  starts_at: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  status: string;
  deposit_cents: number;
  services: { title: string } | null;
};

const STATUSES = ["pending", "confirmed", "completed", "cancelled", "expired"];
const FILTERS = ["upcoming", "all", "confirmed", "pending", "cancelled"] as const;

function fmt(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    timeZone: "America/New_York",
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

const badge: Record<string, string> = {
  confirmed: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  cancelled: "bg-red-100 text-red-600",
  completed: "bg-blue-100 text-blue-700",
  expired: "bg-neutral-100 text-neutral-500",
};

export default function Bookings() {
  const [rows, setRows] = useState<Appt[]>([]);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("upcoming");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    let q = supabase
      .from("appointments")
      .select("id,starts_at,customer_name,customer_phone,customer_email,status,deposit_cents,services(title)")
      .order("starts_at", { ascending: filter === "upcoming" });

    if (filter === "upcoming") q = q.gte("starts_at", new Date().toISOString()).in("status", ["pending", "confirmed"]);
    else if (filter !== "all") q = q.eq("status", filter);

    const { data } = await q.limit(300);
    setRows((data as unknown as Appt[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const setStatus = async (id: string, status: string) => {
    await supabase.from("appointments").update({ status }).eq("id", id);
    setRows((r) => r.map((x) => (x.id === id ? { ...x, status } : x)));
  };

  return (
    <div>
      <PageTitle title="Bookings" subtitle="Manage appointments and their status" />

      <div className="mb-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1 text-sm capitalize ${filter === f ? "bg-[#b8956e] text-white" : "border border-neutral-300 bg-white text-neutral-600"}`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className={`${cls.card} overflow-hidden`}>
        {loading ? (
          <p className="p-6 text-sm text-neutral-400">Loading…</p>
        ) : rows.length === 0 ? (
          <p className="p-6 text-sm text-neutral-400">No bookings found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 text-left text-xs uppercase tracking-wide text-neutral-400">
                <tr>
                  <th className="px-4 py-3">When</th>
                  <th className="px-4 py-3">Client</th>
                  <th className="px-4 py-3">Service</th>
                  <th className="px-4 py-3">Deposit</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {rows.map((a) => (
                  <tr key={a.id}>
                    <td className="whitespace-nowrap px-4 py-3 text-neutral-700">{fmt(a.starts_at)}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-neutral-900">{a.customer_name}</div>
                      <div className="text-xs text-neutral-400">
                        <a href={`tel:${a.customer_phone}`} className="hover:text-[#a6845d]">{a.customer_phone}</a>
                        {a.customer_email ? ` · ${a.customer_email}` : ""}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-neutral-700">{a.services?.title ?? "—"}</td>
                    <td className="px-4 py-3 text-neutral-700">${(a.deposit_cents / 100).toFixed(0)}</td>
                    <td className="px-4 py-3">
                      <span className={`mb-1 inline-block rounded-full px-2 py-0.5 text-xs capitalize ${badge[a.status] ?? ""}`}>{a.status}</span>
                      <select
                        value={a.status}
                        onChange={(e) => setStatus(a.id, e.target.value)}
                        className="ml-2 rounded border border-neutral-200 bg-white px-1 py-0.5 text-xs capitalize"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
