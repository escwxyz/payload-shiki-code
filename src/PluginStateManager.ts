import type { BundledLanguage, BundledTheme, HighlighterGeneric } from "shiki";
import { bundledLanguagesInfo, getSingletonHighlighter } from "shiki";
import type { PayloadShikiCodeConfig, PluginContext } from "./types.js";
import { normalizeLanguages } from "./utils/langs.js";
import { extractThemeOptions } from "./utils/themes.js";

/**
 * Singleton state manager for the Payload Shiki Code plugin.
 */
export class PluginStateManager {
  private static instance: PluginStateManager | null = null;
  private context: PluginContext | null = null;
  private aliasMap: Record<string, string> = {};
  private initialized = false;

  private constructor() {}

  /**
   * Get the singleton instance
   */
  static getInstance(): PluginStateManager {
    if (!PluginStateManager.instance) {
      PluginStateManager.instance = new PluginStateManager();
    }
    return PluginStateManager.instance;
  }

  /**
   * Initialize the plugin state with configuration (synchronous)
   *
   * This sets up the basic context without creating the highlighter
   */
  initializeSync(config: PayloadShikiCodeConfig): void {
    if (this.initialized && this.context?.config === config) {
      return;
    }

    this.buildAliasMap();

    this.context = {
      config,
      initialized: false, // Will be true after async initialization
    };

    this.initialized = true;
  }

  /**
   * Initialize the plugin state with configuration (async - creates highlighter)
   */
  async initialize(config: PayloadShikiCodeConfig): Promise<void> {
    const normalizedConfig = { ...config };
    if (config.languages) {
      normalizedConfig.languages = normalizeLanguages(config.languages);
    }

    if (!this.initialized) {
      this.initializeSync(normalizedConfig);
    }

    if (this.context && this.context.config !== normalizedConfig) {
      this.context.config = normalizedConfig;
    }

    if (
      !normalizedConfig.disabled &&
      normalizedConfig.cacheHighlighter !== false &&
      this.context &&
      !this.context.highlighter
    ) {
      await this.createHighlighter(normalizedConfig);
    }
  }

  /**
   * Get the plugin context
   */
  getContext(): PluginContext {
    if (!this.context) {
      throw new Error(
        "Plugin state manager not initialized. Call initialize() first."
      );
    }
    return this.context;
  }

  /**
   * Get or create the highlighter instance
   */
  async getHighlighter(
    config?: PayloadShikiCodeConfig
  ): Promise<HighlighterGeneric<BundledLanguage, BundledTheme>> {
    if (!this.context) {
      throw new Error("Context is not available");
    }

    const activeConfig = config || this.context?.config;
    if (!activeConfig) {
      throw new Error("No configuration available. Call initialize() first.");
    }

    if (this.context?.highlighter) {
      return this.context.highlighter;
    }

    await this.createHighlighter(activeConfig);

    const highlighter = this.context.highlighter;

    if (!highlighter) {
      throw new Error("Failed to get highlighter");
    }

    return highlighter;
  }

  /**
   * Resolve language alias to canonical name
   */
  resolveLanguageAlias(alias: string): string {
    return this.aliasMap[alias] || alias;
  }

  /**
   * Check if the plugin is initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Clean up all state and dispose resources
   *
   */
  // async cleanup(): Promise<void> {
  //   if (this.context?.highlighter) {
  //     this.disposeHighlighter();
  //   }

  //   if (this.context?.config.hooks?.onHighlighterDispose) {
  //     await this.context.config.hooks.onHighlighterDispose();
  //   }

  //   this.context = null;
  //   this.aliasMap = {};
  //   this.initialized = false;
  // }

  /**
   * Reset the singleton instance (useful for testing)
   *
   */
  // static async reset(): Promise<void> {
  //   if (PluginStateManager.instance) {
  //     await PluginStateManager.instance.cleanup();
  //     PluginStateManager.instance = null;
  //   }
  // }

  /**
   * Create the Shiki highlighter instance
   */
  private async createHighlighter(
    config: PayloadShikiCodeConfig
  ): Promise<void> {
    const shikiOptions = config.shiki || {};

    const langs = config.languages || ["text"];

    const allThemes = [
      ...extractThemeOptions().light,
      ...extractThemeOptions().dark,
    ].map((theme) => theme.value);

    const highlighter = await getSingletonHighlighter({
      themes: allThemes, // TODO: we load all themes for now
      langs,
      ...shikiOptions.highlighterOptions,
    });

    if (this.context) {
      this.context.highlighter = highlighter;
      this.context.initialized = true;
    }

    if (config.hooks?.onHighlighterCreate) {
      await config.hooks.onHighlighterCreate(highlighter);
    }
  }

  /**
   * Dispose the highlighter instance
   *
   * We won't use this as Payload doesn't have a way like onExit
   */
  // private disposeHighlighter() {
  //   if (this.context?.highlighter) {
  //     this.context.highlighter = undefined;
  //   }

  //   if (this.context) {
  //     this.context.initialized = false;
  //   }
  // }

  /**
   * Build the language alias mapping
   */
  private buildAliasMap(): void {
    this.aliasMap = {};
    for (const lang of bundledLanguagesInfo) {
      if (lang.aliases) {
        for (const alias of lang.aliases) {
          this.aliasMap[alias] = lang.id;
        }
      }
    }
  }

  /**
   * Get display options with defaults
   */
  getDisplayOptions() {
    const context = this.getContext();
    return {
      lineNumbers: true,
      showLanguage: true,
      wrapLines: false,
      copyButton: true,
      startLineNumber: 1,
      containerClasses: [],
      preClasses: [],
      codeClasses: [],
      ...context.config.displayOptions,
    };
  }

  /**
   * Get notation options with defaults
   */
  getNotationOptions() {
    const context = this.getContext();
    return {
      style: "border" as const,
      highlight: {
        backgroundColor: "rgba(255, 255, 0, 0.1)",
        className: "highlighted",
      },
      add: {
        backgroundColor: "rgba(0, 255, 0, 0.1)",
        className: "added",
        // TODO: Symbol notation will be supported in a future release
        // symbol: "+",
      },
      remove: {
        backgroundColor: "rgba(255, 0, 0, 0.1)",
        className: "removed",
        // TODO: Symbol notation will be supported in a future release
        // symbol: "-",
      },
      ...context.config.notationOptions,
    };
  }

  /**
   * Get style options with defaults
   */
  getStyleOptions() {
    const context = this.getContext();
    return {
      borderColor: "#e1e4e8",
      borderRadius: "6px",
      padding: "1rem",
      fontFamily: "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
      fontSize: "14px",
      lineHeight: "1.5",
      ...context.config.styleOptions,
    };
  }

  /**
   * Get Shiki options with defaults
   */
  getShikiOptions() {
    const context = this.getContext();
    return {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
      highlighterOptions: {},
      codeToHastOptions: {},
      transformers: [],
      engine: "oniguruma" as const,
      ...context.config.shiki,
    };
  }
}
