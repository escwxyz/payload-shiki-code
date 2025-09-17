import type {
  BundledLanguage,
  BundledTheme,
  CodeToHastOptions,
  HighlighterCoreOptions,
  HighlighterGeneric,
  LanguageRegistration,
  ShikiTransformer,
  SpecialLanguage,
  ThemeRegistration,
} from "shiki";

/**
 * Function type for creating custom transformers with access to plugin options
 */
export type TransformerFactory = (
  options: PayloadShikiCodeConfig
) => ShikiTransformer;

/**
 * Extended Shiki options for maximum customization
 */
export type ShikiOptions = {
  /**
   * Themes configuration - can be bundled themes, custom themes, or theme registrations
   */
  themes?: {
    light: BundledTheme | ThemeRegistration;
    dark: BundledTheme | ThemeRegistration;
    [key: string]: BundledTheme | ThemeRegistration;
  };

  /**
   * Shiki highlighter core options
   * Allows full control over the highlighter configuration
   */
  highlighterOptions?: Partial<HighlighterCoreOptions>;

  /**
   * Default code-to-hast options for rendering
   * These can be overridden per code block
   */
  codeToHastOptions?: Partial<CodeToHastOptions>;

  /**
   * Custom transformers to apply during rendering
   * Can be transformer instances or factory functions
   */
  transformers?: Array<ShikiTransformer | TransformerFactory>;
};

/**
 * Display options for code blocks
 */
export type DisplayOptions = {
  /**
   * Whether to show line numbers
   * @default true
   */
  lineNumbers?: boolean;

  /**
   * Whether to show the language label
   * @default true
   */
  showLanguage?: boolean;

  /**
   * Whether to show the copy button
   * @default true
   */
  copyButton?: boolean;

  /**
   * Starting line number for display
   * @default 1
   */
  startLineNumber?: number;

  // TODO: Symbol notation will be supported in a future release
  // /**
  //  * Style for notation display
  //  * - 'symbol': Show +/- symbols before the line
  //  * - 'border': Show colored left border
  //  * @default 'border'
  //  */
  // notationStyle?: 'symbol' | 'border';

  /**
   * Custom CSS classes to apply to the code block container
   */
  containerClasses?: string[];

  /**
   * Custom CSS classes to apply to the pre element
   */
  preClasses?: string[];

  /**
   * Custom CSS classes to apply to the code element
   */
  codeClasses?: string[];
};

/**
 * Code notation options for highlighting, diffs, etc.
 */
export type NotationOptions = {
  // TODO: Symbol notation will be supported in a future release
  // /**
  //  * Style for notation display
  //  * - 'symbol': Show +/- symbols before the line
  //  * - 'border': Show colored left border
  //  * @default 'border'
  //  */
  // style?: 'symbol' | 'border';

  /**
   * Line highlighting notation
   * Format: {1,3-5,7}
   */
  highlight?: {
    /**
     * Background color for highlighted lines
     */
    backgroundColor?: string;
    /**
     * Border color for highlighted lines
     */
    borderColor?: string;
    /**
     * CSS class for highlighted lines
     */
    className?: string;
  };

  /**
   * Diff notation for added lines
   * Format: {+1,3-5}
   */
  add?: {
    /**
     * Background color for added lines
     */
    backgroundColor?: string;

    borderColor?: string;
    /**
     * CSS class for added lines
     */
    className?: string;
    // TODO: Symbol notation will be supported in a future release
    // /**
    //  * Symbol to show for added lines
    //  */
    // symbol?: string;
  };

  /**
   * Diff notation for removed lines
   * Format: {-1,3-5}
   */
  remove?: {
    /**
     * Background color for removed lines
     */
    backgroundColor?: string;
    /**
     * Border color for removed lines
     */
    borderColor?: string;
    /**
     * CSS class for removed lines
     */
    className?: string;
    // TODO: Symbol notation will be supported in a future release
    // /**
    //  * Symbol to show for removed lines
    //  */
    // symbol?: string;
  };
};

/**
 * Plugin lifecycle hooks
 */
export type PluginHooks = {
  /**
   * Called when the highlighter is created
   */
  onHighlighterCreate?: (
    highlighter: HighlighterGeneric<BundledLanguage, BundledTheme>
  ) => void | Promise<void>;

  /**
   * Called when the highlighter is disposed
   */
  onHighlighterDispose?: () => void | Promise<void>;

  /**
   * Called before a code block is rendered
   */
  beforeRender?: (
    code: string,
    lang: string,
    options: unknown
  ) => void | Promise<void>;

  /**
   * Called after a code block is rendered
   */
  afterRender?: (
    html: string,
    code: string,
    lang: string
  ) => void | Promise<void>;
};

