import type { EmergencyContact } from "@/types";
import { PhoneCall } from "lucide-react";

interface Props {
  contacts: EmergencyContact[];
}

export default function EmergencySection({ contacts }: Props) {
  const grouped = contacts.reduce<Record<string, EmergencyContact[]>>((acc, contact) => {
    const key = contact.category || "Khác";
    acc[key] = acc[key] ? [...acc[key], contact] : [contact];
    return acc;
  }, {});

  const categories = Object.entries(grouped);

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white/95 p-5 shadow-md shadow-slate-900/5 backdrop-blur">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Số khẩn cấp</h3>
        <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
          Gọi ngay
        </span>
      </div>
      <div className="space-y-3">
        {categories.map(([category, list]) => (
          <div key={category} className="rounded-xl border border-slate-100 bg-gradient-to-r from-amber-50/60 to-white px-4 py-3">
            <div className="text-sm font-semibold text-slate-900">{category}</div>
            <div className="mt-2 grid gap-2">
              {list.map((contact) => (
                <a
                  key={contact.id}
                  href={`tel:${contact.phone}`}
                  className="flex items-center justify-between rounded-lg border border-transparent px-2 py-2 text-sm text-brand-700 transition hover:border-amber-200 hover:bg-amber-50"
                >
                  <div>
                    <div className="font-semibold">{contact.name}</div>
                    {contact.note && <div className="text-xs text-slate-500">{contact.note}</div>}
                  </div>
                  <div className="flex items-center gap-2 font-semibold">
                    <PhoneCall className="h-4 w-4" />
                    {contact.phone}
                  </div>
                </a>
              ))}
            </div>
          </div>
        ))}
        {contacts.length === 0 && <p className="text-sm text-slate-500">Chưa có số khẩn cấp.</p>}
      </div>
    </section>
  );
}
