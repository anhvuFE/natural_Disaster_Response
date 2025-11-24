import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import type { AdminAccount, UserRole } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { Loader2, Pencil, Plus, Trash2, ShieldAlert, UserCheck, Users as UsersIcon } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/modal";
import { useI18n } from "@/lib/i18n";

// NOTE: This is a placeholder UI. Wire it to real API endpoints when available.
const seedUsers: AdminAccount[] = [
  { id: "u1", name: "Global Admin", email: "global@example.com", role: "global_admin", provinceIds: [] },
  { id: "u2", name: "Local Admin Đà Nẵng", email: "danang@example.com", role: "local_admin", provinceIds: ["danang"] },
];

export default function AdminUsersPage() {
  const { toast } = useToast();
  const { t } = useI18n();
  const [users, setUsers] = useState<AdminAccount[]>(seedUsers);
  const [editing, setEditing] = useState<AdminAccount | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<AdminAccount | null>(null);
  const [query, setQuery] = useState("");
  const counts = useMemo(
    () => ({
      total: users.length,
      global: users.filter((u) => u.role === "global_admin").length,
      local: users.filter((u) => u.role === "local_admin").length,
    }),
    [users]
  );
  const filteredUsers = useMemo(() => {
    if (!query.trim()) return users;
    const q = query.toLowerCase();
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q) ||
        u.provinceIds.some((p) => p.toLowerCase().includes(q))
    );
  }, [query, users]);

  const onSave = () => {
    if (!editing) return;
    setLoading(true);
    setTimeout(() => {
      setUsers((prev) => {
        const exists = prev.find((u) => u.id === editing.id);
        if (exists) return prev.map((u) => (u.id === editing.id ? editing : u));
        return [...prev, { ...editing, id: `u-${Date.now()}` }];
      });
      setEditing(null);
      setLoading(false);
      toast({ title: t("toast.userSaved") });
    }, 300);
  };

  const onDelete = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    toast({ title: t("toast.userDeleted") });
  };

  const initials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0]?.toUpperCase())
      .join("")
      .slice(0, 2);

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-white/60 bg-gradient-to-r from-slate-900 via-slate-800 to-purple-800 p-6 text-white shadow-lg shadow-slate-900/10">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-purple-100">{t("admin.users.badge")}</p>
        <h1 className="text-2xl font-bold leading-tight">{t("admin.users.title")}</h1>
        <p className="text-sm text-purple-50">{t("admin.users.subtitle")}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <StatPill label={t("admin.users.stats.total")} value={counts.total} icon={<UsersIcon className="h-4 w-4" />} />
          <StatPill label={t("admin.users.stats.global")} value={counts.global} icon={<ShieldAlert className="h-4 w-4" />} />
          <StatPill label={t("admin.users.stats.local")} value={counts.local} icon={<UserCheck className="h-4 w-4" />} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-white/70 bg-white/95 shadow-lg shadow-slate-900/5 lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-4 w-4 text-brand-600" />
              {editing ? t("admin.users.form.edit") : t("admin.users.form.add")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              label={t("admin.users.form.name")}
              value={editing?.name || ""}
              onChange={(e) => setEditing({ ...(editing || { id: "", provinceIds: [], role: "local_admin", email: "" }), name: e.target.value })}
            />
            <Input
              label={t("admin.users.form.email")}
              value={editing?.email || ""}
              onChange={(e) => setEditing({ ...(editing || { id: "", provinceIds: [], role: "local_admin", email: "" }), email: e.target.value })}
            />
            <Select
              label={t("admin.users.form.role")}
              value={editing?.role || "local_admin"}
              onChange={(v) => setEditing({ ...(editing || { id: "", provinceIds: [], email: "" }), role: v as UserRole })}
              options={[
                { value: "local_admin", label: t("admin.users.stats.local") },
                { value: "global_admin", label: t("admin.users.stats.global") },
              ]}
            />
            <Input
              label={t("admin.users.form.provinces")}
              value={(editing?.provinceIds || []).join(",")}
              onChange={(e) =>
                setEditing({
                  ...(editing || { id: "", provinceIds: [], role: "local_admin", email: "" }),
                  provinceIds: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                })
              }
            />
            <div className="flex gap-2">
              <Button onClick={onSave} disabled={loading} className="w-full">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t("admin.users.form.save")}
              </Button>
              {editing && (
                <Button variant="ghost" onClick={() => setEditing(null)}>
                  {t("admin.users.form.cancel")}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/70 bg-white/95 shadow-lg shadow-slate-900/5 lg:col-span-2">
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle>{t("admin.users.listTitle")}</CardTitle>
              <Input
                placeholder={t("admin.users.searchPlaceholder")}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full max-w-xs"
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-slate-200 bg-white/90 p-4 shadow-sm"
              >
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-sky-500 text-sm font-bold text-white">
                    {initials(user.name)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 font-semibold text-slate-900">
                      <span className="truncate">{user.name}</span>
                      <Badge variant={user.role === "global_admin" ? "critical" : "info"}>
                        {user.role === "global_admin" ? "Quản trị toàn hệ thống" : "Cán bộ địa phương"}
                      </Badge>
                    </div>
                    <div className="text-xs text-slate-600 break-all">{user.email}</div>
                    <div className="mt-1 flex flex-wrap gap-1 text-xs text-slate-500">
                      <span className="font-semibold text-slate-600">{t("admin.users.provinceLabel")}</span>
                      <ProvincePills provinceIds={user.provinceIds} />
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="icon" variant="outline" onClick={() => setEditing(user)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => setConfirmDelete(user)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
            {users.length === 0 && <p className="text-sm text-slate-600">{t("admin.users.empty")}</p>}
          </CardContent>
        </Card>
      </div>

      <ConfirmDialog
        open={Boolean(confirmDelete)}
        title={t("admin.users.deleteTitle")}
        description={t("admin.users.deleteDesc", { name: confirmDelete?.name || "" })}
        confirmLabel={t("admin.provinces.deleteConfirm")}
        onConfirm={() => confirmDelete && onDelete(confirmDelete.id)}
        onClose={() => setConfirmDelete(null)}
      />
    </div>
  );
}

function StatPill({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-sm font-semibold text-white">
      <span className="text-white/80">{icon}</span>
      <span>{label}:</span>
      <span className="font-bold">{value}</span>
    </div>
  );
}

function ProvincePills({ provinceIds }: { provinceIds: string[] }) {
  const { t } = useI18n();
  const display = provinceIds.length ? provinceIds.slice(0, 3) : [t("admin.users.provinceAll")];
  const extra = provinceIds.length > 3 ? provinceIds.length - 3 : 0;
  return (
    <>
      {display.map((p) => (
        <span key={p} className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-700">
          {p}
        </span>
      ))}
      {extra > 0 && <span className="rounded-full bg-slate-200 px-2 py-0.5 text-slate-700">+{extra}</span>}
    </>
  );
}
