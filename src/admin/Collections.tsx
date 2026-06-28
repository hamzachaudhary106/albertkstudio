import { useEffect, useState } from "react";
import { Plus, Trash2, Upload } from "lucide-react";
import { supabase, uploadImage } from "./adminClient";
import { Button, Field, Input, Textarea, PageTitle, cls } from "./ui";

export type CollectionKind = "services" | "gallery" | "team" | "reviews" | "faqs";

type FieldType = "text" | "textarea" | "number" | "bool" | "image" | "lines" | "json";
type FieldDef = { key: string; label: string; type: FieldType };
type Config = { table: string; title: string; subtitle: string; titleField: string; fields: FieldDef[] };

const CONFIGS: Record<CollectionKind, Config> = {
  services: {
    table: "services",
    title: "Services",
    subtitle: "Treatments shown on the site and bookable online",
    titleField: "title",
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "slug", label: "Slug (URL id)", type: "text" },
      { key: "price_label", label: "Price label (e.g. From $350)", type: "text" },
      { key: "duration_min", label: "Duration (minutes)", type: "number" },
      { key: "deposit_cents", label: "Deposit (cents, e.g. 5000 = $50)", type: "number" },
      { key: "tagline", label: "Tagline", type: "text" },
      { key: "description", label: "Short description", type: "textarea" },
      { key: "image_url", label: "Image", type: "image" },
      { key: "image_position", label: "Image position (CSS object-position)", type: "text" },
      { key: "ideal_for", label: "Ideal for", type: "textarea" },
      { key: "overview", label: "Overview paragraphs (one per line)", type: "lines" },
      { key: "includes", label: "What's included (one per line)", type: "lines" },
      { key: "process", label: "Process steps (JSON: [{title,text}])", type: "json" },
      { key: "sort", label: "Sort order", type: "number" },
      { key: "active", label: "Active", type: "bool" },
    ],
  },
  gallery: {
    table: "gallery_items",
    title: "Gallery",
    subtitle: "Portfolio images",
    titleField: "title",
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "category", label: "Category", type: "text" },
      { key: "image_url", label: "Image", type: "image" },
      { key: "featured", label: "Featured (larger tile)", type: "bool" },
      { key: "sort", label: "Sort order", type: "number" },
      { key: "active", label: "Active", type: "bool" },
    ],
  },
  team: {
    table: "team_members",
    title: "Team",
    subtitle: "Stylists",
    titleField: "name",
    fields: [
      { key: "name", label: "Name", type: "text" },
      { key: "role", label: "Role", type: "text" },
      { key: "specialty", label: "Specialty", type: "text" },
      { key: "bio", label: "Bio", type: "textarea" },
      { key: "image_url", label: "Photo", type: "image" },
      { key: "slug", label: "Slug", type: "text" },
      { key: "sort", label: "Sort order", type: "number" },
      { key: "active", label: "Active", type: "bool" },
    ],
  },
  reviews: {
    table: "reviews",
    title: "Reviews",
    subtitle: "Client testimonials",
    titleField: "name",
    fields: [
      { key: "name", label: "Client name", type: "text" },
      { key: "date_label", label: "Date label (e.g. 3 months ago)", type: "text" },
      { key: "text", label: "Review", type: "textarea" },
      { key: "featured", label: "Featured (large quote)", type: "bool" },
      { key: "sort", label: "Sort order", type: "number" },
      { key: "active", label: "Active", type: "bool" },
    ],
  },
  faqs: {
    table: "faqs",
    title: "FAQs",
    subtitle: "Frequently asked questions",
    titleField: "question",
    fields: [
      { key: "question", label: "Question", type: "text" },
      { key: "answer", label: "Answer", type: "textarea" },
      { key: "sort", label: "Sort order", type: "number" },
      { key: "active", label: "Active", type: "bool" },
    ],
  },
};

type Row = Record<string, unknown>;

function toFormValue(type: FieldType, v: unknown): string | boolean {
  if (type === "bool") return Boolean(v);
  if (type === "lines") return Array.isArray(v) ? (v as string[]).join("\n") : "";
  if (type === "json") return v ? JSON.stringify(v, null, 2) : "";
  return v === null || v === undefined ? "" : String(v);
}

function fromFormValue(type: FieldType, v: string | boolean): unknown {
  if (type === "bool") return Boolean(v);
  if (type === "number") return v === "" ? null : Number(v);
  if (type === "lines") return String(v).split("\n").map((s) => s.trim()).filter(Boolean);
  if (type === "json") {
    try {
      return v ? JSON.parse(String(v)) : [];
    } catch {
      return [];
    }
  }
  return v === "" ? null : v;
}

