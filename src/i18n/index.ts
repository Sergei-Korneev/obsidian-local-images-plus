import { App } from "obsidian";
import en from "./en";
import ru from "./ru";

const dicts: Record<string, Record<string, string>> = { en, ru };

export function translate(app: App, key: string): string {
  try {
    const lang = app.getLanguage ? app.getLanguage() : (app as any).vault?.getConfig?.("interfaceLanguage") || "en";
    const loc = String(lang).toLowerCase();
    const base = loc.startsWith("ru") ? "ru" : "en";
    return dicts[base][key] || dicts.en[key] || key;
  } catch (e) {
    return key;
  }
}
