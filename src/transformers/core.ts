import type { ElementContent } from "hast";
import type { ShikiTransformer } from "shiki/core";
import { isSpecialLang } from "shiki/core";
import type { BundledLanguage, SpecialLanguage } from "shiki/types";
import { getLanguageAlias } from "../utils/langs.js";

type CoreTransformerProps = {
  fileName?: string;
  showLanguageLabel?: boolean;
  showLineNumbers?: boolean;
  language?: BundledLanguage | SpecialLanguage | string;
  startLineNumber?: number;
};

export const createCoreStructureTransformer = ({
  fileName,
  showLineNumbers,
  showLanguageLabel,
  language,
  startLineNumber = 1,
}: CoreTransformerProps): ShikiTransformer => {
  return {
    name: "core-structure",
    line(node, line) {
      const actualLineNumber = line + startLineNumber - 1;
      node.properties = {
        ...node.properties,
        "data-line": String(actualLineNumber),
        class: showLineNumbers ? "line line-numbers" : "line",
      };
      node.tagName = "div";

      // Add line number span element if showing line numbers
      if (showLineNumbers) {
        const lineNumberStyles = [
          "color: light-dark(rgba(0, 0, 0, 0.4), rgba(255, 255, 255, 0.4))",
          "border-right: 1px solid light-dark(rgba(0, 0, 0, 0.1), rgba(255, 255, 255, 0.1))",
          // Background color is now handled via CSS to properly match notations
        ]
          .filter(Boolean)
          .join("; ");

        // TODO: Symbol notation will be supported in a future release
        // Store the symbol if it was set by notation transformer
        // const notationSymbol = node.properties?.["data-notation-symbol"] as
        // 	| string
        // 	| undefined;

        const lineNumberSpan = {
          type: "element" as const,
          tagName: "span",
          properties: {
            class: "line-number",
            "aria-hidden": "true",
            style: lineNumberStyles,
            // TODO: Symbol notation will be supported in a future release
            // ...(notationSymbol
            // 	? { "data-notation-symbol": notationSymbol }
            // 	: {}),
          },
          children: [
            {
              type: "text" as const,
              value: String(actualLineNumber),
            },
          ],
        };

        node.children = [lineNumberSpan, ...(node.children || [])];
      }

      return node;
    },
    code(node) {
      if (showLineNumbers) {
        this.addClassToHast(node, "has-line-numbers");
      }
      return node;
    },
    pre(node) {
      const originalChildren = node.children || [];

      node.tagName = "figure";
      const figureClasses = ["shiki-figure", fileName ? "has-filename" : ""]
        .filter(Boolean)
        .join(" ");

      node.properties = {
        ...node.properties,
        class: figureClasses,
      };

      const figcaptionChildren: ElementContent[] = [];

      const newChildren: ElementContent[] = [];

      figcaptionChildren.push({
        type: "element" as const,
        tagName: "span",
        properties: {
          ...(fileName
            ? {
                class: "filename",
              }
            : {}),
        },
        children: [
          {
            type: "text" as const,
            value: fileName ?? "\u200B", // empty placeholder space if filename is not present
          },
        ],
      });

      if (showLanguageLabel && language && !isSpecialLang(language)) {
        figcaptionChildren.push({
          type: "element" as const,
          tagName: "span",
          properties: {
            class: "language-label",
          },
          children: [
            {
              type: "text" as const,
              value: getLanguageAlias(language),
            },
          ],
        });
      }

      const figcaptionNode = {
        type: "element" as const,
        tagName: "figcaption",
        properties: {
          class: "shiki-caption",
          style: node.properties?.style, // NOTE: make sure we apply the theme styles to the caption part as well
        },
        children: figcaptionChildren,
      };

      newChildren.push(figcaptionNode);

      const preNode = {
        type: "element" as const,
        tagName: "pre",
        properties: {
          ...node.properties,
          class: showLineNumbers ? "shiki-pre has-line-numbers" : "shiki-pre",
          style: node.properties?.style, // Preserve Shiki's theme styles
        },
        children: originalChildren,
      };

      const preWrapper = {
        type: "element" as const,
        tagName: "div",
        properties: {
          class: "shiki-pre-wrapper",
        },
        children: [preNode],
      };

      newChildren.push(preWrapper);

      node.children = newChildren;

      return node;
    },
  };
};
