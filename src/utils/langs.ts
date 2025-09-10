import {
  type BundledLanguage,
  bundledLanguages,
  bundledLanguagesInfo,
  getSingletonHighlighter,
  isSpecialLang,
  type LanguageRegistration,
  type SpecialLanguage,
} from "shiki";
import { PluginStateManager } from "../PluginStateManager.js";

export function getFilteredLanguageOptions(
  configuredLanguages: Array<
    BundledLanguage | SpecialLanguage | LanguageRegistration
  >
): Array<{ label: string; value: string }> {
  const configuredLangIds = new Set<string>();

  for (const lang of configuredLanguages) {
    if (typeof lang === "string") {
      configuredLangIds.add(lang);
      // Also add the canonical name in case it's an alias
      configuredLangIds.add(getCanonicalLanguageName(lang));
    } else if (lang.name) {
      // It's a LanguageRegistration object
      configuredLangIds.add(lang.name);
    }
  }

  const languageOptions = bundledLanguagesInfo.map((info) => ({
    label: info.name,
    value: info.id,
  }));

  // Filter language options to only include configured languages
  return languageOptions.filter(
    (option) =>
      configuredLangIds.has(option.value) || configuredLangIds.has(option.label)
  );
}

/**
 * Get the canonical language name for a given language string
 *
 * Uses PluginStateManager's alias resolution to resolve aliases to canonical names
 */
function getCanonicalLanguageName(lang: string): string {
  try {
    const stateManager = PluginStateManager.getInstance();
    return stateManager.resolveLanguageAlias(lang);
  } catch {
    // Fallback: resolve locally if state manager is not initialized
    // This maintains compatibility during initialization
    const langInfo = bundledLanguagesInfo.find(
      (info) => info.id === lang || info.aliases?.includes(lang)
    );
    return langInfo?.id || lang;
  }
}

/**
 * Normalize and deduplicate a list of language inputs
 *
 * Converts aliases to canonical names and removes duplicates
 */
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

      // Skip if we've already seen this canonical name
      if (normalized.has(canonical)) {
        continue;
      }

      normalized.add(canonical);

      // Validate that it's a supported language
      if (isSpecialLang(canonical) || canonical in bundledLanguages) {
        result.push(canonical as BundledLanguage | SpecialLanguage);
      } else {
        console.warn(
          `Language "${lang}" (canonical: "${canonical}") is not supported. Available languages: ${Object.keys(bundledLanguages).join(", ")}`
        );
      }
    } else {
      // It's a LanguageRegistration object
      const langName = lang.name || "unknown";
      if (!normalized.has(langName)) {
        normalized.add(langName);
        result.push(lang);
      }
    }
  }

  return result;
}

/**
 * Get the preferred alias for a language name/id, or return the name/id if no alias exists
 */
export function getLanguageAlias(lang: string): string {
  // First get the canonical name in case the input is already an alias
  const canonical = getCanonicalLanguageName(lang);

  // Find the language info for this canonical name
  const langInfo = bundledLanguagesInfo.find((info) => info.id === canonical);

  // Return the first alias if available, otherwise return the canonical name
  return langInfo?.aliases?.[0] ?? canonical;
}

/**
 * Check if a language string (including aliases) is supported
 */
export function isLanguageSupportedByName(lang: string): boolean {
  const canonical = getCanonicalLanguageName(lang);
  return isSpecialLang(canonical) || canonical in bundledLanguages;
}

/**
 * Load a language dynamically
 */
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
    // Simply call getSingletonHighlighter again - it will merge with existing instance
    await getSingletonHighlighter({
      langs: prepared,
    });
  }
}

/**
 * Prepare languages for the highlighter
 */
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
