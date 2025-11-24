import { Link } from "react-router-dom";
import type { Alert } from "@/types";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { Megaphone } from "lucide-react";
import { useMemo } from "react";
import { useI18n } from "@/lib/i18n";

interface Props {
  alert: Alert;
  provinceSlug: string;
}

export default function AlertBanner({ alert, provinceSlug }: Props) {
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
  const meta = levelCopy[alert.level];
  return (
    <div className="mb-4 overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-white px-4 py-3 shadow-md shadow-amber-200/50">
      <div className="flex items-start gap-3">
        <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-700 shadow-inner">
          <Megaphone className="h-5 w-5" />
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={meta.variant}>{meta.label}</Badge>
            <span className="text-xs text-slate-600">{formatDate(alert.createdAt)}</span>
          </div>
          <div className="font-semibold text-slate-900">{alert.title}</div>
          <p className="text-sm text-slate-700">{alert.content}</p>
          <Link to={`/alert/${alert.id}`} className="text-sm font-semibold text-amber-700 hover:underline">
            {t("alert.details")}
          </Link>
        </div>
        <Link
          to={`/province/${provinceSlug}`}
          className="rounded-full bg-amber-600 px-3 py-2 text-xs font-semibold text-white shadow hover:bg-amber-700"
        >
          {t("alert.forProvince", { province: provinceSlug })}
        </Link>
      </div>
    </div>
  );
}
