import type { Config, Plugin } from "payload";
import { PluginStateManager } from "./PluginStateManager.js";
import type { PayloadShikiCodeConfig } from "./types.js";

export const payloadShikiCode =
  (pluginOptions: PayloadShikiCodeConfig = {}): Plugin =>
  (incomingConfig: Config): Config => {
    if (pluginOptions.disabled) {
      return incomingConfig;
    }

    try {
      const stateManager = PluginStateManager.getInstance();
      stateManager.initializeSync(pluginOptions);
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
          const stateManager = PluginStateManager.getInstance();
          await stateManager.initialize(pluginOptions);
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
