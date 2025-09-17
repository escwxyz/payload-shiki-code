import type { BundledLanguage, BundledTheme, HighlighterGeneric } from "shiki";
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
): Promise<HighlighterGeneric<BundledLanguage, BundledTheme>> {
  const activeConfig = config || getPluginConfig();

  if (!activeConfig) {
    throw new Error("No configuration available. Plugin not initialized.");
  }

  const storedHighlighter = getStoredHighlighter();
  if (storedHighlighter) {
    return storedHighlighter;
  }

  const langs = activeConfig.languages || ["text"];

  const allThemes = [
    ...extractThemeOptions().light,
    ...extractThemeOptions().dark,
  ].map((theme) => theme.value);

  const highlighter = await getSingletonHighlighter({
    themes: allThemes,
    langs,
    ...activeConfig.shiki?.highlighterOptions,
  });

  setHighlighter(highlighter);

  if (activeConfig.hooks?.onHighlighterCreate) {
    await activeConfig.hooks.onHighlighterCreate(highlighter);
  }

  return highlighter;
}
