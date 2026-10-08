import { App } from "obsidian";
import { en } from "./en";
import { ru } from "./ru";
import { zh } from "./zh";
import { de } from "./de";
import { fr } from "./fr";

const TRANSLATIONS: Record<string, Record<string, string>> = {
  en,
  ru,
  zh,
  de,
  fr,
};

export function getLocale(app: App): string {
  try {
    const locale = (app.vault as any).getConfig ? (app.vault as any).getConfig("locale") || (app.vault as any).getConfig("language") : "en";
    if (typeof locale === "string" && locale.startsWith("ru")) return "ru";
    if (typeof locale === "string" && (locale.startsWith("zh"))) return "zh";
    if (typeof locale === "string" && locale.startsWith("de")) return "de";
    if (typeof locale === "string" && locale.startsWith("fr")) return "fr";
    if (typeof locale === "string" && TRANSLATIONS[locale]) return locale;
  } catch (e) {}
  return "en";
}

export function t(app: App, key: string, def?: string): string {
  const loc = getLocale(app);
  const dict = TRANSLATIONS[loc] || TRANSLATIONS.en;
  return dict[key] || TRANSLATIONS.en[key] || def || key;
}
