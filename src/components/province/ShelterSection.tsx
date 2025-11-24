import type { Shelter } from "@/types";
import { Phone, MapPinned, Map } from "lucide-react";
import MapPreview from "@/components/province/MapPreview";
import { useI18n } from "@/lib/i18n";

interface Props {
  shelters: Shelter[];
}

export default function ShelterSection({ shelters }: Props) {
  const { t } = useI18n();
  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white/95 p-5 shadow-md shadow-slate-900/5 backdrop-blur">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">{t("shelter.title")}</h3>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
          {t("shelter.count", { count: shelters.length })}
        </span>
      </div>
      <div className="space-y-3">
        {shelters.map((shelter) => (
          <div key={shelter.id} className="rounded-xl border border-slate-100 bg-gradient-to-r from-slate-50 to-white px-4 py-3 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="sm:w-2/3">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <MapPinned className="h-4 w-4 text-brand-600" />
                  {shelter.name}
                </div>
                <p className="text-sm text-slate-600">{shelter.address}</p>
                {shelter.hours && <p className="text-xs text-slate-500">{t("shelter.hours", { hours: shelter.hours })}</p>}
                {shelter.note && <p className="text-xs text-slate-500">{shelter.note}</p>}
                <div className="mt-2 inline-flex gap-2 rounded-full bg-white/90 px-3 py-1 text-xs text-slate-500">
                  <span>Lat: {shelter.lat.toFixed(3)}</span>
                  <span>Lng: {shelter.lng.toFixed(3)}</span>
                </div>
                <MapPreview shelter={shelter} />
              </div>
              <div className="flex flex-col gap-2 text-sm text-brand-700 sm:w-1/3 sm:items-end">
                {shelter.phone && (
                  <a
                    className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 font-semibold text-brand-700 transition hover:bg-brand-100"
                    href={`tel:${shelter.phone}`}
                  >
                    <Phone className="h-4 w-4" /> {t("shelter.call")}
                  </a>
                )}
                <a
                  className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-800"
                  href={`https://www.openstreetmap.org/?mlat=${shelter.lat}&mlon=${shelter.lng}#map=16/${shelter.lat}/${shelter.lng}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Map className="h-4 w-4" /> {t("shelter.openMap")}
                </a>
              </div>
            </div>
          </div>
        ))}
        {shelters.length === 0 && <p className="text-sm text-slate-500">{t("shelter.empty")}</p>}
      </div>
    </section>
  );
}
