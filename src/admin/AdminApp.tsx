import { useEffect, useState } from "react";
import { Routes, Route, NavLink, useNavigate } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import {
  CalendarDays,
  Image,
  LayoutDashboard,
  LogOut,
  Mail,
  MessageSquareQuote,
  Scissors,
  Settings as SettingsIcon,
  Users,
  HelpCircle,
  ExternalLink,
} from "lucide-react";
import { supabase } from "./adminClient";
import { isBookingConfigured } from "../lib/supabase";
import { Button, Field, Input, cls } from "./ui";
import Dashboard from "./Dashboard";
import Bookings from "./Bookings";
import ContactSubmissions from "./ContactSubmissions";
import Collections, { type CollectionKind } from "./Collections";
import Settings from "./Settings";

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/bookings", label: "Bookings", icon: CalendarDays },
  { to: "/admin/contact", label: "Contact", icon: Mail },
  { to: "/admin/services", label: "Services", icon: Scissors },
  { to: "/admin/gallery", label: "Gallery", icon: Image },
  { to: "/admin/team", label: "Team", icon: Users },
  { to: "/admin/reviews", label: "Reviews", icon: MessageSquareQuote },
  { to: "/admin/faqs", label: "FAQs", icon: HelpCircle },
  { to: "/admin/settings", label: "Settings", icon: SettingsIcon },
];

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
    <div className="flex min-h-screen items-center justify-center bg-neutral-100 px-4">
      <form onSubmit={submit} className={`${cls.card} w-full max-w-sm p-8`}>
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#b8956e]">Albert K Studio</p>
        <h1 className="mb-6 font-serif text-2xl text-neutral-900">Admin Sign In</h1>
        <div className="space-y-4">
          <Field label="Email">
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="username" />
          </Field>
          <Field label="Password">
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
          </Field>
        </div>
        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
        <Button type="submit" disabled={loading} className="mt-6 w-full">
          {loading ? "Signing in…" : "Sign In"}
        </Button>
      </form>
    </div>
  );
}

function AdminLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-60 flex-col border-r border-neutral-200 bg-white lg:flex">
        <div className="border-b border-neutral-200 px-6 py-5">
          <p className="font-serif text-lg">Albert K Studio</p>
          <p className="text-xs text-neutral-400">Admin Panel</p>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                  isActive ? "bg-[#b8956e]/10 font-medium text-[#a6845d]" : "text-neutral-600 hover:bg-neutral-100"
                }`
              }
            >
              <item.icon size={17} strokeWidth={1.7} />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="space-y-1 border-t border-neutral-200 p-3">
          <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-100">
            <ExternalLink size={17} strokeWidth={1.7} /> View site
          </a>
          <button onClick={signOut} className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-100">
            <LogOut size={17} strokeWidth={1.7} /> Sign out
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-10 flex items-center gap-3 overflow-x-auto border-b border-neutral-200 bg-white px-3 py-2 lg:hidden">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `whitespace-nowrap rounded-md px-3 py-1.5 text-sm ${isActive ? "bg-[#b8956e]/10 text-[#a6845d]" : "text-neutral-600"}`
            }
          >
            {item.label}
          </NavLink>
        ))}
        <button onClick={signOut} className="ml-auto whitespace-nowrap rounded-md px-3 py-1.5 text-sm text-neutral-500">
          Sign out
        </button>
      </div>

      <main className="lg:pl-60">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-8">{children}</div>
      </main>
    </div>
  );
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
      <div className="flex min-h-screen items-center justify-center bg-neutral-100 px-6 text-center text-neutral-600">
        Admin is unavailable — the backend isn't configured.
      </div>
    );
  }

  if (session === undefined) {
    return <div className="flex min-h-screen items-center justify-center bg-neutral-100 text-neutral-400">Loading…</div>;
  }

  if (!session) return <Login />;

  const collection = (kind: CollectionKind) => <Collections kind={kind} />;

  return (
    <AdminLayout>
      <Routes>
        <Route index element={<Dashboard />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="contact" element={<ContactSubmissions />} />
        <Route path="services" element={collection("services")} />
        <Route path="gallery" element={collection("gallery")} />
        <Route path="team" element={collection("team")} />
        <Route path="reviews" element={collection("reviews")} />
        <Route path="faqs" element={collection("faqs")} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<Dashboard />} />
      </Routes>
    </AdminLayout>
  );
}
