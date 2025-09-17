import type {
  BundledLanguage,
  BundledTheme,
  HighlighterGeneric,
  SpecialLanguage,
} from "shiki";
import { getSingletonHighlighter } from "shiki";
import {
  getPluginConfig,
  getHighlighter as getStoredHighlighter,
  setHighlighter,
} from "../store.js";
import type { PayloadShikiCodeConfig } from "../types.js";
import { extractThemeOptions } from "./themes.js";

export async function getHighlighter(
  config?: PayloadShikiCodeConfig
): Promise<
  HighlighterGeneric<BundledLanguage | SpecialLanguage, BundledTheme>
> {
  const storedConfig = getPluginConfig();
  const activeConfig = config || storedConfig;

  if (!activeConfig) {
    throw new Error("No configuration available. Plugin not initialized.");
  }

  const isDisabled = config?.disabled ?? activeConfig.disabled;
  if (isDisabled) {
    throw new Error("Plugin is disabled.");
  }

  const shouldCache =
    config?.cacheHighlighter ?? activeConfig.cacheHighlighter ?? true;
  if (shouldCache) {
    const storedHighlighter = getStoredHighlighter();
    if (storedHighlighter) {
      return storedHighlighter;
    }
  }

  const langs = activeConfig.languages || ["text"];

  const allThemes = [
    ...extractThemeOptions().light,
    ...extractThemeOptions().dark,
  ].map((theme) => theme.value);

  const highlighter = (await getSingletonHighlighter({
    themes: allThemes,
    langs,
    ...activeConfig.shiki?.highlighterOptions,
  })) as HighlighterGeneric<BundledLanguage | SpecialLanguage, BundledTheme>;

  if (shouldCache) {
    setHighlighter(highlighter);
  }

  if (activeConfig.hooks?.onHighlighterCreate) {
    await activeConfig.hooks.onHighlighterCreate(highlighter);
  }

  return highlighter;
}
