import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useProvinceStore } from "@/store/provinceStore";
import { CornerDownRight } from "lucide-react";

export default function ProvinceQuickLink() {
  const { fetchProvinces, provinces, lastSlug } = useProvinceStore();

  useEffect(() => {
    fetchProvinces().catch(() => undefined);
  }, [fetchProvinces]);

  const province = useMemo(() => provinces.find((p) => p.slug === lastSlug), [provinces, lastSlug]);

  if (!province) return null;

  return (
    <Button asChild variant="outline" size="sm">
      <Link to={`/province/${province.slug}`} className="flex items-center gap-2">
        <CornerDownRight className="h-4 w-4 text-brand-600" />
        <span>Tiếp tục {province.name}</span>
      </Link>
    </Button>
  );
}
