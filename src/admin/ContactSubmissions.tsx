import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { supabase } from "./adminClient";
import { PageTitle, cls } from "./ui";

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

export default function ContactSubmissions() {
  const [rows, setRows] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

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

  const remove = async (id: string) => {
    if (!confirm("Delete this submission?")) return;
    await supabase.from("contact_submissions").delete().eq("id", id);
    setRows((r) => r.filter((x) => x.id !== id));
  };

  return (
    <div>
      <PageTitle title="Contact Submissions" subtitle="Messages sent through the website contact form" />

      {loading ? (
        <p className="text-sm text-neutral-400">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-neutral-400">No submissions yet.</p>
      ) : (
        <div className="space-y-4">
          {rows.map((m) => (
            <div key={m.id} className={`${cls.card} p-5 ${m.status === "new" ? "border-l-4 border-l-[#b8956e]" : ""}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-neutral-900">
                    {m.name}
                    {m.topic ? <span className="ml-2 rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-500">{m.topic}</span> : null}
                  </p>
                  <p className="mt-0.5 text-xs text-neutral-400">
                    {m.email ? <a href={`mailto:${m.email}`} className="hover:text-[#a6845d]">{m.email}</a> : null}
                    {m.email && m.phone ? " · " : ""}
                    {m.phone ? <a href={`tel:${m.phone}`} className="hover:text-[#a6845d]">{m.phone}</a> : null}
                  </p>
                </div>
                <span className="text-xs text-neutral-400">{new Date(m.created_at).toLocaleString()}</span>
              </div>
              {m.message && <p className="mt-3 whitespace-pre-wrap text-sm text-neutral-700">{m.message}</p>}
              <div className="mt-4 flex items-center gap-2">
                <select
                  value={m.status}
                  onChange={(e) => setStatus(m.id, e.target.value)}
                  className="rounded border border-neutral-200 bg-white px-2 py-1 text-xs capitalize"
                >
                  {["new", "read", "archived"].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <button onClick={() => remove(m.id)} className={cls.danger}>
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
