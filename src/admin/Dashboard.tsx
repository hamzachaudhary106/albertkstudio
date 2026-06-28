import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  CalendarPlus,
  Check,
  Clock,
  FolderOpen,
  Image as ImageIcon,
  Inbox,
  Mail,
  MessageSquareQuote,
  Plus,
  Scissors,
  SlidersHorizontal,
  Sparkles,
  Star,
} from "lucide-react";
import { supabase } from "./adminClient";
import { Badge, Button, Card, EmptyState, SectionTitle, StatCard } from "./ui";
import { useAdmin } from "./store";
import { fmtDateTime, timeAgo } from "./lib";

type Widget = "quickActions" | "upcoming" | "messages" | "content" | "activity";
const ALL_WIDGETS: { key: Widget; label: string }[] = [
  { key: "quickActions", label: "Quick actions" },
  { key: "upcoming", label: "Upcoming appointments" },
  { key: "messages", label: "Recent messages" },
  { key: "activity", label: "Recent activity" },
  { key: "content", label: "Content overview" },
];
const DEFAULT_WIDGETS: Widget[] = ["quickActions", "upcoming", "messages", "activity", "content"];

function useWidgets() {
  const [widgets, setWidgets] = useState<Widget[]>(() => {
    try {
      const raw = localStorage.getItem("ak.dash.widgets");
      if (raw) return JSON.parse(raw) as Widget[];
    } catch {
      /* ignore */
    }
    return DEFAULT_WIDGETS;
  });
  useEffect(() => {
    localStorage.setItem("ak.dash.widgets", JSON.stringify(widgets));
  }, [widgets]);
  const toggle = (w: Widget) =>
    setWidgets((cur) => (cur.includes(w) ? cur.filter((x) => x !== w) : [...DEFAULT_WIDGETS.filter((d) => cur.includes(d) || d === w)]));
  return { widgets, toggle, has: (w: Widget) => widgets.includes(w) };
}

type Row = Record<string, unknown>;

