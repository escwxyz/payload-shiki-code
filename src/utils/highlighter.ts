import type { BundledLanguage, BundledTheme } from "shiki";
import { type HighlighterGeneric } from "shiki";
import { PluginStateManager } from "../PluginStateManager.js";
import type { PayloadShikiCodeConfig, PluginContext } from "../types.js";

/**
 * Get or create a highlighter instance using the PluginStateManager
 */
export async function getHighlighter(
  configOrContext?: PayloadShikiCodeConfig | PluginContext
): Promise<HighlighterGeneric<BundledLanguage, BundledTheme>> {
  const stateManager = PluginStateManager.getInstance();

  let config: PayloadShikiCodeConfig;
  if (configOrContext && "config" in configOrContext) {
    config = configOrContext.config;
  } else if (configOrContext) {
    config = configOrContext;
  } else {
    config = stateManager.getContext().config;
  }

  return await stateManager.getHighlighter(config);
}
