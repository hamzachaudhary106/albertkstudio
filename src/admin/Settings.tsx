import { useEffect, useState } from "react";
import { Building2, Home, Info, Clock, Menu as MenuIcon, Plus, Trash2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { supabase } from "./adminClient";
import {
  about as aboutDefault,
  business as businessDefault,
  navLinks as navDefault,
  hero as heroDefault,
  workingHours as hoursDefault,
} from "../data/content";
import { Button, Card, Field, Input, PageHeader, Textarea } from "./ui";
import { useToast } from "./store";
import { logActivity } from "./lib";

type FieldKind = "text" | "textarea" | "number" | "lines";
type FieldDef = { key: string; label: string; kind?: FieldKind; hint?: string; full?: boolean };

/* ------------------------------------------------------------------ */
/* Object editor (business / hero / about)                            */
/* ------------------------------------------------------------------ */

function ObjectEditor({
  settingKey,
  title,
  subtitle,
  icon: Icon,
  fields,
  defaults,
}: {
  settingKey: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  fields: FieldDef[];
  defaults: Record<string, unknown>;
}) {
  const { notify } = useToast();
  const [form, setForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("site_settings").select("value").eq("key", settingKey).maybeSingle();
      const merged = { ...defaults, ...((data?.value as object) ?? {}) } as Record<string, unknown>;
      const f: Record<string, string> = {};
      for (const fd of fields) {
        const v = merged[fd.key];
        f[fd.key] = fd.kind === "lines" && Array.isArray(v) ? (v as string[]).join("\n") : v == null ? "" : String(v);
      }
      setForm(f);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settingKey]);

  const save = async () => {
    setSaving(true);
    const payload: Record<string, unknown> = { ...defaults };
    for (const fd of fields) {
      const raw = form[fd.key] ?? "";
      if (fd.kind === "number") payload[fd.key] = raw === "" ? null : Number(raw);
      else if (fd.kind === "lines") payload[fd.key] = raw.split("\n").map((s) => s.trim()).filter(Boolean);
      else payload[fd.key] = raw;
    }
    const { error } = await supabase
      .from("site_settings")
      .upsert({ key: settingKey, value: payload, updated_at: new Date().toISOString() });
    setSaving(false);
    if (error) {
      notify(error.message, "error");
      return;
    }
    notify(`${title} saved`);
    logActivity({ action: "updated", entity: "setting", label: title });
  };

  return (
    <Card className="p-5">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#b8956e]/10 text-[#a6845d]">
          <Icon size={18} />
        </span>
        <div>
          <h2 className="font-serif text-lg text-neutral-900">{title}</h2>
          <p className="text-xs text-neutral-400">{subtitle}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {fields.map((fd) => (
          <div key={fd.key} className={fd.full || fd.kind === "textarea" || fd.kind === "lines" ? "sm:col-span-2" : ""}>
            <Field label={fd.label} hint={fd.hint}>
              {fd.kind === "textarea" || fd.kind === "lines" ? (
                <Textarea
                  rows={fd.kind === "lines" ? 4 : 2}
                  value={form[fd.key] ?? ""}
                  onChange={(e) => setForm((s) => ({ ...s, [fd.key]: e.target.value }))}
                />
              ) : (
                <Input
                  type={fd.kind === "number" ? "number" : "text"}
                  value={form[fd.key] ?? ""}
                  onChange={(e) => setForm((s) => ({ ...s, [fd.key]: e.target.value }))}
                />
              )}
            </Field>
          </div>
        ))}
      </div>
      <div className="mt-5 flex justify-end">
        <Button loading={saving} onClick={save}>
          Save changes
        </Button>
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* List editor (hours / nav)                                          */
/* ------------------------------------------------------------------ */

function ListEditor({
  settingKey,
  title,
  subtitle,
  icon: Icon,
  columns,
  defaults,
}: {
  settingKey: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  columns: { key: string; label: string; placeholder?: string }[];
  defaults: Record<string, string>[];
}) {
  const { notify } = useToast();
  const [items, setItems] = useState<Record<string, string>[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("site_settings").select("value").eq("key", settingKey).maybeSingle();
      const val = (data?.value as Record<string, string>[]) ?? defaults;
      setItems(Array.isArray(val) ? val : defaults);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settingKey]);

  const save = async () => {
    setSaving(true);
    const cleaned = items.filter((it) => columns.some((c) => (it[c.key] ?? "").trim()));
    const { error } = await supabase
      .from("site_settings")
      .upsert({ key: settingKey, value: cleaned, updated_at: new Date().toISOString() });
    setSaving(false);
    if (error) {
      notify(error.message, "error");
      return;
    }
    notify(`${title} saved`);
    logActivity({ action: "updated", entity: "setting", label: title });
  };

  return (
    <Card className="p-5">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#b8956e]/10 text-[#a6845d]">
          <Icon size={18} />
        </span>
        <div>
          <h2 className="font-serif text-lg text-neutral-900">{title}</h2>
          <p className="text-xs text-neutral-400">{subtitle}</p>
        </div>
      </div>

      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            {columns.map((c) => (
              <Input
                key={c.key}
                value={item[c.key] ?? ""}
                placeholder={c.placeholder ?? c.label}
                onChange={(e) => setItems((cur) => cur.map((x, xi) => (xi === i ? { ...x, [c.key]: e.target.value } : x)))}
              />
            ))}
            <button
              onClick={() => setItems((cur) => cur.filter((_, xi) => xi !== i))}
              className="shrink-0 rounded-md p-2 text-neutral-400 hover:bg-red-50 hover:text-red-600"
              aria-label="Remove row"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setItems((cur) => [...cur, Object.fromEntries(columns.map((c) => [c.key, ""]))])}
        >
          <Plus size={14} /> Add row
        </Button>
        <Button loading={saving} onClick={save}>
          Save changes
        </Button>
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

const TABS = [
  { id: "business", label: "Business" },
  { id: "homepage", label: "Homepage" },
  { id: "navigation", label: "Navigation & Hours" },
] as const;

export default function Settings() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("business");

  return (
    <div>
      <PageHeader title="Site Settings" subtitle="Business info, homepage copy, navigation, and opening hours" />

      <div className="mb-5 inline-flex rounded-lg border border-neutral-200 bg-white p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-md px-4 py-1.5 text-[13px] font-medium transition ${
              tab === t.id ? "bg-[#b8956e] text-white shadow-sm" : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="space-y-5">
        {tab === "business" && (
          <ObjectEditor
            settingKey="business"
            title="Business Information"
            subtitle="Used across the header, footer, contact and booking pages"
            icon={Building2}
            defaults={businessDefault}
            fields={[
              { key: "name", label: "Business name" },
              { key: "tagline", label: "Tagline" },
              { key: "subTagline", label: "Secondary tagline", full: true },
              { key: "locationTag", label: "Location tag" },
              { key: "since", label: "Established" },
              { key: "phone", label: "Phone (display)" },
              { key: "phoneHref", label: "Phone (link)", hint: "e.g. tel:+19176578170" },
              { key: "email", label: "Email" },
              { key: "addressShort", label: "Short address" },
              { key: "address", label: "Full address", full: true },
              { key: "googleRating", label: "Google rating", kind: "number" },
              { key: "reviewCount", label: "Review count", kind: "number" },
              { key: "instagramHandle", label: "Instagram handle" },
              { key: "instagramUrl", label: "Instagram URL" },
              { key: "mapsUrl", label: "Google Maps URL", full: true },
              { key: "bookingConfirmNote", label: "Booking confirmation note", kind: "textarea" },
              { key: "depositNote", label: "Deposit note", kind: "textarea" },
            ]}
          />
        )}

        {tab === "homepage" && (
          <>
            <ObjectEditor
              settingKey="hero"
              title="Homepage Hero"
              subtitle="The headline section at the top of the home page"
              icon={Home}
              defaults={heroDefault}
              fields={[
                { key: "eyebrow", label: "Eyebrow (small label)", full: true },
                { key: "titleLine1", label: "Title line 1" },
                { key: "titleAccent", label: "Accent word" },
                { key: "titleLine2", label: "Title line 2" },
                { key: "subtitle", label: "Subtitle", kind: "textarea" },
              ]}
            />
            <ObjectEditor
              settingKey="about"
              title="About Section"
              subtitle="The story block shown on the homepage and about page"
              icon={Info}
              defaults={aboutDefault}
              fields={[
                { key: "heading", label: "Heading", full: true },
                { key: "pullQuote", label: "Pull quote", kind: "textarea" },
                { key: "paragraphs", label: "Paragraphs", kind: "lines", hint: "One paragraph per line" },
              ]}
            />
          </>
        )}

        {tab === "navigation" && (
          <>
            <ListEditor
              settingKey="nav"
              title="Navigation Menu"
              subtitle="Links shown in the header and mobile menu"
              icon={MenuIcon}
              defaults={navDefault as unknown as Record<string, string>[]}
              columns={[
                { key: "label", label: "Label", placeholder: "About" },
                { key: "href", label: "Link", placeholder: "/about" },
              ]}
            />
            <ListEditor
              settingKey="hours"
              title="Opening Hours"
              subtitle="Displayed on the contact and booking pages"
              icon={Clock}
              defaults={hoursDefault as unknown as Record<string, string>[]}
              columns={[
                { key: "day", label: "Day(s)", placeholder: "Monday to Sunday" },
                { key: "hours", label: "Hours", placeholder: "10AM to 6PM" },
              ]}
            />
          </>
        )}
      </div>
    </div>
  );
}
