import { Link } from "react-router-dom";
import type { Alert } from "@/types";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { Megaphone } from "lucide-react";

const levelCopy: Record<Alert["level"], { label: string; variant: "info" | "warning" | "critical" }> = {
  info: { label: "Thông tin", variant: "info" },
  warning: { label: "Cảnh báo", variant: "warning" },
  critical: { label: "Khẩn cấp", variant: "critical" },
};

interface Props {
  alert: Alert;
  provinceSlug: string;
}

export default function AlertBanner({ alert, provinceSlug }: Props) {
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
            Chi tiết cảnh báo
          </Link>
        </div>
        <Link
          to={`/province/${provinceSlug}`}
          className="rounded-full bg-amber-600 px-3 py-2 text-xs font-semibold text-white shadow hover:bg-amber-700"
        >
          Dành cho {provinceSlug}
        </Link>
      </div>
    </div>
  );
}
