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

const levelCopy: Record<AlertLevel, { label: string; badge: "info" | "warning" | "critical" }> = {
  info: { label: "Thông tin", badge: "info" },
  warning: { label: "Cảnh báo", badge: "warning" },
  critical: { label: "Khẩn cấp", badge: "critical" },
};

export default function AdminAlertsPage() {
  const { provinceId: provinceIdParam = "" } = useParams<{ provinceId: string }>();
  const token = useAuthStore((s) => s.token);
  const authUser = useAuthStore((s) => s.user);
  const { provinces, fetchProvinces } = useProvinceStore();
  const { toast } = useToast();

  const [activeProvinceId, setActiveProvinceId] = useState<string>("");
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [scope, setScope] = useState("Toàn tỉnh");
  const [level, setLevel] = useState<AlertLevel>("info");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProvinces().catch(() => toast({ title: "Không tải được danh sách tỉnh", variant: "destructive" }));
  }, [fetchProvinces, toast]);

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
      .catch(() => toast({ title: "Không tải được lịch sử", variant: "destructive" }));
  }, [activeProvinceId, toast]);

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
      toast({ title: "Chưa chọn tỉnh để gửi cảnh báo", variant: "destructive" });
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
      toast({ title: `Đã gửi cảnh báo đến ${activeProvince?.name || activeProvinceId}` });
      setTitle("");
      setContent("");
    } catch (err) {
      toast({ title: "Gửi cảnh báo thất bại", description: String(err), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (!provinces.length && !activeProvinceId) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-600">Chưa có tỉnh để gửi cảnh báo. Hãy thêm tỉnh trước.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-r from-sky-50 via-white to-indigo-50 p-6 text-slate-900 shadow-lg shadow-slate-900/5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">Module cảnh báo</p>
            <h1 className="text-3xl font-bold">Gửi & theo dõi cảnh báo</h1>
            {activeProvince && <p className="text-sm text-slate-600">Tỉnh: {activeProvince.name}</p>}
            {!activeProvince && <p className="text-sm text-slate-600">Chưa chọn tỉnh, hãy chọn bên phải.</p>}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Chọn tỉnh</span>
            <Select
              value={activeProvinceId}
              onChange={setActiveProvinceId}
              options={provinces.map((p) => ({ value: p.id, label: p.name, hint: p.region }))}
              placeholder="Chọn tỉnh"
              className="min-w-[220px]"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Metric label="Cảnh báo khẩn" value={counts.critical} tone="critical" />
        <Metric label="Cảnh báo" value={counts.warning} tone="warning" />
        <Metric label="Thông tin" value={counts.info} tone="info" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-white/60 bg-white/95 shadow-lg shadow-slate-900/5 lg:col-span-2">
          <CardHeader>
            <CardTitle>Tạo cảnh báo</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-3" onSubmit={onSubmit}>
              <div className="grid gap-3 md:grid-cols-2">
                <Input placeholder="Tiêu đề" value={title} onChange={(e) => setTitle(e.target.value)} required />
                <Input
                  placeholder="Phạm vi (toàn tỉnh, quận...)"
                  value={scope}
                  onChange={(e) => setScope(e.target.value)}
                />
              </div>
              <Textarea
                placeholder="Nội dung ngắn"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
              <div className="grid gap-3 md:grid-cols-2">
                <Select
                  label="Mức độ"
                  value={level}
                  onChange={(v) => setLevel(v as AlertLevel)}
                  options={[
                    { value: "info", label: "Thông tin" },
                    { value: "warning", label: "Cảnh báo" },
                    { value: "critical", label: "Khẩn cấp" },
                  ]}
                />
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Kênh gửi</label>
                  <div className="flex flex-wrap gap-2 text-sm text-slate-600">
                    <span className="rounded-full bg-slate-100 px-3 py-1">Web push</span>
                    <span className="rounded-full bg-slate-100 px-3 py-1">Banner tại trang tỉnh</span>
                  </div>
                </div>
              </div>
              <Button type="submit" disabled={loading || !activeProvinceId} className="w-full">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Gửi ngay
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-white/60 bg-white/95 shadow-lg shadow-slate-900/5">
          <CardHeader>
            <CardTitle>Lịch sử cảnh báo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.map((alert) => {
              const meta = levelCopy[alert.level];
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
                  {alert.scope && <div className="mt-1 text-xs text-slate-500">Phạm vi: {alert.scope}</div>}
                </div>
              );
            })}
            {alerts.length === 0 && <p className="text-sm text-slate-600">Chưa có cảnh báo.</p>}
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
