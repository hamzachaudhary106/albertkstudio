import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity as ActivityIcon,
  FilePlus2,
  FilePenLine,
  Info,
  LogIn,
  Trash2,
  Upload,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { supabase } from "./adminClient";
import { Button, Card, EmptyState, PageHeader, SearchInput, Select, Spinner } from "./ui";
import { fmtDateTime, initials, timeAgo } from "./lib";

type Log = {
  id: number;
  actor_email: string | null;
  action: string;
  entity: string;
  label: string | null;
  created_at: string;
};

const PAGE = 30;

const ACTION_ICON: Record<string, LucideIcon> = {
  created: FilePlus2,
  updated: FilePenLine,
  deleted: Trash2,
  uploaded: Upload,
  login: LogIn,
};

const ACTION_TONE: Record<string, string> = {
  created: "bg-emerald-50 text-emerald-600",
  updated: "bg-blue-50 text-blue-600",
  deleted: "bg-red-50 text-red-600",
  uploaded: "bg-[#2271b1]/12 text-[#135e96]",
  login: "bg-neutral-100 text-neutral-500",
};

export default function ActivityLog() {
  const [rows, setRows] = useState<Log[] | null>(null);
  const [unavailable, setUnavailable] = useState(false);
  const [action, setAction] = useState("all");
  const [q, setQ] = useState("");
  const [limit, setLimit] = useState(PAGE);
  const [hasMore, setHasMore] = useState(false);

  const load = useCallback(async () => {
    try {
      let query = supabase
        .from("activity_logs")
        .select("id,actor_email,action,entity,label,created_at")
        .order("created_at", { ascending: false })
        .limit(limit + 1);
      if (action !== "all") query = query.eq("action", action);
      const { data, error } = await query;
      if (error) throw error;
      const list = (data as Log[]) ?? [];
      setHasMore(list.length > limit);
      setRows(list.slice(0, limit));
    } catch {
      setUnavailable(true);
      setRows([]);
    }
  }, [action, limit]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    if (!rows) return [];
    if (!q.trim()) return rows;
    const term = q.toLowerCase();
    return rows.filter(
      (r) =>
        (r.actor_email ?? "").toLowerCase().includes(term) ||
        r.entity.toLowerCase().includes(term) ||
        (r.label ?? "").toLowerCase().includes(term),
    );
  }, [rows, q]);

  return (
    <div>
      <PageHeader title="Activity Log" subtitle="A record of changes made across the CMS" />

      {!unavailable && (
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Select value={action} onChange={(e) => setAction(e.target.value)} className="sm:w-44">
            <option value="all">All actions</option>
            <option value="created">Created</option>
            <option value="updated">Updated</option>
            <option value="deleted">Deleted</option>
            <option value="uploaded">Uploaded</option>
          </Select>
          <SearchInput value={q} onChange={setQ} placeholder="Search by user, item…" className="sm:max-w-xs" />
        </div>
      )}

      {unavailable && (
        <Card className="mb-5 flex items-start gap-3 border-amber-200 bg-amber-50/60 p-4">
          <Info size={18} className="mt-0.5 shrink-0 text-amber-600" />
          <div className="text-sm text-amber-800">
            <p className="font-medium">Activity logging isn't enabled yet.</p>
            <p className="mt-0.5 text-amber-700">
              Run the <code className="rounded bg-amber-100 px-1">0003_admin.sql</code> migration to start recording edits.
            </p>
          </div>
        </Card>
      )}

      {rows === null ? (
        <Spinner />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<ActivityIcon size={22} />}
          title="No activity recorded"
          description="Edits, uploads and deletions will be listed here as your team works."
        />
      ) : (
        <Card className="divide-y divide-neutral-100">
          {filtered.map((r) => {
            const Icon = ACTION_ICON[r.action] ?? ActivityIcon;
            return (
              <div key={r.id} className="flex items-center gap-3 p-4">
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${ACTION_TONE[r.action] ?? "bg-neutral-100 text-neutral-500"}`}>
                  <Icon size={16} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-neutral-700">
                    <span className="font-medium text-neutral-900">{r.actor_email ?? "Someone"}</span>{" "}
                    <span className="capitalize">{r.action}</span> {r.entity}
                    {r.label ? <span className="text-neutral-500"> · {r.label}</span> : ""}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="hidden text-xs text-neutral-400 sm:block" title={fmtDateTime(r.created_at)}>
                    {timeAgo(r.created_at)}
                  </span>
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-100 text-[10px] font-semibold text-neutral-500">
                    {initials(r.actor_email ?? "?")}
                  </span>
                </div>
              </div>
            );
          })}
        </Card>
      )}

      {hasMore && !q && (
        <div className="mt-5 text-center">
          <Button variant="secondary" onClick={() => setLimit((l) => l + PAGE)}>
            Load more
          </Button>
        </div>
      )}
    </div>
  );
}
