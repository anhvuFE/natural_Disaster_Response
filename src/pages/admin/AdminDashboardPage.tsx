import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/authStore";
import { useProvinceStore } from "@/store/provinceStore";
import { Button } from "@/components/ui/button";
import { ListChecks, MapPin, PhoneCall, Megaphone, Globe, BellRing, Shield, ShieldCheck } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function AdminDashboardPage() {
  const { user } = useAuthStore();
  const { provinces, fetchProvinces } = useProvinceStore();
  const { t } = useI18n();

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
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-sky-200">{t("admin.dashboard.badge")}</p>
            <h1 className="text-3xl font-bold leading-tight">{t("admin.dashboard.title")}</h1>
            <p className="text-sm text-sky-100">{t("admin.dashboard.subtitle")}</p>
          </div>
          <div className="flex gap-3">
            <DashboardStat label={t("admin.dashboard.stat.provinces")} value={String(stats.provinces)} />
            <DashboardStat label={t("admin.dashboard.stat.shelters")} value={stats.shelters} />
            <DashboardStat label={t("admin.dashboard.stat.alerts")} value={stats.alerts} />
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
                {t("admin.nav.provinceConfig")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-3 text-sm text-slate-600">{t("admin.dashboard.subtitle")}</p>
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
                  label={t("admin.nav.content")}
                />
                <AdminShortcut
                  to={`/admin/shelters/${province.id}`}
                  icon={<MapPin className="h-4 w-4" />}
                  label={t("admin.nav.shelters")}
                />
                <AdminShortcut
                  to={`/admin/contacts/${province.id}`}
                  icon={<PhoneCall className="h-4 w-4" />}
                  label={t("admin.nav.contacts")}
                />
                <AdminShortcut
                  to={`/admin/alerts/${province.id}`}
                  icon={<Megaphone className="h-4 w-4" />}
                  label={t("admin.nav.alerts")}
                />
              </div>
            </CardContent>
          </Card>
        ))}
        {managedProvinces.length === 0 && <p className="text-sm text-slate-600">{t("admin.dashboard.noProvince")}</p>}
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
  const { t } = useI18n();
  const targetProvince = provinces[0];

  if (!targetProvince) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-4 text-sm text-slate-600">
        {t("admin.dashboard.quickEmpty")}
      </div>
    );
  }

  const pid = targetProvince.id;
  const defaultDisaster = targetProvince.defaultDisasterCode || "flood";
  const actions = [
    {
      to: `/admin/alerts/${pid}`,
      title: t("admin.dashboard.actions.alert.title"),
      desc: t("admin.dashboard.actions.alert.desc"),
      icon: <BellRing className="h-5 w-5 text-amber-600" />,
    },
    {
      to: `/admin/content/${pid}/${defaultDisaster}`,
      title: t("admin.dashboard.actions.content.title"),
      desc: t("admin.dashboard.actions.content.desc"),
      icon: <ListChecks className="h-5 w-5 text-emerald-600" />,
    },
    {
      to: `/admin/shelters/${pid}`,
      title: t("admin.dashboard.actions.shelter.title"),
      desc: t("admin.dashboard.actions.shelter.desc"),
      icon: <Shield className="h-5 w-5 text-sky-600" />,
    },
    {
      to: `/admin/contacts/${pid}`,
      title: t("admin.dashboard.actions.contact.title"),
      desc: t("admin.dashboard.actions.contact.desc"),
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
