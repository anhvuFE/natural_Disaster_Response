import type { DisasterType } from "@/types";
import { cn } from "@/lib/utils";
import { Flame, Droplets, Wind } from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface Props {
  items: DisasterType[];
  active?: string;
  onChange: (code: string) => void;
}

const fallbackIcon = (code?: string) => {
  if (!code) return <Wind className="h-4 w-4" />;
  if (code.toLowerCase().includes("storm")) return <Wind className="h-4 w-4" />;
  if (code.toLowerCase().includes("flood")) return <Droplets className="h-4 w-4" />;
  return <Flame className="h-4 w-4" />;
};

export default function DisasterTabs({ items, active, onChange }: Props) {
  const { t } = useI18n();
  return (
    <div className="flex flex-wrap gap-2">
      {items.length === 0 && <p className="text-sm text-slate-500">{t("tabs.noDisaster")}</p>}
      {items.map((item) => {
        const selected = active === item.code;
        return (
          <button
            key={item.code}
            onClick={() => onChange(item.code)}
            className={cn(
              "flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition",
              selected
                ? "border-brand-500 bg-gradient-to-r from-brand-500 to-sky-500 text-white shadow"
                : "border-slate-200 bg-white/90 text-slate-700 hover:border-slate-300 hover:bg-white"
            )}
          >
            {item.icon ? <span>{item.icon}</span> : fallbackIcon(item.code)}
            {item.name}
          </button>
        );
      })}
      {items.length === 0 && <p className="text-sm text-slate-500">Chưa có loại thiên tai.</p>}
    </div>
  );
}
