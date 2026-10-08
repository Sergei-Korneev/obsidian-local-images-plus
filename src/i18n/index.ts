import { App } from "obsidian";
import en from "./en";
import ru from "./ru";

const dicts: Record<string, Record<string, string>> = { en, ru };

export function translate(app: App, key: string): string {
  try {
    const locale = (app as any).vault?.getConfig?.("locale") || (app as any).vault?.getConfig?.("language") || "en";
    const locStr = String(locale).toLowerCase();
    const base = locStr.startsWith("ru") ? "ru" : "en";
    return dicts[base][key] || dicts.en[key] || key;
  } catch (e) {
    return key;
  }
}
