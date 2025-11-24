import { FormEvent, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useProvinceStore } from "@/store/provinceStore";
import { Api } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/components/ui/use-toast";
import type { Province } from "@/types";
import { Loader2, MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/modal";
import { useI18n } from "@/lib/i18n";

const emptyProvince: Province = { id: "", name: "", slug: "", region: "", defaultDisasterCode: "" };

export default function AdminProvincesPage() {
  const token = useAuthStore((s) => s.token);
  const { provinces, fetchProvinces, error, loading } = useProvinceStore();
  const { toast } = useToast();
  const { t } = useI18n();
  const [editing, setEditing] = useState<Province>(emptyProvince);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Province | null>(null);

  useEffect(() => {
    fetchProvinces().catch(() => toast({ title: t("toast.provinceListLoadError"), variant: "destructive" }));
  }, [fetchProvinces, t, toast]);

  const resetForm = () => setEditing(emptyProvince);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (!editing.name.trim() || !editing.slug.trim()) throw new Error(t("admin.provinces.form.slug"));
      if (editing.id) {
        await Api.updateProvince(editing.id, editing, token);
        toast({ title: t("toast.provinceUpdated") });
      } else {
        await Api.createProvince(editing, token);
        toast({ title: t("toast.provinceCreated") });
      }
      resetForm();
      fetchProvinces();
    } catch (err) {
      toast({ title: t("toast.loadDataError"), description: String(err), variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id: string) => {
    setSaving(true);
    try {
      await Api.deleteProvince(id, token);
      toast({ title: t("toast.deleted") });
      fetchProvinces();
    } catch (err) {
      toast({ title: t("toast.loadDataError"), description: String(err), variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-white/60 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-800 p-6 text-white shadow-lg shadow-slate-900/10">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-indigo-100">{t("admin.provinces.badge")}</p>
        <h1 className="text-2xl font-bold leading-tight">{t("admin.provinces.title")}</h1>
        <p className="text-sm text-indigo-50">{t("admin.provinces.subtitle")}</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-white/70 bg-white/95 shadow-lg shadow-slate-900/5">
          <CardHeader>
            <CardTitle>{editing.id ? t("admin.provinces.form.edit") : t("admin.provinces.form.add")}</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-3" onSubmit={onSubmit}>
              <Input label={t("admin.provinces.form.name")} placeholder={t("admin.provinces.form.namePlaceholder")} value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
              <Input label={t("admin.provinces.form.slug")} placeholder={t("admin.provinces.form.slugPlaceholder")} value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} hint={t("admin.provinces.form.slugHint")} />
              <Input label={t("admin.provinces.form.region")} placeholder={t("admin.provinces.form.regionPlaceholder")} value={editing.region || ""} onChange={(e) => setEditing({ ...editing, region: e.target.value })} />
              <Input
                label={t("admin.provinces.form.defaultDisaster")}
                placeholder="flood"
                value={editing.defaultDisasterCode || ""}
                onChange={(e) => setEditing({ ...editing, defaultDisasterCode: e.target.value })}
                hint={t("admin.provinces.form.defaultDisasterHint")}
              />
              <div className="flex gap-2">
                <Button type="submit" disabled={saving} className="w-full">
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editing.id ? t("admin.provinces.form.saveEdit") : t("admin.provinces.form.saveNew")}
                </Button>
                {editing.id && (
                  <Button type="button" variant="ghost" onClick={resetForm}>
                    {t("admin.provinces.form.cancel")}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="border-white/70 bg-white/95 shadow-lg shadow-slate-900/5">
          <CardHeader>
            <CardTitle>{t("admin.provinces.badge")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
              <span>
                {loading
                  ? t("admin.provinces.dataSource.loading")
                  : error
                  ? t("admin.provinces.dataSource.error", { message: error })
                  : t("admin.provinces.dataSource.ok")}
              </span>
              <Button size="sm" variant="outline" onClick={() => fetchProvinces()} disabled={loading}>
                {loading && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
                {t("admin.provinces.reload")}
              </Button>
            </div>
            {provinces.map((province) => (
              <div key={province.id} className="flex items-start justify-between rounded-xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white p-3 shadow-sm">
                <div>
                  <div className="flex items-center gap-2 font-semibold text-slate-900">
                    <MapPin className="h-4 w-4 text-brand-600" />
                    {province.name}
                  </div>
                  <div className="text-xs text-slate-600">Slug: {province.slug}</div>
                  {province.region && <div className="text-xs text-slate-500">Vùng: {province.region}</div>}
                  {province.defaultDisasterCode && (
                    <div className="text-xs text-slate-500">Thiên tai mặc định: {province.defaultDisasterCode}</div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button size="icon" variant="outline" onClick={() => setEditing(province)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => setConfirmDelete(province)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
            {provinces.length === 0 && <p className="text-sm text-slate-600">{t("admin.provinces.empty")}</p>}
          </CardContent>
        </Card>
      </div>

      <ConfirmDialog
        open={Boolean(confirmDelete)}
        title={t("admin.provinces.deleteTitle")}
        description={t("admin.provinces.deleteDesc", { name: confirmDelete?.name || "" })}
        confirmLabel={t("admin.provinces.deleteConfirm")}
        onConfirm={() => confirmDelete && onDelete(confirmDelete.id)}
        onClose={() => setConfirmDelete(null)}
      />
    </div>
  );
}
