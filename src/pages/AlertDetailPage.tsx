import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Api } from "@/lib/api";
import { Alert } from "@/types";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const levelCopy: Record<Alert["level"], { label: string; variant: "info" | "warning" | "critical" }> = {
  info: { label: "Thông tin", variant: "info" },
  warning: { label: "Cảnh báo", variant: "warning" },
  critical: { label: "Khẩn cấp", variant: "critical" },
};

export default function AlertDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [alert, setAlert] = useState<Alert | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    Api.getAlertById(id)
      .then(setAlert)
      .catch(() => toast({ title: "Không tải được cảnh báo", variant: "destructive" }));
  }, [id, toast]);

  if (!alert) {
    return (
      <div className="mx-auto max-w-3xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-600">Đang tải cảnh báo...</p>
      </div>
    );
  }

  const meta = levelCopy[alert.level];
  const provincePath = alert.provinceSlug || alert.provinceId;

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <Button variant="ghost" onClick={() => navigate(-1)} className="flex items-center gap-2">
        <ArrowLeft className="h-4 w-4" /> Quay lại
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
          Phạm vi: {alert.scope || "Toàn tỉnh"}
        </div>
        <div className="mt-6">
          <Button asChild>
            <Link to={`/province/${provincePath}`}>Xem hướng dẫn cho tỉnh</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
