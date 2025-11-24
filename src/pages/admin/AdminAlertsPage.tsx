import { FormEvent, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Api } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useProvinceStore } from "@/store/provinceStore";
import type { Alert, AlertLevel, Province } from "@/types";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Loader2, Megaphone } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function AdminAlertsPage() {
  const { provinceId: provinceIdParam = "" } = useParams<{ provinceId: string }>();
  const token = useAuthStore((s) => s.token);
  const authUser = useAuthStore((s) => s.user);
  const { provinces, fetchProvinces } = useProvinceStore();
  const { toast } = useToast();
  const { t } = useI18n();

  const [activeProvinceId, setActiveProvinceId] = useState<string>("");
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [scope, setScope] = useState(t("alert.scopeProvince"));
  const [level, setLevel] = useState<AlertLevel>("info");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProvinces().catch(() => toast({ title: t("toast.provinceListLoadError"), variant: "destructive" }));
  }, [fetchProvinces, t, toast]);

  useEffect(() => {
    if (provinceIdParam) {
      setActiveProvinceId(provinceIdParam);
      return;
    }
    if (authUser?.provinceIds?.length) {
      setActiveProvinceId((prev) => prev || authUser.provinceIds[0]);
    } else if (provinces.length) {
      setActiveProvinceId((prev) => prev || provinces[0].id);
    }
  }, [provinceIdParam, authUser?.provinceIds, provinces]);

  useEffect(() => {
    if (!activeProvinceId) return;
    Api.getAlerts(activeProvinceId)
      .then(setAlerts)
      .catch(() => toast({ title: t("toast.alertHistoryLoadError"), variant: "destructive" }));
  }, [activeProvinceId, t, toast]);

  const activeProvince: Province | undefined = useMemo(
    () => provinces.find((p) => p.id === activeProvinceId),
    [provinces, activeProvinceId]
  );

  const counts = useMemo(() => {
    return alerts.reduce(
      (acc, a) => {
        acc[a.level] = (acc[a.level] || 0) + 1;
        return acc;
      },
      { info: 0, warning: 0, critical: 0 } as Record<AlertLevel, number>
    );
  }, [alerts]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!activeProvinceId) {
      toast({ title: t("toast.noProvinceToSend"), variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const created = await Api.createAlert(
        activeProvinceId,
        { title, content, level, scope, provinceId: activeProvinceId, createdAt: new Date().toISOString(), id: "" },
        token
      );
      setAlerts((prev) => [created, ...prev]);
      toast({ title: t("toast.alertSent", { target: activeProvince?.name || activeProvinceId }) });
      setTitle("");
      setContent("");
    } catch (err) {
      toast({ title: t("toast.loadDataError"), description: String(err), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (!provinces.length && !activeProvinceId) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-600">{t("admin.alerts.emptyProvince")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-r from-sky-50 via-white to-indigo-50 p-6 text-slate-900 shadow-lg shadow-slate-900/5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">{t("admin.alerts.title")}</p>
            <h1 className="text-3xl font-bold">{t("admin.alerts.title")}</h1>
            {activeProvince && <p className="text-sm text-slate-600">{`${t("admin.alerts.metaProvince")} ${activeProvince.name}`}</p>}
            {!activeProvince && <p className="text-sm text-slate-600">{t("admin.alerts.metaMissing")}</p>}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">{t("admin.alerts.selectProvince")}</span>
            <Select
              value={activeProvinceId}
              onChange={setActiveProvinceId}
              options={provinces.map((p) => ({ value: p.id, label: p.name, hint: p.region }))}
              placeholder={t("admin.alerts.selectProvince")}
              className="min-w-[220px]"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Metric label={t("admin.alerts.metrics.critical")} value={counts.critical} tone="critical" />
        <Metric label={t("admin.alerts.metrics.warning")} value={counts.warning} tone="warning" />
        <Metric label={t("admin.alerts.metrics.info")} value={counts.info} tone="info" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-white/60 bg-white/95 shadow-lg shadow-slate-900/5 lg:col-span-2">
          <CardHeader>
            <CardTitle>{t("admin.alerts.formTitle")}</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-3" onSubmit={onSubmit}>
              <div className="grid gap-3 md:grid-cols-2">
                <Input placeholder={t("admin.alerts.titlePlaceholder")} value={title} onChange={(e) => setTitle(e.target.value)} required />
                <Input
                  placeholder={t("admin.alerts.scopePlaceholder")}
                  value={scope}
                  onChange={(e) => setScope(e.target.value)}
                />
              </div>
              <Textarea
                placeholder={t("admin.alerts.contentPlaceholder")}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
              <div className="grid gap-3 md:grid-cols-2">
                <Select
                  label={t("admin.alerts.levelLabel")}
                  value={level}
                  onChange={(v) => setLevel(v as AlertLevel)}
                  options={[
                    { value: "info", label: t("alert.level.info") },
                    { value: "warning", label: t("alert.level.warning") },
                    { value: "critical", label: t("alert.level.critical") },
                  ]}
                />
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">{t("admin.alerts.channelLabel")}</label>
                  <div className="flex flex-wrap gap-2 text-sm text-slate-600">
                    <span className="rounded-full bg-slate-100 px-3 py-1">{t("admin.alerts.channel.web")}</span>
                    <span className="rounded-full bg-slate-100 px-3 py-1">{t("admin.alerts.channel.banner")}</span>
                  </div>
                </div>
              </div>
              <Button type="submit" disabled={loading || !activeProvinceId} className="w-full">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t("admin.alerts.submit")}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-white/60 bg-white/95 shadow-lg shadow-slate-900/5">
          <CardHeader>
            <CardTitle>{t("admin.alerts.historyTitle")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.map((alert) => {
              const meta: Record<AlertLevel, { label: string; badge: "info" | "warning" | "critical" }>[AlertLevel] = {
                info: { label: t("alert.level.info"), badge: "info" },
                warning: { label: t("alert.level.warning"), badge: "warning" },
                critical: { label: t("alert.level.critical"), badge: "critical" },
              }[alert.level];
              return (
                <div
                  key={alert.id}
                  className="rounded-xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white px-4 py-3 shadow-sm"
                >
                  <div className="mb-1 flex items-center gap-2">
                    <Megaphone className="h-4 w-4 text-amber-600" />
                    <Badge variant={meta.badge}>{meta.label}</Badge>
                    <span className="text-xs text-slate-500">{formatDate(alert.createdAt)}</span>
                  </div>
                  <div className="font-semibold text-slate-900">{alert.title}</div>
                  <div className="text-sm text-slate-700">{alert.content}</div>
                  {alert.scope && <div className="mt-1 text-xs text-slate-500">{t("alert.scope", { scope: alert.scope })}</div>}
                </div>
              );
            })}
            {alerts.length === 0 && <p className="text-sm text-slate-600">{t("admin.alerts.historyEmpty")}</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Metric({ label, value, tone }: { label: string; value: number; tone: AlertLevel }) {
  const colors: Record<AlertLevel, string> = {
    critical: "from-rose-100 to-rose-200 text-rose-800 border-rose-200",
    warning: "from-amber-100 to-amber-200 text-amber-800 border-amber-200",
    info: "from-blue-100 to-sky-100 text-blue-800 border-blue-200",
  };
  return (
    <div className={`rounded-2xl border bg-gradient-to-r ${colors[tone]} px-4 py-3 shadow-sm`}>
      <div className="text-xs font-semibold uppercase tracking-[0.08em]">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}
