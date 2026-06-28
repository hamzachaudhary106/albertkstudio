import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { supabase } from "./adminClient";
import { can, type Capability, type Role } from "./lib";

/* ------------------------------------------------------------------ */
/* Toasts                                                              */
/* ------------------------------------------------------------------ */

type ToastKind = "success" | "error" | "info";
type Toast = { id: number; message: string; kind: ToastKind };

type ToastCtx = {
  notify: (message: string, kind?: ToastKind) => void;
};

const ToastContext = createContext<ToastCtx>({ notify: () => {} });
export const useToast = () => useContext(ToastContext);

const TOAST_ICON = { success: CheckCircle2, error: AlertCircle, info: Info };
const TOAST_TONE = {
  success: "border-emerald-200 bg-white text-emerald-700",
  error: "border-red-200 bg-white text-red-700",
  info: "border-neutral-200 bg-white text-neutral-700",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const seq = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const notify = useCallback(
    (message: string, kind: ToastKind = "success") => {
      const id = ++seq.current;
      setToasts((t) => [...t, { id, message, kind }]);
      setTimeout(() => dismiss(id), 4000);
    },
    [dismiss],
  );

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-5 right-5 z-[100] flex w-full max-w-sm flex-col gap-2">
        {toasts.map((t) => {
          const Icon = TOAST_ICON[t.kind];
          return (
            <div
              key={t.id}
              role="status"
              className={`pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg shadow-black/5 ${TOAST_TONE[t.kind]}`}
            >
              <Icon size={18} className="mt-0.5 shrink-0" />
              <p className="flex-1 text-sm text-neutral-800">{t.message}</p>
              <button onClick={() => dismiss(t.id)} className="text-neutral-400 hover:text-neutral-700">
                <X size={15} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/* Current admin user + role                                           */
/* ------------------------------------------------------------------ */

export type AdminProfile = {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  avatarUrl: string | null;
};

type AdminCtx = {
  user: User;
  profile: AdminProfile;
  can: (cap: Capability) => boolean;
  refresh: () => void;
};

const AdminContext = createContext<AdminCtx | null>(null);

export function useAdmin(): AdminCtx {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminUserProvider");
  return ctx;
}

export function AdminUserProvider({ user, children }: { user: User; children: ReactNode }) {
  const [profile, setProfile] = useState<AdminProfile>(() => ({
    id: user.id,
    email: user.email ?? "",
    fullName: (user.user_metadata?.full_name as string) ?? user.email ?? "Admin",
    // Default to owner so a single-admin install retains full access even
    // before the admin_users table is provisioned.
    role: "owner",
    avatarUrl: (user.user_metadata?.avatar_url as string) ?? null,
  }));

  const load = useCallback(async () => {
    try {
      const { data } = await supabase
        .from("admin_users")
        .select("email,full_name,role,avatar_url")
        .eq("id", user.id)
        .maybeSingle();
      if (data) {
        setProfile({
          id: user.id,
          email: data.email ?? user.email ?? "",
          fullName: data.full_name ?? user.email ?? "Admin",
          role: (data.role as Role) ?? "owner",
          avatarUrl: data.avatar_url ?? null,
        });
      }
    } catch {
      /* admin_users table not present yet — keep owner default */
    }
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  const value = useMemo<AdminCtx>(
    () => ({
      user,
      profile,
      can: (cap: Capability) => can(profile.role, cap),
      refresh: load,
    }),
    [user, profile, load],
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}
