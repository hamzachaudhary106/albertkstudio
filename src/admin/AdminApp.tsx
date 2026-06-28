import { useEffect, useMemo, useRef, useState } from "react";
import { Routes, Route, NavLink, useNavigate, useLocation, Link } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import type { LucideIcon } from "lucide-react";
import {
  Activity as ActivityIcon,
  Bell,
  CalendarDays,
  ChevronsLeft,
  ExternalLink,
  FolderOpen,
  HelpCircle,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  MessageSquareQuote,
  Scissors,
  Search,
  ShieldCheck,
  Sliders,
  Users as UsersIcon,
  X,
} from "lucide-react";
import { supabase } from "./adminClient";
import { isBookingConfigured } from "../lib/supabase";
import { Button, Field, Input, IconButton } from "./ui";
import { AdminUserProvider, ToastProvider, useAdmin } from "./store";
import { initials, timeAgo, ROLE_LABEL, type Capability } from "./lib";
import Dashboard from "./Dashboard";
import Bookings from "./Bookings";
import ContactSubmissions from "./ContactSubmissions";
import Collections, { type CollectionKind } from "./Collections";
import Settings from "./Settings";
import MediaLibrary from "./MediaLibrary";
import Users from "./Users";
import ActivityLog from "./ActivityLog";

type NavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
  cap: Capability;
  end?: boolean;
  badge?: "bookings" | "messages";
};
type NavGroup = { title?: string; items: NavItem[] };

