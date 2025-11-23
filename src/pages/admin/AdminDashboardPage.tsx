import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/authStore";
import { useProvinceStore } from "@/store/provinceStore";
import { Button } from "@/components/ui/button";
import { ListChecks, MapPin, PhoneCall, Megaphone, Globe, BellRing, Shield, ShieldCheck } from "lucide-react";

export default function AdminDashboardPage() {
  const { user } = useAuthStore();
  const { provinces, fetchProvinces } = useProvinceStore();

  useEffect(() => {
    fetchProvinces().catch(() => undefined);
  }, [fetchProvinces]);

  const managedProvinces = provinces.filter((p) => (user?.role === "global_admin" ? true : user?.provinceIds.includes(p.id)));
  const isGlobal = user?.role === "global_admin";
  const stats = {
    provinces: managedProvinces.length,
    shelters: "–", // placeholder until wired
    alerts: "–",
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4 rounded-3xl border border-white/60 bg-gradient-to-r from-slate-900 via-slate-800 to-sky-900 p-6 text-white shadow-lg shadow-slate-900/10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-sky-200">Bảng điều khiển</p>
            <h1 className="text-3xl font-bold leading-tight">Quản trị nội dung & cảnh báo</h1>
            <p className="text-sm text-sky-100">Truy cập nhanh các module bạn được phân quyền.</p>
          </div>
          <div className="flex gap-3">
            <DashboardStat label="Tỉnh quản lý" value={String(stats.provinces)} />
            <DashboardStat label="Nơi trú ẩn" value={stats.shelters} />
            <DashboardStat label="Cảnh báo" value={stats.alerts} />
          </div>
        </div>
      </div>

      <QuickActions provinces={managedProvinces} />

      <div className="grid gap-4 md:grid-cols-2">
        {isGlobal && (
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-700">
                <Globe className="h-5 w-5 text-brand-600" />
                Quản trị tỉnh/thành
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-3 text-sm text-slate-600">Chỉnh sửa slug, vùng, thiên tai mặc định từng tỉnh.</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {provinces.map((p) => (
                  <Button key={p.id} asChild variant="outline" className="justify-start">
                    <Link to={`/admin/provinces/${p.id}`} className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-brand-600" />
                      <span>{p.name}</span>
                    </Link>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        {managedProvinces.map((province) => (
          <Card key={province.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-brand-600" />
                {province.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-2 sm:grid-cols-2">
                <AdminShortcut
                  to={`/admin/content/${province.id}/${province.defaultDisasterCode || "flood"}`}
                  icon={<ListChecks className="h-4 w-4" />}
                  label="Nội dung hướng dẫn"
                />
                <AdminShortcut
                  to={`/admin/shelters/${province.id}`}
                  icon={<MapPin className="h-4 w-4" />}
                  label="Nơi trú ẩn"
                />
                <AdminShortcut
                  to={`/admin/contacts/${province.id}`}
                  icon={<PhoneCall className="h-4 w-4" />}
                  label="Số khẩn cấp"
                />
                <AdminShortcut
                  to={`/admin/alerts/${province.id}`}
                  icon={<Megaphone className="h-4 w-4" />}
                  label="Cảnh báo"
                />
              </div>
            </CardContent>
          </Card>
        ))}
        {managedProvinces.length === 0 && <p className="text-sm text-slate-600">Chưa có tỉnh được phân quyền.</p>}
      </div>
    </div>
  );
}

function AdminShortcut({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <Button asChild variant="outline" className="justify-start">
      <Link to={to} className="flex items-center gap-2">
        {icon}
        <span>{label}</span>
      </Link>
    </Button>
  );
}

function QuickActions({ provinces }: { provinces: { id: string; name: string; defaultDisasterCode?: string }[] }) {
  const targetProvince = provinces[0];

  if (!targetProvince) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-4 text-sm text-slate-600">
        Chưa có tỉnh được phân quyền để thao tác nhanh.
      </div>
    );
  }

  const pid = targetProvince.id;
  const defaultDisaster = targetProvince.defaultDisasterCode || "flood";
  const actions = [
    {
      to: `/admin/alerts/${pid}`,
      title: "Gửi cảnh báo nhanh",
      desc: "Chọn mức độ, phạm vi và gửi tới người dân",
      icon: <BellRing className="h-5 w-5 text-amber-600" />,
    },
    {
      to: `/admin/content/${pid}/${defaultDisaster}`,
      title: "Chỉnh checklist & hướng dẫn",
      desc: "Cập nhật trước/trong/sau thiên tai",
      icon: <ListChecks className="h-5 w-5 text-emerald-600" />,
    },
    {
      to: `/admin/shelters/${pid}`,
      title: "Quản lý nơi trú ẩn",
      desc: "Thêm tọa độ, số điện thoại, ghi chú",
      icon: <Shield className="h-5 w-5 text-sky-600" />,
    },
    {
      to: `/admin/contacts/${pid}`,
      title: "Cập nhật số khẩn cấp",
      desc: "Danh bạ cứu hộ, y tế, điện lực",
      icon: <PhoneCall className="h-5 w-5 text-indigo-600" />,
    },
  ];

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {actions.map((action) => (
        <Link
          key={action.to}
          to={action.to}
          className="group flex h-full flex-col gap-2 rounded-2xl border border-white/60 bg-white/90 p-4 shadow-lg shadow-slate-900/5 transition hover:-translate-y-1 hover:shadow-xl"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 group-hover:bg-slate-900 group-hover:text-white">
            {action.icon}
          </div>
          <div className="text-base font-semibold text-slate-900">{action.title}</div>
          <div className="text-sm text-slate-600">{action.desc}</div>
        </Link>
      ))}
    </div>
  );
}

function DashboardStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-left">
      <div className="text-[10px] font-semibold uppercase tracking-[0.1em] text-sky-100">{label}</div>
      <div className="text-xl font-bold text-white">{value}</div>
    </div>
  );
}
