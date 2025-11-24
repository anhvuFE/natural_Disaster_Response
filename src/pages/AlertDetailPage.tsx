import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Api } from "@/lib/api";
import { Alert } from "@/types";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useI18n } from "@/lib/i18n";

export default function AlertDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [alert, setAlert] = useState<Alert | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useI18n();
  const levelCopy = useMemo(
    () =>
      ({
        info: { label: t("alert.level.info"), variant: "info" as const },
        warning: { label: t("alert.level.warning"), variant: "warning" as const },
        critical: { label: t("alert.level.critical"), variant: "critical" as const },
      }) satisfies Record<Alert["level"], { label: string; variant: "info" | "warning" | "critical" }>,
    [t]
  );

  useEffect(() => {
    if (!id) return;
    Api.getAlertById(id)
      .then(setAlert)
      .catch(() => toast({ title: t("toast.alertLoadFailed"), variant: "destructive" }));
  }, [id, t, toast]);

  if (!alert) {
    return (
      <div className="mx-auto max-w-3xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-600">{t("alert.loading")}</p>
      </div>
    );
  }

  const meta = levelCopy[alert.level];
  const provincePath = alert.provinceSlug || alert.provinceId;

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <Button variant="ghost" onClick={() => navigate(-1)} className="flex items-center gap-2">
        <ArrowLeft className="h-4 w-4" /> {t("alert.back")}
      </Button>
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <Badge variant={meta.variant}>{meta.label}</Badge>
          <span className="text-xs text-slate-600">{formatDate(alert.createdAt)}</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">{alert.title}</h1>
        <p className="mt-3 text-base text-slate-700">{alert.content}</p>
        <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
          <MapPin className="h-4 w-4 text-brand-600" />
          {t("alert.scope", { scope: alert.scope || t("alert.scopeProvince") })}
        </div>
        <div className="mt-6">
          <Button asChild>
            <Link to={`/province/${provincePath}`}>{t("alert.viewGuide")}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
