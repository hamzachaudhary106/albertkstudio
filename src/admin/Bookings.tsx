import { useEffect, useMemo, useState } from "react";
import { CalendarPlus, Phone } from "lucide-react";
import { supabase } from "./adminClient";
import { Badge, Card, EmptyState, PageHeader, SearchInput, Select, Spinner } from "./ui";
import { useToast } from "./store";
import { currency, fmtDateTime, initials, logActivity } from "./lib";

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

const badgeTone: Record<string, "green" | "amber" | "red" | "blue" | "neutral"> = {
  confirmed: "green",
  pending: "amber",
  cancelled: "red",
  completed: "blue",
  expired: "neutral",
};

export default function Bookings() {
  const { notify } = useToast();
  const [rows, setRows] = useState<Appt[]>([]);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("upcoming");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    let query = supabase
      .from("appointments")
      .select("id,starts_at,customer_name,customer_phone,customer_email,status,deposit_cents,services(title)")
      .order("starts_at", { ascending: filter === "upcoming" });

    if (filter === "upcoming") query = query.gte("starts_at", new Date().toISOString()).in("status", ["pending", "confirmed"]);
    else if (filter !== "all") query = query.eq("status", filter);

    const { data } = await query.limit(300);
    setRows((data as unknown as Appt[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const setStatus = async (id: string, status: string) => {
    const row = rows.find((r) => r.id === id);
    await supabase.from("appointments").update({ status }).eq("id", id);
    setRows((r) => r.map((x) => (x.id === id ? { ...x, status } : x)));
    notify(`Booking marked ${status}`);
    logActivity({ action: "updated", entity: "booking", label: `${row?.customer_name ?? ""} → ${status}` });
  };

  const filtered = useMemo(() => {
    if (!q.trim()) return rows;
    const term = q.toLowerCase();
    return rows.filter(
      (r) =>
        r.customer_name.toLowerCase().includes(term) ||
        r.customer_phone.includes(term) ||
        (r.customer_email ?? "").toLowerCase().includes(term),
    );
  }, [rows, q]);

  return (
    <div>
      <PageHeader title="Bookings" subtitle="Manage appointment requests and their status" />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex rounded-lg border border-neutral-200 bg-white p-1">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-md px-3 py-1.5 text-[13px] font-medium capitalize transition ${
                filter === f ? "bg-[#2271b1] text-white shadow-sm" : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <SearchInput value={q} onChange={setQ} placeholder="Search name, phone, email…" className="sm:max-w-xs" />
      </div>

      {loading ? (
        <Spinner />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<CalendarPlus size={22} />}
          title="No bookings found"
          description="When clients request appointments online they'll show up here."
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-neutral-100 bg-neutral-50/70 text-left text-xs font-medium uppercase tracking-wide text-neutral-400">
                <tr>
                  <th className="px-4 py-3">When</th>
                  <th className="px-4 py-3">Client</th>
                  <th className="px-4 py-3">Service</th>
                  <th className="px-4 py-3">Deposit</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filtered.map((a) => (
                  <tr key={a.id} className="transition hover:bg-neutral-50/60">
                    <td className="whitespace-nowrap px-4 py-3 text-neutral-700">{fmtDateTime(a.starts_at)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2271b1]/12 text-xs font-semibold text-[#135e96]">
                          {initials(a.customer_name)}
                        </span>
                        <div className="min-w-0">
                          <div className="font-medium text-neutral-900">{a.customer_name}</div>
                          <div className="flex items-center gap-1 text-xs text-neutral-400">
                            <Phone size={11} />
                            <a href={`tel:${a.customer_phone}`} className="hover:text-[#135e96]">
                              {a.customer_phone}
                            </a>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-neutral-700">{a.services?.title ?? "—"}</td>
                    <td className="px-4 py-3 text-neutral-700">{currency(a.deposit_cents)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Badge tone={badgeTone[a.status] ?? "neutral"}>{a.status}</Badge>
                        <Select
                          value={a.status}
                          onChange={(e) => setStatus(a.id, e.target.value)}
                          className="h-8 w-auto py-0 text-xs"
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </Select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