/**
 * Style options for code blocks
 */
export type StyleOptions = {
  /**
   * CSS variables to inject
   */
  cssVariables?: Record<string, string>;

  /**
   * Border color
   */
  borderColor?: string;

  /**
   * Border radius
   */
  borderRadius?: string;

  /**
   * Background color (if not using theme colors)
   */
  backgroundColor?: string;

  /**
   * Padding around the code
   */
  padding?: string;

  /**
   * Font family for code
   */
  fontFamily?: string;

  /**
   * Font size for code
   */
  fontSize?: string;

  /**
   * Line height
   */
  lineHeight?: string;

  /**
   * Margin right for line numbers
   */
  lineNumberMarginRight?: string;

  /**
   * Copy button styling options
   */
  copyButton?: {
    /**
     * Background color for copy button (light theme)
     */
    backgroundColor?: string;
    /**
     * Text color for copy button (light theme)
     */
    color?: string;
    /**
     * Border color for copy button (light theme)
     */
    borderColor?: string;
    /**
     * Background color on hover (light theme)
     */
    hoverBackgroundColor?: string;
    /**
     * Border color on hover (light theme)
     */
    hoverBorderColor?: string;
    /**
     * Success state color
     */
    successColor?: string;
    /**
     * Success state background color
     */
    successBackgroundColor?: string;
    /**
     * Success state border color
     */
    successBorderColor?: string;
    /**
     * Success state hover background color
     */
    successHoverBackgroundColor?: string;
    /**
     * Dark theme styles
     */
    dark?: {
      backgroundColor?: string;
      color?: string;
      borderColor?: string;
      hoverBackgroundColor?: string;
      hoverBorderColor?: string;
      successColor?: string;
      successBackgroundColor?: string;
      successBorderColor?: string;
      successHoverBackgroundColor?: string;
    };
  };
};

export type PayloadShikiCodeConfig = {
  /**
   * Enable or disable the plugin
   * @default false
   */
  disabled?: boolean;

  /**
   * The slug for the code block in richtext
   * @default 'code'
   */
  blockSlug?: string;

  /**
   * Interface name for the generated TypeScript interface
   * @default 'CodeBlock'
   */
  blockInterfaceName?: string;

  /**
   * Shiki configuration options
   */
  shiki?: ShikiOptions;

  /**
   * Default display options for code blocks
   * Can be overridden per code block
   */
  displayOptions?: DisplayOptions;

  /**
   * Default notation options
   */
  notationOptions?: NotationOptions;

  /**
   * Default style options
   */
  styleOptions?: StyleOptions;

  /**
   * Plugin lifecycle hooks
   */
  hooks?: PluginHooks;

  /**
   * Whether to cache the highlighter instance globally
   * @default true
   */
  cacheHighlighter?: boolean;

  /**
   * Custom validation for code blocks
   */
  // validate?: (
  //   value: any,
  //   options: { req: PayloadRequest }
  // ) => string | boolean | Promise<string | boolean>;

  /**
   * Allow users to select themes in the UI
   * @default false
   */
  // allowThemeSelection?: boolean;

  /**
   * Available themes for selection if allowThemeSelection is true
   */
  // availableThemes?: {
  //   light: BundledTheme[];
  //   dark: BundledTheme[];
  // };

  /**
   * Allow custom languages to be entered
   * @default false
   */
  // allowCustomLanguages?: boolean;

  /**
   * Custom block configuration overrides
   */
  // blockConfig?: Partial<Block>;

  /**
   * Languages to support in the plugin
   *
   * Only these languages will be loaded and available for selection
   *
   * This helps reduce bundle size by only including needed languages
   *
   * Supports bundled languages, special languages (ansi, text), and custom language registrations
   *
   * Aliases will be excluded automatically
   * @default ["text"]
   */
  languages?: Array<BundledLanguage | SpecialLanguage | LanguageRegistration>;
};

/**
 * Code block data structure matching Payload fields
 */
export type CodeBlockData = {
  language: BundledLanguage | SpecialLanguage | string;
  code: string;
  fileName?: string;
  notationType?: "add" | "remove" | "highlight"; // TODO: focus
  notationRange?: string[];
  lightTheme?: BundledTheme;
  darkTheme?: BundledTheme;
  showLineNumbers?: boolean;
  showLanguageLabel?: boolean;
  startLineNumber?: number;
};
