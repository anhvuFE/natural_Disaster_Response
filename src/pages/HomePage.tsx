import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HomeHero from "@/components/home/HomeHero";
import ProvinceSelectorCard from "@/components/home/ProvinceSelectorCard";
import { useProvinceStore } from "@/store/provinceStore";
import { useToast } from "@/components/ui/use-toast";

export default function HomePage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { provinces, fetchProvinces, setCurrentProvince, lastSlug } = useProvinceStore();
  const [selectedSlug, setSelectedSlug] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProvinces().catch(() => {
      toast({ title: "Lỗi", description: "Không tải được danh sách tỉnh", variant: "destructive" });
    });
  }, [fetchProvinces, toast]);

  useEffect(() => {
    // Prefill bằng lựa chọn gần nhất nếu có.
    if (lastSlug) setSelectedSlug((prev) => prev || lastSlug);
  }, [lastSlug]);

  const handleSubmit = () => {
    if (!selectedSlug) {
      toast({ title: "Vui lòng chọn tỉnh/thành", variant: "destructive" });
      return;
    }
    const province = provinces.find((p) => p.slug === selectedSlug);
    if (!province) {
      toast({ title: "Tỉnh không hợp lệ", variant: "destructive" });
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
