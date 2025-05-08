import translations from "@/lib/translation";
import { useLanguage } from "@/context/LanguageProvider";

export default function useTranslation() {
  const { language } = useLanguage();

  const t = (key, vars = {}) => {
    const value = translations[language]?.[key] || key;

    // Ganti {placeholders} dalam string jika ada
    if (typeof value === "string") {
      return value.replace(/{(.*?)}/g, (_, v) => vars[v] || `{${v}}`);
    }

    return value;
  };

  return { t, language };
}
