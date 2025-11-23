import type { TipsSection as TipsSectionType } from "@/types";
import { Lightbulb } from "lucide-react";

interface Props {
  title: string;
  sections: TipsSectionType[];
}

export default function TipsSection({ title, sections }: Props) {
  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white/95 p-5 shadow-md shadow-slate-900/5 backdrop-blur">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-amber-600 shadow-inner">
          <Lightbulb className="h-5 w-5" />
        </span>
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      </div>
      <div className="space-y-4">
        {sections.map((section) => (
          <div key={section.id} className="rounded-xl border border-slate-100 bg-gradient-to-r from-slate-50 to-white px-4 py-3">
            <h4 className="text-sm font-semibold text-slate-900">{section.title}</h4>
            <ul className="mt-2 space-y-1 text-sm text-slate-700">
              {section.bullets.map((bullet, idx) => (
                <li key={idx} className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-500" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
        {sections.length === 0 && <p className="text-sm text-slate-500">Chưa có nội dung.</p>}
      </div>
    </section>
  );
}
