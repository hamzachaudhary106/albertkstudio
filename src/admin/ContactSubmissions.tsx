import { useEffect, useMemo, useState } from "react";
import { Inbox, Mail, Phone, Trash2 } from "lucide-react";
import { supabase } from "./adminClient";
import { Badge, Button, Card, EmptyState, PageHeader, SearchInput, Select, Spinner } from "./ui";
import { useToast } from "./store";
import { fmtDateTime, initials, logActivity, timeAgo } from "./lib";

type Submission = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  topic: string | null;
  message: string | null;
  status: string;
  created_at: string;
};

const FILTERS = ["all", "new", "read", "archived"] as const;

export default function ContactSubmissions() {
  const { notify } = useToast();
  const [rows, setRows] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");
  const [q, setQ] = useState("");

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(300);
    setRows((data as Submission[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const setStatus = async (id: string, status: string) => {
    await supabase.from("contact_submissions").update({ status }).eq("id", id);
    setRows((r) => r.map((x) => (x.id === id ? { ...x, status } : x)));
  };

  const remove = async (row: Submission) => {
    if (!confirm("Delete this message?")) return;
    await supabase.from("contact_submissions").delete().eq("id", row.id);
    setRows((r) => r.filter((x) => x.id !== row.id));
    notify("Message deleted");
    logActivity({ action: "deleted", entity: "message", label: row.name });
  };

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: rows.length, new: 0, read: 0, archived: 0 };
    rows.forEach((r) => (c[r.status] = (c[r.status] ?? 0) + 1));
    return c;
  }, [rows]);

  const filtered = useMemo(() => {
    let list = filter === "all" ? rows : rows.filter((r) => r.status === filter);
    if (q.trim()) {
      const term = q.toLowerCase();
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(term) ||
          (r.email ?? "").toLowerCase().includes(term) ||
          (r.message ?? "").toLowerCase().includes(term),
      );
    }
    return list;
  }, [rows, filter, q]);

  return (
    <div>
      <PageHeader title="Messages" subtitle="Enquiries sent through the website contact form" />

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
              <span className={`ml-1.5 ${filter === f ? "text-white/70" : "text-neutral-400"}`}>{counts[f] ?? 0}</span>
            </button>
          ))}
        </div>
        <SearchInput value={q} onChange={setQ} placeholder="Search messages…" className="sm:max-w-xs" />
      </div>

      {loading ? (
        <Spinner />
      ) : filtered.length === 0 ? (
        <EmptyState icon={<Inbox size={22} />} title="No messages" description="Contact form submissions will appear here." />
      ) : (
        <div className="space-y-3">
          {filtered.map((m) => (
            <Card key={m.id} className={`overflow-hidden p-5 ${m.status === "new" ? "border-l-[3px] border-l-[#2271b1]" : ""}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2271b1]/12 text-sm font-semibold text-[#135e96]">
                    {initials(m.name)}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-neutral-900">{m.name}</p>
                      {m.topic && <Badge tone="neutral">{m.topic}</Badge>}
                      {m.status === "new" && <Badge tone="gold">new</Badge>}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-neutral-400">
                      {m.email && (
                        <a href={`mailto:${m.email}`} className="inline-flex items-center gap-1 hover:text-[#135e96]">
                          <Mail size={11} /> {m.email}
                        </a>
                      )}
                      {m.phone && (
                        <a href={`tel:${m.phone}`} className="inline-flex items-center gap-1 hover:text-[#135e96]">
                          <Phone size={11} /> {m.phone}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                <span className="text-xs text-neutral-400" title={fmtDateTime(m.created_at)}>
                  {timeAgo(m.created_at)}
                </span>
              </div>

              {m.message && (
                <p className="mt-3 whitespace-pre-wrap rounded-lg bg-neutral-50 p-3 text-sm text-neutral-700">{m.message}</p>
              )}

              <div className="mt-4 flex items-center gap-2">
                <Select value={m.status} onChange={(e) => setStatus(m.id, e.target.value)} className="h-8 w-auto py-0 text-xs">
                  {["new", "read", "archived"].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </Select>
                {m.email && (
                  <a href={`mailto:${m.email}`}>
                    <Button variant="secondary" size="sm">
                      <Mail size={14} /> Reply
                    </Button>
                  </a>
                )}
                <Button variant="danger" size="sm" onClick={() => remove(m)}>
                  <Trash2 size={14} /> Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
