import translations from "@/lib/translation";
import { useLanguage } from "@/context/LanguageProvider";

export default function useTranslation() {
  const { language } = useLanguage();

  const t = (key, vars = {}) => {
    const keys = key.split(".");
    let value = translations[language];

    for (const k of keys) {
      value = value?.[k];
    }

    if (typeof value === "string") {
      return value.replace(/{(.*?)}/g, (_, v) => vars[v] || `{${v}}`);
    }

    return value || key;
  };

  return { t, language };
}