const NAV: NavGroup[] = [
  { items: [{ to: "/admin", label: "Dashboard", icon: LayoutDashboard, cap: "dashboard", end: true }] },
  {
    title: "Content",
    items: [
      { to: "/admin/services", label: "Services", icon: Scissors, cap: "content" },
      { to: "/admin/gallery", label: "Gallery", icon: ImageIcon, cap: "content" },
      { to: "/admin/team", label: "Team", icon: UsersIcon, cap: "content" },
      { to: "/admin/reviews", label: "Reviews", icon: MessageSquareQuote, cap: "content" },
      { to: "/admin/faqs", label: "FAQs", icon: HelpCircle, cap: "content" },
      { to: "/admin/media", label: "Media Library", icon: FolderOpen, cap: "media" },
    ],
  },
  {
    title: "Engagement",
    items: [
      { to: "/admin/bookings", label: "Bookings", icon: CalendarDays, cap: "bookings", badge: "bookings" },
      { to: "/admin/contact", label: "Messages", icon: Mail, cap: "messages", badge: "messages" },
    ],
  },
  {
    title: "Administration",
    items: [
      { to: "/admin/settings", label: "Site Settings", icon: Sliders, cap: "settings" },
      { to: "/admin/users", label: "Users & Roles", icon: ShieldCheck, cap: "users" },
      { to: "/admin/activity", label: "Activity Log", icon: ActivityIcon, cap: "activity" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Notifications                                                       */
/* ------------------------------------------------------------------ */

type Notif = { id: string; kind: "booking" | "message"; title: string; sub: string; at: string; to: string };

function useNotifications() {
  const [pendingBookings, setPendingBookings] = useState(0);
  const [newMessages, setNewMessages] = useState(0);
  const [items, setItems] = useState<Notif[]>([]);

  const load = async () => {
    try {
      const [pb, nm, recentB, recentM] = await Promise.all([
        supabase.from("appointments").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("contact_submissions").select("*", { count: "exact", head: true }).eq("status", "new"),
        supabase
          .from("appointments")
          .select("id,customer_name,starts_at,status,created_at")
          .eq("status", "pending")
          .order("created_at", { ascending: false })
          .limit(5),
        supabase
          .from("contact_submissions")
          .select("id,name,topic,created_at")
          .eq("status", "new")
          .order("created_at", { ascending: false })
          .limit(5),
      ]);
      setPendingBookings(pb.count ?? 0);
      setNewMessages(nm.count ?? 0);
      const b: Notif[] = (recentB.data ?? []).map((r) => ({
        id: `b-${r.id}`,
        kind: "booking",
        title: `New booking · ${r.customer_name}`,
        sub: "Awaiting confirmation",
        at: String(r.created_at),
        to: "/admin/bookings",
      }));
      const m: Notif[] = (recentM.data ?? []).map((r) => ({
        id: `m-${r.id}`,
        kind: "message",
        title: `New message · ${r.name}`,
        sub: String(r.topic ?? "Contact form"),
        at: String(r.created_at),
        to: "/admin/contact",
      }));
      setItems([...b, ...m].sort((x, y) => +new Date(y.at) - +new Date(x.at)).slice(0, 8));
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 60000);
    return () => clearInterval(t);
  }, []);

  return { pendingBookings, newMessages, items, reload: load };
}

/* ------------------------------------------------------------------ */
/* Login                                                               */
/* ------------------------------------------------------------------ */

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    setLoading(false);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#1d2327] px-4">
      <div
        className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[40rem] -translate-x-1/2 rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(34,113,177,0.4), transparent 70%)" }}
      />
      <form onSubmit={submit} className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl">
        <div className="mb-7 text-center">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#72aee6]">Albert K Studio</p>
          <h1 className="font-serif text-2xl text-white">Welcome back</h1>
          <p className="mt-1 text-sm text-white/50">Sign in to manage your studio</p>
        </div>
        <div className="space-y-4">
          <Field label="">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
              placeholder="Email"
              className="border-white/15 bg-white/5 text-white placeholder:text-white/40 focus:border-[#72aee6] focus:ring-[#72aee6]/20"
            />
          </Field>
          <Field label="">
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="Password"
              className="border-white/15 bg-white/5 text-white placeholder:text-white/40 focus:border-[#72aee6] focus:ring-[#72aee6]/20"
            />
          </Field>
        </div>
        {error && <p className="mt-4 text-sm text-red-300">{error}</p>}
        <Button type="submit" loading={loading} className="mt-6 w-full">
          {loading ? "Signing in…" : "Sign In"}
        </Button>
      </form>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sidebar                                                             */
/* ------------------------------------------------------------------ */

function Sidebar({
  collapsed,
  badges,
  onNavigate,
}: {
  collapsed: boolean;
  badges: { bookings: number; messages: number };
  onNavigate?: () => void;
}) {
  const { can } = useAdmin();

  return (
    <div className="flex h-full flex-col bg-[#1d2327] text-neutral-300">
      <div className={`flex items-center gap-2.5 border-b border-white/[0.06] px-5 ${collapsed ? "justify-center px-0" : ""}`} style={{ height: 64 }}>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#72aee6] to-[#2271b1] font-serif text-base font-semibold text-[#1d2327]">
          A
        </span>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate font-serif text-[15px] leading-tight text-white">Albert K Studio</p>
            <p className="text-[11px] text-white/40">Content Manager</p>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-5">
        {NAV.map((group, gi) => {
          const items = group.items.filter((it) => can(it.cap));
          if (!items.length) return null;
          return (
            <div key={gi}>
              {group.title && !collapsed && (
                <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">
                  {group.title}
                </p>
              )}
              <div className="space-y-0.5">
                {items.map((item) => {
                  const count = item.badge ? badges[item.badge] : 0;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.end}
                      onClick={onNavigate}
                      title={collapsed ? item.label : undefined}
                      className={({ isActive }) =>
                        `group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                          collapsed ? "justify-center" : ""
                        } ${
                          isActive
                            ? "bg-[#2271b1] text-white"
                            : "text-[#a7aaad] hover:bg-[#2c3338] hover:text-[#72aee6]"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <item.icon size={18} strokeWidth={1.8} className="shrink-0" />
                          {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
                          {count > 0 &&
                            (collapsed ? (
                              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[#72aee6]" />
                            ) : (
                              <span
                                className={`ml-auto rounded-full px-2 py-0.5 text-[11px] font-medium ${
                                  isActive ? "bg-white/20 text-white" : "bg-[#2271b1] text-white"
                                }`}
                              >
                                {count}
                              </span>
                            ))}
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      <div className="border-t border-white/[0.06] p-3">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          title={collapsed ? "View site" : undefined}
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-[#a7aaad] transition hover:bg-[#2c3338] hover:text-[#72aee6] ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <ExternalLink size={18} strokeWidth={1.8} />
          {!collapsed && "View live site"}
        </a>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Top toolbar                                                         */
/* ------------------------------------------------------------------ */

function pageTitleFor(pathname: string): string {
  const flat = NAV.flatMap((g) => g.items);
  const exact = flat.find((i) => i.to === pathname);
  if (exact) return exact.label;
  const partial = flat.find((i) => i.to !== "/admin" && pathname.startsWith(i.to));
  return partial?.label ?? "Dashboard";
}

function GlobalSearch() {
  const { can } = useAdmin();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const boxRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const flat = NAV.flatMap((g) => g.items).filter((i) => can(i.cap));
    if (!q.trim()) return flat;
    return flat.filter((i) => i.label.toLowerCase().includes(q.toLowerCase()));
  }, [q, can]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={boxRef} className="relative hidden flex-1 sm:block sm:max-w-xs">
      <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
      <input
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder="Jump to…"
        className="h-9 w-full rounded-lg border border-neutral-200 bg-neutral-50 pl-9 pr-3 text-sm outline-none transition focus:border-[#2271b1] focus:bg-white focus:ring-2 focus:ring-[#2271b1]/15"
      />
      {open && results.length > 0 && (
        <div className="absolute z-30 mt-1.5 w-full overflow-hidden rounded-xl border border-neutral-200 bg-white py-1.5 shadow-xl">
          {results.slice(0, 8).map((r) => (
            <button
              key={r.to}
              onClick={() => {
                navigate(r.to);
                setOpen(false);
                setQ("");
              }}
              className="flex w-full items-center gap-3 px-3.5 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50"
            >
              <r.icon size={16} className="text-neutral-400" />
              {r.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function NotificationsBell({ notif }: { notif: ReturnType<typeof useNotifications> }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);
  const total = notif.pendingBookings + notif.newMessages;

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <IconButton label="Notifications" onClick={() => setOpen((o) => !o)} className="relative">
        <Bell size={19} />
        {total > 0 && (
          <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#2271b1] px-1 text-[10px] font-semibold text-white">
            {total > 9 ? "9+" : total}
          </span>
        )}
      </IconButton>
      {open && (
        <div className="absolute right-0 z-30 mt-2 w-80 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
            <p className="text-sm font-semibold text-neutral-900">Notifications</p>
            <span className="text-xs text-neutral-400">{total} new</span>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notif.items.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-neutral-400">You're all caught up 🎉</p>
            ) : (
              notif.items.map((n) => (
                <button
                  key={n.id}
                  onClick={() => {
                    navigate(n.to);
                    setOpen(false);
                  }}
                  className="flex w-full items-start gap-3 border-b border-neutral-50 px-4 py-3 text-left last:border-0 hover:bg-neutral-50"
                >
                  <span
                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      n.kind === "booking" ? "bg-emerald-50 text-emerald-600" : "bg-[#2271b1]/12 text-[#135e96]"
                    }`}
                  >
                    {n.kind === "booking" ? <CalendarDays size={15} /> : <Mail size={15} />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-neutral-800">{n.title}</span>
                    <span className="block text-xs text-neutral-400">
                      {n.sub} · {timeAgo(n.at)}
                    </span>
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function UserMenu() {
  const { profile } = useAdmin();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/admin");
  };

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-lg py-1 pl-1 pr-2 transition hover:bg-neutral-100"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#2271b1] to-[#2271b1] text-xs font-semibold text-white">
          {initials(profile.fullName)}
        </span>
        <span className="hidden text-left sm:block">
          <span className="block text-[13px] font-medium leading-tight text-neutral-800">{profile.fullName}</span>
          <span className="block text-[11px] leading-tight text-neutral-400">{ROLE_LABEL[profile.role]}</span>
        </span>
      </button>
      {open && (
        <div className="absolute right-0 z-30 mt-2 w-56 overflow-hidden rounded-xl border border-neutral-200 bg-white py-1.5 shadow-xl">
          <div className="border-b border-neutral-100 px-4 py-3">
            <p className="truncate text-sm font-medium text-neutral-900">{profile.fullName}</p>
            <p className="truncate text-xs text-neutral-400">{profile.email}</p>
          </div>
          <Link
            to="/admin/users"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
          >
            <ShieldCheck size={16} className="text-neutral-400" /> Account & roles
          </Link>
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2.5 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
          >
            <ExternalLink size={16} className="text-neutral-400" /> View live site
          </a>
          <button
            onClick={signOut}
            className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            <LogOut size={16} /> Sign out
          </button>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Layout                                                              */
/* ------------------------------------------------------------------ */

function AdminLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const notif = useNotifications();
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem("ak.sidebar") === "1");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("ak.sidebar", collapsed ? "1" : "0");
  }, [collapsed]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const badges = { bookings: notif.pendingBookings, messages: notif.newMessages };
  const sidebarW = collapsed ? "lg:w-[68px]" : "lg:w-64";
  const mainPad = collapsed ? "lg:pl-[68px]" : "lg:pl-64";

  return (
    <div className="min-h-screen bg-[#f0f0f1] text-neutral-900">
      {/* Desktop sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-30 hidden transition-[width] duration-200 lg:block ${sidebarW}`}>
        <Sidebar collapsed={collapsed} badges={badges} />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-neutral-900/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64">
            <Sidebar collapsed={false} badges={badges} onNavigate={() => setMobileOpen(false)} />
            <IconButton
              label="Close menu"
              onClick={() => setMobileOpen(false)}
              className="absolute right-2 top-3 text-white/70 hover:bg-white/10 hover:text-white"
            >
              <X size={20} />
            </IconButton>
          </aside>
        </div>
      )}

      <div className={`transition-[padding] duration-200 ${mainPad}`}>
        {/* Top toolbar */}
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-neutral-200 bg-white/90 px-4 backdrop-blur-md sm:px-6">
          <IconButton label="Open menu" onClick={() => setMobileOpen(true)} className="lg:hidden">
            <Menu size={20} />
          </IconButton>
          <IconButton
            label="Collapse sidebar"
            onClick={() => setCollapsed((c) => !c)}
            className="hidden lg:inline-flex"
          >
            <ChevronsLeft size={19} className={`transition-transform ${collapsed ? "rotate-180" : ""}`} />
          </IconButton>

          <h1 className="font-serif text-lg text-neutral-900 lg:hidden">{pageTitleFor(location.pathname)}</h1>

          <GlobalSearch />

          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <NotificationsBell notif={notif} />
            <span className="hidden h-6 w-px bg-neutral-200 sm:block" />
            <UserMenu />
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-7 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* App                                                                 */
/* ------------------------------------------------------------------ */

function Protected({ cap, children }: { cap: Capability; children: React.ReactNode }) {
  const { can } = useAdmin();
  if (!can(cap)) {
    return (
      <div className="rounded-xl border border-neutral-200 bg-white p-10 text-center">
        <p className="font-serif text-xl text-neutral-800">Access restricted</p>
        <p className="mt-1 text-sm text-neutral-500">Your role doesn't have permission to view this page.</p>
      </div>
    );
  }
  return <>{children}</>;
}

export default function AdminApp() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  if (!isBookingConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f0f0f1] px-6 text-center text-neutral-600">
        Admin is unavailable — the backend isn't configured.
      </div>
    );
  }

  if (session === undefined) {
    return <div className="flex min-h-screen items-center justify-center bg-[#f0f0f1] text-neutral-400">Loading…</div>;
  }

  if (!session) return <Login />;

  const collection = (kind: CollectionKind) => (
    <Protected cap="content">
      <Collections kind={kind} />
    </Protected>
  );

  return (
    <AdminUserProvider user={session.user}>
      <ToastProvider>
        <AdminLayout>
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="bookings" element={<Protected cap="bookings"><Bookings /></Protected>} />
            <Route path="contact" element={<Protected cap="messages"><ContactSubmissions /></Protected>} />
            <Route path="services" element={collection("services")} />
            <Route path="gallery" element={collection("gallery")} />
            <Route path="team" element={collection("team")} />
            <Route path="reviews" element={collection("reviews")} />
            <Route path="faqs" element={collection("faqs")} />
            <Route path="media" element={<Protected cap="media"><MediaLibrary /></Protected>} />
            <Route path="settings" element={<Protected cap="settings"><Settings /></Protected>} />
            <Route path="users" element={<Protected cap="users"><Users /></Protected>} />
            <Route path="activity" element={<Protected cap="activity"><ActivityLog /></Protected>} />
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </AdminLayout>
      </ToastProvider>
    </AdminUserProvider>
  );
}