export default function Dashboard() {
  const { profile, can } = useAdmin();
  const { toggle, has } = useWidgets();
  const [customizing, setCustomizing] = useState(false);
  const [stats, setStats] = useState({ confirmed: 0, pending: 0, messages: 0, services: 0 });
  const [upcoming, setUpcoming] = useState<Row[]>([]);
  const [messages, setMessages] = useState<Row[]>([]);
  const [activity, setActivity] = useState<Row[]>([]);
  const [counts, setCounts] = useState({ services: 0, gallery: 0, team: 0, reviews: 0, faqs: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const head = { count: "exact" as const, head: true };

      const [confirmed, pending, newMsgs, svc, gal, team, rev, faq, up, msgs] = await Promise.all([
        supabase.from("appointments").select("*", head).eq("status", "confirmed").gte("starts_at", todayStart.toISOString()),
        supabase.from("appointments").select("*", head).eq("status", "pending"),
        supabase.from("contact_submissions").select("*", head).eq("status", "new"),
        supabase.from("services").select("*", head).eq("active", true),
        supabase.from("gallery_items").select("*", head).eq("active", true),
        supabase.from("team_members").select("*", head).eq("active", true),
        supabase.from("reviews").select("*", head).eq("active", true),
        supabase.from("faqs").select("*", head).eq("active", true),
        supabase
          .from("appointments")
          .select("id,starts_at,customer_name,status,services(title)")
          .in("status", ["pending", "confirmed"])
          .gte("starts_at", todayStart.toISOString())
          .order("starts_at")
          .limit(6),
        supabase
          .from("contact_submissions")
          .select("id,name,topic,created_at,status")
          .order("created_at", { ascending: false })
          .limit(6),
      ]);

      setStats({ confirmed: confirmed.count ?? 0, pending: pending.count ?? 0, messages: newMsgs.count ?? 0, services: svc.count ?? 0 });
      setCounts({
        services: svc.count ?? 0,
        gallery: gal.count ?? 0,
        team: team.count ?? 0,
        reviews: rev.count ?? 0,
        faqs: faq.count ?? 0,
      });
      setUpcoming(up.data ?? []);
      setMessages(msgs.data ?? []);

      try {
        const { data } = await supabase
          .from("activity_logs")
          .select("id,actor_email,action,entity,label,created_at")
          .order("created_at", { ascending: false })
          .limit(6);
        setActivity(data ?? []);
      } catch {
        setActivity([]);
      }
      setLoading(false);
    })();
  }, []);

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
  }, []);
  const firstName = profile.fullName.split(/[\s@]/)[0];

  const contentCounts = [
    { label: "Services", value: counts.services, icon: Scissors, to: "/admin/services" },
    { label: "Gallery", value: counts.gallery, icon: ImageIcon, to: "/admin/gallery" },
    { label: "Reviews", value: counts.reviews, icon: Star, to: "/admin/reviews" },
    { label: "FAQs", value: counts.faqs, icon: MessageSquareQuote, to: "/admin/faqs" },
  ];

  const quickActions = [
    { label: "Add service", icon: Scissors, to: "/admin/services" },
    { label: "Upload media", icon: FolderOpen, to: "/admin/media" },
    { label: "Add gallery image", icon: ImageIcon, to: "/admin/gallery" },
    { label: "Add review", icon: Star, to: "/admin/reviews" },
  ];

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-[1.75rem] leading-tight text-neutral-900">
            {greeting}, {firstName}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })} · Here's what's
            happening at the studio.
          </p>
        </div>
        <div className="relative">
          <Button variant="secondary" size="sm" onClick={() => setCustomizing((c) => !c)}>
            <SlidersHorizontal size={15} /> Customize
          </Button>
          {customizing && (
            <div className="absolute right-0 z-30 mt-2 w-60 rounded-xl border border-neutral-200 bg-white p-1.5 shadow-xl">
              <p className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-neutral-400">
                Show widgets
              </p>
              {ALL_WIDGETS.map((w) => (
                <button
                  key={w.key}
                  onClick={() => toggle(w.key)}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                >
                  {w.label}
                  <span
                    className={`flex h-4 w-4 items-center justify-center rounded border ${
                      has(w.key) ? "border-[#2271b1] bg-[#2271b1] text-white" : "border-neutral-300"
                    }`}
                  >
                    {has(w.key) && <Check size={12} />}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Confirmed (upcoming)" value={stats.confirmed} icon={<CalendarDays size={18} />} tone="green" to={can("bookings") ? "/admin/bookings" : undefined} />
        <StatCard label="Pending bookings" value={stats.pending} icon={<Clock size={18} />} tone="amber" to={can("bookings") ? "/admin/bookings" : undefined} />
        <StatCard label="New messages" value={stats.messages} icon={<Mail size={18} />} tone="gold" to={can("messages") ? "/admin/contact" : undefined} />
        <StatCard label="Active services" value={stats.services} icon={<Scissors size={18} />} tone="blue" to="/admin/services" />
      </div>

      {/* Quick actions */}
      {has("quickActions") && (
        <div className="mt-6">
          <SectionTitle>Quick actions</SectionTitle>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {quickActions.map((a) => (
              <Link
                key={a.label}
                to={a.to}
                className="group flex items-center gap-3 rounded-xl border border-neutral-200/80 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[#2271b1]/50 hover:shadow-md"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2271b1]/10 text-[#135e96]">
                  <a.icon size={18} />
                </span>
                <span className="text-sm font-medium text-neutral-800">{a.label}</span>
                <Plus size={15} className="ml-auto text-neutral-300 transition group-hover:text-[#2271b1]" />
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Upcoming */}
        {has("upcoming") && (
          <Card className="p-5">
            <SectionTitle action={<Link to="/admin/bookings" className="text-xs font-medium text-[#135e96] hover:underline">View all</Link>}>
              Upcoming appointments
            </SectionTitle>
            {loading ? (
              <p className="py-6 text-sm text-neutral-400">Loading…</p>
            ) : upcoming.length === 0 ? (
              <EmptyState icon={<CalendarPlus size={20} />} title="No upcoming bookings" description="Confirmed and pending appointments will appear here." />
            ) : (
              <ul className="divide-y divide-neutral-100">
                {upcoming.map((a) => (
                  <li key={String(a.id)} className="flex items-center justify-between gap-3 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-neutral-900">{String(a.customer_name)}</p>
                      <p className="truncate text-xs text-neutral-400">
                        {(a.services as { title?: string } | null)?.title ?? "—"}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <span className="text-xs text-neutral-500">{fmtDateTime(String(a.starts_at))}</span>
                      <Badge tone={a.status === "confirmed" ? "green" : "amber"}>{String(a.status)}</Badge>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        )}

        {/* Messages */}
        {has("messages") && (
          <Card className="p-5">
            <SectionTitle action={<Link to="/admin/contact" className="text-xs font-medium text-[#135e96] hover:underline">View all</Link>}>
              Recent messages
            </SectionTitle>
            {loading ? (
              <p className="py-6 text-sm text-neutral-400">Loading…</p>
            ) : messages.length === 0 ? (
              <EmptyState icon={<Inbox size={20} />} title="No messages yet" description="Contact form submissions will land here." />
            ) : (
              <ul className="divide-y divide-neutral-100">
                {messages.map((m) => (
                  <li key={String(m.id)} className="flex items-center justify-between gap-3 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-neutral-900">{String(m.name)}</p>
                      <p className="truncate text-xs text-neutral-400">{String(m.topic ?? "General")}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      {String(m.status) === "new" && <Badge tone="gold">new</Badge>}
                      <span className="text-xs text-neutral-400">{timeAgo(String(m.created_at))}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        )}

        {/* Activity */}
        {has("activity") && (
          <Card className="p-5">
            <SectionTitle action={can("activity") ? <Link to="/admin/activity" className="text-xs font-medium text-[#135e96] hover:underline">View all</Link> : undefined}>
              Recent activity
            </SectionTitle>
            {activity.length === 0 ? (
              <EmptyState icon={<Sparkles size={20} />} title="No activity yet" description="Edits you make across the CMS will be logged here." />
            ) : (
              <ul className="space-y-3">
                {activity.map((a) => (
                  <li key={String(a.id)} className="flex items-start gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2271b1]" />
                    <p className="text-sm text-neutral-600">
                      <span className="font-medium text-neutral-800">{String(a.actor_email ?? "Someone")}</span>{" "}
                      {String(a.action)} {String(a.entity)}
                      {a.label ? <span className="text-neutral-500"> · {String(a.label)}</span> : ""}
                      <span className="block text-xs text-neutral-400">{timeAgo(String(a.created_at))}</span>
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        )}

        {/* Content overview */}
        {has("content") && (
          <Card className="p-5">
            <SectionTitle>Content overview</SectionTitle>
            <div className="grid grid-cols-2 gap-3">
              {contentCounts.map((c) => (
                <Link
                  key={c.label}
                  to={c.to}
                  className="group flex items-center gap-3 rounded-lg border border-neutral-200/70 p-3 transition hover:border-[#2271b1]/50 hover:bg-neutral-50"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100 text-neutral-500 group-hover:bg-[#2271b1]/10 group-hover:text-[#135e96]">
                    <c.icon size={16} />
                  </span>
                  <div>
                    <p className="text-lg font-semibold leading-none text-neutral-900">{c.value}</p>
                    <p className="text-xs text-neutral-400">{c.label}</p>
                  </div>
                  <ArrowRight size={15} className="ml-auto text-neutral-300 transition group-hover:text-[#2271b1]" />
                </Link>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
