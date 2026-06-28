import { useEffect, useState } from "react";
import { supabase } from "./adminClient";
import { Button, Field, Input, Textarea, PageTitle, cls } from "./ui";

const GROUPS: { key: string; label: string; hint?: string }[] = [
  { key: "business", label: "Business Info", hint: "Name, phone, email, address, social — used across the header, footer, and contact page" },
  { key: "hero", label: "Homepage Hero" },
  { key: "about", label: "About Section" },
  { key: "hours", label: "Opening Hours" },
  { key: "nav", label: "Navigation Menu" },
  { key: "seo", label: "SEO / Meta" },
];

function isComplex(v: unknown) {
  return v !== null && typeof v === "object";
}

function GroupEditor({ settingKey, label, hint }: { settingKey: string; label: string; hint?: string }) {
  const [value, setValue] = useState<unknown>(null);
  const [arrayText, setArrayText] = useState("");
  const [fields, setFields] = useState<Record<string, string>>({});
  const [complexKeys, setComplexKeys] = useState<Record<string, boolean>>({});
  const [origNumberKeys, setOrigNumberKeys] = useState<Record<string, boolean>>({});
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("");

  const load = async () => {
    const { data } = await supabase.from("site_settings").select("value").eq("key", settingKey).maybeSingle();
    const val = data?.value ?? null;
    setValue(val);
    if (Array.isArray(val)) {
      setArrayText(JSON.stringify(val, null, 2));
    } else if (val && typeof val === "object") {
      const f: Record<string, string> = {};
      const ck: Record<string, boolean> = {};
      const nk: Record<string, boolean> = {};
      for (const [k, v] of Object.entries(val as Record<string, unknown>)) {
        if (isComplex(v)) {
          f[k] = JSON.stringify(v, null, 2);
          ck[k] = true;
        } else {
          f[k] = v === null || v === undefined ? "" : String(v);
          if (typeof v === "number") nk[k] = true;
        }
      }
      setFields(f);
      setComplexKeys(ck);
      setOrigNumberKeys(nk);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settingKey]);

  const save = async () => {
    setStatus("Saving…");
    let payload: unknown;
    if (Array.isArray(value)) {
      try {
        payload = JSON.parse(arrayText);
      } catch {
        setStatus("Invalid JSON");
        return;
      }
    } else {
      const obj: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(fields)) {
        if (complexKeys[k]) {
          try {
            obj[k] = JSON.parse(v);
          } catch {
            setStatus(`Invalid JSON in "${k}"`);
            return;
          }
        } else if (origNumberKeys[k]) {
          obj[k] = v === "" ? null : Number(v);
        } else {
          obj[k] = v;
        }
      }
      payload = obj;
    }

    const { error } = await supabase.from("site_settings").upsert({ key: settingKey, value: payload, updated_at: new Date().toISOString() });
    setStatus(error ? error.message : "Saved ✓");
    setTimeout(() => setStatus(""), 2500);
  };

  return (
    <div className={`${cls.card}`}>
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between px-5 py-4 text-left">
        <span>
          <span className="font-medium text-neutral-900">{label}</span>
          {hint && <span className="ml-2 hidden text-xs text-neutral-400 sm:inline">{hint}</span>}
        </span>
        <span className="text-neutral-400">{open ? "–" : "+"}</span>
      </button>

      {open && (
        <div className="space-y-4 border-t border-neutral-100 p-5">
          {Array.isArray(value) ? (
            <Field label={`${label} (JSON list)`}>
              <Textarea rows={8} value={arrayText} onChange={(e) => setArrayText(e.target.value)} />
            </Field>
          ) : (
            Object.keys(fields).map((k) => (
              <Field key={k} label={k}>
                {complexKeys[k] ? (
                  <Textarea rows={4} value={fields[k]} onChange={(e) => setFields((s) => ({ ...s, [k]: e.target.value }))} />
                ) : String(fields[k]).length > 60 ? (
                  <Textarea rows={2} value={fields[k]} onChange={(e) => setFields((s) => ({ ...s, [k]: e.target.value }))} />
                ) : (
                  <Input value={fields[k]} onChange={(e) => setFields((s) => ({ ...s, [k]: e.target.value }))} />
                )}
              </Field>
            ))
          )}
          <div className="flex items-center gap-3">
            <Button onClick={save}>Save</Button>
            {status && <span className="text-sm text-neutral-500">{status}</span>}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Settings() {
  return (
    <div>
      <PageTitle title="Site Settings" subtitle="Business info, header/footer, hours, navigation, and SEO" />
      <div className="space-y-3">
        {GROUPS.map((g) => (
          <GroupEditor key={g.key} settingKey={g.key} label={g.label} hint={g.hint} />
        ))}
      </div>
    </div>
  );
}
