// TODO
import type { NotationOptions, StyleOptions } from "../types.js";

export const buildCssVariables = (
  styleOptions: StyleOptions,
  notationOptions: NotationOptions
): React.CSSProperties => {
  const rgbaToRgb = (rgba: string | undefined, fallback: string): string => {
    if (!rgba) return fallback;
    const noFn = rgba.replace(/rgba?\(([^)]+)\)/, "rgb($1)");
    return noFn.replace(/,\s*[\d.]+\)/, ")") || fallback;
  };

  return {
    "--shiki-border-color": styleOptions.borderColor ?? "#e1e4e8",
    "--shiki-border-radius": styleOptions.borderRadius ?? "6px",
    "--shiki-padding": styleOptions.padding ?? "1rem",
    "--shiki-font-family":
      styleOptions.fontFamily ??
      "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
    "--shiki-font-size": styleOptions.fontSize ?? "14px",
    "--shiki-line-height": styleOptions.lineHeight ?? "1.5",
    "--shiki-line-number-margin-right":
      styleOptions.lineNumberMarginRight ?? "0.5rem",
    "--shiki-notation-highlight-bg":
      notationOptions.highlight?.backgroundColor ?? "rgba(255, 255, 0, 0.1)",
    "--shiki-notation-add-bg":
      notationOptions.add?.backgroundColor ?? "rgba(0, 255, 0, 0.1)",
    "--shiki-notation-remove-bg":
      notationOptions.remove?.backgroundColor ?? "rgba(255, 0, 0, 0.1)",
    "--shiki-notation-highlight-border": rgbaToRgb(
      notationOptions.highlight?.backgroundColor,
      "rgb(234, 179, 8)"
    ),
    "--shiki-notation-add-border": rgbaToRgb(
      notationOptions.add?.backgroundColor,
      "rgb(34, 197, 94)"
    ),
    "--shiki-notation-remove-border": rgbaToRgb(
      notationOptions.remove?.backgroundColor,
      "rgb(239, 68, 68)"
    ),
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
