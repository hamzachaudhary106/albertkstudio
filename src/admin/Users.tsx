import { useEffect, useState } from "react";
import { Info, Mail, ShieldCheck, UserPlus } from "lucide-react";
import { supabase } from "./adminClient";
import { Badge, Button, Card, EmptyState, Modal, PageHeader, Select, Spinner, Toggle } from "./ui";
import { useAdmin, useToast } from "./store";
import { initials, logActivity, ROLE_DESC, ROLE_LABEL, type Role } from "./lib";

type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  role: Role;
  active: boolean;
  created_at: string;
};

const ROLES: Role[] = ["owner", "admin", "editor"];

export default function Users() {
  const { profile: me } = useAdmin();
  const { notify } = useToast();
  const [rows, setRows] = useState<Profile[] | null>(null);
  const [unavailable, setUnavailable] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);

  const load = async () => {
    try {
      const { data, error } = await supabase
        .from("admin_users")
        .select("id,email,full_name,role,active,created_at")
        .order("created_at");
      if (error) throw error;
      setRows((data as Profile[]) ?? []);
    } catch {
      setUnavailable(true);
      setRows([]);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const setRole = async (id: string, role: Role) => {
    await supabase.from("admin_users").update({ role }).eq("id", id);
    setRows((r) => (r ? r.map((x) => (x.id === id ? { ...x, role } : x)) : r));
    notify("Role updated");
    logActivity({ action: "updated", entity: "user role", label: role });
  };

  const setActive = async (id: string, active: boolean) => {
    await supabase.from("admin_users").update({ active }).eq("id", id);
    setRows((r) => (r ? r.map((x) => (x.id === id ? { ...x, active } : x)) : r));
    notify(active ? "Account enabled" : "Account disabled");
  };

  return (
    <div>
      <PageHeader
        title="Users & Roles"
        subtitle="Control who can access the CMS and what they can do"
        action={
          <Button onClick={() => setInviteOpen(true)}>
            <UserPlus size={16} /> Add teammate
          </Button>
        }
      />

      {/* Role legend */}
      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {ROLES.map((r) => (
          <Card key={r} className="p-4">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#a6845d]" />
              <p className="font-medium text-neutral-900">{ROLE_LABEL[r]}</p>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-neutral-500">{ROLE_DESC[r]}</p>
          </Card>
        ))}
      </div>

      {unavailable && (
        <Card className="mb-5 flex items-start gap-3 border-amber-200 bg-amber-50/60 p-4">
          <Info size={18} className="mt-0.5 shrink-0 text-amber-600" />
          <div className="text-sm text-amber-800">
            <p className="font-medium">Role management isn't set up yet.</p>
            <p className="mt-0.5 text-amber-700">
              Run the <code className="rounded bg-amber-100 px-1">0003_admin.sql</code> migration to enable team accounts
              and roles. Until then, every signed-in user has full access.
            </p>
          </div>
        </Card>
      )}

      {rows === null ? (
        <Spinner />
      ) : rows.length === 0 && !unavailable ? (
        <EmptyState icon={<ShieldCheck size={22} />} title="No team members yet" description="Invite a teammate to get started." />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-neutral-100 bg-neutral-50/70 text-left text-xs font-medium uppercase tracking-wide text-neutral-400">
                <tr>
                  <th className="px-4 py-3">Member</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {(unavailable ? [{ id: me.id, email: me.email, full_name: me.fullName, role: me.role, active: true, created_at: "" }] : rows).map((u) => (
                  <tr key={u.id} className="hover:bg-neutral-50/60">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#b8956e]/12 text-xs font-semibold text-[#a6845d]">
                          {initials(u.full_name || u.email || "?")}
                        </span>
                        <div>
                          <div className="flex items-center gap-2 font-medium text-neutral-900">
                            {u.full_name || "—"}
                            {u.id === me.id && <Badge tone="gold">You</Badge>}
                          </div>
                          <div className="text-xs text-neutral-400">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Select
                        value={u.role}
                        disabled={unavailable}
                        onChange={(e) => setRole(u.id, e.target.value as Role)}
                        className="h-9 w-auto"
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r}>
                            {ROLE_LABEL[r]}
                          </option>
                        ))}
                      </Select>
                    </td>
                    <td className="px-4 py-3">
                      {unavailable ? (
                        <Badge tone="green">Active</Badge>
                      ) : (
                        <Toggle checked={u.active} onChange={(v) => setActive(u.id, v)} label={u.active ? "Active" : "Disabled"} />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Modal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        title="Add a teammate"
        footer={<Button onClick={() => setInviteOpen(false)}>Got it</Button>}
      >
        <div className="space-y-4 text-sm text-neutral-600">
          <p>
            For security, new accounts are created directly in your Supabase project (public sign-up is disabled). Once
            created, the teammate appears here automatically and you can set their role.
          </p>
          <ol className="list-decimal space-y-2 pl-5">
            <li>Open your Supabase dashboard → <span className="font-medium">Authentication → Users</span>.</li>
            <li>Click <span className="font-medium">Add user</span> and enter their email and a temporary password.</li>
            <li>Share the credentials — they can sign in at <code className="rounded bg-neutral-100 px-1">/admin</code>.</li>
            <li>Return here to assign their role (Owner, Administrator, or Editor).</li>
          </ol>
          <p className="flex items-center gap-2 rounded-lg bg-neutral-50 p-3 text-neutral-500">
            <Mail size={15} /> Tip: use the studio email so notifications reach the whole team.
          </p>
        </div>
      </Modal>
    </div>
  );
}
