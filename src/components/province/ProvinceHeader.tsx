import type { Province } from "@/types";
import { MapPin } from "lucide-react";

interface Props {
  province?: Province;
}

export default function ProvinceHeader({ province }: Props) {
  if (!province) return null;
  return (
    <div className="mb-4 overflow-hidden rounded-2xl border border-white/70 bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 px-5 py-6 shadow-xl shadow-slate-900/10">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-sky-200">
        <MapPin className="h-4 w-4 text-sky-300" />
        Tỉnh/Thành phố
      </div>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-white drop-shadow-sm">{province.name}</h1>
          {province.region && <p className="text-sm text-sky-100">Khu vực: {province.region}</p>}
        </div>
        <div className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-sky-50">
          {province.slug}
        </div>
      </div>
    </div>
  );
}
