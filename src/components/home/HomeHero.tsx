import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Bell, Waves, RadioTower, MapPinned, Shield } from "lucide-react";

export default function HomeHero({ onCtaClick }: { onCtaClick?: () => void }) {
  return (
    <section className="mx-auto max-w-6xl px-2 py-10 sm:px-4">
      <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-gradient-to-br from-white/90 via-white/80 to-blue-50/70 p-6 shadow-[0_20px_60px_rgba(37,99,235,0.12)] sm:p-8">
        <div className="pointer-events-none absolute -left-10 top-10 h-32 w-32 rounded-full bg-brand-200/50 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-6 h-40 w-40 rounded-full bg-sky-200/60 blur-3xl" />
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-white shadow-lg shadow-slate-900/20">
              <Bell className="h-4 w-4" />
              Ứng phó thiên tai
            </div>
            <h1 className="text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
              Chủ động chuẩn bị. Ứng phó nhanh. Bảo vệ an toàn cho gia đình bạn.
            </h1>
            <p className="max-w-2xl text-lg text-slate-700">
              Chọn tỉnh/thành để xem checklist, hướng dẫn trước - trong - sau thiên tai, nơi trú ẩn gần nhất và nhận cảnh báo kịp
              thời từ chính quyền địa phương.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button size="lg" onClick={onCtaClick} className="flex items-center justify-center gap-2 sm:w-auto">
                <ShieldAlert className="h-5 w-5" />
                Xem hướng dẫn ngay
              </Button>
              <Button asChild variant="secondary" size="lg" className="sm:w-auto">
                <Link to="/admin">Dành cho cán bộ</Link>
              </Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <Stat label="Hướng dẫn" value="3 giai đoạn" />
              <Stat label="Nơi trú ẩn" value="Theo tỉnh" />
              <Stat label="Cảnh báo" value="Realtime" />
            </div>
          </div>
          <div className="grid gap-3 rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-xl">
            <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-slate-500">Bạn nhận được</h3>
            <Feature icon={<Shield className="text-brand-600" />} title="Checklist chủ động">
              Trước - trong - sau thiên tai, lưu offline trên thiết bị.
            </Feature>
            <Feature icon={<RadioTower className="text-amber-600" />} title="Cảnh báo đẩy">
              Nhận thông báo ngay khi địa phương phát đi alert mới.
            </Feature>
            <Feature icon={<MapPinned className="text-emerald-600" />} title="Nơi trú ẩn & số khẩn cấp">
              Địa chỉ, tọa độ, số điện thoại từng điểm an toàn trong tỉnh.
            </Feature>
            <Feature icon={<Waves className="text-sky-600" />} title="Thiết kế cho mobile">
              Nút gọi nhanh, bản đồ mini, trải nghiệm tối ưu trên điện thoại.
            </Feature>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 shadow-sm">
      <div className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">{label}</div>
      <div className="text-lg font-semibold text-slate-900">{value}</div>
    </div>
  );
}

function Feature({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-gradient-to-r from-slate-50 to-white px-3 py-3 shadow-sm">
      <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white shadow-sm">
        {icon}
      </div>
      <div className="space-y-1">
        <div className="text-sm font-semibold text-slate-900">{title}</div>
        <p className="text-sm text-slate-600">{children}</p>
      </div>
    </div>
  );
}
