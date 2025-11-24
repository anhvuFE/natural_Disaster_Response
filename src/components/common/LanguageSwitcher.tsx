import { useI18n } from "@/lib/i18n";

export default function LanguageSwitcher() {
  const { lang, setLang, available, t } = useI18n();

  return (
    <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-white/90 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600 shadow-sm">
      <span className="hidden sm:inline">{t("language.switch")}:</span>
      {available.map(({ code, label }) => {
        const active = code === lang;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLang(code)}
            title={label}
            aria-pressed={active}
            className={`rounded-full px-2 py-1 transition ${
              active ? "bg-slate-900 text-white shadow" : "hover:bg-slate-100"
            }`}
          >
            {code.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
