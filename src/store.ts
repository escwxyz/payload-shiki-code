import type {
  BundledLanguage,
  BundledTheme,
  HighlighterGeneric,
  SpecialLanguage,
} from "shiki";
import { getSingletonHighlighter } from "shiki";
import type { PayloadShikiCodeConfig, PluginStore } from "./types.js";
import { extractThemeOptions } from "./utils/themes.js";

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
  highlighter: HighlighterGeneric<
    BundledLanguage | SpecialLanguage,
    BundledTheme
  >
) {
  if (pluginStore) {
    pluginStore.highlighter = highlighter;
    pluginStore.initialized = true;
  }
}

export function getHighlighter():
  | HighlighterGeneric<BundledLanguage | SpecialLanguage, BundledTheme>
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

    const highlighter = (await getSingletonHighlighter({
      themes: allThemes,
      langs,
      ...config.shiki?.highlighterOptions,
    })) as HighlighterGeneric<BundledLanguage | SpecialLanguage, BundledTheme>;

    setHighlighter(highlighter);

    if (config.hooks?.onHighlighterCreate) {
      await config.hooks.onHighlighterCreate(highlighter);
    }
  }
}

export function isInitialized(): boolean {
  return pluginStore?.initialized ?? false;
}
