import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import AlertBanner from "@/components/province/AlertBanner";
import ProvinceHeader from "@/components/province/ProvinceHeader";
import DisasterTabs from "@/components/province/DisasterTabs";
import ChecklistSection from "@/components/checklist/ChecklistSection";
import TipsSection from "@/components/tips/TipsSection";
import ShelterSection from "@/components/province/ShelterSection";
import EmergencySection from "@/components/province/EmergencySection";
import { useProvinceStore } from "@/store/provinceStore";
import { useDisasterStore } from "@/store/disasterStore";
import type { Alert, DisasterGuide, EmergencyContact, Shelter } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function ProvincePage() {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  const { fetchProvinces, setCurrentProvinceBySlug, currentProvince } = useProvinceStore();
  const { disasterTypes, fetchDisasterTypes, getGuide, getShelters, getContacts, getLatestAlert } = useDisasterStore();
  const { t } = useI18n();

  const [activeDisaster, setActiveDisaster] = useState<string | undefined>(undefined);
  const [guide, setGuideState] = useState<DisasterGuide | undefined>(undefined);
  const [shelters, setSheltersState] = useState<Shelter[]>([]);
  const [contacts, setContactsState] = useState<EmergencyContact[]>([]);
  const [latestAlert, setLatestAlertState] = useState<Alert | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProvinces()
      .then(() => setCurrentProvinceBySlug(slug))
      .catch(() => toast({ title: t("toast.loadProvinceError"), variant: "destructive" }));
  }, [fetchProvinces, setCurrentProvinceBySlug, slug, t, toast]);

  useEffect(() => {
    fetchDisasterTypes().catch(() =>
      toast({ title: t("toast.loadDisastersError"), variant: "destructive" })
    );
  }, [fetchDisasterTypes, t, toast]);

  useEffect(() => {
    if (!currentProvince) return;
    const defaultCode = currentProvince.defaultDisasterCode || disasterTypes[0]?.code;
    setActiveDisaster((prev) => prev || defaultCode);
  }, [currentProvince, disasterTypes]);

  useEffect(() => {
    const load = async () => {
      if (!currentProvince || !activeDisaster) return;
      setLoading(true);
      try {
        const [g, s, c, alert] = await Promise.all([
          getGuide(currentProvince.id, activeDisaster),
          getShelters(currentProvince.id),
          getContacts(currentProvince.id),
          getLatestAlert(currentProvince.id),
        ]);
        setGuideState(g);
        setSheltersState(s);
        setContactsState(c);
        setLatestAlertState(alert);
      } catch (err) {
        toast({ title: t("toast.loadDataError"), description: String(err), variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [activeDisaster, currentProvince, getContacts, getGuide, getLatestAlert, getShelters, t, toast]);

  const disasterName = useMemo(
    () => disasterTypes.find((d) => d.code === activeDisaster)?.name || "",
    [activeDisaster, disasterTypes]
  );

  if (!slug) return null;

  return (
    <div className="flex flex-col gap-4">
      <ProvinceHeader province={currentProvince} />
      {latestAlert && currentProvince && (
        <AlertBanner alert={latestAlert} provinceSlug={currentProvince.slug} />
      )}
      <div className="rounded-2xl border border-white/70 bg-white/90 p-4 shadow-lg shadow-slate-900/5 backdrop-blur">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t("province.disasterTypeLabel")}</p>
            <h2 className="text-xl font-semibold text-slate-900">{disasterName || t("province.disasterFallback")}</h2>
          </div>
          <DisasterTabs items={disasterTypes} active={activeDisaster} onChange={setActiveDisaster} />
        </div>
      </div>

      {loading && (
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white/90 px-4 py-3 text-sm text-slate-700 shadow-sm backdrop-blur">
          <Loader2 className="h-4 w-4 animate-spin text-brand-600" />
          {t("province.loading", { name: disasterName || activeDisaster || "" })}
        </div>
      )}

      {guide && currentProvince && (
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <ChecklistSection
              provinceSlug={currentProvince.slug}
              disasterCode={guide.disasterCode}
              items={guide.before}
            />
            <TipsSection title={t("province.tips.during")} sections={guide.during} />
            <TipsSection title={t("province.tips.after")} sections={guide.after} />
          </div>
          <div className="space-y-4">
            <ShelterSection shelters={shelters} />
            <EmergencySection contacts={contacts} />
          </div>
        </div>
      )}

      {!loading && !guide && (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white px-4 py-6 text-center text-sm text-slate-600">
          {t("province.noGuide")}
        </div>
      )}
    </div>
  );
}