function RowForm({ config, initial, onSaved, onCancel }: { config: Config; initial: Row; onSaved: () => void; onCancel: () => void }) {
  const [form, setForm] = useState<Record<string, string | boolean>>(() => {
    const f: Record<string, string | boolean> = {};
    for (const fd of config.fields) f[fd.key] = toFormValue(fd.type, initial[fd.key]);
    return f;
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const set = (k: string, v: string | boolean) => setForm((s) => ({ ...s, [k]: v }));

  const save = async () => {
    setSaving(true);
    setError("");
    const payload: Row = {};
    for (const fd of config.fields) payload[fd.key] = fromFormValue(fd.type, form[fd.key]);

    const res = initial.id
      ? await supabase.from(config.table).update(payload).eq("id", String(initial.id))
      : await supabase.from(config.table).insert(payload);

    setSaving(false);
    if (res.error) {
      setError(res.error.message);
      return;
    }
    onSaved();
  };

  const handleUpload = async (key: string, file: File) => {
    setUploading(true);
    try {
      const url = await uploadImage(file, config.table);
      set(key, url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mt-3 space-y-4 rounded-md border border-neutral-200 bg-neutral-50 p-4">
      {config.fields.map((fd) => (
        <Field key={fd.key} label={fd.label}>
          {fd.type === "bool" ? (
            <label className="flex items-center gap-2 text-sm text-neutral-600">
              <input type="checkbox" checked={Boolean(form[fd.key])} onChange={(e) => set(fd.key, e.target.checked)} />
              Enabled
            </label>
          ) : fd.type === "textarea" || fd.type === "lines" || fd.type === "json" ? (
            <Textarea rows={fd.type === "json" ? 5 : 3} value={String(form[fd.key] ?? "")} onChange={(e) => set(fd.key, e.target.value)} />
          ) : fd.type === "image" ? (
            <div className="space-y-2">
              {form[fd.key] ? <img src={String(form[fd.key])} alt="" className="h-24 w-24 rounded object-cover" /> : null}
              <div className="flex items-center gap-2">
                <Input value={String(form[fd.key] ?? "")} onChange={(e) => set(fd.key, e.target.value)} placeholder="Image URL or upload" />
                <label className={`${cls.ghost} cursor-pointer whitespace-nowrap`}>
                  <Upload size={14} /> {uploading ? "…" : "Upload"}
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleUpload(fd.key, e.target.files[0])} />
                </label>
              </div>
            </div>
          ) : (
            <Input type={fd.type === "number" ? "number" : "text"} value={String(form[fd.key] ?? "")} onChange={(e) => set(fd.key, e.target.value)} />
          )}
        </Field>
      ))}
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-2">
        <Button onClick={save} disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );
}

export default function Collections({ kind }: { kind: CollectionKind }) {
  const config = CONFIGS[kind];
  const [rows, setRows] = useState<Row[]>([]);
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from(config.table).select("*").order("sort");
    setRows((data as Row[]) ?? []);
    setLoading(false);
    setEditing(null);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind]);

  const remove = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    await supabase.from(config.table).delete().eq("id", id);
    setRows((r) => r.filter((x) => x.id !== id));
  };

  return (
    <div>
      <PageTitle
        title={config.title}
        subtitle={config.subtitle}
        action={<Button onClick={() => setEditing("new")}><Plus size={15} /> Add</Button>}
      />

      {editing === "new" && (
        <div className={`${cls.card} mb-4 p-4`}>
          <p className="font-medium">New {config.title.replace(/s$/, "")}</p>
          <RowForm config={config} initial={{ active: true, sort: rows.length }} onSaved={load} onCancel={() => setEditing(null)} />
        </div>
      )}

      {loading ? (
        <p className="text-sm text-neutral-400">Loading…</p>
      ) : (
        <div className="space-y-2">
          {rows.map((row) => (
            <div key={String(row.id)} className={`${cls.card} p-4`}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {row.image_url ? <img src={String(row.image_url)} alt="" className="h-10 w-10 rounded object-cover" /> : null}
                  <div>
                    <p className="font-medium text-neutral-900">{String(row[config.titleField] ?? "Untitled")}</p>
                    {!row.active && <span className="text-xs text-neutral-400">Hidden</span>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" onClick={() => setEditing(editing === String(row.id) ? null : String(row.id))}>
                    {editing === String(row.id) ? "Close" : "Edit"}
                  </Button>
                  <Button variant="danger" onClick={() => remove(String(row.id))}><Trash2 size={14} /></Button>
                </div>
              </div>
              {editing === String(row.id) && (
                <RowForm config={config} initial={row} onSaved={load} onCancel={() => setEditing(null)} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
