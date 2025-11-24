import { Province } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMemo, useState } from "react";
import { Loader2, MapPin } from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface Props {
  provinces: Province[];
  selectedSlug?: string;
  onSelect: (slug: string) => void;
  onSubmit: () => void;
  loading?: boolean;
}

export default function ProvinceSelectorCard({ provinces, selectedSlug, onSelect, onSubmit, loading }: Props) {
  const [query, setQuery] = useState("");
  const { t } = useI18n();

  const filtered = useMemo(() => {
    if (!query) return provinces;
    const lower = query.toLowerCase();
    return provinces.filter((p) => p.name.toLowerCase().includes(lower) || p.region?.toLowerCase().includes(lower));
  }, [provinces, query]);

  return (
    <section
      id="chon-tinh"
      className="mx-auto grid max-w-6xl gap-6 rounded-3xl border border-white/60 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur lg:grid-cols-3 sm:p-8"
    >
      <div className="space-y-3 lg:col-span-1">
        <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-white">
          <MapPin className="h-4 w-4" />
          {t("selector.tag")}
        </div>
        <h2 className="text-2xl font-bold text-slate-900">{t("selector.title")}</h2>
        <p className="text-sm text-slate-600">{t("selector.subtitle")}</p>
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-blue-50/80 to-slate-50 px-4 py-3 text-sm text-slate-700">
          <p className="font-semibold text-slate-900">{t("selector.tipLabel")}</p>
          <p>{t("selector.tipText")}</p>
        </div>
      </div>
      <div className="space-y-4 lg:col-span-2">
        <Input
          placeholder={t("selector.placeholder")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="grid gap-3 sm:grid-cols-2">
          {filtered.map((province) => {
            const active = selectedSlug === province.slug;
            return (
              <button
                key={province.id}
                onClick={() => onSelect(province.slug)}
                className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left shadow-sm transition ${
                  active
                    ? "border-brand-500 bg-gradient-to-r from-brand-500 to-sky-500 text-white"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div>
                  <div className="font-semibold">{province.name}</div>
                  {province.region && (
                    <div className={`text-xs ${active ? "text-sky-50/90" : "text-slate-500"}`}>{province.region}</div>
                  )}
                </div>
                <MapPin className={`h-5 w-5 ${active ? "text-white" : "text-slate-400"}`} />
              </button>
            );
          })}
          {filtered.length === 0 && <p className="text-sm text-slate-500">{t("selector.empty")}</p>}
        </div>
        <Button onClick={onSubmit} className="mt-2" disabled={loading} size="lg">
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {t("selector.submit")}
        </Button>
      </div>
    </section>
  );
}
