import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useProvinceStore } from "@/store/provinceStore";
import { useDisasterStore } from "@/store/disasterStore";
import { Api } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/components/ui/use-toast";
import type { Province } from "@/types";
import { Loader2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function AdminProvinceConfigPage() {
  const { id = "" } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const token = useAuthStore((s) => s.token);
  const { provinces, fetchProvinces } = useProvinceStore();
  const { disasterTypes, fetchDisasterTypes } = useDisasterStore();
  const { t } = useI18n();
  const [province, setProvince] = useState<Province | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProvinces().catch(() => toast({ title: t("toast.provinceLoadError"), variant: "destructive" }));
    fetchDisasterTypes().catch(() => undefined);
  }, [fetchProvinces, fetchDisasterTypes, t, toast]);

  useEffect(() => {
    const found = provinces.find((p) => p.id === id);
    if (found) {
      setProvince(found);
    } else if (id) {
      Api.getProvinceById(id)
        .then((data) => setProvince(data))
        .catch(() => toast({ title: t("toast.provinceNotFound"), variant: "destructive" }));
    }
  }, [id, provinces, t, toast]);

  const onSave = async () => {
    if (!province) return;
    setSaving(true);
    try {
      const updated = await Api.updateProvince(id, {
        name: province.name,
        slug: province.slug,
        region: province.region,
        defaultDisasterCode: province.defaultDisasterCode,
      }, token);
      toast({ title: t("toast.provinceSaved") });
      setProvince(updated);
    } catch (err) {
      toast({ title: t("toast.loadDataError"), description: String(err), variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const defaultTypeName = useMemo(
    () => disasterTypes.find((d) => d.code === province?.defaultDisasterCode)?.name,
    [disasterTypes, province?.defaultDisasterCode]
  );

  if (!province) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-600">{t("admin.provinceConfig.loading")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t("admin.provinceConfig.title")}</h1>
          <p className="text-sm text-slate-600">{t("admin.provinceConfig.subtitle")}</p>
        </div>
        <Button variant="ghost" onClick={() => navigate(-1)}>
          {t("admin.provinceConfig.back")}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("admin.provinceConfig.basicInfo")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label={t("admin.provinceConfig.name")}
            placeholder={t("admin.provinceConfig.namePlaceholder")}
            value={province.name}
            onChange={(e) => setProvince({ ...province, name: e.target.value })}
          />
          <Input
            label={t("admin.provinceConfig.slug")}
            placeholder={t("admin.provinceConfig.slugPlaceholder")}
            value={province.slug}
            onChange={(e) => setProvince({ ...province, slug: e.target.value })}
          />
          <Input
            label={t("admin.provinceConfig.region")}
            placeholder={t("admin.provinceConfig.regionPlaceholder")}
            value={province.region || ""}
            onChange={(e) => setProvince({ ...province, region: e.target.value })}
          />
          <Select
            label={t("admin.provinceConfig.defaultDisaster")}
            placeholder={t("admin.provinceConfig.defaultPlaceholder")}
            value={province.defaultDisasterCode || ""}
            onChange={(code) => setProvince({ ...province, defaultDisasterCode: code })}
            options={disasterTypes.map((d) => ({ value: d.code, label: d.name }))}
          />
          {defaultTypeName && <p className="text-xs text-slate-500">{t("admin.provinceConfig.selected", { name: defaultTypeName })}</p>}
          <Button onClick={onSave} disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("admin.provinceConfig.save")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
