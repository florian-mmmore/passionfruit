import de from "./de.json";
import en from "./en.json";

export type Locale = "de" | "en";

export const LOCALES = ["de", "en"] as const;

export const DEFAULT_LOCALE: Locale = "de";

type TranslationValue =
  | string
  | number
  | boolean
  | TranslationValue[]
  | { [k: string]: TranslationValue };
type TranslationDict = { [k: string]: TranslationValue };

const translations: Record<Locale, TranslationDict> = { de, en };

function getNestedRaw(
  obj: TranslationDict,
  path: string,
): TranslationValue | undefined {
  const parts = path.split(".");
  let current: TranslationValue = obj;

  for (const part of parts) {
    if (
      current !== null &&
      typeof current === "object" &&
      !Array.isArray(current) &&
      part in current
    ) {
      current = current[part];
    } else {
      return undefined;
    }
  }

  return current;
}

function interpolate(
  template: string,
  vars: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => {
    const value = vars[key];
    return value !== undefined ? String(value) : `{${key}}`;
  });
}

export function useTranslations(locale: Locale) {
  function t(key: string, vars?: Record<string, string | number>): string {
    const raw = getNestedRaw(translations[locale], key);

    if (typeof raw === "string") {
      return vars ? interpolate(raw, vars) : raw;
    }

    if (import.meta.env.DEV) {
      console.warn(
        `[i18n] Missing translation: "${key}" for locale "${locale}"`,
      );
    }

    return `[missing: ${key}]`;
  }

  function tList(key: string): string[] {
    const raw = getNestedRaw(translations[locale], key);
    if (Array.isArray(raw) && raw.every((v) => typeof v === "string")) {
      return raw as string[];
    }
    if (import.meta.env.DEV) {
      console.warn(
        `[i18n] Missing or non-string-array list: "${key}" for locale "${locale}"`,
      );
    }
    return [];
  }

  return { t, tList, locale };
}

export function getLocalizedPath(path: string, locale: Locale): string {
  // Deutsch am Apex (kein Prefix), Englisch unter /en; trailing slash always.
  const clean = path.replace(/^\/+/, "").replace(/\/+$/, "");
  const prefix = locale === "de" ? "" : "/en";
  if (!clean) return prefix === "" ? "/" : `${prefix}/`;
  return `${prefix}/${clean}/`;
}
