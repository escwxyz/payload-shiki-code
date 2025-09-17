import type { BundledLanguage, BundledTheme, HighlighterGeneric } from "shiki";
import { getSingletonHighlighter } from "shiki";
import type { PayloadShikiCodeConfig } from "./types.js";
import { extractThemeOptions } from "./utils/themes.js";

interface PluginStore {
  config: PayloadShikiCodeConfig;
  highlighter?: HighlighterGeneric<BundledLanguage, BundledTheme>;
  initialized: boolean;
  isLocalizationEnabled?: boolean;
}

let pluginStore: PluginStore | undefined;

export function setPluginConfig(config: PayloadShikiCodeConfig) {
  pluginStore = {
    config,
    initialized: false,
  };
}

export function getPluginConfig(): PayloadShikiCodeConfig | undefined {
  return pluginStore?.config;
}

export function getPluginStore(): PluginStore | undefined {
  return pluginStore;
}

export function setHighlighter(
  highlighter: HighlighterGeneric<BundledLanguage, BundledTheme>
) {
  if (pluginStore) {
    pluginStore.highlighter = highlighter;
    pluginStore.initialized = true;
  }
}

export function getHighlighter():
  | HighlighterGeneric<BundledLanguage, BundledTheme>
  | undefined {
  return pluginStore?.highlighter;
}

export async function initializeHighlighter(
  config: PayloadShikiCodeConfig
): Promise<void> {
  if (
    !config.disabled &&
    config.cacheHighlighter !== false &&
    !pluginStore?.highlighter
  ) {
    const langs = config.languages || ["text"];

    const allThemes = [
      ...extractThemeOptions().light,
      ...extractThemeOptions().dark,
    ].map((theme) => theme.value);

    const highlighter = await getSingletonHighlighter({
      themes: allThemes,
      langs,
      ...config.shiki?.highlighterOptions,
    });

    setHighlighter(highlighter);

    if (config.hooks?.onHighlighterCreate) {
      await config.hooks.onHighlighterCreate(highlighter);
    }
  }
}

export function isInitialized(): boolean {
  return pluginStore?.initialized ?? false;
}
