import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useProvinceStore } from "@/store/provinceStore";
import { CornerDownRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function ProvinceQuickLink() {
  const { fetchProvinces, provinces, lastSlug } = useProvinceStore();
  const { t } = useI18n();

  useEffect(() => {
    fetchProvinces().catch(() => undefined);
  }, [fetchProvinces]);

  const province = useMemo(() => provinces.find((p) => p.slug === lastSlug), [provinces, lastSlug]);

  if (!province) return null;

  return (
    <Button asChild variant="outline" size="sm">
      <Link to={`/province/${province.slug}`} className="flex items-center gap-2">
        <CornerDownRight className="h-4 w-4 text-brand-600" />
        <span>{t("nav.continue", { province: province.name })}</span>
      </Link>
    </Button>
  );
}
