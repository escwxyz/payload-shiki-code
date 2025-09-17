import {
  type BundledLanguage,
  bundledLanguages,
  bundledLanguagesInfo,
  getSingletonHighlighter,
  isSpecialLang,
  type LanguageRegistration,
  type SpecialLanguage,
} from "shiki";

let aliasMap: Record<string, string> | undefined;

function buildAliasMap(): Record<string, string> {
  if (aliasMap) return aliasMap;

  aliasMap = {};
  for (const lang of bundledLanguagesInfo) {
    if (lang.aliases) {
      for (const alias of lang.aliases) {
        aliasMap[alias] = lang.id;
      }
    }
  }
  return aliasMap;
}

export function resolveLanguageAlias(alias: string): string {
  const map = buildAliasMap();
  return map[alias] || alias;
}

export function getFilteredLanguageOptions(
  configuredLanguages: Array<
    BundledLanguage | SpecialLanguage | LanguageRegistration
  >
): Array<{ label: string; value: string }> {
  const configuredLangIds = new Set<string>();

  for (const lang of configuredLanguages) {
    if (typeof lang === "string") {
      configuredLangIds.add(lang);
      configuredLangIds.add(getCanonicalLanguageName(lang));
    } else if (lang.name) {
      configuredLangIds.add(lang.name);
    }
  }

  const languageOptions = bundledLanguagesInfo.map((info) => ({
    label: info.name,
    value: info.id,
  }));

  return languageOptions.filter(
    (option) =>
      configuredLangIds.has(option.value) || configuredLangIds.has(option.label)
  );
}

function getCanonicalLanguageName(lang: string): string {
  return resolveLanguageAlias(lang);
}

export function normalizeLanguages(
  languages: Array<
    BundledLanguage | SpecialLanguage | LanguageRegistration | string
  >
): Array<BundledLanguage | SpecialLanguage | LanguageRegistration> {
  const normalized = new Set<string>();
  const result: Array<
    BundledLanguage | SpecialLanguage | LanguageRegistration
  > = [];

  for (const lang of languages) {
    if (typeof lang === "string") {
      const canonical = getCanonicalLanguageName(lang);

      if (normalized.has(canonical)) {
        continue;
      }

      normalized.add(canonical);

      if (isSpecialLang(canonical) || canonical in bundledLanguages) {
        result.push(canonical as BundledLanguage | SpecialLanguage);
      } else {
        console.warn(
          `Language "${lang}" (canonical: "${canonical}") is not supported. Available languages: ${Object.keys(bundledLanguages).join(", ")}`
        );
      }
    } else {
      const langName = lang.name || "unknown";
      if (!normalized.has(langName)) {
        normalized.add(langName);
        result.push(lang);
      }
    }
  }

  return result;
}

export function getLanguageAlias(lang: string): string {
  const canonical = getCanonicalLanguageName(lang);

  const langInfo = bundledLanguagesInfo.find((info) => info.id === canonical);

  return langInfo?.aliases?.[0] ?? canonical;
}

export function isLanguageSupportedByName(lang: string): boolean {
  const canonical = getCanonicalLanguageName(lang);
  return isSpecialLang(canonical) || canonical in bundledLanguages;
}

export async function loadLanguage(
  lang: BundledLanguage | SpecialLanguage | LanguageRegistration | string
): Promise<void> {
  if (typeof lang === "string" && isSpecialLang(lang)) {
    return;
  }

  const prepared = prepareLanguages([
    lang as BundledLanguage | LanguageRegistration,
  ]);
  if (prepared.length > 0) {
    await getSingletonHighlighter({
      langs: prepared,
    });
  }
}

function prepareLanguages(
  languages: Array<BundledLanguage | SpecialLanguage | LanguageRegistration> = [
    "text",
  ]
): Array<BundledLanguage | LanguageRegistration> {
  const langsToLoad: Array<BundledLanguage | LanguageRegistration> = [];

  for (const lang of languages) {
    if (typeof lang === "string") {
      if (isSpecialLang(lang)) {
        continue;
      }
      if (lang in bundledLanguages) {
        langsToLoad.push(lang as BundledLanguage);
      } else {
        console.warn(`Language "${lang}" not found in bundled languages`);
      }
    } else {
      langsToLoad.push(lang);
    }
  }

  return langsToLoad;
}
