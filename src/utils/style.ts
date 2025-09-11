import type { NotationOptions, StyleOptions } from "../types.js";
import { DEFAULT_CSS_VARIABLES } from "./defaults.js";

export const buildCssVariables = (
  styleOptions: StyleOptions,
  notationOptions: NotationOptions
): React.CSSProperties => {
  return {
    "--shiki-border-color":
      styleOptions.borderColor ?? DEFAULT_CSS_VARIABLES["--shiki-border-color"],
    "--shiki-border-radius":
      styleOptions.borderRadius ??
      DEFAULT_CSS_VARIABLES["--shiki-border-radius"],
    "--shiki-padding":
      styleOptions.padding ?? DEFAULT_CSS_VARIABLES["--shiki-padding"],
    "--shiki-font-family":
      styleOptions.fontFamily ?? DEFAULT_CSS_VARIABLES["--shiki-font-family"],
    "--shiki-font-size":
      styleOptions.fontSize ?? DEFAULT_CSS_VARIABLES["--shiki-font-size"],
    "--shiki-line-height":
      styleOptions.lineHeight ?? DEFAULT_CSS_VARIABLES["--shiki-line-height"],
    "--shiki-line-number-margin-right":
      styleOptions.lineNumberMarginRight ??
      DEFAULT_CSS_VARIABLES["--shiki-line-number-margin-right"],
    "--shiki-notation-highlight-bg":
      notationOptions.highlight?.backgroundColor ??
      DEFAULT_CSS_VARIABLES["--shiki-notation-highlight-bg"],
    "--shiki-notation-add-bg":
      notationOptions.add?.backgroundColor ??
      DEFAULT_CSS_VARIABLES["--shiki-notation-add-bg"],
    "--shiki-notation-remove-bg":
      notationOptions.remove?.backgroundColor ??
      DEFAULT_CSS_VARIABLES["--shiki-notation-remove-bg"],
    "--shiki-notation-highlight-border":
      notationOptions.highlight?.borderColor ??
      DEFAULT_CSS_VARIABLES["--shiki-notation-highlight-border"],
    "--shiki-notation-add-border":
      notationOptions.add?.borderColor ??
      DEFAULT_CSS_VARIABLES["--shiki-notation-add-border"],
    "--shiki-notation-remove-border":
      notationOptions.remove?.borderColor ??
      DEFAULT_CSS_VARIABLES["--shiki-notation-remove-border"],
    "--shiki-copy-button-bg": styleOptions.copyButton?.backgroundColor,
    "--shiki-copy-button-color": styleOptions.copyButton?.color,
    "--shiki-copy-button-border": styleOptions.copyButton?.borderColor,
    "--shiki-copy-button-hover-bg":
      styleOptions.copyButton?.hoverBackgroundColor,
    "--shiki-copy-button-hover-border":
      styleOptions.copyButton?.hoverBorderColor,
    "--shiki-copy-success-color": styleOptions.copyButton?.successColor,
    "--shiki-copy-success-bg": styleOptions.copyButton?.successBackgroundColor,
    "--shiki-copy-success-border": styleOptions.copyButton?.successBorderColor,
    "--shiki-copy-button-bg-dark": (styleOptions.cssVariables || {})[
      "--shiki-copy-button-bg-dark"
    ],
    "--shiki-copy-button-color-dark": (styleOptions.cssVariables || {})[
      "--shiki-copy-button-color-dark"
    ],
    "--shiki-copy-button-border-dark": (styleOptions.cssVariables || {})[
      "--shiki-copy-button-border-dark"
    ],
    "--shiki-copy-button-hover-bg-dark": (styleOptions.cssVariables || {})[
      "--shiki-copy-button-hover-bg-dark"
    ],
    "--shiki-copy-button-hover-border-dark": (styleOptions.cssVariables || {})[
      "--shiki-copy-button-hover-border-dark"
    ],
    "--shiki-copy-success-color-dark": (styleOptions.cssVariables || {})[
      "--shiki-copy-success-color-dark"
    ],
    "--shiki-copy-success-bg-dark": (styleOptions.cssVariables || {})[
      "--shiki-copy-success-bg-dark"
    ],
    "--shiki-copy-success-border-dark": (styleOptions.cssVariables || {})[
      "--shiki-copy-success-border-dark"
    ],
    ...(styleOptions.cssVariables || {}),
  } as React.CSSProperties;
};
