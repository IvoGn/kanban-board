import { useTranslation } from "../LanguageContext";
import { type Language } from "../i18n";

const languageOptions: Array<{ value: Language; labelKey: "languageDe" | "languageEn" }> = [
  { value: "de", labelKey: "languageDe" },
  { value: "en", labelKey: "languageEn" },
];

export default function LanguageSwitch() {
  const { language, setLanguage, t } = useTranslation();

  return (
    <div className="flex items-center gap-2 text-sm text-slate-600">
      <span>{t("languageSwitchLabel")}</span>
      <div className="inline-flex rounded-full border border-slate-300 bg-white p-1 shadow-sm">
        {languageOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setLanguage(option.value)}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
              language === option.value
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {t(option.labelKey)}
          </button>
        ))}
      </div>
    </div>
  );
}
