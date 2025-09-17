import type { Config, Plugin } from "payload";
import { initializeHighlighter, setPluginConfig } from "./store.js";
import type { PayloadShikiCodeConfig } from "./types.js";
import { normalizeLanguages } from "./utils/langs.js";

export const payloadShikiCode =
  (pluginOptions: PayloadShikiCodeConfig = {}): Plugin =>
  (incomingConfig: Config): Config => {
    if (pluginOptions.disabled) {
      return incomingConfig;
    }

    try {
      const normalizedConfig = { ...pluginOptions };
      if (pluginOptions.languages) {
        normalizedConfig.languages = normalizeLanguages(
          pluginOptions.languages
        );
      }
      setPluginConfig(normalizedConfig);
    } catch (error) {
      console.error("Failed to initialize Payload Shiki Code plugin:", error);
    }

    const config: Config = {
      ...incomingConfig,

      onInit: async (payload) => {
        if (incomingConfig.onInit) {
          await incomingConfig.onInit(payload);
        }
        try {
          const normalizedConfig = { ...pluginOptions };
          if (pluginOptions.languages) {
            normalizedConfig.languages = normalizeLanguages(
              pluginOptions.languages
            );
          }
          await initializeHighlighter(normalizedConfig);
        } catch (error) {
          console.error(
            "Failed to complete Payload Shiki Code plugin initialization:",
            error
          );
        }
      },
    };

    return config;
  };

export { createBlockConfig } from "./config.js";
export type { PayloadShikiCodeConfig } from "./types.js";
