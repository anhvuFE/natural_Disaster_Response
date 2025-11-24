import { FormEvent, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Api } from "@/lib/api";
import { useDisasterStore } from "@/store/disasterStore";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/components/ui/use-toast";
import type { DisasterType } from "@/types";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const empty: DisasterType = { code: "", name: "", icon: "" };

export default function AdminDisastersPage() {
  const token = useAuthStore((s) => s.token);
  const { disasterTypes, fetchDisasterTypes } = useDisasterStore();
  const { toast } = useToast();
  const { t } = useI18n();
  const [editing, setEditing] = useState<DisasterType>(empty);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDisasterTypes().catch(() => toast({ title: t("toast.disasterListLoadError"), variant: "destructive" }));
  }, [fetchDisasterTypes, t, toast]);

  const resetForm = () => setEditing(empty);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!editing.code.trim() || !editing.name.trim()) throw new Error(t("admin.disasters.form.code"));
      if (disasterTypes.find((d) => d.code === editing.code)) {
        await Api.updateDisasterType(editing.code, editing, token);
        toast({ title: t("toast.disasterUpdated") });
      } else {
        await Api.createDisasterType(editing, token);
        toast({ title: t("toast.disasterCreated") });
      }
      resetForm();
      fetchDisasterTypes();
    } catch (err) {
      toast({ title: t("toast.loadDataError"), description: String(err), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async (code: string) => {
    setLoading(true);
    try {
      await Api.deleteDisasterType(code, token);
      toast({ title: t("toast.deleted") });
      fetchDisasterTypes();
    } catch (err) {
      toast({ title: t("toast.loadDataError"), description: String(err), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-white/60 bg-gradient-to-r from-slate-900 via-slate-800 to-cyan-800 p-6 text-white shadow-lg shadow-slate-900/10">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-cyan-100">{t("admin.disasters.badge")}</p>
        <h1 className="text-2xl font-bold leading-tight">{t("admin.disasters.title")}</h1>
        <p className="text-sm text-cyan-50">{t("admin.disasters.subtitle")}</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-white/70 bg-white/95 shadow-lg shadow-slate-900/5">
          <CardHeader>
            <CardTitle>{editing.code ? t("admin.disasters.form.edit") : t("admin.disasters.form.add")}</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-3" onSubmit={onSubmit}>
              <Input label={t("admin.disasters.form.code")} placeholder={t("admin.disasters.form.codePlaceholder")} value={editing.code} onChange={(e) => setEditing({ ...editing, code: e.target.value })} />
              <Input label={t("admin.disasters.form.name")} placeholder={t("admin.disasters.form.namePlaceholder")} value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
              <Input label={t("admin.disasters.form.icon")} placeholder={t("admin.disasters.form.iconPlaceholder")} value={editing.icon || ""} onChange={(e) => setEditing({ ...editing, icon: e.target.value })} hint={t("admin.disasters.form.iconHint")} />
              <Button type="submit" disabled={loading} className="w-full">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t("admin.disasters.form.submit")}
              </Button>
            </form>
          </CardContent>
        </Card>
        <Card className="border-white/70 bg-white/95 shadow-lg shadow-slate-900/5">
          <CardHeader>
            <CardTitle>{t("admin.disasters.listTitle")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {disasterTypes.map((d) => (
              <div key={d.code} className="flex items-start justify-between rounded-xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white p-3 shadow-sm">
                <div>
                  <div className="flex items-center gap-2 font-semibold text-slate-900">
                    <span className="text-lg">{d.icon || "🌐"}</span>
                    {d.name}
                  </div>
                  <div className="text-xs text-slate-600">Code: {d.code}</div>
                </div>
                <div className="flex gap-2">
                  <Button size="icon" variant="outline" onClick={() => setEditing(d)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => onDelete(d.code)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
            {disasterTypes.length === 0 && <p className="text-sm text-slate-600">{t("admin.disasters.empty")}</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
