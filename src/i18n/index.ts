
import ru from "./ru";
import pl from "./pl";
import de from "./de";
import fr from "./fr";
import es from "./es";
import it from "./it";
import pt from "./pt";
import ptBR from "./pt-BR";
import ja from "./ja";
import ko from "./ko";
import zh from "./zh";
import zhTW from "./zh-TW";
import uk from "./uk";
import tr from "./tr";
import nl from "./nl";
import { logError } from "src/utils";
import { getLanguage } from "obsidian";

const dicts: Record<string, Record<string, string>> = {
  ru,
  pl,
  de,
  fr,
  es,
  it,
  pt,
  "pt-br": ptBR,
  ja,
  ko,
  zh,
  "zh-tw": zhTW,
  uk,
  tr,
  nl,
};

export function translate(key: string): string {
  logError("Translating: ");
  try {
    const lang = getLanguage() || "en";
    logError("App language: " + lang);
    const loc = String(lang).toLowerCase();
    if (lang === "en") {
      return key;
    }
    return dicts[loc][key] || key;
  } catch (e) {
    logError("Translation error: " + String(e));
    return key;
  }
}
