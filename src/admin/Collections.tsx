import { useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Copy,
  HelpCircle,
  Image as ImageIcon,
  ImagePlus,
  MessageSquareQuote,
  Plus,
  Scissors,
  Star,
  Trash2,
  Upload,
  Users as UsersIcon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { supabase, uploadImage } from "./adminClient";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Field,
  Input,
  Modal,
  PageHeader,
  SearchInput,
  Spinner,
  Textarea,
  Toggle,
} from "./ui";
import { useToast } from "./store";
import { logActivity } from "./lib";
import { MediaPicker } from "./MediaLibrary";

export type CollectionKind = "services" | "gallery" | "team" | "reviews" | "faqs";

type FieldType = "text" | "textarea" | "number" | "bool" | "image" | "lines" | "json";
type FieldDef = { key: string; label: string; type: FieldType; hint?: string };
type Config = {
  table: string;
  title: string;
  singular: string;
  subtitle: string;
  titleField: string;
  icon: LucideIcon;
  fields: FieldDef[];
};

const CONFIGS: Record<CollectionKind, Config> = {
  services: {
    table: "services",
    title: "Services",
    singular: "Service",
    subtitle: "Treatments shown on the site and bookable online",
    titleField: "title",
    icon: Scissors,
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "slug", label: "Slug (URL id)", type: "text", hint: "Lowercase, dashes — e.g. keratin-treatment" },
      { key: "price_label", label: "Price label", type: "text", hint: "e.g. From $350" },
      { key: "duration_min", label: "Duration (minutes)", type: "number" },
      { key: "deposit_cents", label: "Deposit (cents)", type: "number", hint: "5000 = $50" },
      { key: "tagline", label: "Tagline", type: "text" },
      { key: "description", label: "Short description", type: "textarea" },
      { key: "image_url", label: "Image", type: "image" },
      { key: "image_position", label: "Image position", type: "text", hint: "CSS object-position, e.g. object-top" },
      { key: "ideal_for", label: "Ideal for", type: "textarea" },
      { key: "overview", label: "Overview paragraphs", type: "lines", hint: "One paragraph per line" },
      { key: "includes", label: "What's included", type: "lines", hint: "One item per line" },
      { key: "process", label: "Process steps", type: "json", hint: 'JSON: [{ "title": "", "text": "" }]' },
      { key: "sort", label: "Sort order", type: "number" },
      { key: "active", label: "Visible on site", type: "bool" },
    ],
  },
  gallery: {
    table: "gallery_items",
    title: "Gallery",
    singular: "Image",
    subtitle: "Portfolio images shown on the homepage and gallery page",
    titleField: "title",
    icon: ImageIcon,
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "category", label: "Category", type: "text", hint: "e.g. Color, Balayage" },
      { key: "image_url", label: "Image", type: "image" },
      { key: "featured", label: "Featured (larger tile)", type: "bool" },
      { key: "sort", label: "Sort order", type: "number" },
      { key: "active", label: "Visible on site", type: "bool" },
    ],
  },
  team: {
    table: "team_members",
    title: "Team",
    singular: "Stylist",
    subtitle: "Stylists shown on the team and about pages",
    titleField: "name",
    icon: UsersIcon,
    fields: [
      { key: "name", label: "Name", type: "text" },
      { key: "role", label: "Role", type: "text" },
      { key: "specialty", label: "Specialty", type: "text", hint: "Use · to separate, e.g. Color · Cuts" },
      { key: "bio", label: "Bio", type: "textarea" },
      { key: "image_url", label: "Photo", type: "image" },
      { key: "slug", label: "Slug", type: "text" },
      { key: "sort", label: "Sort order", type: "number" },
      { key: "active", label: "Visible on site", type: "bool" },
    ],
  },
  reviews: {
    table: "reviews",
    title: "Reviews",
    singular: "Review",
    subtitle: "Client testimonials shown across the site",
    titleField: "name",
    icon: Star,
    fields: [
      { key: "name", label: "Client name", type: "text" },
      { key: "date_label", label: "Date label", type: "text", hint: "e.g. 3 months ago" },
      { key: "text", label: "Review", type: "textarea" },
      { key: "featured", label: "Featured (large quote)", type: "bool" },
      { key: "sort", label: "Sort order", type: "number" },
      { key: "active", label: "Visible on site", type: "bool" },
    ],
  },
  faqs: {
    table: "faqs",
    title: "FAQs",
    singular: "FAQ",
    subtitle: "Frequently asked questions",
    titleField: "question",
    icon: HelpCircle,
    fields: [
      { key: "question", label: "Question", type: "text" },
      { key: "answer", label: "Answer", type: "textarea" },
      { key: "sort", label: "Sort order", type: "number" },
      { key: "active", label: "Visible on site", type: "bool" },
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

function ImageField({
  value,
  onChange,
  folder,
}: {
  value: string;
  onChange: (v: string) => void;
  folder: string;
}) {
  const { notify } = useToast();
  const [uploading, setUploading] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      onChange(await uploadImage(file, folder));
      notify("Image uploaded");
    } catch (e) {
      notify(e instanceof Error ? e.message : "Upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex gap-3">
      <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50">
        {value ? (
          <img src={value} alt="" className="h-full w-full object-cover" />
        ) : (
          <ImageIcon size={22} className="text-neutral-300" />
        )}
      </div>
      <div className="flex-1 space-y-2">
        <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder="Image URL" />
        <div className="flex gap-2">
          <Button type="button" variant="secondary" size="sm" onClick={() => setPickerOpen(true)}>
            <ImagePlus size={14} /> Library
          </Button>
          <label className="inline-flex h-8 cursor-pointer items-center gap-2 rounded-lg border border-neutral-300 bg-white px-3 text-[13px] font-medium text-neutral-800 transition hover:bg-neutral-50">
            <Upload size={14} /> {uploading ? "Uploading…" : "Upload"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
            />
          </label>
        </div>
      </div>
      <MediaPicker open={pickerOpen} onClose={() => setPickerOpen(false)} onSelect={onChange} folder={folder} />
    </div>
  );
}

function RowForm({
  config,
  initial,
  onSaved,
  onClose,
}: {
  config: Config;
  initial: Row;
  onSaved: () => void;
  onClose: () => void;
}) {
  const { notify } = useToast();
  const [form, setForm] = useState<Record<string, string | boolean>>(() => {
    const f: Record<string, string | boolean> = {};
    for (const fd of config.fields) f[fd.key] = toFormValue(fd.type, initial[fd.key]);
    return f;
  });
  const [saving, setSaving] = useState(false);
  const set = (k: string, v: string | boolean) => setForm((s) => ({ ...s, [k]: v }));

  const save = async () => {
    setSaving(true);
    const payload: Row = {};
    for (const fd of config.fields) payload[fd.key] = fromFormValue(fd.type, form[fd.key]);

    const isNew = !initial.id;
    const res = isNew
      ? await supabase.from(config.table).insert(payload)
      : await supabase.from(config.table).update(payload).eq("id", String(initial.id));

    setSaving(false);
    if (res.error) {
      notify(res.error.message, "error");
      return;
    }
    notify(`${config.singular} ${isNew ? "created" : "updated"}`);
    logActivity({
      action: isNew ? "created" : "updated",
      entity: config.singular.toLowerCase(),
      label: String(payload[config.titleField] ?? ""),
    });
    onSaved();
    onClose();
  };

  return (
    <Modal
      open
      onClose={onClose}
      title={initial.id ? `Edit ${config.singular}` : `New ${config.singular}`}
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button loading={saving} onClick={save}>
            Save changes
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {config.fields.map((fd) => (
          <Field key={fd.key} label={fd.label} hint={fd.hint}>
            {fd.type === "bool" ? (
              <div className="pt-1">
                <Toggle checked={Boolean(form[fd.key])} onChange={(v) => set(fd.key, v)} />
              </div>
            ) : fd.type === "image" ? (
              <ImageField value={String(form[fd.key] ?? "")} onChange={(v) => set(fd.key, v)} folder={config.table} />
            ) : fd.type === "textarea" || fd.type === "lines" || fd.type === "json" ? (
              <Textarea
                rows={fd.type === "json" ? 6 : 3}
                value={String(form[fd.key] ?? "")}
                onChange={(e) => set(fd.key, e.target.value)}
                className={fd.type === "json" ? "font-mono text-xs" : ""}
              />
            ) : (
              <Input
                type={fd.type === "number" ? "number" : "text"}
                value={String(form[fd.key] ?? "")}
                onChange={(e) => set(fd.key, e.target.value)}
              />
            )}
          </Field>
        ))}
      </div>
    </Modal>
  );
}

export default function Collections({ kind }: { kind: CollectionKind }) {
  const config = CONFIGS[kind];
  const { notify } = useToast();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<Row | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from(config.table).select("*").order("sort");
    setRows((data as Row[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
    setQ("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind]);

  const remove = async (row: Row) => {
    if (!confirm(`Delete "${String(row[config.titleField] ?? "this item")}"?`)) return;
    await supabase.from(config.table).delete().eq("id", String(row.id));
    setRows((r) => r.filter((x) => x.id !== row.id));
    notify(`${config.singular} deleted`);
    logActivity({ action: "deleted", entity: config.singular.toLowerCase(), label: String(row[config.titleField] ?? "") });
  };

  const duplicate = async (row: Row) => {
    const copy = { ...row };
    delete copy.id;
    delete copy.created_at;
    copy.sort = rows.length;
    if (copy[config.titleField]) copy[config.titleField] = `${String(copy[config.titleField])} (copy)`;
    if (config.table === "services" && copy.slug) copy.slug = `${String(copy.slug)}-copy`;
    const { error } = await supabase.from(config.table).insert(copy);
    if (error) {
      notify(error.message, "error");
      return;
    }
    notify(`${config.singular} duplicated`);
    load();
  };

  const toggleActive = async (row: Row) => {
    const next = !row.active;
    await supabase.from(config.table).update({ active: next }).eq("id", String(row.id));
    setRows((r) => r.map((x) => (x.id === row.id ? { ...x, active: next } : x)));
  };

  const move = async (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= rows.length) return;
    const a = rows[index];
    const b = rows[target];
    const aSort = Number(a.sort ?? index);
    const bSort = Number(b.sort ?? target);
    const next = [...rows];
    next[index] = { ...b, sort: aSort };
    next[target] = { ...a, sort: bSort };
    next.sort((x, y) => Number(x.sort) - Number(y.sort));
    setRows(next);
    await Promise.all([
      supabase.from(config.table).update({ sort: bSort }).eq("id", String(a.id)),
      supabase.from(config.table).update({ sort: aSort }).eq("id", String(b.id)),
    ]);
  };

  const filtered = useMemo(() => {
    if (!q.trim()) return rows;
    const term = q.toLowerCase();
    return rows.filter((r) =>
      String(r[config.titleField] ?? "").toLowerCase().includes(term),
    );
  }, [rows, q, config.titleField]);

  const Icon = config.icon;

  return (
    <div>
      <PageHeader
        title={config.title}
        subtitle={config.subtitle}
        action={
          <Button onClick={() => setEditing({ active: true, sort: rows.length })}>
            <Plus size={16} /> Add {config.singular.toLowerCase()}
          </Button>
        }
      />

      {rows.length > 0 && (
        <Card className="mb-4 p-3">
          <SearchInput value={q} onChange={setQ} placeholder={`Search ${config.title.toLowerCase()}…`} />
        </Card>
      )}

      {loading ? (
        <Spinner />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Icon size={22} />}
          title={q ? "No matching items" : `No ${config.title.toLowerCase()} yet`}
          description={q ? "Try a different search." : `Add your first ${config.singular.toLowerCase()} to show it on the site.`}
          action={!q && <Button onClick={() => setEditing({ active: true, sort: rows.length })}><Plus size={15} /> Add {config.singular.toLowerCase()}</Button>}
        />
      ) : (
        <div className="space-y-2">
          {filtered.map((row, i) => {
            const showReorder = !q;
            return (
              <Card key={String(row.id)} className="flex items-center gap-3 p-3">
                {showReorder && (
                  <div className="flex flex-col">
                    <button
                      onClick={() => move(i, -1)}
                      disabled={i === 0}
                      className="text-neutral-300 hover:text-neutral-700 disabled:opacity-30"
                      aria-label="Move up"
                    >
                      <ArrowUp size={15} />
                    </button>
                    <button
                      onClick={() => move(i, 1)}
                      disabled={i === filtered.length - 1}
                      className="text-neutral-300 hover:text-neutral-700 disabled:opacity-30"
                      aria-label="Move down"
                    >
                      <ArrowDown size={15} />
                    </button>
                  </div>
                )}

                {row.image_url ? (
                  <img src={String(row.image_url)} alt="" className="h-12 w-12 shrink-0 rounded-lg object-cover" />
                ) : (
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-300">
                    {kind === "reviews" ? <MessageSquareQuote size={18} /> : <Icon size={18} />}
                  </span>
                )}

                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-neutral-900">
                    {String(row[config.titleField] ?? "Untitled")}
                  </p>
                  <div className="mt-0.5 flex items-center gap-2">
                    {row.featured ? <Badge tone="gold">Featured</Badge> : null}
                    {row.category ? <span className="text-xs text-neutral-400">{String(row.category)}</span> : null}
                    {row.price_label ? <span className="text-xs text-neutral-400">{String(row.price_label)}</span> : null}
                    {row.role ? <span className="text-xs text-neutral-400">{String(row.role)}</span> : null}
                  </div>
                </div>

                <button onClick={() => toggleActive(row)} title={row.active ? "Visible — click to hide" : "Hidden — click to show"}>
                  <Badge tone={row.active ? "green" : "neutral"}>{row.active ? "Live" : "Hidden"}</Badge>
                </button>

                <div className="flex items-center gap-1">
                  <Button variant="secondary" size="sm" onClick={() => setEditing(row)}>
                    Edit
                  </Button>
                  <button
                    onClick={() => duplicate(row)}
                    className="rounded-md p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
                    title="Duplicate"
                  >
                    <Copy size={15} />
                  </button>
                  <button
                    onClick={() => remove(row)}
                    className="rounded-md p-2 text-neutral-400 hover:bg-red-50 hover:text-red-600"
                    title="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {editing && (
        <RowForm config={config} initial={editing} onSaved={load} onClose={() => setEditing(null)} />
      )}
    </div>
  );
}
