import type {
  DisplayOptions,
  NotationOptions,
  ShikiOptions,
  StyleOptions,
} from "../types.js";

export const DEFAULT_DISPLAY_OPTIONS: DisplayOptions = {
  lineNumbers: true,
  showLanguage: true,
  copyButton: true,
  startLineNumber: 1,
  containerClasses: [],
  preClasses: [],
  codeClasses: [],
};

export const DEFAULT_SHIKI_OPTIONS: ShikiOptions = {
  themes: {
    light: "github-light",
    dark: "github-dark",
  },
  highlighterOptions: {},
  codeToHastOptions: {},
  transformers: [],
};

export const DEFAULT_STYLE_OPTIONS: StyleOptions = {
  borderColor: "light-dark(#e1e4e8, #30363d)",
  borderRadius: "6px",
  padding: "1rem",
  fontFamily: "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
  fontSize: "14px",
  lineHeight: "1.5",
  lineNumberMarginRight: "0.5rem",
};

export const DEFAULT_NOTATION_OPTIONS: NotationOptions = {
  highlight: {
    backgroundColor:
      "light-dark(rgba(255, 255, 0, 0.1), rgba(255, 255, 0, 0.2))",
    borderColor: "light-dark(rgb(234, 179, 8), rgb(255, 193, 7))",
    className: "highlighted",
  },
  add: {
    backgroundColor: "light-dark(rgba(0, 255, 0, 0.1), rgba(0, 255, 0, 0.2))",
    borderColor: "light-dark(rgb(34, 197, 94), rgb(35, 210, 35))",
    className: "added",
  },
  remove: {
    backgroundColor: "light-dark(rgba(255, 0, 0, 0.1), rgba(255, 0, 0, 0.2))",
    borderColor: "light-dark(rgb(239, 68, 68), rgb(220, 53, 69))",
    className: "removed",
  },
};

/**
 * CSS variable defaults for fallback values
 * These are used in buildCssVariables when no user configuration is provided
 */
export const DEFAULT_CSS_VARIABLES = {
  "--shiki-border-color": "light-dark(#e1e4e8, #30363d)",
  "--shiki-border-radius": "6px",
  "--shiki-padding": "1rem",
  "--shiki-font-family":
    "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
  "--shiki-font-size": "14px",
  "--shiki-line-height": "1.5",
  "--shiki-line-number-margin-right": "0.5rem",
  "--shiki-notation-highlight-bg":
    "light-dark(rgba(255, 255, 0, 0.1), rgba(255, 255, 0, 0.2))",
  "--shiki-notation-add-bg":
    "light-dark(rgba(0, 255, 0, 0.1), rgba(0, 255, 0, 0.2))",
  "--shiki-notation-remove-bg":
    "light-dark(rgba(255, 0, 0, 0.1), rgba(255, 0, 0, 0.2))",
  "--shiki-notation-highlight-border":
    "light-dark(rgb(234, 179, 8), rgb(255, 193, 7))",
  "--shiki-notation-add-border":
    "light-dark(rgb(34, 197, 94), rgb(35, 210, 35))",
  "--shiki-notation-remove-border":
    "light-dark(rgb(239, 68, 68), rgb(220, 53, 69))",
} as const;
