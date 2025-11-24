import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HomeHero from "@/components/home/HomeHero";
import ProvinceSelectorCard from "@/components/home/ProvinceSelectorCard";
import { useProvinceStore } from "@/store/provinceStore";
import { useToast } from "@/components/ui/use-toast";
import { useI18n } from "@/lib/i18n";

export default function HomePage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { provinces, fetchProvinces, setCurrentProvince, lastSlug } = useProvinceStore();
  const { t } = useI18n();
  const [selectedSlug, setSelectedSlug] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProvinces().catch(() => {
      toast({
        title: t("toast.loadProvincesError.title"),
        description: t("toast.loadProvincesError.desc"),
        variant: "destructive",
      });
    });
  }, [fetchProvinces, toast, t]);

  useEffect(() => {
    // Prefill bằng lựa chọn gần nhất nếu có.
    if (lastSlug) setSelectedSlug((prev) => prev || lastSlug);
  }, [lastSlug]);

  const handleSubmit = () => {
    if (!selectedSlug) {
      toast({ title: t("toast.selectProvince"), variant: "destructive" });
      return;
    }
    const province = provinces.find((p) => p.slug === selectedSlug);
    if (!province) {
      toast({ title: t("toast.invalidProvince"), variant: "destructive" });
      return;
    }
    setLoading(true);
    setCurrentProvince(province);
    navigate(`/province/${province.slug}`);
    setLoading(false);
  };

  const scrollToSelector = () => {
    const el = document.getElementById("chon-tinh");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="space-y-6">
      <HomeHero onCtaClick={scrollToSelector} />
      <ProvinceSelectorCard
        provinces={provinces}
        selectedSlug={selectedSlug}
        onSelect={setSelectedSlug}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
}
