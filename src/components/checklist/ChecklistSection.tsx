import { useChecklistState } from "@/hooks/useChecklistState";
import type { ChecklistItem } from "@/types";
import { CheckCircle2 } from "lucide-react";
import { useMemo } from "react";
import { useI18n } from "@/lib/i18n";

interface Props {
  provinceSlug: string;
  disasterCode: string;
  items: ChecklistItem[];
}

export default function ChecklistSection({ provinceSlug, disasterCode, items }: Props) {
  const { t } = useI18n();
  const sortedItems = useMemo(() => [...items].sort((a, b) => a.order - b.order), [items]);
  const [checkedIds, toggle] = useChecklistState(provinceSlug, disasterCode, sortedItems);

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white/95 p-5 shadow-md shadow-slate-900/5 backdrop-blur">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{t("checklist.title")}</h3>
          <p className="text-sm text-slate-600">{t("checklist.subtitle")}</p>
        </div>
        <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
          {t("checklist.progress", { done: checkedIds.length, total: items.length })}
        </div>
      </div>
      <div className="space-y-3">
        {sortedItems.map((item) => {
          const checked = checkedIds.includes(item.id);
          return (
            <label
              key={item.id}
              className={`flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-3 transition ${
                checked
                  ? "border-brand-500 bg-gradient-to-r from-blue-50 to-white shadow-sm"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
              }`}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggle(item.id)}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-600"
              />
              <span className="flex-1 text-sm text-slate-800">{item.text}</span>
              {checked && <CheckCircle2 className="h-5 w-5 text-brand-600" />}
            </label>
          );
        })}
        {sortedItems.length === 0 && <p className="text-sm text-slate-500">{t("checklist.empty")}</p>}
      </div>
    </section>
  );
}
