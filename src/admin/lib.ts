import { supabase } from "./adminClient";

/* ------------------------------------------------------------------ */
/* Formatting helpers                                                   */
/* ------------------------------------------------------------------ */

const TZ = "America/New_York";

export function fmtDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    timeZone: TZ,
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    timeZone: TZ,
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function currency(cents: number): string {
  return `$${(cents / 100).toFixed(0)}`;
}

export function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  const secs = Math.round((Date.now() - then) / 1000);
  if (secs < 60) return "just now";
  const mins = Math.round(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return fmtDate(iso);
}

export function initials(name: string): string {
  return name
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? "")
    .join("");
}

/* ------------------------------------------------------------------ */
/* Roles & permissions                                                 */
/* ------------------------------------------------------------------ */

export type Role = "owner" | "admin" | "editor";

export type Capability =
  | "dashboard"
  | "content"
  | "media"
  | "bookings"
  | "messages"
  | "users"
  | "settings"
  | "activity";

const MATRIX: Record<Role, Capability[]> = {
  owner: ["dashboard", "content", "media", "bookings", "messages", "users", "settings", "activity"],
  admin: ["dashboard", "content", "media", "bookings", "messages", "settings", "activity"],
  editor: ["dashboard", "content", "media"],
};

export function can(role: Role, cap: Capability): boolean {
  return MATRIX[role]?.includes(cap) ?? false;
}

export const ROLE_LABEL: Record<Role, string> = {
  owner: "Owner",
  admin: "Administrator",
  editor: "Editor",
};

export const ROLE_DESC: Record<Role, string> = {
  owner: "Full access including users, settings and the activity log.",
  admin: "Manage content, bookings, messages and settings.",
  editor: "Create and edit content and media only.",
};

/* ------------------------------------------------------------------ */
/* Activity log                                                        */
/* ------------------------------------------------------------------ */

export type LogEntry = {
  action: string;
  entity: string;
  label?: string;
  meta?: Record<string, unknown>;
};

/** Append an entry to the audit trail. No-op (silent) if the table is absent. */
export async function logActivity(entry: LogEntry): Promise<void> {
  try {
    const { data } = await supabase.auth.getUser();
    await supabase.from("activity_logs").insert({
      actor_id: data.user?.id ?? null,
      actor_email: data.user?.email ?? null,
      action: entry.action,
      entity: entry.entity,
      label: entry.label ?? null,
      meta: entry.meta ?? null,
    });
  } catch {
    /* table may not exist yet — ignore */
  }
}
